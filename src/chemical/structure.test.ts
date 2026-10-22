import test from 'node:test';
import assert from 'node:assert/strict';
import { exportChemicalStructure, type ChemicalAtom, type ChemicalBond } from './structure.ts';
import { HYDROXIDE_DEFINITIONS } from '../data/hydroxides.ts';
import { MOLECULE_TEMPLATES } from '../data/moleculeTemplates.ts';
import { templateToMoleculeGraph } from '../moleculeRecognition.ts';

test('hydroxide formulas export explicit, charge-balanced separated ions', () => {
  for (const template of HYDROXIDE_DEFINITIONS) {
    const graph = templateToMoleculeGraph(template);
    const outcome = exportChemicalStructure(graph.atoms, graph.bonds);
    assert.equal(outcome.status, 'ready', template.name);
    if (outcome.status !== 'ready') continue;
    assert.equal(outcome.atomCount, template.atoms.length);
    assert.equal(outcome.charges.reduce((a, b) => a + b, 0), 0);
    assert.equal(outcome.representation, 'formula-unit');
    assert.ok(outcome.smiles.includes('.'), template.name);
  }
});

test('calcium hydroxide exports Ca2+ and two distinct hydroxide groups, never Ca-O covalent bonds', () => {
  const template = HYDROXIDE_DEFINITIONS.find((t) => t.name === 'Calcium Hydroxide')!;
  const { atoms, bonds } = templateToMoleculeGraph(template);
  const result = exportChemicalStructure(atoms, bonds);
  assert.equal(result.status, 'ready');
  if (result.status !== 'ready') return;
  assert.ok(result.smiles.includes('[Ca+2]'));
  assert.equal(result.smiles.match(/\[O-\]/g)?.length, 2);
  assert.equal(result.smiles.match(/\[H\]/g)?.length, 2);
  assert.equal(result.smiles.split('.').length, 3);
});

test('water preserves both explicit hydrogen atoms for sanitization', () => {
  const water = MOLECULE_TEMPLATES.find((m) => m.name === 'Water')!;
  const result = exportChemicalStructure(...Object.values(templateToMoleculeGraph(water)) as [
    ReturnType<typeof templateToMoleculeGraph>['atoms'],
    ReturnType<typeof templateToMoleculeGraph>['bonds']
  ]);
  assert.equal(result.status, 'ready');
  if (result.status !== 'ready') return;
  assert.equal(result.smiles.match(/\[H\]/g)?.length, 2);
});

test('ring closure encodes benzene double bonds and rings without dropping hydrogens', () => {
  const benzene = MOLECULE_TEMPLATES.find((m) => m.name === 'Benzene')!;
  const graph = templateToMoleculeGraph(benzene);
  const result = exportChemicalStructure(graph.atoms, graph.bonds);
  assert.equal(result.status, 'ready');
  if (result.status !== 'ready') return;
  assert.equal((result.smiles.match(/1/g) ?? []).length, 2);
  assert.equal((result.smiles.match(/\[H\]/g) ?? []).length, 6);
});

test('unknown metal bonds do not get guessed as chemically meaningful covalent structures', () => {
  const atoms = [{ id: 'ca', element: 'Ca' as const }, { id: 'o', element: 'O' as const },
    { id: 'h', element: 'H' as const }];
  const bonds = [{ id: 'x', source: 'ca', target: 'o', order: 1 },
    { id: 'y', source: 'o', target: 'h', order: 1 }];
  assert.deepEqual(exportChemicalStructure(atoms, bonds), {
    status: 'unsupported', reason: 'metal_bond_type_not_specified',
  });
});

test('disconnected inventory, malformed bond and charge mismatch are not submitted', () => {
  const atoms = [{ id: 'ca', element: 'Ca' as const }, { id: 'o', element: 'O' as const }];
  assert.equal(exportChemicalStructure(atoms, []).status, 'unsupported');
  assert.equal(exportChemicalStructure(atoms, [
    { id: 'x', source: 'ca', target: 'missing', order: 1 }]).status, 'unsupported');
  const graph = templateToMoleculeGraph(HYDROXIDE_DEFINITIONS.find((m) => m.name === 'Calcium Hydroxide')!);
  const metadata = graph.atoms.map((atom) => ({ ...atom, formalCharge: atom.element === 'Ca' ? 1 : undefined }));
  assert.equal(exportChemicalStructure(metadata, graph.bonds).status, 'unsupported');
});

