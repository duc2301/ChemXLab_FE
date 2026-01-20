import { Suspense, useRef } from 'react';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import { useGLTF } from '@react-three/drei';
import type { DroppedItem } from '../types/equipment';
import { getEquipmentById } from '../services/equipmentRegistry';

interface EquipmentModelProps {
  droppedItem: DroppedItem;
  onRemove?: (itemId: string) => void;
}

/**
 * 3D Model component cho từng dropped item
 * Sử dụng physics để đặt trên bàn
 */
export const EquipmentModel = ({ droppedItem }: EquipmentModelProps) => {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const equipment = getEquipmentById(droppedItem.equipmentId);

  if (!equipment) {
    console.warn(`Equipment not found: ${droppedItem.equipmentId}`);
    return null;
  }

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="dynamic"
      position={droppedItem.position}
      rotation={droppedItem.rotation}
      mass={equipment.mass || 0.1}
      colliders="cuboid"
      restitution={0.3}
      friction={0.8}
    >
      <Suspense fallback={null}>
        <Model modelPath={equipment.modelPath} />
      </Suspense>
    </RigidBody>
  );
};

/**
 * Helper component để load GLTF model
 */
const Model = ({ modelPath }: { modelPath: string }) => {
  const { scene } = useGLTF(modelPath);

  // Clone scene để tránh reuse issues
  const clonedScene = scene.clone();

  return (
    <primitive object={clonedScene} />
  );
};

// Preload common models
useGLTF.preload('/models/beaker_100ml.glb');
useGLTF.preload('/models/test_tube.glb');
useGLTF.preload('/models/thermometer.glb');
