// Lab Experiment Feature - Tính năng thí nghiệm trong phòng lab

// Components
export { EquipmentModel } from './components/EquipmentModel';
export { EquipmentPanel } from './components/EquipmentPanel';
export { InteractionPrompt } from './components/InteractionPrompt';
export { ProximityDetector } from './components/ProximityDetector';
export { ExperimentPopup } from './ui/ExperimentPopup';

// UI
export { ExperimentEnvironment } from './ui/ExperimentEnvironment';

// Hooks
export { useProximityDetection } from './hooks/useProximityDetection';

// Services
export {
  EQUIPMENT_REGISTRY, getAllCategories, getEquipmentByCategory,
  getEquipmentById
} from './services/equipmentRegistry';
export { useExperimentStore } from './services/experimentStore';

// Types
export type {
  DroppedItem, EquipmentCategory,
  EquipmentItem, ExperimentEnvironmentProps, ExperimentState, ProximityDetectorProps
} from './types/equipment';
