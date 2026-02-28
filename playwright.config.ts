import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  outputDir: './test-results',

  // Run all tests in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only — no retries locally so failures are obvious
  retries: process.env.CI ? 2 : 0,

  // Limit parallel workers on CI; use all available cores locally
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['list'],
    ...(process.env.CI ? [['github'] as const] : []),
  ],

  use: {
    // Dev server runs on 5174 (Vite default for this project)
    baseURL: process.env.BASE_URL || 'http://localhost:5173',

    // Capture artifacts on failure for easier debugging
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',

    // Sensible timeout defaults — configure here, not in test code
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },

  projects: [
    // Sprint 0: Chromium only — broaden to Firefox/WebKit later
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // No webServer block — start `npm run dev` manually before running tests.
  // Add a webServer block here once CI is wired up.
})
