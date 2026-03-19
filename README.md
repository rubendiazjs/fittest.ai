# Fittest.ai

This checkout is currently a minimal Vite + React frontend starter, not a full athlete product.

The live app renders a single centered screen from [src/App.tsx](/Users/ruben/conductor/workspaces/fittest.ai/dublin/src/App.tsx) with:

- the `Fittest.ai` heading
- the subtitle `Your agentic development playground`
- one shadcn `Button` that triggers `alert('Hello from shadcn!')`

There is no routing, no API integration, no persisted state, no forms, no auth flow, no Supabase client, and no test suite in the current repository state.

## Source Of Truth

When docs and code disagree, trust the code in this order:

1. [package.json](/Users/ruben/conductor/workspaces/fittest.ai/dublin/package.json)
2. [src/App.tsx](/Users/ruben/conductor/workspaces/fittest.ai/dublin/src/App.tsx)
3. [src/main.tsx](/Users/ruben/conductor/workspaces/fittest.ai/dublin/src/main.tsx)
4. [vite.config.ts](/Users/ruben/conductor/workspaces/fittest.ai/dublin/vite.config.ts)
5. [components.json](/Users/ruben/conductor/workspaces/fittest.ai/dublin/components.json)
6. [.nvmrc](/Users/ruben/conductor/workspaces/fittest.ai/dublin/.nvmrc)
7. [docs/SETUP.md](/Users/ruben/conductor/workspaces/fittest.ai/dublin/docs/SETUP.md)
8. [docs/ARCHITECTURE.md](/Users/ruben/conductor/workspaces/fittest.ai/dublin/docs/ARCHITECTURE.md)

Some docs under `docs/`, including feature-planning material, still describe a broader training-product direction. Treat those as planning or historical context unless they are brought back in sync with the code.

## Stack

- React 19
- TypeScript 5
- Vite via `rolldown-vite`
- Tailwind CSS
- shadcn/ui conventions with Radix Slot
- ESLint flat config

## Project Layout

```text
.
├── src/
│   ├── App.tsx                # Current single-screen UI
│   ├── main.tsx               # React entry point
│   ├── components/ui/         # shadcn-style UI primitives
│   ├── lib/utils.ts           # `cn()` helper
│   ├── App.css
│   └── index.css              # Tailwind layers and CSS variables
├── docs/
│   ├── SETUP.md
│   └── ARCHITECTURE.md
├── .claude/commands/          # Local Claude prompt helpers
├── components.json            # shadcn aliases/config
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

## Scripts

From [package.json](/Users/ruben/conductor/workspaces/fittest.ai/dublin/package.json):

- `npm run dev` starts the Vite dev server
- `npm run build` runs `tsc -b` and builds for production
- `npm run lint` runs ESLint
- `npm run preview` serves the production build locally

No `test`, `type-check`, `playwright`, `supabase`, or codegen scripts are defined.

## Environment Variables

There is no checked-in `.env.example`, and the app code does not read from `import.meta.env` or `process.env`.

Current requirement: no environment variables are needed to run the app.

## Auth, Supabase, And Backend Reality

The current app does not include:

- Supabase client setup
- Supabase Edge Functions
- authentication screens or session handling
- athlete onboarding flows
- daily check-ins
- warm-up generation

If those features exist elsewhere, they are not present in this checkout and should not be documented as implemented.

## Testing Reality

There is no Playwright config, no `tests/` directory, and no frontend test runner configured in `package.json`.

Current testing posture: manual verification in the browser plus `npm run build` and `npm run lint`.

## Getting Started

The repo now pins Node `20.19.0` in [.nvmrc](/Users/ruben/conductor/workspaces/fittest.ai/dublin/.nvmrc), and [package.json](/Users/ruben/conductor/workspaces/fittest.ai/dublin/package.json) requires Node `^20.19.0 || >=22.12.0` with npm `10+`. In this workspace, `npm run build` and `npm run lint` failed on Node `16.20.2`, so use a supported runtime before starting.

```bash
# Clone the repository
git clone https://github.com/rubendiazjs/fittest.ai.git
cd fittest.ai

# Use the repo-pinned Node version
nvm use

# Install dependencies
npm install
npm run dev
```

Vite will print the local URL it chose, usually `http://localhost:5173`.

## For AI Agents

Read [CLAUDE.md](/Users/ruben/conductor/workspaces/fittest.ai/dublin/CLAUDE.md) first. It summarizes what exists, what does not, and which files to inspect before making changes.
