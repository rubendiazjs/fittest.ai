# GEMINI.md - Fittest.ai Project Context

## Project Overview
**Fittest.ai** is an AI-powered training platform specifically designed for padel players. It combines sports science with agentic AI to generate personalized training sessions based on athlete level, training phase, and specific goals.

- **Primary Goal:** Generate scientifically-backed, personalized padel training programs.
- **Secondary Goal:** Serve as a learning playground for AI-assisted development workflows (Founder Engineer transition).
- **Core Methodology:** Agentic development + "Vibe engineering", prioritizing rapid iteration and AI-first collaboration.

## Tech Stack
- **Frontend:** React 19, TypeScript, Vite
- **UI & Styling:** Tailwind CSS, shadcn/ui (Radix), Lucide React
- **State Management:** 
  - **Server State:** TanStack Query (v5)
  - **Client State:** Zustand, `useState`
- **Forms & Validation:** React Hook Form, Zod
- **AI Integration:** Claude (Anthropic API) for session generation
- **Backend (Planned):** Supabase (Auth, Database, Edge Functions)

## Building and Running
- **Development:** `npm run dev` (Starts Vite dev server)
- **Production Build:** `npm run build` (Runs `tsc` and Vite build)
- **Linting:** `npm run lint` (Runs ESLint)
- **Preview Build:** `npm run preview` (Local preview of production build)
- **Type Checking:** `npx tsc --noEmit`

## Development Conventions

### Project Structure
The codebase follows a **Feature-Based Organization** under `src/features/`. Each feature directory (e.g., `daily-checkin`, `player-onboarding`, `warmup-generation`) should typically contain:
- `api/`: Queries, mutations, and query keys.
- `components/`: Feature-specific UI components.
- `hooks/`: Custom hooks for feature logic.
- `types/`: TypeScript definitions.
- `utils/`: Helper functions specific to the feature.
- `index.ts`: Public API for the feature.

### Naming & Style
- **Components:** `PascalCase.tsx` (e.g., `SessionGenerator.tsx`)
- **Hooks:** `useCamelCase.ts` (e.g., `useSession.ts`)
- **Utilities:** `camelCase.ts`
- **Types:** `PascalCase.types.ts` or `index.ts` within a `types/` folder.
- **Constants:** `SCREAMING_SNAKE_CASE`
- **Import Aliases:** Use `@/` to refer to the `src/` directory.

### AI-First Workflow
- **Documentation as Code:** Always refer to `docs/training-context.md` for domain logic and `docs/ai-agent-context.md` for session generation rules.
- **Agentic Collaboration:** AI agents (like Gemini CLI) are treated as first-class partners. Prioritize explaining "why" and teaching concepts while building.
- **Iterative Shipping:** Follow the "Good enough > Perfect" mantra. Ship fast and iterate based on feedback.

## Key Context Files
- `docs/ARCHITECTURE.md`: Deep dive into technical decisions and system design.
- `docs/training-context.md`: Comprehensive sports science foundation for padel.
- `docs/ai-agent-context.md`: Specific rules and prompts for AI session generation.
- `.claude/LEARNING-GOALS.md`: Tracks the project owner's learning progress and focus areas.

## Domain-Specific Knowledge (Padel)
When generating or working on training logic:
- **Movement Patterns:** Focus on lateral movements, explosive directional changes, and short sprints.
- **Physical Capacities:** Power, agility, repeated sprint ability, and core stability are priorities.
- **Session Structure:** Warm-up (10-15m) → Main Block (40-60m, Tech/Speed first) → Cool-down (10-15m).
- **Safety:** Always include injury prevention for knees, ankles, and shoulders.

## Future Roadmap
- **Phase 2:** Persistence with Supabase (User profiles, history).
- **Phase 3:** Multi-sport expansion (Tennis, Squash).
- **Phase 4:** Advanced analytics and video libraries.
