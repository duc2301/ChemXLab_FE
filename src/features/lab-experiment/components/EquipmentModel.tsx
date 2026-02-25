import { useGLTF } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useFrame, useThree } from "@react-three/fiber";
import {
  RapierRigidBody,
  RigidBody,
  type CollisionEnterPayload,
  type CollisionExitPayload,
} from "@react-three/rapier";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { EQUIPMENT_IDS, getEquipmentById } from "../services/equipmentRegistry";
import type { DroppedItem } from "../types/equipment";

interface EquipmentModelProps {
  droppedItem: DroppedItem;
  tableHeight?: number;
  onDragChange?: (isDragging: boolean) => void;
  onRemove?: (itemId: string) => void;
}

export const EquipmentModel = ({
  droppedItem,
  tableHeight = 0.9,
  onDragChange,
  onRemove: _onRemove,
}: EquipmentModelProps) => {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [colliderEnabled, setColliderEnabled] = useState(true);

  const ignoredCollisions = ["lab-floor", "table-surface", ""];

  const { camera, gl, pointer } = useThree();
  const equipment = getEquipmentById(droppedItem.equipmentId);

  // Raycast setup for dragging on table surface
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const dragPlane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 1, 0), -tableHeight),
    [tableHeight],
  );
  const intersectionPoint = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    if (isDragging && rigidBodyRef.current) {
      raycaster.setFromCamera(pointer, camera);
      raycaster.ray.intersectPlane(dragPlane, intersectionPoint);
      rigidBodyRef.current.setTranslation(intersectionPoint, true);
    }
  });

  const handlePointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();

      // Capture pointer
      const target = e.target as HTMLElement;
      if (target.setPointerCapture) {
        target.setPointerCapture(e.pointerId);
      }

      setIsDragging(true);
      onDragChange?.(true); // Notify parent to disable OrbitControls
      gl.domElement.style.cursor = "grabbing";

      if (rigidBodyRef.current) {
        rigidBodyRef.current.setBodyType(2, true); // kinematicPosition
        rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
        rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
      }
    },
    [gl.domElement, onDragChange],
  );

  // Stop dragging
  const handlePointerUp = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();

      // Release pointer
      const target = e.target as HTMLElement;
      if (target.releasePointerCapture) {
        target.releasePointerCapture(e.pointerId);
      }

      setIsDragging(false);
      onDragChange?.(false); // Notify parent to re-enable OrbitControls
      gl.domElement.style.cursor = isHovered ? "grab" : "auto";

      // Switch back to dynamic physics
      if (rigidBodyRef.current) {
        rigidBodyRef.current.setBodyType(0, true); // dynamic
      }
    },
    [gl.domElement, isHovered, onDragChange],
  );

  // Hover effects
  const handlePointerEnter = useCallback(() => {
    setIsHovered(true);
    if (!isDragging) {
      gl.domElement.style.cursor = "grab";
    }
  }, [gl.domElement, isDragging]);

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    if (!isDragging) {
      gl.domElement.style.cursor = "auto";
    }
  }, [gl.domElement, isDragging]);

  const isNear = (
    nameA: string,
    nameB: string,
    checkedNameA: string,
    checkedNameB: string,
  ) => {
    return (
      (checkedNameA === nameA && checkedNameB === nameB) ||
      (checkedNameA === nameB && checkedNameB === nameA)
    );
  };

  const handleCollisionEnter = useCallback(
    (e: CollisionEnterPayload) => {
      if (
        !e.colliderObject ||
        ignoredCollisions.includes(e.colliderObject?.name || "")
      )
        return;

      if (
        isNear(
          e.colliderObject.name,
          droppedItem.equipmentId,
          EQUIPMENT_IDS.TEST_TUBE,
          EQUIPMENT_IDS.THERMOMETER,
        )
      ) {
        if (rigidBodyRef.current) {
          // Đặt lại vị trí để nhiệt kế nằm trong ống nghiệm
          // issue: not change root position in the state
          // const currentPos = rigidBodyRef.current.translation();
          // rigidBodyRef.current.setTranslation( { x: currentPos.x, y: currentPos.y + 2, z: currentPos.z }, false );

          // Tắt collider và chuyển sang kinematic để không bị dịch chuyển
          setColliderEnabled(false);
          setIsDragging(false);
          setIsHovered(false);
        }
      }
    },
    [droppedItem.equipmentId],
  );

  const handleCollisionExit = useCallback((e: CollisionExitPayload) => {
    // if (ignoredCollisions.includes(e.colliderObject?.name || "")) return;
    // setColliderEnabled(true);
    // if (rigidBodyRef.current) {
    //   rigidBodyRef.current.setBodyType(0, true); // dynamic
    // }
  }, []);

  if (!equipment) {
    console.warn(`Equipment not found: ${droppedItem.equipmentId}`);
    return null;
  }

  const modelScale = equipment.scale || 3;

  return (
    <RigidBody
      ref={rigidBodyRef}
      type={colliderEnabled ? "dynamic" : "fixed"}
      // must be rendered with position in the store
      position={[droppedItem.position[0], tableHeight, droppedItem.position[2]]}
      rotation={droppedItem.rotation}
      colliders={colliderEnabled ? "cuboid" : false}
      name={droppedItem.equipmentId}
      onCollisionEnter={handleCollisionEnter}
      onCollisionExit={handleCollisionExit}
    >
      <group
        scale={[modelScale, modelScale, modelScale]}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <Suspense
          fallback={
            <FallbackBox isHovered={isHovered} isDragging={isDragging} />
          }
        >
          <Model
            modelPath={equipment.modelPath}
            isHovered={isHovered}
            isDragging={isDragging}
            animation={!colliderEnabled}
          />
        </Suspense>
      </group>
    </RigidBody>
  );
};

