import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import type { ReactNode } from "react";
import { Component, Suspense, useMemo, useState } from "react";
import { EquipmentModel } from "../components/EquipmentModel";
import { EQUIPMENT_REGISTRY } from "../services/equipmentRegistry";
import { useExperimentStore } from "../services/experimentStore";
import type { DroppedItem } from "../types/equipment";

interface ExperimentCanvasProps {
  onItemDropped?: (item: DroppedItem) => void;
}

// Error boundary for Canvas
class CanvasErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error("Canvas error:", error);
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-900">
          <div className="text-center">
            <p className="text-red-400 mb-2">Lỗi khi tải canvas 3D</p>
            <p className="text-gray-400 text-sm">
              Vui lòng refresh trang hoặc đóng popup
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Table dimensions - realistic lab table
const TABLE_TOP_SIZE: [number, number, number] = [6, 0.08, 3]; // width, thickness, depth
const TABLE_HEIGHT = 0.85; // Height of table surface from ground (~85cm)
const LEG_SIZE: [number, number, number] = [
  0.08,
  TABLE_HEIGHT - TABLE_TOP_SIZE[1],
  0.08,
];

// Lab room dimensions
const ROOM_WIDTH = 14;
const ROOM_DEPTH = 10;
const ROOM_HEIGHT = 5;

/**
 * Lab Room - walls, ceiling, and fluorescent lights
 */
