import { create } from "zustand";
import type { DroppedItem, ExperimentState } from "../types/equipment";
import type { RigidBodyAutoCollider } from "@react-three/rapier";

interface ExperimentStore extends ExperimentState {
  openModal: () => void;
  closeModal: () => void;
  toggleCursor: () => void;
  setCursorVisible: (visible: boolean) => void;
  addDroppedItem: (item: DroppedItem) => void;
  removeDroppedItem: (itemId: string) => void;
  setSelectedEquipment: (id?: string) => void;
  setCollider: (id: string, value: RigidBodyAutoCollider | false) => void;
  contextMenu: { x: number; y: number; itemId: string } | null;
  setContextMenu: (menu: { x: number; y: number; itemId: string } | null) => void;
}

export const useExperimentStore = create<ExperimentStore>((set) => ({
  isModalOpen: false,
  isCursorVisible: false,
  droppedItems: new Map(),
  selectedEquipmentId: undefined,
  contextMenu: null,

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
      const newItems = new Map(state.droppedItems);
      newItems.set(item.id, item);
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

  setCollider: (id: string, value: RigidBodyAutoCollider | false) =>
    set((state) => {
      const newItems = new Map(state.droppedItems);
      const item = newItems.get(id);
      if (item) {
        const droppedItem: DroppedItem = {
          id: item.id,
          equipmentId: item.id,
          position: item.position, // Y = above table for physics drop
          rotation: item.position, // Random rotation
          timestamp: item.timestamp,
          collider: value,
        };
        newItems.set(id, droppedItem);
      }

      return { droppedItems: newItems };
    }),

  setContextMenu: (menu) => set({ contextMenu: menu }),
}));
