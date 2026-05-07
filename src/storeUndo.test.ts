import assert from 'node:assert/strict';
import test from 'node:test';
import { useStore } from './store.ts';

test('removeBond stores last removed bond and restoreLastRemovedBond restores it', () => {
  useStore.getState().clear();

  const c1 = useStore.getState().addAtom('C');
  const c2 = useStore.getState().addAtom('C');
  useStore.getState().addBond(c1, c2);

  const originalBond = useStore.getState().bonds[0];
  useStore.getState().removeBond(originalBond.id);

  assert.equal(useStore.getState().bonds.length, 0);
  assert.equal(useStore.getState().lastRemovedBond?.id, originalBond.id);

  useStore.getState().restoreLastRemovedBond();

  const restoredBond = useStore.getState().bonds[0];
  assert.equal(useStore.getState().bonds.length, 1);
  assert.equal(useStore.getState().lastRemovedBond, null);
  assert.equal(restoredBond.id, originalBond.id);
  assert.equal(restoredBond.source, originalBond.source);
  assert.equal(restoredBond.target, originalBond.target);
  assert.equal(restoredBond.order, originalBond.order);

  useStore.getState().clear();
});

test('restoreLastRemovedBond is a no-op when atoms are missing', () => {
  useStore.getState().clear();

  const c1 = useStore.getState().addAtom('C');
  const c2 = useStore.getState().addAtom('C');
  useStore.getState().addBond(c1, c2);

  const originalBond = useStore.getState().bonds[0];
  useStore.getState().removeBond(originalBond.id);
  useStore.getState().removeAtom(c1);

  useStore.getState().restoreLastRemovedBond();

  assert.equal(useStore.getState().bonds.length, 0);
  assert.equal(useStore.getState().lastRemovedBond, null);

  useStore.getState().clear();
});
