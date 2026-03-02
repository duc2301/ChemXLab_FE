import { Html, useAnimations, useGLTF } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useFrame, useThree } from "@react-three/fiber";
import {
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
import type { TubeContent } from "../services/experimentStore";
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
  const stirredTubes = useExperimentStore((s) => s.stirredTubes);
  const alcoholLampStatus = useExperimentStore((s) => s.alcoholLampStatus);
  const isHoldingSubstance = heldSubstance !== null;
  const [showFull, setShowFull] = useState(false);

  // ─── Snap state ────────────────────────────────────────────────────────────
  const isSnappedRef = useRef(false);
  const [isSnapped, setIsSnapped] = useState(false);
  const snappedToBodyRef = useRef<RapierRigidBody | null>(null);
  const snappedToThermoIdRef = useRef<string | null>(null);
  const reactionProgressStore = useExperimentStore((s) => s.reactionProgress);
  const currentProgress = reactionProgressStore.get(droppedItem.id) ?? 0;

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

  // ─── Chemical Reaction Logic (Fe + S) ───────────────────────────────────────
  useEffect(() => {
    if (!isTestTube) return;
    const interval = setInterval(() => {
      if (!isSnappedRef.current || !snappedToThermoIdRef.current) return;
      const thermoId = snappedToThermoIdRef.current;

      const lampId = occupiedThermometersByLamp.get(thermoId);
      if (!lampId) return;

      const state = useExperimentStore.getState();
      if (!state.alcoholLampStatus.get(lampId)) return;

      const currentContents = state.testTubeContents.get(droppedItem.id) ?? [];
      const hasFe = currentContents.some(c => c.substanceId === EQUIPMENT_IDS.FE_POWDER);
      const hasS = currentContents.some(c => c.substanceId === EQUIPMENT_IDS.S_POWDER);

      if (hasFe && hasS) {
        const progress = state.reactionProgress.get(droppedItem.id) ?? 0;
        if (progress < 1) {
          state.updateReactionProgress(droppedItem.id, 0.5 / 30); // 30 seconds to complete
        } else {
          state.finishReaction(droppedItem.id, EQUIPMENT_IDS.FES_POWDER);
        }
      }
    }, 500);
    return () => clearInterval(interval);
  }, [isTestTube, droppedItem.id]);

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
              try { activePointerRef.current.target.releasePointerCapture(pid); } catch { }
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
      const getGrams = (arr: TubeContent[]) => arr.reduce((acc, c) => acc + c.amount, 0);
      const remainingCapacity = MAX_TUBE_LAYERS - getGrams(currentContents);

      // Kiểm tra sức chứa: giới hạn định nghĩa bởi MAX_LAYERS
      if (remainingCapacity <= 0) {
        setShowFull(true);
        setTimeout(() => setShowFull(false), 2200);
        return;
      }

      const addAmount = Math.min(heldSubstance.amount || 1, remainingCapacity);
      addSubstanceToTestTube(droppedItem.id, heldSubstance.substanceId, addAmount);
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
  const getGrams = (arr: TubeContent[]) => arr.reduce((acc, c) => acc + c.amount, 0);
  const totalGrams = getGrams(contents);
  const isFull = totalGrams >= MAX_TUBE_LAYERS;

  // Vàng: đang cầm bột; đỏ: đang cầm bột nhưng ống đã đầy
  const isHighlighted = isTestTube && isHoldingSubstance && !isFull;
  const isFullHighlight = isTestTube && isHoldingSubstance && isFull;

  const activeLampId = isTestTube && isSnappedRef.current && snappedToThermoIdRef.current
    ? occupiedThermometersByLamp.get(snappedToThermoIdRef.current)
    : null;
  const isHeating = !!activeLampId && !!alcoholLampStatus.get(activeLampId);

  // ─── Stir state ─────────────────────────────────────────────────────────────
  const stirredCount = isTestTube ? (stirredTubes[droppedItem.id] ?? 0) : 0;
  const isStirred = stirredCount > 0;

  const mixedContents = contents.slice(0, stirredCount);
  const unmixedContents = contents.slice(stirredCount);

  // Blend all unique powder colors into a single mixed color (chỉ phần đã khuấy)
  const blendedColor = (() => {
    if (mixedContents.length === 0) return "#e5e7eb";
    const uniqueIds = [...new Set(mixedContents.map(c => c.substanceId))];
    const base = new THREE.Color(SUBSTANCE_COLORS[uniqueIds[0]] ?? "#e5e7eb");
    for (let i = 1; i < uniqueIds.length; i++) {
      base.lerp(new THREE.Color(SUBSTANCE_COLORS[uniqueIds[i]] ?? "#e5e7eb"), 0.5);
    }
    return `#${base.getHexString()}`;
  })();

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
          reactionProgress={isTestTube ? currentProgress : 0}
        />

        {/* Sau khi khuấy: hạt bột pha trộn của các layer đã khuấy */}
        {isTestTube && isStirred && mixedContents.length > 0 && (
          <StirredLayer
            key={`stirred-${mixedContents.length}`}
            items={mixedContents}
            totalGrams={getGrams(mixedContents)}
            reactionProgress={currentProgress}
          />
        )}

        {/* Lớp bột mới thêm vào (chưa khuấy) nằm đè lên trên */}
        {isTestTube && unmixedContents.map((item, idx) => {
          const color = SUBSTANCE_COLORS[item.substanceId] ?? "#e5e7eb";
          return (
            <PowderLayer
              key={`${stirredCount + idx}-${item.substanceId}`}
              color={color}
              startGrams={getGrams(contents.slice(0, stirredCount + idx))}
              amountGrams={item.amount}
              totalGrams={totalGrams}
              reactionProgress={currentProgress}
              spawnInstant={item.instant}
            />
          );
        })}

        {/* Lớp khói đen */}
        {isTestTube && (
          <SmokeEmitter
            active={currentProgress >= 0.2 && isHeating}
            totalGrams={totalGrams}
          />
        )}
      </group>

      {/* Nhãn thành phần — chỉ hiện khi hover vào, kích thước cố định */}
      {isTestTube && isHovered && contents.length > 0 && (
        <Html
          position={[0, 0.06, 0]}
          center
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          <div style={{
            background: "rgba(15,20,30,0.92)",
            border: `1px solid ${isStirred ? "#7c3aed" : "#374151"}`,
            borderRadius: "5px",
            padding: "4px 8px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            minWidth: "70px",
            width: "max-content",
            fontSize: "10px",
            fontFamily: "sans-serif",
            whiteSpace: "nowrap",
          }}>
            {isStirred && (
              <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#e5e7eb", borderBottom: "1px dashed #4b5563", paddingBottom: "2px", marginBottom: "1px", fontWeight: 500 }}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: blendedColor, flexShrink: 0,
                }} />
                Hỗn hợp ({totalGrams.toFixed(1)}g)
              </div>
            )}
            {/* Hiển thị chi tiết TẤT CẢ các thành phần có trong ống */}
            {(() => {
              const grouped = new Map<string, number>();
              contents.forEach(c => {
                grouped.set(c.substanceId, (grouped.get(c.substanceId) ?? 0) + c.amount);
              });
              return Array.from(grouped.entries()).map(([subId, amount], i) => (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  color: "#d1d5db",
                  paddingLeft: isStirred ? "8px" : "0", // Thụt lề nhẹ nếu nằm dưới chữ "Hỗn hợp"
                }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: SUBSTANCE_COLORS[subId] ?? "#e5e7eb",
                    flexShrink: 0,
                  }} />
                  {getEquipmentById(subId)?.name ?? subId} ({amount.toFixed(1)}g)
                </div>
              ));
            })()}
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
  reactionProgress = 0,
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
  reactionProgress?: number;
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
    clonedScene.children.forEach((child) => {
      child.position.x = clonedScene.position.x;
      child.position.y = clonedScene.position.y + 0.04;
      child.position.z = clonedScene.position.z;
      child.rotateX(clonedScene.rotation.x);
      child.rotateY(clonedScene.rotation.y);
      child.rotateZ(clonedScene.rotation.z);
      child.updateMatrixWorld();
    });
  }, [clonedScene, isHovered, isDragging, isSnapped, isHighlighted, isGlass, isFullHighlight, reactionProgress]);

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

