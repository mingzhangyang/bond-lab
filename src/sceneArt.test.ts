import assert from 'node:assert/strict';
import test from 'node:test';
import { ELEMENTS } from './chemistry.ts';
import {
  easeOutBack,
  getContrastRatio,
  getAtomHalo,
  getBondHighlight,
  getReadableTextColor,
  getSceneLighting,
} from './sceneArt.ts';

test('getReadableTextColor picks dark text on light swatches and light text on dark swatches', () => {
  assert.equal(getReadableTextColor('#FFFFFF'), '#020617');
  assert.equal(getReadableTextColor('#FFC857'), '#020617');
  assert.equal(getReadableTextColor('#8DE969'), '#020617');
  assert.equal(getReadableTextColor('#FF2222'), '#020617');
  assert.equal(getReadableTextColor('#444444'), '#ffffff');
  assert.equal(getReadableTextColor('#2244FF'), '#ffffff');
});

test('getReadableTextColor meets WCAG normal-text contrast (4.5:1) for every element swatch', () => {
  for (const [element, data] of Object.entries(ELEMENTS)) {
    const ratio = getContrastRatio(data.color, getReadableTextColor(data.color));
    assert.ok(ratio >= 4.5, `${element} label contrast ${ratio.toFixed(2)} is below 4.5:1`);
  }
});

test('getReadableTextColor accepts short hex and falls back to white for invalid input', () => {
  assert.equal(getReadableTextColor('#fff'), '#020617');
  assert.equal(getReadableTextColor('not-a-color'), '#ffffff');
});

test('getContrastRatio matches known WCAG reference values', () => {
  assert.ok(Math.abs(getContrastRatio('#000000', '#ffffff') - 21) < 1e-9);
  assert.equal(getContrastRatio('#123456', '#123456'), 1);
  assert.ok(Number.isNaN(getContrastRatio('nope', '#ffffff')));
});

test('getAtomHalo is hidden for idle atoms', () => {
  assert.equal(getAtomHalo({ isSelected: false, hovered: false, interactionMode: 'build' }), null);
});

test('getAtomHalo highlights selection more strongly than hover', () => {
  const selected = getAtomHalo({ isSelected: true, hovered: false, interactionMode: 'build' });
  const hovered = getAtomHalo({ isSelected: false, hovered: true, interactionMode: 'build' });
  assert.ok(selected && hovered);
  assert.ok(selected.opacity > hovered.opacity);
  assert.ok(selected.scale > hovered.scale);
});

test('getAtomHalo warns with red when hovering in delete mode', () => {
  const halo = getAtomHalo({ isSelected: false, hovered: true, interactionMode: 'delete' });
  assert.equal(halo?.color, '#ef4444');
});

test('getBondHighlight returns null for idle bonds so atom colors show through', () => {
  assert.equal(
    getBondHighlight({
      isRotating: false,
      isSelected: false,
      hovered: false,
      interactionMode: 'build',
      shiftPressed: false,
      bondRotatable: true,
    }),
    null,
  );
});

test('getBondHighlight keeps state priority: rotating > selected > delete hover > rotate hint', () => {
  const base = {
    isRotating: false,
    isSelected: false,
    hovered: true,
    interactionMode: 'build',
    shiftPressed: false,
    bondRotatable: true,
  };

  assert.equal(getBondHighlight({ ...base, isRotating: true, isSelected: true })?.color, '#38bdf8');
  assert.equal(getBondHighlight({ ...base, isSelected: true })?.color, '#22c55e');
  assert.equal(getBondHighlight({ ...base, interactionMode: 'delete' })?.color, '#ef4444');
  assert.equal(getBondHighlight({ ...base, shiftPressed: true })?.color, '#f59e0b');
  assert.equal(getBondHighlight({ ...base, shiftPressed: true, bondRotatable: false })?.color, '#f87171');
  assert.ok(getBondHighlight(base));
});

test('getSceneLighting returns brighter key light and softer fill in light theme', () => {
  const dark = getSceneLighting('dark');
  const light = getSceneLighting('light');
  assert.ok(dark.environmentIntensity > 0);
  assert.ok(light.environmentIntensity > 0);
  assert.ok(dark.rimIntensity > light.rimIntensity);
});

test('easeOutBack starts at 0, ends at 1 and overshoots in between', () => {
  assert.equal(easeOutBack(0), 0);
  assert.ok(Math.abs(easeOutBack(1) - 1) < 1e-9);
  assert.ok(easeOutBack(0.7) > 1);
  assert.equal(easeOutBack(-1), 0);
  assert.equal(easeOutBack(2), 1);
});
