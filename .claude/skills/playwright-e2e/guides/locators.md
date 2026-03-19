# Locators Guide

## Locator Priority (Strict Order)

Always choose the highest-priority locator that works reliably.

### 1. Role-Based (Best)
```typescript
page.getByRole('button', { name: 'Save' })
page.getByRole('link', { name: 'Home' })
page.getByRole('heading', { level: 1 })
page.getByRole('textbox', { name: 'Email' })
page.getByRole('checkbox', { name: 'Remember me' })
page.getByRole('dialog')
page.getByRole('navigation')
```

### 2. Label-Based (Forms)
```typescript
page.getByLabel('Email address')
page.getByLabel('Password')
page.getByPlaceholder('Search...')
```

### 3. Text-Based (Static Content)
```typescript
page.getByText('Welcome back')
page.getByText('No results found')
// Use exact: true when partial matches are risky
page.getByText('Submit', { exact: true })
```

### 4. Test ID (Fallback)
```typescript
page.getByTestId('checkout-button')
page.getByTestId('user-avatar')
```

Use `data-testid` when the element has no accessible role/label and text is dynamic.

### 5. CSS/XPath (Never)
```typescript
// NEVER use these in e2e tests
page.locator('.btn-primary')         // fragile
page.locator('#submit-form')         // fragile
page.locator('div > span:nth-child(2)')  // extremely fragile
```

## Chaining & Filtering
```typescript
// Narrow scope with chaining
const dialog = page.getByRole('dialog');
await dialog.getByRole('button', { name: 'Confirm' }).click();

// Filter by text
page.getByRole('listitem').filter({ hasText: 'Product A' })

// Filter by child locator
page.getByRole('listitem').filter({
  has: page.getByRole('button', { name: 'Add to cart' })
})
```

## Lists & Tables
```typescript
// Count items
await expect(page.getByRole('listitem')).toHaveCount(5);

// Specific item by position
const rows = page.getByRole('row');
await expect(rows.nth(1)).toContainText('John');

// Iterate
for (const item of await page.getByRole('listitem').all()) {
  await expect(item).toBeVisible();
}
```

## When You Can't Find a Locator
1. Check if the element needs an ARIA role or label — suggest the fix to the dev.
2. Add a `data-testid` attribute — it's better than a fragile CSS selector.
3. Use `page.getByRole('generic')` with filtering as a last resort.
