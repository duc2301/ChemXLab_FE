// Lab Experiment Feature - Tính năng thí nghiệm trong phòng lab

// Components
export { ExperimentPopup } from './ui/ExperimentPopup';
export { EquipmentPanel } from './components/EquipmentPanel';
export { EquipmentModel } from './components/EquipmentModel';
export { InteractionPrompt } from './components/InteractionPrompt';
export { ProximityDetector } from './components/ProximityDetector';

// UI
export { ExperimentEnvironment } from './ui/ExperimentEnvironment';

// Hooks
export { useProximityDetection } from './hooks/useProximityDetection';

// Services
export { useExperimentStore } from './services/experimentStore';
export {
  EQUIPMENT_REGISTRY,
  getEquipmentByCategory,
  getEquipmentById,
  getAllCategories,
} from './services/equipmentRegistry';

// Types
export type {
  EquipmentCategory,
  EquipmentItem,
  DroppedItem,
  ExperimentState,
  ExperimentEnvironmentProps,
  ProximityDetectorProps,
} from './types/equipment';
