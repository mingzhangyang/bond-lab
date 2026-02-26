import assert from 'node:assert/strict';
import test from 'node:test';
import {
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
  assert.equal(nextLanguage('es'), 'en');
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
  assert.equal(resolveInitialLanguage('invalid'), 'en');
  assert.equal(resolveInitialLanguage(null), 'en');
});
