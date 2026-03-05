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
import type { TubeContent } from "../services/experimentStore";
import { useExperimentStore } from "../services/experimentStore";
import type { DroppedItem } from "../types/equipment";

// ─── Hằng số snap ────────────────────────────────────────────────────────────
const SNAP_OFFSET_Y = 0.5;
const SNAP_RADIUS = 0.4;
const LAMP_SNAP_OFFSET_Y = 0;
const MAGNET_SNAP_OFFSET_Y = 0.52;

const CG_TEST_TUBE = 0x00010004;
const CG_EQUIPMENT = 0x00030002;

// ─── Tube Constants ──────────────────────────────────────────────────────────
const TUBE_TOP_Y = 0.15;
const TUBE_INNER_R = 0.008;
const TUBE_BOTTOM_Y = 0.032; // đáy trong lòng ống (model space)
const TUBE_MARGIN = 0.02;  // khoảng cách tới mép trên (model space)
const LAYER_H_CONST = 0.003; // = layerH trong render
const MAX_TUBE_LAYERS = Math.floor((TUBE_TOP_Y - TUBE_BOTTOM_Y - TUBE_MARGIN) / LAYER_H_CONST);

// ─── Utility ────────────────────────────────────────────────────────────────
const getGrams = (arr: TubeContent[]) => arr.reduce((acc, c) => acc + c.amount, 0);

interface EquipmentModelProps {
  droppedItem: DroppedItem;
  tableHeight?: number;
  onDragChange?: (isDragging: boolean) => void;
  onRemove?: (itemId: string) => void;
}

const thermometerRegistry = new Map<string, RapierRigidBody>();
const occupiedThermometers = new Map<string, string>();
const occupiedThermometersByLamp = new Map<string, string>();
const occupiedByMagnet = new Map<string, string>();

