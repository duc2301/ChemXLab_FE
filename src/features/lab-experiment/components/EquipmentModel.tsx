import { Html, useAnimations, useGLTF } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useFrame, useThree } from "@react-three/fiber";
import {
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { EQUIPMENT_IDS, SUBSTANCE_COLORS, getEquipmentById } from "../services/equipmentRegistry";
import { useExperimentStore } from "../services/experimentStore";
import type { TubeContent } from "../services/experimentStore";
import type { DroppedItem } from "../types/equipment";

// ─── Hằng số snap ────────────────────────────────────────────────────────────
const SNAP_OFFSET_Y = 0.5;
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
// Lưu ID của test-tube đang chiếm dụng thermometer ID
const occupiedThermometers = new Map<string, string>();

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
  const isHoldingSubstance = heldSubstance !== null;
  const [showFull, setShowFull] = useState(false);

  // ─── Snap state (chỉ dùng cho test-tube) ────────────────────────────────────
  const isSnappedRef = useRef(false);
  const [isSnapped, setIsSnapped] = useState(false);
  const snappedToBodyRef = useRef<RapierRigidBody | null>(null);
  const snappedToThermoIdRef = useRef<string | null>(null);
  // Animation: xuất phát từ cao hơn rồi ease xuống vị trí snap cuối
  const snapAnimRef = useRef<{
    active: boolean;
    startY: number;
    targetY: number;
    snapX: number;
    snapZ: number;
    t: number;  // 0 → 1
  } | null>(null);

  const dragOffset = useRef(new THREE.Vector3());
  // Lưu target + pointerId để releasePointerCapture khi snap
  const activePointerRef = useRef<{ target: HTMLElement; pointerId: number } | null>(null);

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
      occupiedThermometers.delete(droppedItem.id);
    };
  }, [isThermometer, droppedItem.id]);

  // Hủy đăng ký snap nếu test-tube bị xóa khỏi scene
  useEffect(() => {
    return () => {
      if (isTestTube && isSnappedRef.current && snappedToThermoIdRef.current) {
        occupiedThermometers.delete(snappedToThermoIdRef.current);
      }
    };
  }, [isTestTube]);

  // ─── useFrame: follow nhiệt kế, drag, và proximity snap check ───────────────
  useFrame((state) => {
    if (!rigidBodyRef.current) return;

    // 1. Follow nhiệt kế khi đang snap
    if (isTestTube && isSnappedRef.current && snappedToBodyRef.current) {
      try {
        const tp = snappedToBodyRef.current.translation();
        const finalX = tp.x - 0.0263;
        const finalY = tp.y + SNAP_OFFSET_Y;
        const finalZ = tp.z + 0.385;

        // ─ Phase: đang chạy animation ease-down vào vị trí snap ───────────────────
        if (snapAnimRef.current?.active) {
          const anim = snapAnimRef.current;
          anim.t = Math.min(1, anim.t + 0.016 * 1.8); // ~0.55s tới 1
          // Ease-out cubic
          const eased = 1 - Math.pow(1 - anim.t, 3);
          const currentY = anim.startY + (anim.targetY - anim.startY) * eased;
          rigidBodyRef.current.setTranslation(
            { x: anim.snapX, y: currentY, z: anim.snapZ },
            true,
          );
          if (anim.t >= 1) anim.active = false;
          return;
        }

        // ─ Phase: đang follow (sau khi anim xong) ───────────────────────────
        rigidBodyRef.current.setTranslation(
          { x: finalX, y: finalY, z: finalZ },
          true,
        );
      } catch {
        // Nhiệt kế đã bị xóa khỏi scene (Rapier freed the body) — hủy snap
        if (snappedToThermoIdRef.current) {
          occupiedThermometers.delete(snappedToThermoIdRef.current);
        }
        isSnappedRef.current = false;
        setIsSnapped(false);
        snappedToBodyRef.current = null;
        snappedToThermoIdRef.current = null;
        snapAnimRef.current = null;
        rigidBodyRef.current.setBodyType(0, true); // trả về dynamic
      }
      return;
    }

    // 2. Drag bình thường
    if (isDragging) {
      raycaster.setFromCamera(state.pointer, state.camera);
      if (raycaster.ray.intersectPlane(dragPlane, intersectionPoint)) {
        intersectionPoint.add(dragOffset.current);

        // Kiểm tra chặn viền cho ống nghiệm nếu nhiệt kế đã có người chiếm
        if (isTestTube && thermometerRegistry.size > 0) {
          for (const [thermoId, thermoBody] of thermometerRegistry) {
            if (occupiedThermometers.has(thermoId) && occupiedThermometers.get(thermoId) !== droppedItem.id) {
              const tp = thermoBody.translation();
              const dx = intersectionPoint.x - tp.x;
              const dz = intersectionPoint.z - tp.z;
              const dist2D = Math.sqrt(dx * dx + dz * dz);
              const EDGE_DISTANCE = 0.35;

              if (dist2D < EDGE_DISTANCE) {
                if (dist2D > 0) {
                  const scale = EDGE_DISTANCE / dist2D;
                  intersectionPoint.x = tp.x + dx * scale;
                  intersectionPoint.z = tp.z + dz * scale;
                }
              }
            }
          }
        }

        rigidBodyRef.current.setTranslation(intersectionPoint, true);
      }

      // 3. Proximity snap: kiểm tra khoảng cách tới nhiệt kế khi đang kéo
      if (isTestTube && !isSnappedRef.current && thermometerRegistry.size > 0) {
        const myPos = rigidBodyRef.current.translation();
        for (const [thermoId, thermoBody] of thermometerRegistry) {
          // Bỏ qua nếu nhiệt kế này đã có một ống nghiệm khác bám vào
          if (occupiedThermometers.has(thermoId) && occupiedThermometers.get(thermoId) !== droppedItem.id) {
            continue;
          }

          const tp = thermoBody.translation();
          const dx = myPos.x - tp.x;
          const dy = myPos.y - tp.y;
          const dz = myPos.z - tp.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < SNAP_RADIUS) {
            const finalX = tp.x - 0.0263;
            const finalY = tp.y + SNAP_OFFSET_Y;
            const finalZ = tp.z + 0.385;

            // Nâng Y từ vị trí hiện tại (giữ nguyên X, Z)
            const liftY = finalY + 0.35;
            rigidBodyRef.current.setTranslation(
              { x: myPos.x, y: liftY, z: myPos.z },
              true,
            );
            rigidBodyRef.current.setBodyType(2, true); // kinematicPosition
            rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
            rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);

            // Khởi động animation ease-down (từ liftY → finalY, X/Z dồn về final)
            snapAnimRef.current = {
              active: true,
              startY: liftY,
              targetY: finalY,
              snapX: finalX,
              snapZ: finalZ,
              t: 0,
            };

            snappedToBodyRef.current = thermoBody;
            snappedToThermoIdRef.current = thermoId;
            occupiedThermometers.set(thermoId, droppedItem.id);

            isSnappedRef.current = true;
            setIsSnapped(true);
            setIsDragging(false);
            setIsHovered(false);
            onDragChange?.(false);
            gl.domElement.style.cursor = "auto";

            // Dispatch synthetic pointerup để OrbitControls reset trạng thái drag
            {
              const pid = activePointerRef.current?.pointerId ?? 1;
              // Release capture trước
              if (activePointerRef.current) {
                try { activePointerRef.current.target.releasePointerCapture(pid); } catch { /* ignore */ }
                activePointerRef.current = null;
              }
              // Dispatch pointerup lên canvas để OrbitControls dừng rotate
              try {
                gl.domElement.dispatchEvent(
                  new PointerEvent("pointerup", { pointerId: pid, bubbles: true, cancelable: true }),
                );
              } catch { /* ignore */ }
            }

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
      // Bỏ qua chuột phải – để onContextMenu xử lý
      if (e.nativeEvent.button === 2) return;

      // DETACH snap chỉ khi KHÔNG đang cầm chất
      // (nếu cầm chất thì click là để đổ bột, không phải kéo ống)
      if (isTestTube && isSnappedRef.current && !heldSubstance) {
        if (snappedToThermoIdRef.current) {
          occupiedThermometers.delete(snappedToThermoIdRef.current);
          snappedToThermoIdRef.current = null;
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
    [gl.domElement, onDragChange, dragPlane, isTestTube, heldSubstance],
  );

  // ─── Pointer Up: dừng kéo ─────────────────────────────────────────────────
  const handlePointerUp = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();

      const target = e.target as HTMLElement;
      if (target.releasePointerCapture) {
        target.releasePointerCapture(e.pointerId);
      }
      activePointerRef.current = null;

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

  // ─── Right-click: lưu vào store để ExperimentPopup render menu ───────────
  const handleContextMenu = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      e.nativeEvent.preventDefault();
      setContextMenu({ x: e.nativeEvent.clientX, y: e.nativeEvent.clientY, itemId: droppedItem.id });
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
    [isTestTube, heldSubstance, addSubstanceToTestTube, droppedItem.id, setHeldSubstance, testTubeContents],
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
      colliders={isSnapped ? false : "cuboid"}
      collisionGroups={isTestTube ? CG_TEST_TUBE : CG_EQUIPMENT}
      name={droppedItem.equipmentId}
      gravityScale={isSnapped ? 0 : 1}
      lockRotations={true}
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
          playAnimations={droppedItem.equipmentId === EQUIPMENT_IDS.ALCOHOL_LAMP}
        />

        {/* Sau khi khuấy: hạt bột pha trộn của các layer đã khuấy */}
        {isTestTube && isStirred && mixedContents.length > 0 && (
          <StirredLayer
            key={`stirred-${mixedContents.length}`}
            items={mixedContents}
            totalGrams={getGrams(mixedContents)}
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
              <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#a78bfa", borderBottom: "1px dashed #4b5563", paddingBottom: "2px", marginBottom: "1px" }}>
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
                  color: SUBSTANCE_COLORS[subId] ?? "#e5e7eb",
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
        <Html position={[0, 0.1, 0]} center style={{ pointerEvents: "none", userSelect: "none" }}>
          <div style={{
            background: "rgba(239,68,68,0.92)",
            color: "#fff",
            borderRadius: "6px",
            padding: "4px 10px",
            fontSize: "11px",
            fontFamily: "sans-serif",
            fontWeight: 600,
            whiteSpace: "nowrap",
            boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
          }}>
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
}: {
  modelPath: string;
  isHovered: boolean;
  isDragging: boolean;
  isSnapped: boolean;
  isHighlighted?: boolean;
  isGlass?: boolean;
  isFullHighlight?: boolean;
  playAnimations?: boolean;
}) => {
  const { scene, animations } = useGLTF(modelPath);
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

  // Play animations (chỉ cho những model có flag playAnimations)
  const { actions, mixer } = useAnimations(animations, clonedScene);
  useEffect(() => {
    if (!playAnimations || !actions || Object.keys(actions).length === 0) return;
    Object.values(actions).forEach((action) => {
      if (action) action.reset().play();
    });
    return () => { mixer.stopAllAction(); };
  }, [playAnimations, actions, mixer]);

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
        armatureRef.current = child;
      }
    });
  }, [clonedScene]);

  useMemo(() => {
    clonedScene.traverse((child) => {
      if (!(child instanceof THREE.Mesh) || !child.material) return;

      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material];

      const cloned = materials.map((mat) => {
        const m = mat.clone();

        // Chỉ set emissive nếu material hỗ trợ
        if (!("emissive" in m)) {
          // Vẫn set transparent cho vật liệu không có emissive nếu là glass
          if (isGlass) {
            m.transparent = true;
            m.opacity = 0.3;
            if ("depthWrite" in m) m.depthWrite = false;
          }
          return m;
        }

        // Emissive theo trạng thái
        if (isDragging) {
          m.emissive = new THREE.Color("#ffaa00");
          m.emissiveIntensity = 0.5;
        } else if (isFullHighlight) {
          // Đỏ: ống đầy, không có thể đổ thêm
          m.emissive = new THREE.Color("#ef4444");
          m.emissiveIntensity = 0.55;
        } else if (isHighlighted) {
          m.emissive = new THREE.Color("#fbbf24");
          m.emissiveIntensity = 0.6;
        } else if (isSnapped) {
          m.emissive = new THREE.Color("#a0c4e8");
          m.emissiveIntensity = 0.12;
        } else if (isHovered) {
          m.emissive = new THREE.Color("#4488ff");
          m.emissiveIntensity = 0.3;
        } else {
          m.emissive = new THREE.Color("#a0c4e8");
          m.emissiveIntensity = 0.12;
        }

        // Glass effect — trong suốt như thủy tinh
        if (isGlass) {
          m.transparent = true;
          m.opacity = 0.35;
          if ("depthWrite" in m) m.depthWrite = false;
        }

        return m;
      });

      child.material = Array.isArray(child.material) ? cloned : cloned[0];
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
  }, [clonedScene, isHovered, isDragging, isSnapped, isHighlighted, isGlass, isFullHighlight]);

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
}

const PowderLayer = ({
  color, startGrams, amountGrams, totalGrams,
}: {
  color: string; startGrams: number; amountGrams: number; totalGrams: number;
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
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
        startY: TUBE_TOP_Y + 0.02 + Math.random() * 0.02,
        targetPos: t,
        color: color,
        delay: heightFrac * 1.5 + Math.random() * 0.4, // sequential pour delay
        currentY: TUBE_TOP_Y + 0.02 + Math.random() * 0.02,
        velY: -(Math.random() * 0.1 + 0.05),
        settled: false,
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

    for (let i = 0; i < grains.length; i++) {
      const g = grains[i];
      if (g.settled) continue;
      if (elapsed.current < g.delay) { allDone = false; continue; }
      allDone = false;
      needsUpdate = true;

      // Gravity
      g.velY -= 1.8 * dt; // gravity in model-space
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

      // Update instance matrix
      _dummyObj.position.set(g.targetPos.x, g.currentY, g.targetPos.z);
      // Phóng to hạt 3.5 lần khi đang rơi để dễ nhìn hơn, thu về kích thước chuẩn khi đã chạm vị trí
      const s = g.settled ? 1 : 2;
      _dummyObj.scale.set(s, s, s);
      _dummyObj.updateMatrix();
      meshRef.current.setMatrixAt(i, _dummyObj.matrix);
    }

    if (needsUpdate) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
    if (allDone) doneRef.current = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, grainRef.current!.length]} frustumCulled={false}>
      <sphereGeometry args={[STIR_GRAIN_R, 6, 6]} />
      <meshStandardMaterial roughness={0.85} metalness={0.05} />
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
}

