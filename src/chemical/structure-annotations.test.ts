import assert from 'node:assert/strict';
import test from 'node:test';
import { MOLECULE_CATALOG } from '../moleculeCatalog.ts';
import { templateToMoleculeGraph } from '../moleculeRecognition.ts';
import { exportChemicalStructure, type ChemicalAtom, type ChemicalBond, type ChemicalLinkKind } from './structure.ts';

const formulaUnits = MOLECULE_CATALOG.filter((entry) => entry.representation === 'ionic-formula-unit');
const metals = new Set(['Na', 'K', 'Ca', 'Mg', 'Al', 'Cu', 'Fe']);

function expectedKind(atoms: readonly ChemicalAtom[], bond: ChemicalBond): ChemicalLinkKind {
  const endpoints = atoms.filter((atom) => atom.id === bond.source || atom.id === bond.target);
  return endpoints.some((atom) => metals.has(atom.element)) ? 'ionic-association' : 'covalent';
}

test('unannotated formula units still export without mutating the editor inventory', () => {
  assert.ok(formulaUnits.length > 0);
  for (const template of formulaUnits) {
    const graph = templateToMoleculeGraph(template);
    const snapshot = structuredClone(graph);
    const result = exportChemicalStructure(graph.atoms, graph.bonds);
    assert.equal(result.status, 'ready', template.name);
    if (result.status !== 'ready') continue;
    assert.equal(result.representation, 'formula-unit', template.name);
    assert.equal(result.charges.reduce((sum, charge) => sum + charge, 0), 0, template.name);
    assert.deepEqual(graph, snapshot, template.name);
  }
});

test('compatible partial and complete annotations preserve every catalog formula unit', () => {
  for (const template of formulaUnits) {
    const { atoms, bonds } = templateToMoleculeGraph(template);
    const baseline = exportChemicalStructure(atoms, bonds);
    assert.equal(baseline.status, 'ready', template.name);
    if (baseline.status !== 'ready') continue;
    const charged = atoms.map((atom, i) => ({ ...atom, formalCharge: baseline.charges[i] }));
    // Include each edge on its own, a partial set, all edges and no annotations.
    const masks = [0, ...bonds.map((_, i) => 2 ** i), 2 ** bonds.length - 1];
    for (const mask of masks) {
      const annotated = bonds.map((bond, i): ChemicalBond => ({
        ...bond,
        ...((mask & (2 ** i)) !== 0 ? { kind: expectedKind(atoms, bond) } : {}),
      }));
      const snapshot = structuredClone({ atoms: charged, bonds: annotated });
      assert.deepEqual(exportChemicalStructure(charged, annotated), baseline, `${template.name}: ${mask}`);
      assert.deepEqual({ atoms: charged, bonds: annotated }, snapshot, template.name);
    }
  }
});

test('every conflicting catalog edge kind is rejected in both endpoint directions', () => {
  let checkedCovalent = false;
  let checkedIonic = false;
  for (const template of formulaUnits) {
    const { atoms, bonds } = templateToMoleculeGraph(template);
    for (let conflict = 0; conflict < bonds.length; conflict++) {
      const expected = expectedKind(atoms, bonds[conflict]);
      checkedCovalent ||= expected === 'covalent';
      checkedIonic ||= expected === 'ionic-association';
      for (const reverse of [false, true]) {
        const annotated = bonds.map((bond, i): ChemicalBond => ({
          ...bond,
          source: reverse ? bond.target : bond.source,
          target: reverse ? bond.source : bond.target,
          kind: i === conflict
            ? (expected === 'covalent' ? 'ionic-association' : 'covalent')
            : expectedKind(atoms, bond),
        }));
        const orderedAtoms = reverse ? [...atoms].reverse() : atoms;
        const orderedBonds = reverse ? annotated.reverse() : annotated;
        const snapshot = structuredClone({ atoms: orderedAtoms, bonds: orderedBonds });
        assert.deepEqual(exportChemicalStructure(orderedAtoms, orderedBonds), {
          status: 'unsupported', reason: 'bond_kind_conflict',
        }, `${template.name}: ${bonds[conflict].id}, reverse=${reverse}`);
        assert.deepEqual({ atoms: orderedAtoms, bonds: orderedBonds }, snapshot, template.name);
      }
    }
  }
  assert.ok(checkedCovalent, 'must check intra-hydroxide O-H edges as well as metal connectors');
  assert.ok(checkedIonic, 'must check metal-anion edges');
});

test('invalid runtime annotations cannot be replaced by catalog defaults', () => {
  for (const template of formulaUnits) {
    const { atoms, bonds } = templateToMoleculeGraph(template);
    for (const kind of [null, '', 'coordinate']) {
      const annotated: ChemicalBond[] = bonds.map((bond, i) => ({
        ...bond, ...(i === 0 ? { kind: kind as unknown as ChemicalLinkKind } : {}),
      }));
      assert.deepEqual(exportChemicalStructure(atoms, annotated), {
        status: 'unsupported', reason: 'bond_kind_conflict',
      }, `${template.name}: ${kind}`);
    }
  }
});

test('matching bond kinds do not override the existing explicit-charge conflict safeguard', () => {
  const template = formulaUnits.find((entry) => entry.name === 'Calcium Hydroxide')!;
  const { atoms, bonds } = templateToMoleculeGraph(template);
  const charged = atoms.map((atom) => ({ ...atom, formalCharge: atom.element === 'Ca' ? 1 : undefined }));
  const annotated = bonds.map((bond) => ({ ...bond, kind: expectedKind(atoms, bond) }));
  assert.deepEqual(exportChemicalStructure(charged, annotated), {
    status: 'unsupported', reason: 'charge_conflict',
  });
});
