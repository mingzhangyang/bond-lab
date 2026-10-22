import assert from 'node:assert/strict';
import test from 'node:test';
import { HYDROXIDE_DEFINITIONS } from './data/hydroxides.ts';
import { createMoleculeRecognizer } from './moleculeRecognition.ts';
import { createMoleculeTestStore } from './testing/moleculeStore.ts';
import type { MoleculeTemplate } from './data/moleculeTemplates.ts';

const ozone: MoleculeTemplate = {
  name: 'Ozone', formula: 'O3', atoms: ['O', 'O', 'O'],
  bonds: [{ a: 0, b: 1, order: 2 }, { a: 1, b: 2, order: 1 }],
};
const recognizer = createMoleculeRecognizer([...HYDROXIDE_DEFINITIONS, ozone]);

for (const definition of [...HYDROXIDE_DEFINITIONS, ozone]) {
  test(`editor actions can build, recognize, disconnect and undo ${definition.name}`, () => {
    for (const reverse of [false, true]) {
      const store = createMoleculeTestStore();
      const ids = definition.atoms.map((element) => store.getState().addAtom(element));
      assert.equal(recognizer.identify(store.getState().atoms, store.getState().bonds), null);
      const bonds = reverse ? [...definition.bonds].reverse() : definition.bonds;
      for (const bond of bonds) {
        for (let order = 0; order < bond.order; order++) {
          store.getState().addBond(ids[bond.a], ids[bond.b]);
        }
      }
      const state = store.getState();
      assert.equal(state.bonds.length, definition.bonds.length);
      const expected = { name: definition.name, formula: definition.formula };
      assert.deepEqual(recognizer.identify(state.atoms, state.bonds), expected);
      state.removeBond(state.bonds[0].id);
      assert.equal(recognizer.identify(store.getState().atoms, store.getState().bonds), null);
      store.getState().restoreLastRemovedBond();
      assert.deepEqual(recognizer.identify(store.getState().atoms, store.getState().bonds), expected);
    }
  });
}

test('all 24 calcium-hydroxide bond insertion orders work through the editor', () => {
  const calcium = HYDROXIDE_DEFINITIONS.find((definition) => definition.name === 'Calcium Hydroxide')!;
  function permutations<T>(items: T[]): T[][] {
    return items.length === 0 ? [[]] : items.flatMap((item, i) =>
      permutations(items.filter((_, j) => j !== i)).map((rest) => [item, ...rest]));
  }
  for (const bonds of permutations(calcium.bonds)) {
    const store = createMoleculeTestStore();
    const ids = calcium.atoms.map((element) => store.getState().addAtom(element));
    for (const { a, b } of bonds) store.getState().addBond(ids[a], ids[b]);
    assert.equal(recognizer.identify(store.getState().atoms, store.getState().bonds)?.name, calcium.name);
  }
});

test('editor revalidates third atoms when an attachment would invalidate a resonance exception', () => {
  const store = createMoleculeTestStore();
  const c = store.getState().addAtom('C');
  const o = store.getState().addAtom('O');
  const h = store.getState().addAtom('H');
  for (let i = 0; i < 3; i++) store.getState().addBond(c, o);
  assert.equal(store.getState().bonds[0].order, 3);
  store.getState().addBond(c, h);
  assert.equal(store.getState().bonds.length, 1);

  store.getState().clear();
  const ids = ['O', 'O', 'O', 'O'].map(() => store.getState().addAtom('O'));
  store.getState().addBond(ids[0], ids[1]);
  store.getState().addBond(ids[0], ids[1]);
  store.getState().addBond(ids[1], ids[2]);
  store.getState().addBond(ids[2], ids[3]);
  assert.equal(store.getState().bonds.length, 2);
});
