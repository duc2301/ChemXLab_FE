import type { KeyboardControlsEntry } from "@react-three/drei";


export type ControlsState = 'forward' | 'backward' | 'left' | 'right' | 'jump' | 'sprint';

export const controlMap: KeyboardControlsEntry<ControlsState>[] = [
  { name: 'forward', keys: ['ArrowUp', 'w', 'W'] },
  { name: 'backward', keys: ['ArrowDown', 's', 'S'] },
  { name: 'left', keys: ['ArrowLeft', 'a', 'A'] },
  { name: 'right', keys: ['ArrowRight', 'd', 'D'] },
  { name: 'jump', keys: ['Space'] },
  { name: 'sprint', keys: ['ShiftLeft', 'ShiftRight'] },
];