const ChemicalShader = {
  uniforms: {
    uTime: { value: 0 },
    uIsBurning: { value: false },
    uReactionProgress: { value: 0 },
    uCoolingTime: { value: 0 },
  },
  vertexShader: `
    varying float vRandom;
    varying vec3 vColor;
    attribute float aRandom;
    attribute vec3 aColor;
    void main() {
      vRandom = aRandom;
      vColor = aColor;
      vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform bool uIsBurning;
    uniform float uReactionProgress;
    uniform float uCoolingTime;
    varying float vRandom;
    varying vec3 vColor;
    void main() {
      vec3 colorFeS = vec3(0.05, 0.05, 0.05);
      
      // Tiến trình phản ứng: chuyển từ màu gốc sang màu FeS (đen)
      float colorProgress = smoothstep(0.166, 0.8, uReactionProgress);
      vec3 baseColor = mix(vColor, colorFeS, colorProgress);
      
      // Hiệu ứng nhiệt: đỏ rực khi nung mạnh
      float heat = 0.0;
      if (uIsBurning) {
        if (uReactionProgress > 0.05 && uReactionProgress <= 0.2) {
          heat = smoothstep(0.05, 0.2, uReactionProgress) * 0.6;
        } else if (uReactionProgress > 0.2 && uReactionProgress <= 0.833) {
          float pulse = sin(uTime * 10.0 + vRandom * 10.0) * 0.3;
          pulse += sin(uTime * 4.0 + vRandom * 5.0) * 0.2;
          heat = 1.1 + pulse;
        } else if (uReactionProgress > 0.833 && uReactionProgress < 1.0) {
          heat = mix(1.1, 1.0, smoothstep(0.833, 1.0, uReactionProgress));
        }
      } else if (uCoolingTime > 0.0 && uCoolingTime < 5.0) {
        // Hết đỏ dần khi đang nguội (trong 5s đầu của giai đoạn cooling)
        heat = 1.0 * (1.0 - smoothstep(0.0, 5.0, uCoolingTime));
      }
      
      gl_FragColor = vec4(baseColor + vec3(1.0, 0.2, 0.0) * heat, 1.0);
    }
  `
};

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
  // Lấy lượng sắt tự do (chưa phản ứng thành FeS)
  const freeFeAmount = useExperimentStore((state) =>
    state.getFreeIronAmount(droppedItem.id, EQUIPMENT_IDS.FES_POWDER),
  );
  const isAttracted =
    occupiedByMagnet.get(snappedToThermoIdRef?.current ?? "") &&
    freeFeAmount > 0;
  // Tránh snap lại ngay lập tức
  const lastUnsnappedThermoIdRef = useRef<string | null>(null);
  const coolingStartTimeRef = useRef<number | null>(null);
  const [coolingTime, setCoolingTime] = useState<number | null>(null);

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

  const contents = testTubeContents.get(droppedItem.id) ?? [];
  const hasFinishedReaction = contents.some(c => c.substanceId === EQUIPMENT_IDS.FES_POWDER);

  const isTestTube = droppedItem.equipmentId === EQUIPMENT_IDS.TEST_TUBE;
  const isThermometer = droppedItem.equipmentId === EQUIPMENT_IDS.THERMOMETER;
  const isAlcoholLamp = droppedItem.equipmentId === EQUIPMENT_IDS.ALCOHOL_LAMP;
  const isMagnet = droppedItem.equipmentId === EQUIPMENT_IDS.MAGNET;
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
      // Giải phóng các vị trí đã chiếm
      if (snappedToThermoIdRef.current) {
        if (isTestTube) occupiedThermometers.delete(snappedToThermoIdRef.current);
        else if (isAlcoholLamp) occupiedThermometersByLamp.delete(snappedToThermoIdRef.current);
        else if (isMagnet) occupiedByMagnet.delete(snappedToThermoIdRef.current);
      }
    };
  }, [isTestTube, isAlcoholLamp, isMagnet]);

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

  function getOffsetY() {
    if (isTestTube) {
      return SNAP_OFFSET_Y
    } else if (isAlcoholLamp) {
      return LAMP_SNAP_OFFSET_Y
    } else if (isMagnet) {
      return MAGNET_SNAP_OFFSET_Y
    } else {
      return 0;
    }
  }

  useFrame((state) => {
    if (!rigidBodyRef.current) return;

    // 0. Cooling Logic
    if (isTestTube && (currentProgress > 0 || hasFinishedReaction)) {
      const shouldCool = (!isHeating || currentProgress >= 1.0 || hasFinishedReaction);
      if (shouldCool) {
        if (coolingStartTimeRef.current === null) coolingStartTimeRef.current = state.clock.elapsedTime;
        const elapsed = state.clock.elapsedTime - coolingStartTimeRef.current;
        if (elapsed < 8.0) {
          if (Math.abs((coolingTime || 0) - elapsed) > 0.1) setCoolingTime(elapsed);
        } else {
          if (coolingTime !== 8.0) setCoolingTime(8.0);
        }
      } else {
        coolingStartTimeRef.current = null;
        if (coolingTime !== null) setCoolingTime(null);
      }
    }

    // 1. Follow / Animate snap
    if ((isTestTube || isAlcoholLamp || isMagnet) && isSnappedRef.current && snappedToBodyRef.current) {
      try {
        const tp = snappedToBodyRef.current.translation();
        const offset_Y = getOffsetY();
        const finalX = tp.x - 0.0263 - (isMagnet ? 0.25 : 0);
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
          if (isMagnet) occupiedThermometersByLamp.delete(snappedToThermoIdRef.current);
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
        if ((isTestTube || isAlcoholLamp || isMagnet) && thermometerRegistry.size > 0) {
          const occupationMap = isTestTube ? occupiedThermometers : isAlcoholLamp ? occupiedThermometersByLamp : occupiedByMagnet;
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
      if ((isTestTube || isAlcoholLamp || isMagnet) && !isSnappedRef.current && thermometerRegistry.size > 0) {
        const myPos = rigidBodyRef.current.translation();
        const occupationMap = isTestTube ? occupiedThermometers : isAlcoholLamp ? occupiedThermometersByLamp : occupiedByMagnet;

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
    if ((isTestTube || isAlcoholLamp || isMagnet) && isSnappedRef.current && !heldSubstance) {
      if (snappedToThermoIdRef.current) {
        if (isTestTube) occupiedThermometers.delete(snappedToThermoIdRef.current);
        if (isAlcoholLamp) occupiedThermometersByLamp.delete(snappedToThermoIdRef.current);
        if (isMagnet) occupiedByMagnet.delete(snappedToThermoIdRef.current);

        lastUnsnappedThermoIdRef.current = snappedToThermoIdRef.current;
      }
      isSnappedRef.current = false;
      setIsSnapped(false);
      snappedToBodyRef.current = null;
    }

    gl.domElement.setPointerCapture(e.pointerId);
    activePointerRef.current = { target: gl.domElement, pointerId: e.pointerId };

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
    [gl.domElement, onDragChange, dragPlane, isTestTube, isAlcoholLamp, heldSubstance, isMagnet]
  );

  const handlePointerUp = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    try {
      gl.domElement.releasePointerCapture(e.pointerId);
    } catch { }
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
  if (isAttracted) {
    unmixedContents.sort((a, b) => b.substanceId.localeCompare(a.substanceId, undefined, { sensitivity: "base" }))
  }

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
      type={isDragging || isSnapped ? "kinematicPosition" : "dynamic"}
      position={[droppedItem.position[0], tableHeight, droppedItem.position[2]]}
      rotation={droppedItem.rotation}
      colliders={isDragging || isSnapped ? false : "hull"}
      collisionGroups={isTestTube ? CG_TEST_TUBE : CG_EQUIPMENT}
      name={droppedItem.equipmentId}
      gravityScale={isDragging || isSnapped ? 0 : 1}
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
        <group position={[0, 0, 0]}>
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
              coolingTime={coolingTime}
              isHeating={isHeating}
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
                reactionProgress={currentProgress}
                coolingTime={coolingTime}
                isHeating={isHeating}
                spawnInstant={item.instant}
                isIron={item.substanceId === EQUIPMENT_IDS.FE_POWDER}
                isAttracted={isAttracted}
              />
            );
          })}
        </group>

        {/* Lớp khói đen */}
        {isTestTube && (currentProgress > 0.33 || hasFinishedReaction) && (
          <SmokeEmitter
            active={isHeating}
            isFinished={hasFinishedReaction || currentProgress >= 1.0}
            totalGrams={totalGrams}
            tubeId={droppedItem.id}
          />
        )}
      </group>

      {droppedItem.equipmentId === EQUIPMENT_IDS.MAGNET && (
    <CuboidCollider 
      args={[0, -0.000055, 0]} // Điều chỉnh kích thước cho vừa chân nam châm
      position={[0, 0.000055, 0]} // Điều chỉnh để đáy collider bằng đúng đáy model
    />
  )}

      {/* Nhãn thành phần — chỉ hiện khi hover vào, kích thước cố định */}
      {isTestTube && isHovered && contents.length > 0 && (
        <Html
          position={[0, 0.06, 0]}
          center
          pointerEvents="none"
          style={{ userSelect: "none" }}
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
          pointerEvents="none"
          style={{ userSelect: "none" }}
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

      {/* Khung thông tin phản ứng (Ý tưởng từ ab.html) */}
      {isTestTube && (isHeating || (coolingTime !== null && coolingTime < 8)) && (currentProgress > 0 || hasFinishedReaction) && (
        <Html
          position={[-1, 0.25, 0]}
          center
          pointerEvents="none"
          style={{ userSelect: "none", zIndex: 100 }}
        >
          <div style={{
            background: "rgba(10, 15, 25, 0.95)",
            border: `1px solid ${coolingTime !== null ? "#00f5d4" : "#ff4e50"}`,
            borderRadius: "6px",
            padding: "8px 12px",
            minWidth: "220px",
            color: "white",
            fontFamily: "sans-serif",
            fontSize: "11px",
            boxShadow: `0 0 10px ${coolingTime !== null ? "rgba(0, 245, 212, 0.3)" : "rgba(255, 78, 80, 0.3)"}`,
            whiteSpace: "nowrap"
          }}>
            <h4 style={{ margin: "0 0 4px 0", color: "#ffb703", fontSize: "12px" }}>Phản ứng hóa học: Fe + S</h4>
            <div style={{ marginBottom: "2px" }}>
              <span>Trạng thái: </span>
              <span style={{ color: "#00f5d4", fontWeight: "bold" }}>
                {currentProgress < 0.166 && !hasFinishedReaction ? "0-5s: Đang truyền nhiệt." :
                  currentProgress < 0.5 && !hasFinishedReaction ? "5-15s: S nóng chảy, sẫm màu & bốc khói." :
                    currentProgress < 0.99 && !hasFinishedReaction ? "15-30s: ĐANG ĐUN - PHẢN ỨNG MẠNH!" :
                      (coolingTime !== null && coolingTime < 5) ? `Đang nguội... (${(5 - coolingTime).toFixed(1)}s)` :
                        "Hoàn tất: Khối FeS đặc xốp màu đen."}
              </span>
            </div>

            {coolingTime !== null && coolingTime < 5 && (
              <div style={{ color: "#ef4444", fontSize: "10px", marginTop: "4px", fontWeight: "bold", textAlign: "center", borderTop: "1px dashed rgba(239,68,68,0.3)", paddingTop: "4px" }}>
                ⚠️ Tuyệt đối không chạm tay vào!
              </div>
            )}

            {!((coolingTime !== null && coolingTime < 8)) && (
              <div>
                <span>Thời gian nung: </span>
                <span style={{ color: "#ffb703", fontWeight: "bold" }}>{(currentProgress * 30).toFixed(1)}s / 30.0s</span>
              </div>
            )}
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
/** Số lớp bột tối đa: giữ khoảng cách an toàn tới mép trên */

// interface SDropLayerGrain {
//   startY: number;
//   targetPos: THREE.Vector3;
//   color: string;
//   delay: number;
//   currentY: number;
//   velY: number;
//   settled: boolean;
// }

// ─── Shared Particle Generation Logic ─────────────────────────────────────────
const STIR_GRAIN_R = 0.00025;

const GRAINS_PER_GRAM = 3500;

function getWeightHeight(grams: number, tubeR: number, grainR: number): number {
  const count = Math.round(grams * GRAINS_PER_GRAM);
  const volume = count * ((4 / 3) * Math.PI * Math.pow(grainR, 3));
  const packingFraction = 0.5;
  return (volume / packingFraction) / (Math.PI * tubeR * tubeR);
}

interface SimplePos {
  x: number;
  y: number;
  z: number;
}

function buildPackedPositions(
  tubeR: number,
  grainR: number,
  baseY: number,
  totalCount: number,
): SimplePos[] {
  const positions: SimplePos[] = new Array(totalCount);
  const tubeBaseY = 0.032 + grainR;

  // 1. Tối ưu hằng số: Tính toán cylinderHeight một lần duy nhất
  const grainVolume = (4 / 3) * Math.PI * (grainR ** 3);
  const packingFraction = 0.5;
  const tubeArea = Math.PI * (tubeR ** 2);
  const cylinderHeight = (totalCount * grainVolume / packingFraction) / tubeArea;

  // 2. Cache các giá trị bình phương để tránh Math.pow/Math.sqrt không cần thiết
  const tubeR2 = tubeR * tubeR;
  const usableTubeR = tubeR - grainR;

  for (let i = 0; i < totalCount; i++) {
    // Phân bổ hạt theo diện tích hình tròn (sqrt để phân bổ đều từ tâm ra rìa)
    const rx = Math.sqrt(Math.random()) * usableTubeR;
    const theta = Math.random() * Math.PI * 2;
    
    let x = rx * Math.cos(theta);
    let z = rx * Math.sin(theta);
    const yOffset = Math.random() * cylinderHeight;
    const absY = baseY + yOffset;

    // 3. Logic xử lý đáy ống nghiệm bán cầu
    const relativeYToBottom = absY - tubeBaseY;
    
    if (relativeYToBottom < tubeR) {
      // dy là khoảng cách từ tâm bán cầu đáy (theo trục Y)
      const dy = relativeYToBottom - tubeR;
      // Tính bán kính tối đa cho phép tại độ cao này (Pythagoras)
      const rMax = Math.sqrt(Math.max(0, tubeR2 - dy * dy)) - grainR;
      
      const rCurrent2 = x * x + z * z;
      if (rCurrent2 > rMax * rMax && rCurrent2 > 0) {
        const scale = rMax / Math.sqrt(rCurrent2);
        x *= scale;
        z *= scale;
      }
    }

    // 4. Trả về object literal (Cực nhẹ so với THREE.Vector3)
    positions[i] = { x, y: absY, z };
  }

  return positions;
}

// ─── PowderLayer: Real falling particles for individual layers ─────────

// interface SDropLayerGrain {
//   startY: number;
//   targetPos: THREE.Vector3;
//   color: string;
//   delay: number;
//   currentY: number;
//   velY: number;
//   settled: boolean;
//   isReacted?: boolean;
// }
const _dummy = new THREE.Object3D();

const PowderLayer = ({
  color,
  startGrams,
  amountGrams,
  reactionProgress = 0,
  coolingTime = null,
  isHeating = false,
  spawnInstant = false,
  isIron = false,
  isAttracted = false,
}: any) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const elapsed = useRef(0);
  const isAllSettledRef = useRef(false);

  // 1. Tính toán Grains (Chỉ khi dữ liệu đầu vào thay đổi)
  const grains = useMemo(() => {
    const floorY = 0.032 + STIR_GRAIN_R;
    const startHeight = getWeightHeight(startGrams, TUBE_INNER_R, STIR_GRAIN_R);
    const layerGrainsCount = Math.round(amountGrams * GRAINS_PER_GRAM);

    const layerTargets = buildPackedPositions(
      TUBE_INNER_R,
      STIR_GRAIN_R,
      floorY + startHeight,
      layerGrainsCount,
    );

    let minY = Infinity;
    layerTargets.forEach((t) => {
      if (t.y < minY) minY = t.y;
    });

    return layerTargets.map((t) => {
      let fX = t.x,
        fZ = t.z,
        fY = t.y;

      if (isIron && isAttracted) {
        if (fX > 0) fX = -fX;
        fX = fX * 0.8 - TUBE_INNER_R * 0.2;
        const relativeY = t.y - minY;
        fY = minY + relativeY * 2;
        fX += (Math.random() - 0.5) * 0.002;
        fZ += (Math.random() - 0.5) * 0.002;
      }

      // Pre-calculate Rotation thành Quaternion để tối ưu speed trong useFrame
      const quat = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0),
      );

      return {
        targetX: fX,
        targetY: fY,
        targetZ: fZ,
        currentY: spawnInstant ? fY : TUBE_TOP_Y + 0.02 + Math.random() * 0.02,
        velY: spawnInstant ? 0 : -(Math.random() * 0.1 + 0.05),
        delay: spawnInstant ? 0 : Math.random() * 0.5,
        settled: spawnInstant,
        aRandom: Math.random(),
        quat: quat,
      };
    });
  }, [isAttracted, startGrams, amountGrams, isIron, color, spawnInstant]);

  // Attribute Data (Chỉ tính lại khi grains đổi)
  const { aRandomData, aColorData } = useMemo(() => {
    const rData = new Float32Array(grains.length);
    const cData = new Float32Array(grains.length * 3);
    const col = new THREE.Color(color);
    grains.forEach((g, i) => {
      rData[i] = g.aRandom;
      cData[i * 3] = col.r;
      cData[i * 3 + 1] = col.g;
      cData[i * 3 + 2] = col.b;
    });
    return { aRandomData: rData, aColorData: cData };
  }, [grains, color]);

  // 2. Cập nhật matrix ban đầu
  useEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < grains.length; i++) {
      const g = grains[i];
      _dummy.position.set(g.targetX, g.currentY, g.targetZ);
      _dummy.quaternion.copy(g.quat);
      _dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, _dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    isAllSettledRef.current = false; // Reset trạng thái khi grains đổi
  }, [grains]);

  // 3. Logic Frame (Optimized)
  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const time = state.clock.elapsedTime;
    const mat = mesh.material as THREE.ShaderMaterial;

    // Điều kiện để hạt "động":
    // 1. Đang có phản ứng (rung)
    // 2. Đang thắp lửa (để Shader cập nhật màu liên tục)
    const wobbleActive = reactionProgress > 0.333 && reactionProgress < 0.833;
    const isActivelyReacting =
      isHeating ||
      wobbleActive ||
      (reactionProgress > 0 && reactionProgress < 1);

    // 1. CẬP NHẬT UNIFORMS (Cần chạy khi đang thắp lửa để đổi màu)
    if (mat.uniforms) {
      mat.uniforms.uTime.value = time;
      mat.uniforms.uIsBurning.value = isHeating && reactionProgress > 0;
      mat.uniforms.uReactionProgress.value = reactionProgress;
      mat.uniforms.uCoolingTime.value = coolingTime ?? 0;
    }

    // 2. NGẮT LOOP TRIỆT ĐỂ:
    // Chỉ ngủ khi: Đã chạm đáy (isAllSettledRef) VÀ không còn thắp lửa/phản ứng
    if (isAllSettledRef.current && !isActivelyReacting) return;

    elapsed.current += delta;
    const dt = Math.min(delta, 0.03);

    let needsGPUUpdate = false;
    let anyoneStillFalling = false;

    for (let i = 0; i < grains.length; i++) {
      const g = grains[i];

      // Nếu chưa đến lúc rơi
      if (elapsed.current < g.delay) {
        anyoneStillFalling = true;
        continue;
      }

      let pX = g.targetX;
      let pY = g.currentY;
      let pZ = g.targetZ;
      let hasMoved = false;

      // A. Xử lý rơi (Vật lý)
      if (!g.settled) {
        hasMoved = true;
        anyoneStillFalling = true;

        g.velY -= 3.5 * dt;
        g.currentY += g.velY * dt;

        if (g.currentY <= g.targetY) {
          g.currentY = g.targetY;
          g.velY *= -0.15;
          if (Math.abs(g.velY) < 0.02) {
            g.currentY = g.targetY;
            g.velY = 0;
            g.settled = true;
          }
        }
        pY = g.currentY;
      }

      // B. Xử lý rung (Wobble)
      if (g.settled && wobbleActive) {
        hasMoved = true;
        const t = time * (6 + (i % 5)) + i * 0.1;
        pX += Math.sin(t) * 0.0001;
        pZ += Math.cos(t * 1.3) * 0.0001;
        pY += Math.sin(t * 2.0) * 0.00015;
      }

      // C. Cập nhật Matrix (Chỉ khi vị trí thay đổi)
      if (hasMoved) {
        _dummy.position.set(pX, pY, pZ);
        _dummy.quaternion.copy(g.quat);
        _dummy.scale.setScalar(g.settled ? 1 : 1.3);
        _dummy.updateMatrix();
        mesh.setMatrixAt(i, _dummy.matrix);
        needsGPUUpdate = true;
      }
    }

    // Luôn cập nhật instanceMatrix khi đang đổi màu/phản ứng
    // để GPU vẽ lại các hạt với màu sắc mới từ Shader
    if (needsGPUUpdate || isActivelyReacting) {
      mesh.instanceMatrix.needsUpdate = true;
    }

    // QUYẾT ĐỊNH TRẠNG THÁI NGHỈ CHO FRAME TIẾP THEO
    // Nếu không còn hạt nào đang rơi và không có lửa/phản ứng -> Ngủ
    if (!anyoneStillFalling && !isActivelyReacting) {
      isAllSettledRef.current = true;
    } else {
      // Nếu có lửa hoặc hạt đang rơi -> Luôn thức
      isAllSettledRef.current = false;
    }
  });
  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, grains.length]}
      frustumCulled={true} // Bật lại để tối ưu GPU
    >
      <sphereGeometry args={[STIR_GRAIN_R, 3, 3]}>
        {" "}
        {/* Giảm segment từ 4x4 xuống 3x3 để bớt poly */}
        <instancedBufferAttribute
          attach="attributes-aRandom"
          args={[aRandomData, 1]}
        />
        <instancedBufferAttribute
          attach="attributes-aColor"
          args={[aColorData, 3]}
        />
      </sphereGeometry>
      <shaderMaterial args={[ChemicalShader]} transparent={true} />
    </instancedMesh>
  );
};

