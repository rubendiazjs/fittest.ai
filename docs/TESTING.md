# Testing

## Current Test Surface

The repo currently uses:

- `npm run lint`
- `npm run build`
- `npm run test:e2e`

There is no unit-test runner configured in `package.json` today.

## Playwright Layout

- Playwright config lives in `playwright.config.ts`.
- Specs live in `tests/e2e/`.
- Page objects and fixtures live under `tests/e2e/pages/` and `tests/e2e/fixtures/`.
- Auth setup is split into a `setup` project plus a main `chromium` project that reuses stored auth state.

## E2E Environment

Playwright loads `.env.test` before running. A practical local file should include:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
E2E_TEST_EMAIL=...
E2E_TEST_PASSWORD=...
BASE_URL=http://localhost:5173
```

Notes:

- `E2E_TEST_EMAIL` and `E2E_TEST_PASSWORD` are required by the shared test fixture.
- The test user should already exist in Supabase, have a confirmed email, and have a completed player profile when a spec expects an authenticated dashboard flow.
- Some specs mock Supabase endpoints, but the app still needs enough env configuration to boot.

## Commands

```bash
npm run test:e2e
npm run test:e2e:ui
npm run test:e2e:report
```

## What The Suite Covers

- unauthenticated smoke flow
- auth form behavior
- onboarding flow
- dashboard behavior
- daily check-in behavior
- warm-up generation flow

## Artifacts

- HTML reports are written to `playwright-report/`
- Raw test artifacts are written to `test-results/`
- Auth storage state is written under `.auth/`

## Practical Guidance

- Run `npm run lint` and `npm run build` before E2E if you changed app code.
- Use `npm run test:e2e:ui` when debugging selectors or auth setup.
- If a Playwright run fails on auth or Supabase connectivity, verify `.env.test` first.
