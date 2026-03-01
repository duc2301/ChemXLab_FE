import { create } from "zustand";
import type { DroppedItem, ExperimentState } from "../types/equipment";
import type { RigidBodyAutoCollider } from "@react-three/rapier";

export interface HeldSubstance {
  substanceId: string;
  name: string;
  color: string;
  amount: number;
}

export interface TubeContent {
  substanceId: string;
  amount: number;
}


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
  // ─── Powder pick-and-pour ────────────────────────────────────────────────────
  heldSubstance: HeldSubstance | null;
  setHeldSubstance: (sub: HeldSubstance | null) => void;
  testTubeContents: Map<string, TubeContent[]>; // testTubeInstanceId -> TubeContent[]
  addSubstanceToTestTube: (testTubeId: string, substanceId: string, amount?: number) => void;
  stirredTubes: Record<string, number>; // test tube IDs -> number of layers stirred
  stirTestTube: (testTubeId: string, layersCount: number) => void;
}

export const useExperimentStore = create<ExperimentStore>((set) => ({
  isModalOpen: false,
  isCursorVisible: false,
  droppedItems: new Map(),
  selectedEquipmentId: undefined,
  contextMenu: null,
  heldSubstance: null,
  testTubeContents: new Map(),
  stirredTubes: {},

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
      // Xóa luôn contents nếu là test tube
      const newContents = new Map(state.testTubeContents);
      newContents.delete(itemId);
      const newStirred = { ...state.stirredTubes };
      delete newStirred[itemId];
      return { droppedItems: newItems, testTubeContents: newContents, stirredTubes: newStirred };
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

  addSubstanceToTestTube: (testTubeId, substanceId, amount = 1) =>
    set((state) => {
      const newContents = new Map(state.testTubeContents);
      const existing = newContents.get(testTubeId) ?? [];
      const addedItem: TubeContent = { substanceId, amount };
      newContents.set(testTubeId, [...existing, addedItem]);
      return { testTubeContents: newContents };
    }),

  stirTestTube: (testTubeId, layersCount) =>
    set((state) => {
      const newStirred = { ...state.stirredTubes };
      newStirred[testTubeId] = layersCount;
      return { stirredTubes: newStirred };
    }),
}));
