# Fittest.ai

Fittest.ai is a React + Supabase app for padel players. The current product includes:

- Email/password auth with Supabase Auth
- Player onboarding and profile creation
- A player dashboard
- Daily check-ins with streak/history UI
- AI-assisted warm-up generation through a Supabase Edge Function

## Quick Start

```bash
nvm use
npm install
cp .env.example .env
npm run dev
```

The app requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to start. See [docs/SETUP.md](docs/SETUP.md) for local setup and [docs/SUPABASE.md](docs/SUPABASE.md) for the integration details.

## Core Docs

- [docs/SETUP.md](docs/SETUP.md) for local setup and environment files
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the current system shape
- [docs/SUPABASE.md](docs/SUPABASE.md) for auth, tables, and Edge Functions
- [docs/TESTING.md](docs/TESTING.md) for lint, build, and Playwright usage
- [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for development norms

Planning and templates live under `docs/planning/`, `docs/process/`, and `docs/templates/`. Treat those as non-source-of-truth unless a doc explicitly says otherwise.

## Stack

- React 19
- TypeScript 5
- Vite via `rolldown-vite`
- TanStack Query
- Supabase JS
- Tailwind CSS and shadcn/ui-style primitives
- Playwright for end-to-end tests

## Project Layout

```text
.
├── src/
│   ├── App.tsx
│   ├── components/ui/
│   ├── features/
│   │   ├── auth/
│   │   ├── player-onboarding/
│   │   ├── daily-checkin/
│   │   └── warmup-generation/
│   └── lib/
├── supabase/
│   └── functions/
├── tests/
│   └── e2e/
└── docs/
    ├── SETUP.md
    ├── ARCHITECTURE.md
    ├── SUPABASE.md
    ├── TESTING.md
    ├── planning/
    ├── process/
    └── templates/
```

## Scripts

- `npm run dev` starts the Vite dev server
- `npm run build` runs `tsc -b` and builds for production
- `npm run lint` runs ESLint
- `npm run preview` serves the production build locally
- `npm run test:e2e` runs the Playwright suite
- `npm run test:e2e:ui` opens Playwright UI mode
- `npm run test:e2e:report` opens the last Playwright report

## Source Of Truth

When docs and code disagree, trust these first:

1. `package.json`
2. `.nvmrc`
3. `.env.example`
4. `src/App.tsx`
5. `src/lib/supabase.ts`
6. `playwright.config.ts`
7. `supabase/functions/*`

The docs in `docs/` should summarize that reality, not replace it.
