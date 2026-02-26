import assert from 'node:assert/strict';
import test from 'node:test';
import { toNormalizedDeviceCoordinates } from './drag.ts';

test('toNormalizedDeviceCoordinates converts pointer coordinates using canvas rect', () => {
  const ndc = toNormalizedDeviceCoordinates(
    { clientX: 300, clientY: 250 },
    { left: 100, top: 50, width: 400, height: 400 },
  );

  assert.equal(ndc.x, 0);
  assert.equal(ndc.y, 0);
});

test('toNormalizedDeviceCoordinates maps top-left and bottom-right corners correctly', () => {
  const topLeft = toNormalizedDeviceCoordinates(
    { clientX: 100, clientY: 50 },
    { left: 100, top: 50, width: 400, height: 400 },
  );
  const bottomRight = toNormalizedDeviceCoordinates(
    { clientX: 500, clientY: 450 },
    { left: 100, top: 50, width: 400, height: 400 },
  );

  assert.equal(topLeft.x, -1);
  assert.equal(topLeft.y, 1);
  assert.equal(bottomRight.x, 1);
  assert.equal(bottomRight.y, -1);
});
