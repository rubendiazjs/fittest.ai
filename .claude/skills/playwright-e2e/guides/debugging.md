# Debugging Guide

## Diagnosis Workflow

When a test fails, follow this order:

1. **Read the error message** — Playwright errors are descriptive.
2. **Check the screenshot** — in `test-results/` folder.
3. **View the trace** — `npx playwright show-trace test-results/<test>/trace.zip`.
4. **Run in debug mode** — `npx playwright test --debug <file>`.
5. **Run in UI mode** — `npx playwright test --ui` for step-by-step replay.

## Common Failures & Fixes

### Locator Not Found
```
Error: locator.click: Error: strict mode violation
```
**Cause**: Multiple elements match the locator.
**Fix**: Make the locator more specific with filtering or chaining.

### Timeout Waiting for Element
```
Error: Timeout 30000ms exceeded waiting for expect(locator).toBeVisible()
```
**Cause**: Element never appears, or appears with different text/role.
**Fix**:
1. Check if the element exists at all: `await page.pause()` and inspect.
2. Check if the URL navigated correctly.
3. Check if auth state is loaded.

### Flaky Test (Passes Sometimes)
**Common causes**:
- Race condition: action fires before page is ready.
- Shared test data: tests interfere with each other.
- Animation: element moves during interaction.

**Fixes**:
```typescript
// Wait for stability before acting
await expect(page.getByRole('button', { name: 'Save' })).toBeEnabled();
await page.getByRole('button', { name: 'Save' }).click();

// Disable animations in test
await page.emulateMedia({ reducedMotion: 'reduce' });

// Use unique test data
const email = `test-${Date.now()}@example.com`;
```

### Network-Dependent Failures
```typescript
// Mock flaky external APIs
await page.route('**/api/external/**', (route) =>
  route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) })
);
```

## Debug Tools

```typescript
// Pause execution and open inspector
await page.pause();

// Log to console
console.log(await page.content());
console.log(await locator.count());
console.log(await locator.textContent());

// Take screenshot mid-test
await page.screenshot({ path: 'debug.png', fullPage: true });
```

## Trace Viewer

The trace contains screenshots at every step, DOM snapshots, network log, and console messages.

```bash
# View trace from a failed test
npx playwright show-trace test-results/auth-login-chromium/trace.zip

# Or enable trace for all tests temporarily
# playwright.config.ts → use: { trace: 'on' }
```
