# Architecture

This document describes the current implementation, not future roadmap work.

## System Summary

The app is a single-route React client backed by Supabase. It uses:

- Supabase Auth for email/password sign-in and sign-up
- TanStack Query for server-state reads and mutations
- Feature modules for auth, onboarding, daily check-ins, and warm-up generation
- Supabase Edge Functions for server-side actions such as warm-up generation and account deletion

## Runtime Flow

1. `App` creates a shared `QueryClient` and wraps the tree with `QueryClientProvider` and `AuthProvider`.
2. `AuthGate` waits for auth state, shows the login page for anonymous users, and shows the app for authenticated users.
3. `AppContent` loads the current player's profile.
4. If no profile exists, the user sees `OnboardingWizard`.
5. If a profile exists, the user sees `ProfileDashboard` and daily check-in UI.
6. Warm-up generation is triggered from the dashboard and calls the `generate-warmup` Edge Function.

## Frontend Structure

### App Shell

- `src/App.tsx` owns the top-level auth gate and high-level feature switching.
- There is no router today. The current app is a single authenticated flow.

### Feature Modules

- `src/features/auth/` handles auth context, login UI, and account deletion.
- `src/features/player-onboarding/` handles the questionnaire, scoring, and profile creation.
- `src/features/daily-checkin/` handles question selection, response submission, history, and streak UI.
- `src/features/warmup-generation/` handles warm-up generation, display, and guided progression.

### Shared UI And Utilities

- `src/components/ui/` contains reusable UI primitives.
- `src/lib/supabase.ts` creates the typed Supabase client.
- `src/lib/database.types.ts` is the generated database type source used across features.

## Data And Backend Boundaries

### Supabase Client

The frontend requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. The client is initialized once and reused across feature modules.

### Tables Touched By The Frontend

- `profiles` for role lookup
- `player_profiles` for onboarding and dashboard data
- `checkin_questions` for available daily questions
- `checkin_responses` for user responses and history
- `checkin_streaks` for streak state

### Edge Functions

- `generate-warmup` reads the authenticated user, loads the player profile plus recent check-ins, calls Anthropic, and returns structured warm-up data.
- `delete-account` deletes the authenticated auth user with a service-role client.

## Testing And Quality Gates

- `npm run lint`
- `npm run build`
- `npm run test:e2e`

The automated test suite is Playwright-based and lives under `tests/e2e/`. There is no unit-test runner configured in `package.json` today.

## Current Boundaries And Caveats

- The app already fetches `profiles.role`, but the main UI flow does not yet branch into separate coach/admin products.
- There is no client-side router yet.
- Planning docs under `docs/planning/` may describe future coach workflows that are not implemented in the current app shell.
