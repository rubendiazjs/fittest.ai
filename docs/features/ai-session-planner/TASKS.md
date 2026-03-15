# Tasks: AI Session Planner

## Resumen

| Campo | Valor |
|-------|-------|
| **Feature** | AI Session Planner |
| **Esfuerzo total estimado** | M (3-5 días) |
| **Nº de tareas** | 6 |
| **Dependencias externas** | No (solo Supabase + Anthropic API, ya configurados) |
| **Branch** | `feature/ai-session-planner` |

---

## Orden de ejecución

```
Task 1 (DB + types) ──▶ Task 2 (Edge Function) ──▶ Task 4 (Integration)
                        │                                    │
Task 3 (UI shell) ──────┘                                    ▼
                                                     Task 5 (Save/List)
                                                             │
                                                             ▼
                                                     Task 6 (Polish + Nav)
```

- Tasks 1 y 3 se pueden hacer en paralelo (DB schema + UI shell no dependen entre sí)
- Task 2 necesita Task 1 (para la tabla donde guarda resultados)
- Task 4 conecta UI (Task 3) con Edge Function (Task 2)
- Task 5 añade persistencia una vez la generación funciona
- Task 6 cierra el loop con pulido y navegación

---

## Tareas

### Task 1: Schema de base de datos y types

| Campo | Valor |
|-------|-------|
| **Tipo** | Data / Infra |
| **Esfuerzo** | XS |
| **Depende de** | Ninguna |

**Descripción:**
Crear la tabla `training_sessions` en Supabase con RLS policies, y actualizar `database.types.ts` con los tipos generados.

**Acceptance criteria:**
- [ ] Tabla `training_sessions` creada con todos los campos del data model (FEATURE.md)
- [ ] RLS habilitado: usuario solo puede CRUD sus propias sesiones (`user_id = auth.uid()`)
- [ ] `database.types.ts` actualizado (regenerar con Supabase CLI o manual)
- [ ] Tipos TypeScript para `TrainingSession`, `SessionBlock`, `SessionDrill`, `GenerateSessionRequest` en `src/features/session-planner/types/`

**Notas técnicas:**
- Seguir patrón de `warmup_sessions` para la estructura de la tabla
- Campo `blocks` es JSONB (array de SessionBlock)
- Campo `generation_context` es JSONB (parámetros usados, para regenerar)
- Migración SQL en `supabase/migrations/` o directa en dashboard

---

### Task 2: Edge Function `generate-session`

| Campo | Valor |
|-------|-------|
| **Tipo** | Backend |
| **Esfuerzo** | M |
| **Depende de** | Task 1 |

**Descripción:**
Crear la Edge Function `generate-session` que recibe los parámetros de sesión, construye un system prompt basado en `training-context.md`, llama a Claude, parsea el JSON, y retorna la sesión estructurada.

**Acceptance criteria:**
- [ ] Edge Function en `supabase/functions/generate-session/index.ts`
- [ ] Recibe `GenerateSessionRequest` (objetivo, duración, fase, nivel, notas)
- [ ] System prompt incluye estructura de 3 bloques, periodización, ejercicios por capacidad física
- [ ] Claude genera JSON con `SessionBlock[]` respetando la duración total pedida
- [ ] Parse defensivo del JSON con fallback (mismo patrón que `generate-warmup`)
- [ ] Retorna `{ success: true, session: { title, blocks, duration_minutes } }`
- [ ] CORS headers configurados (copiar patrón de `generate-warmup`)
- [ ] Auth requerida (Bearer token)

**Notas técnicas:**
- Copiar estructura base de `generate-warmup/index.ts` (CORS, auth, Anthropic client)
- El system prompt debe incluir: estructura de sesión (calentamiento 10-15min → principal 40-60min → vuelta a la calma 10-15min), tipos de ejercicio por fase de periodización (de `training-context.md`), formato JSON de output
- Usar `claude-sonnet-4-20250514` (mismo modelo que generate-warmup)
- `max_tokens: 8192` (sesiones completas son más largas que warmups)
- NO guardar automáticamente — la sesión se guarda solo cuando el coach elige "Guardar"

---

### Task 3: UI shell — Formulario y vista de sesión

| Campo | Valor |
|-------|-------|
| **Tipo** | Frontend |
| **Esfuerzo** | S |
| **Depende de** | Ninguna |

**Descripción:**
Construir los componentes de UI: formulario de generación y vista de sesión generada. Inicialmente con datos mock para poder iterar en el diseño sin depender del backend.

**Acceptance criteria:**
- [ ] `SessionGeneratorForm` con campos: objetivo (Select), duración (RadioGroup: 60/75/90), fase (Select), nivel (Select), notas (Textarea)
- [ ] Validación con Zod schema
- [ ] `SessionView` que renderiza bloques colapsables con ejercicios
- [ ] `SessionBlock` y `ExerciseCard` con diseño basado en shadcn/ui Cards
- [ ] Loading state con skeleton mientras se genera
- [ ] Error state si la generación falla
- [ ] Botones "Guardar" y "Regenerar" visibles después de generación