// ─── StirredLayer: grains fall from tube mouth and pack at the bottom ─────────

interface SGrain {
  basePos: THREE.Vector3;
  color: string;
  rotation: THREE.Euler;
  aRandom: number;
  phaseX: number;
  phaseZ: number;
  speed: number;
  radius: number;
}


const StirredLayer = ({
  items,
  totalGrams,
  reactionProgress = 0,
  coolingTime = null,
  isHeating = false,
}: any) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const grainRef = useRef<any[] | null>(null);
  const elapsed = useRef(0);
  const isLogicDeadRef = useRef(false); // Flag ngắt render

  const itemsKey = JSON.stringify(items);

  // 1. Lazy-init & Pre-calculate
  useMemo(() => {
    const totalGrainsCount = Math.round(totalGrams * GRAINS_PER_GRAM);
    const targets = buildPackedPositions(TUBE_INNER_R, STIR_GRAIN_R, 0.032 + STIR_GRAIN_R, Math.max(0, totalGrainsCount));

    const colorsArray: string[] = [];
    items.forEach((c: any) => {
      const g = Math.round(c.amount * GRAINS_PER_GRAM);
      const col = SUBSTANCE_COLORS[c.substanceId] ?? "#e5e7eb";
      for (let i = 0; i < g; i++) colorsArray.push(col);
    });

    // Shuffle & Map
    grainRef.current = targets.map((t, i) => {
      // Pre-convert sang Quaternion để useFrame chạy nhanh hơn
      const quat = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0)
      );
      return {
        baseX: t.x, baseY: t.y, baseZ: t.z,
        color: colorsArray[i] || "#e5e7eb",
        quat: quat,
        aRandom: Math.random(),
        phaseX: Math.random() * Math.PI * 2,
        phaseZ: Math.random() * Math.PI * 2,
        speed: 8 + Math.random() * 12,
        radius: 0.001 + Math.random() * 0.004,
      };
    });
    
    // Đánh thức logic khi có dữ liệu mới
    isLogicDeadRef.current = false;
    elapsed.current = 0;
  }, [itemsKey, totalGrams]);

  // Attribute Data
  const { aRandomData, aColorData } = useMemo(() => {
    const grains = grainRef.current || [];
    const rData = new Float32Array(grains.length);
    const cData = new Float32Array(grains.length * 3);
    const col = new THREE.Color();
    grains.forEach((g, i) => {
      rData[i] = g.aRandom;
      col.set(g.color);
      cData[i * 3] = col.r;
      cData[i * 3 + 1] = col.g;
      cData[i * 3 + 2] = col.b;
    });
    return { aRandomData: rData, aColorData: cData };
  }, [itemsKey]);

  // 2. Logic Frame (Optimized)
  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh || !grainRef.current) return;

    const time = state.clock.elapsedTime;
    const STIR_DURATION = 1.0;
    const wobbleActive = reactionProgress > 0.333 && reactionProgress < 0.833;
    
    // Trạng thái "thức": đang khuấy, đang thắp lửa (để đổi màu), hoặc đang rung
    const isActivelyAnimating = (elapsed.current < STIR_DURATION + 0.5) || isHeating || wobbleActive || (reactionProgress > 0 && reactionProgress < 1);

    // Cập nhật Shader Uniforms
    const mat = mesh.material as THREE.ShaderMaterial;
    if (mat.uniforms) {
      mat.uniforms.uTime.value = time;
      mat.uniforms.uIsBurning.value = isHeating && reactionProgress > 0;
      mat.uniforms.uReactionProgress.value = reactionProgress;
      mat.uniforms.uCoolingTime.value = coolingTime ?? 0;
    }

    // NGẮT RENDER: Nếu không có gì tác động thì dừng CPU ngay
    if (isLogicDeadRef.current && !isActivelyAnimating) return;

    elapsed.current += delta;
    let intensity = 0;

    // Tính intensity khuấy
    if (elapsed.current < STIR_DURATION) {
      intensity = 1.0;
    } else if (elapsed.current < STIR_DURATION + 0.5) {
      const tSmooth = (elapsed.current - STIR_DURATION) / 0.5;
      intensity = 1.0 - (tSmooth * tSmooth * (3 - 2 * tSmooth));
    }

    const grains = grainRef.current;
    const yCenter = 0.04; // Tâm bán cầu đáy
    const baseMaxR = TUBE_INNER_R - STIR_GRAIN_R * 2;

    for (let i = 0; i < grains.length; i++) {
      const g = grains[i];
      let pX = g.baseX;
      let pY = g.baseY;
      let pZ = g.baseZ;
      let needsMatrixUpdate = false;

      // A. Hiệu ứng Khuấy (Splash + Swirl)
      if (intensity > 0) {
        needsMatrixUpdate = true;
        const splashFreq = g.speed * 0.8;
        const dySplash = Math.max(0, Math.sin(time * splashFreq + g.phaseX)) * intensity * 0.015 * g.aRandom;
        
        pX += Math.sin(time * g.speed + g.phaseX) * g.radius * intensity;
        pZ += Math.cos(time * g.speed + g.phaseZ) * g.radius * intensity;
        pY += dySplash;

        // Xử lý va chạm thành ống (Chỉ tính khi đang khuấy để tiết kiệm CPU)
        let currentMaxR = baseMaxR;
        if (pY < yCenter) {
          const dyFromCenter = pY - yCenter;
          currentMaxR = Math.sqrt(Math.max(0, baseMaxR * baseMaxR - dyFromCenter * dyFromCenter));
        }
        const rCurrent = Math.sqrt(pX * pX + pZ * pZ);
        if (rCurrent > currentMaxR && rCurrent > 0) {
          const ratio = currentMaxR / rCurrent;
          pX *= ratio;
          pZ *= ratio;
        }
      }

      // B. Hiệu ứng Rung (Wobble)
      if (wobbleActive) {
        needsMatrixUpdate = true;
        const tParam = time * (12 + (i % 5)) + (i * 0.1);
        pX += Math.sin(tParam) * 0.0001;
        pZ += Math.cos(tParam * 1.3) * 0.0001;
        pY += Math.sin(tParam * 2.0) * 0.00015;
      }

      // C. Cập nhật Matrix (Chỉ khi cần)
      if (needsMatrixUpdate || isActivelyAnimating) {
        _dummy.position.set(pX, pY, pZ);
        _dummy.quaternion.copy(g.quat);
        
        const scaleVar = 1.0 + (intensity > 0 ? Math.sin(time * 10 + g.phaseX) * 0.1 * intensity : 0);
        _dummy.scale.setScalar(scaleVar);
        
        _dummy.updateMatrix();
        mesh.setMatrixAt(i, _dummy.matrix);
      }
    }

    mesh.instanceMatrix.needsUpdate = true;

    // Kiểm tra để "đi ngủ" ở frame tiếp theo
    if (!isActivelyAnimating) {
      isLogicDeadRef.current = true;
    } else {
      isLogicDeadRef.current = false;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, grainRef.current?.length || 0]} frustumCulled={true}>
      <sphereGeometry args={[STIR_GRAIN_R, 3, 3]}>
        <instancedBufferAttribute attach="attributes-aRandom" args={[aRandomData, 1]} />
        <instancedBufferAttribute attach="attributes-aColor" args={[aColorData, 3]} />
      </sphereGeometry>
      <shaderMaterial args={[ChemicalShader]} transparent={true} />
    </instancedMesh>
  );
};

