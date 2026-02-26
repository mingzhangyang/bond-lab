import assert from 'node:assert/strict';
import test from 'node:test';
import { getPathForRoute, getRouteFromPath } from './routes.ts';

test('getRouteFromPath resolves known page paths', () => {
  assert.equal(getRouteFromPath('/'), 'lab');
  assert.equal(getRouteFromPath('/privacy'), 'privacy');
  assert.equal(getRouteFromPath('/instructions'), 'instructions');
});

test('getRouteFromPath falls back to lab for unknown paths', () => {
  assert.equal(getRouteFromPath('/unknown'), 'lab');
  assert.equal(getRouteFromPath('/privacy/extra'), 'lab');
});

test('getPathForRoute returns canonical paths', () => {
  assert.equal(getPathForRoute('lab'), '/');
  assert.equal(getPathForRoute('privacy'), '/privacy');
  assert.equal(getPathForRoute('instructions'), '/instructions');
});
