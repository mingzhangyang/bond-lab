import { expect, test } from '@playwright/test';

test('a second Shift+touch rotation cancels the first bond pointer session', async ({ browser }) => {
  test.setTimeout(45_000);
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    hasTouch: true,
    reducedMotion: 'reduce',
  });
  try {
    const page = await context.newPage();
    await page.addInitScript(() => {
      localStorage.setItem('bondlab-onboarding-version', '2026-03-quickstart-v1');
    });
    await page.goto('/');

    const ids = await page.evaluate(async () => {
      const store = window.__bondlabStore!;
      const state = store.getState();
      // Freeze forces so that positional assertions detect only pointer-driven rotation.
      state.setRotatingBond('__test_setup__');
      const atoms = Array.from({ length: 6 }, () => state.addAtom('C'));
      const path = '/src/physics.ts';
      const { setAtomPosition } = await import(/* @vite-ignore */ path);
      const positions = [
        [-4.0, 0, 0], [-1.8, 0, 0], [-1.2, 1.4, 0.9],
        [1.8, 0, 0], [4.0, 0, 0], [4.5, 1.4, 0.9],
      ];
      atoms.forEach((atom, index) => {
        const [x, y, z] = positions[index];
        setAtomPosition(atom, { x, y, z });
      });
      for (const [source, target] of [[0, 1], [1, 2], [3, 4], [4, 5]]) {
        store.getState().addBond(atoms[source], atoms[target]);
      }
      const bonds = store.getState().bonds;
      if (bonds.length !== 4) throw new Error('Expected two separate rotatable chains');
      return {
        firstBond: bonds[0].id,
        secondBond: bonds[2].id,
        firstOffAxisAtom: atoms[2],
        secondOffAxisAtom: atoms[5],
      };
    });

    const bondCenters = () => page.evaluate(async ({ firstBond, secondBond }) => {
      const path = '/src/physicsState.ts';
      const { getPhysicsSceneState } = await import(/* @vite-ignore */ path);
      const refs = getPhysicsSceneState().bondGroupRefs;
      const canvas = document.querySelector('canvas');
      const first = refs[firstBond];
      const second = refs[secondBond];
      if (!canvas || !first?.__r3f || !second?.__r3f) return [];
      const camera = first.__r3f.root.getState().camera;
      const rect = canvas.getBoundingClientRect();
      return [first, second].map((group) => {
        const point = group.position.clone().project(camera);
        return {
          x: rect.left + (point.x + 1) * rect.width / 2,
          y: rect.top + (1 - point.y) * rect.height / 2,
        };
      });
    }, ids);
    await expect.poll(async () => (await bondCenters()).length).toBe(2);
    await page.waitForTimeout(150);
    const [first, second] = await bondCenters();
    const cdp = await context.newCDPSession(page);
    const shift = 8; // Chrome DevTools Input modifier bitmask for Shift.
    const touchA = { x: first.x, y: first.y, id: 1 };
    const touchB = { x: second.x, y: second.y, id: 2 };
    const rotationOwner = () => page.evaluate(() => window.__bondlabStore!.getState().rotatingBond);
    const position = (atomId: string) => page.evaluate(async (id) => {
      const path = '/src/physicsState.ts';
      const { getPhysicsSceneState } = await import(/* @vite-ignore */ path);
      return getPhysicsSceneState().atomPositions[id].toArray();
    }, atomId);

    await page.keyboard.down('Shift');
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchStart', touchPoints: [touchA], modifiers: shift,
    });
    await expect.poll(rotationOwner).toBe(ids.firstBond);

    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchStart', touchPoints: [touchA, touchB], modifiers: shift,
    });
    await expect.poll(rotationOwner).toBe(ids.secondBond);
    await page.waitForTimeout(100); // React's PhysicsEngine observes the new owner.

    const firstBefore = await position(ids.firstOffAxisAtom);
    const movedA = { ...touchA, x: touchA.x + 100 };
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove', touchPoints: [movedA, touchB], modifiers: shift,
    });
    // Physics is paused by the second rotation. An old listener would rotate A.
    expect(await position(ids.firstOffAxisAtom)).toEqual(firstBefore);
    expect(await rotationOwner()).toBe(ids.secondBond);

    const secondBefore = await position(ids.secondOffAxisAtom);
    const movedB = { ...touchB, x: touchB.x + 80 };
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove', touchPoints: [movedA, movedB], modifiers: shift,
    });
    const secondAfter = await position(ids.secondOffAxisAtom);
    expect(Math.hypot(...secondAfter.map((value, i) => value - secondBefore[i]))).toBeGreaterThan(0.05);

    // Releasing B must clear the owner, without resurrecting the stale A session.
    await cdp.send('Input.dispatchTouchEvent', {
      // DevTools touchEnd lists the touch being lifted, not the remaining touches.
      type: 'touchEnd', touchPoints: [movedB], modifiers: shift,
    });
    await expect.poll(rotationOwner).toBe(null);
    // Pause the unrelated force simulation again for an exact stale-pointer check.
    await page.evaluate(() => window.__bondlabStore!.getState().setRotatingBond('__test_assert__'));
    await page.waitForTimeout(100);
    const afterRelease = await position(ids.firstOffAxisAtom);
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove', touchPoints: [{ ...movedA, x: movedA.x + 100 }], modifiers: shift,
    });
    expect(await position(ids.firstOffAxisAtom)).toEqual(afterRelease);

    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchEnd', touchPoints: [], modifiers: shift,
    });
    await page.keyboard.up('Shift');
    await page.evaluate(() => window.__bondlabStore!.getState().setRotatingBond(null));
    await expect.poll(rotationOwner).toBe(null);
  } finally {
    await context.close();
  }
});
