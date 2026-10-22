import test from 'node:test';
import assert from 'node:assert/strict';
import { exportChemicalStructure } from './structure.ts';
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
