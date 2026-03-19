import { config } from 'dotenv'
import { defineConfig, devices } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Load .env.test for e2e tests
config({ path: path.resolve(process.cwd(), '.env.test') })

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const authFile = path.join(__dirname, '.auth', 'user.json')

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
    baseURL: process.env.BASE_URL || 'http://localhost:5173',

    // Capture artifacts on failure for easier debugging
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',

    // Sensible timeout defaults — configure here, not in test code
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },

  // Default expect assertion timeout — increase from 5s (default) to match actionTimeout.
  // Needed for assertions that depend on real Supabase round-trips (e.g. signOut redirect).
  expect: { timeout: 10_000 },

  projects: [
    // Auth setup — runs once to save storageState
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },

    // Main test suite — depends on setup, reuses auth state
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: authFile,
      },
      dependencies: ['setup'],
      testIgnore: /auth\.setup\.ts/,
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
