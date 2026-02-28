# Test Organization Guide

## Directory Structure

```
tests/
  e2e/
    auth/
      login.spec.ts
      logout.spec.ts
      password-reset.spec.ts
    dashboard/
      overview.spec.ts
      widgets.spec.ts
    checkout/
      cart.spec.ts
      payment.spec.ts
      confirmation.spec.ts
  pages/              # Page Object Models
  fixtures/           # Custom test fixtures
  helpers/            # Shared utility functions
  data/               # Test data factories
specs/                # Human-readable test plans (markdown)
playwright.config.ts
```

## Naming Conventions

- **Spec files**: `<feature>.spec.ts` — match the feature, not the page.
- **Test names**: Start with `should` — `test('should display error for empty email')`.
- **Describe blocks**: Feature or page name — `test.describe('Login Page')`.

## Grouping Tests

```typescript
test.describe('Shopping Cart', () => {
  test.describe('adding items', () => {
    test('should add a single item', async ({ page }) => { /* ... */ });
    test('should update quantity', async ({ page }) => { /* ... */ });
  });

  test.describe('removing items', () => {
    test('should remove item from cart', async ({ page }) => { /* ... */ });
    test('should show empty state', async ({ page }) => { /* ... */ });
  });
});
```

## Tags for Selective Running

```typescript
test('should process payment @critical', async ({ page }) => { /* ... */ });
test('should show order history @smoke', async ({ page }) => { /* ... */ });

// Run only critical tests:
// npx playwright test --grep @critical
```

## Custom Fixtures

```typescript
// tests/fixtures/index.ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

type MyFixtures = {
  loginPage: LoginPage;
  authenticatedPage: Page;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },
});

export { expect } from '@playwright/test';
```

## Test Data

```typescript
// tests/data/users.ts
export const testUsers = {
  admin: { email: 'admin@test.com', password: 'admin123', role: 'admin' },
  user: { email: 'user@test.com', password: 'user123', role: 'user' },
};

// Generate unique data per test run
export function uniqueEmail() {
  return `test-${Date.now()}-${Math.random().toString(36).slice(2)}@test.com`;
}
```

## Parallelism

```typescript
// playwright.config.ts
export default defineConfig({
  fullyParallel: true,   // run tests in files in parallel
  workers: process.env.CI ? 1 : undefined,  // limit in CI
});

// Force serial for tests with shared state
test.describe.serial('Multi-step checkout', () => {
  test('step 1: add to cart', async ({ page }) => { /* ... */ });
  test('step 2: enter shipping', async ({ page }) => { /* ... */ });
  test('step 3: confirm payment', async ({ page }) => { /* ... */ });
});
```
