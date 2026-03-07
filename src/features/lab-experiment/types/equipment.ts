/**
 * Equipment types cho Lab Experiment
 */

import type { RigidBodyAutoCollider } from "@react-three/rapier";

export type EquipmentCategory = 'tools' | 'substances' | 'containers' | 'measuring';

export interface EquipmentItem {
  id: string;
  name: string;
  category: EquipmentCategory;
  modelPath: string; // Path to 3D model in public/models/
  thumbnail?: string; // Optional thumbnail icon
  mass?: number; // kg - dùng cho physics
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  rotation: { x:  number, y: number, z: number};
  isDraggable: boolean;
  maxStackCount?: number; // Nếu có thể stack
  description?: string;
  scale?: number; // Scale multiplier for 3D model (default: 1)
  isMagnetic?: boolean;
  hideInMenu?: boolean;
  physicalState?: 'powder' | 'solution' | 'solid';
  isExtractable?: boolean;
}

export interface DroppedItem {
  id: string; // Unique instance ID
  equipmentId: string; // Reference to equipment
  position: [number, number, number]; // World position on table
  rotation: [number, number, number];
  timestamp: number;
  collider: RigidBodyAutoCollider | false
}

export interface ExperimentState {
  isModalOpen: boolean;
  isCursorVisible: boolean;
  droppedItems: Map<string, DroppedItem>;
  selectedEquipmentId?: string;
}

export interface ExperimentEnvironmentProps {
  onItemDropped?: (item: DroppedItem) => void;
  onItemRemoved?: (itemId: string) => void;
}

export interface ProximityDetectorProps {
  tablePosition: [number, number, number];
  detectionRadius: number;
  onEnterProximity?: () => void;
  onExitProximity?: () => void;
  onInteract?: () => void;
}
