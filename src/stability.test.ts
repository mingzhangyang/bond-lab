import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateStability } from './stability.ts';
import type { Atom, Bond } from './store.ts';

test('calculateStability returns fully stable result for empty input', () => {
  assert.deepEqual(calculateStability([], []), { score: 100, energy: 0, issues: [] });
});

test('calculateStability penalizes unsatisfied valency', () => {
  const atoms: Atom[] = [{ id: 'c1', element: 'C' }];
  const bonds: Bond[] = [];

  const result = calculateStability(atoms, bonds);

  assert.ok(result.score < 100);
  assert.ok(result.issues.some((issue) => issue.includes('unsatisfied valency')));
});

test('calculateStability penalizes exceeded valency', () => {
  const atoms: Atom[] = [
    { id: 'h1', element: 'H' },
    { id: 'h2', element: 'H' },
    { id: 'c1', element: 'C' },
  ];
  const bonds: Bond[] = [
    { id: 'b1', source: 'h1', target: 'h2', order: 1 },
    { id: 'b2', source: 'h1', target: 'c1', order: 1 },
  ];

  const result = calculateStability(atoms, bonds);

  assert.ok(result.issues.some((issue) => issue.includes('exceeded')));
});

test('calculateStability penalizes angle distortion when geometry is bent away from ideal', () => {
  const atoms: Atom[] = [
    { id: 'o1', element: 'O' },
    { id: 'c1', element: 'C' },
    { id: 'o2', element: 'O' },
  ];
  const bonds: Bond[] = [
    { id: 'b1', source: 'c1', target: 'o1', order: 2 },
    { id: 'b2', source: 'c1', target: 'o2', order: 2 },
  ];

  const ideal = calculateStability(atoms, bonds, {
    positions: {
      c1: { x: 0, y: 0, z: 0 },
      o1: { x: -1, y: 0, z: 0 },
      o2: { x: 1, y: 0, z: 0 },
    },
  });
  const bent = calculateStability(atoms, bonds, {
    positions: {
      c1: { x: 0, y: 0, z: 0 },
      o1: { x: 1, y: 0, z: 0 },
      o2: { x: 0, y: 1, z: 0 },
    },
  });

  assert.ok(ideal.score > bent.score);
  assert.ok(bent.issues.some((issue) => issue.includes('Geometry strain')));
});

test('calculateStability stacks geometry penalties with valency penalties', () => {
  const atoms: Atom[] = [
    { id: 'c1', element: 'C' },
    { id: 'h1', element: 'H' },
    { id: 'h2', element: 'H' },
    { id: 'h3', element: 'H' },
  ];
  const bonds: Bond[] = [
    { id: 'b1', source: 'c1', target: 'h1', order: 1 },
    { id: 'b2', source: 'c1', target: 'h2', order: 1 },
    { id: 'b3', source: 'c1', target: 'h3', order: 1 },
  ];

  const nearIdeal = calculateStability(atoms, bonds, {
    positions: {
      c1: { x: 0, y: 0, z: 0 },
      h1: { x: 1, y: 0, z: 0 },
      h2: { x: -0.5, y: 0.866, z: 0 },
      h3: { x: -0.5, y: -0.866, z: 0 },
    },
  });
  const distorted = calculateStability(atoms, bonds, {
    positions: {
      c1: { x: 0, y: 0, z: 0 },
      h1: { x: 1, y: 0, z: 0 },
      h2: { x: 0, y: 1, z: 0 },
      h3: { x: 0, y: -1, z: 0 },
    },
  });

  assert.ok(nearIdeal.issues.some((issue) => issue.includes('unsatisfied valency')));
  assert.ok(distorted.issues.some((issue) => issue.includes('unsatisfied valency')));
  assert.ok(distorted.issues.some((issue) => issue.includes('Geometry strain')));
  assert.ok(distorted.score < nearIdeal.score);
});

test('calculateStability does not apply geometry penalty when there are insufficient points for angles', () => {
  const atoms: Atom[] = [
    { id: 'h1', element: 'H' },
    { id: 'h2', element: 'H' },
  ];
  const bonds: Bond[] = [{ id: 'b1', source: 'h1', target: 'h2', order: 1 }];

  const withoutGeometry = calculateStability(atoms, bonds);
  const withGeometry = calculateStability(atoms, bonds, {
    positions: {
      h1: { x: 0, y: 0, z: 0 },
      h2: { x: 1, y: 0, z: 0 },
    },
  });

  assert.deepEqual(withGeometry, withoutGeometry);
  assert.ok(withGeometry.issues.every((issue) => !issue.includes('Geometry strain')));
});
