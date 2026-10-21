import { expect, test, type Page } from '@playwright/test';

async function atomCenter(page: Page, atomId: string) {
  return page.evaluate(async (id) => {
    const path = '/src/physicsState.ts';
    const { getPhysicsSceneState } = await import(/* @vite-ignore */ path);
    const mesh = getPhysicsSceneState().atomMeshRefs[id];
    const canvas = document.querySelector('canvas');
    if (!mesh?.__r3f || !canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const point = mesh.position.clone().project(mesh.__r3f.root.getState().camera);
    return {
      x: rect.left + (point.x + 1) * rect.width / 2,
      y: rect.top + (1 - point.y) * rect.height / 2,
    };
  }, atomId);
}

for (const suppressSyntheticClick of [false, true]) {
  test(`touch O-H-O-H creates water ${suppressSyntheticClick ? 'without synthetic click' : 'normally'}`, async ({ browser }) => {
    test.setTimeout(60_000);
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
      reducedMotion: 'reduce',
    });
    try {
      await context.addInitScript((suppress) => {
        localStorage.setItem('bondlab-onboarding-version', '2026-03-quickstart-v1');
        if (suppress) {
          // Emulate a mobile browser that does not synthesize a canvas click.
          document.addEventListener('click', (event) => {
            if (event.target instanceof HTMLCanvasElement) {
              event.stopImmediatePropagation();
            }
          }, true);
        }
      }, suppressSyntheticClick);
      const page = await context.newPage();
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto('/');
      for (const element of ['O', 'H', 'H']) {
        await page.getByTestId('mobile-dock-add-button').click();
        await page.getByTestId(`mobile-element-button-${element}`).click();
      }

      const ids = await page.evaluate(async () => {
        const state = window.__bondlabStore!.getState();
        const path = '/src/physics.ts';
        const { setAtomPosition } = await import(/* @vite-ignore */ path);
        const initialPositions = [[0, 0, 0], [-1.25, -1.45, 0], [1.25, -1.45, 0]];
        state.atoms.forEach((atom, index) => {
          const [x, y, z] = initialPositions[index];
          setAtomPosition(atom.id, { x, y, z });
        });
        return state.atoms.map((atom) => atom.id);
      });
      expect(ids).toHaveLength(3);
      await expect.poll(async () => atomCenter(page, ids[2])).not.toBe(null);
      const moleculePanel = page.locator('[data-testid="mobile-molecule-pill"], [data-testid="mobile-molecule-sheet"]');
      // Three loose atoms have the right elemental inventory for water, but
      // are not yet a molecule and must not be labelled H₂O.
      await expect(moleculePanel).toHaveCount(0);

      const tap = async (id: string) => {
        const point = await atomCenter(page, id);
        if (!point) throw new Error('Atom mesh not ready for touch');
        await page.touchscreen.tap(point.x, point.y);
      };
      const selection = () => page.evaluate(() => window.__bondlabStore!.getState().selectedAtom);
      const orders = () => page.evaluate(() => window.__bondlabStore!.getState().bonds.map((bond) => bond.order));

      await tap(ids[0]);
      await expect.poll(selection).toBe(ids[0]);
      await tap(ids[1]);
      await expect.poll(orders).toEqual([1]);
      await expect.poll(selection).toBe(null);
      await expect(moleculePanel).toHaveCount(0);

      await tap(ids[0]);
      await expect.poll(selection).toBe(ids[0]);
      await tap(ids[2]);
      await expect.poll(orders).toEqual([1, 1]);
      await expect.poll(selection).toBe(null);

      const molecule = await page.evaluate(async () => {
        const path = '/src/identifier.ts';
        const { identifyMolecule } = await import(/* @vite-ignore */ path);
        const state = window.__bondlabStore!.getState();
        return identifyMolecule(state.atoms, state.bonds);
      });
      expect(molecule).toEqual({ name: 'Water', formula: 'H₂O' });
      await expect(moleculePanel).toHaveCount(1);
      await expect(moleculePanel).toContainText('Water');

      // Removing either O-H bond must hide the molecule identity again.
      await page.evaluate(() => {
        const state = window.__bondlabStore!.getState();
        state.removeBond(state.bonds[0].id);
      });
      await expect(moleculePanel).toHaveCount(0);
      expect(errors).toEqual([]);
    } finally {
      await context.close();
    }
  });
}

for (const secondTouchOnAtom of [false, true]) {
  test(`pinch in Delete mode does not remove a stationary atom (second touch ${secondTouchOnAtom ? 'on atom' : 'on background'})`, async ({ browser }) => {
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
      await page.getByTestId('mobile-dock-add-button').click();
      await page.getByTestId('mobile-element-button-O').click();

      const id = await page.evaluate(() => window.__bondlabStore!.getState().atoms[0]?.id);
      if (!id) throw new Error('No atom was added');
      await page.evaluate(async (atomId) => {
        const path = '/src/physics.ts';
        const { setAtomPosition } = await import(/* @vite-ignore */ path);
        setAtomPosition(atomId, { x: 0, y: 0, z: 0 });
      }, id);
      await expect.poll(() => atomCenter(page, id)).not.toBe(null);
      await page.getByTestId('interaction-mode-toggle-mobile').click();
      await expect.poll(() => page.evaluate(() => window.__bondlabStore!.getState().interactionMode)).toBe('delete');

      const point = await atomCenter(page, id);
      if (!point) throw new Error('Atom mesh was not ready');
      const first = { x: point.x, y: point.y, id: 1 };
      const second = secondTouchOnAtom
        ? { x: point.x + 12, y: point.y + 10, id: 2 }
        : { x: Math.max(35, point.x - 140), y: point.y + 80, id: 2 };
      const cdp = await context.newCDPSession(page);
      const atomCount = () => page.evaluate(() => window.__bondlabStore!.getState().atoms.length);

      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [first] });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [first, second] });
      // Finger 1 stays stationary over the atom; finger 2 moves to pinch.
      await cdp.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [first, { ...second, x: second.x + 55, y: second.y + 20 }],
      });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await expect.poll(atomCount).toBe(1);

      // A fresh, genuine single-finger tap must still remove the atom.
      const afterPinch = await atomCenter(page, id);
      if (!afterPinch) throw new Error('Atom missing after pinch');
      await page.touchscreen.tap(afterPinch.x, afterPinch.y);
      await expect.poll(atomCount).toBe(0);
      expect(errors).toEqual([]);
    } finally {
      await context.close();
    }
  });
}
