import { expect, test, type Page } from '@playwright/test';

// Use the same real scene and pointer pipeline as the existing acceptance suite.
// The test-only Vite modules are not available in production bundles.
async function centers(page: Page) {
  return page.evaluate(async () => {
    const path = '/src/physicsState.ts';
    const { getPhysicsSceneState } = await import(/* @vite-ignore */ path);
    const physics = getPhysicsSceneState();
    const atoms = window.__bondlabStore!.getState().atoms;
    const canvas = document.querySelector('canvas');
    if (!canvas) return [];
    const rect = canvas.getBoundingClientRect();
    return atoms.flatMap((atom) => {
      const mesh = physics.atomMeshRefs[atom.id];
      if (!mesh?.__r3f) return [];
      const point = mesh.position.clone().project(mesh.__r3f.root.getState().camera);
      return [{
        id: atom.id,
        x: rect.left + (point.x + 1) * rect.width / 2,
        y: rect.top + (1 - point.y) * rect.height / 2,
      }];
    });
  });
}

async function setupPair(page: Page, spacing: number) {
  await page.addInitScript(() => {
    localStorage.setItem('bondlab-onboarding-version', '2026-03-quickstart-v1');
  });
  await page.goto('/');
  const mobile = (page.viewportSize()?.width ?? 1440) < 768;
  for (let i = 0; i < 2; i++) {
    if (mobile) await page.getByTestId('mobile-dock-add-button').click();
    await page.getByTestId(`${mobile ? 'mobile-' : ''}element-button-C`).click();
  }
  await expect.poll(async () => (await centers(page)).length).toBe(2);
  await page.evaluate(async (distance) => {
    const path = '/src/physics.ts';
    const { setAtomPosition } = await import(/* @vite-ignore */ path);
    window.__bondlabStore!.getState().atoms.forEach((atom, i) => {
      setAtomPosition(atom.id, { x: (i === 0 ? -1 : 1) * distance / 2, y: 0, z: 0 });
    });
  }, spacing);
  await page.waitForTimeout(100);
  return centers(page);
}

async function bondOrders(page: Page) {
  return page.evaluate(() => window.__bondlabStore!.getState().bonds.map((bond) => bond.order));
}

test('a selected pair within bonding distance produces one single bond per click', async ({ page }) => {
  const pair = await setupPair(page, 1.25);
  await page.mouse.click(pair[0].x, pair[0].y);
  await expect.poll(() => page.evaluate(() => window.__bondlabStore!.getState().selectedAtom)).toBe(pair[0].id);
  const updated = await centers(page);
  await page.mouse.click(updated[1].x, updated[1].y);
  await expect.poll(() => bondOrders(page)).toEqual([1]);
  await page.waitForTimeout(100);
  expect(await bondOrders(page)).toEqual([1]);
});

test('a real proximity drag bonds once and does not consume the next deliberate click', async ({ page }) => {
  const pair = await setupPair(page, 1.25);
  await page.mouse.click(pair[0].x, pair[0].y);
  const updated = await centers(page);
  await page.mouse.move(updated[1].x, updated[1].y);
  await page.mouse.down();
  await page.mouse.move(updated[1].x + 9, updated[1].y, { steps: 3 });
  await page.mouse.up();

  await expect.poll(() => bondOrders(page)).toEqual([1]);
  await expect.poll(() => page.evaluate(() => window.__bondlabStore!.getState().draggedAtom)).toBe(null);
  await expect.poll(() => page.evaluate(() => window.__bondlabStore!.getState().selectedAtom)).toBe(null);

  // A new pointerdown must reset click suppression; an intentional second
  // source/target click should be allowed to upgrade the bond to order 2.
  const afterDrag = await centers(page);
  await page.mouse.click(afterDrag[0].x, afterDrag[0].y);
  await expect.poll(() => page.evaluate(() => window.__bondlabStore!.getState().selectedAtom)).toBe(afterDrag[0].id);
  const afterSelection = await centers(page);
  await page.mouse.click(afterSelection[1].x, afterSelection[1].y);
  await expect.poll(() => bondOrders(page)).toEqual([2]);
});

test('second touch cancels the old atom drag before either finger moves again', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: 'reduce',
  });
  try {
    const page = await context.newPage();
    const pair = await setupPair(page, 4.4);
    const cdp = await context.newCDPSession(page);
    const first = { x: pair[0].x, y: pair[0].y, id: 1 };
    const second = { x: pair[1].x, y: pair[1].y, id: 2 };
    const draggedId = () => page.evaluate(() => window.__bondlabStore!.getState().draggedAtom);
    const atomPosition = (id: string) => page.evaluate(async (atomId) => {
      const path = '/src/physicsState.ts';
      const { getPhysicsSceneState } = await import(/* @vite-ignore */ path);
      return getPhysicsSceneState().atomPositions[atomId].toArray();
    }, id);

    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [first] });
    await expect.poll(draggedId).toBe(first.id === 1 ? pair[0].id : pair[1].id);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [first, second] });
    await expect.poll(draggedId).toBe(pair[1].id);

    const before = await atomPosition(pair[0].id);
    const movedFirst = { ...first, x: first.x + 75, y: first.y + 80 };
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [movedFirst, second] });
    await page.waitForTimeout(80);
    const after = await atomPosition(pair[0].id);
    expect(Math.hypot(after[0] - before[0], after[1] - before[1], after[2] - before[2])).toBeLessThan(0.3);
    expect(await draggedId()).toBe(pair[1].id);

    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [movedFirst] });
    await expect.poll(draggedId).toBe(null);
    const afterRelease = await atomPosition(pair[0].id);
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ ...movedFirst, x: movedFirst.x + 40, y: movedFirst.y + 35 }],
    });
    await page.waitForTimeout(80);
    const afterStaleMove = await atomPosition(pair[0].id);
    expect(Math.hypot(...afterStaleMove.map((value: number, i: number) => value - afterRelease[i]))).toBeLessThan(0.3);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  } finally {
    await context.close();
  }
});
