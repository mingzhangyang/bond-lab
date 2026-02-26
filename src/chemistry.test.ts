import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ELEMENTS,
  getBondChemistry,
  getFallbackBondChemistry,
  normalizeBondChemistry,
} from './chemistry.ts';

test('ELEMENTS exposes chemistry metadata required for advanced calculations', () => {
  assert.equal(ELEMENTS.C.covalentRadius, 0.76);
  assert.equal(ELEMENTS.O.electronegativity, 3.44);
  assert.equal(ELEMENTS.N.maxBonds, 3);
});

test('getBondChemistry sets rotatable by bond order', () => {
  const single = getBondChemistry('C', 'C', 1);
  const double = getBondChemistry('C', 'C', 2);
  const triple = getBondChemistry('C', 'N', 3);

  assert.equal(single.rotatable, true);
  assert.equal(double.rotatable, false);
  assert.equal(triple.rotatable, false);
});

test('normalizeBondChemistry hydrates legacy bond objects with defaults', () => {
  const hydrated = normalizeBondChemistry({ order: 2 }, 'C', 'O');

  assert.equal(hydrated.rotatable, false);
  assert.ok(hydrated.bondLength > 0);
  assert.ok(hydrated.bondEnergy > 0);
});

test('normalizeBondChemistry preserves explicit bond chemistry values', () => {
  const hydrated = normalizeBondChemistry(
    { order: 1, bondLength: 9.99, bondEnergy: 111, rotatable: false },
    'C',
    'H',
  );

  assert.deepEqual(hydrated, { bondLength: 9.99, bondEnergy: 111, rotatable: false });
});

test('fallback chemistry handles missing element context for migration safety', () => {
  const fallback = getFallbackBondChemistry(3);

  assert.equal(fallback.rotatable, false);
  assert.ok(fallback.bondLength > 0);
  assert.ok(fallback.bondEnergy > 0);
});
