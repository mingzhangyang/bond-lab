import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';

const FALLBACK_CHROMIUM_PATH = '/home/mingzhang/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome';
const localChromiumPath = process.env.PLAYWRIGHT_CHROMIUM_PATH
  ?? (existsSync(FALLBACK_CHROMIUM_PATH) ? FALLBACK_CHROMIUM_PATH : undefined);

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          executablePath: localChromiumPath,
        },
      },
    },
  ],
  webServer: {
    command: 'npm run dev -- --mode test --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173',
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
});
