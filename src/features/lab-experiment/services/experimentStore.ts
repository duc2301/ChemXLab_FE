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
  snapTargetId: string | null;
  setSnapTargetId: (id: string | null) => void;
  clearItems: () => void;
  unstirTestTube: (tubeId: string) => void;
  triggerPrecipitation: (tubeId: string) => void;
  removeSubstanceFromTestTube: (tubeId: string, substanceId: string) => void;
  handleZnDissolved: (tubeId: string) => void;
  znFinishedTubes: Set<string>;
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
  znFinishedTubes: new Set(),
  snapTargetId: null,

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

  addSubstanceToTestTube: (
    testTubeId,
    substanceId,
    amount = 1,
    instant = false,
  ) =>
    set((state) => {
      const newContents = new Map(state.testTubeContents);
      const existing = newContents.get(testTubeId) ?? [];
      const addedItem: TubeContent = { substanceId, amount, instant };
      newContents.set(testTubeId, [...existing, addedItem]);
      return { testTubeContents: newContents };
    }),

  stirTestTube: (testTubeId, layersCount) =>
    set((state) => {
      const newStirred = { ...state.stirredTubes };
      newStirred[testTubeId] = layersCount;
      return { stirredTubes: newStirred };
    }),

  unstirTestTube: (tubeId: string) =>
    set((state) => {
      const newContents = state.stirredTubes;
      delete newContents[tubeId];

      return { stirredTubes: newContents };
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

      const fe =
        currentContents.find((c) => c.substanceId === EQUIPMENT_IDS.FE_POWDER)
          ?.amount || 0;
      const s =
        currentContents.find((c) => c.substanceId === EQUIPMENT_IDS.S_POWDER)
          ?.amount || 0;

      // Tỉ lệ Fe:S là 7:4 (56:32)
      const reactedS = Math.min(s, fe / 1.75);
      const reactedFe = reactedS * 1.75;
      const producedFeS = reactedFe + reactedS;

      const finalContents: TubeContent[] = [
        {
          substanceId: resultingSubstanceId,
          amount: producedFeS,
          instant: true,
        },
      ];

      // Nếu sắt dư, giữ lại sắt trong ống
      if (fe > reactedFe + 0.05) {
        finalContents.push({
          substanceId: EQUIPMENT_IDS.FE_POWDER,
          amount: fe - reactedFe,
        });
      }

      // Nếu lưu huỳnh dư
      if (s > reactedS + 0.05) {
        finalContents.push({
          substanceId: EQUIPMENT_IDS.S_POWDER,
          amount: s - reactedS,
        });
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

    const feItem = contents.find(
      (c) => c.substanceId === EQUIPMENT_IDS.FE_POWDER,
    );
    if (!feItem) return 0;

    // Lượng sắt chưa phản ứng = Tổng sắt hiện có * (1 - tiến trình phản ứng)
    // Lưu ý: Nếu đã finishReaction và còn sắt dư, progress lúc đó = 0, hàm sẽ trả về toàn bộ sắt dư.
    return feItem.amount * (1 - progress);
  },

  setSnapTargetId: (id) => set({ snapTargetId: id }),
  triggerPrecipitation: (tubeId) =>
    set((state) => {
      const newContents = new Map(state.testTubeContents);
      const contents = newContents.get(tubeId) || [];

      const baCl2 = contents.find(
        (c) => c.substanceId === EQUIPMENT_IDS.BaCl2_SOLUTION,
      );
      const na2SO4 = contents.find(
        (c) => c.substanceId === EQUIPMENT_IDS.Na2SO4_SOLUTION,
      );

      if (baCl2 && na2SO4 && baCl2.amount > 0 && na2SO4.amount > 0) {
        const molBaCl2 = baCl2.amount / 208.2;
        const molNa2SO4 = na2SO4.amount / 142.0;

        // Phản ứng theo số mol chất thiếu
        const reactMol = Math.min(molBaCl2, molNa2SO4);

        // Khối lượng các chất tham gia đã phản ứng
        const reactMassBaCl2 = reactMol * 208.2;
        const reactMassNa2SO4 = reactMol * 142.0;

        // Khối lượng các chất sản phẩm sinh ra
        const producedBaSO4 = reactMol * 233.4;
        const producedNaCl = reactMol * (2 * 58.5);

        // 1. Cập nhật lại danh sách chất trong ống nghiệm
        const updatedContents = contents
          .map((c) => {
            if (c.substanceId === EQUIPMENT_IDS.BaCl2_SOLUTION) {
              return { ...c, amount: Math.max(0, c.amount - reactMassBaCl2) };
            }
            if (c.substanceId === EQUIPMENT_IDS.Na2SO4_SOLUTION) {
              return { ...c, amount: Math.max(0, c.amount - reactMassNa2SO4) };
            }
            return c;
          })
          .filter((c) => c.amount > 0.001); // Loại bỏ chất đã hết

        // 2. Thêm kết tủa BaSO4 (Render bằng PowderLayer)
        const existingBaSO4 = updatedContents.find(
          (c) => c.substanceId === EQUIPMENT_IDS.BaSO4_PRECIPITATE,
        );
        if (existingBaSO4) {
          existingBaSO4.amount += producedBaSO4;
        } else {
          updatedContents.push({
            substanceId: EQUIPMENT_IDS.BaSO4_PRECIPITATE,
            amount: producedBaSO4,
            instant: false, // Tạo hiệu ứng rơi
          });
        }

        // 3. Thêm dung dịch NaCl (Render bằng LiquidLayer)
        const existingNaCl = updatedContents.find(
          (c) => c.substanceId === EQUIPMENT_IDS.NACL_SOLUTION,
        );
        if (existingNaCl) {
          existingNaCl.amount += producedNaCl;
        } else {
          updatedContents.push({
            substanceId: EQUIPMENT_IDS.NACL_SOLUTION,
            amount: producedNaCl,
            instant: true,
          });
        }

        newContents.set(tubeId, updatedContents);
        return { testTubeContents: newContents };
      }
      return state;
    }),

  removeSubstanceFromTestTube: (tubeId, substanceId) =>
    set((state) => {
      const newContents = new Map(state.testTubeContents);
      const contents = newContents.get(tubeId) || [];
      const updated = contents.filter((c) => c.substanceId !== substanceId);
      newContents.set(tubeId, updated);
      return { testTubeContents: newContents };
    }),

  handleZnDissolved: (tubeId) =>
    set((state) => {
      const newContents = new Map(state.testTubeContents);
      const contents = [...(newContents.get(tubeId) || [])];

      // 1. Remove 1 pellet of Zinc
      const znIdx = contents.findIndex(c => c.substanceId === EQUIPMENT_IDS.ZN_POWDER);
      if (znIdx !== -1) {
        if (contents[znIdx].amount > 1) {
          contents[znIdx] = { ...contents[znIdx], amount: contents[znIdx].amount - 1 };
        } else {
          contents.splice(znIdx, 1);
          // Mark as finished if no more Zn but had reaction
          const newFinished = new Set(state.znFinishedTubes);
          newFinished.add(tubeId);
          set({ znFinishedTubes: newFinished });
        }
      }

      // 2. Convert some HCL to ZnCl2
      const hclIdx = contents.findIndex(c => c.substanceId === EQUIPMENT_IDS.HCL_SOLUTION);
      if (hclIdx !== -1) {
        const hclAmt = contents[hclIdx].amount;
        const consumeAmt = Math.min(hclAmt, 1.5); // Consume 1.5ml per pellet approx

        if (hclAmt > consumeAmt + 0.1) {
          contents[hclIdx] = { ...contents[hclIdx], amount: hclAmt - consumeAmt };
        } else {
          contents.splice(hclIdx, 1);
        }

        // Add ZnCl2
        const zncl2Idx = contents.findIndex(c => c.substanceId === EQUIPMENT_IDS.ZNCL2_SOLUTION);
        if (zncl2Idx !== -1) {
          contents[zncl2Idx] = { ...contents[zncl2Idx], amount: contents[zncl2Idx].amount + consumeAmt };
        } else {
          contents.push({ substanceId: EQUIPMENT_IDS.ZNCL2_SOLUTION, amount: consumeAmt, instant: true });
        }
      }

      newContents.set(tubeId, contents);
      return { testTubeContents: newContents };
    }),

  clearItems: () =>
    set({
      droppedItems: new Map(),
      alcoholLampStatus: new Map(),
      heldSubstance: null,
      contextMenu: null,
      reactionProgress: new Map(),
      znFinishedTubes: new Set(),
    }),
}));
