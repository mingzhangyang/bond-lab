import assert from 'node:assert/strict';
import test from 'node:test';
import { startPointerSession } from './pointerSession.ts';

function pointer(type: string, pointerId = 1) {
  return Object.assign(new Event(type), { pointerId });
}

test('quick release is handled synchronously and unrelated pointers are ignored', () => {
  const target = new EventTarget();
  const finishes: boolean[] = [];
  let moves = 0;
  const cancel = startPointerSession(target, { pointerId: 1, onMove: () => moves++, onFinish: (done) => finishes.push(done) });
  target.dispatchEvent(pointer('pointermove', 2));
  target.dispatchEvent(pointer('pointerup', 2));
  assert.deepEqual(finishes, []);
  assert.equal(moves, 0);
  target.dispatchEvent(pointer('pointermove'));
  target.dispatchEvent(pointer('pointerup'));
  target.dispatchEvent(pointer('pointermove'));
  cancel();
  assert.equal(moves, 1);
  assert.deepEqual(finishes, [true]);
});

test('unmount, pointer cancellation and blur finish once and remove listeners', () => {
  for (const reason of ['unmount', 'pointercancel', 'blur']) {
    const target = new EventTarget();
    const finishes: boolean[] = [];
    const cancel = startPointerSession(target, { pointerId: 1, onMove: () => assert.fail('listener leaked'), onFinish: (done) => finishes.push(done) });
    if (reason === 'unmount') cancel();
    else target.dispatchEvent(pointer(reason));
    target.dispatchEvent(pointer('pointermove'));
    target.dispatchEvent(pointer('pointerup'));
    cancel();
    assert.deepEqual(finishes, [false]);
  }
});

test('replacing an active pointer owner cancels stale listeners synchronously', () => {
  const target = new EventTarget();
  let owner = 'first';
  let ownerChanged = () => {};
  let unsubscribed = 0;
  let firstMoves = 0;
  let secondMoves = 0;
  const firstFinishes: boolean[] = [];
  const secondFinishes: boolean[] = [];

  const cancelFirst = startPointerSession(target, {
    pointerId: 1,
    onMove: () => firstMoves++,
    onFinish: (done) => firstFinishes.push(done),
    subscribeToCancel: (cancel) => {
      ownerChanged = () => { if (owner !== 'first') cancel(); };
      return () => { ownerChanged = () => {}; unsubscribed++; };
    },
  });

  owner = 'second';
  ownerChanged();
  startPointerSession(target, {
    pointerId: 2,
    onMove: () => secondMoves++,
    onFinish: (done) => secondFinishes.push(done),
  });

  target.dispatchEvent(pointer('pointermove', 1));
  target.dispatchEvent(pointer('pointermove', 2));
  target.dispatchEvent(pointer('pointerup', 1));
  target.dispatchEvent(pointer('pointerup', 2));
  cancelFirst();

  assert.deepEqual(firstFinishes, [false]);
  assert.equal(firstMoves, 0);
  assert.deepEqual(secondFinishes, [true]);
  assert.equal(secondMoves, 1);
  assert.equal(unsubscribed, 1);
});

test('ownership subscriptions clean up when cancellation happens during registration', () => {
  const target = new EventTarget();
  const finishes: boolean[] = [];
  let unsubscribed = 0;
  startPointerSession(target, {
    pointerId: 1,
    onMove: () => assert.fail('listener leaked'),
    onFinish: (done) => finishes.push(done),
    subscribeToCancel: (cancel) => {
      cancel();
      return () => { unsubscribed++; };
    },
  });

  target.dispatchEvent(pointer('pointermove'));
  target.dispatchEvent(pointer('pointerup'));
  assert.deepEqual(finishes, [false]);
  assert.equal(unsubscribed, 1);
});
