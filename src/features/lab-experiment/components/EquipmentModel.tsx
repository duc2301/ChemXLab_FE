import { Html, useAnimations, useGLTF } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useFrame, useThree } from "@react-three/fiber";
import {
  CuboidCollider,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import {
  EQUIPMENT_IDS,
  SUBSTANCE_COLORS,
  getEquipmentById,
} from "../services/equipmentRegistry";
import { useExperimentStore } from "../services/experimentStore";
import type { DroppedItem } from "../types/equipment";

// ─── Hằng số snap ────────────────────────────────────────────────────────────
const SNAP_OFFSET_Y = 0.5;
const SNAP_RADIUS = 0.4;
const LAMP_SNAP_OFFSET_Y = 0;

const CG_TEST_TUBE = 0x00010004;
const CG_EQUIPMENT = 0x00030002;

interface EquipmentModelProps {
  droppedItem: DroppedItem;
  tableHeight?: number;
  onDragChange?: (isDragging: boolean) => void;
  onRemove?: (itemId: string) => void;
}

const thermometerRegistry = new Map<string, RapierRigidBody>();
const occupiedThermometers = new Map<string, string>();
const occupiedThermometersByLamp = new Map<string, string>();

export const EquipmentModel = ({
  droppedItem,
  tableHeight = 0.9,
  onDragChange,
}: EquipmentModelProps) => {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const setContextMenu = useExperimentStore((s) => s.setContextMenu);
  const heldSubstance = useExperimentStore((s) => s.heldSubstance);
  const setHeldSubstance = useExperimentStore((s) => s.setHeldSubstance);
  const addSubstanceToTestTube = useExperimentStore((s) => s.addSubstanceToTestTube);
  const testTubeContents = useExperimentStore((s) => s.testTubeContents);
  const alcoholLampStatus = useExperimentStore((s) => s.alcoholLampStatus);
  const isHoldingSubstance = heldSubstance !== null;
  const [showFull, setShowFull] = useState(false);

  // ─── Snap state ────────────────────────────────────────────────────────────
  const isSnappedRef = useRef(false);
  const [isSnapped, setIsSnapped] = useState(false);
  const snappedToBodyRef = useRef<RapierRigidBody | null>(null);
  const snappedToThermoIdRef = useRef<string | null>(null);
  
  // Tránh snap lại ngay lập tức
  const lastUnsnappedThermoIdRef = useRef<string | null>(null); 

  // Animation snap
  const snapAnimRef = useRef<{
    active: boolean;
    startY: number;
    targetY: number;
    snapX: number;
    snapZ: number;
    t: number; 
  } | null>(null);

  const dragOffset = useRef(new THREE.Vector3());
  const activePointerRef = useRef<{ target: HTMLElement; pointerId: number } | null>(null);

  const { gl } = useThree();
  const equipment = getEquipmentById(droppedItem.equipmentId);

  const isTestTube = droppedItem.equipmentId === EQUIPMENT_IDS.TEST_TUBE;
  const isThermometer = droppedItem.equipmentId === EQUIPMENT_IDS.THERMOMETER;
  const isAlcoholLamp = droppedItem.equipmentId === EQUIPMENT_IDS.ALCOHOL_LAMP;
  const isBurning = alcoholLampStatus.get(droppedItem.id) ?? false;

  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const dragPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const intersectionPoint = useMemo(() => new THREE.Vector3(), []);

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
      occupiedThermometers.delete(droppedItem.id);
    };
  }, [isThermometer, droppedItem.id]);

  useEffect(() => {
    return () => {
      if (isSnappedRef.current && snappedToThermoIdRef.current) {
        if (isTestTube) occupiedThermometers.delete(snappedToThermoIdRef.current);
        else if (isAlcoholLamp) occupiedThermometersByLamp.delete(snappedToThermoIdRef.current);
      }
    };
  }, [isTestTube, isAlcoholLamp]);

  useFrame((state) => {
    if (!rigidBodyRef.current) return; 

    // 1. Follow / Animate snap
    if ((isTestTube || isAlcoholLamp) && isSnappedRef.current && snappedToBodyRef.current) {
      try {
        const tp = snappedToBodyRef.current.translation();
        const offset_Y = isTestTube ? SNAP_OFFSET_Y : LAMP_SNAP_OFFSET_Y;
        const finalX = tp.x - 0.0263;
        const finalY = tp.y + offset_Y;
        const finalZ = tp.z + 0.385;

        if (snapAnimRef.current?.active) {
          const anim = snapAnimRef.current;
          anim.t = Math.min(1, anim.t + 0.016 * 1.8);
          const eased = 1 - Math.pow(1 - anim.t, 3);
          const currentY = anim.startY + (finalY - anim.startY) * eased;
          
          rigidBodyRef.current.setTranslation({ x: finalX, y: currentY, z: finalZ }, true);
          if (anim.t >= 1) anim.active = false;
          return;
        }

        rigidBodyRef.current.setTranslation({ x: finalX, y: finalY, z: finalZ }, true);
      } catch {
        if (snappedToThermoIdRef.current) {
          if (isTestTube) occupiedThermometers.delete(snappedToThermoIdRef.current);
          if (isAlcoholLamp) occupiedThermometersByLamp.delete(snappedToThermoIdRef.current);
        }
        isSnappedRef.current = false;
        setIsSnapped(false);
        snappedToBodyRef.current = null;
        snappedToThermoIdRef.current = null;
        snapAnimRef.current = null;
        rigidBodyRef.current.setBodyType(0, true);
      }
      return;
    } 

    // 2. Drag logic
    if (isDragging) {
      raycaster.setFromCamera(state.pointer, state.camera);
      if (raycaster.ray.intersectPlane(dragPlane, intersectionPoint)) {
        intersectionPoint.add(dragOffset.current);

        // Tránh va chạm với các vật đã snap khác
        if ((isTestTube || isAlcoholLamp) && thermometerRegistry.size > 0) {
          const occupationMap = isTestTube ? occupiedThermometers : occupiedThermometersByLamp;
          for (const [thermoId, thermoBody] of thermometerRegistry) {
            if (occupationMap.has(thermoId) && occupationMap.get(thermoId) !== droppedItem.id) {
              const tp = thermoBody.translation();
              const dx = intersectionPoint.x - tp.x;
              const dz = intersectionPoint.z - tp.z;
              const dist2D = Math.sqrt(dx * dx + dz * dz);
              const EDGE_DISTANCE = 0.35; 

              if (dist2D < EDGE_DISTANCE && dist2D > 0) {
                const scale = EDGE_DISTANCE / dist2D;
                intersectionPoint.x = tp.x + dx * scale;
                intersectionPoint.z = tp.z + dz * scale;
              }
            }
          }
        }
        rigidBodyRef.current.setTranslation(intersectionPoint, true);
      } 
      
      // 3. Proximity snap check
      if ((isTestTube || isAlcoholLamp) && !isSnappedRef.current && thermometerRegistry.size > 0) {
        const myPos = rigidBodyRef.current.translation();
        const occupationMap = isTestTube ? occupiedThermometers : occupiedThermometersByLamp;

        for (const [thermoId, thermoBody] of thermometerRegistry) {
          if (occupationMap.has(thermoId) && occupationMap.get(thermoId) !== droppedItem.id) continue;

          const tp = thermoBody.translation();
          const dist = Math.sqrt(Math.pow(myPos.x - tp.x, 2) + Math.pow(myPos.y - tp.y, 2) + Math.pow(myPos.z - tp.z, 2));

          // Chặn snap ngược
          if (lastUnsnappedThermoIdRef.current === thermoId) {
             if (dist > SNAP_RADIUS + 0.1) lastUnsnappedThermoIdRef.current = null;
             else continue;
          }

          if (dist < SNAP_RADIUS) {
            const offset_Y = isTestTube ? SNAP_OFFSET_Y : LAMP_SNAP_OFFSET_Y;
            const finalX = tp.x - 0.0263;
            const finalY = tp.y + offset_Y;
            const finalZ = tp.z + 0.385;
            const liftY = finalY + 0.35;

            rigidBodyRef.current.setTranslation({ x: myPos.x, y: liftY, z: myPos.z }, true);
            rigidBodyRef.current.setBodyType(2, true); 
            rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
            rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);

            snapAnimRef.current = {
              active: true,
              startY: liftY,
              targetY: finalY,
              snapX: finalX,
              snapZ: finalZ,
              t: 0,
            };

            occupationMap.set(thermoId, droppedItem.id);
            snappedToBodyRef.current = thermoBody;
            snappedToThermoIdRef.current = thermoId;
            isSnappedRef.current = true;
            setIsSnapped(true);
            setIsDragging(false);
            onDragChange?.(false);
            gl.domElement.style.cursor = "auto";

            // Reset OrbitControls
            if (activePointerRef.current) {
              const pid = activePointerRef.current.pointerId;
              try { activePointerRef.current.target.releasePointerCapture(pid); } catch {}
              activePointerRef.current = null;
              gl.domElement.dispatchEvent(new PointerEvent("pointerup", { pointerId: pid, bubbles: true }));
            }
            break;
          }
        }
      }
    }
  });

  const handlePointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      if (e.nativeEvent.button === 2) return;

      // DETACH snap: Chỉ detach khi KHÔNG đang cầm chất
      if ((isTestTube || isAlcoholLamp) && isSnappedRef.current && !heldSubstance) {
        if (snappedToThermoIdRef.current) {
          if (isTestTube) occupiedThermometers.delete(snappedToThermoIdRef.current);
          if (isAlcoholLamp) occupiedThermometersByLamp.delete(snappedToThermoIdRef.current);
          
          lastUnsnappedThermoIdRef.current = snappedToThermoIdRef.current;
        }
        isSnappedRef.current = false;
        setIsSnapped(false);
        snappedToBodyRef.current = null;
      }

      const target = e.target as HTMLElement;
      if (target.setPointerCapture) {
        target.setPointerCapture(e.pointerId);
        activePointerRef.current = { target, pointerId: e.pointerId };
      }

      dragPlane.constant = -e.point.y;
      if (rigidBodyRef.current) {
        const currentPos = rigidBodyRef.current.translation();
        dragOffset.current.set(currentPos.x, currentPos.y, currentPos.z).sub(e.point);
        rigidBodyRef.current.setBodyType(2, true); 
      }

      setIsDragging(true);
      onDragChange?.(true);
      gl.domElement.style.cursor = "grabbing";
    },
    [gl.domElement, onDragChange, dragPlane, isTestTube, isAlcoholLamp, heldSubstance]
  );

  const handlePointerUp = useCallback((e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      const target = e.target as HTMLElement;
      if (target.releasePointerCapture) target.releasePointerCapture(e.pointerId);
      activePointerRef.current = null;

      setIsDragging(false);
      onDragChange?.(false);
      gl.domElement.style.cursor = isHovered ? "grab" : "auto";
      lastUnsnappedThermoIdRef.current = null; 

      if (rigidBodyRef.current && !isSnappedRef.current) {
        rigidBodyRef.current.setBodyType(0, true); // Chuyển về Dynamic (0) thay vì Static (1) để trọng lực hoạt động
      }
    },
    [gl.domElement, isHovered, onDragChange]
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

  // ─── Right-click: lưu vào store để ExperimentPopup render menu ───────────
  const handleContextMenu = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      e.nativeEvent.preventDefault();
      setContextMenu({
        x: e.nativeEvent.clientX,
        y: e.nativeEvent.clientY,
        itemId: droppedItem.id,
      });
    },
    [setContextMenu, droppedItem.id],
  );

  // ─── Click: nếu đang cầm bột và click test tube → Đổ bột vào ────────────────
  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      if (!isTestTube || !heldSubstance) return;
      e.stopPropagation();

      const currentContents = testTubeContents.get(droppedItem.id) ?? [];
      // Kiểm tra sức chứa: giới hạn định nghĩa bởi MAX_LAYERS
      if (currentContents.length >= MAX_TUBE_LAYERS) {
        setShowFull(true);
        setTimeout(() => setShowFull(false), 2200);
        return;
      }

      addSubstanceToTestTube(droppedItem.id, heldSubstance.substanceId);
      setHeldSubstance(null);
    },
    [
      isTestTube,
      heldSubstance,
      addSubstanceToTestTube,
      droppedItem.id,
      setHeldSubstance,
      testTubeContents,
    ],
  );

  if (!equipment) {
    console.warn(`Equipment not found: ${droppedItem.equipmentId}`);
    return null;
  }

  const modelScale = equipment.scale || 3;
  const contents = testTubeContents.get(droppedItem.id) ?? [];
  const isFull = contents.length >= MAX_TUBE_LAYERS;

  // Vàng: đang cầm bột; đỏ: đang cầm bột nhưng ống đã đầy
  const isHighlighted = isTestTube && isHoldingSubstance && !isFull;
  const isFullHighlight = isTestTube && isHoldingSubstance && isFull;

  return (
    <RigidBody
      ref={rigidBodyRef}
      type={isSnapped ? "kinematicPosition" : "dynamic"}
      position={[droppedItem.position[0], tableHeight, droppedItem.position[2]]}
      rotation={droppedItem.rotation}
      colliders={isSnapped ? false : "hull"}
      collisionGroups={isTestTube ? CG_TEST_TUBE : CG_EQUIPMENT}
      name={droppedItem.equipmentId}
      gravityScale={isSnapped ? 0 : 1}
      lockRotations={true}
      // THÊM MA SÁT
      angularDamping={9.8} // Lực cản góc xoay
      friction={10} // Ma sát tĩnh/động (giữ vật thể bám chặt lên bàn)
      restitution={0}
    >
      <group
        scale={[modelScale, modelScale, modelScale]}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onContextMenu={handleContextMenu}
        onClick={handleClick}
      >
        <Model
          modelPath={equipment.modelPath}
          isHovered={isHovered}
          isDragging={isDragging}
          isSnapped={isSnapped}
          isHighlighted={isHighlighted}
          isFullHighlight={isFullHighlight}
          isGlass={isTestTube}
          playAnimations={isAlcoholLamp ? isBurning : false}
          isShowFire={isAlcoholLamp ? isBurning : false}
        />

        {/* Lớp bột có animation rơi từ miệng ống xuống đáy */}
        {isTestTube &&
          contents.map((subId, idx) => {
            const layerH = 0.009;
            const tubeBottomY = 0.04;
            const settledY = tubeBottomY + idx * layerH + layerH / 2;
            const color = SUBSTANCE_COLORS[subId] ?? "#e5e7eb";
            return (
              <PowderLayer
                key={`${idx}-${subId}`}
                color={color}
                settledY={settledY}
                layerH={layerH}
                isBottom={idx === 0}
              />
            );
          })}
      </group>

      {/* Nhãn thành phần — chỉ hiện khi hover vào, kích thước cố định */}
      {isTestTube && isHovered && contents.length > 0 && (
        <Html
          position={[0, 0.06, 0]}
          center
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          <div
            style={{
              background: "rgba(15,20,30,0.92)",
              border: "1px solid #374151",
              borderRadius: "5px",
              padding: "3px 7px",
              display: "flex",
              flexDirection: "column",
              gap: "3px",
              width: "56px",
              fontSize: "10px",
              fontFamily: "sans-serif",
              whiteSpace: "nowrap",
            }}
          >
            {contents.map((subId, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  color: SUBSTANCE_COLORS[subId] ?? "#e5e7eb",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: SUBSTANCE_COLORS[subId] ?? "#e5e7eb",
                    flexShrink: 0,
                  }}
                />
                {getEquipmentById(subId)?.name ?? subId}
              </div>
            ))}
          </div>
        </Html>
      )}

      {/* Cảnh báo ống đã đầy */}
      {isTestTube && showFull && (
        <Html
          position={[0, 0.1, 0]}
          center
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          <div
            style={{
              background: "rgba(239,68,68,0.92)",
              color: "#fff",
              borderRadius: "6px",
              padding: "4px 10px",
              fontSize: "11px",
              fontFamily: "sans-serif",
              fontWeight: 600,
              whiteSpace: "nowrap",
              boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
            }}
          >
            ⚠️ Không thể đổ thêm!
          </div>
        </Html>
      )}
    </RigidBody>
  );
};

