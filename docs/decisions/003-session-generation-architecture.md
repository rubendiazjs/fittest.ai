# ADR 003: Session Generation Architecture

## Status
Accepted

## Context
Fittest.ai currently generates warmups via the `generate-warmup` Edge Function. The AI Session Planner feature needs to generate full training sessions (warmup + main + cooldown). We need to decide how to architect the generation capability.

Three options considered:
1. **Extend `generate-warmup`** to accept a `mode` parameter (`warmup` vs `full_session`)
2. **Create a new `generate-session` Edge Function** alongside `generate-warmup`
3. **Create a shared generation service** that both warmup and session call into

## Decision
We will create a **separate `generate-session` Edge Function** (option 2).

## Rationale

### Why not extend `generate-warmup`?
- The system prompts are fundamentally different. Warmup uses the RAMP framework (Raise → Activate → Mobilise → Potentiate → Sport-specific). Sessions use a 3-block structure (Calentamiento → Parte Principal → Vuelta a la Calma) with periodization-aware exercise selection.
- The output JSON schemas are different — warmup has `phases[]` with drill arrays; sessions have `blocks[]` with different metadata (session objective, periodization phase, equipment).
- The input context is different — warmup is personalized to a single athlete's check-in data; sessions are parameterized by the coach (objective, duration, phase, level).
- Adding a `mode` flag would create branching complexity in a 400-line function that's already doing one thing well.

### Why not a shared service?
- Premature abstraction. The two functions share some infrastructure patterns (CORS, auth, Anthropic client setup) but their core logic (prompt construction, context building, output parsing) is different enough that a shared abstraction would be more complex than duplication.
- With only 2 generation functions, the DRY violation is minimal and the independence is valuable for iteration speed.
- If/when we add a third generation type (e.g., periodization planner, exercise recommendation), we can extract shared utilities then.

### Why a separate function?
- **Single Responsibility:** Each function does one thing clearly.
- **Independent iteration:** We can change the session prompt without risk of breaking warmup generation.
- **Independent deployment:** Bug fix in one doesn't require re-deploying the other.
- **Clearer testing:** Each function can be tested with its own set of inputs/outputs.
- **Copy-paste-adapt:** The infrastructure boilerplate (CORS, auth, Anthropic client) is small and stable — copying it is faster than abstracting it.

## Consequences

### Positive
- Clear separation of concerns between warmup and session generation
- Each function can evolve independently
- Simple mental model: one function = one AI capability

### Negative
- Some code duplication in boilerplate (CORS headers, auth check, Anthropic client init) — approximately 50 lines shared between the two functions
- Two system prompts to maintain instead of one
- New Supabase Edge Function deployment needed

### Future path
If we add 3+ generation functions, consider extracting:
- `lib/anthropic-client.ts` — shared Anthropic initialization
- `lib/edge-auth.ts` — shared auth + CORS boilerplate
- Keep system prompts and context builders separate per function
