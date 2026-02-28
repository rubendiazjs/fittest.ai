# E2E Test Architect Memory — fittest.ai

## Project Setup

- Dev server: `http://localhost:5174` (Vite default port for this project)
- Test runner: `@playwright/test` — installed as devDependency
- Browsers installed: Chromium only (Sprint 0)
- Test directory: `tests/e2e/`
- Config file: `playwright.config.ts` at project root
- Run command: `npm run test:e2e` (calls `playwright test`)
- Node requirement: Node 18+ required — machine has v22 via nvm

## Auth Flow (critical for all tests)

- App entry point: `src/App.tsx`
- Auth gate: `AuthGate` component wraps everything in `AuthProvider`
- Unauthenticated state always lands on `<LoginPage />` at route `/`
- Loading state shows a `Loader2` spinner (no text, no heading) — do NOT assert on headings during auth loading
- LoginPage heading: "Iniciar sesión" (sign-in) or "Crear cuenta" (sign-up)
- Toggle link between modes: button with text "Regístrate" / "Inicia sesión"

## Stable Locators for LoginPage

```typescript
// CardTitle renders a <div> — NOT a heading element — use getByText(), never getByRole('heading')
page.getByText('Iniciar sesión').first()               // sign-in mode title (div, not h*)
page.getByText('Crear cuenta')                         // sign-up mode title (div, not h*)
page.getByLabel('Email')                               // works: Radix Label → real <label>
page.getByLabel('Contraseña')                          // works: Radix Label → real <label>
page.getByRole('button', { name: 'Iniciar sesión' })   // submit (real <button>)
page.getByRole('button', { name: 'Registrarse' })      // submit (sign-up mode, real <button>)
page.getByRole('button', { name: 'Regístrate' })       // toggle to sign-up (real <button>)
page.getByRole('button', { name: 'Inicia sesión' })    // toggle to sign-in (real <button>)
```

## Known Anti-Pattern: CardTitle is a div

`src/components/ui/card.tsx` — `CardTitle` is a `forwardRef` wrapping a `<div>`, not `<h1>`-`<h6>`.
`getByRole('heading')` will NEVER match it. Use `getByText()` for any CardTitle text.
This affects every page that uses the shadcn Card component for its main title.

## Page Title

- `index.html` title: `fittest.ai` — use `/fittest\.ai/i` regex in title assertions

## App States (after auth)

- Authenticated + no profile: `<OnboardingWizard />`
- Authenticated + has profile: dashboard with `<ProfileDashboard />`, streak indicator, optional checkin modal
- Loading: spinner (`Loader2` icon, no text)

## Test Data Notes

- Test users need real Supabase auth credentials — no mock IDs in codebase anymore
- See project MEMORY.md for auth migration history (useAuth() hook, no more MOCK_USER_ID)
- For auth-dependent tests: create a `.env.test` with TEST_USER_EMAIL / TEST_USER_PASSWORD

## Patterns to Follow

- Use `test.step()` for all multi-step flows — improves trace readability
- Assert `toBeVisible()` before interacting with elements
- No `waitForTimeout()` — use condition-based waits only
- Group related tests in `test.describe()` blocks
- App strings are in Spanish — use exact Spanish text in locators
