import type { KeyboardControlsEntry } from "@react-three/drei";


export type ControlsState = 'forward' | 'backward' | 'left' | 'right' | 'up' | 'down';

export const controlMap: KeyboardControlsEntry<ControlsState>[] = [
  { name: 'forward', keys: ['ArrowUp', 'w', 'W'] },
  { name: 'backward', keys: ['ArrowDown', 's', 'S'] },
  { name: 'left', keys: ['ArrowLeft', 'a', 'A'] },
  { name: 'right', keys: ['ArrowRight', 'd', 'D'] },
  { name: 'up', keys: ['e', 'E', 'Space'] },      // Phím E hoặc Space để bay lên
  { name: 'down', keys: ['q', 'Q', 'Shift'] },    // Phím Q hoặc Shift để hạ xuống
];