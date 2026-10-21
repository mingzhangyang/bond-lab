import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('bondlab-onboarding-version', '2026-03-quickstart-v1');
    localStorage.setItem('bondlab-language', 'en');
  });
});

test('scene download failure preserves the shell and shows recovery', async ({ page }) => {
  await page.route('**/components/Scene.tsx*', (route) => route.abort());
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('3D scene unavailable');
  await expect(page.getByRole('button', { name: 'Reload page' })).toBeVisible();
  await page.getByTestId('settings-menu-button').click();
  await page.getByTestId('menu-link-instructions').click();
  await expect(page).toHaveURL(/\/instructions$/);
});

test('WebGL initialization failure is handled without an unhandled rejection', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...args: unknown[]) {
      if (type.startsWith('webgl')) return null;
      return Reflect.apply(getContext, this, [type, ...args]);
    } as typeof getContext;
  });
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('3D scene unavailable');
  await expect(page.getByTestId('settings-menu-button')).toBeVisible();
  expect(errors).toEqual([]);
});

test('reduced motion removes menu and drawer movement, retaining actions', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByTestId('settings-menu-button').click();
  await expect(page.getByTestId('settings-menu-sheet')).toHaveCSS('animation-name', 'none');
  await page.getByTestId('settings-menu-backdrop').click({ position: { x: 20, y: 200 } });
  await page.getByTestId('mobile-dock-add-button').click();
  await expect(page.getByTestId('mobile-elements-drawer')).toHaveCSS('transition-duration', '0s');
  await page.getByTestId('mobile-element-button-C').click();
  await expect.poll(() => page.evaluate(() => window.__bondlabStore?.getState().atoms.length)).toBe(1);
});

test('context loss shows recovery and releases the scene', async ({ page }) => {
  await page.goto('/');
  await expect.poll(() => page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    return canvas && (canvas.width > 300);
  })).toBeTruthy();
  // The driver extension emits a real context-lost event (not a DOM-only mock).
  await page.evaluate(() => {
    const gl = document.querySelector('canvas')!.getContext('webgl2')!;
    const extension = gl.getExtension('WEBGL_lose_context');
    if (!extension) throw new Error('Context loss extension unavailable');
    extension.loseContext();
  });
  await expect(page.getByRole('alert')).toContainText('3D scene unavailable');
  await expect(page.locator('canvas')).toHaveCount(0);
});

test('320px stability summary keeps score and energy separate', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/');
  await page.getByTestId('mobile-dock-add-button').click();
  await page.getByTestId('mobile-element-button-C').click();
  const summary = page.getByRole('button', { name: 'Stability', exact: true });
  const score = await summary.locator('span').filter({ hasText: /\/100/ }).boundingBox();
  const energy = await summary.locator('span').filter({ hasText: /kJ\/mol/ }).boundingBox();
  expect(score).not.toBeNull();
  expect(energy).not.toBeNull();
  expect(score!.x + score!.width <= energy!.x || score!.y + score!.height <= energy!.y).toBeTruthy();
});
