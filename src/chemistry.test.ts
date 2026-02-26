import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ELEMENTS,
  ELEMENT_DISPLAY_ORDER,
  getBondChemistry,
  getFallbackBondChemistry,
  normalizeBondChemistry,
} from './chemistry.ts';

test('ELEMENTS exposes chemistry metadata required for advanced calculations', () => {
  assert.equal(ELEMENTS.C.covalentRadius, 0.76);
  assert.equal(ELEMENTS.O.electronegativity, 3.44);
  assert.equal(ELEMENTS.N.maxBonds, 3);
  assert.equal(ELEMENTS.S.maxBonds, 6);
  assert.equal(ELEMENTS.P.valence, 5);
  assert.equal(ELEMENTS.F.maxBonds, 1);
  assert.equal(ELEMENTS.Cl.maxBonds, 1);
  assert.equal(ELEMENTS.Fe.symbol, 'Fe');
  assert.equal(ELEMENTS.Mg.symbol, 'Mg');
  assert.equal(ELEMENTS.Cu.symbol, 'Cu');
  assert.equal(ELEMENTS.Al.symbol, 'Al');
  assert.equal(ELEMENTS.Ca.symbol, 'Ca');
  assert.equal(ELEMENTS.Na.symbol, 'Na');
  assert.equal(ELEMENTS.K.symbol, 'K');
});

test('ELEMENT_DISPLAY_ORDER follows periodic-table ordering for selectable elements', () => {
  assert.deepEqual(ELEMENT_DISPLAY_ORDER, [
    'H',
    'C',
    'N',
    'O',
    'F',
    'Na',
    'Mg',
    'Al',
    'P',
    'S',
    'Cl',
    'K',
    'Ca',
    'Fe',
    'Cu',
  ]);
  assert.deepEqual([...ELEMENT_DISPLAY_ORDER].sort(), Object.keys(ELEMENTS).sort());
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

test('getBondChemistry uses configured values for common halogen bonds', () => {
  const hcl = getBondChemistry('H', 'Cl', 1);

  assert.equal(hcl.rotatable, true);
  assert.equal(hcl.bondLength, 1.27);
  assert.equal(hcl.bondEnergy, 431);
});
