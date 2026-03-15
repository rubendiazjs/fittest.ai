# Feature: AI Session Planner

## Metadata

| Campo | Valor |
|-------|-------|
| **Status** | Planning |
| **Prioridad** | High |
| **Esfuerzo estimado** | M |
| **Assignee** | — |
| **Fecha inicio** | 2026-03-15 |
| **Target completado** | 2026-03-22 |
| **Research asociada** | `docs/research/coach-investigation/` |

---

## Problema

Los coaches de pádel **improvisan sesiones sin objetivos claros**, repiten ejercicios, y sus alumnos lo notan — generando churn. No existe ninguna herramienta digital de planificación de sesiones específica para pádel. Los coaches planifican en su cabeza, en papel, o construyen hojas de cálculo artesanales que les consumen 10-20 horas.

Fittest.ai ya genera calentamientos personalizados con IA (`generate-warmup`), pero el valor real para un coach es planificar la **sesión completa**: calentamiento + parte principal + vuelta a la calma. Extender el motor existente a sesiones completas es el paso natural y el mayor diferenciador competitivo — ningún competidor analizado (15 plataformas) ofrece generación de sesiones con IA específica para pádel.

**Evidencia:** Dolor #1 en la investigación de coach pain points (5/5 fuentes independientes). Ver [COACH-INVESTIGATION.md](../../research/coach-investigation/COACH-INVESTIGATION.md) y [PAIN-THEMES.md](../../research/coach-investigation/PAIN-THEMES.md).

---

## User Stories

### Story 1: Generar sesión completa con IA

**As a** coach de pádel que prepara las clases de la semana
**I want** generar una sesión de entrenamiento completa seleccionando perfil de atleta/grupo, objetivo, duración, y fase de entrenamiento
**So that** pueda tener sesiones estructuradas con calentamiento, parte principal, y vuelta a la calma sin improvisar

**Acceptance Criteria:**
- [ ] El coach puede seleccionar: objetivo de sesión, duración (60/75/90 min), fase de periodización, nivel del grupo, equipamiento disponible
- [ ] La IA genera una sesión con 3 bloques: calentamiento, parte principal, vuelta a la calma
- [ ] Cada ejercicio incluye: nombre, duración/reps, intensidad RPE, coaching cues, y objetivo
- [ ] La sesión generada se muestra en pantalla con los bloques colapsables
- [ ] El tiempo total de los ejercicios es coherente con la duración seleccionada
- [ ] La respuesta de la IA se genera en menos de 15 segundos

### Story 2: Guardar sesión generada

**As a** coach que acaba de generar una sesión que le gusta
**I want** guardarla en mi biblioteca personal
**So that** pueda reutilizarla en el futuro sin tener que regenerarla

**Acceptance Criteria:**
- [ ] Después de generar, hay un botón "Guardar sesión"
- [ ] Al guardar, el coach puede darle un título personalizado (pre-rellenado con el título generado)
- [ ] La sesión se guarda en la tabla `training_sessions` asociada al coach
- [ ] Las sesiones guardadas aparecen en la lista "Mis Sesiones"

### Story 3: Ver historial de sesiones

**As a** coach que ha generado varias sesiones
**I want** ver un listado de mis sesiones guardadas con filtros básicos
**So that** pueda encontrar y reutilizar sesiones anteriores

**Acceptance Criteria:**
- [ ] Lista de sesiones guardadas ordenadas por fecha (más recientes primero)
- [ ] Cada item muestra: título, fecha, duración, objetivo, fase
- [ ] Tapping una sesión muestra el detalle completo
- [ ] Se puede eliminar una sesión guardada

### Story 4: Regenerar sesión

**As a** coach que no está satisfecho con la sesión generada
**I want** regenerar con los mismos parámetros o ajustar alguno
**So that** pueda obtener una alternativa sin reconfigurar todo desde cero

**Acceptance Criteria:**
- [ ] Hay un botón "Regenerar" que mantiene los parámetros actuales
- [ ] El coach puede modificar parámetros antes de regenerar
- [ ] La nueva generación reemplaza la vista actual (la anterior no se guarda automáticamente)

---

## Requisitos

### P0 — Must Have

1. **Formulario de generación** — Campos: objetivo de sesión (dropdown), duración (60/75/90 min), fase de periodización (dropdown de las 5 fases), nivel (beginner/intermediate/advanced/competitive), notas adicionales (texto libre)
2. **Edge Function `generate-session`** — Nueva función que extiende el patrón de `generate-warmup` para sesiones completas con 3 bloques
3. **Vista de sesión generada** — Muestra la sesión estructurada en bloques colapsables con ejercicios, duración, intensidad, y coaching cues
4. **Guardar sesión** — Persistir en `training_sessions` con título, parámetros de generación, y contenido
5. **Lista de sesiones guardadas** — Vista "Mis Sesiones" con listado y acceso a detalle
6. **Regenerar** — Botón para regenerar manteniendo parámetros

