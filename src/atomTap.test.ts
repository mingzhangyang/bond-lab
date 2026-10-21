import assert from 'node:assert/strict';
import test from 'node:test';
import { applyAtomTap } from './atomTap.ts';

function harness() {
  const bonds: Array<[string, string]> = [];
  const removed: string[] = [];
  const state = {
    interactionMode: 'build' as 'build' | 'delete',
    selectedAtom: null as string | null,
    setSelectedAtom(id: string | null) { state.selectedAtom = id; },
    addBond(a: string, b: string) { bonds.push([a, b]); },
    removeAtom(id: string) { removed.push(id); },
  };
  return { state, bonds, removed };
}

test('tap O then H twice forms two O-H bonds without DOM click', () => {
  const { state, bonds } = harness();
  applyAtomTap('oxygen', state);
  assert.equal(state.selectedAtom, 'oxygen');
  applyAtomTap('hydrogen1', state);
  assert.deepEqual(bonds, [['oxygen', 'hydrogen1']]);
  assert.equal(state.selectedAtom, null);
  applyAtomTap('oxygen', state);
  applyAtomTap('hydrogen2', state);
  assert.deepEqual(bonds, [['oxygen', 'hydrogen1'], ['oxygen', 'hydrogen2']]);
});

test('tapping an already selected atom clears selection without bonding', () => {
  const { state, bonds } = harness();
  applyAtomTap('a', state);
  applyAtomTap('a', state);
  assert.equal(state.selectedAtom, null);
  assert.deepEqual(bonds, []);
});

test('delete mode tap removes the atom without bonding', () => {
  const { state, bonds, removed } = harness();
  state.interactionMode = 'delete';
  state.selectedAtom = 'other';
  applyAtomTap('target', state);
  assert.deepEqual(removed, ['target']);
  assert.deepEqual(bonds, []);
  assert.equal(state.selectedAtom, null);
});
