import { expect, test } from '@playwright/test';

for (const width of [390, 1280]) {
  for (const language of ['en', 'zh'] as const) {
    test(`calcium hydroxide recognition and challenge integration: ${width}px ${language}`, async ({ page }) => {
      test.setTimeout(60_000);
      await page.setViewportSize({ width, height: 844 });
      await page.addInitScript(() => {
        localStorage.setItem('bondlab-onboarding-version', '2026-03-quickstart-v1');
      });
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto('/');
      await expect(page.locator('.lab-ui-root')).toBeVisible({ timeout: 15000 });
      await page.waitForFunction(() => Boolean(window.__bondlabStore));
      const ids = await page.evaluate((locale) => {
        const state = window.__bondlabStore!.getState();
        state.setLanguage(locale);
        state.clear();
        return (['Ca', 'O', 'H', 'O', 'H'] as const).map((element) => state.addAtom(element));
      }, language);
      const name = language === 'zh' ? '\u6c22\u6c27\u5316\u9499' : 'Calcium Hydroxide';
      const label = page.getByText(name, { exact: true });
      await expect(label).toHaveCount(0);

      await page.evaluate((atomIds) => {
        const state = window.__bondlabStore!.getState();
        state.addBond(atomIds[0], atomIds[1]);
        state.addBond(atomIds[1], atomIds[2]);
        state.addBond(atomIds[0], atomIds[3]);
      }, ids);
      await expect(label).toHaveCount(0);
      await page.evaluate((atomIds) => {
        window.__bondlabStore!.getState().addBond(atomIds[3], atomIds[4]);
      }, ids);
      await expect(label).toBeVisible();
      await expect(page.getByText('Ca(OH)\u2082', { exact: true })).toBeVisible();

      const pill = page.getByTestId('mobile-molecule-pill');
      if (width === 390 && await pill.isVisible()) await pill.click();
      await expect(page.getByText(language === 'zh' ? '\u4e0d\u9002\u7528' : 'Not applicable', { exact: true })).toBeVisible();
      await expect(page.getByText(language === 'zh' ? /\u5316\u5b66\u5f0f\u5355\u5143\u7684\u7b80\u5316\u793a\u610f/ : /Simplified formula-unit model/).first()).toBeVisible();

      await page.evaluate(() => {
        const state = window.__bondlabStore!.getState();
        state.removeBond(state.bonds[0].id);
      });
      await expect(label).toHaveCount(0);
      await page.evaluate(() => window.__bondlabStore!.getState().restoreLastRemovedBond());
      await expect(label).toBeVisible();

      await page.evaluate(() => {
        const state = window.__bondlabStore!.getState();
        state.startChallenge({ name: 'Calcium Hydroxide', formula: 'Ca(OH)\u2082' }, 60);
        const atomIds = (['Ca', 'O', 'H', 'O', 'H'] as const).map((element) => state.addAtom(element));
        for (const [a, b] of [[0, 1], [1, 2], [0, 3], [3, 4]]) state.addBond(atomIds[a], atomIds[b]);
      });
      await expect.poll(() => page.evaluate(() => window.__bondlabStore!.getState().challengeStatus)).toBe('won');
      expect(errors).toEqual([]);
    });
  }
}
