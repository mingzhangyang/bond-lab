import test from 'node:test';
import assert from 'node:assert/strict';

import { getProgressColorClass, shouldExpandMobileChallenge } from './challengeLayout.ts';

test('shouldExpandMobileChallenge collapses while playing', () => {
  assert.equal(shouldExpandMobileChallenge('playing'), false);
});

test('shouldExpandMobileChallenge expands for won/lost states', () => {
  assert.equal(shouldExpandMobileChallenge('won'), true);
  assert.equal(shouldExpandMobileChallenge('lost'), true);
  assert.equal(shouldExpandMobileChallenge('idle'), true);
});

test('getProgressColorClass returns segmented color classes', () => {
  assert.equal(getProgressColorClass(80), 'bg-emerald-500');
  assert.equal(getProgressColorClass(49.9), 'bg-yellow-500');
  assert.equal(getProgressColorClass(19.9), 'bg-red-500');
});
