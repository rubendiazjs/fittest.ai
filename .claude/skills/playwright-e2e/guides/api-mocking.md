# API Mocking Guide

## When to Mock

- **External services** you don't control (payment gateways, third-party APIs).
- **Slow endpoints** that make tests unnecessarily long.
- **Error scenarios** that are hard to trigger with real backends.
- **DO NOT mock your own app's core API** — that defeats the purpose of e2e testing.

## Route Interception

```typescript
// Mock a specific API call
await page.route('**/api/products', (route) =>
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([
      { id: 1, name: 'Widget', price: 9.99 },
      { id: 2, name: 'Gadget', price: 19.99 },
    ]),
  })
);
```

## Error Simulation

```typescript
// Simulate server error
await page.route('**/api/checkout', (route) =>
  route.fulfill({ status: 500, body: 'Internal Server Error' })
);

// Simulate network failure
await page.route('**/api/data', (route) => route.abort());

// Simulate slow response
await page.route('**/api/search', async (route) => {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  await route.fulfill({ status: 200, body: '[]' });
});
```

## Modify Real Responses

```typescript
await page.route('**/api/user', async (route) => {
  const response = await route.fetch();
  const json = await response.json();
  json.featureFlags = { newCheckout: true };
  await route.fulfill({ response, body: JSON.stringify(json) });
});
```

## Wait for API Calls

```typescript
// Wait for specific request after action
const responsePromise = page.waitForResponse(
  (resp) => resp.url().includes('/api/save') && resp.status() === 200
);
await page.getByRole('button', { name: 'Save' }).click();
const response = await responsePromise;

// Assert on request payload
const requestPromise = page.waitForRequest('**/api/save');
await page.getByRole('button', { name: 'Save' }).click();
const request = await requestPromise;
expect(request.postDataJSON()).toMatchObject({ name: 'Test' });
```

## HAR Recording (Record & Replay)

```typescript
// Record
await page.routeFromHAR('tests/data/api.har', { update: true });
// ... run test normally ...

// Replay
await page.routeFromHAR('tests/data/api.har', {
  url: '**/api/**',
  notFound: 'fallback',  // real request if not in HAR
});
```
