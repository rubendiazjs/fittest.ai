# Setup

This guide reflects the current repository state. It does not assume Supabase, auth, Playwright, or feature modules because those are not present in this checkout.

## Prerequisites

- Node.js `20.19+` or `22.12+`
- npm installed locally
- Git

The repo does not declare `engines` in [package.json](/Users/ruben/conductor/workspaces/fittest.ai/dublin/package.json), but the installed Vite and ESLint toolchain currently requires a newer Node runtime. In this workspace, Node `16.20.2` produced engine warnings and failed both `npm run lint` and `npm run build`.

## Install

```bash
npm install
```

## Run The App

```bash
npm run dev
```

Open the local URL printed by Vite. On a typical machine this is `http://localhost:5173`.

What you should see:

- a centered `Fittest.ai` title
- the subtitle `Your agentic development playground`
- a `Click Me` button
- a browser alert when the button is pressed

The UI is defined in [src/App.tsx](/Users/ruben/conductor/workspaces/fittest.ai/dublin/src/App.tsx).

## Available Scripts

From [package.json](/Users/ruben/conductor/workspaces/fittest.ai/dublin/package.json):

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

What each script does:

- `dev`: starts the Vite dev server
- `build`: runs `tsc -b` and creates a production build
- `lint`: runs ESLint against the project
- `preview`: serves the production build locally

There is no checked-in script for tests, Playwright, Supabase CLI, or standalone type-checking.

## Environment Variables

There is no checked-in `.env.example`.

The current codebase does not reference:

- `import.meta.env`
- `process.env`
- any Supabase keys or URLs

Current setup requirement: no environment variables are needed.

## Auth And Supabase

The current repo does not include:

- Supabase client initialization
- auth providers or session management
- database migrations
- `supabase/functions`

If you need any of those, you will be introducing new architecture, not wiring up existing code.

## Testing Reality

The current repo does not include:

- `playwright.config.ts`
- a `tests/` directory
- Vitest, Jest, or React Testing Library dependencies

Current verification options are:

- `npm run lint`
- `npm run build`
- manual browser testing via `npm run dev`

## Recommended First Read

Before changing code, read:

1. [package.json](/Users/ruben/conductor/workspaces/fittest.ai/dublin/package.json)
2. [src/App.tsx](/Users/ruben/conductor/workspaces/fittest.ai/dublin/src/App.tsx)
3. [src/main.tsx](/Users/ruben/conductor/workspaces/fittest.ai/dublin/src/main.tsx)
4. [vite.config.ts](/Users/ruben/conductor/workspaces/fittest.ai/dublin/vite.config.ts)
5. [components.json](/Users/ruben/conductor/workspaces/fittest.ai/dublin/components.json)
6. [CLAUDE.md](/Users/ruben/conductor/workspaces/fittest.ai/dublin/CLAUDE.md)

## Troubleshooting

If `npm install` fails:

- make sure Node and npm are installed and on your `PATH`
- remove `node_modules` and retry if a previous install was interrupted
- upgrade Node to `20.19+` or `22.12+` if you see Vite or ESLint engine/runtime errors

If `npm run dev` starts but the page is blank:

- inspect the browser console
- verify [src/main.tsx](/Users/ruben/conductor/workspaces/fittest.ai/dublin/src/main.tsx) still mounts `App`
- verify [src/App.tsx](/Users/ruben/conductor/workspaces/fittest.ai/dublin/src/App.tsx) still exports a default component
