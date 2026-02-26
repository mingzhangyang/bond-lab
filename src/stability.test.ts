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
