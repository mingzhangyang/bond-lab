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
