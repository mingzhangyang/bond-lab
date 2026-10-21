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
      expect(errors).toEqual([]);
    } finally {
      await context.close();
    }
  });
}
