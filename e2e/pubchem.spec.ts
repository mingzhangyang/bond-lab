import { expect, test } from '@playwright/test';

async function openLab(page: import('@playwright/test').Page): Promise<void> {
  await page.addInitScript(() => {
    localStorage.setItem('bondlab-onboarding-version', '2026-03-quickstart-v1');
  });
  await page.setViewportSize({ width: 1280, height: 850 });
  await page.goto('/');
  await expect(page.locator('.lab-ui-root')).toBeVisible({ timeout: 15000 });
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
  await expect(result.getByRole('link')).toHaveAttribute('href', 'https://pubchem.ncbi.nlm.nih.gov/compound/7890');
  expect(unexpectedNavigations).toHaveLength(0);
  expect(submitted).toHaveLength(1);
  expect(submitted[0]).toContain('O');
  expect(await page.evaluate(() => window.__bondlabStore!.getState().atoms.length)).toBe(5);

  // External identification never replaces the local recognizer.
  const name = await page.evaluate(async () => {
    const path = '/src/identifier.ts';
    const { identifyMolecule } = await import(/* @vite-ignore */ path);
    const state = window.__bondlabStore!.getState();
    return identifyMolecule(state.atoms, state.bonds)?.name;
  });
  expect(name).toBe('Unknown Molecule');
});
