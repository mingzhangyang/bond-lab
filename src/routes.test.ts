import assert from 'node:assert/strict';
import test from 'node:test';
import { getPathForRoute, getRouteFromPath, navigateToRoute } from './routes.ts';

test('getRouteFromPath resolves known page paths', () => {
  assert.equal(getRouteFromPath('/'), 'lab');
  assert.equal(getRouteFromPath('/privacy'), 'privacy');
  assert.equal(getRouteFromPath('/instructions'), 'instructions');
});

test('getRouteFromPath falls back to lab for unknown paths', () => {
  assert.equal(getRouteFromPath('/unknown'), 'lab');
  assert.equal(getRouteFromPath('/privacy/extra'), 'lab');
});

test('getPathForRoute returns canonical paths', () => {
  assert.equal(getPathForRoute('lab'), '/');
  assert.equal(getPathForRoute('privacy'), '/privacy');
  assert.equal(getPathForRoute('instructions'), '/instructions');
});

test('navigateToRoute is a no-op without window', () => {
  assert.doesNotThrow(() => {
    navigateToRoute('privacy');
  });
});

test('navigateToRoute pushes path and dispatches popstate', () => {
  const globals = globalThis as any;
  const originalWindow = globals.window;
  const dispatched: Event[] = [];

  const fakeWindow = {
    location: { pathname: '/' },
    history: {
      pushState: (_state: unknown, _title: string, path?: string | URL | null) => {
        fakeWindow.location.pathname = String(path ?? '/');
      },
    },
    dispatchEvent: (event: Event) => {
      dispatched.push(event);
      return true;
    },
    scrollTo: () => undefined,
  };

  globals.window = fakeWindow;
  try {
    navigateToRoute('instructions');
    assert.equal(fakeWindow.location.pathname, '/instructions');
    assert.equal(dispatched.length, 1);
    assert.equal(dispatched[0].type, 'popstate');
  } finally {
    if (originalWindow === undefined) {
      delete globals.window;
    } else {
      globals.window = originalWindow;
    }
  }
});
