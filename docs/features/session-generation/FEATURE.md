# Feature: AI Pre-Match Warm-Up Generation

**Status:** Planning
**Priority:** High
**Estimated Effort:** M
**Started:** 2026-01-11
**Target Completion:** TBD

---

## Problem Statement

Después de completar el onboarding, el usuario necesita ver valor inmediato de la plataforma. Queremos generar un calentamiento pre-partido personalizado basado en su perfil para que experimente cómo Fittest.ai les ayudará antes de cada partido.

---

## User Stories

### Story 1: Generar Primer Calentamiento
**As a** nuevo usuario que acaba de completar el onboarding
**I want** recibir un calentamiento pre-partido personalizado
**So that** pueda entender cómo la plataforma me ayudará y usarlo antes de mi próximo partido

**Acceptance Criteria:**
- [ ] Al completar onboarding, se genera automáticamente un calentamiento
- [ ] El calentamiento está personalizado según nivel y condición física del perfil
- [ ] El usuario ve un estado de carga mientras se genera
- [ ] El calentamiento se muestra con ejercicios claros y tiempos
- [ ] El calentamiento se guarda en la base de datos
- [ ] El usuario puede volver a ver el calentamiento guardado

---

## Technical Approach

### Architecture Decision: Supabase Edge Function

**Why Edge Function:**
- API key stays secure on server
- Serverless, scales automatically
- Learning opportunity (from LEARNING-GOALS.md)
- Native Supabase integration

**Flow:**
```
User clicks "Empezar"
    → Save profile (existing)
    → Call Edge Function `/generate-warmup`
    → Edge Function calls Claude API
    → Returns structured warm-up JSON
    → Save warm-up to `warmup_sessions` table
    → Display to user
```

### Data Model

**New table: `warmup_sessions`**

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | PK |
| user_id | uuid | FK to auth.users |
| player_profile_id | uuid | FK to player_profiles |
| title | text | "Calentamiento Pre-Partido" |
| duration_minutes | int | Total duration (10-15 min) |
| exercises | jsonb | Array of exercises with details |
| generated_at | timestamptz | When it was generated |
| context | jsonb | Player context used for generation |

**Exercise structure (in `exercises` jsonb):**
```typescript
interface WarmUpExercise {
  name: string
  description: string
  duration_seconds: number
  sets?: number
  reps?: number
  notes?: string
  category: 'activation' | 'mobility' | 'dynamic_stretch' | 'neuromuscular'
}
```

**Warm-up metadata:**
```typescript
interface WarmUpSession {
  // ... existing fields

  // NEW: Post warm-up guidance
  expected_sensations: string[]     // What user should feel after warm-up
  match_benefits: string            // How this helps in the match
  feedback_prompt: string           // Prompt to remember sensations during match

  // NEW: User feedback (filled after match)
  user_feedback?: {
    sensations_felt: string[]       // What they actually felt
    match_performance_notes: string // How it affected their game
    rating: number                  // 1-5 stars
    submitted_at: string
  }
}
```

### User Feedback Loop

**Why this matters:**
- Creates engagement beyond the warm-up itself
- Collects data for improving future recommendations
- Builds user awareness of their body/performance connection
- Establishes habit of mindful training

**Flow:**
1. User completes warm-up → sees "What you should feel" section
2. "Remember these sensations during your match" prompt
3. After match → notification/prompt to share feedback
4. Feedback stored → used for future personalization

### Edge Function Design

**Endpoint:** `POST /functions/v1/generate-warmup`

**Input:**
```typescript
{
  player_profile_id: string
  // Profile data fetched server-side for security
}
```

**Output:**
```typescript
{
  title: string
  duration_minutes: number
  exercises: WarmUpExercise[]
  coaching_notes: string
}
```

**Prompt Strategy:**
- Use context from `docs/ai-agent-context.md`
- Include player profile data (level, fitness, injuries)
- Request structured JSON output
- Focus on 10-15 minute pre-match routine

### Components Needed

- **WarmUpLoading**: Loading state while generating
- **WarmUpDisplay**: Shows the generated warm-up
- **ExerciseCard**: Individual exercise display

### State Management

- TanStack Query mutation for generation
- Query for fetching saved warm-ups
- Loading/error/success states

---

## UI/UX Design

