import assert from 'node:assert/strict';
import test from 'node:test';
import { identifyMolecule, analyzeMolecule, KNOWN_MOLECULES } from './identifier.ts';
import { MOLECULE_CATALOG, getMoleculeDefinition } from './moleculeCatalog.ts';
import { createMoleculeTestStore } from './testing/moleculeStore.ts';
import { templateToMoleculeGraph } from './moleculeRecognition.ts';

for (const definition of MOLECULE_CATALOG) {
  test(`catalog contract: ${definition.name} is recognized and buildable`, () => {
    const expected = { name: definition.name, formula: definition.formula };
    const { atoms, bonds } = templateToMoleculeGraph(definition);
    assert.deepEqual(identifyMolecule(atoms, bonds), expected);
    assert.deepEqual(identifyMolecule([...atoms].reverse(), [...bonds].reverse().map((bond) => ({
      ...bond, source: bond.target, target: bond.source,
    }))), expected);
    assert.ok(KNOWN_MOLECULES.find((known) => known.name === definition.name)?.buildable);
    // Go through production add/upgrade actions, not only a fabricated final graph.
    for (const reverse of [false, true]) {
      const store = createMoleculeTestStore();
      const ids = definition.atoms.map((element) => store.getState().addAtom(element));
      const sequence = reverse ? [...definition.bonds].reverse() : definition.bonds;
      for (const { a, b, order } of sequence) {
        for (let i = 0; i < order; i++) store.getState().addBond(ids[a], ids[b]);
      }
      assert.deepEqual(identifyMolecule(store.getState().atoms, store.getState().bonds), expected);
    }
  });
}

test('catalog size and indexed candidate counts remain consistent', () => {
  assert.equal(KNOWN_MOLECULES.length, MOLECULE_CATALOG.length);
  assert.equal(new Set(KNOWN_MOLECULES.map((known) => known.name)).size, MOLECULE_CATALOG.length);
  const calcium = templateToMoleculeGraph(getMoleculeDefinition('Calcium Hydroxide')!);
  assert.equal(analyzeMolecule(calcium.atoms, calcium.bonds).candidateCount, 1);
});

test('a known molecule with an extra loose atom is not reported as an aggregate compound', () => {
  const water = templateToMoleculeGraph(getMoleculeDefinition('Water')!);
  const atoms = [...water.atoms, { id: 'extra', element: 'Ca' as const }];
  assert.equal(analyzeMolecule(atoms, water.bonds).status, 'disconnected');
  assert.equal(identifyMolecule(atoms, water.bonds), null);
});
