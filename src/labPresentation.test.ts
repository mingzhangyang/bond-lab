import assert from 'node:assert/strict';
import test from 'node:test';
import { deriveLabClassPalette, getThemeActionText } from './labPresentation.ts';

test('getThemeActionText returns localized toggle copy by current theme', () => {
  assert.equal(getThemeActionText('en', true), 'Use light mode');
  assert.equal(getThemeActionText('en', false), 'Use dark mode');
  assert.equal(getThemeActionText('zh', true), '切换到浅色');
  assert.equal(getThemeActionText('ja', false), 'ダークモードへ');
});

test('deriveLabClassPalette adapts classes for theme and interaction mode', () => {
  const darkDelete = deriveLabClassPalette('dark', 'delete');
  assert.equal(darkDelete.isDark, true);
  assert.match(darkDelete.primaryTextClass, /text-zinc-100/);
  assert.match(darkDelete.ghostButtonClass, /hover:text-white/);
  assert.match(darkDelete.interactionBubbleClass, /bg-red-500/);

  const lightBuild = deriveLabClassPalette('light', 'build');
  assert.equal(lightBuild.isDark, false);
  assert.match(lightBuild.primaryTextClass, /text-zinc-900/);
  assert.match(lightBuild.ghostButtonClass, /hover:text-zinc-900/);
  assert.equal(lightBuild.interactionBubbleClass, 'lab-fab text-white');
});
