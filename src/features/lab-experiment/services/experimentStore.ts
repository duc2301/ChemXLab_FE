import { create } from 'zustand';
import type { DroppedItem, ExperimentState } from '../types/equipment';

interface ExperimentStore extends ExperimentState {
  openModal: () => void;
  closeModal: () => void;
  toggleCursor: () => void;
  setCursorVisible: (visible: boolean) => void;
  addDroppedItem: (item: DroppedItem) => void;
  updateDroppedItem: (itemId: string, updates: Partial<DroppedItem>) => void;
  removeDroppedItem: (itemId: string) => void;
  setSelectedEquipment: (id?: string) => void;
}

export const useExperimentStore = create<ExperimentStore>((set) => ({
  isModalOpen: false,
  isCursorVisible: false,
  droppedItems: new Map(),
  selectedEquipmentId: undefined,

  openModal: () =>
    set({
      isModalOpen: true,
      isCursorVisible: true,
    }),

  closeModal: () =>
    set({
      isModalOpen: false,
      isCursorVisible: false,
    }),

  toggleCursor: () =>
    set((state) => ({
      isCursorVisible: !state.isCursorVisible,
    })),

  setCursorVisible: (visible: boolean) =>
    set({
      isCursorVisible: visible,
    }),

  addDroppedItem: (item: DroppedItem) =>
    set((state) => {
      console.log('Adding item to store:', item.id, item.position);
      const newItems = new Map(state.droppedItems);
      newItems.set(item.id, item);
      return { droppedItems: newItems };
    }),

  updateDroppedItem: (itemId: string, updates: Partial<DroppedItem>) =>
    set((state) => {
      const item = state.droppedItems.get(itemId);
      if (!item) return state;

      console.log(`Updating item ${itemId}:`, updates);
      const newItems = new Map(state.droppedItems);
      newItems.set(itemId, { ...item, ...updates });
      return { droppedItems: newItems };
    }),

  removeDroppedItem: (itemId: string) =>
    set((state) => {
      const newItems = new Map(state.droppedItems);
      newItems.delete(itemId);
      return { droppedItems: newItems };
    }),

  setSelectedEquipment: (id?: string) =>
    set({
      selectedEquipmentId: id,
    }),
}));