/**
 * Fallback box while model loads
 */
const FallbackBox = ({
  isHovered,
  isDragging,
}: {
  isHovered: boolean;
  isDragging: boolean;
}) => (
  <mesh>
    <boxGeometry args={[0.1, 0.1, 0.1]} />
    <meshStandardMaterial
      color={isDragging ? "#ffcc00" : isHovered ? "#66aaff" : "#888888"}
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
  isDragging,
  animation,
}: {
  modelPath: string;
  isHovered: boolean;
  isDragging: boolean;
  animation: boolean;
}) => {
  const { scene } = useGLTF(modelPath);
  const armatureRef = useRef<THREE.Object3D | null>(null);
  const [angle, setAngle] = useState(0);
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

  useFrame(() => {
    if (animation && armatureRef.current && angle < THREE.MathUtils.degToRad(10)) {
      const newAngle = Math.min(angle + 0.01, THREE.MathUtils.degToRad(10));
      setAngle(newAngle);
      const pos = armatureRef.current.position.clone();
      const cos = Math.cos(newAngle);
      const sin = Math.sin(newAngle);
      const x = pos.x;
      const y = pos.y;
      const z = pos.z;
      const newX = -x * cos - z * sin;
      const newZ = x * sin + z * cos;
      const newY = y;
      //issue: not change position
      armatureRef.current.position.set(newX, newY, newZ);
      armatureRef.current.rotation.y = newAngle;
    }
  });

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child.name === "Armature") {
        armatureRef.current = child;
      }
    });
  }, [clonedScene]);

  // Apply highlight based on state
  useMemo(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const material = child.material.clone();
        child.material = material;

        if (isDragging) {
          material.emissive = new THREE.Color("#ffaa00");
          material.emissiveIntensity = 0.5;
        } else if (isHovered) {
          material.emissive = new THREE.Color("#4488ff");
          material.emissiveIntensity = 0.25;
        } else {
          material.emissive = new THREE.Color("#000000");
          material.emissiveIntensity = 0;
        }
      }
    });

    // Adjust position of children to align with parent
    clonedScene.children.forEach((child) => {
      child.position.x = clonedScene.position.x;
      child.position.y = clonedScene.position.y + 0.04;
      child.position.z = clonedScene.position.z;

      child.rotateX(clonedScene.rotation.x);
      child.rotateY(clonedScene.rotation.y);
      child.rotateZ(clonedScene.rotation.z);

      child.updateMatrixWorld();
    });
  }, [clonedScene, isHovered, isDragging]);

  return <primitive object={clonedScene} />;
};

// Preload models
useGLTF.preload("/models/150ml-beaker.glb");
useGLTF.preload("/models/250ml-beaker.glb");
useGLTF.preload("/models/500ml-binhtamgiac.glb");
