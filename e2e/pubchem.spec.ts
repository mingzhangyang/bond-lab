import { expect, test, type Locator } from '@playwright/test';

async function openLab(page: import('@playwright/test').Page): Promise<void> {
  await page.addInitScript(() => {
    localStorage.setItem('bondlab-onboarding-version', '2026-03-quickstart-v1');
  });
  await page.setViewportSize({ width: 1280, height: 850 });
  await page.goto('/');
  await expect(page.locator('.lab-ui-root')).toBeVisible({ timeout: 15000 });
}

// Measure actual browser colors, including the button's translucent background
// and Tailwind's OKLCH colors. Require an opaque ancestor instead of guessing
// the backdrop. This helper is deliberately scoped to the solid light panel.
async function lightTextContrast(control: Locator): Promise<number> {
  return control.evaluate((element) => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error('Canvas color conversion is unavailable');
    const backgrounds: string[] = [];
    let opaque = false;
    for (let node: Element | null = element; node; node = node.parentElement) {
      const style = getComputedStyle(node);
      if (style.backgroundImage !== 'none' || Number(style.opacity) !== 1) {
        throw new Error('Contrast helper requires solid backgrounds without group opacity');
      }
      backgrounds.push(style.backgroundColor);
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = style.backgroundColor;
      context.fillRect(0, 0, 1, 1);
      if (context.getImageData(0, 0, 1, 1).data[3] === 255) {
        opaque = true;
        break;
      }
    }
    if (!opaque) throw new Error('No opaque background found for contrast calculation');
    context.clearRect(0, 0, 1, 1);
    for (const color of backgrounds.reverse()) {
      context.fillStyle = color;
      context.fillRect(0, 0, 1, 1);
    }
    const background = context.getImageData(0, 0, 1, 1).data;
    context.fillStyle = getComputedStyle(element).color;
    context.fillRect(0, 0, 1, 1);
    const foreground = context.getImageData(0, 0, 1, 1).data;
    const luminance = (rgba: Uint8ClampedArray) => {
      const linear = Array.from(rgba).slice(0, 3).map((channel) => {
        const value = channel / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
    };
    const first = luminance(foreground);
    const second = luminance(background);
    return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
  });
}

test('unknown structures offer an opt-in check without automatic PubChem traffic', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (req) => {
    if (req.url().includes('/api/pubchem/identity')) requests.push(req.url());
  });
  await openLab(page);

  await page.evaluate(() => {
    const state = window.__bondlabStore!.getState();
    const first = state.addAtom('C');
    const second = state.addAtom('C');
    state.addBond(first, second);
  });
  await expect(page.getByTestId('external-identity')).toBeVisible();
  await expect(page.getByRole('button', { name: /PubChem/ })).toBeVisible();
  expect(requests).toHaveLength(0);

  await page.evaluate(() => {
    const state = window.__bondlabStore!.getState();
    state.clear();
    const o = state.addAtom('O');
    const h1 = state.addAtom('H');
    const h2 = state.addAtom('H');
    state.addBond(o, h1);
    state.addBond(o, h2);
  });
  await expect(page.getByTestId('external-identity')).toHaveCount(0);
  expect(requests).toHaveLength(0);
});

test('RDKit sanitization permits a user-initiated exact-identity response without resetting the lab', async ({ page }) => {
  test.setTimeout(90_000);
  const submitted: string[] = [];
  await page.route('**/api/pubchem/identity', async (route) => {
    submitted.push(route.request().postDataJSON().smiles);
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: 'matched',
        cid: 7890,
        iupacName: 'trioxidane',
        molecularFormula: 'H2O3',
      }),
    });
  });
  await openLab(page);

  await page.evaluate(() => {
    const state = window.__bondlabStore!.getState();
    const ids = (['H', 'O', 'O', 'O', 'H'] as const).map((element) => state.addAtom(element));
    for (let i = 0; i < ids.length - 1; i++) state.addBond(ids[i], ids[i + 1]);
  });

  const button = page.getByRole('button', { name: /PubChem/ });
  await expect(button).toBeVisible();
  const announcement = page.getByTestId('external-identity-announcement');
  await expect(announcement).toHaveAttribute('role', 'status');
  await expect(announcement).toHaveAttribute('aria-live', 'polite');
  await expect(announcement).toHaveAttribute('aria-atomic', 'true');
  await expect(announcement).toHaveText('');
  expect(submitted).toHaveLength(0);

  const unexpectedNavigations: string[] = [];
  page.on('framenavigated', (frame) => {
    if (frame === page.mainFrame()) unexpectedNavigations.push(frame.url());
  });
  await button.click();

  const result = page.getByTestId('pubchem-match');
  await expect(result).toContainText('trioxidane', { timeout: 40_000 });
  await expect(announcement).toContainText('trioxidane');
  await expect(announcement).toContainText('H2O3');
  const recordLink = result.getByRole('link');
  await expect(recordLink).toHaveAttribute('href', 'https://pubchem.ncbi.nlm.nih.gov/compound/7890');
  expect(unexpectedNavigations).toHaveLength(0);
  expect(submitted).toHaveLength(1);
  expect(submitted[0]).toContain('O');
  expect(await page.evaluate(() => window.__bondlabStore!.getState().atoms.length)).toBe(5);

  // Both controls use one theme-aware accent; switching themes must update both
  // without clearing the result or issuing another request.
  for (const theme of ['dark', 'light', 'dark'] as const) {
    await page.evaluate((nextTheme) => {
      const state = window.__bondlabStore!.getState();
      if (state.theme !== nextTheme) state.toggleTheme();
    }, theme);
    const accent = theme === 'light' ? /\btext-indigo-700\b/ : /\btext-indigo-400\b/;
    await expect(button).toHaveClass(accent);
    await expect(recordLink).toHaveClass(accent);
    await expect(button).toBeEnabled();
    if (theme === 'light') {
      const buttonRatio = await lightTextContrast(button);
      const linkRatio = await lightTextContrast(recordLink);
      console.log('PUBCHEM_LIGHT_CONTRAST', JSON.stringify({ buttonRatio, linkRatio }));
      expect(buttonRatio, 'enabled 12px action label contrast').toBeGreaterThanOrEqual(4.5);
      expect(linkRatio, '12px record link contrast').toBeGreaterThanOrEqual(4.5);
    }
  }
  expect(submitted).toHaveLength(1);

  // External identification never replaces the local recognizer.
  const name = await page.evaluate(async () => {
    const path = '/src/identifier.ts';
    const { identifyMolecule } = await import(/* @vite-ignore */ path);
    const state = window.__bondlabStore!.getState();
    return identifyMolecule(state.atoms, state.bonds)?.name;
  });
  expect(name).toBe('Unknown Molecule');
});

