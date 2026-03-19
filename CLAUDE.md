# CLAUDE.md

## Read This First

This repository is currently a small Vite + React starter, not a full production athlete app.

Start with these files, in order:

1. [package.json](/Users/ruben/conductor/workspaces/fittest.ai/dublin/package.json)
2. [src/App.tsx](/Users/ruben/conductor/workspaces/fittest.ai/dublin/src/App.tsx)
3. [src/main.tsx](/Users/ruben/conductor/workspaces/fittest.ai/dublin/src/main.tsx)
4. [vite.config.ts](/Users/ruben/conductor/workspaces/fittest.ai/dublin/vite.config.ts)
5. [components.json](/Users/ruben/conductor/workspaces/fittest.ai/dublin/components.json)
6. [src/index.css](/Users/ruben/conductor/workspaces/fittest.ai/dublin/src/index.css)
7. [docs/ARCHITECTURE.md](/Users/ruben/conductor/workspaces/fittest.ai/dublin/docs/ARCHITECTURE.md)
8. [docs/SETUP.md](/Users/ruben/conductor/workspaces/fittest.ai/dublin/docs/SETUP.md)

## Current Reality

- The app has one screen in [src/App.tsx](/Users/ruben/conductor/workspaces/fittest.ai/dublin/src/App.tsx).
- The UI uses React 19, TypeScript, Tailwind CSS, and shadcn-style primitives.
- The only shared UI primitive checked in is [src/components/ui/button.tsx](/Users/ruben/conductor/workspaces/fittest.ai/dublin/src/components/ui/button.tsx).
- Path alias `@/` resolves to `src` in [vite.config.ts](/Users/ruben/conductor/workspaces/fittest.ai/dublin/vite.config.ts).
- No environment variables are required by the current code.

## Not Present In This Checkout

Do not assume any of the following exist unless you add them yourself:

- Supabase client code
- Supabase Edge Functions
- auth flows
- athlete onboarding
- daily check-ins
- warm-up generation
- Playwright config
- automated test files
- `src/features/` modules

If older docs mention these, treat them as historical or aspirational, not implemented.

## Working Rules

- Trust code over docs when they conflict.
- Before making nontrivial changes, inspect the target files directly instead of inferring structure from older documentation.
- Keep changes aligned with the current minimal architecture unless the task explicitly expands scope.
- If you add new tooling, scripts, env vars, or runtime dependencies, update [README.md](/Users/ruben/conductor/workspaces/fittest.ai/dublin/README.md), [docs/SETUP.md](/Users/ruben/conductor/workspaces/fittest.ai/dublin/docs/SETUP.md), and [docs/ARCHITECTURE.md](/Users/ruben/conductor/workspaces/fittest.ai/dublin/docs/ARCHITECTURE.md) in the same change.

## Useful Local Context

- [.claude/commands/onboard.md](/Users/ruben/conductor/workspaces/fittest.ai/dublin/.claude/commands/onboard.md) describes the repo's expected onboarding workflow for Claude sessions.
- [.claude/commands/doc-sync.md](/Users/ruben/conductor/workspaces/fittest.ai/dublin/.claude/commands/doc-sync.md) captures the intended documentation-sync workflow.

Use those command files as helper context, not as a substitute for reading the actual code.
