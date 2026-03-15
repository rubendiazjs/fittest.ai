# Investigación: Top 3 Candidatos de Features para Coaches

**Fecha:** Marzo 2026
**Tipo:** Desk Research
**Estado:** Completo — Pendiente validación con entrevistas

---

## Resumen Ejecutivo

Se realizó una investigación de escritorio exhaustiva a través de Reddit, reseñas de apps, redes sociales (Instagram, LinkedIn, Facebook, Twitter/X), YouTube y análisis competitivo de 15+ plataformas. Se recopilaron **220+ puntos de datos** a través de 5 flujos de investigación independientes, cubriendo fuentes en español e inglés en España, Latinoamérica y mercados emergentes de pádel.

Los 3 candidatos de features principales emergieron al triangular temas de dolor que aparecieron consistentemente en múltiples fuentes independientes. Cada candidato está respaldado por evidencia directa de coaches reales, validado por análisis competitivo que confirma brechas de mercado, y mapeado a la infraestructura técnica existente de Fittest.ai.

Los tres candidatos — **AI Session Planner**, **Athlete Dashboard con Readiness Signals** y **Biblioteca de Sesiones con Plantillas de Coach** — abordan los dolores más severos y frecuentes, y se alinean directamente con las fundaciones técnicas ya construidas (DB, Edge Functions, contexto de entrenamiento).

---

## Feature Candidate #1: Planificador de Sesiones con IA

> AI Session Planner

### Dolor

Los coaches de pádel **improvisan sesiones sin objetivos claros**, repiten ejercicios, y los alumnos lo notan — generando churn. No existe ninguna herramienta digital de planificación de sesiones para pádel. Los coaches planifican en su cabeza o en papel.

### Evidencia

