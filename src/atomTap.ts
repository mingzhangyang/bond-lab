import type { GameState } from './store/types.ts';

type AtomTapState = Pick<GameState,
  'interactionMode' | 'selectedAtom' | 'setSelectedAtom' | 'addBond' | 'removeAtom'
>;

// Commit each finished tap once regardless of whether the browser generates
// an additional DOM click event on top of the pointer events.
export function applyAtomTap(atomId: string, state: AtomTapState): void {
  if (state.interactionMode === 'delete') {
    state.removeAtom(atomId);
    state.setSelectedAtom(null);
    return;
  }

  const source = state.selectedAtom;
  if (source === null) {
    state.setSelectedAtom(atomId);
  } else if (source === atomId) {
    state.setSelectedAtom(null);
  } else {
    state.addBond(source, atomId);
    state.setSelectedAtom(null);
  }
}
