# Visual Regression Guide

## Built-in Screenshot Comparison

```typescript
test('homepage visual check', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png');
});

// Component-level screenshot
test('navbar visual check', async ({ page }) => {
  await page.goto('/');
  const navbar = page.getByRole('navigation');
  await expect(navbar).toHaveScreenshot('navbar.png');
});
```

## First Run

On first run, Playwright creates baseline screenshots in a `__snapshots__` folder next to the test. Subsequent runs compare against these baselines.

```bash
# Update baselines after intentional UI changes
npx playwright test --update-snapshots
```

## Tolerance & Options

```typescript
await expect(page).toHaveScreenshot('homepage.png', {
  maxDiffPixelRatio: 0.01,    // allow 1% pixel difference
  threshold: 0.2,              // color difference threshold (0-1)
  animations: 'disabled',      // freeze CSS animations
  mask: [page.getByTestId('timestamp')],  // mask dynamic content
});
```

## Best Practices

1. **Mask dynamic content** — timestamps, avatars, ads, random data.
2. **Disable animations** — prevents flaky diffs from animation frames.
3. **Use component screenshots** — full-page screenshots break on minor layout shifts.
4. **Run on a single OS in CI** — rendering differences across OS cause false positives.
5. **Review diffs carefully** — don't blindly update baselines.
