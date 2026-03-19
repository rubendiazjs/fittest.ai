# Configuration Guide

## Starter Config

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  outputDir: './test-results',

  // Run all tests in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Limit parallel workers on CI
  workers: process.env.CI ? 1 : undefined,

  // Reporter
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ...(process.env.CI ? [['github'] as const] : []),
  ],

  use: {
    // Base URL for all tests
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    // Artifacts on failure
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',

    // Sensible defaults
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },

  // Browser projects
  projects: [
    // Auth setup
    { name: 'setup', testMatch: /.*\.setup\.ts/ },

    // Desktop browsers
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup'],
    },

    // Mobile viewports
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
      dependencies: ['setup'],
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
      dependencies: ['setup'],
    },
  ],

  // Local dev server
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

## Environment Variables

```bash
# .env.test
BASE_URL=http://localhost:3000
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=password123
```

Load in config:
```typescript
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });
```

## Global Setup/Teardown

```typescript
// playwright.config.ts
export default defineConfig({
  globalSetup: require.resolve('./tests/global-setup'),
  globalTeardown: require.resolve('./tests/global-teardown'),
});
```

## Useful CLI Commands

```bash
# Run all tests
npx playwright test

# Run specific file
npx playwright test tests/e2e/auth/login.spec.ts

# Run by tag
npx playwright test --grep @critical

# Run specific browser
npx playwright test --project=chromium

# Debug mode
npx playwright test --debug

# UI mode (interactive)
npx playwright test --ui

# Generate test with codegen
npx playwright codegen http://localhost:3000

# View last report
npx playwright show-report
```
