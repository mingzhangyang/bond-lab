import { expect, test } from '@playwright/test';
import path from 'node:path';

type Snapshot = Array<{ connected: boolean; lost: boolean; counts: Record<string, number>; shaderErrors: string[] }>;

test('repeated lab visits release contexts and keep GPU resource counts bounded', async ({ page }) => {
  test.setTimeout(90_000);
  await page.addInitScript({ path: path.resolve('e2e/fixtures/webgl-probe.js') });
  await page.addInitScript(() => localStorage.setItem('bondlab-onboarding-version', '2026-03-quickstart-v1'));
  const snapshot = () => page.evaluate(() => (window as unknown as { gpuSnapshot: () => Snapshot }).gpuSnapshot());
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await page.getByTestId('element-button-C').click();
  await page.getByTestId('element-button-O').click();
  let baseline: Record<string, number> | undefined;
  for (let cycle = 0; cycle < 12; cycle++) {
    await expect.poll(async () => (await snapshot()).filter((s) => s.connected && !s.lost && s.counts.Framebuffer > 0).length).toBe(1);
    // Allow initial shader compilation and the renderer's deferred unmount.
    await page.waitForTimeout(650);
    const live = (await snapshot()).filter((s) => !s.lost);
    expect(live).toHaveLength(1);
    const counts = live[0].counts;
    baseline ??= counts;
    for (const kind of ['Texture', 'Framebuffer', 'Renderbuffer', 'Buffer']) {
      expect(counts[kind]).toBe(baseline[kind]);
    }
    expect(live[0].shaderErrors).toEqual([]);
    await page.getByTestId('settings-menu-button').click();
    await page.getByTestId('menu-link-instructions').click();
    await expect(page.locator('canvas')).toHaveCount(0);
    await expect.poll(async () => (await snapshot()).filter((s) => !s.lost).length).toBe(0);
    await page.getByRole('link', { name: 'Back to Lab' }).click();
  }
  expect(errors).toEqual([]);
});