const _dummyObj = new THREE.Object3D();
const _dummyColor = new THREE.Color();

const StirredLayer = ({
  items,
  totalGrams,
}: {
  items: TubeContent[];
  totalGrams: number;
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
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
    if (doneRef.current || !meshRef.current) return;
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

    const grains = grainRef.current!;
    const t = state.clock.getElapsedTime();

    for (let i = 0; i < grains.length; i++) {
      const g = grains[i];

      // Small swirling/vibrating effect around base position
      const dx = Math.sin(t * g.speed + g.phaseX) * g.radius * intensity;
      const dz = Math.cos(t * g.speed + g.phaseZ) * g.radius * intensity;

      // Update instance matrix
      _dummyObj.position.set(g.basePos.x + dx, g.basePos.y, g.basePos.z + dz);

      // Khởi tạo ngẫu nhiên scale chút xíu cho hạt có vẻ lấp lánh (sparkle) hoặc rung động nhẹ
      const scaleVariation = 1.0 + (Math.sin(t * 10 + g.phaseX) * 0.1 * intensity);
      _dummyObj.scale.set(scaleVariation, scaleVariation, scaleVariation);

      _dummyObj.updateMatrix();
      meshRef.current.setMatrixAt(i, _dummyObj.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, grainRef.current!.length]} frustumCulled={false}>
      <sphereGeometry args={[STIR_GRAIN_R, 6, 6]} />
      <meshStandardMaterial roughness={0.85} metalness={0.05} />
    </instancedMesh>
  );
};

