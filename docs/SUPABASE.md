# Supabase

## Frontend Environment

The frontend requires:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

These are defined in `.env.example` and used by `src/lib/supabase.ts`.

## Frontend Integration

The app uses a typed Supabase client shared across feature modules. Current frontend usage includes:

- email/password sign-in and sign-up
- auth session tracking through `AuthProvider`
- player profile reads and writes
- daily check-in reads and writes
- Edge Function invocation for warm-up generation and account deletion

## Current Auth Model

- Anonymous users see the login page.
- Authenticated users continue into onboarding or the player dashboard based on whether a `player_profiles` row exists.
- The auth layer also fetches `profiles.role`, but the current app shell does not yet branch into a separate coach/admin experience.

## Tables Referenced By The Frontend

- `profiles`
- `player_profiles`
- `checkin_questions`
- `checkin_responses`
- `checkin_streaks`

Generated types live in `src/lib/database.types.ts`.

## Edge Functions In This Repo

### `generate-warmup`

- Reads the authenticated user from the request
- Loads player profile data
- Loads recent check-in context
- Calls Anthropic to generate structured warm-up data
- Returns the warm-up payload to the client

Required server-side environment:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `ANTHROPIC_API_KEY`

### `delete-account`

- Reads the authenticated user from the request
- Uses a service-role client to delete the auth user

Required server-side environment:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## What This Doc Does Not Assume

- A local Supabase CLI workflow
- Checked-in migrations for bootstrapping the database from scratch
- A separate coach dashboard flow in the current app shell

For roadmap material around future auth and coach-role work, use `docs/planning/`.
