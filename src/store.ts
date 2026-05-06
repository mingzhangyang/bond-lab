import { create } from 'zustand';
import {
  ELEMENTS,
  ELEMENT_DISPLAY_ORDER,
  type ElementType,
} from './chemistry.ts';
import { createChallengeSlice } from './store/slices/challengeSlice.ts';
import { createMoleculeSlice } from './store/slices/moleculeSlice.ts';
import { createPreferencesSlice } from './store/slices/preferencesSlice.ts';
import type {
  Atom,
  Bond,
  ChallengeStatus,
  ChallengeTarget,
  GameState,
} from './store/types.ts';

export { ELEMENTS, ELEMENT_DISPLAY_ORDER };
export type { ElementType, Atom, Bond, ChallengeStatus, ChallengeTarget, GameState };

export const useStore = create<GameState>()((...args) => ({
  ...createMoleculeSlice(...args),
  ...createPreferencesSlice(...args),
  ...createChallengeSlice(...args),
}));
