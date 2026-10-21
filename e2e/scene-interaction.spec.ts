import { expect, test } from '@playwright/test';

test('a quick atom click does not leave a pointer drag active', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('bondlab-onboarding-version', '2026-03-quickstart-v1'));
  await page.goto('/');
  await page.getByTestId('element-button-C').click();
  await page.evaluate(async () => {
    const path = '/src/physics.ts';
    const physics = await import(/* @vite-ignore */ path);
    physics.setAtomPosition(window.__bondlabStore!.getState().atoms[0].id, { x: 0, y: 0, z: 0 });
  });
  await page.waitForTimeout(500);
  const box = await page.locator('canvas').boundingBox();
  if (!box) throw new Error('Missing canvas');
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await expect.poll(() => page.evaluate(() => window.__bondlabStore!.getState().draggedAtom)).toBe(null);
  await expect.poll(() => page.evaluate(() => window.__bondlabStore!.getState().selectedAtom)).not.toBe(null);
});

for (const mobile of [false, true]) {
  for (const theme of ['light', 'dark'] as const) {
    test(`3D actions and camera work: ${mobile ? 'touch simulation' : 'desktop'} ${theme}`, async ({ browser }, testInfo) => {
      test.setTimeout(60_000);
      const context = await browser.newContext({
        viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
        isMobile: mobile,
        hasTouch: mobile,
        reducedMotion: 'reduce',
      });
      await context.addInitScript((color) => {
        localStorage.setItem('bondlab-onboarding-version', '2026-03-quickstart-v1');
        localStorage.setItem('bondlab-theme', color);
      }, theme);
      const page = await context.newPage();
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto('http://127.0.0.1:4173/');
      for (const element of ['C', 'O']) {
        if (mobile) await page.getByTestId('mobile-dock-add-button').click();
        await page.getByTestId(`${mobile ? 'mobile-' : ''}element-button-${element}`).click();
      }
      await page.evaluate(async () => {
        const path = '/src/physics.ts';
        const physics = await import(/* @vite-ignore */ path);
        window.__bondlabStore!.getState().atoms.forEach((atom, index) => {
          physics.setAtomPosition(atom.id, { x: index ? 1.2 : -1.2, y: 0, z: 0 });
        });
      });
      // Inspect the real scene graph, using dev-server modules only. Input still
      // goes through the browser's raycasting and pointer event pipeline.
      const scene = () => page.evaluate(async () => {
        const path = '/src/physicsState.ts';
        const { getPhysicsSceneState } = await import(/* @vite-ignore */ path);
        const physics = getPhysicsSceneState();
        const state = window.__bondlabStore!.getState();
        return state.atoms.map((atom) => {
          const mesh = physics.atomMeshRefs[atom.id];
          if (!mesh?.__r3f) return null;
          const root = mesh.__r3f.root.getState();
          const pos = mesh.position.clone().project(root.camera);
          return {
            id: atom.id, x: (pos.x + 1) * innerWidth / 2, y: (1 - pos.y) * innerHeight / 2,
            position: mesh.position.toArray(), scale: mesh.scale.x,
            camera: root.camera.position.toArray(), halo: mesh.children.length,
          };
        });
      });
      await expect.poll(async () => (await scene()).filter(Boolean).length).toBe(2);
      await page.waitForTimeout(150);
      expect((await scene()).map((atom) => atom!.scale)).toEqual([1, 1]);
      const tap = async (point: { x: number; y: number }) => {
        if (mobile) await page.touchscreen.tap(point.x, point.y);
        else await page.mouse.click(point.x, point.y);
      };
      await tap((await scene())[0]!);
      await expect.poll(() => page.evaluate(() => window.__bondlabStore!.getState().selectedAtom)).not.toBe(null);
      await expect.poll(async () => (await scene())[0]!.halo).toBeGreaterThan(0);
      await tap((await scene())[1]!);
      await expect.poll(() => page.evaluate(() => window.__bondlabStore!.getState().bonds.length)).toBe(1);
      await page.mouse.move(10, 200);
      await page.waitForTimeout(250);
      await page.screenshot({ path: testInfo.outputPath('bond.png') });
      const bondCenter = () => page.evaluate(async () => {
        const path = '/src/physicsState.ts';
        const { getPhysicsSceneState } = await import(/* @vite-ignore */ path);
        const physics = getPhysicsSceneState();
        const state = window.__bondlabStore!.getState();
        const group = physics.bondGroupRefs[state.bonds[0].id];
        const camera = physics.atomMeshRefs[state.atoms[0].id].__r3f.root.getState().camera;
        const point = group.position.clone().project(camera);
        return { x: (point.x + 1) * innerWidth / 2, y: (1 - point.y) * innerHeight / 2 };
      });
      await tap(await bondCenter());
      await page.getByTestId('selected-bond-upgrade').click();
      await expect.poll(() => page.evaluate(() => window.__bondlabStore!.getState().bonds[0]?.order)).toBe(2);
      // The two parallel cylinders straddle the center after an upgrade.
      const center = await bondCenter();
      await tap({ x: center.x, y: center.y + 15 });
      await page.getByTestId('selected-bond-delete').click();
      await expect.poll(() => page.evaluate(() => window.__bondlabStore!.getState().bonds.length)).toBe(0);


      const before = (await scene())[0]!;
      const cdp = await context.newCDPSession(page);
      if (mobile) {
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: before.x, y: before.y, id: 1 }] });
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: before.x + 50, y: before.y + 70, id: 1 }] });
      } else {
        await page.mouse.move(before.x, before.y);
        await page.mouse.down();
        await page.mouse.move(before.x + 50, before.y + 70, { steps: 5 });
      }
      await expect.poll(async () => Math.abs((await scene())[0]!.position[1] - before.position[1])).toBeGreaterThan(0.2);
      if (mobile) await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      else await page.mouse.up();
      await expect.poll(() => page.evaluate(() => window.__bondlabStore!.getState().draggedAtom)).toBe(null);

      const cameraBefore = (await scene())[0]!.camera;
      const x = mobile ? 195 : 720;
      if (mobile) {
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y: 220, id: 1 }] });
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + 50, y: 250, id: 1 }] });
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      } else {
        await page.mouse.move(x, 220);
        await page.mouse.down();
        await page.mouse.move(x + 50, 250, { steps: 5 });
        await page.mouse.up();
      }
      await expect.poll(async () => (await scene())[0]!.camera).not.toEqual(cameraBefore);
      const cameraDistance = () => scene().then((atoms) => Math.hypot(...atoms[0]!.camera));
      const distanceBefore = await cameraDistance();
      if (mobile) {
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 155, y: 220, id: 1 }, { x: 235, y: 220, id: 2 }] });
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 125, y: 220, id: 1 }, { x: 265, y: 220, id: 2 }] });
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      } else await page.mouse.wheel(0, 100);
      await expect.poll(cameraDistance).not.toBeCloseTo(distanceBefore, 1);
      await page.getByTestId(`interaction-mode-toggle-${mobile ? 'mobile' : 'desktop'}`).click();
      const atom = (await scene())[1]!;
      await tap(atom);
      await expect.poll(() => page.evaluate(() => window.__bondlabStore!.getState().atoms.length)).toBe(1);
      expect(errors).toEqual([]);
      await context.close();
    });
  }
}
