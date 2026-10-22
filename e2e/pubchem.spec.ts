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
  await page.evaluate(() => {
    const state = window.__bondlabStore!.getState();
    const first = state.addAtom('C');
    const second = state.addAtom('C');
    state.addBond(first, second);
  });
  await expect(page.getByTestId('external-identity')).toBeVisible();
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
