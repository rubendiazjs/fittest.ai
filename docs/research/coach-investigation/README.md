# Coach Investigation: Pain Points → Feature Candidates

**Fecha:** Marzo 2026
**Estado:** Desk Research Completo · Pendiente Entrevistas
**Responsable:** Equipo Fittest.ai

---

## Contexto

La visión de producto de Fittest.ai es convertirse en el "sistema operativo potenciado por IA para coaches de pádel y entrenadores personales." El roadmap (Fase 1, Q2 2026) contempla infraestructura para coaches (gestión de roster, templates de sesión, RBAC), pero fue diseñado top-down desde intuición de producto — **no se ha realizado validación con coaches todavía.**

Antes de construir cualquier feature orientada a coaches, necesitamos descubrir qué les duele realmente en el día a día para priorizar el trabajo de mayor impacto.

## Objetivo

Producir un brief con los **top 3 candidatos de features para coaches**, cada uno con:

- El dolor subyacente / job-to-be-done
- Evidencia (citas, frecuencia de mención)
- Señal de esfuerzo (complejidad de build: bajo / medio / alto)
- Encaje con las fundaciones técnicas existentes

## Estructura de Documentos

| Documento | Descripción |
|---|---|
| [COACH-INVESTIGATION.md](./COACH-INVESTIGATION.md) | **Brief principal** — Top 3 feature candidates con evidencia, JTBD y encaje técnico |
| [PAIN-THEMES.md](./PAIN-THEMES.md) | Inventario completo de 14 temas de dolor con scoring y mapeo a roadmap |
| [DESK-RESEARCH.md](./DESK-RESEARCH.md) | Apéndice de evidencia — citas clave organizadas por fuente |
| [COMPETITOR-ANALYSIS.md](./COMPETITOR-ANALYSIS.md) | Análisis de 15 plataformas competidoras con gaps identificados |
| [INTERVIEW-GUIDE.md](./INTERVIEW-GUIDE.md) | Guía de entrevista refinada (11 preguntas) + script de reclutamiento |

## Metodología

### Desk Research (completado)

5 flujos de investigación en paralelo:

1. **Reddit/Foros** — r/padel, r/personaltraining, blogs de coaching en español → 52 hallazgos
2. **Reseñas de Apps** — TrainHeroic, TrueCoach, CoachNow, Trainerize, Virtuagym, PT Distinction, My PT Hub, Hudl → 90 hallazgos
3. **Redes Sociales** — Instagram, LinkedIn, Facebook, Twitter/X, blogs → 49 hallazgos
4. **YouTube** — 29 vídeos analizados, 20 observaciones de workflow → flujos manuales documentados
5. **Competidores** — 15 plataformas analizadas → gaps de mercado identificados

**Total: 220+ puntos de datos** en español e inglés, cubriendo España, Latinoamérica y mercados emergentes de pádel.

### Entrevistas (pendiente)

- **Target:** 5-8 coaches de pádel (entrenadores personales, no head coaches de club)
- **Perfil:** 5-30 atletas, ya usan herramientas digitales, España/LATAM
- **Formato:** 30 min videollamada, semi-estructurada
- **Guía:** Ver [INTERVIEW-GUIDE.md](./INTERVIEW-GUIDE.md)

## Resultado Principal

### Top 3 Feature Candidates

| # | Feature | Dolor | Fuentes | Esfuerzo |
|---|---------|-------|---------|----------|
| 1 | **Planificador de Sesiones con IA** | Coaches improvisan sin objetivos, alumnos lo notan | 5/5 | Medio |
| 2 | **Panel de Atletas con Readiness** | Cero visibilidad de estado de atletas, todo en WhatsApp | 5/5 | Medio |
| 3 | **Biblioteca de Sesiones y Plantillas** | Se reconstruye todo desde cero, sin continuidad entre coaches | 4/5 | Bajo-Medio |

### Recomendación de Roadmap

El desk research **valida** los items de Fase 1-2 pero sugiere **reordenar prioridades**:

1. **AI Session Planner → Adelantar de Fase 3 a Fase 1** — Es la señal de dolor más fuerte y ya tenemos la infraestructura de IA
2. **Roster + Dashboard de Readiness → Confirmado** como alta prioridad (Fase 1-2)
3. **Biblioteca de Plantillas → Validado** y bajo esfuerzo (Fase 1)

→ Detalle completo en [COACH-INVESTIGATION.md](./COACH-INVESTIGATION.md)

## Archivos de Contexto del Repo

- `docs/ROADMAP.md` — Roadmap existente de coaches (referencia cruzada)
- `docs/training-context.md` — Dominio de ciencia deportiva (informa viabilidad)
- `docs/decisions/002-trainer-database-schema.md` — Decisiones de DB schema para coach/roster
- `src/features/` — Features ya construidas (evitar overlap con features de atleta)

## Timeline

| Día | Actividad | Estado |
|-----|-----------|--------|
| 1 | Definir perfil de coach, iniciar desk research | ✅ Completo |
| 2 | Completar desk research, construir guía de entrevista | ✅ Completo |
| 3–7 | Ejecutar 5-8 entrevistas | ⏳ Pendiente |
| 8 | Síntesis + affinity mapping | ⏳ Pendiente |
| 9 | Escribir briefs de feature candidates finales | ⏳ Pendiente |
| 10 | Presentar top 3 con evidencia | ⏳ Pendiente |