**Notas técnicas:**
- Feature structure: `src/features/session-planner/{components, hooks, api, types}/`
- Usar shadcn/ui: Select, RadioGroup, Textarea, Button, Card, Collapsible, Skeleton
- Opciones de objetivo: Técnica de golpes, Táctica de juego, Preparación física, Agilidad y footwork, Estrategia de dobles, Sesión mixta
- Opciones de fase: Adaptación Anatómica, Fuerza Máxima, Conversión a Potencia, Mantenimiento, Transición
- Responsivo: stack en mobile, side-by-side en desktop

---

### Task 4: Integración formulario ↔ Edge Function

| Campo | Valor |
|-------|-------|
| **Tipo** | Frontend |
| **Esfuerzo** | S |
| **Depende de** | Task 2, Task 3 |

**Descripción:**
Conectar el formulario con la Edge Function via TanStack Mutation. Reemplazar datos mock con generación real.

**Acceptance criteria:**
- [ ] Hook `useGenerateSession` — TanStack useMutation que llama a `generate-session`
- [ ] API function en `src/features/session-planner/api/mutations.ts`
- [ ] Form submit dispara la mutation con los parámetros del formulario
- [ ] Loading state activo durante la generación
- [ ] Error state muestra mensaje claro si falla
- [ ] Sesión generada se muestra en `SessionView`
- [ ] "Regenerar" re-invoca la mutation con los mismos parámetros

**Notas técnicas:**
- Llamada via `supabase.functions.invoke('generate-session', { body: {...} })`
- El token de auth se pasa automáticamente por el Supabase client
- Mutation sin invalidate de queries (no cachear generaciones)

---

### Task 5: Guardar, listar, y detalle de sesiones

| Campo | Valor |
|-------|-------|
| **Tipo** | Frontend + Data |
| **Esfuerzo** | S |
| **Depende de** | Task 4 |

**Descripción:**
Implementar la persistencia: guardar sesión generada, listar sesiones guardadas, ver detalle, y eliminar.

**Acceptance criteria:**
- [ ] `useSaveSession` — Mutation que inserta en `training_sessions`
- [ ] Al guardar, el coach puede editar el título (pre-rellenado con título generado)
- [ ] `useSavedSessions` — Query que lista sesiones del coach ordenadas por fecha
- [ ] `SessionListPage` con items: título, fecha, duración, objetivo, fase
- [ ] Tapping un item navega al detalle (reusa `SessionView`)
- [ ] `useDeleteSession` — Mutation para eliminar con confirmación
- [ ] Query keys en `src/features/session-planner/api/keys.ts`

**Notas técnicas:**
- CRUD directo via Supabase client (no necesita Edge Function)
- Query key factory: `sessionKeys.list()`, `sessionKeys.detail(id)`
- Invalidar lista después de save/delete
- Guardar `generation_context` para poder regenerar desde sesión guardada

---

### Task 6: Navegación, polish, y documentación

| Campo | Valor |
|-------|-------|
| **Tipo** | Frontend + Docs |
| **Esfuerzo** | XS |
| **Depende de** | Task 5 |

**Descripción:**
Integrar el Session Planner en la navegación principal de la app, pulir la UI, y actualizar documentación.

**Acceptance criteria:**
- [ ] Entrada en la navegación principal para "Session Planner" (o similar)
- [ ] Navegación entre: formulario → sesión generada → mis sesiones → detalle
- [ ] Transiciones suaves entre vistas
- [ ] Empty state en "Mis Sesiones" cuando no hay sesiones guardadas
- [ ] FEATURE.md status actualizado a "In Progress"
- [ ] TASKS.md progreso actualizado
- [ ] `doc-sync.md` ejecutado

**Notas técnicas:**
- Decidir si es una nueva ruta o un tab/sección dentro del dashboard actual
- Si hay routing: considerar React Router o navegación condicional (como el onboarding actual)
- Empty state con CTA: "Genera tu primera sesión"

---

## Progreso

| Task | Status | Notas |
|------|--------|-------|
| Task 1: Schema + types | ⬜ Pending | — |
| Task 2: Edge Function | ⬜ Pending | — |
| Task 3: UI shell | ⬜ Pending | — |
| Task 4: Integración | ⬜ Pending | — |
| Task 5: Save/List/Detail | ⬜ Pending | — |
| Task 6: Nav + polish | ⬜ Pending | — |

---

## Descubrimientos durante ejecución

| Fecha | Descubrimiento | Impacto | Acción |
|-------|---------------|---------|--------|
| — | — | — | — |
