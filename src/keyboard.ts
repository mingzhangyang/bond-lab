import { useSyncExternalStore } from 'react';

let shiftPressed = false;
let initialized = false;
const listeners = new Set<() => void>();

function notifyListeners(): void {
  for (const listener of listeners) {
    listener();
  }
}

function setShiftPressed(nextValue: boolean): void {
  if (shiftPressed === nextValue) return;
  shiftPressed = nextValue;
  notifyListeners();
}

function ensureInitialized(): void {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Shift') setShiftPressed(true);
  });
  window.addEventListener('keyup', (event) => {
    if (event.key === 'Shift') setShiftPressed(false);
  });
  window.addEventListener('blur', () => {
    setShiftPressed(false);
  });
}

function subscribeShiftKey(listener: () => void): () => void {
  ensureInitialized();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getShiftPressedSnapshot(): boolean {
  return shiftPressed;
}

export function useShiftPressed(): boolean {
  return useSyncExternalStore(subscribeShiftKey, getShiftPressedSnapshot, () => false);
}
