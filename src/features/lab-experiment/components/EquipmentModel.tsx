import { useGLTF } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import { useFrame, useThree } from '@react-three/fiber';
import { RapierRigidBody, RigidBody } from '@react-three/rapier';
import { Suspense, useCallback, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { getEquipmentById } from '../services/equipmentRegistry';
import type { DroppedItem } from '../types/equipment';

interface EquipmentModelProps {
  droppedItem: DroppedItem;
  tableHeight?: number;
  onDragChange?: (isDragging: boolean) => void;
  onRemove?: (itemId: string) => void;
}

// Note: Objects can now move freely without bounds

/**
 * 3D Equipment Model with drag-on-table functionality
 * 
 * - Click + drag để kéo trên mặt bàn
 * - Raycast từ camera đến plane ngang tại tableHeight
 * - Physics pause khi drag, resume khi thả
 */
export const EquipmentModel = ({
  droppedItem,
  tableHeight = 0.9,
  onDragChange,
  onRemove: _onRemove
}: EquipmentModelProps) => {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { camera, gl, pointer } = useThree();
  const equipment = getEquipmentById(droppedItem.equipmentId);

  // Raycast setup for dragging on table surface
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const dragPlane = useMemo(() =>
    new THREE.Plane(new THREE.Vector3(0, 1, 0), -tableHeight),
    [tableHeight]
  );
  const intersectionPoint = useMemo(() => new THREE.Vector3(), []);

  // Update position every frame while dragging
  useFrame(() => {
    if (!isDragging || !rigidBodyRef.current) return;

    // Raycast from camera through mouse
    raycaster.setFromCamera(pointer, camera);

    // Find intersection with table surface plane
    const hasIntersection = raycaster.ray.intersectPlane(dragPlane, intersectionPoint);

    if (hasIntersection) {
      // No limits - objects can move freely
      const newX = intersectionPoint.x;
      const newZ = intersectionPoint.z;

      // Update rigid body position (on table surface)
      rigidBodyRef.current.setTranslation(
        { x: newX, y: tableHeight, z: newZ },
        true
      );

      // Zero out velocities
      rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }
  });

  // Start dragging
  const handlePointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();

    // Capture pointer
    const target = e.target as HTMLElement;
    if (target.setPointerCapture) {
      target.setPointerCapture(e.pointerId);
    }

    setIsDragging(true);
    onDragChange?.(true); // Notify parent to disable OrbitControls
    gl.domElement.style.cursor = 'grabbing';

    // Switch to kinematic (disable physics)
    if (rigidBodyRef.current) {
      rigidBodyRef.current.setBodyType(2, true); // kinematicPosition
      rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }
  }, [gl.domElement, onDragChange]);

  // Stop dragging
  const handlePointerUp = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();

    // Release pointer
    const target = e.target as HTMLElement;
    if (target.releasePointerCapture) {
      target.releasePointerCapture(e.pointerId);
    }

    setIsDragging(false);
    onDragChange?.(false); // Notify parent to re-enable OrbitControls
    gl.domElement.style.cursor = isHovered ? 'grab' : 'auto';

    // Switch back to dynamic physics
    if (rigidBodyRef.current) {
      rigidBodyRef.current.setBodyType(0, true); // dynamic
    }
  }, [gl.domElement, isHovered, onDragChange]);

  // Hover effects
  const handlePointerEnter = useCallback(() => {
    setIsHovered(true);
    if (!isDragging) {
      gl.domElement.style.cursor = 'grab';
    }
  }, [gl.domElement, isDragging]);

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    if (!isDragging) {
      gl.domElement.style.cursor = 'auto';
    }
  }, [gl.domElement, isDragging]);

  if (!equipment) {
    console.warn(`Equipment not found: ${droppedItem.equipmentId}`);
    return null;
  }

  const modelScale = equipment.scale || 3;

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="dynamic"
      position={[
        droppedItem.position[0],
        tableHeight, // On table surface
        droppedItem.position[2]
      ]}
      rotation={droppedItem.rotation}
      mass={equipment.mass || 0.5}
      colliders="cuboid"
      restitution={0.01}
      friction={0.99}
      linearDamping={0.95}
      angularDamping={0.98}
    >
      <group
        scale={[modelScale, modelScale, modelScale]}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <Suspense fallback={<FallbackBox isHovered={isHovered} isDragging={isDragging} />}>
          <Model
            modelPath={equipment.modelPath}
            isHovered={isHovered}
            isDragging={isDragging}
          />
        </Suspense>
      </group>
    </RigidBody>
  );
};

/**
 * Fallback box while model loads
 */
const FallbackBox = ({ isHovered, isDragging }: { isHovered: boolean; isDragging: boolean }) => (
  <mesh>
    <boxGeometry args={[0.1, 0.1, 0.1]} />
    <meshStandardMaterial
      color={isDragging ? '#ffcc00' : isHovered ? '#66aaff' : '#888888'}
      transparent
      opacity={0.8}
    />
  </mesh>
);

/**
 * GLTF model with hover/drag highlight
 */
const Model = ({
  modelPath,
  isHovered,
  isDragging
}: {
  modelPath: string;
  isHovered: boolean;
  isDragging: boolean;
}) => {
  const { scene } = useGLTF(modelPath);

  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  // Apply highlight based on state
  useMemo(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const material = child.material.clone();
        child.material = material;

        if (isDragging) {
          material.emissive = new THREE.Color('#ffaa00');
          material.emissiveIntensity = 0.5;
        } else if (isHovered) {
          material.emissive = new THREE.Color('#4488ff');
          material.emissiveIntensity = 0.25;
        } else {
          material.emissive = new THREE.Color('#000000');
          material.emissiveIntensity = 0;
        }
      }
    });
  }, [clonedScene, isHovered, isDragging]);

  return <primitive object={clonedScene} />;
};

// Preload models
useGLTF.preload('/models/150ml-beaker.glb');
useGLTF.preload('/models/250ml-beaker.glb');
useGLTF.preload('/models/500ml-binhtamgiac.glb');
