import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getMobileChallengeProgress,
  shouldForceOpenMobileChallengeDrawer,
  shouldOpenMobileChallengeDrawerOnActivation,
  shouldShowMobileStatusChip,
} from './mobileLabUi.ts';

test('getMobileChallengeProgress returns clamped ratio only while playing', () => {
  assert.equal(getMobileChallengeProgress('idle', 10, 20), null);
  assert.equal(getMobileChallengeProgress('playing', 10, 0), null);
  assert.equal(getMobileChallengeProgress('playing', 10, 20), 0.5);
  assert.equal(getMobileChallengeProgress('playing', -10, 20), 0);
  assert.equal(getMobileChallengeProgress('playing', 30, 20), 1);
});

test('mobile challenge drawer open rules reflect layout and challenge status', () => {
  assert.equal(shouldOpenMobileChallengeDrawerOnActivation(true, true), true);
  assert.equal(shouldOpenMobileChallengeDrawerOnActivation(true, false), false);
  assert.equal(shouldOpenMobileChallengeDrawerOnActivation(false, true), false);

  assert.equal(shouldForceOpenMobileChallengeDrawer(true, true, 'won'), true);
  assert.equal(shouldForceOpenMobileChallengeDrawer(true, true, 'lost'), true);
  assert.equal(shouldForceOpenMobileChallengeDrawer(true, true, 'playing'), false);
  assert.equal(shouldForceOpenMobileChallengeDrawer(false, true, 'won'), false);
});

test('shouldShowMobileStatusChip disables chip on desktop', () => {
  assert.equal(shouldShowMobileStatusChip(true), false);
  assert.equal(shouldShowMobileStatusChip(false), true);
});
