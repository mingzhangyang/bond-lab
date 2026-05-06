import { expect, test } from '@playwright/test';

type BondLabStore = {
  getState: () => {
    atoms: Array<{ id: string }>;
    bonds: Array<{ id: string }>;
    interactionMode: 'build' | 'delete';
    addBond: (source: string, target: string) => void;
    clear: () => void;
  };
};

declare global {
  interface Window {
    __bondlabStore?: BondLabStore;
  }
}

test('settings menu routes to instructions and privacy pages', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('settings-menu-button').click();
  await page.getByTestId('menu-link-instructions').click();
  await expect(page).toHaveURL(/\/instructions$/);

  await page.goto('/');
  await page.getByTestId('settings-menu-button').click();
  await page.getByTestId('menu-link-privacy').click();
  await expect(page).toHaveURL(/\/privacy$/);
});

test('core molecule actions work in browser runtime', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('element-button-C').click();
  await page.getByTestId('element-button-O').click();

  const afterAtoms = await page.evaluate(() => {
    const store = window.__bondlabStore;
    if (!store) throw new Error('Store is not exposed in test mode.');

    const state = store.getState();
    const source = state.atoms[0]?.id;
    const target = state.atoms[1]?.id;
    if (!source || !target) {
      throw new Error('Expected at least two atoms after UI clicks.');
    }

    state.addBond(source, target);
    return {
      atomCount: store.getState().atoms.length,
      bondCount: store.getState().bonds.length,
    };
  });

  expect(afterAtoms.atomCount).toBeGreaterThanOrEqual(2);
  expect(afterAtoms.bondCount).toBe(1);

  await page.getByTestId('interaction-mode-toggle-desktop').click();
  const interactionMode = await page.evaluate(() => window.__bondlabStore?.getState().interactionMode);
  expect(interactionMode).toBe('delete');

  await page.getByTestId('clear-elements-desktop').click();
  const cleared = await page.evaluate(() => {
    const state = window.__bondlabStore?.getState();
    if (!state) throw new Error('Missing store state.');
    return { atomCount: state.atoms.length, bondCount: state.bonds.length };
  });

  expect(cleared.atomCount).toBe(0);
  expect(cleared.bondCount).toBe(0);
});

test('mobile dock opens element drawer and toggles interaction mode', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await expect(page.getByTestId('mobile-action-dock')).toBeVisible();
  await page.getByTestId('mobile-dock-add-button').click();
  await expect(page.getByTestId('mobile-elements-drawer')).toBeVisible();

  await page.getByTestId('mobile-elements-drawer-close').click();
  await expect(page.getByTestId('mobile-elements-drawer')).not.toBeVisible();

  await page.getByTestId('interaction-mode-toggle-mobile').click();
  const interactionMode = await page.evaluate(() => window.__bondlabStore?.getState().interactionMode);
  expect(interactionMode).toBe('delete');
});

test('settings uses bottom sheet layout on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await page.getByTestId('settings-menu-button').click();
  await expect(page.getByTestId('settings-menu-sheet')).toBeVisible();
  await page.getByTestId('settings-menu-backdrop').click();
  await expect(page.getByTestId('settings-menu-sheet')).not.toBeVisible();
});
