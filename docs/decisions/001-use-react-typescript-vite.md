# 001. Use React, TypeScript, and Vite for Frontend

**Status:** Accepted
**Date:** 2026-01-10
**Deciders:** Ruben Diaz
**Tags:** frontend, tooling, foundation

## Context

We need to choose a frontend technology stack for Fittest.ai, a training session generator for racket sports athletes. The stack needs to support:

- Rapid development and iteration (agentic development approach)
- AI-assisted coding (works well with Claude, Cursor, and MCP)
- Type safety to reduce errors
- Modern developer experience
- Fast build times for quick feedback loops
- Ability to integrate with AI APIs (Claude/Anthropic)
- Future extensibility (will add Supabase later)

This is a greenfield project with no existing technical constraints.

## Decision

We will use:
- **React 18** as the UI library
- **TypeScript** for type safety
- **Vite** as the build tool and dev server
- **shadcn/ui** for UI components (built on Radix + Tailwind CSS)
- **TanStack Query** for data fetching and server state
- **Zustand** for client state management
- **React Hook Form + Zod** for forms and validation

## Consequences

### Positive
- **Fast development**: Vite's HMR is instant, React is well-known, TypeScript catches errors early
- **AI-friendly**: Simple, predictable patterns that AI models understand well
- **Type safety**: TypeScript prevents entire classes of bugs
- **Great DX**: Hot reload, good error messages, excellent IDE support
- **Ecosystem**: Massive React ecosystem, tons of libraries and resources
- **Team familiarity**: React is widely known, easy to find help and contributors
- **Lightweight**: No heavy framework overhead, just the libraries we need
- **Composability**: Easy to add/remove pieces as we learn what we need

### Negative
- **Boilerplate**: React requires more setup than a full framework like Next.js
- **No SSR**: Client-side only initially (can add Next.js later if needed)
- **Bundle size**: Not optimized for tiny bundles (but okay for our use case)
- **State management choices**: Have to choose libraries (vs framework providing them)

### Neutral
- **No backend framework**: Using plain Vite, not Next.js - simpler but means we handle routing ourselves
- **Component library**: Using shadcn (copy-paste) vs traditional library (trade customization for initial setup)

## Alternatives Considered

### Alternative 1: Next.js + TypeScript
- **Pros**: 
  - Built-in routing, SSR, API routes
  - Optimized production builds
  - Great documentation
- **Cons**: 
  - More complex than needed for MVP
  - Heavier framework
  - SSR overhead when we don't need it initially
  - Less AI-friendly (more magic, more conventions)
- **Why not chosen**: Overkill for current needs. We're building a SPA, not a content site. Can migrate later if needed.

### Alternative 2: Vue 3 + TypeScript + Vite
- **Pros**: 
  - Simpler than React in some ways
  - Good TypeScript support
  - Composition API is elegant
- **Cons**: 
  - Smaller ecosystem than React
  - Less AI model training data
  - Team less familiar with Vue
  - Fewer third-party UI libraries
- **Why not chosen**: React's ecosystem and AI compatibility is stronger. Vue is great, but React is the safer choice for this project.

### Alternative 3: Svelte + SvelteKit
- **Pros**: 
  - Minimal boilerplate
  - Compiled (no runtime)
  - Very fast
  - Elegant syntax
- **Cons**: 
  - Smaller ecosystem
  - Less AI training data
  - Fewer component libraries
  - Steeper learning curve for contributors
- **Why not chosen**: Too cutting-edge for our needs. Want battle-tested tools. Svelte is amazing but React is more pragmatic here.

### Alternative 4: Plain JavaScript (No TypeScript)
- **Pros**: 
  - Faster initial setup
  - No compilation step
  - More flexible
- **Cons**: 
  - No type safety
  - More runtime errors
  - Worse IDE support
  - AI can't help as much without types
- **Why not chosen**: Type safety is non-negotiable. TypeScript catches too many bugs to skip it.

## Implementation Notes

- Using Vite's React-TypeScript template as starting point: `npm create vite@latest`
- Configured path aliases (`@/`) in `tsconfig.json` and `vite.config.ts`
- Tailwind CSS for styling (utility-first)
- shadcn/ui initialized with `npx shadcn-ui@latest init`
- All dependencies locked to specific versions to ensure reproducibility

### Key Configuration Files
- `vite.config.ts`: Build configuration, path aliases
- `tsconfig.json`: TypeScript strict mode enabled
- `tailwind.config.js`: Tailwind configuration
- `components.json`: shadcn configuration

## References

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Why Vite over CRA](https://vitejs.dev/guide/why.html)
- Research discussion: Internal conversation about stack choices (January 2026)

## Review Notes

This decision should be reviewed if:
- We need Server-Side Rendering (consider adding Next.js)
- Build times become problematic (unlikely with Vite)
- TypeScript compilation slows development significantly (very unlikely)
- We need native mobile apps (consider React Native or separate decision)

---

**Next ADR**: Will document choice of Supabase for backend when we implement Phase 2.
