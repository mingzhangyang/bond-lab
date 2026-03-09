import assert from 'node:assert/strict';
import test from 'node:test';
import { useStore } from './store.ts';

test('addBond stores chemistry metadata and updates rotatable on bond order upgrade', () => {
  useStore.getState().clear();

  const c1 = useStore.getState().addAtom('C');
  const c2 = useStore.getState().addAtom('C');

  useStore.getState().addBond(c1, c2);
  let bond = useStore.getState().bonds[0];

  assert.equal(bond.order, 1);
  assert.equal(bond.rotatable, true);
  assert.ok((bond.bondLength ?? 0) > 0);
  assert.ok((bond.bondEnergy ?? 0) > 0);

  useStore.getState().addBond(c1, c2);
  bond = useStore.getState().bonds[0];

  assert.equal(bond.order, 2);
  assert.equal(bond.rotatable, false);
  assert.ok((bond.bondLength ?? 0) > 0);
  assert.ok((bond.bondEnergy ?? 0) > 0);

  useStore.getState().clear();
});

test('addBond allows carbon monoxide as a carbon-oxygen triple bond special case', () => {
  useStore.getState().clear();

  const carbon = useStore.getState().addAtom('C');
  const oxygen = useStore.getState().addAtom('O');

  useStore.getState().addBond(carbon, oxygen);
  useStore.getState().addBond(carbon, oxygen);
  useStore.getState().addBond(carbon, oxygen);

  const bond = useStore.getState().bonds[0];

  assert.equal(useStore.getState().bonds.length, 1);
  assert.equal(bond.order, 3);
  assert.equal(bond.rotatable, false);
  assert.equal(bond.bondLength, 1.13);
  assert.equal(bond.bondEnergy, 1072);

  useStore.getState().clear();
});
