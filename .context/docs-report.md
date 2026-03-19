# Docs Sync Report

## Which docs were stale

- `README.md` described a padel training-session generator, Anthropic integration, TanStack Query, Zustand, React Hook Form, Zod, and a feature-based app structure that are not present in this checkout.
- `docs/SETUP.md` assumed future Supabase, MCP, extra scripts, a fixed local port, and a broader app structure that do not match the current repo.
- `docs/ARCHITECTURE.md` documented a layered app with feature modules, server-state tooling, forms, AI integration, and future Supabase plans as if they were part of the active codebase.
- `CLAUDE.md` did not exist, so there was no current repo-level onboarding note for AI agents.

## What changed

- Rewrote `README.md` to describe the actual app: a minimal Vite + React screen with one shadcn button and no backend or test setup.
- Rewrote `docs/SETUP.md` to cover the real install flow, available scripts, zero env-var requirements, and the absence of Supabase/auth/test infrastructure.
- Added the observed Node runtime constraint to `docs/SETUP.md` after verifying that the current toolchain fails on Node `16.20.2`.
- Rewrote `docs/ARCHITECTURE.md` to document the present file-level architecture, styling/tooling setup, and current limitations.
- Added `CLAUDE.md` with a concrete read-first order for coding agents and explicit warnings about missing Supabase/auth/feature/test code.

## Unresolved ambiguities

- The task brief describes a much larger app with Supabase auth, onboarding, daily check-ins, warm-up generation, Edge Functions, and Playwright tests, but none of those files or directories exist in this checkout.
- Older docs such as `docs/ai-agent-context.md` and `docs/training-context.md` still reflect that larger product direction and may remain misleading until they are either removed, rewritten, or clearly marked as archival.
