# Architecture

This document describes the code that is actually present in this checkout.

## System Summary

The application is a single-page React app with one rendered screen and no backend integration.

Current runtime behavior:

- [src/main.tsx](/Users/ruben/conductor/workspaces/fittest.ai/dublin/src/main.tsx) mounts `App` inside `StrictMode`
- [src/App.tsx](/Users/ruben/conductor/workspaces/fittest.ai/dublin/src/App.tsx) renders a centered marketing-style placeholder view
- the only interaction is a button click that triggers a browser `alert`

There are no routes, feature modules, API calls, persisted state, or background jobs.

## Stack

- React 19
- TypeScript
- Vite configured through [vite.config.ts](/Users/ruben/conductor/workspaces/fittest.ai/dublin/vite.config.ts)
- `@vitejs/plugin-react`
- Tailwind CSS
- `tailwindcss-animate`
- shadcn/ui conventions configured in [components.json](/Users/ruben/conductor/workspaces/fittest.ai/dublin/components.json)
- Radix Slot, `class-variance-authority`, `clsx`, and `tailwind-merge` for UI primitives

## File-Level Architecture

### Entry

- [src/main.tsx](/Users/ruben/conductor/workspaces/fittest.ai/dublin/src/main.tsx) is the browser entry point.
- It imports [src/index.css](/Users/ruben/conductor/workspaces/fittest.ai/dublin/src/index.css) and renders `App`.

### App Shell

- [src/App.tsx](/Users/ruben/conductor/workspaces/fittest.ai/dublin/src/App.tsx) is the root UI.
- It imports [src/components/ui/button.tsx](/Users/ruben/conductor/workspaces/fittest.ai/dublin/src/components/ui/button.tsx).
- There is no router and no feature composition layer.

### Shared UI

- [src/components/ui/button.tsx](/Users/ruben/conductor/workspaces/fittest.ai/dublin/src/components/ui/button.tsx) is the only checked-in reusable UI primitive.
- It follows the standard shadcn pattern:
  - variant styling via `class-variance-authority`
  - optional `asChild` rendering via Radix Slot
  - class merging through [src/lib/utils.ts](/Users/ruben/conductor/workspaces/fittest.ai/dublin/src/lib/utils.ts)

### Styling

- [src/index.css](/Users/ruben/conductor/workspaces/fittest.ai/dublin/src/index.css) defines Tailwind layers and CSS custom properties for the theme tokens.
- [tailwind.config.js](/Users/ruben/conductor/workspaces/fittest.ai/dublin/tailwind.config.js) enables class-based dark mode and maps the tokenized color system.
- [src/App.css](/Users/ruben/conductor/workspaces/fittest.ai/dublin/src/App.css) exists, but the current app behavior is driven by Tailwind classes in `App.tsx`.

### Tooling

- [vite.config.ts](/Users/ruben/conductor/workspaces/fittest.ai/dublin/vite.config.ts) defines the React plugin and the `@/` alias to `src`.
- [eslint.config.js](/Users/ruben/conductor/workspaces/fittest.ai/dublin/eslint.config.js) uses the ESLint flat config format with TypeScript, React Hooks, and React Refresh rules.
- [components.json](/Users/ruben/conductor/workspaces/fittest.ai/dublin/components.json) records the shadcn configuration and aliases.

## Data And State

Current state model:

- no remote data fetching
- no local persistence
- no global client state
- no form state libraries in use

The only dynamic behavior in the UI is an inline click handler in [src/App.tsx](/Users/ruben/conductor/workspaces/fittest.ai/dublin/src/App.tsx).

## Environment And External Services

Current architecture has no external runtime dependencies beyond the browser bundle.

Not present in the app code:

- env var reads
- Supabase clients
- auth/session logic
- server functions
- analytics
- background jobs

Because there is no checked-in `.env.example`, env setup is intentionally empty at the moment.

## Testing And Quality Gates

Configured quality gates:

- `npm run lint`
- `npm run build`

Not configured:

- unit tests
- integration tests
- Playwright
- CI-specific test commands

## Repository Reality Versus Older Docs

Several older docs describe a larger product direction around training generation, athlete workflows, and Supabase. Those flows are not represented in the current source tree.

For implementation work, trust the code and these files first:

1. [package.json](/Users/ruben/conductor/workspaces/fittest.ai/dublin/package.json)
2. [src/App.tsx](/Users/ruben/conductor/workspaces/fittest.ai/dublin/src/App.tsx)
3. [src/main.tsx](/Users/ruben/conductor/workspaces/fittest.ai/dublin/src/main.tsx)
4. [vite.config.ts](/Users/ruben/conductor/workspaces/fittest.ai/dublin/vite.config.ts)
5. [components.json](/Users/ruben/conductor/workspaces/fittest.ai/dublin/components.json)

## Implications For Future Changes

Any work that adds the following will be introducing new architecture and should update the docs in the same change:

- routing
- feature folders
- auth
- Supabase integration
- environment variables
- automated tests
- server-side logic
