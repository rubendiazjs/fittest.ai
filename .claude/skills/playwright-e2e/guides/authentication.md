# Authentication Guide

## Strategy: Reuse Auth State

Logging in via the UI for every test is slow. Instead, log in once and reuse the session.

### Setup: Global Auth (Recommended)

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      dependencies: ['setup'],
      use: {
        storageState: 'playwright/.auth/user.json',
      },
    },
  ],
});
```

### Auth Setup File

```typescript
// tests/auth.setup.ts
import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Wait for auth to complete
  await page.waitForURL('**/dashboard');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  // Save signed-in state
  await page.context().storageState({ path: authFile });
});
```

### .gitignore
```
playwright/.auth/
```

## Multiple Roles

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'admin',
      dependencies: ['setup'],
      use: { storageState: 'playwright/.auth/admin.json' },
    },
    {
      name: 'user',
      dependencies: ['setup'],
      use: { storageState: 'playwright/.auth/user.json' },
    },
  ],
});
```

## API-Based Auth (Fastest)

Skip the UI entirely for auth:

```typescript
setup('authenticate via API', async ({ request }) => {
  const response = await request.post('/api/auth/login', {
    data: { email: 'test@example.com', password: 'password123' },
  });
  expect(response.ok()).toBeTruthy();

  // Save cookies/tokens from response
  await request.storageState({ path: authFile });
});
```

## Tests That Need No Auth

```typescript
test.use({ storageState: { cookies: [], origins: [] } });

test('login page renders correctly', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('heading')).toHaveText('Sign In');
});
```
