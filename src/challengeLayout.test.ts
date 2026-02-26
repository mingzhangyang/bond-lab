import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getChallengeTimerArc,
  getProgressColorClass,
  isCompactChallengeView,
  shouldUseMobileChallengeDrawer,
  shouldExpandMobileChallenge,
} from './challengeLayout.ts';

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

test('isCompactChallengeView only returns true for collapsed mobile playing state', () => {
  assert.equal(isCompactChallengeView('playing', false, true), true);
  assert.equal(isCompactChallengeView('playing', true, true), false);
  assert.equal(isCompactChallengeView('playing', false, false), false);
  assert.equal(isCompactChallengeView('won', false, true), false);
});

test('shouldUseMobileChallengeDrawer only enables drawer on narrow viewports', () => {
  assert.equal(shouldUseMobileChallengeDrawer(true, false, false), true);
  assert.equal(shouldUseMobileChallengeDrawer(true, true, false), true);
  assert.equal(shouldUseMobileChallengeDrawer(true, false, true), true);
  assert.equal(shouldUseMobileChallengeDrawer(true, true, true), true);
  assert.equal(shouldUseMobileChallengeDrawer(false, false, false), false);
  assert.equal(shouldUseMobileChallengeDrawer(false, true, false), false);
  assert.equal(shouldUseMobileChallengeDrawer(false, false, true), false);
});

test('getChallengeTimerArc returns full arc at start and empty arc at timeout', () => {
  const radius = 20;
  const start = getChallengeTimerArc(30, 30, radius);
  const end = getChallengeTimerArc(0, 30, radius);

  assert.equal(start.remainingRatio, 1);
  assert.equal(start.strokeDashoffset, 0);
  assert.equal(start.strokeDasharray, `${start.circumference} ${start.circumference}`);

  assert.equal(end.remainingRatio, 0);
  assert.equal(end.strokeDashoffset, end.circumference);
  assert.equal(end.strokeDasharray, `${end.circumference} ${end.circumference}`);
});

test('getChallengeTimerArc clamps invalid inputs to a safe ratio range', () => {
  const over = getChallengeTimerArc(50, 30, 20);
  const under = getChallengeTimerArc(-10, 30, 20);
  const missingTotal = getChallengeTimerArc(10, 0, 20);

  assert.equal(over.remainingRatio, 1);
  assert.equal(under.remainingRatio, 0);
  assert.equal(missingTotal.remainingRatio, 0);
});
