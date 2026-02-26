import assert from 'node:assert/strict';
import test from 'node:test';
import { getAppShellTheme, resolveBootTheme } from './appShell.ts';

test('resolveBootTheme prefers a valid stored theme', () => {
  assert.equal(resolveBootTheme('light', true), 'light');
  assert.equal(resolveBootTheme('dark', false), 'dark');
});

test('resolveBootTheme falls back to system preference when storage is invalid', () => {
  assert.equal(resolveBootTheme('invalid', true), 'dark');
  assert.equal(resolveBootTheme(null, false), 'light');
});

test('getAppShellTheme returns stable shell colors for both themes', () => {
  const darkTheme = getAppShellTheme('dark');
  const lightTheme = getAppShellTheme('light');

  assert.deepEqual(darkTheme, {
    background: '#18181b',
    canvasBackground: '#18181b',
    colorScheme: 'dark',
    text: '#f4f4f5',
  });
  assert.deepEqual(lightTheme, {
    background: '#e2e8f0',
    canvasBackground: '#e2e8f0',
    colorScheme: 'light',
    text: '#0f172a',
  });
});
