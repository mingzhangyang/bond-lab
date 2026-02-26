import assert from 'node:assert/strict';
import test from 'node:test';
import { getInfoThemeVars, getLabThemeVars } from './theme.ts';

test('info theme exposes key variables for both modes', () => {
  const darkVars = getInfoThemeVars('dark');
  const lightVars = getInfoThemeVars('light');

  assert.ok(darkVars['--info-page-bg']);
  assert.ok(darkVars['--info-panel-bg']);
  assert.ok(darkVars['--info-callout-bg']);
  assert.ok(lightVars['--info-page-bg']);
  assert.ok(lightVars['--info-panel-bg']);
  assert.ok(lightVars['--info-callout-bg']);
  assert.notEqual(darkVars['--info-page-bg'], lightVars['--info-page-bg']);
});

test('lab theme exposes key variables for both modes', () => {
  const darkVars = getLabThemeVars('dark');
  const lightVars = getLabThemeVars('light');

  assert.ok(darkVars['--lab-panel-bg']);
  assert.ok(darkVars['--lab-fab-bg']);
  assert.ok(darkVars['--lab-shadow']);
  assert.ok(lightVars['--lab-panel-bg']);
  assert.ok(lightVars['--lab-fab-bg']);
  assert.ok(lightVars['--lab-shadow']);
  assert.notEqual(darkVars['--lab-panel-bg'], lightVars['--lab-panel-bg']);
});