for (const remoteStatus of ['matched', 'unavailable'] as const) {
  test(`challenge lookup is opt-in and never judges the challenge: ${remoteStatus}`, async ({ page }) => {
    test.setTimeout(90_000);
    const requests: string[] = [];
    let release!: () => void;
    const pendingResponse = new Promise<void>((resolve) => { release = resolve; });
    await page.route('**/api/pubchem/identity', async (route) => {
      requests.push(route.request().postDataJSON().smiles);
      await pendingResponse;
      await route.fulfill({
        status: remoteStatus === 'matched' ? 200 : 503,
        contentType: 'application/json',
        body: JSON.stringify(remoteStatus === 'matched'
          ? { status: 'matched', cid: 962, iupacName: 'Water', molecularFormula: 'H2O' }
          : { status: 'unavailable' }),
      });
    });
    const read = () => page.evaluate(async () => {
      const path = '/src/identifier.ts';
      const { identifyMolecule } = await import(/* @vite-ignore */ path);
      const state = window.__bondlabStore!.getState();
      return {
        active: state.challengeActive,
        target: state.challengeTarget,
        status: state.challengeStatus,
        left: state.challengeTimeLeft,
        molecule: identifyMolecule(state.atoms, state.bonds)?.name,
        atoms: state.atoms,
        bonds: state.bonds,
      };
    });
    try {
      await openLab(page);
      await page.evaluate(() => {
        const state = window.__bondlabStore!.getState();
        state.setLanguage('en');
        state.startChallenge({ name: 'Water', formula: 'H2O' }, 120);
      });
      await expect.poll(async () => (await read()).left, { timeout: 10_000 }).toBeLessThan(120);
      expect(requests).toHaveLength(0);
      await page.evaluate(() => {
        const state = window.__bondlabStore!.getState();
        const ids = (['H', 'O', 'O', 'O', 'H'] as const).map((element) => state.addAtom(element));
        for (let i = 0; i < ids.length - 1; i++) state.addBond(ids[i], ids[i + 1]);
      });
      const button = page.getByTestId('external-identity').getByRole('button', { name: /PubChem/ });
      await expect(button).toBeVisible();
      await expect(button).toBeEnabled();
      const before = await read();
      expect(before).toMatchObject({ active: true, target: { name: 'Water', formula: 'H2O' }, status: 'playing', molecule: 'Unknown Molecule' });
      expect(requests).toHaveLength(0);
      await button.click();
      await expect.poll(() => requests.length, { timeout: 40_000 }).toBe(1);
      const whilePending = await read();
      await expect.poll(async () => (await read()).left, { timeout: 10_000 }).toBeLessThan(whilePending.left);
      release();
      const announcement = page.getByTestId('external-identity-announcement');
      if (remoteStatus === 'matched') await expect(page.getByTestId('pubchem-match')).toContainText('Water');
      else await expect(announcement).toContainText('PubChem unavailable');
      await expect(button).toBeEnabled();
      const after = await read();
      expect(after).toMatchObject({
        active: true, target: before.target, status: 'playing',
        molecule: before.molecule, atoms: before.atoms, bonds: before.bonds,
      });
      expect(after.left).toBeLessThan(whilePending.left);
      expect(requests).toHaveLength(1);
      // Only the locally assembled target, not the external identity, can win.
      await page.evaluate(() => {
        const state = window.__bondlabStore!.getState();
        state.clear();
        const o = state.addAtom('O');
        const h1 = state.addAtom('H');
        const h2 = state.addAtom('H');
        state.addBond(o, h1);
        state.addBond(o, h2);
      });
      await expect.poll(async () => (await read()).status).toBe('won');
      expect((await read()).molecule).toBe('Water');
      expect(requests).toHaveLength(1);
    } finally {
      release();
    }
  });
}
