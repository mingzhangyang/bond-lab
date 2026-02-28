import assert from 'node:assert/strict';
import test from 'node:test';
import { identifyMolecule, isConnectedMoleculeGraph, isValidMoleculeGraph } from './identifier.ts';
import type { Atom, Bond } from './store.ts';

test('identifyMolecule identifies known molecules by element and bond counts', () => {
  const atoms: Atom[] = [
    { id: 'o1', element: 'O' },
    { id: 'h1', element: 'H' },
    { id: 'h2', element: 'H' },
  ];
  const bonds: Bond[] = [
    { id: 'b1', source: 'o1', target: 'h1', order: 1 },
    { id: 'b2', source: 'o1', target: 'h2', order: 1 },
  ];

  assert.deepEqual(identifyMolecule(atoms, bonds), { name: 'Water', formula: 'H₂O' });
});

test('identifyMolecule returns generic formula when molecule is unknown', () => {
  const atoms: Atom[] = [
    { id: 'c1', element: 'C' },
    { id: 'o1', element: 'O' },
  ];
  const bonds: Bond[] = [{ id: 'b1', source: 'c1', target: 'o1', order: 1 }];

  assert.deepEqual(identifyMolecule(atoms, bonds), { name: 'Unknown Molecule', formula: 'CO' });
});

test('identifyMolecule does not misidentify same element counts with different topology', () => {
  const atoms: Atom[] = [
    { id: 'o1', element: 'O' },
    { id: 'h1', element: 'H' },
    { id: 'h2', element: 'H' },
  ];
  const bonds: Bond[] = [
    { id: 'b1', source: 'o1', target: 'h1', order: 1 },
    { id: 'b2', source: 'h1', target: 'h2', order: 1 },
  ];

  assert.deepEqual(identifyMolecule(atoms, bonds), { name: 'Unknown Molecule', formula: 'H2O' });
});

test('identifyMolecule distinguishes hydrogen cyanide from isomeric topology', () => {
  const atoms: Atom[] = [
    { id: 'h1', element: 'H' },
    { id: 'c1', element: 'C' },
    { id: 'n1', element: 'N' },
  ];

  const hcnBonds: Bond[] = [
    { id: 'b1', source: 'h1', target: 'c1', order: 1 },
    { id: 'b2', source: 'c1', target: 'n1', order: 3 },
  ];

  const isnBonds: Bond[] = [
    { id: 'b3', source: 'h1', target: 'n1', order: 1 },
    { id: 'b4', source: 'n1', target: 'c1', order: 3 },
  ];

  assert.deepEqual(identifyMolecule(atoms, hcnBonds), { name: 'Hydrogen Cyanide', formula: 'HCN' });
  assert.deepEqual(identifyMolecule(atoms, isnBonds), { name: 'Unknown Molecule', formula: 'CHN' });
});

test('identifyMolecule is stable across atom insertion order', () => {
  const atoms: Atom[] = [
    { id: 'h3', element: 'H' },
    { id: 'c1', element: 'C' },
    { id: 'h1', element: 'H' },
    { id: 'h4', element: 'H' },
    { id: 'h2', element: 'H' },
  ];
  const bonds: Bond[] = [
    { id: 'b1', source: 'c1', target: 'h1', order: 1 },
    { id: 'b2', source: 'c1', target: 'h2', order: 1 },
    { id: 'b3', source: 'c1', target: 'h3', order: 1 },
    { id: 'b4', source: 'c1', target: 'h4', order: 1 },
  ];

  assert.deepEqual(identifyMolecule(atoms, bonds), { name: 'Methane', formula: 'CH₄' });
});

test('identifyMolecule identifies sulfur dioxide and phosphorus trichloride', () => {
  const sulfurDioxideAtoms: Atom[] = [
    { id: 's1', element: 'S' },
    { id: 'o1', element: 'O' },
    { id: 'o2', element: 'O' },
  ];
  const sulfurDioxideBonds: Bond[] = [
    { id: 'b1', source: 's1', target: 'o1', order: 2 },
    { id: 'b2', source: 's1', target: 'o2', order: 2 },
  ];

  const phosphorusTrichlorideAtoms: Atom[] = [
    { id: 'p1', element: 'P' },
    { id: 'cl1', element: 'Cl' },
    { id: 'cl2', element: 'Cl' },
    { id: 'cl3', element: 'Cl' },
  ];
  const phosphorusTrichlorideBonds: Bond[] = [
    { id: 'b3', source: 'p1', target: 'cl1', order: 1 },
    { id: 'b4', source: 'p1', target: 'cl2', order: 1 },
    { id: 'b5', source: 'p1', target: 'cl3', order: 1 },
  ];

  assert.deepEqual(identifyMolecule(sulfurDioxideAtoms, sulfurDioxideBonds), {
    name: 'Sulfur Dioxide',
    formula: 'SO₂',
  });
  assert.deepEqual(identifyMolecule(phosphorusTrichlorideAtoms, phosphorusTrichlorideBonds), {
    name: 'Phosphorus Trichloride',
    formula: 'PCl₃',
  });
});