/** Số lớp bột tối đa: giữ khoảng cách an toàn tới mép trên */
const TUBE_BOTTOM_Y = 0.032; // đáy trong lòng ống (model space)
const TUBE_MARGIN = 0.02;  // khoảng cách tới mép trên (model space)
const LAYER_H_CONST = 0.003; // = layerH trong render
const MAX_TUBE_LAYERS = Math.floor((TUBE_TOP_Y - TUBE_BOTTOM_Y - TUBE_MARGIN) / LAYER_H_CONST);

interface SDropLayerGrain {
  startY: number;
  targetPos: THREE.Vector3;
  color: string;
  delay: number;
  currentY: number;
  velY: number;
  settled: boolean;
}

// ─── Shared Particle Generation Logic ─────────────────────────────────────────
const STIR_GRAIN_R = 0.00015;

const GRAINS_PER_GRAM = 5000;

/** Build exactly `totalCount` packed positions filling the tube from the bottom up. */
function buildPackedPositions(
  tubeR: number,
  grainR: number,
  floorY: number,
  totalCount: number,
): THREE.Vector3[] {
  const positions: THREE.Vector3[] = [];
  const grainD = grainR * 2;

  let y = 0;
  while (positions.length < totalCount) {
    let r_max = tubeR;
    // Tự động thu hẹp bán kính nếu nằm ở phần đáy bán cầu
    if (y < tubeR) {
      const dy = y - tubeR;
      const r2 = tubeR * tubeR - dy * dy;
      r_max = r2 > 0 ? Math.sqrt(r2) : 0;
    }

    // safe margin from wall
    const usableR = r_max - grainR * 0.8;

    if (usableR >= 0) {
      // Center grain
      positions.push(new THREE.Vector3(
        (Math.random() - 0.5) * grainR * 0.3,
        floorY + y + (Math.random() - 0.5) * grainR * 0.1,
        (Math.random() - 0.5) * grainR * 0.3,
      ));
      if (positions.length >= totalCount) break;

      let ringR = grainD;
      while (ringR <= usableR) {
        const circumference = 2 * Math.PI * ringR;
        const nGrains = Math.max(1, Math.floor(circumference / (grainD * 0.95)));
        const angleStep = (2 * Math.PI) / nGrains;
        const angleOffset = Math.random() * angleStep;

        for (let j = 0; j < nGrains; j++) {
          const a = angleOffset + j * angleStep + (Math.random() - 0.5) * angleStep * 0.2;
          const rr = ringR + (Math.random() - 0.5) * grainR * 0.1;
          const actualR = Math.min(rr, usableR);

          positions.push(new THREE.Vector3(
            Math.cos(a) * actualR,
            floorY + y + (Math.random() - 0.5) * grainR * 0.2, // slight height variation
            Math.sin(a) * actualR,
          ));
          if (positions.length >= totalCount) break;
        }
        if (positions.length >= totalCount) break;
        ringR += grainD * 0.95;
      }
    }
    y += grainD * 0.85; // overlap vertically to pack tightly
  }
  return positions;
}

