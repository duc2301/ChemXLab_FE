import { create } from "zustand";
import type { DroppedItem, ExperimentState } from "../types/equipment";
import type { RigidBodyAutoCollider } from "@react-three/rapier";
import { EQUIPMENT_IDS } from "./equipmentRegistry";

export interface HeldSubstance {
  substanceId: string;
  name: string;
  color: string;
  amount: number;
}

export interface TubeContent {
  substanceId: string;
  amount: number;
  instant?: boolean;
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
  removeDroppedItem: (itemId: string) => void;
  setSelectedEquipment: (id?: string) => void;
  setCollider: (id: string, value: RigidBodyAutoCollider | false) => void;
  contextMenu: { x: number; y: number; itemId: string } | null;
  setContextMenu: (
    menu: { x: number; y: number; itemId: string } | null,
  ) => void;
  // ─── Powder pick-and-pour ────────────────────────────────────────────────────
  heldSubstance: HeldSubstance | null;
  setHeldSubstance: (sub: HeldSubstance | null) => void;
  testTubeContents: Map<string, TubeContent[]>; // testTubeInstanceId -> TubeContent[]
  addSubstanceToTestTube: (
    testTubeId: string,
    substanceId: string,
    amount?: number,
  ) => void;
  stirredTubes: Record<string, number>; // test tube IDs -> number of layers stirred
  stirTestTube: (testTubeId: string, layersCount: number) => void;
  alcoholLampStatus: Map<string, boolean>; // instanceId -> isBurning
  toggleAlcoholLamp: (id: string) => void;
  reactionProgress: Map<string, number>; // tubeId -> progress (0 to 1)
  updateReactionProgress: (tubeId: string, progressDelta: number) => void;
  finishReaction: (tubeId: string, resultingSubstanceId: string) => void;
  getFreeIronAmount: (tubeId: string, resultingSubstanceId: string) => number;
  clearItems: () => void;
}

export const useExperimentStore = create<ExperimentStore>((set, get) => ({
  isModalOpen: false,
  isCursorVisible: false,
  droppedItems: new Map(),
  selectedEquipmentId: undefined,
  contextMenu: null,
  heldSubstance: null,
  testTubeContents: new Map(),
  stirredTubes: {},
  reactionProgress: new Map(),

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
      const newContents = new Map(state.testTubeContents);
      newContents.delete(itemId);
      const newStirred = { ...state.stirredTubes };
      delete newStirred[itemId];
      const newLampStatus = new Map(state.alcoholLampStatus);
      newLampStatus.delete(itemId);
      const newReactionProgress = new Map(state.reactionProgress);
      newReactionProgress.delete(itemId);
      return {
        droppedItems: newItems,
        testTubeContents: newContents,
        alcoholLampStatus: newLampStatus,
        stirredTubes: newStirred,
        reactionProgress: newReactionProgress,
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

  updateReactionProgress: (tubeId, progressDelta) =>
    set((state) => {
      const newProgress = new Map(state.reactionProgress);
      const current = newProgress.get(tubeId) ?? 0;
      const next = Math.min(1, current + progressDelta);
      newProgress.set(tubeId, next);
      return { reactionProgress: newProgress };
    }),

  finishReaction: (tubeId, resultingSubstanceId) =>
    set((state) => {
      const newContents = new Map(state.testTubeContents);
      const currentContents = newContents.get(tubeId) ?? [];
      
      const fe = currentContents.find(c => c.substanceId === EQUIPMENT_IDS.FE_POWDER)?.amount || 0;
      const s = currentContents.find(c => c.substanceId === EQUIPMENT_IDS.S_POWDER)?.amount || 0;

      // Tỉ lệ Fe:S là 7:4 (56:32)
      const reactedS = Math.min(s, fe / 1.75);
      const reactedFe = reactedS * 1.75;
      const producedFeS = reactedFe + reactedS;

      const finalContents: TubeContent[] = [
        { substanceId: resultingSubstanceId, amount: producedFeS, instant: true }
      ];

      // Nếu sắt dư, giữ lại sắt trong ống
      if (fe > reactedFe + 0.05) {
        finalContents.push({ substanceId: EQUIPMENT_IDS.FE_POWDER, amount: fe - reactedFe });
      }
      
      // Nếu lưu huỳnh dư
      if (s > reactedS + 0.05) {
        finalContents.push({ substanceId: EQUIPMENT_IDS.S_POWDER, amount: s - reactedS });
      }

      newContents.set(tubeId, finalContents);
      
      const newProgress = new Map(state.reactionProgress);
      newProgress.set(tubeId, 0);

      return {
        testTubeContents: newContents,
        reactionProgress: newProgress,
      };
    }),

  getFreeIronAmount: (tubeId: string) => {
    const contents = get().testTubeContents.get(tubeId) || [];
    const progress = get().reactionProgress.get(tubeId) ?? 0;

    const feItem = contents.find((c) => c.substanceId === EQUIPMENT_IDS.FE_POWDER);
    if (!feItem) return 0;

    // Lượng sắt chưa phản ứng = Tổng sắt hiện có * (1 - tiến trình phản ứng)
    // Lưu ý: Nếu đã finishReaction và còn sắt dư, progress lúc đó = 0, hàm sẽ trả về toàn bộ sắt dư.
    return feItem.amount * (1 - progress);
  },

  clearItems: () =>
    set({
      droppedItems: new Map(),
      alcoholLampStatus: new Map(),
      heldSubstance: null,
      contextMenu: null,
      reactionProgress: new Map(),
    }),
}));