test('identifyMolecule formula builder supports two-letter element symbols', () => {
  const atoms: Atom[] = [
    { id: 'c1', element: 'C' },
    { id: 'cl1', element: 'Cl' },
  ];
  const bonds: Bond[] = [{ id: 'b1', source: 'c1', target: 'cl1', order: 1 }];

  assert.deepEqual(identifyMolecule(atoms, bonds), { name: 'Unknown Molecule', formula: 'CCl' });
});

test('identifyMolecule formula builder supports newly added metal elements', () => {
  const ironOxideAtoms: Atom[] = [
    { id: 'fe1', element: 'Fe' },
    { id: 'fe2', element: 'Fe' },
    { id: 'o1', element: 'O' },
    { id: 'o2', element: 'O' },
    { id: 'o3', element: 'O' },
  ];
  const ironOxideBonds: Bond[] = [
    { id: 'b1', source: 'fe1', target: 'o1', order: 1 },
    { id: 'b2', source: 'fe1', target: 'o2', order: 1 },
    { id: 'b3', source: 'fe2', target: 'o2', order: 1 },
    { id: 'b4', source: 'fe2', target: 'o3', order: 1 },
  ];

  const calciumChlorideAtoms: Atom[] = [
    { id: 'ca1', element: 'Ca' },
    { id: 'cl1', element: 'Cl' },
    { id: 'cl2', element: 'Cl' },
  ];
  const calciumChlorideBonds: Bond[] = [
    { id: 'b5', source: 'ca1', target: 'cl1', order: 1 },
    { id: 'b6', source: 'ca1', target: 'cl2', order: 1 },
  ];

  assert.deepEqual(identifyMolecule(ironOxideAtoms, ironOxideBonds), {
    name: 'Unknown Molecule',
    formula: 'Fe2O3',
  });
  assert.deepEqual(identifyMolecule(calciumChlorideAtoms, calciumChlorideBonds), {
    name: 'Calcium Chloride',
    formula: 'CaCl₂',
  });

  const sodiumChlorideAtoms: Atom[] = [
    { id: 'na1', element: 'Na' },
    { id: 'cl3', element: 'Cl' },
  ];
  const sodiumChlorideBonds: Bond[] = [
    { id: 'b7', source: 'na1', target: 'cl3', order: 1 },
  ];

  const potassiumOxideAtoms: Atom[] = [
    { id: 'k1', element: 'K' },
    { id: 'k2', element: 'K' },
    { id: 'o4', element: 'O' },
  ];
  const potassiumOxideBonds: Bond[] = [
    { id: 'b8', source: 'k1', target: 'o4', order: 1 },
    { id: 'b9', source: 'k2', target: 'o4', order: 1 },
  ];

  assert.deepEqual(identifyMolecule(sodiumChlorideAtoms, sodiumChlorideBonds), {
    name: 'Sodium Chloride',
    formula: 'NaCl',
  });
  assert.deepEqual(identifyMolecule(potassiumOxideAtoms, potassiumOxideBonds), {
    name: 'Unknown Molecule',
    formula: 'K2O',
  });
});

test('identifyMolecule identifies dimethyl ether as distinct from ethanol', () => {
  const atoms: Atom[] = [
    { id: 'c1', element: 'C' },
    { id: 'c2', element: 'C' },
    { id: 'o1', element: 'O' },
    { id: 'h1', element: 'H' },
    { id: 'h2', element: 'H' },
    { id: 'h3', element: 'H' },
    { id: 'h4', element: 'H' },
    { id: 'h5', element: 'H' },
    { id: 'h6', element: 'H' },
  ];
  const dimethylEtherBonds: Bond[] = [
    { id: 'b1', source: 'c1', target: 'o1', order: 1 },
    { id: 'b2', source: 'o1', target: 'c2', order: 1 },
    { id: 'b3', source: 'c1', target: 'h1', order: 1 },
    { id: 'b4', source: 'c1', target: 'h2', order: 1 },
    { id: 'b5', source: 'c1', target: 'h3', order: 1 },
    { id: 'b6', source: 'c2', target: 'h4', order: 1 },
    { id: 'b7', source: 'c2', target: 'h5', order: 1 },
    { id: 'b8', source: 'c2', target: 'h6', order: 1 },
  ];

  assert.deepEqual(identifyMolecule(atoms, dimethylEtherBonds), {
    name: 'Dimethyl Ether',
    formula: 'C₂H₆O',
  });
});

