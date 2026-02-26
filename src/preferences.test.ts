import assert from 'node:assert/strict';
import test from 'node:test';
import {
  resolveInitialControlsCollapsed,
  nextLanguage,
  resolveInitialLanguage,
  resolveInitialTheme,
  toggleTheme,
} from './preferences.ts';

test('toggleTheme swaps between dark and light', () => {
  assert.equal(toggleTheme('dark'), 'light');
  assert.equal(toggleTheme('light'), 'dark');
});

test('nextLanguage cycles through supported options', () => {
  assert.equal(nextLanguage('en'), 'es');
  assert.equal(nextLanguage('es'), 'zh');
  assert.equal(nextLanguage('zh'), 'fr');
  assert.equal(nextLanguage('fr'), 'ja');
  assert.equal(nextLanguage('ja'), 'en');
});

test('resolveInitialTheme honors valid stored values first', () => {
  assert.equal(resolveInitialTheme('light', true), 'light');
  assert.equal(resolveInitialTheme('dark', false), 'dark');
});

test('resolveInitialTheme falls back to system preference when storage is invalid', () => {
  assert.equal(resolveInitialTheme('unknown', true), 'dark');
  assert.equal(resolveInitialTheme(null, false), 'light');
});

test('resolveInitialLanguage returns a supported language', () => {
  assert.equal(resolveInitialLanguage('es'), 'es');
  assert.equal(resolveInitialLanguage('zh'), 'zh');
  assert.equal(resolveInitialLanguage('fr'), 'fr');
  assert.equal(resolveInitialLanguage('ja'), 'ja');
  assert.equal(resolveInitialLanguage('invalid'), 'en');
  assert.equal(resolveInitialLanguage(null), 'en');
});

test('resolveInitialControlsCollapsed defaults to false and honors stored values', () => {
  assert.equal(resolveInitialControlsCollapsed('true'), true);
  assert.equal(resolveInitialControlsCollapsed('false'), false);
  assert.equal(resolveInitialControlsCollapsed('invalid'), false);
  assert.equal(resolveInitialControlsCollapsed(null), false);
});
