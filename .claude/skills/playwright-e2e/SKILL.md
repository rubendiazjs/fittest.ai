---
name: playwright-e2e
description: >
  Comprehensive Playwright E2E testing skill. Provides best practices for writing reliable,
  maintainable end-to-end tests. Covers locator strategies, assertions, waiting patterns,
  Page Object Model, authentication, API mocking, visual regression, accessibility testing,
  and CI/CD integration. Use when writing, reviewing, or debugging Playwright tests.
---

# Playwright E2E Testing Skill

## When to Load This Skill
Load this skill when the user asks to:
- Write, create, or add e2e tests
- Fix flaky or failing Playwright tests
- Review test quality or patterns
- Set up Playwright in a project
- Plan a testing strategy for a web application

## Guides Available

| Guide | Path | When to Read |
|-------|------|-------------|
| Locators | `guides/locators.md` | Writing any test that interacts with the DOM |
| Assertions & Waiting | `guides/assertions-and-waiting.md` | Writing expects, handling async UI |
| Authentication | `guides/authentication.md` | Tests that require login or session state |
| Page Object Model | `guides/page-object-model.md` | Creating reusable page abstractions |
| Test Organization | `guides/test-organization.md` | Structuring test files and suites |
| API Mocking | `guides/api-mocking.md` | Mocking network requests in tests |
| Configuration | `guides/configuration.md` | Setting up playwright.config.ts |
| CI Integration | `guides/ci-integration.md` | Running tests in CI/CD pipelines |
| Debugging | `guides/debugging.md` | Diagnosing test failures |
| Visual Regression | `guides/visual-regression.md` | Screenshot comparison testing |

## Core Rules (Always Follow)

1. **Locator Priority** (most to least preferred):
   - `getByRole('button', { name: 'Submit' })` — semantic, accessible
   - `getByLabel('Email')` — form inputs
   - `getByText('Welcome')` — visible text
   - `getByTestId('checkout-btn')` — stable test attributes
   - **NEVER** use `.locator('.css-class')` or `#id` selectors

2. **Assertion Pattern**:
   ```typescript
   // GOOD — auto-retrying assertion
   await expect(page.getByRole('heading')).toHaveText('Dashboard');

   // BAD — snapshot assertion, not auto-retrying
   const text = await page.getByRole('heading').textContent();
   expect(text).toBe('Dashboard');
   ```

3. **Wait Strategy**:
   ```typescript
   // GOOD — wait for specific condition
   await expect(page.getByRole('table')).toBeVisible();

   // BAD — arbitrary timeout
   await page.waitForTimeout(3000);
   ```

4. **Test Independence**:
   - Each test must work in isolation
   - Use `test.beforeEach` for setup, not shared mutable state
   - Generate unique test data per test run

5. **Error Artifacts**:
   ```typescript
   // playwright.config.ts
   use: {
     screenshot: 'only-on-failure',
     video: 'retain-on-failure',
     trace: 'retain-on-failure',
   }
   ```
