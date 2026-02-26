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
