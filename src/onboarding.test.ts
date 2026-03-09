import assert from 'node:assert/strict';
import test from 'node:test';
import {
  advanceOnboardingStep,
  getOnboardingStepIndex,
  ONBOARDING_VERSION,
  shouldShowOnboarding,
} from './onboarding.ts';

test('shouldShowOnboarding only hides the guide for the current version', () => {
  assert.equal(shouldShowOnboarding(null), true);
  assert.equal(shouldShowOnboarding('legacy-version'), true);
  assert.equal(shouldShowOnboarding(ONBOARDING_VERSION), false);
});

test('advanceOnboardingStep promotes the guide as the user completes tasks', () => {
  assert.equal(
    advanceOnboardingStep('add-atoms', { atomCount: 1, bondCount: 0 }),
    'add-atoms',
  );
  assert.equal(
    advanceOnboardingStep('add-atoms', { atomCount: 2, bondCount: 0 }),
    'create-bond',
  );
  assert.equal(
    advanceOnboardingStep('create-bond', { atomCount: 2, bondCount: 0 }),
    'create-bond',
  );
  assert.equal(
    advanceOnboardingStep('create-bond', { atomCount: 2, bondCount: 1 }),
    'explore',
  );
  assert.equal(
    advanceOnboardingStep('explore', { atomCount: 2, bondCount: 1 }),
    'explore',
  );
});

test('getOnboardingStepIndex maps guided steps to a stable sequence', () => {
  assert.equal(getOnboardingStepIndex('add-atoms'), 1);
  assert.equal(getOnboardingStepIndex('create-bond'), 2);
  assert.equal(getOnboardingStepIndex('explore'), 3);
});