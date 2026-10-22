import { createMoleculeSlice, type MoleculeSlice } from '../store/slices/moleculeSlice.ts';
import type { GameState } from '../store/types.ts';

/** Exercise the production slice without React, persistence or a browser. */
export function createMoleculeTestStore() {
  let state: MoleculeSlice;
  const set: Parameters<typeof createMoleculeSlice>[0] = (update) => {
    const patch = typeof update === 'function' ? update(state as GameState) : update;
    state = { ...state, ...patch };
  };
  state = createMoleculeSlice(
    set,
    () => state as GameState,
    {} as Parameters<typeof createMoleculeSlice>[2],
  );
  return { getState: () => state };
}
