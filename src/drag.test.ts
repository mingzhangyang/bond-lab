import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import {
  ELEMENT_DRAG_MIME_TYPE,
  getElementFromDragData,
  hasElementDragData,
  projectPointerToScenePlane,
  setElementDragData,
  toNormalizedDeviceCoordinates,
} from './drag.ts';

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

test('setElementDragData stores the element in both custom and plain-text payloads', () => {
  const values = new Map<string, string>();

  setElementDragData(
    {
      getData: (format) => values.get(format) ?? '',
      setData: (format, value) => {
        values.set(format, value);
      },
    },
    'O',
  );

  assert.equal(values.get(ELEMENT_DRAG_MIME_TYPE), 'O');
  assert.equal(values.get('text/plain'), 'O');
});

test('getElementFromDragData accepts valid element payloads and rejects invalid data', () => {
  assert.equal(
    getElementFromDragData({
      getData: (format) => (format === ELEMENT_DRAG_MIME_TYPE ? 'Cl' : ''),
    }),
    'Cl',
  );

  assert.equal(
    getElementFromDragData({
      getData: (format) => (format === 'text/plain' ? 'Xe' : ''),
    }),
    null,
  );
});

test('hasElementDragData recognizes draggable element payloads from drag types', () => {
  assert.equal(
    hasElementDragData({
      getData: () => '',
      types: [ELEMENT_DRAG_MIME_TYPE],
    }),
    true,
  );

  assert.equal(
    hasElementDragData({
      getData: () => '',
      types: ['text/uri-list'],
    }),
    false,
  );
});

test('projectPointerToScenePlane maps the canvas center to the world origin for the default view plane', () => {
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 10);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld();

  const raycaster = new THREE.Raycaster();
  const point = projectPointerToScenePlane(
    { clientX: 300, clientY: 250 },
    { left: 100, top: 50, width: 400, height: 400 },
    camera,
    raycaster,
  );

  assert.ok(point);
  assert.ok(point.distanceTo(new THREE.Vector3(0, 0, 0)) < 1e-6);
});

test('projectPointerToScenePlane preserves the requested plane depth', () => {
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 10);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld();

  const raycaster = new THREE.Raycaster();
  const point = projectPointerToScenePlane(
    { clientX: 400, clientY: 200 },
    { left: 100, top: 50, width: 400, height: 400 },
    camera,
    raycaster,
    new THREE.Vector3(0, 0, 2),
  );

  assert.ok(point);
  assert.ok(Math.abs(point.z - 2) < 1e-6);
  assert.ok(point.x > 0);
});
