import assert from 'node:assert/strict';
import test from 'node:test';
import { identifyMolecule } from './identifier.ts';
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
