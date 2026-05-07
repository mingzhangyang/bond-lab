import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import * as THREE from 'three';
import {
  getPhysicsSceneState,
  resetPhysicsSceneState,
} from './physicsState.ts';

test('IDEAL_BOND_LENGTH is a positive exported constant', () => {
  const source = readFileSync('src/physics.ts', 'utf8');
  assert.match(source, /export const IDEAL_BOND_LENGTH\s*=\s*[\d.]+/);
  const match = source.match(/export const IDEAL_BOND_LENGTH\s*=\s*([\d.]+)/);
  assert.ok(match, 'IDEAL_BOND_LENGTH constant not found');
  assert.ok(Number(match![1]) > 0, 'IDEAL_BOND_LENGTH must be positive');
});

test('resetPhysicsSceneState clears all position and velocity data', () => {
  const state = getPhysicsSceneState();
  state.atomPositions['a1'] = new THREE.Vector3(1, 2, 3);
  state.atomVelocities['a1'] = new THREE.Vector3(0.5, 0, 0);
  state.lonePairs['a1'] = [new THREE.Vector3(1, 0, 0)];

  resetPhysicsSceneState();

  assert.equal(Object.keys(state.atomPositions).length, 0);
  assert.equal(Object.keys(state.atomVelocities).length, 0);
  assert.equal(Object.keys(state.lonePairs).length, 0);
});

test('resetPhysicsSceneState clears mesh and group refs', () => {
  const state = getPhysicsSceneState();
  state.atomMeshRefs['a1'] = new THREE.Mesh();
  state.bondGroupRefs['b1'] = new THREE.Group();

  resetPhysicsSceneState();

  assert.equal(Object.keys(state.atomMeshRefs).length, 0);
  assert.equal(Object.keys(state.bondGroupRefs).length, 0);
});

test('getPhysicsSceneState returns the same singleton each call', () => {
  const s1 = getPhysicsSceneState();
  const s2 = getPhysicsSceneState();
  assert.equal(s1, s2, 'must return the same object');
});

test('resetPhysicsSceneState preserves object identity of all maps', () => {
  const state = getPhysicsSceneState();
  const originalPositions = state.atomPositions;
  const originalVelocities = state.atomVelocities;
  const originalLonePairs = state.lonePairs;
  const originalMeshRefs = state.atomMeshRefs;
  const originalBondRefs = state.bondGroupRefs;

  state.atomPositions['x'] = new THREE.Vector3();
  resetPhysicsSceneState();

  assert.equal(state.atomPositions, originalPositions, 'atomPositions reference must not change');
  assert.equal(state.atomVelocities, originalVelocities, 'atomVelocities reference must not change');
  assert.equal(state.lonePairs, originalLonePairs, 'lonePairs reference must not change');
  assert.equal(state.atomMeshRefs, originalMeshRefs, 'atomMeshRefs reference must not change');
  assert.equal(state.bondGroupRefs, originalBondRefs, 'bondGroupRefs reference must not change');
});

test('auto-bond proximity threshold is derived from IDEAL_BOND_LENGTH', () => {
  const atomSource = readFileSync('src/components/AtomNode.tsx', 'utf8');
  assert.match(
    atomSource,
    /IDEAL_BOND_LENGTH\s*\*\s*[\d.]+/,
    'auto-bond threshold in AtomNode must reference IDEAL_BOND_LENGTH',
  );
  assert.doesNotMatch(
    atomSource,
    /distanceTo\(p2\)\s*<\s*[\d.]+[^*]/,
    'auto-bond threshold must not be a bare literal',
  );
});

test('VSEPR supports 5-domain geometry for hypervalent molecules', () => {
  const source = readFileSync('src/physics.ts', 'utf8');
  assert.match(source, /numDomains === 5/, 'physics must handle 5-domain VSEPR geometry');
  assert.match(source, /numDomains >= 6/, 'physics must handle 6-domain VSEPR geometry');
});
