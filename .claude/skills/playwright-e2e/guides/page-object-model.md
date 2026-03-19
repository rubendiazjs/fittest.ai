# Page Object Model Guide

## When to Use POM

Use POM when a page or component is tested by 3+ test files. For simpler cases, inline locators are fine.

## Structure

```
tests/
  pages/
    login.page.ts
    dashboard.page.ts
    components/
      navbar.component.ts
      data-table.component.ts
  specs/
    auth.spec.ts
    dashboard.spec.ts
```

## Page Object Template

```typescript
// tests/pages/login.page.ts
import { type Locator, type Page, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign in' });
    this.errorMessage = page.getByRole('alert');
  }

  async goto() {
    await this.page.goto('/login');
    await expect(this.emailInput).toBeVisible();
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectError(message: string) {
    await expect(this.errorMessage).toHaveText(message);
  }
}
```

## Using Page Objects in Tests

```typescript
// tests/specs/auth.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test.describe('Authentication', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should login with valid credentials', async ({ page }) => {
    await loginPage.login('user@example.com', 'password123');
    await expect(page).toHaveURL(/dashboard/);
  });

  test('should show error for invalid credentials', async () => {
    await loginPage.login('user@example.com', 'wrong');
    await loginPage.expectError('Invalid email or password');
  });
});
```

## Rules

1. **Locators in constructor** — define all locators as class properties.
2. **Actions as methods** — `login()`, `addItem()`, `search()`.
3. **Assertions as `expect*` methods** — `expectError()`, `expectRowCount()`.
4. **No test logic in page objects** — no `test()`, no `test.step()`.
5. **Return page objects for navigation** — if clicking a link goes to a new page, return the new POM.

```typescript
async clickDashboard(): Promise<DashboardPage> {
  await this.dashboardLink.click();
  return new DashboardPage(this.page);
}
```
