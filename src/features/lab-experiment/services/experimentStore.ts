import { create } from "zustand";
import type { DroppedItem, ExperimentState } from "../types/equipment";
import type { RigidBodyAutoCollider } from "@react-three/rapier";

export interface HeldSubstance {
  substanceId: string;
  name: string;
  color: string;
}

export interface AlcoholLampData {
  id: string;
  name: string;
  status: boolean;
}

interface ExperimentStore extends ExperimentState {
  openModal: () => void;
  closeModal: () => void;
  toggleCursor: () => void;
  setCursorVisible: (visible: boolean) => void;
  addDroppedItem: (item: DroppedItem) => void;
  updateDroppedItem: (itemId: string, updates: Partial<DroppedItem>) => void;
  removeDroppedItem: (itemId: string) => void;
  setSelectedEquipment: (id?: string) => void;
  setCollider: (id: string, value: RigidBodyAutoCollider | false) => void;
  contextMenu: { x: number; y: number; itemId: string } | null;
  setContextMenu: (menu: { x: number; y: number; itemId: string } | null) => void;
  // ─── Powder pick-and-pour ────────────────────────────────────────────────────
  heldSubstance: HeldSubstance | null;
  setHeldSubstance: (sub: HeldSubstance | null) => void;
  testTubeContents: Map<string, string[]>; // testTubeInstanceId -> substanceId[]
  addSubstanceToTestTube: (testTubeId: string, substanceId: string) => void;
  alcoholLampStatus: Map<string, boolean>; // instanceId -> isBurning
  toggleAlcoholLamp: (id: string) => void;
}

export const useExperimentStore = create<ExperimentStore>((set) => ({
  isModalOpen: false,
  isCursorVisible: false,
  droppedItems: new Map(),
  selectedEquipmentId: undefined,
  contextMenu: null,
  heldSubstance: null,
  testTubeContents: new Map(),

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
      const newContents = new Map(state.testTubeContents);
      newContents.delete(itemId);
      // Xóa trạng thái đèn khi xóa vật thể
      const newLampStatus = new Map(state.alcoholLampStatus);
      newLampStatus.delete(itemId);
      return { 
        droppedItems: newItems, 
        testTubeContents: newContents, 
        alcoholLampStatus: newLampStatus 
      };
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
          position: item.position,
          rotation: item.position,
          timestamp: item.timestamp,
          collider: value,
        };
        newItems.set(id, droppedItem);
      }
      return { droppedItems: newItems };
    }),

  setContextMenu: (menu) => set({ contextMenu: menu }),

  setHeldSubstance: (sub) => set({ heldSubstance: sub }),
  alcoholLampStatus: new Map(),

  toggleAlcoholLamp: (id) =>
    set((state) => {
      const newStatus = new Map(state.alcoholLampStatus);
      const current = newStatus.get(id) ?? false;
      newStatus.set(id, !current);
      return { alcoholLampStatus: newStatus };
    }),

  addSubstanceToTestTube: (testTubeId, substanceId) =>
    set((state) => {
      const newContents = new Map(state.testTubeContents);
      const existing = newContents.get(testTubeId) ?? [];
      newContents.set(testTubeId, [...existing, substanceId]);
      return { testTubeContents: newContents };
    }),
}));
