import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getRotationGroupAtomIds,
  isBondRotatable,
  rotateAtomPositionsAroundAxis,
  rotatePointAroundAxis,
} from './rotation.ts';

test('isBondRotatable follows explicit metadata and order fallback', () => {
  assert.equal(isBondRotatable({ order: 1, rotatable: true }), true);
  assert.equal(isBondRotatable({ order: 1, rotatable: false }), false);
  assert.equal(isBondRotatable({ order: 1 }), true);
  assert.equal(isBondRotatable({ order: 2 }), false);
  assert.equal(isBondRotatable({ order: 3 }), false);
});

test('getRotationGroupAtomIds returns the rotating side of a bond graph', () => {
  const atoms = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }];
  const bonds = [
    { source: 'a', target: 'b' },
    { source: 'b', target: 'c' },
    { source: 'b', target: 'd' },
  ];

  const rotating = getRotationGroupAtomIds(atoms, bonds, 'a', 'b').sort();
  assert.deepEqual(rotating, ['b', 'c', 'd']);
});

test('rotatePointAroundAxis rotates coordinates correctly for simple axis', () => {
  const rotated = rotatePointAroundAxis(
    { x: 0, y: 1, z: 0 },
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 0, z: 0 },
    Math.PI / 2,
  );

  assert.ok(Math.abs(rotated.x - 0) < 1e-6);
  assert.ok(Math.abs(rotated.y - 0) < 1e-6);
  assert.ok(Math.abs(rotated.z - 1) < 1e-6);
});

test('rotateAtomPositionsAroundAxis preserves anchor-pivot bond length', () => {
  const positions = {
    anchor: { x: 0, y: 0, z: 0 },
    pivot: { x: 1, y: 0, z: 0 },
    leaf: { x: 1, y: 1, z: 0 },
  };
  const before = Math.sqrt(
    (positions.pivot.x - positions.anchor.x) ** 2 +
    (positions.pivot.y - positions.anchor.y) ** 2 +
    (positions.pivot.z - positions.anchor.z) ** 2,
  );

  rotateAtomPositionsAroundAxis(
    positions,
    ['pivot', 'leaf'],
    positions.anchor,
    { x: positions.pivot.x - positions.anchor.x, y: 0, z: 0 },
    Math.PI / 3,
  );

  const after = Math.sqrt(
    (positions.pivot.x - positions.anchor.x) ** 2 +
    (positions.pivot.y - positions.anchor.y) ** 2 +
    (positions.pivot.z - positions.anchor.z) ** 2,
  );

  assert.ok(Math.abs(before - after) < 1e-6);
});
