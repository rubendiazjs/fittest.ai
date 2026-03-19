# Assertions & Waiting Guide

## Auto-Retrying Assertions (Always Prefer)

Playwright auto-retries these assertions until they pass or timeout:

```typescript
// Visibility
await expect(locator).toBeVisible();
await expect(locator).toBeHidden();

// Text content
await expect(locator).toHaveText('Expected text');
await expect(locator).toContainText('partial');

// Attributes
await expect(locator).toHaveAttribute('href', '/home');
await expect(locator).toHaveClass(/active/);

// Form state
await expect(locator).toBeEnabled();
await expect(locator).toBeDisabled();
await expect(locator).toBeChecked();
await expect(locator).toHaveValue('test@example.com');

// Count
await expect(locator).toHaveCount(3);

// URL and title
await expect(page).toHaveURL(/dashboard/);
await expect(page).toHaveTitle('Dashboard');
```

## Non-Retrying Assertions (Avoid in E2E)

These evaluate once and don't retry. Avoid unless you have a good reason:

```typescript
// BAD — race condition risk
const text = await locator.textContent();
expect(text).toBe('Hello');

// GOOD — auto-retrying equivalent
await expect(locator).toHaveText('Hello');
```

## Soft Assertions

Continue test execution after a failure (useful for checking multiple things):

```typescript
await expect.soft(locator1).toHaveText('A');
await expect.soft(locator2).toHaveText('B');
await expect.soft(locator3).toHaveText('C');
// Test reports all failures, not just the first
```

## Polling Assertions with `toPass()`

For custom async conditions:

```typescript
await expect(async () => {
  const response = await page.request.get('/api/status');
  expect(response.status()).toBe(200);
}).toPass({ timeout: 30_000, intervals: [1000, 2000, 5000] });
```

## Waiting Patterns

### GOOD — Wait for a specific signal
```typescript
// Wait for navigation
await page.getByRole('link', { name: 'Dashboard' }).click();
await page.waitForURL('**/dashboard');

// Wait for network idle after action
await page.getByRole('button', { name: 'Load' }).click();
await page.waitForLoadState('networkidle');

// Wait for a specific API response
const responsePromise = page.waitForResponse('**/api/data');
await page.getByRole('button', { name: 'Fetch' }).click();
const response = await responsePromise;

// Wait for element state
await expect(page.getByRole('progressbar')).toBeHidden();
```

### BAD — Never hardcode timeouts
```typescript
// NEVER do this
await page.waitForTimeout(3000);
```

## Handling Loading States

```typescript
// Wait for spinner to disappear, then assert content
await expect(page.getByRole('progressbar')).toBeHidden();
await expect(page.getByRole('heading')).toHaveText('Results');

// Or wait for the final state directly (Playwright will auto-retry)
await expect(page.getByRole('heading')).toHaveText('Results', {
  timeout: 15_000  // increase only when justified
});
```