// ─── SmokeEmitter: Mô phỏng khói phản ứng hóa nhiệt ─────────────────────────
// Tối ưu hiệu năng tuyệt đối bằng InstancedMesh + mutation in-place, không allocation trong useFrame.

const SMOKE_COUNT = 300;
const SMOKE_BASE_R = 0.005;      // Bán kính nguồn sinh khói (vòng nguồn nhỏ ở đáy)
const SMOKE_MAX_SCALE = 0.0023;
const SMOKE_UP_SPEED = 0.022;    // Bay chậm
const SMOKE_MAX_AGE_BASE = 3.5;  // 

// Pre-allocate a stable dummy object at module level (never re-created)
const _smokeDummy = new THREE.Object3D();

interface SmokeParticle {
  x: number; y: number; z: number;   // world-space position (local to group)
  phase: number;                       // initial phase offset for sin/cos drift (radians)
  speedMult: number;                   // individual up-speed multiplier [0.7, 1.3]
  age: number;                         // current age (seconds)
  maxAge: number;                      // lifetime (seconds)
  rotX: number; rotY: number; rotZ: number; // random orientation for dodecahedron
  rotSpeedX: number; rotSpeedY: number;     // gentle tumble speed
}

const SmokeEmitter = ({ active, isFinished, totalGrams, tubeId }: { active: boolean; isFinished: boolean; totalGrams: number; tubeId: string }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  const reactionProgress = useExperimentStore((s) => s.reactionProgress.get(tubeId) || 0);
  const stopTimeRef = useRef<number | null>(null);

  // ── Stable particle array — allocated once ──────────────────────────────────
  const particles = useMemo<SmokeParticle[]>(() => {
    const arr: SmokeParticle[] = [];
    for (let i = 0; i < SMOKE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = Math.random() * SMOKE_BASE_R;
      const maxAge = SMOKE_MAX_AGE_BASE * (0.75 + Math.random() * 0.5);
      arr.push({
        x: Math.cos(theta) * r,
        y: Math.random() * SMOKE_UP_SPEED * maxAge, // stagger initial heights
        z: Math.sin(theta) * r,
        phase: Math.random() * Math.PI * 2,
        speedMult: 0.7 + Math.random() * 0.6,
        age: Math.random() * maxAge,                // stagger ages so no "burst" on mount
        maxAge,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        rotSpeedX: (Math.random() - 0.5) * 0.4,
        rotSpeedY: (Math.random() - 0.5) * 0.4,
      });
    }
    return arr;
  }, []);

  // ── Helper: reset a particle to origin ─────────────────────────────────────
  const resetParticle = (p: SmokeParticle) => {
    const theta = Math.random() * Math.PI * 2;
    const r = Math.random() * SMOKE_BASE_R;
    p.x = Math.cos(theta) * r;
    p.y = 0;
    p.z = Math.sin(theta) * r;
    p.phase = Math.random() * Math.PI * 2;
    p.speedMult = 0.7 + Math.random() * 0.6;
    p.age = 0;
    p.maxAge = SMOKE_MAX_AGE_BASE * (0.75 + Math.random() * 0.5);
    p.rotSpeedX = (Math.random() - 0.5) * 0.4;
    p.rotSpeedY = (Math.random() - 0.5) * 0.4;
  };

  useFrame((state, delta) => {
    if (!meshRef.current || !matRef.current) return;

    // ── 1. Opacity / Fade logic ──────────────────────────────────────────────
    let baseOpacity = 0;
    if (reactionProgress > 0.33 || isFinished) {
      // Fade-in: 10s → 15s (progress 0.33 → 0.5)
      const progressVal = isFinished ? 1.0 : reactionProgress;
      const fadeIn = Math.min(1.0, (progressVal - 0.33) / 0.17);
      baseOpacity = fadeIn * 0.22;
    }

    const shouldFade = !active || reactionProgress >= 1.0 || isFinished;
    let fadeFactor = 1.0;
    if (shouldFade) {
      if (stopTimeRef.current === null) stopTimeRef.current = state.clock.elapsedTime;
      const elapsed = state.clock.elapsedTime - stopTimeRef.current;
      // 5-second linger with power-1.3 easing for gradual tail
      fadeFactor = Math.max(0, 1 - Math.pow(elapsed / 5.0, 1.3));
    } else {
      stopTimeRef.current = null;
    }

    const finalOpacity = baseOpacity * fadeFactor;
    matRef.current.opacity = finalOpacity;

    if (finalOpacity <= 0.002) {
      meshRef.current.visible = false;
      return;
    }
    meshRef.current.visible = true;

    // ── 2. Local-space tube bounds ───────────────────────────────────────────
    const startY = 0.026 + totalGrams * 0.0028;
    const mouthY = TUBE_TOP_Y - startY; // height of tube mouth in local space
    const tubeR = TUBE_INNER_R - 0.001;

    const dt = Math.min(delta, 0.05); // clamp delta to avoid physics explosion on tab switch
    const t = state.clock.elapsedTime;

    // ── 3. Update every particle — zero allocation ───────────────────────────
    for (let i = 0; i < SMOKE_COUNT; i++) {
      const p = particles[i];

      p.age += dt;
      if (p.age >= p.maxAge) {
        // Dead → reset, but only respawn if smoke is still active/lingering
        if (fadeFactor < 0.05) {
          // Almost gone: freeze particle so it fades invisibly
          _smokeDummy.scale.setScalar(0);
          _smokeDummy.updateMatrix();
          meshRef.current.setMatrixAt(i, _smokeDummy.matrix);
          continue;
        }
        resetParticle(p);
      }

      const lifePct = p.age / p.maxAge; // 0 → 1

      // ── 3a. Vertical velocity: fast at birth (热气流), decelerates (giảm nhiệt)
      //   v(y) = SPEED * speedMult * (1 - 0.6 * lifePct)  [decelerating]
      const upV = SMOKE_UP_SPEED * p.speedMult * (1.0 - 0.6 * lifePct) * fadeFactor;
      p.y += upV * dt;

      // ── 3b. Horizontal convection (Phễu & Đối lưu):
      //   Drift sử dụng sin/cos với pha offset theo từng hạt,
      //   biên độ mở rộng theo chiều cao (khói thoát ra ngoài khi lên cao).
      const heightAboveMouth = Math.max(0, p.y - mouthY);
      // Giảm mạnh độ tỏa rộng (expansion) để khói "nằm trong ống" (luồng khói thẳng đứng)
      const convectAmp = 0.0008 + heightAboveMouth * 0.005;
      p.x += Math.sin(t * 1.1 + p.phase) * convectAmp * dt;
      p.z += Math.cos(t * 0.9 + p.phase + 1.3) * convectAmp * dt;

      // ── 3c. Tube constraint: clamp inside inner radius while below mouth ──
      if (p.y < mouthY) {
        const rr = p.x * p.x + p.z * p.z;
        if (rr > tubeR * tubeR) {
          const inv = tubeR / Math.sqrt(rr);
          p.x *= inv;
          p.z *= inv;
        }
      }

      // ── 3d. Lifecycle scale curve ────────────────────────────────────────
      //   Phase 1 (0%–20%): grow fast   → smoothstep 0→1
      //   Phase 2 (20%–70%): hold full  → scale = 1
      //   Phase 3 (70%–100%): taper out → smoothstep 1→0  (tránh cắt cụt)
      let scalePct: number;
      if (lifePct < 0.20) {
        const tt = lifePct / 0.20;
        scalePct = tt * tt * (3 - 2 * tt); // smoothstep up
      } else if (lifePct < 0.70) {
        scalePct = 1.0;
      } else {
        const tt = (lifePct - 0.70) / 0.30;
        scalePct = 1.0 - tt * tt * (3 - 2 * tt); // smoothstep down
      }
      const s = SMOKE_MAX_SCALE * scalePct;

      // ── 3e. Gentle tumble ──────────────────────────────────────────────────
      p.rotX += p.rotSpeedX * dt;
      p.rotY += p.rotSpeedY * dt;

      // ── 3f. Write instance matrix ──────────────────────────────────────────
      _smokeDummy.position.set(p.x, p.y, p.z);
      _smokeDummy.rotation.set(p.rotX, p.rotY, p.rotZ);
      _smokeDummy.scale.setScalar(s);
      _smokeDummy.updateMatrix();
      meshRef.current.setMatrixAt(i, _smokeDummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  const startY = 0.026 + totalGrams * 0.0028;

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, SMOKE_COUNT]}
      position={[0, startY, 0]}
      raycast={() => null}
      frustumCulled={false}
    >
      {/* Dodecahedron: 12 mặt ngũ giác → cảm giác khối cuộn tròn khi xoay */}
      <dodecahedronGeometry args={[1, 0]} />
      <meshBasicMaterial
        ref={matRef}
        color="#fff9c4" // Màu trắng vàng (kem) theo yêu cầu
        transparent
        opacity={0}
        depthWrite={false}
      />
    </instancedMesh>
  );
};

