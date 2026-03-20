# Setup

This guide is for the app that exists today: Supabase auth, onboarding, daily check-ins, and warm-up generation.

## Prerequisites

- Node.js `20.19.0`
- npm `10+`
- `nvm`
- Access to a Supabase project with the expected schema and auth enabled

The repo pins Node in `.nvmrc` and declares the same engine range in `package.json`.

## Install Dependencies

```bash
nvm use
npm install
```

## Configure Frontend Environment

Create a local env file from the example:

```bash
cp .env.example .env
```

Required variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

The app throws on startup if either value is missing.

## Run The App

```bash
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

Expected high-level flow:

1. Unauthenticated users land on the login screen.
2. Authenticated users without a `player_profiles` row are sent into onboarding.
3. Authenticated users with a profile land on the dashboard.
4. Users who have not checked in today may see the daily check-in modal.

## Verification Commands

```bash
npm run lint
npm run build
```

For E2E setup and Playwright commands, see [TESTING.md](./TESTING.md).

## Supabase Notes

- Frontend setup details are in [SUPABASE.md](./SUPABASE.md).
- This repo includes generated database types and Edge Functions, but this guide does not assume a full local Supabase bootstrap workflow.

## Troubleshooting

If the app fails immediately on load:

- Verify `.env` contains `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Check that the Supabase project is reachable.
- Confirm the anon key belongs to the same project as the URL.

If auth works but the app hangs on loading:

- Check the browser console for Supabase errors.
- Verify the signed-in user can read from `profiles` and `player_profiles`.

If the dashboard never appears after sign-in:

- Confirm a `player_profiles` row exists for the authenticated user.
- If no profile exists, the app should send the user into onboarding instead.