// Explicit bond semantics in these synthetic fixtures test export, not chemical stability.
function mixedMetalGraph(): { atoms: ChemicalAtom[]; bonds: ChemicalBond[] } {
  return {
    atoms: [
      { id: 'ca', element: 'Ca', formalCharge: 2 },
      { id: 'o', element: 'O', formalCharge: -1 },
      { id: 'h', element: 'H', formalCharge: 0 },
      { id: 'c', element: 'C', formalCharge: -1 },
    ],
    bonds: [
      { id: 'ca-o', source: 'ca', target: 'o', order: 1, kind: 'ionic-association' },
      { id: 'o-h', source: 'o', target: 'h', order: 1 },
      { id: 'ca-c', source: 'ca', target: 'c', order: 1 },
    ],
  };
}

test('a marked ionic edge cannot authorize untyped metal edges, regardless of order or direction', () => {
  const { atoms, bonds } = mixedMetalGraph();
  for (const order of [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]]) {
    for (let mask = 0; mask < 8; mask++) {
      const permuted = order.map((index, position) => {
        const bond = bonds[index];
        return (mask & (1 << position)) === 0 ? bond
          : { ...bond, source: bond.target, target: bond.source };
      });
      assert.deepEqual(exportChemicalStructure(atoms, permuted), {
        status: 'unsupported', reason: 'metal_bond_type_not_specified',
      }, `order=${order.join(',')}, reversed=${mask}`);
    }
  }
});

test('nonmetal ionic annotation does not authorize an untyped metal edge', () => {
  const { atoms, bonds } = mixedMetalGraph();
  bonds[0].kind = undefined;
  bonds[1].kind = 'ionic-association';
  bonds[2].kind = 'covalent';
  assert.deepEqual(exportChemicalStructure(atoms, bonds), {
    status: 'unsupported', reason: 'metal_bond_type_not_specified',
  });
});

test('explicitly typed mixed metal edges retain their chosen bond meaning', () => {
  const { atoms, bonds } = mixedMetalGraph();
  bonds[2].kind = 'covalent';
  const outcome = exportChemicalStructure(atoms, bonds);
  assert.equal(outcome.status, 'ready');
  if (outcome.status !== 'ready') return;
  assert.equal(outcome.smiles, '[Ca+2][C-].[O-][H]');
  assert.equal(outcome.atomCount, 4);
  assert.deepEqual(outcome.charges, [2, -1, 0, -1]);
});

test('explicitly typed ionic metal edges remain disconnected in exported chemistry', () => {
  const { atoms, bonds } = mixedMetalGraph();
  bonds[2].kind = 'ionic-association';
  const outcome = exportChemicalStructure(atoms, bonds);
  assert.equal(outcome.status, 'ready');
  if (outcome.status !== 'ready') return;
  assert.equal(outcome.smiles, '[Ca+2].[O-][H].[C-]');
});

test('unexpected runtime kind values cannot masquerade as an explicit metal bond kind', () => {
  for (const kind of [null, '', 'coordinate']) {
    const { atoms, bonds } = mixedMetalGraph();
    bonds[2].kind = kind as unknown as ChemicalBond['kind'];
    assert.deepEqual(exportChemicalStructure(atoms, bonds), {
      status: 'unsupported', reason: 'metal_bond_type_not_specified',
    });
  }
});

test('ionic edges still require explicit endpoint charges outside the known catalog', () => {
  const { atoms, bonds } = mixedMetalGraph();
  bonds[2].kind = 'ionic-association';
  atoms[3].formalCharge = undefined;
  assert.deepEqual(exportChemicalStructure(atoms, bonds), {
    status: 'unsupported', reason: 'ionic_charges_required',
  });
});
