import { useGLTF } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useFrame, useThree } from "@react-three/fiber";
import {
  RapierRigidBody,
  RigidBody,
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

// ─── Hằng số snap ────────────────────────────────────────────────────────────
const SNAP_OFFSET_Y = 0.6;
const SNAP_RADIUS = 0.4; // khoảng cách world để trigger snap

// ─── Collision Groups (Rapier bitmask: upper 16 bits = filter, lower 16 = membership) ─
// GROUP_STATIC (0x0001): bàn, sàn — không đặt tường minh, mặc định 0xFFFF
// GROUP_EQUIPMENT (0x0002): thiết bị thông thường
// GROUP_TESTTUBE  (0x0004): ống nghiệm
//
// test-tube:       membership=0x0004, filter=0x0001 (chỉ va chạm static)  → 0x00010004
// regular equip:   membership=0x0002, filter=0x0003 (static + equipment)    → 0x00030002
// table/floor:     default 0xFFFFFFFF (va chạm với tất cả)
const CG_TEST_TUBE = 0x00010004;
const CG_EQUIPMENT = 0x00030002;

interface EquipmentModelProps {
  droppedItem: DroppedItem;
  tableHeight?: number;
  onDragChange?: (isDragging: boolean) => void;
  onRemove?: (itemId: string) => void;
}

// ─── Module-level registry: nhiệt kế tự đăng ký rigid body của mình ─────────
const thermometerRegistry = new Map<string, RapierRigidBody>();

export const EquipmentModel = ({
  droppedItem,
  tableHeight = 0.9,
  onDragChange,
  onRemove: _onRemove,
}: EquipmentModelProps) => {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // ─── Snap state (chỉ dùng cho test-tube) ─────────────────────────────────
  const isSnappedRef = useRef(false);
  const [isSnapped, setIsSnapped] = useState(false);
  const snappedToBodyRef = useRef<RapierRigidBody | null>(null);

  const dragOffset = useRef(new THREE.Vector3());

  const { gl } = useThree();
  const equipment = getEquipmentById(droppedItem.equipmentId);

  const isTestTube = droppedItem.equipmentId === EQUIPMENT_IDS.TEST_TUBE;
  const isThermometer = droppedItem.equipmentId === EQUIPMENT_IDS.THERMOMETER;

  // Raycast setup for dragging on table surface
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const dragPlane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
    [],
  );
  const intersectionPoint = useMemo(() => new THREE.Vector3(), []);

  // ─── Đăng ký nhiệt kế vào registry ──────────────────────────────────────────
  useEffect(() => {
    if (!isThermometer) return;
    const interval = setInterval(() => {
      if (rigidBodyRef.current) {
        thermometerRegistry.set(droppedItem.id, rigidBodyRef.current);
        clearInterval(interval);
      }
    }, 100);
    return () => {
      clearInterval(interval);
      thermometerRegistry.delete(droppedItem.id);
    };
  }, [isThermometer, droppedItem.id]);

  // ─── useFrame: follow nhiệt kế, drag, và proximity snap check ───────────────
  useFrame((state) => {
    if (!rigidBodyRef.current) return;

    // 1. Follow nhiệt kế khi đang snap
    if (isTestTube && isSnappedRef.current && snappedToBodyRef.current) {
      const tp = snappedToBodyRef.current.translation();
      rigidBodyRef.current.setTranslation(
        { x: tp.x - 0.035, y: tp.y + SNAP_OFFSET_Y, z: tp.z + 0.235 },
        true,
      );
      return;
    }

    // 2. Drag bình thường
    if (isDragging) {
      raycaster.setFromCamera(state.pointer, state.camera);
      if (raycaster.ray.intersectPlane(dragPlane, intersectionPoint)) {
        intersectionPoint.add(dragOffset.current);
        rigidBodyRef.current.setTranslation(intersectionPoint, true);
      }

      // 3. Proximity snap: kiểm tra khoảng cách tới nhiệt kế khi đang kéo
      if (isTestTube && !isSnappedRef.current && thermometerRegistry.size > 0) {
        const myPos = rigidBodyRef.current.translation();
        for (const [, thermoBody] of thermometerRegistry) {
          const tp = thermoBody.translation();
          const dx = myPos.x - tp.x;
          const dy = myPos.y - tp.y;
          const dz = myPos.z - tp.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < SNAP_RADIUS) {
            // Snap ngay lập tức
            rigidBodyRef.current.setTranslation(
              { x: tp.x - 0.04, y: tp.y + SNAP_OFFSET_Y, z: tp.z + 0.235 },
              true,
            );
            rigidBodyRef.current.setBodyType(2, true); // kinematicPosition
            rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
            rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);

            snappedToBodyRef.current = thermoBody;
            isSnappedRef.current = true;
            setIsSnapped(true);
            setIsDragging(false);
            setIsHovered(false);
            onDragChange?.(false);
            gl.domElement.style.cursor = "auto";
            break;
          }
        }
      }
    }
  });

  // ─── Pointer Down: bắt đầu kéo, nếu đang snap thì detach trước ───────────
  const handlePointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();

      // DETACH nếu đang snap
      if (isTestTube && isSnappedRef.current) {
        isSnappedRef.current = false;
        setIsSnapped(false);
        snappedToBodyRef.current = null;
      }

      const target = e.target as HTMLElement;
      if (target.setPointerCapture) {
        target.setPointerCapture(e.pointerId);
      }

      dragPlane.constant = -e.point.y;

      if (rigidBodyRef.current) {
        const currentPos = rigidBodyRef.current.translation();
        dragOffset.current
          .set(currentPos.x, currentPos.y, currentPos.z)
          .sub(e.point);
      }

      setIsDragging(true);
      onDragChange?.(true);
      gl.domElement.style.cursor = "grabbing";

      if (rigidBodyRef.current) {
        rigidBodyRef.current.setBodyType(2, true); // kinematicPosition
        rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
        rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
      }
    },
    [gl.domElement, onDragChange, dragPlane, isTestTube],
  );

  // ─── Pointer Up: dừng kéo ─────────────────────────────────────────────────
  const handlePointerUp = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();

      const target = e.target as HTMLElement;
      if (target.releasePointerCapture) {
        target.releasePointerCapture(e.pointerId);
      }

      setIsDragging(false);
      onDragChange?.(false);
      gl.domElement.style.cursor = isHovered ? "grab" : "auto";

      // Trả về dynamic nếu không đang snap
      if (rigidBodyRef.current && !isSnappedRef.current) {
        rigidBodyRef.current.setBodyType(0, true); // dynamic
      }
    },
    [gl.domElement, isHovered, onDragChange],
  );

  // ─── Hover ────────────────────────────────────────────────────────────────
  const handlePointerEnter = useCallback(() => {
    setIsHovered(true);
    if (!isDragging) {
      gl.domElement.style.cursor = isSnappedRef.current ? "pointer" : "grab";
    }
  }, [gl.domElement, isDragging]);

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    if (!isDragging) gl.domElement.style.cursor = "auto";
  }, [gl.domElement, isDragging]);

  if (!equipment) {
    console.warn(`Equipment not found: ${droppedItem.equipmentId}`);
    return null;
  }

  const modelScale = equipment.scale || 3;

  return (
    <RigidBody
      ref={rigidBodyRef}
      type={isSnapped ? "kinematicPosition" : "dynamic"}
      position={[droppedItem.position[0], tableHeight, droppedItem.position[2]]}
      rotation={droppedItem.rotation}
      // Khi snap: tắt collider hoàn toàn (ống nghiệm "nổi" theo nhiệt kế)
      colliders={isSnapped ? false : "cuboid"}
      // Collision Groups: test-tube chỉ va chạm với bàn/sàn (group 0x0001)
      // thiết bị khác va chạm với bàn/sàn + nhau (group 0x0001 | 0x0002)
      collisionGroups={isTestTube ? CG_TEST_TUBE : CG_EQUIPMENT}
      name={droppedItem.equipmentId}
      gravityScale={isSnapped ? 0 : 1}
      // Luôn đứng thẳng: khóa rotation để không bị ngã
      lockRotations={true}
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
            isSnapped={isSnapped}
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
  isSnapped,
}: {
  modelPath: string;
  isHovered: boolean;
  isDragging: boolean;
  isSnapped: boolean;
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
    if (isSnapped && armatureRef.current && angle < THREE.MathUtils.degToRad(10)) {
      const newAngle = Math.min(angle - 0.01, THREE.MathUtils.degToRad(10));
      setAngle(newAngle);
      const pos = armatureRef.current.position.clone();
      const cos = Math.cos(newAngle);
      const sin = Math.sin(newAngle);
      armatureRef.current.position.set(
        -pos.x * cos - pos.z * sin,
        pos.y,
        pos.x * sin + pos.z * cos,
      );
      armatureRef.current.rotation.y = newAngle;
    }
  });

  useEffect(() => {
    clonedScene.traverse((child) => {

      if (child.name === "Armature") {
        console.log(child);

        armatureRef.current = child;
      }
    });
  }, [clonedScene]);

  useMemo(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const material = child.material.clone();
        child.material = material;

        if (isDragging) {
          material.emissive = new THREE.Color("#ffaa00");
          material.emissiveIntensity = 0.5;
        } else if (isSnapped) {
          material.emissive = new THREE.Color("#00ff88");
          material.emissiveIntensity = 0.25;
        } else if (isHovered) {
          material.emissive = new THREE.Color("#4488ff");
          material.emissiveIntensity = 0.3;
        } else {
          material.emissive = new THREE.Color("#a0c4e8");
          material.emissiveIntensity = 0.12;
        }
      }
    });

    clonedScene.children.forEach((child) => {
      child.position.x = clonedScene.position.x;
      child.position.y = clonedScene.position.y + 0.04;
      child.position.z = clonedScene.position.z;
      child.rotateX(clonedScene.rotation.x);
      child.rotateY(clonedScene.rotation.y);
      child.rotateZ(clonedScene.rotation.z);
      child.updateMatrixWorld();
    });
  }, [clonedScene, isHovered, isDragging, isSnapped]);

  return <primitive object={clonedScene} />;
};

// Preload models
useGLTF.preload("/models/150ml-beaker.glb");
useGLTF.preload("/models/250ml-beaker.glb");
useGLTF.preload("/models/500ml-binhtamgiac.glb");