/**
 * GLTF model with hover/drag highlight
 */
const Model = ({
  modelPath,
  isHovered,
  isDragging,
  isSnapped,
  isHighlighted = false,
  isGlass = false,
  isFullHighlight = false,
  playAnimations = false,
  isShowFire = false,
}: {
  modelPath: string;
  isHovered: boolean;
  isDragging: boolean;
  isSnapped: boolean;
  isHighlighted?: boolean;
  isGlass?: boolean;
  isFullHighlight?: boolean;
  playAnimations?: boolean;
  isShowFire?: boolean;
}) => {
  const { scene, animations } = useGLTF(modelPath);

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

  const { actions } = useAnimations(animations, clonedScene);

  // 3. LOGIC ĐIỀU KHIỂN HIỂN THỊ VÀ ANIMATION LỬA
  useEffect(() => {
    // Điều khiển ẩn hiện mesh lửa
    clonedScene.traverse((child) => {
      if (child.name === "GLB_Flame_V260") {
        child.visible = isShowFire;
      }
    });

    // Điều khiển chạy/dừng animation
    if (isShowFire && playAnimations && actions) {
      Object.values(actions).forEach((action) => {
        if (action) {
          action.reset().fadeIn(0.2).play(); // Thêm fadeIn cho mượt
        }
      });
    } else {
      // Dùng fadeOut hoặc stop khi tắt lửa
      Object.values(actions).forEach((action) => action?.fadeOut(0.2));
      // Nếu muốn dừng hẳn sau khi fadeOut:
      // setTimeout(() => mixer.stopAllAction(), 200);
    }
  }, [isShowFire, playAnimations, actions, clonedScene]);

  // 4. LOGIC XỬ LÝ MATERIAL (Giữ nguyên logic của bạn nhưng tối ưu dependency)
  useEffect(() => {
    clonedScene.traverse((child) => {
      if (!(child instanceof THREE.Mesh) || !child.material) return;
      
      // Bỏ qua mesh lửa không đổi material để tránh lỗi hiển thị lửa
      if (child.name === "GLB_Flame_V260") return;

      const materials = Array.isArray(child.material) ? child.material : [child.material];

      materials.forEach((m) => {
        if ("emissive" in m) {
          const mat = m as THREE.MeshStandardMaterial;
          if (isDragging) {
            mat.emissive.set("#ffaa00");
            mat.emissiveIntensity = 0.5;
          } else if (isFullHighlight) {
            mat.emissive.set("#ef4444");
            mat.emissiveIntensity = 0.55;
          } else if (isHighlighted) {
            mat.emissive.set("#fbbf24");
            mat.emissiveIntensity = 0.6;
          } else if (isSnapped || isHovered) {
             mat.emissive.set(isHovered ? "#4488ff" : "#a0c4e8");
             mat.emissiveIntensity = isHovered ? 0.3 : 0.12;
          } else {
            mat.emissive.set("#a0c4e8");
            mat.emissiveIntensity = 0.12;
          }
        }

        if (isGlass) {
          m.transparent = true;
          m.opacity = 0.35;
          m.depthWrite = false;
        }
      });
    });
  }, [clonedScene, isHovered, isDragging, isSnapped, isHighlighted, isGlass, isFullHighlight]);

  useEffect(() => {
    clonedScene.children.forEach((child) => {
      child.position.y = 0.04;
      child.updateMatrixWorld();
    });
  }, [clonedScene]);

  return <primitive object={clonedScene} />;
};