// ─── PowderLayer: Real falling particles for individual layers ─────────

interface SDropLayerGrain {
  startY: number;
  targetPos: THREE.Vector3;
  color: string;
  delay: number;
  currentY: number;
  velY: number;
  settled: boolean;
  isReacted?: boolean;
}

const _reactedColor = new THREE.Color("#2d2d2d");

const PowderLayer = ({
  color, startGrams, amountGrams, totalGrams, reactionProgress = 0, spawnInstant = false
}: {
  color: string; startGrams: number; amountGrams: number; totalGrams: number; reactionProgress?: number; spawnInstant?: boolean;
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const grainRef = useRef<SDropLayerGrain[] | null>(null);
  const elapsed = useRef(0);
  const doneRef = useRef(false);

  // ── Lazy-init: compute once on mount ──────────────────────────────────────
  if (grainRef.current === null) {
    const FLOOR_Y = 0.032 + STIR_GRAIN_R;
    const totalGrains = Math.round(totalGrams * GRAINS_PER_GRAM);

    // Build entire test tube up to current ALL layers capacity!
    // Since buildPackedPositions is deterministic, calling it with totalGrains yields the exact same array layout.
    // So layer 0 gets positions 0-999, layer 1 gets 1000-1999 exactly above layer 0.
    const targets = buildPackedPositions(TUBE_INNER_R, STIR_GRAIN_R, FLOOR_Y, Math.max(0, totalGrains));

    // Slice only this layer's grains
    const startIndex = Math.round(startGrams * GRAINS_PER_GRAM);
    const endIndex = Math.round((startGrams + amountGrams) * GRAINS_PER_GRAM);
    const layerTargets = targets.slice(startIndex, endIndex);

    // Compute bounds for delay mapping
    let minY = Infinity, maxY = -Infinity;
    layerTargets.forEach(t => {
      if (t.y < minY) minY = t.y;
      if (t.y > maxY) maxY = t.y;
    });
    const layerHeight = maxY - minY || 0.01;

    grainRef.current = layerTargets.map((t) => {
      // Tính toán delay rơi hạt: Hạt nằm dưới rơi trước, hạt nằm trên rơi sau
      const heightFrac = Math.max(0, Math.min(1, (t.y - minY) / layerHeight));

      return {
        startY: spawnInstant ? t.y : TUBE_TOP_Y + 0.02 + Math.random() * 0.02,
        targetPos: t,
        color: color,
        delay: spawnInstant ? 0 : heightFrac * 0.5 + Math.random() * 0.1, // sequential pour delay
        currentY: spawnInstant ? t.y : TUBE_TOP_Y + 0.02 + Math.random() * 0.02,
        velY: spawnInstant ? 0 : -(Math.random() * 0.1 + 0.05),
        settled: spawnInstant,
        isReacted: spawnInstant ? true : false,
      };
    });
  }

  // Set initial colors and matrices once on mount
  useEffect(() => {
    if (!meshRef.current || !grainRef.current) return;
    grainRef.current.forEach((g, i) => {
      _dummyColor.set(g.color);
      meshRef.current!.setColorAt(i, _dummyColor);

      // Hide grains initially by scaling to 0, until their delay ends
      _dummyObj.position.set(g.targetPos.x, g.startY, g.targetPos.z);
      _dummyObj.scale.set(0, 0, 0);
      _dummyObj.updateMatrix();
      meshRef.current!.setMatrixAt(i, _dummyObj.matrix);
    });
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame((_, delta) => {
    if (doneRef.current || !meshRef.current) return;
    elapsed.current += delta;
    const grains = grainRef.current!;
    let allDone = true;
    let needsUpdate = false;

    // Use a capped delta in case of huge frame drops
    const dt = Math.min(delta, 0.03);

    // Glow logic
    let glowIntensity = 0;
    if (reactionProgress > 0.05 && reactionProgress < 0.2) {
      glowIntensity = (reactionProgress - 0.05) / 0.15;
    } else if (reactionProgress >= 0.2 && reactionProgress <= 0.833) {
      glowIntensity = 1;
    } else if (reactionProgress > 0.833 && reactionProgress < 1.0) {
      glowIntensity = 1 - (reactionProgress - 0.833) / (1 - 0.833);
    }

    if (materialRef.current) {
      // Use a slightly deeper red/orange to avoid pinkish tint on grey
      materialRef.current.emissive.set("#ff1100");
      materialRef.current.emissiveIntensity = glowIntensity * 1.5;
    }

    const wobbleActive = reactionProgress > 0.333 && reactionProgress < 0.833;
    const fractionalProgress = Math.max(0, Math.min(1, (reactionProgress - 0.166) / (0.833 - 0.166)));
    const totalGrains = Math.round(totalGrams * GRAINS_PER_GRAM);

    for (let i = 0; i < grains.length; i++) {
      const g = grains[i];
      if (elapsed.current < g.delay) { allDone = false; continue; }
      if (!g.settled) allDone = false;

      // Gravity
      if (!g.settled) {
        needsUpdate = true;
        g.velY -= 3.5 * dt; // stronger gravity in model-space
        g.currentY += g.velY * dt;

        // Floor collision at target Y
        const targetY = g.targetPos.y;
        if (g.currentY <= targetY) {
          g.currentY = targetY;
          g.velY = Math.abs(g.velY) * 0.2; // very small bounce
          if (g.velY < 0.005) {
            g.currentY = targetY;
            g.velY = 0;
            g.settled = true;
          }
        }
      }

      // Wobble effect: lighter, more random localized bubbling
      let wobbleX = 0, wobbleY = 0, wobbleZ = 0;
      if (g.settled && wobbleActive) {
        const speedMultiplier = 12 + (i % 5); // randomize speed per particle
        const tParam = elapsed.current * speedMultiplier + (i * 0.1); // randomize phase

        wobbleX = Math.sin(tParam) * 0.0001;
        wobbleZ = Math.cos(tParam * 1.3) * 0.0001;
        wobbleY = Math.sin(tParam * 2.0) * 0.00015; // mostly vertical bubbling
        needsUpdate = true;
      }

      // Update instance matrix
      _dummyObj.position.set(g.targetPos.x + wobbleX, g.currentY + wobbleY, g.targetPos.z + wobbleZ);
      // Phóng to hạt 3.5 lần khi đang rơi để dễ nhìn hơn, thu về kích thước chuẩn khi đã chạm vị trí
      const s = g.settled ? 1 : 2;
      _dummyObj.scale.set(s, s, s);
      _dummyObj.updateMatrix();
      meshRef.current.setMatrixAt(i, _dummyObj.matrix);

      // Update color based on reaction progress
      const globalIndex = Math.round(startGrams * GRAINS_PER_GRAM) + i;
      const isReacted = (globalIndex / totalGrains) <= fractionalProgress;

      if (g.isReacted !== isReacted) {
        g.isReacted = isReacted;
        const targetColor = isReacted ? _reactedColor : new THREE.Color(color);
        meshRef.current.setColorAt(i, targetColor);
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
      }
    }

    if (needsUpdate || wobbleActive) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
    if (allDone && reactionProgress >= 1) doneRef.current = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, grainRef.current!.length]} frustumCulled={false}>
      <sphereGeometry args={[STIR_GRAIN_R, 6, 6]} />
      <meshStandardMaterial ref={materialRef} roughness={0.85} metalness={0.05} />
    </instancedMesh>
  );
};

// ─── StirredLayer: grains fall from tube mouth and pack at the bottom ─────────

interface SGrain {
  basePos: THREE.Vector3; // original settled position
  color: string;
  phaseX: number;
  phaseZ: number;
  speed: number;
  radius: number; // swirl orbit radius
  isReacted?: boolean;
}

const _dummyObj = new THREE.Object3D();
const _dummyColor = new THREE.Color();

const StirredLayer = ({
  items,
  totalGrams,
  reactionProgress = 0,
}: {
  items: TubeContent[];
  totalGrams: number;
  reactionProgress?: number;
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const grainRef = useRef<SGrain[] | null>(null);
  const FLOOR_Y = 0.032 + STIR_GRAIN_R; // visual inner bottom of tube (+ particle radius)

  // ── Lazy-init: compute once on mount ──────────────────────────────────────
  if (grainRef.current === null) {
    const totalGrains = Math.round(totalGrams * GRAINS_PER_GRAM);

    const targets = buildPackedPositions(TUBE_INNER_R, STIR_GRAIN_R, FLOOR_Y, Math.max(0, totalGrains));

    const colorsArray: string[] = [];
    items.forEach(c => {
      const g = Math.round(c.amount * GRAINS_PER_GRAM);
      const col = SUBSTANCE_COLORS[c.substanceId] ?? "#e5e7eb";
      for (let i = 0; i < g; i++) colorsArray.push(col);
    });
    // Fallback if rounding causes colorsArray to be slightly shorter than targets
    while (colorsArray.length < targets.length && items.length > 0) {
      colorsArray.push(SUBSTANCE_COLORS[items[items.length - 1].substanceId] ?? "#e5e7eb");
    }
    // Shuffle the array perfectly using Fisher-Yates
    for (let i = colorsArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [colorsArray[i], colorsArray[j]] = [colorsArray[j], colorsArray[i]];
    }

    grainRef.current = targets.map((t, i) => {
      return {
        basePos: t,
        color: colorsArray[i] || "#e5e7eb",
        phaseX: Math.random() * Math.PI * 2,
        phaseZ: Math.random() * Math.PI * 2,
        speed: 1.5 + Math.random() * 2, // swirl speed mod
        radius: Math.random() * 0.0003, // small swirling radius offset
      };
    });
  }

  // Set initial colors and matrices once on mount
  useEffect(() => {
    if (!meshRef.current || !grainRef.current) return;
    grainRef.current.forEach((g, i) => {
      _dummyColor.set(g.color);
      meshRef.current!.setColorAt(i, _dummyColor);

      // Place grains at their target directly
      _dummyObj.position.copy(g.basePos);
      _dummyObj.scale.set(1, 1, 1);
      _dummyObj.updateMatrix();
      meshRef.current!.setMatrixAt(i, _dummyObj.matrix);
    });
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  const elapsed = useRef(0);
  const doneRef = useRef(false);
  const STIR_DURATION = 1.8; // seconds to stir before settling

  useFrame((state, delta) => {
    if ((doneRef.current && reactionProgress <= 0) || !meshRef.current) return;
    elapsed.current += delta;

    // Calculate how intense the stirring is (1.0 = max, 0.0 = stopped)
    // Fade out smoothly using a simple polynomial decay
    let intensity = 1.0;
    if (elapsed.current > STIR_DURATION) {
      if (elapsed.current > STIR_DURATION + 0.5) {
        intensity = 0;
        doneRef.current = true;
      } else {
        const t = (elapsed.current - STIR_DURATION) / 0.5; // 0 to 1
        intensity = 1.0 - (t * t * (3 - 2 * t)); // smoothstep
      }
    }

    // Glow logic
    let glowIntensity = 0;
    if (reactionProgress > 0.05 && reactionProgress < 0.2) {
      glowIntensity = (reactionProgress - 0.05) / 0.15;
    } else if (reactionProgress >= 0.2 && reactionProgress <= 0.833) {
      glowIntensity = 1;
    } else if (reactionProgress > 0.833 && reactionProgress < 1.0) {
      glowIntensity = 1 - (reactionProgress - 0.833) / (1 - 0.833);
    }

    if (materialRef.current) {
      materialRef.current.emissive.set("#ff1100");
      materialRef.current.emissiveIntensity = glowIntensity * 1.5;
    }

    const fractionalProgress = Math.max(0, Math.min(1, (reactionProgress - 0.166) / (0.833 - 0.166)));
    const wobbleActive = reactionProgress > 0.333 && reactionProgress < 0.833;

    const grains = grainRef.current!;
    const t = state.clock.getElapsedTime();

    for (let i = 0; i < grains.length; i++) {
      const g = grains[i];

      // Small swirling/vibrating effect around base position
      let dx = Math.sin(t * g.speed + g.phaseX) * g.radius * intensity;
      let dz = Math.cos(t * g.speed + g.phaseZ) * g.radius * intensity;
      let dy = 0;

      if (wobbleActive) {
        const speedMultiplier = 12 + (i % 5);
        const tParam = t * speedMultiplier + (i * 0.1);

        dx += Math.sin(tParam) * 0.0001;
        dz += Math.cos(tParam * 1.3) * 0.0001;
        dy += Math.sin(tParam * 2.0) * 0.00015;
      }

      // Update instance matrix
      _dummyObj.position.set(g.basePos.x + dx, g.basePos.y + dy, g.basePos.z + dz);

      // Khởi tạo ngẫu nhiên scale chút xíu cho hạt có vẻ lấp lánh (sparkle) hoặc rung động nhẹ
      const scaleVariation = 1.0 + (Math.sin(t * 10 + g.phaseX) * 0.1 * intensity);
      _dummyObj.scale.set(scaleVariation, scaleVariation, scaleVariation);

      _dummyObj.updateMatrix();
      meshRef.current.setMatrixAt(i, _dummyObj.matrix);

      const isReacted = (i / grains.length) <= fractionalProgress;
      if (g.isReacted !== isReacted) {
        g.isReacted = isReacted;
        const targetColor = isReacted ? _reactedColor : new THREE.Color(g.color);
        meshRef.current.setColorAt(i, targetColor);
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, grainRef.current!.length]} frustumCulled={false}>
      <sphereGeometry args={[STIR_GRAIN_R, 6, 6]} />
      <meshStandardMaterial ref={materialRef} roughness={0.85} metalness={0.05} />
    </instancedMesh>
  );
};

// ─── SmokeEmitter: Hiệu ứng khói đen bốc lên ─────────────────────────────────────────

const SmokeEmitter = ({ active, totalGrams }: { active: boolean; totalGrams: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  const particles = useMemo(() => {
    return Array.from({ length: 20 }).map(() => ({
      pos: new THREE.Vector3((Math.random() - 0.5) * 0.008, Math.random() * 0.05, (Math.random() - 0.5) * 0.008),
      vel: new THREE.Vector3((Math.random() - 0.5) * 0.004, Math.random() * 0.015 + 0.01, (Math.random() - 0.5) * 0.004),
      life: Math.random(),
    }));
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const dt = Math.min(delta, 0.03); // cap delta

    particles.forEach((p, i) => {
      if (active) {
        p.life += dt * 0.5;
        if (p.life > 1) {
          p.life = 0;
          p.pos.set((Math.random() - 0.5) * 0.008, 0, (Math.random() - 0.5) * 0.008);
        }
      } else {
        if (p.life >= 0 && p.life < 1) {
          p.life += dt * 0.25; // Slower fade out (~4s)
        } else {
          p.life = 2; // dead
        }
      }

      const child = groupRef.current!.children[i] as THREE.Mesh;
      if (child) {
        if (p.life >= 0 && p.life <= 1) {
          child.visible = true;
          p.pos.addScaledVector(p.vel, dt);
          child.position.copy(p.pos);
          // random spread
          p.vel.x += (Math.random() - 0.5) * dt * 0.01;
          p.vel.z += (Math.random() - 0.5) * dt * 0.01;

          const mat = child.material as THREE.MeshBasicMaterial;
          mat.opacity = (1 - p.life) * 0.1; // fade out, max opacity 0.1

          const scale = 1 + p.life * 1.5;
          child.scale.set(scale, scale, scale);
        } else {
          child.visible = false;
        }
      }
    });
  });

  // Calculate approximate top Y of the powder layer
  // The base bottom is around 0.035, and layers scale based on totalGrams
  // We reduce the offset to ensure it sits exactly ON the powder, not hovering above.
  const startY = 0.035 + (totalGrams * 0.0028);

  return (
    <group ref={groupRef} position={[0, startY, 0]}>
      {particles.map((_, i) => (
        <mesh key={i} visible={false}>
          <sphereGeometry args={[0.0012, 5, 5]} />
          <meshBasicMaterial color="#f3f4f6" transparent opacity={0.15} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
};
