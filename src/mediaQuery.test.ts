import assert from 'node:assert/strict';
import test from 'node:test';
import { subscribeToMediaQuery } from './mediaQuery.ts';

test('subscribeToMediaQuery uses addEventListener when available', () => {
  const calls: string[] = [];
  let registeredListener: EventListenerOrEventListenerObject | null = null;
  const mediaQueryList = {
    addEventListener: (eventName: string, callback: EventListenerOrEventListenerObject) => {
      if (eventName === 'change') {
        calls.push('add');
        registeredListener = callback;
      }
    },
    removeEventListener: (eventName: string, callback: EventListenerOrEventListenerObject) => {
      if (eventName === 'change' && callback === registeredListener) {
        calls.push('remove');
      }
    },
  } as unknown as MediaQueryList;

  const unsubscribe = subscribeToMediaQuery(mediaQueryList, () => undefined);
  unsubscribe();

  assert.deepEqual(calls, ['add', 'remove']);
});

test('subscribeToMediaQuery falls back to addListener for older engines', () => {
  const calls: string[] = [];
  let registeredListener: ((this: MediaQueryList, ev: MediaQueryListEvent) => any) | null = null;
  const mediaQueryList = {
    addListener: (callback: (event: MediaQueryListEvent) => void) => {
      calls.push('add');
      registeredListener = callback;
    },
    removeListener: (callback: (event: MediaQueryListEvent) => void) => {
      if (callback === registeredListener) {
        calls.push('remove');
      }
    },
  } as unknown as MediaQueryList;

  const unsubscribe = subscribeToMediaQuery(mediaQueryList, () => undefined);
  unsubscribe();

  assert.deepEqual(calls, ['add', 'remove']);
});

test('subscribeToMediaQuery returns a safe no-op unsubscriber when no listener API exists', () => {
  const mediaQueryList = {} as MediaQueryList;

  const unsubscribe = subscribeToMediaQuery(mediaQueryList, () => undefined);

  assert.doesNotThrow(() => unsubscribe());
});