test('identifyMolecule identifies benzene from Kekulé structure with alternating single and double bonds', () => {
  const atoms: Atom[] = [
    { id: 'c1', element: 'C' },
    { id: 'c2', element: 'C' },
    { id: 'c3', element: 'C' },
    { id: 'c4', element: 'C' },
    { id: 'c5', element: 'C' },
    { id: 'c6', element: 'C' },
    { id: 'h1', element: 'H' },
    { id: 'h2', element: 'H' },
    { id: 'h3', element: 'H' },
    { id: 'h4', element: 'H' },
    { id: 'h5', element: 'H' },
    { id: 'h6', element: 'H' },
  ];
  // Kekulé structure 1: double bonds on c1=c2, c3=c4, c5=c6
  const bonds1: Bond[] = [
    { id: 'b1', source: 'c1', target: 'c2', order: 2 },
    { id: 'b2', source: 'c2', target: 'c3', order: 1 },
    { id: 'b3', source: 'c3', target: 'c4', order: 2 },
    { id: 'b4', source: 'c4', target: 'c5', order: 1 },
    { id: 'b5', source: 'c5', target: 'c6', order: 2 },
    { id: 'b6', source: 'c6', target: 'c1', order: 1 },
    { id: 'b7', source: 'c1', target: 'h1', order: 1 },
    { id: 'b8', source: 'c2', target: 'h2', order: 1 },
    { id: 'b9', source: 'c3', target: 'h3', order: 1 },
    { id: 'b10', source: 'c4', target: 'h4', order: 1 },
    { id: 'b11', source: 'c5', target: 'h5', order: 1 },
    { id: 'b12', source: 'c6', target: 'h6', order: 1 },
  ];
  assert.deepEqual(identifyMolecule(atoms, bonds1), { name: 'Benzene', formula: 'C₆H₆' });

  // Kekulé structure 2: double bonds on c2=c3, c4=c5, c6=c1 (rotated by one position)
  const bonds2: Bond[] = [
    { id: 'b1', source: 'c1', target: 'c2', order: 1 },
    { id: 'b2', source: 'c2', target: 'c3', order: 2 },
    { id: 'b3', source: 'c3', target: 'c4', order: 1 },
    { id: 'b4', source: 'c4', target: 'c5', order: 2 },
    { id: 'b5', source: 'c5', target: 'c6', order: 1 },
    { id: 'b6', source: 'c6', target: 'c1', order: 2 },
    { id: 'b7', source: 'c1', target: 'h1', order: 1 },
    { id: 'b8', source: 'c2', target: 'h2', order: 1 },
    { id: 'b9', source: 'c3', target: 'h3', order: 1 },
    { id: 'b10', source: 'c4', target: 'h4', order: 1 },
    { id: 'b11', source: 'c5', target: 'h5', order: 1 },
    { id: 'b12', source: 'c6', target: 'h6', order: 1 },
  ];
  assert.deepEqual(identifyMolecule(atoms, bonds2), { name: 'Benzene', formula: 'C₆H₆' });
});

test('isValidMoleculeGraph rejects illegal topology and isConnectedMoleculeGraph detects fragments', () => {
  const atoms: Atom[] = [
    { id: 'c1', element: 'C' },
    { id: 'h1', element: 'H' },
    { id: 'h2', element: 'H' },
  ];
  const duplicateEdgeBonds: Bond[] = [
    { id: 'b1', source: 'c1', target: 'h1', order: 1 },
    { id: 'b2', source: 'h1', target: 'c1', order: 1 },
  ];
  const disconnectedBonds: Bond[] = [{ id: 'b3', source: 'c1', target: 'h1', order: 1 }];

  assert.equal(isValidMoleculeGraph(atoms, duplicateEdgeBonds), false);
  assert.equal(isConnectedMoleculeGraph(atoms, disconnectedBonds), false);
});
