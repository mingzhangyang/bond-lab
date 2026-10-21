import { expect, test, type Page } from '@playwright/test';

async function atomPoint(page: Page, id: string) {
  return page.evaluate(async (atomId) => {
    const path = '/src/physicsState.ts';
    const { getPhysicsSceneState } = await import(/* @vite-ignore */ path);
    const mesh = getPhysicsSceneState().atomMeshRefs[atomId];
    const canvas = document.querySelector('canvas');
    if (!mesh?.__r3f || !canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const point = mesh.position.clone().project(mesh.__r3f.root.getState().camera);
    return {
      x: rect.left + (point.x + 1) * rect.width / 2,
      y: rect.top + (1 - point.y) * rect.height / 2,
    };
  }, id);
}

for (const atomFirst of [true, false]) {
  test(`a Build pinch cannot commit a bond when the ${atomFirst ? 'atom finger starts first' : 'background finger starts first'}`, async ({ browser }) => {
    test.setTimeout(60_000);
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
      reducedMotion: 'reduce',
    });
    try {
      await context.addInitScript(() => {
        localStorage.setItem('bondlab-onboarding-version', '2026-03-quickstart-v1');
      });
      const page = await context.newPage();
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto('/');
      for (const element of ['O', 'H']) {
        await page.getByTestId('mobile-dock-add-button').click();
        await page.getByTestId(`mobile-element-button-${element}`).click();
      }
      const ids = await page.evaluate(async () => {
        const path = '/src/physics.ts';
        const { setAtomPosition } = await import(/* @vite-ignore */ path);
        const state = window.__bondlabStore!.getState();
        state.atoms.forEach((atom, i) => {
          setAtomPosition(atom.id, { x: i === 0 ? -1.4 : 1.4, y: 0, z: 0 });
        });
        return state.atoms.map((atom) => atom.id);
      });
      expect(ids).toHaveLength(2);
      await expect.poll(() => atomPoint(page, ids[1])).not.toBe(null);
      const source = await atomPoint(page, ids[0]);
      const target = await atomPoint(page, ids[1]);
      if (!source || !target) throw new Error('Atom positions not ready');

      await page.touchscreen.tap(source.x, source.y);
      await expect.poll(() => page.evaluate(() => window.__bondlabStore!.getState().selectedAtom)).toBe(ids[0]);
      const atomTouch = { x: target.x, y: target.y, id: atomFirst ? 1 : 2 };
      const bgTouch = { x: 35, y: 450, id: atomFirst ? 2 : 1 };
      const first = atomFirst ? atomTouch : bgTouch;
      const second = atomFirst ? bgTouch : atomTouch;
      const cdp = await context.newCDPSession(page);
      const orders = () => page.evaluate(() => window.__bondlabStore!.getState().bonds.map((bond) => bond.order));
      const owner = () => page.evaluate(() => window.__bondlabStore!.getState().draggedAtom);

      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [first] });
      if (atomFirst) await expect.poll(owner).toBe(ids[1]);
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [first, second] });
      await expect.poll(owner).toBe(ids[1]);

      // An R3F pointermissed on background can clear the selection. Re-arm
      // the source to ensure the assertion proves *tap ineligibility*, not
      // just an incidental selection reset.
      await page.evaluate((id) => window.__bondlabStore!.getState().setSelectedAtom(id), ids[0]);
      await cdp.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [atomTouch, { ...bgTouch, x: bgTouch.x + 42, y: bgTouch.y + 28 }],
      });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await expect.poll(owner).toBe(null);
      expect(await orders()).toEqual([]);

      // A new single-finger gesture must still create exactly one single bond.
      await page.evaluate(() => window.__bondlabStore!.getState().setSelectedAtom(null));
      const newSource = await atomPoint(page, ids[0]);
      const newTarget = await atomPoint(page, ids[1]);
      if (!newSource || !newTarget) throw new Error('Atom positions lost after pinch');
      await page.touchscreen.tap(newSource.x, newSource.y);
      await expect.poll(() => page.evaluate(() => window.__bondlabStore!.getState().selectedAtom)).toBe(ids[0]);
      await page.touchscreen.tap(newTarget.x, newTarget.y);
      await expect.poll(orders).toEqual([1]);
      expect(errors).toEqual([]);
    } finally {
      await context.close();
    }
  });
}
