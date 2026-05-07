import assert from 'node:assert/strict';
import test from 'node:test';
import { useStore } from './store.ts';

function setupSingleBond() {
  useStore.getState().clear();
  const c1 = useStore.getState().addAtom('C');
  const c2 = useStore.getState().addAtom('C');
  useStore.getState().addBond(c1, c2);
  const bond = useStore.getState().bonds[0];
  return { c1, c2, bondId: bond.id };
}

test('setSelectedBond stores selected bond id', () => {
  const { bondId } = setupSingleBond();

  useStore.getState().setSelectedBond(bondId);
  assert.equal(useStore.getState().selectedBond, bondId);

  useStore.getState().clear();
});

test('removeBond clears selectedBond when the selected bond is deleted', () => {
  const { bondId } = setupSingleBond();

  useStore.getState().setSelectedBond(bondId);
  useStore.getState().removeBond(bondId);

  assert.equal(useStore.getState().selectedBond, null);

  useStore.getState().clear();
});

test('removeAtom clears selectedBond when connected bond is removed', () => {
  const { c1, bondId } = setupSingleBond();

  useStore.getState().setSelectedBond(bondId);
  useStore.getState().removeAtom(c1);

  assert.equal(useStore.getState().bonds.length, 0);
  assert.equal(useStore.getState().selectedBond, null);

  useStore.getState().clear();
});

test('addBond upgrade clears selectedBond after updating bond order', () => {
  const { c1, c2, bondId } = setupSingleBond();

  useStore.getState().setSelectedBond(bondId);
  useStore.getState().addBond(c1, c2);

  assert.equal(useStore.getState().bonds[0].order, 2);
  assert.equal(useStore.getState().selectedBond, null);

  useStore.getState().clear();
});