const LabRoom = () => {
  const WALL_COLOR = "#9aa3ad";
  const CEILING_COLOR = "#bcc3cb";

  return (
    <group>
      {/* === WALLS === */}
      {/* Back wall */}
      <mesh position={[0, ROOM_HEIGHT / 2, -ROOM_DEPTH / 2]}>
        <planeGeometry args={[ROOM_WIDTH, ROOM_HEIGHT]} />
        <meshBasicMaterial color={WALL_COLOR} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[ROOM_DEPTH, ROOM_HEIGHT]} />
        <meshBasicMaterial color={WALL_COLOR} />
      </mesh>
      {/* Right wall */}
      <mesh position={[ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[ROOM_DEPTH, ROOM_HEIGHT]} />
        <meshBasicMaterial color={WALL_COLOR} />
      </mesh>
      {/* Front wall (behind camera) */}
      <mesh position={[0, ROOM_HEIGHT / 2, ROOM_DEPTH / 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[ROOM_WIDTH, ROOM_HEIGHT]} />
        <meshBasicMaterial color={WALL_COLOR} />
      </mesh>

      {/* === CEILING === */}
      <mesh position={[0, ROOM_HEIGHT, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshBasicMaterial color={CEILING_COLOR} />
      </mesh>

      {/* === FLUORESCENT CEILING LIGHTS === */}
      {[-1.5, 1.5].map((x) => (
        <group key={x} position={[x, ROOM_HEIGHT - 0.05, 0]}>
          {/* Light fixture housing */}
          <mesh>
            <boxGeometry args={[0.3, 0.05, 2.5]} />
            <meshBasicMaterial color="#788490" />
          </mesh>
          {/* Light panel (glowing) */}
          <mesh position={[0, -0.03, 0]}>
            <boxGeometry args={[0.25, 0.01, 2.3]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
          </mesh>
          {/* Light source */}
          <rectAreaLight
            width={0.25}
            height={2.3}
            intensity={3}
            color="#f0f4ff"
            position={[0, -0.05, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          />
        </group>
      ))}
    </group>
  );
};

/**
 * Realistic Lab Table - ceramic top with metal frame
 * Giống bàn thí nghiệm thực tế
 */
const LabTable = () => {
  const legPositions: [number, number, number][] = useMemo(
    () => [
      [
        -TABLE_TOP_SIZE[0] / 2 + 0.2,
        (TABLE_HEIGHT - TABLE_TOP_SIZE[1]) / 2,
        -TABLE_TOP_SIZE[2] / 2 + 0.2,
      ],
      [
        TABLE_TOP_SIZE[0] / 2 - 0.2,
        (TABLE_HEIGHT - TABLE_TOP_SIZE[1]) / 2,
        -TABLE_TOP_SIZE[2] / 2 + 0.2,
      ],
      [
        -TABLE_TOP_SIZE[0] / 2 + 0.2,
        (TABLE_HEIGHT - TABLE_TOP_SIZE[1]) / 2,
        TABLE_TOP_SIZE[2] / 2 - 0.2,
      ],
      [
        TABLE_TOP_SIZE[0] / 2 - 0.2,
        (TABLE_HEIGHT - TABLE_TOP_SIZE[1]) / 2,
        TABLE_TOP_SIZE[2] / 2 - 0.2,
      ],
    ],
    [],
  );

  return (
    <group>
      {/* Lab table top - medium gray for contrast with glass/metal equipment */}
      <RigidBody type="fixed" position={[0, TABLE_HEIGHT, 0]} name="table-surface">
        <CuboidCollider args={[TABLE_TOP_SIZE[0] / 2, TABLE_TOP_SIZE[1] / 2, TABLE_TOP_SIZE[2] / 2]} />
        <mesh receiveShadow castShadow>
          <boxGeometry args={TABLE_TOP_SIZE} />
          <meshStandardMaterial
            color="#b8c0c8"
            roughness={0.4}
            metalness={0.05}
          />
        </mesh>

        {/* Raised edge around table (spill containment) */}
        <mesh position={[0, TABLE_TOP_SIZE[1] / 2 + 0.015, 0]} receiveShadow>
          <boxGeometry args={[TABLE_TOP_SIZE[0] + 0.04, 0.03, TABLE_TOP_SIZE[2] + 0.04]} />
          <meshStandardMaterial color="#9ca3af" roughness={0.3} metalness={0.3} />
        </mesh>

        {/* Metal frame under table top */}
        <mesh position={[0, -TABLE_TOP_SIZE[1] / 2 - 0.025, 0]} receiveShadow>
          <boxGeometry
            args={[TABLE_TOP_SIZE[0] - 0.1, 0.05, TABLE_TOP_SIZE[2] - 0.1]}
          />
          <meshStandardMaterial
            color="#4a5568"
            roughness={0.4}
            metalness={0.6}
          />
        </mesh>
      </RigidBody>

      {/* Metal table legs */}
      {legPositions.map((pos, index) => (
        <RigidBody key={index} type="fixed" position={pos} name="table-surface">
          <mesh receiveShadow castShadow>
            <boxGeometry args={LEG_SIZE} />
            <meshStandardMaterial
              color="#4a5568"
              roughness={0.4}
              metalness={0.6}
            />
          </mesh>
        </RigidBody>
      ))}

      {/* Support bars connecting legs */}
      <RigidBody
        type="fixed"
        position={[0, 0.25, -TABLE_TOP_SIZE[2] / 2 + 0.2]}
        name="table-surface"
      >
        <mesh receiveShadow>
          <boxGeometry args={[TABLE_TOP_SIZE[0] - 0.4, 0.04, 0.04]} />
          <meshStandardMaterial
            color="#4a5568"
            roughness={0.4}
            metalness={0.6}
          />
        </mesh>
      </RigidBody>
      <RigidBody
        type="fixed"
        position={[0, 0.25, TABLE_TOP_SIZE[2] / 2 - 0.2]}
        name="table-surface"
      >
        <mesh receiveShadow>
          <boxGeometry args={[TABLE_TOP_SIZE[0] - 0.4, 0.04, 0.04]} />
          <meshStandardMaterial
            color="#4a5568"
            roughness={0.4}
            metalness={0.6}
          />
        </mesh>
      </RigidBody>

      {/* Side support bars */}
      <RigidBody
        type="fixed"
        position={[-TABLE_TOP_SIZE[0] / 2 + 0.2, 0.25, 0]}
        name="table-surface"
      >
        <mesh receiveShadow>
          <boxGeometry args={[0.04, 0.04, TABLE_TOP_SIZE[2] - 0.4]} />
          <meshStandardMaterial
            color="#4a5568"
            roughness={0.4}
            metalness={0.6}
          />
        </mesh>
      </RigidBody>
      <RigidBody
        type="fixed"
        position={[TABLE_TOP_SIZE[0] / 2 - 0.2, 0.25, 0]}
        name="table-surface"
      >
        <mesh receiveShadow>
          <boxGeometry args={[0.04, 0.04, TABLE_TOP_SIZE[2] - 0.4]} />
          <meshStandardMaterial
            color="#4a5568"
            roughness={0.4}
            metalness={0.6}
          />
        </mesh>
      </RigidBody>
    </group>
  );
};

/**
 * Lab floor - light tile pattern
 */
const LabFloor = () => {
  return (
    <RigidBody type="fixed" position={[0, -0.05, 0]} name="lab-floor">
      <CuboidCollider args={[10, 0.05, 10]} name='lab-floor' />
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshBasicMaterial color="#a0a8b0" />
      </mesh>
    </RigidBody>
  );
};

/**
 * Canvas content - được render bên trong <Canvas> từ ExperimentEnvironment
 */
const ExperimentCanvasContent = ({ onItemDropped: _ }: ExperimentCanvasProps) => {
  useThree();

  // Đọc trực tiếp từ store để tránh Canvas re-mount khi ExperimentPopup re-render
  const droppedItems = useExperimentStore((s) => s.droppedItems);
  const removeDroppedItem = useExperimentStore((s) => s.removeDroppedItem);

  // Track if any object is being dragged - used to disable camera controls
  const [isDragging, setIsDragging] = useState(false);

  return (
    <>
      {/* Lighting - realistic lab room */}
      <Environment preset="apartment" background={false} />
      <ambientLight intensity={0.45} color="#f0f4ff" />
      <directionalLight
        position={[3, 8, 5]}
        intensity={1.0}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        castShadow
      />
      {/* Fill light from front */}
      <directionalLight position={[-2, 4, 6]} intensity={0.5} color="#e8ecf0" />
      {/* Soft side lights */}
      <pointLight position={[-4, 3, 0]} intensity={0.3} color="#e0e8ff" />
      <pointLight position={[4, 3, 0]} intensity={0.3} color="#e0e8ff" />

      {/* Camera điều khiển - disabled when dragging objects */}
      <OrbitControls
        makeDefault
        enabled={!isDragging}
        target={[0, TABLE_HEIGHT + 0.3, 0]}
        enablePan
        enableZoom
        enableRotate
        zoomSpeed={1.2}
        panSpeed={0.8}
        rotateSpeed={0.6}
      />

      {/* Lab Room (walls, ceiling, lights) */}
      <LabRoom />

      {/* Physics World */}
      <Physics gravity={[0, -9.8, 0]} debug={false} paused={false}>
        {/* Lab Table */}
        <LabTable />

        {/* Lab Floor */}
        <LabFloor />

        {droppedItems &&
          Array.from(droppedItems.values()).map((item) => (
            <Suspense key={item.id} fallback={null}>
              <EquipmentModel
                droppedItem={item}
                onDragChange={setIsDragging}
                onRemove={removeDroppedItem}
              />
            </Suspense>
          ))}
      </Physics>
    </>
  );
};

/**
 * Experiment Environment - Canvas wrapper với physics setup
 */
export const ExperimentEnvironment = ({
  onItemDropped,
}: Omit<ExperimentCanvasProps, 'droppedItems' | 'onRemove'>) => {
  return (
    <CanvasErrorBoundary>
      <Canvas
        shadows
        gl={{
          antialias: true,
          stencil: false,
          depth: true,
        }}
        camera={{ position: [0, 2.5, 4], fov: 50 }}
        style={{ background: '#9aa3ad' }}
      >
        {/* Không dùng Suspense bao quanh toàn bộ content — sẽ gây flash đen khi model load */}
        <ExperimentCanvasContent onItemDropped={onItemDropped} />
      </Canvas>
    </CanvasErrorBoundary>
  );
};

// Preload tất cả model đã đăng ký để useGLTF không suspend khi drop
EQUIPMENT_REGISTRY.forEach((item) => {
  try { useGLTF.preload(item.modelPath); } catch { /* ignore */ }
});
