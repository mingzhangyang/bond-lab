import assert from 'node:assert/strict';
import test from 'node:test';
import { createMoleculeRecognizer, prepareMoleculeGraph } from './moleculeRecognition.ts';
import { HYDROXIDE_DEFINITIONS } from './data/hydroxides.ts';
import type { MoleculeTemplate } from './data/moleculeTemplates.ts';

const water: MoleculeTemplate = {
  name: 'Water', formula: 'H2O', atoms: ['O', 'H', 'H'],
  bonds: [{ a: 0, b: 1, order: 1 }, { a: 0, b: 2, order: 1 }],
};

function graph(template: MoleculeTemplate) {
  return {
    atoms: template.atoms.map((element, index) => ({ id: `a${index}`, element })),
    bonds: template.bonds.map(({ a, b, order }, index) => ({
      id: `b${index}`, source: `a${a}`, target: `a${b}`, order,
    })),
  };
}

const recognizer = createMoleculeRecognizer([water, ...HYDROXIDE_DEFINITIONS]);

for (const definition of HYDROXIDE_DEFINITIONS) {
  test(`${definition.name}: exact recognition is independent of IDs, order and direction`, () => {
    const { atoms, bonds } = graph(definition);
    const expected = { name: definition.name, formula: definition.formula };
    assert.deepEqual(recognizer.identify(atoms, bonds), expected);
    const ids = new Map(atoms.map((atom, i) => [atom.id, `id|${i}|a`]));
    assert.deepEqual(recognizer.identify(
      [...atoms].reverse().map((atom) => ({ ...atom, id: ids.get(atom.id)! })),
      [...bonds].reverse().map((bond) => ({
        ...bond, source: ids.get(bond.target)!, target: ids.get(bond.source)!,
      })),
    ), expected);
    assert.equal(recognizer.analyze(atoms, bonds).candidateCount, 1);
  });
}

test('unbonded atoms and disconnected fragments never expose an aggregate formula', () => {
  const { atoms, bonds } = graph(HYDROXIDE_DEFINITIONS.find((d) => d.name === 'Calcium Hydroxide')!);
  assert.equal(recognizer.analyze([], []).status, 'empty');
  assert.equal(recognizer.analyze([atoms[0]], []).status, 'incomplete');
  assert.equal(recognizer.identify(atoms, []), null);
  assert.equal(recognizer.analyze(atoms, []).status, 'disconnected');
  assert.equal(recognizer.identify(atoms, bonds.slice(1)), null);
  const waterGraph = graph(water);
  assert.equal(recognizer.identify([...waterGraph.atoms, { id: 'spare', element: 'Ca' }], waterGraph.bonds), null);
});

test('matching element counts are not sufficient: reject wrong hydroxide connectivity and bond orders', () => {
  const calcium = HYDROXIDE_DEFINITIONS.find((d) => d.name === 'Calcium Hydroxide')!;
  const { atoms, bonds } = graph(calcium);
  // Same atoms, same number of single bonds; H-Ca-O-O-H is not HO-Ca-OH.
  const wrong = [
    { source: 'a0', target: 'a2', order: 1 },
    { source: 'a0', target: 'a1', order: 1 },
    { source: 'a1', target: 'a3', order: 1 },
    { source: 'a3', target: 'a4', order: 1 },
  ];
  assert.equal(recognizer.analyze(atoms, wrong).status, 'unknown');
  assert.equal(recognizer.analyze(atoms, bonds.map((bond, i) => ({ ...bond, order: i === 0 ? 2 : 1 }))).status, 'unknown');
  assert.deepEqual(recognizer.identify(atoms, wrong), { name: 'Unknown Molecule', formula: 'CaH2O2' });
});

