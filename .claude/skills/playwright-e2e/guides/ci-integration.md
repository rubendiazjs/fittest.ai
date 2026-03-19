# CI Integration Guide

## GitHub Actions

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  e2e:
    runs-on: ubuntu-latest
    timeout-minutes: 30

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npx playwright test
        env:
          BASE_URL: http://localhost:3000

      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 14

      - name: Upload test artifacts
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: test-results
          path: test-results/
          retention-days: 7
```

## Sharding (Large Test Suites)

```yaml
jobs:
  e2e:
    strategy:
      fail-fast: false
      matrix:
        shard: [1/4, 2/4, 3/4, 4/4]
    steps:
      - name: Run tests (shard ${{ matrix.shard }})
        run: npx playwright test --shard=${{ matrix.shard }}
```

## Docker

```dockerfile
FROM mcr.microsoft.com/playwright:v1.50.0-noble
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx playwright test
```

## Best Practices

1. **Always upload artifacts** — screenshots, videos, traces are essential for debugging CI failures.
2. **Use retries in CI** — `retries: 2` in config when `process.env.CI`.
3. **Single worker in CI** — `workers: 1` avoids resource contention.
4. **Cache Playwright browsers** — saves 1-2 minutes per run.
5. **Run smoke tests on every PR, full suite nightly**.

```typescript
// Tag-based CI strategy
// PR pipeline: npx playwright test --grep @smoke
// Nightly pipeline: npx playwright test
```
