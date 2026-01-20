import { Suspense, Component } from 'react';
import type { ReactNode } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import { EquipmentModel } from '../components/EquipmentModel';
import type { DroppedItem } from '../types/equipment';

interface ExperimentCanvasProps {
  onItemDropped?: (item: DroppedItem) => void;
  droppedItems?: Map<string, DroppedItem>;
}

// Error boundary for Canvas
class CanvasErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('Canvas error:', error);
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-900">
          <div className="text-center">
            <p className="text-red-400 mb-2">Lỗi khi tải canvas 3D</p>
            <p className="text-gray-400 text-sm">Vui lòng refresh trang hoặc đóng popup</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const TABLE_POSITION: [number, number, number] = [0, 0, 0];
const TABLE_SIZE: [number, number, number] = [2, 0.8, 2];

/**
 * Canvas content - được render bên trong <Canvas> từ ExperimentEnvironment
 */
const ExperimentCanvasContent = ({
  droppedItems,
}: ExperimentCanvasProps) => {
  useThree();

  return (
    <>
      {/* Lighting & Environment */}
      <Environment preset="studio" />
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 10, 7]}
        intensity={1}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        castShadow
      />

      {/* Camera điều khiển */}
      <OrbitControls
        makeDefault
        target={[0, 0.4, 0]}
        enablePan
        enableZoom
        enableRotate
      />

      {/* Physics World */}
      <Physics gravity={[0, -9.8, 0]} debug={false} paused={false}>
        {/* Mặt bàn chính */}
        <RigidBody type="fixed" position={TABLE_POSITION}>
          <CuboidCollider args={[TABLE_SIZE[0], TABLE_SIZE[1], TABLE_SIZE[2]]} />
          <mesh receiveShadow castShadow>
            <boxGeometry args={TABLE_SIZE} />
            <meshStandardMaterial color="#8B7355" roughness={0.8} />
          </mesh>
        </RigidBody>

        {/* Sàn */}
        <RigidBody type="fixed" position={[0, -2, 0]}>
          <CuboidCollider args={[10, 0.5, 10]} />
          <mesh receiveShadow>
            <boxGeometry args={[20, 1, 20]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
        </RigidBody>

        {/* Dropped items */}
        {droppedItems &&
          Array.from(droppedItems.values()).map((item) => (
            <EquipmentModel
              key={item.id}
              droppedItem={item}
              onRemove={() => {
                /* Xử lý xoá item nếu cần */
              }}
            />
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
        camera={{ position: [3, 2, 3], fov: 50 }}
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