// Preload models
useGLTF.preload("/models/150ml-beaker.glb");
useGLTF.preload("/models/250ml-beaker.glb");
useGLTF.preload("/models/500ml-binhtamgiac.glb");

// ─── PowderLayer: manual particle physics → fade-to-fill cylinder ────────────
const TUBE_TOP_Y = 0.15;
const TUBE_INNER_R = 0.008;
const PARTICLE_R = 0.0018;
const NUM_PARTICLES = 8;
const GRAVITY = 1.4;
const SETTLE_TIMEOUT = 1.3;

/** Số lớp bột tối đa: giữ khoảng cách an toàn tới mép trên */
const TUBE_BOTTOM_Y = 0.032; // đáy trong lòng ống (model space)
const TUBE_MARGIN = 0.02; // khoảng cách tới mép trên (model space)
const LAYER_H_CONST = 0.009; // = layerH trong render
const MAX_TUBE_LAYERS = Math.floor(
  (TUBE_TOP_Y - TUBE_BOTTOM_Y - TUBE_MARGIN) / LAYER_H_CONST,
);

interface PState {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  settled: boolean;
}

const PowderLayer = ({
  color,
  settledY,
  layerH,
  isBottom,
}: {
  color: string;
  settledY: number;
  layerH: number;
  isBottom: boolean;
}) => {
  const particles = useRef<PState[]>(
    Array.from({ length: NUM_PARTICLES }, (_, i) => {
      const angle = (i / NUM_PARTICLES) * Math.PI * 2 + Math.random() * 0.5;
      const r = Math.random() * TUBE_INNER_R * 0.7;
      return {
        pos: new THREE.Vector3(
          Math.cos(angle) * r,
          TUBE_TOP_Y + i * 0.008,
          Math.sin(angle) * r,
        ),
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.01,
          -0.01,
          (Math.random() - 0.5) * 0.01,
        ),
        settled: false,
      };
    }),
  );

  const elapsed = useRef(0);
  const phaseRef = useRef<"falling" | "done">("falling");
  const pRefs = useRef<(THREE.Mesh | null)[]>(Array(NUM_PARTICLES).fill(null));
  const [isDone, setIsDone] = useState(false);

  useFrame((_, delta) => {
    if (phaseRef.current === "done") return;
    elapsed.current += delta;

    let allSettled = true;
    for (let i = 0; i < NUM_PARTICLES; i++) {
      const p = particles.current[i];
      if (elapsed.current < i * 0.08) {
        allSettled = false;
        continue;
      }
      if (p.settled) continue;
      allSettled = false;

      p.vel.y -= GRAVITY * delta;
      p.pos.x += p.vel.x * delta;
      p.pos.y += p.vel.y * delta;
      p.pos.z += p.vel.z * delta;

      // Va chạm thành ống
      const xzDist = Math.sqrt(p.pos.x * p.pos.x + p.pos.z * p.pos.z);
      const maxR = TUBE_INNER_R - PARTICLE_R;
      if (xzDist > maxR && xzDist > 0) {
        const nx = p.pos.x / xzDist,
          nz = p.pos.z / xzDist;
        p.pos.x = nx * maxR;
        p.pos.z = nz * maxR;
        const dot = p.vel.x * nx + p.vel.z * nz;
        p.vel.x -= 2 * dot * nx * 0.25;
        p.vel.z -= 2 * dot * nz * 0.25;
      }

      // Va chạm đáy
      const groundY = settledY + PARTICLE_R;
      if (p.pos.y <= groundY) {
        p.pos.y = groundY;
        p.vel.x *= 0.2;
        p.vel.z *= 0.2;
        p.vel.y = 0;
        if (Math.hypot(p.vel.x, p.vel.z) < 0.002) p.settled = true;
      }

      if (pRefs.current[i]) {
        pRefs.current[i]!.position.set(p.pos.x, p.pos.y, p.pos.z);
      }
    }

    if (allSettled || elapsed.current > SETTLE_TIMEOUT) {
      phaseRef.current = "done";
      setIsDone(true); // 1 lần re-render duy nhất để swap particles → fill
    }
  });

  return (
    <group>
      {/* Phase 1: hạt bột rơi */}
      {!isDone &&
        particles.current.map((p, i) => (
          <mesh
            key={i}
            ref={(el) => {
              pRefs.current[i] = el;
            }}
            position={[p.pos.x, p.pos.y, p.pos.z]}
          >
            <sphereGeometry args={[PARTICLE_R, 6, 6]} />
            <meshStandardMaterial
              color={color}
              roughness={0.95}
              metalness={0}
            />
          </mesh>
        ))}

      {/* Phase 2: cylinder fill hiện ra khi đã settled */}
      {isDone && (
        <>
          <mesh position={[0, settledY, 0]}>
            <cylinderGeometry args={[TUBE_INNER_R, TUBE_INNER_R, layerH, 16]} />
            <meshStandardMaterial
              color={color}
              roughness={0.95}
              metalness={0}
            />
          </mesh>

          {/* Bán cầu đáy (bottom hemisphere) cho lớp đầu tiên */}
          {isBottom && (
            <mesh position={[0, settledY - layerH / 2, 0]}>
              {/* thetaStart=PI/2 → bán cầu dưới (hướng xuống) */}
              <sphereGeometry
                args={[
                  TUBE_INNER_R,
                  12,
                  8,
                  0,
                  Math.PI * 2,
                  Math.PI / 2,
                  Math.PI / 2,
                ]}
              />
              <meshStandardMaterial
                color={color}
                roughness={0.95}
                metalness={0}
              />
            </mesh>
          )}
        </>
      )}
    </group>
  );
};
