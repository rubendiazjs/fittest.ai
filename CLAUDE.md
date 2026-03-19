# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fittest.ai is an AI-powered training platform for padel players. It generates personalized training sessions using Claude Sonnet 4.5 via Supabase Edge Functions. The domain context (sports science, padel-specific movement patterns, periodization) lives in `docs/training-context.md` and `docs/ai-agent-context.md` — read these before working on session generation logic.

## Commands

```bash
npm run dev          # Start Vite dev server (localhost:5173)
npm run build        # TypeScript type-check + Vite production build
npm run lint         # ESLint
npm run preview      # Preview production build
npm run test:e2e     # Playwright end-to-end tests
```

## Tech Stack

- **Frontend**: React 19 + TypeScript (strict mode) + Vite (rolldown-vite)
- **UI**: shadcn/ui (Radix primitives) + Tailwind CSS + Lucide icons
- **Server state**: TanStack Query v5 (no Redux, no Context for data)
- **Client state**: Zustand (when needed)
- **Forms**: React Hook Form + Zod v4
- **Backend**: Supabase (Postgres + Auth + Edge Functions + RLS)
- **AI**: Claude Sonnet 4.5 called from Supabase Edge Functions (Deno)
- **MCP**: Supabase MCP server configured in `.mcp.json`

## Architecture

### Feature-based organization

All feature code lives in `src/features/<feature-name>/` with this internal structure:

```
src/features/<feature-name>/
├── components/    # React components
├── hooks/         # Custom hooks (business logic + TanStack Query wrappers)
├── api/           # Supabase query/mutation functions + TanStack Query key factories
│   ├── queries.ts
│   ├── mutations.ts
│   └── keys.ts
├── types/         # Feature-specific TypeScript types
├── utils/         # Helper functions
└── index.ts       # Public API exports
```

Current features: `player-onboarding`, `daily-checkin`, `warmup-generation`

### Data flow

Components → custom hooks → TanStack Query → Supabase API functions → Supabase client (`src/lib/supabase.ts`)

The Supabase client is a typed singleton using generated types from `src/lib/database.types.ts`.

### Shared code

- `src/components/ui/` — shadcn/ui components (Button, Card, Checkbox, Progress, RadioGroup)
- `src/lib/utils.ts` — `cn()` classname utility
- `src/lib/supabase.ts` — typed Supabase client singleton
- `src/lib/database.types.ts` — auto-generated from Supabase schema

### Edge Functions

Supabase Edge Functions live in `supabase/functions/`. The `generate-warmup` function calls Claude API with player profile + check-in context, returns structured JSON warm-up sessions. These run on Deno, not Node.

### App entry point

`src/App.tsx` checks for an existing player profile. No profile → shows `OnboardingWizard`. Has profile → shows dashboard with daily check-in modal, check-in history, streak indicator, and warm-up generation.

## Path Alias

`@/` maps to `./src` (configured in both `vite.config.ts` and `tsconfig.app.json`).

```typescript
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
```

## Environment Variables

Vite-prefixed (`VITE_`) for browser exposure. See `.env.example`:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Conventions

- **Commits**: Conventional Commits format — `feat(scope):`, `fix(scope):`, `docs(scope):`, etc.
- **Branches**: `feature/`, `fix/`, `docs/`, `refactor/`, `test/`
- **Components**: PascalCase files (`OnboardingWizard.tsx`)
- **Hooks**: camelCase with `use` prefix (`usePlayerProfile.ts`)
- **Constants**: SCREAMING_SNAKE_CASE
- **Styling**: Tailwind utility classes only, no custom CSS files
- **Types**: Avoid `any`, use `unknown` if type is truly unknown
- **Feature workflow**: Define in `docs/features/<name>/FEATURE.md` before building

## Domain Context

The training domain is padel (racquet sport). Key references:
- `docs/training-context.md` — Sports science fundamentals, movement patterns, periodization (in Spanish)
- `docs/ai-agent-context.md` — Rules for AI-generated sessions (RAMP framework, RPE scaling)
- Warm-up prompts use the `supabase/functions/generate-warmup/` Edge Function which builds context from player profile + recent check-in data
