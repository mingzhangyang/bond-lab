import { expect, test } from '@playwright/test';

test('unrecognized connected structure exposes explicit opt-in lookup, not an automatic API request', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('bondlab-onboarding-version', '2026-03-quickstart-v1');
  });
  const requests: string[] = [];
  page.on('request', (req) => {
    if (req.url().includes('/api/pubchem/identity')) requests.push(req.url());
  });
  await page.setViewportSize({ width: 1280, height: 850 });
  await page.goto('/');
  await expect(page.locator('.lab-ui-root')).toBeVisible({ timeout: 15000 });
  await page.evaluate(() => {
    const state = window.__bondlabStore!.getState();
    const first = state.addAtom('C');
    const second = state.addAtom('C');
    state.addBond(first, second);
  });
  const inspectStatus = await page.evaluate(async () => {
    const path = '/src/identifier.ts';
    const { analyzeMolecule } = await import(/* @vite-ignore */ path);
    const state = window.__bondlabStore!.getState();
    return {
      recognition: analyzeMolecule(state.atoms, state.bonds),
      uiReady: Boolean(document.querySelector('.lab-ui-root')),
      inspectorCount: document.querySelectorAll('[data-testid="external-identity"]').length,
      snippet: document.body.innerText.slice(-700),
      atoms: state.atoms.length,
      bonds: state.bonds.length,
    };
  });
  console.log('PUBCHEM_UI_DIAG', JSON.stringify(inspectStatus));
  expect(inspectStatus.recognition.molecule?.name).toBe('Unknown Molecule');
  await expect(page.getByTestId('external-identity')).toBeVisible({ timeout: 15000 });
  await expect(page.getByRole('button', { name: /PubChem/ })).toBeVisible();
  await expect.poll(() => requests.length).toBe(0);

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
  await expect.poll(() => requests.length).toBe(0);
});


test('unknown but well-formed structure can be RDKit-checked and looked up via user opt-in', async ({ page }) => {
  test.setTimeout(90_000);
  await page.addInitScript(() => {
    localStorage.setItem('bondlab-onboarding-version', '2026-03-quickstart-v1');
  });
  await page.setViewportSize({ width: 1280, height: 850 });
  const submitted: string[] = [];
  await page.route('**/api/pubchem/identity', async (route) => {
    const request = route.request();
    submitted.push(request.postDataJSON().smiles);
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
  await page.goto('/');
  await expect(page.locator('.lab-ui-root')).toBeVisible({ timeout: 15000 });
  await page.evaluate(() => {
    const state = window.__bondlabStore!.getState();
    const elements = ['H', 'O', 'O', 'O', 'H'] as const;
    const ids = elements.map((element) => state.addAtom(element));
    for (let i = 0; i < ids.length - 1; i++) {
      state.addBond(ids[i], ids[i + 1]);
    }
  });

  await expect(page.getByTestId('external-identity')).toBeVisible({ timeout: 15000 });
  await expect(page.getByTestId('pubchem-match')).toHaveCount(0);
  expect(submitted).toHaveLength(0);
  const browserMessages: string[] = [];
  page.on('pageerror', (error) => browserMessages.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') browserMessages.push(message.text());
  });
  const navigations: string[] = [];
  page.on('framenavigated', (frame) => {
    if (frame === page.mainFrame()) navigations.push(frame.url());
  });
  await page.getByRole('button', { name: /PubChem/ }).click();
  await page.waitForTimeout(4500);
  const debug = await page.evaluate(() => ({
    inspectorText: document.querySelector('[data-testid="external-identity"]')?.textContent ?? null,
    atoms: window.__bondlabStore?.getState().atoms.length,
    ready: Boolean(document.querySelector('.lab-ui-root')),
  }));
  console.log('RDKIT_FLOW_DIAG', JSON.stringify({ debug, submitted, browserMessages, navigations }));
  await expect(page.getByTestId('pubchem-match')).toContainText('trioxidane', { timeout: 30_000 });
  await expect(page.getByTestId('pubchem-match').getByRole('link')).toHaveAttribute(
    'href', 'https://pubchem.ncbi.nlm.nih.gov/compound/7890',
  );
  expect(submitted).toHaveLength(1);
  expect(submitted[0]).toContain('O');
  // A network identity is supplemental: no mutation or override of the editor's
  // native unknown recognition status.
  const { name } = await page.evaluate(async () => {
    const path = '/src/identifier.ts';
    const { identifyMolecule } = await import(/* @vite-ignore */ path);
    const state = window.__bondlabStore!.getState();
    return identifyMolecule(state.atoms, state.bonds)!;
  });
  expect(name).toBe('Unknown Molecule');
});