### Flow
1. User on ResultStep clicks "Empezar a entrenar"
2. Profile saves → Loading state appears
3. "Generando tu calentamiento personalizado..." with spinner
4. Warm-up appears with exercises listed
5. Button to "Guardar y continuar" or "Regenerar"

### Warm-Up Display Layout
```
┌─────────────────────────────────────┐
│  🔥 Tu Calentamiento Pre-Partido    │
│  Duración: 12 minutos               │
├─────────────────────────────────────┤
│  1. Trote suave (2 min)             │
│     Activación cardiovascular...     │
├─────────────────────────────────────┤
│  2. Círculos de brazos (1 min)      │
│     Movilidad de hombros...          │
├─────────────────────────────────────┤
│  ... more exercises ...              │
├─────────────────────────────────────┤
│  ✨ Qué deberías sentir al terminar │
│  • Ligero aumento del ritmo cardíaco│
│  • Articulaciones móviles y sueltas │
│  • Músculos activados, listos       │
├─────────────────────────────────────┤
│  🎾 Cómo te ayudará en el partido   │
│  "Con este calentamiento, tus       │
│   primeros pasos serán más          │
│   explosivos y reducirás el riesgo  │
│   de lesiones..."                   │
├─────────────────────────────────────┤
│  📝 Durante tu partido              │
│  "Intenta recordar cómo te sientes  │
│   en los primeros games. ¿Notas     │
│   diferencia en tu reacción?        │
│   Después del partido, cuéntanos."  │
├─────────────────────────────────────┤
│  💡 Notas del Coach                 │
│  "Enfócate en..."                   │
└─────────────────────────────────────┘
│  [Regenerar]      [Empezar partido] │
└─────────────────────────────────────┘
```

### Post-Match Feedback Screen (Future)
```
┌─────────────────────────────────────┐
│  🎾 ¿Cómo fue tu partido?           │
├─────────────────────────────────────┤
│  ¿Sentiste estas sensaciones?       │
│  [x] Ritmo cardíaco elevado         │
│  [x] Articulaciones sueltas         │
│  [ ] Músculos listos                │
├─────────────────────────────────────┤
│  ¿Cómo afectó a tu juego?           │
│  [                               ]  │
│  [         textarea              ]  │
├─────────────────────────────────────┤
│  Valoración del calentamiento       │
│  ⭐⭐⭐⭐☆                           │
└─────────────────────────────────────┘
│              [Enviar feedback]      │
└─────────────────────────────────────┘
```

---

## Implementation Plan

### Phase 1: Database Schema
- [ ] Create `warmup_sessions` table
- [ ] Add RLS policies
- [ ] Generate TypeScript types

### Phase 2: Edge Function
- [ ] Create `generate-warmup` Edge Function
- [ ] Set up Claude API integration
- [ ] Design and test prompt
- [ ] Return structured JSON

### Phase 3: Frontend Integration
- [ ] Create API mutation hook
- [ ] Build WarmUpDisplay component
- [ ] Integrate into onboarding flow
- [ ] Handle loading/error states

### Phase 4: Polish
- [ ] Add regenerate functionality
- [ ] Improve exercise display
- [ ] Add animations

---

## Dependencies

### External
- [ ] Claude API key (Anthropic)
- [ ] Supabase Edge Functions enabled

### Internal
- [x] Player onboarding complete
- [x] Player profile saved to database
- [x] Supabase client configured

---

## Learning Opportunities

From LEARNING-GOALS.md, this feature covers:

1. **AI Agent Development**
   - Prompt engineering for structured output
   - AI-generated content handling

2. **Full-Stack Founder Skills**
   - Edge Functions (first time!)
   - End-to-end feature ownership

3. **Vibe Engineering**
   - Iterating on prompts
   - AI content quality evaluation

---

## Open Questions

- [ ] How to handle Claude API errors gracefully?
- [ ] Should we add rate limiting on the Edge Function?
- [ ] What's the fallback if generation fails?

---

## Risk Assessment

**Risk 1: Claude API response quality**
- Likelihood: Medium
- Mitigation: Well-crafted prompt with examples, JSON mode

**Risk 2: Edge Function cold starts**
- Likelihood: Low
- Mitigation: Show loading state, acceptable for MVP

**Risk 3: Cost of API calls**
- Likelihood: Low (one call per user onboarding)
- Mitigation: Monitor usage, add rate limiting if needed

---

**Last Updated:** 2026-01-11
