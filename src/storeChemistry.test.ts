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