### P1 — Nice to Have

1. **Integración con check-in data** — Si el coach tiene atletas vinculados (roster), poder seleccionar un atleta y que la sesión se adapte a su estado actual (como ya hace `generate-warmup`)
2. **Edición de sesión** — Editar ejercicios individuales después de la generación (reordenar, eliminar, modificar)
3. **Tags/categorías** — Etiquetar sesiones para filtrado (e.g., "pre-temporada", "táctica red", "rehabilitación")
4. **Duplicar sesión** — Crear copia de una sesión guardada para modificarla

### P2 — Futuro

1. **Plantillas compartibles** — Compartir sesiones entre coaches de la misma organización (requiere Feature #3: Shared Session Library)
2. **Calendario de sesiones** — Planificar qué sesión va en qué día de la semana
3. **Progresión automática** — La IA sugiere cómo progresar la sesión semana a semana según la fase de periodización
4. **Export PDF** — Exportar sesión para llevarla impresa a la pista

---

## Diseño técnico

### Approach de alto nivel

```
┌──────────────────────┐     ┌──────────────────────┐     ┌─────────────────────┐
│   Session Form       │────▶│  generate-session     │────▶│  Session View       │
│   (React + Zod)      │     │  (Edge Function)      │     │  (Collapsible       │
│                      │     │                       │     │   blocks)           │
│  - Objetivo          │     │  - System prompt      │     │                     │
│  - Duración          │     │    (entrenamiento)    │     │  [Guardar]          │
│  - Fase              │     │  - Claude Sonnet 4.5  │     │  [Regenerar]        │
│  - Nivel             │     │  - JSON output        │     │                     │
│  - Notas             │     │                       │     │                     │
└──────────────────────┘     └──────────────────────┘     └─────────────────────┘
                                                                    │
                                                                    ▼
                                                          ┌─────────────────────┐
                                                          │  Mis Sesiones       │
                                                          │  (Lista + Detalle)  │
                                                          └─────────────────────┘
```

### Componentes necesarios

| Componente | Ubicación | Descripción |
|------------|-----------|-------------|
| `SessionGeneratorForm` | `src/features/session-planner/components/` | Formulario con select de objetivo, duración, fase, nivel, y textarea de notas |
| `SessionView` | `src/features/session-planner/components/` | Vista de sesión generada con bloques colapsables |
| `SessionBlock` | `src/features/session-planner/components/` | Bloque individual (calentamiento/principal/vuelta a la calma) con lista de ejercicios |
| `ExerciseCard` | `src/features/session-planner/components/` | Card de ejercicio con nombre, duración, RPE, cues, objetivo |
| `SessionListPage` | `src/features/session-planner/components/` | Lista "Mis Sesiones" con items clickeables |
| `SessionDetailPage` | `src/features/session-planner/components/` | Vista de detalle de sesión guardada |
| `useGenerateSession` | `src/features/session-planner/hooks/` | TanStack Mutation para llamar a `generate-session` |
| `useSavedSessions` | `src/features/session-planner/hooks/` | TanStack Query para listar sesiones del coach |
| `useSaveSession` | `src/features/session-planner/hooks/` | TanStack Mutation para guardar sesión |
| `useDeleteSession` | `src/features/session-planner/hooks/` | TanStack Mutation para eliminar sesión |

### Cambios en API / Edge Functions

| Endpoint / Función | Tipo | Descripción |
|---------------------|------|-------------|
| `generate-session` | Edge Function (nueva) | Recibe parámetros de sesión, llama a Claude, retorna JSON estructurado |
| `training_sessions` | Tabla (nueva) | CRUD vía Supabase client directo (no necesita Edge Function) |

### Data model

```typescript
// Tabla nueva: training_sessions
interface TrainingSession {
  id: string                    // UUID, PK
  user_id: string               // FK → auth.users (el coach)
  title: string                 // Título de la sesión
  duration_minutes: number      // 60 | 75 | 90
  session_objective: string     // Objetivo seleccionado
  periodization_phase: string   // Fase de periodización
  target_level: string          // beginner | intermediate | advanced | competitive
  coach_notes: string | null    // Notas adicionales del coach
  blocks: Json                  // Array de bloques generados (calentamiento, principal, vuelta a la calma)
  generation_context: Json | null // Parámetros usados para la generación (para regenerar)
  created_at: string
  updated_at: string
}

// Estructura del JSON `blocks`
interface SessionBlock {
  block_type: 'warmup' | 'main' | 'cooldown'
  block_label: string           // "Calentamiento", "Parte Principal", "Vuelta a la Calma"
  duration_minutes: number
  drills: SessionDrill[]
}

interface SessionDrill {
  name: string
  duration: string              // "8 minutos", "10 reps cada lado"
  intensity: number             // RPE 1-10
  coaching_cues: string[]
  common_mistake: string
  objective: string
  equipment_needed: string[]
  rounds: number
  rest_seconds: number
}

// Input para la Edge Function
interface GenerateSessionRequest {
  session_objective: string
  duration_minutes: number
  periodization_phase: string
  target_level: string
  coach_notes?: string
}
```

### State management

- **Server state (TanStack Query):**
  - `['sessions', 'list']` — Lista de sesiones guardadas del coach
  - `['sessions', 'detail', sessionId]` — Detalle de una sesión
  - Mutation para `generate-session` (no se cachea, cada generación es nueva)
  - Mutation para save/delete

- **Local state:**
  - Form state manejado con React Hook Form + Zod
  - Estado de la sesión generada (antes de guardar) en state local del componente

---

## Dependencias

- [ ] **Técnicas:** No requiere migración de coach_profiles/roster_links (opera sobre user_id del coach autenticado)
- [ ] **De datos:** Nueva tabla `training_sessions` + nueva Edge Function `generate-session`
- [ ] **De diseño:** No requiere mockups — sigue patrones existentes de shadcn/ui (formularios, cards, listas)

---

## Riesgos

| Riesgo | Impacto | Probabilidad | Mitigación |
|--------|---------|--------------|------------|
| Claude genera sesiones con tiempos que no cuadran con la duración pedida | Medio | Media | Incluir instrucciones estrictas de timing en el system prompt + validación client-side |
| Respuesta de Claude tarda >15s para sesiones largas | Bajo | Media | Loading state con progress indicator. Max tokens suficientes pero no excesivos |
| El JSON generado no matchea el schema esperado | Alto | Baja | Parse defensivo con fallback, igual que en `generate-warmup`. Zod validation del response |
| Scope creep hacia edición completa de sesiones | Medio | Alta | P1 explícito — MVP solo genera, guarda, y lista. No edita |

---

## Métricas de éxito

| Métrica | Target | Cómo medir | Cuándo evaluar |
|---------|--------|------------|----------------|
| Sesiones generadas | ≥ 5 sesiones generadas en testing manual | Contar rows en `training_sessions` | Post-deploy |
| Tiempo de generación | < 15 segundos | Timestamp en la UI | Post-deploy |
| Tasa de guardado | ≥ 50% de sesiones generadas se guardan | Ratio generadas vs guardadas | 1 semana |
| Framework validation | Gate checklists completados en cada fase | Revisión de artefactos | Al completar Phase 7 |

---

## Preguntas abiertas

- [ ] **¿Qué objetivos de sesión ofrecer en el dropdown?** — Propuesta: Técnica de golpes, Táctica de juego, Preparación física, Agilidad y footwork, Estrategia de dobles, Sesión mixta. **Quién responde:** product
- [ ] **¿El coach necesita estar autenticado con role='coach'?** — En el MVP, cualquier usuario autenticado puede generar sesiones. El role gating se aplica cuando se implemente roster. **Quién responde:** eng (decidido: no bloquear por role en MVP)

---

## Non-goals

1. **Integración con roster/atletas** — P1, requiere migración de ADR-002. El MVP genera sesiones genéricas, no personalizadas a un atleta específico
2. **Edición de ejercicios individuales** — P1. El MVP genera y guarda sesiones completas. No se editan ejercicios sueltos
3. **Compartir sesiones entre coaches** — P2, es Feature #3 (Shared Session Library)
4. **Calendario de planificación semanal** — P2, future scope
5. **Export a PDF** — P2

---

## Referencias

- [docs/research/coach-investigation/COACH-INVESTIGATION.md](../../research/coach-investigation/COACH-INVESTIGATION.md)
- [docs/research/coach-investigation/PAIN-THEMES.md](../../research/coach-investigation/PAIN-THEMES.md)
- [supabase/functions/generate-warmup/index.ts](../../../supabase/functions/generate-warmup/index.ts) — Patrón a extender
- [docs/training-context.md](../../training-context.md) — Conocimiento de dominio para el prompt
- [docs/decisions/002-trainer-database-schema.md](../../decisions/002-trainer-database-schema.md) — Schema de coach (para P1)
