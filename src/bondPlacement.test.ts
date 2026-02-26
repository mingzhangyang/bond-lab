import assert from 'node:assert/strict';
import test from 'node:test';
import { computeBondPlacement } from './bondPlacement.ts';

test('computeBondPlacement clips bond by atom radii with overlap', () => {
  const placement = computeBondPlacement(4, 1, 1, 0.1, 0.001);

  assert.equal(placement.length, 2.2);
  assert.equal(placement.centerOffset, 2);
});

test('computeBondPlacement falls back to center placement when atoms are too close', () => {
  const placement = computeBondPlacement(1, 1, 1, 0.1, 0.001);

  assert.equal(placement.length, 1);
  assert.equal(placement.centerOffset, 0.5);
});

test('computeBondPlacement guards against near-zero distance', () => {
  const placement = computeBondPlacement(0, 1, 1, 0.1, 0.001);

  assert.equal(placement.length, 0.001);
  assert.equal(placement.centerOffset, 0);
});
