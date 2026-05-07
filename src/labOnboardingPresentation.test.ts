import assert from 'node:assert/strict';
import test from 'node:test';
import { deriveOnboardingHighlightClasses } from './labOnboardingPresentation.ts';

test('deriveOnboardingHighlightClasses highlights element panel only on add-atoms step', () => {
  const classes = deriveOnboardingHighlightClasses('add-atoms');
  assert.equal(classes.elementPanelHighlightClass, 'lab-onboarding-highlight');
  assert.equal(classes.sceneExploreHighlightClass, '');
});

test('deriveOnboardingHighlightClasses highlights scene only on explore step', () => {
  const classes = deriveOnboardingHighlightClasses('explore');
  assert.equal(classes.elementPanelHighlightClass, '');
  assert.equal(classes.sceneExploreHighlightClass, 'lab-onboarding-highlight');
});

test('deriveOnboardingHighlightClasses returns empty classes for non-highlighted steps', () => {
  const welcome = deriveOnboardingHighlightClasses('welcome');
  const createBond = deriveOnboardingHighlightClasses('create-bond');
  const none = deriveOnboardingHighlightClasses(null);

  assert.equal(welcome.elementPanelHighlightClass, '');
  assert.equal(welcome.sceneExploreHighlightClass, '');
  assert.equal(createBond.elementPanelHighlightClass, '');
  assert.equal(createBond.sceneExploreHighlightClass, '');
  assert.equal(none.elementPanelHighlightClass, '');
  assert.equal(none.sceneExploreHighlightClass, '');
});
