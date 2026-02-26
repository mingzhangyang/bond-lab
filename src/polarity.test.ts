import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateMolecularPolarity } from './polarity.ts';
import type { Atom, Bond } from './store.ts';

test('calculateMolecularPolarity classifies CO2 as nonpolar with symmetric geometry', () => {
  const atoms: Atom[] = [
    { id: 'o1', element: 'O' },
    { id: 'c1', element: 'C' },
    { id: 'o2', element: 'O' },
  ];
  const bonds: Bond[] = [
    { id: 'b1', source: 'c1', target: 'o1', order: 2 },
    { id: 'b2', source: 'c1', target: 'o2', order: 2 },
  ];

  const result = calculateMolecularPolarity(atoms, bonds, {
    c1: { x: 0, y: 0, z: 0 },
    o1: { x: -1, y: 0, z: 0 },
    o2: { x: 1, y: 0, z: 0 },
  });

  assert.equal(result.classification, 'nonpolar');
  assert.ok(result.netDipole < 0.2);
});

test('calculateMolecularPolarity classifies H2O as polar with bent geometry', () => {
  const atoms: Atom[] = [
    { id: 'o1', element: 'O' },
    { id: 'h1', element: 'H' },
    { id: 'h2', element: 'H' },
  ];
  const bonds: Bond[] = [
    { id: 'b1', source: 'o1', target: 'h1', order: 1 },
    { id: 'b2', source: 'o1', target: 'h2', order: 1 },
  ];

  const result = calculateMolecularPolarity(atoms, bonds, {
    o1: { x: 0, y: 0, z: 0 },
    h1: { x: 1, y: 0, z: 0 },
    h2: { x: -0.25, y: 0.97, z: 0 },
  });

  assert.equal(result.classification, 'polar');
  assert.ok(result.netDipole > 0.2);
});

test('calculateMolecularPolarity returns unknown when geometry data is missing', () => {
  const atoms: Atom[] = [
    { id: 'h1', element: 'H' },
    { id: 'h2', element: 'H' },
  ];
  const bonds: Bond[] = [{ id: 'b1', source: 'h1', target: 'h2', order: 1 }];

  const result = calculateMolecularPolarity(atoms, bonds);
  assert.equal(result.classification, 'unknown');
});

test('calculateMolecularPolarity infers diatomic polarity without geometry', () => {
  const atoms: Atom[] = [
    { id: 'h1', element: 'H' },
    { id: 'f1', element: 'F' },
  ];
  const bonds: Bond[] = [{ id: 'b1', source: 'h1', target: 'f1', order: 1 }];

  const result = calculateMolecularPolarity(atoms, bonds);

  assert.equal(result.classification, 'polar');
  assert.ok(result.reason.includes('Electronegativity difference'));
});