test('invalid graph data never becomes a known or unknown formula', () => {
  const { atoms, bonds } = graph(water);
  const invalidCases = [
    [...bonds, { source: 'a1', target: 'a0', order: 1 }],
    [{ source: 'a0', target: 'missing', order: 1 }],
    [{ source: 'a0', target: 'a0', order: 1 }],
    [{ source: 'a0', target: 'a1', order: 0 }],
    [{ source: 'a0', target: 'a1', order: 1.5 }],
    [{ source: 'a0', target: 'a1', order: Number.NaN }],
    [{ source: 'a0', target: 'a1', order: 4 }],
  ];
  for (const invalid of invalidCases) {
    assert.equal(recognizer.analyze(atoms, invalid).status, 'invalid');
    assert.equal(recognizer.identify(atoms, invalid), null);
  }
  assert.equal(recognizer.analyze([...atoms, atoms[0]], bonds).status, 'invalid');
  assert.equal(recognizer.analyze([{ id: 'x', element: 'Xe' } as never], []).status, 'invalid');
});

test('atom ID delimiters cannot collide in duplicate-edge detection', () => {
  const atoms = ['a', 'b|c', 'a|b', 'c'].map((id) => ({ id, element: 'C' as const }));
  const bonds = [
    { source: 'a', target: 'b|c', order: 1 },
    { source: 'a|b', target: 'c', order: 1 },
    { source: 'a', target: 'c', order: 1 },
  ];
  assert.ok(prepareMoleculeGraph(atoms, bonds));
  assert.equal(recognizer.analyze(atoms, bonds).status, 'unknown');
});

test('an exact graph comparison still runs after a fingerprint collision', () => {
  const cycle: MoleculeTemplate = {
    name: 'cycle', formula: 'C6', atoms: Array(6).fill('C'),
    bonds: Array.from({ length: 6 }, (_, a) => ({ a, b: (a + 1) % 6, order: 1 as const })),
  };
  // K3,3 and a triangular prism have the same local degree/element signatures,
  // yet one has triangles and the other is bipartite.
  const prism: MoleculeTemplate = {
    ...cycle, name: 'prism', bonds: [
      [0, 1], [1, 2], [2, 0], [3, 4], [4, 5], [5, 3], [0, 3], [1, 4], [2, 5],
    ].map(([a, b]) => ({ a, b, order: 1 as const })),
  };
  const k33: MoleculeTemplate = {
    ...cycle, name: 'K3,3', bonds: [0, 1, 2].flatMap((a) => [3, 4, 5].map((b) => ({ a, b, order: 1 as const }))),
  };
  const matcher = createMoleculeRecognizer([prism]);
  const input = graph(k33);
  const result = matcher.analyze(input.atoms, input.bonds);
  assert.equal(result.candidateCount, 1);
  assert.equal(result.status, 'unknown');
});

test('ambiguous topology is reported instead of returning the first matching name', () => {
  const matcher = createMoleculeRecognizer([water, { ...water, name: 'same topology' }]);
  const input = graph(water);
  const result = matcher.analyze(input.atoms, input.bonds);
  assert.equal(result.status, 'ambiguous');
  assert.deepEqual(result.matches.map((match) => match.name), ['Water', 'same topology']);
  assert.equal(result.molecule?.name, 'Unknown Molecule');
});

test('catalog compilation rejects duplicate names and malformed/disconnected templates', () => {
  assert.throws(() => createMoleculeRecognizer([water, water]), /duplicate/i);
  assert.throws(() => createMoleculeRecognizer([{ ...water, bonds: [] }]), /invalid/i);
  assert.throws(() => createMoleculeRecognizer([{ ...water, bonds: [{ a: 0, b: 9, order: 1 }] }]), /invalid/i);
});

test('compilation owns a snapshot; caller mutation cannot silently stale the index', () => {
  const copy = structuredClone(water);
  const matcher = createMoleculeRecognizer([copy]);
  const input = graph(water);
  copy.name = 'changed';
  copy.atoms[0] = 'C';
  copy.bonds.length = 0;
  assert.deepEqual(matcher.identify(input.atoms, input.bonds), { name: 'Water', formula: 'H2O' });
});