> "No hay un método, incluso aunque sea bueno o malo, pues no hay un rumbo y entonces repetirás las clases, improvisarás, tus alumnos lo notan"
>
> — Coach español, 25 años experiencia ([YouTube, Mejora Tu Padel](https://www.youtube.com/watch?v=oTSkpY71Ly4))

> "Se acabó la improvisación, el abusar de lanzar carros de pelotas o pensar el siguiente ejercicio cuando recogen pelotas"
>
> — Academia de Pádel Online, 1000+ alumnos, Galicia ([ebook APO](https://www.academiadepadelonline.com/wp-content/uploads/2019/09/ebook_APO.pdf))

> "The hardest part wasn't the actual coaching—it was the preparation. Hunting through scattered notes and Excel files, trying to create coherent training plans from fragmented information"
>
> — Fundador de Striveon, ex-coach de pádel ([joinstriveon.com](https://joinstriveon.com/about-us))

> "Coaches invest 10-20 hours building custom spreadsheet infrastructure just to get basic functionality (dropdown exercise selection, auto-calculated volume loads, athlete tracking)"
>
> — Observación de workflows S&C en YouTube ([Google Sheets programme builder](https://www.youtube.com/watch?v=BcOvBntJ-QE))

**Frecuencia:** Mencionado en **5/5 flujos de investigación**. Los coaches de S&C en YouTube dedican 10-20 horas a construir templates de Google Sheets desde cero. Múltiples fuentes españolas (AulaPadel, PadelStar, APO) confirman que la improvisación es la norma, no la excepción.

### Job to be Done

> "Cuando tengo que preparar las clases de la semana para 15-20 alumnos de distintos niveles, quiero **generar sesiones estructuradas con objetivos claros y ejercicios apropiados**, para que mis alumnos progresen de forma medible y no improvisar nunca más."

### Solución Propuesta

Expandir el motor de IA de generación de calentamientos existente (`generate-warmup`) a un **planificador de sesión completo**:

1. Coach selecciona: perfil de atleta/grupo, fase de entrenamiento (del modelo de periodización en `training-context.md`), objetivo de sesión, duración, equipamiento disponible
2. Claude genera una sesión completa con calentamiento, parte principal (bloques), y vuelta a la calma
3. Coach puede editar, guardar como plantilla, y reutilizar

### Encaje con Infraestructura Existente

**Base de datos:**
- `warmup_sessions` ya almacena sesiones generadas por IA con `exercises` JSON, `coaching_notes`, `generation_context`
- Se necesita nueva tabla `session_templates` (`coach_id`, `title`, `folder`, `sport_phase`, `target_level`, `exercises` JSON)
- `coach_profiles` de [ADR-002](../../decisions/002-trainer-database-schema.md) ya soporta especialidades

**IA:**
- La Edge Function `generate-warmup` ya llama a Claude con perfil de jugador + contexto de check-in
- Extender para aceptar objetivos definidos por el coach, perfiles de grupo y fase de periodización
- Todo `docs/training-context.md` (bibliotecas de ejercicios, periodización, estructura de sesión) ya está construido como contexto de IA

**Esfuerzo: MEDIO**
- El pipeline de generación IA, infraestructura Edge Function y conocimiento de dominio ya existen
- Trabajo principal: expandir el prompt, construir la UI del session builder, añadir CRUD de plantillas

---

## Feature Candidate #2: Panel de Atletas con Señales de Readiness

> Athlete Dashboard with Readiness Signals

### Dolor

Los coaches que gestionan 10-30 atletas tienen **cero visibilidad** sobre quién está listo para entrenar, quién está fatigado, lesionado o abandonando. Lo gestionan todo en su cabeza, WhatsApp o hojas de cálculo dispersas. El stack **"Excel + WhatsApp + Bizum"** es citado universalmente como el dolor operativo #1.

### Evidencia

> "Entrenador de pádel: tu negocio puede escalar. Hoy tus ingresos dependen solo de las horas en pista. Además, pierdes tiempo entre WhatsApp, Bizum y Excel."
>
> — Gimadd ([Instagram](https://www.instagram.com/p/DOZHbhfjRzu/)), dirigido a coaches de pádel españoles

> "El problema es el sistema. Clientes sin histórico, herramientas que cambian cada pocos meses, pagos por Bizum y procesos repartidos en mil sitios."
>
> — [Instagram reel](https://www.instagram.com/reel/DVqbZPTDI2J/) para coaches españoles

> "Entrenador: si tu sistema hoy es Excel + PDFs + WhatsApp, no estás gestionando clientes… estás apagando fuegos."
>
> — StenFit app ([Instagram](https://www.instagram.com/p/DVJiMKrjZAn/))

> "I was drowning in a sea of Google Docs, DMs, and emails… Losing up to 10 hours a week on automatable tasks"
>
> — Coach de fitness ([YouTube](https://www.youtube.com/watch?v=4F5s42ZeJDc))

**Frecuencia:** Apareció en **5/5 flujos de investigación** como el dolor más prevalente. Cada fuente en español nombra explícitamente WhatsApp + Excel. Las reseñas de TrueCoach, TrainHeroic y Trainerize incluyen quejas de dashboards de clientes rotos y sin vista de readiness.

### Job to be Done

> "Cuando abro la app por la mañana antes de empezar mis clases, quiero **ver de un vistazo el estado de todos mis atletas** (quién está en verde, amarillo o rojo), para adaptar las sesiones del día sin tener que revisar 20 conversaciones de WhatsApp."

### Solución Propuesta

Dashboard **"Mi Roster"** mostrando todos los atletas vinculados con un indicador de readiness tipo semáforo (rojo/amarillo/verde) calculado a partir de datos de check-in diario (sueño, fatiga, dolor, estado de ánimo):

1. Vista de lista con filtros por grupo/nivel
2. Tapping un atleta muestra: perfil, check-ins recientes, racha, última sesión
3. Tasas de cumplimiento agregadas
4. Alertas de intervención sugeridas por IA

### Encaje con Infraestructura Existente

**Base de datos:**
- `roster_links` (`coach_id` → `athlete_id`) de [ADR-002](../../decisions/002-trainer-database-schema.md) ya está diseñado
- `checkin_responses` y `checkin_streaks` ya existen con todos los datos necesarios para cálculo de readiness
- `player_profiles` tiene `fitness_level`, `injury_status`
- Políticas RLS para acceso del coach a través de roster links activos ya definidas en ADR-002

**IA:**
- La Edge Function de Claude puede calcular un score de readiness a partir de datos recientes de check-in
- `checkinContext.ts` ya agrega datos de check-in para la generación de calentamientos
- Extender para generar sugerencias de intervención orientadas al coach

**Esfuerzo: MEDIO**
- Schema y RLS están diseñados (aún no migrados)
- Trabajo principal: migración, dashboard UI "Mis Atletas" (React + TanStack Query), sistema de invitación/vinculación, Edge Function de agregación de readiness

---

## Feature Candidate #3: Biblioteca de Sesiones y Plantillas de Coach

> Shared Session Library & Coach Templates

### Dolor

Los coaches **reconstruyen las mismas sesiones desde cero** repetidamente. Cuando un coach sustituto toma el grupo, tiene cero contexto sobre lo enseñado. Las academias con múltiples coaches no tienen metodología compartida — cada coach enseña a su manera, produciendo experiencias incoherentes calificadas como "2 de 10".

### Evidencia

> "Cuando sustituyes a un compañero o dejas un grupo, el siguiente entrenador no sabe por dónde continuar."
>
> — Academia de Pádel Online ([ebook APO](https://www.academiadepadelonline.com/wp-content/uploads/2019/09/ebook_APO.pdf))

> "You can have very good individual coaches, but without a shared methodology and clear structure the learning environment becomes fragmented."
>
> — Panagiotis Dedeletakis ([LinkedIn](https://www.linkedin.com/posts/sandy-farquharson_its-a-misconception-thats-slowing-down-activity-7432737577906044928-K2MV)), respondiendo a Sandy Farquharson

> "Those several coaches are all coming in delivering their own style… You essentially have a coaching program that's a 2 out of 10."
>
> — Sandy Farquharson, GB Men's Coach / The Padel School ([LinkedIn](https://www.linkedin.com/posts/sandy-farquharson_its-a-misconception-thats-slowing-down-activity-7432737577906044928-K2MV))

> "Coaches invest 10-20 hours building Google Sheets exercise databases with VLOOKUP formulas and YouTube video links — a system every coach rebuilds from scratch"
>
> — Observación de workflows S&C ([YouTube](https://www.youtube.com/watch?v=Pqe5r-_4zdA))

**Frecuencia:** Apareció en **4/5 flujos de investigación** (Reddit, redes sociales, YouTube, competidores). Todas las plataformas competidoras carecen de bibliotecas de plantillas compartidas.

### Job to be Done

> "Cuando creo una sesión que funciona bien, quiero **guardarla como plantilla** en mi biblioteca organizada por categoría, para reutilizarla, compartirla con otros coaches de mi academia, y asegurar continuidad cuando un coach sustituye a otro."

### Solución Propuesta

1. Guardar cualquier sesión generada por IA o creada manualmente como **plantilla reutilizable**
2. Plantillas organizadas en carpetas (Pre-temporada, Táctica, Rehabilitación, etc.)
3. Plantillas versionadas y compartibles entre coaches de la misma organización
4. Biblioteca a nivel de academia para consistencia metodológica

### Encaje con Infraestructura Existente

**Base de datos:**
- Se necesita nueva tabla `session_templates` (`id`, `coach_id`, `title`, `description`, `folder`, `sport_phase`, `target_level`, `exercises` JSON, `is_public`, `organization_id`)
- `coach_profiles` ya tiene `organization_name`
- Se podría añadir tabla `organizations` para academias multi-coach en el futuro

**IA:**
- No requiere IA para MVP — es una feature de CRUD + sharing
- Futuro: la IA puede sugerir plantillas basándose en perfil del atleta y fase de periodización

**Esfuerzo: BAJO-MEDIO**
- Principalmente trabajo de UI (lista de plantillas, navegación por carpetas, flujos de guardar/editar/compartir)
- Sin pipeline de IA necesario
- Schema es una extensión directa

---

## Mapeo con el Roadmap Existente

La investigación **valida** los ítems del roadmap de Fase 1-2 pero sugiere **reordenar prioridades**:

### 1. AI Session Planner → Adelantar de Fase 3 a Fase 1

La planificación de sesiones es la señal de dolor más fuerte (5/5 fuentes) y Fittest.ai ya tiene toda la infraestructura de IA necesaria: el pipeline de generación de calentamientos con Claude, las Edge Functions, el contexto de entrenamiento completo (`training-context.md` con bibliotecas de ejercicios y periodización). El salto de generar calentamientos a generar sesiones completas es incremental, no fundamental. Además, este feature tiene el **mayor potencial de diferenciación** frente a competidores — ninguna plataforma existente ofrece generación de sesiones con IA específica para pádel.

### 2. Roster + Dashboard de Readiness → Confirmado como alta prioridad (Fase 1-2)

La fragmentación de herramientas (Excel + WhatsApp + Bizum) y la falta de visibilidad de readiness aparecen en 5/5 y 4/5 fuentes respectivamente. El schema de ADR-002 (`roster_links`, RLS policies) ya está diseñado. Este feature es el "reemplazo de WhatsApp" que todo coach español cita como necesidad urgente.

### 3. Biblioteca de Plantillas → Validado y bajo esfuerzo (Fase 1)

La reutilización de sesiones y la continuidad metodológica entre coaches aparece en 4/5 fuentes. Es una feature de CRUD pura (sin IA) que complementa directamente al Session Planner. Se puede construir en paralelo con esfuerzo bajo-medio, maximizando el valor del ecosistema de sesiones.

---

## Siguientes Pasos

1. **Validar con entrevistas** (5-8 coaches) — ver [INTERVIEW-GUIDE.md](./INTERVIEW-GUIDE.md)
2. **Affinity mapping** post-entrevistas para confirmar/ajustar ranking
3. **Escribir FEATURE.md** para cada candidato confirmado (siguiendo `docs/FEATURE_TEMPLATE.md`)
4. **Actualizar `docs/ROADMAP.md`** si las entrevistas confirman el reordenamiento

---

## Referencias

- [docs/ROADMAP.md](../../ROADMAP.md) — Roadmap actual de coaches
- [docs/training-context.md](../../training-context.md) — Contexto de ciencia deportiva
- [docs/decisions/002-trainer-database-schema.md](../../decisions/002-trainer-database-schema.md) — Schema de DB para coach/roster
- [PAIN-THEMES.md](./PAIN-THEMES.md) — Inventario completo de temas de dolor
- [DESK-RESEARCH.md](./DESK-RESEARCH.md) — Evidencia detallada por fuente
- [COMPETITOR-ANALYSIS.md](./COMPETITOR-ANALYSIS.md) — Análisis competitivo
- [INTERVIEW-GUIDE.md](./INTERVIEW-GUIDE.md) — Guía de entrevistas