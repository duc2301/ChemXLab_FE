import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import type { ReactNode } from "react";
import { Component, Suspense, useMemo, useState } from "react";
import { EquipmentModel } from "../components/EquipmentModel";
import type { DroppedItem } from "../types/equipment";

interface ExperimentCanvasProps {
  onItemDropped?: (item: DroppedItem) => void;
  droppedItems?: Map<string, DroppedItem>;
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

/**
 * Realistic Lab Table - white ceramic top with metal frame
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
      {/* White ceramic table top - like real lab tables */}
      <RigidBody
        type="fixed"
        position={[0, TABLE_HEIGHT, 0]}
        name="table-surface"
      >
        <CuboidCollider
          args={[
            TABLE_TOP_SIZE[0] / 2,
            TABLE_TOP_SIZE[1] / 2,
            TABLE_TOP_SIZE[2] / 2,
          ]}
        />
        <mesh receiveShadow castShadow>
          <boxGeometry args={TABLE_TOP_SIZE} />
          <meshStandardMaterial
            color="#d4d4d4"
            roughness={0.35}
            metalness={0}
          />
        </mesh>

        {/* Raised edge around table (spill containment) */}
        <mesh position={[0, TABLE_TOP_SIZE[1] / 2 + 0.015, 0]} receiveShadow>
          <boxGeometry
            args={[TABLE_TOP_SIZE[0] + 0.04, 0.03, TABLE_TOP_SIZE[2] + 0.04]}
          />
          <meshStandardMaterial color="#c0c0c0" roughness={0.3} />
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
 * Floor with subtle grid pattern
 */
const LabFloor = () => {
  return (
    <RigidBody type="fixed" position={[0, -0.05, 0]} name="lab-floor">
      <CuboidCollider args={[10, 0.05, 10]} name="lab-floor" />
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1f2937" roughness={0.9} />
      </mesh>
    </RigidBody>
  );
};

/**
 * Canvas content - được render bên trong <Canvas> từ ExperimentEnvironment
 */
const ExperimentCanvasContent = ({ droppedItems }: ExperimentCanvasProps) => {
  useThree();

  // Track if any object is being dragged - used to disable camera controls
  const [isDragging, setIsDragging] = useState(false);

  return (
    <>
      {/* Lighting & Environment */}
      <Environment preset="studio" />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.2}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        castShadow
      />
      <pointLight position={[-3, 3, 0]} intensity={0.3} color="#88ccff" />

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

      {/* Physics World */}
      <Physics gravity={[0, -9.8, 0]} debug={false} paused={false}>
        {/* Lab Table */}
        <LabTable />

        {/* Lab Floor */}
        <LabFloor />

        <group position={[0, 0, 0]}>
          {/* Dropped items - drag to move on table */}
          {droppedItems &&
            Array.from(droppedItems.values()).map((item) => (
              <EquipmentModel
                key={item.id}
                droppedItem={item}
                tableHeight={TABLE_HEIGHT + TABLE_TOP_SIZE[1] / 2}
                onDragChange={setIsDragging}
              />
            ))}
        </group>
      </Physics>
    </>
  );
};

/**
 * Experiment Environment - Canvas wrapper với physics setup
 */
export const ExperimentEnvironment = ({
  onItemDropped,
  droppedItems,
}: ExperimentCanvasProps) => {
  return (
    <CanvasErrorBoundary>
      <Canvas
        shadows
        gl={{
          antialias: true,
          stencil: false,
          depth: true,
        }}
        camera={{ position: [0, 2.5, 5], fov: 50 }}
      >
        <Suspense fallback={null}>
          <ExperimentCanvasContent
            onItemDropped={onItemDropped}
            droppedItems={droppedItems}
          />
        </Suspense>
      </Canvas>
    </CanvasErrorBoundary>
  );
};

// Preload table model if available
try {
  useGLTF.preload("/models/table.glb");
} catch {
  // Ignore preload errors
}
