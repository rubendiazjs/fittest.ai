# Feature: [Nombre del Feature]

> Template para la fase **Plan** del [Feature Lifecycle](../FEATURE-LIFECYCLE.md).
> Copiar a `docs/features/[feature-name]/FEATURE.md` y completar.

## Metadata

| Campo | Valor |
|-------|-------|
| **Status** | Planning / In Progress / Review / Complete |
| **Prioridad** | Critical / High / Medium / Low |
| **Esfuerzo estimado** | XS / S / M / L / XL |
| **Assignee** | — |
| **Fecha inicio** | YYYY-MM-DD |
| **Target completado** | YYYY-MM-DD |
| **Research asociada** | `docs/research/[initiative-name]/` o N/A |

---

## Problema

_2-3 frases describiendo el problema que resuelve esta feature. Incluir quién lo sufre, con qué frecuencia, y cuál es el costo de no resolverlo._

_Fundamentar con evidencia: links a la investigación, datos de soporte, feedback de usuarios, o análisis competitivo._

---

## User Stories

### Story 1: [Título descriptivo]

**As a** [tipo de usuario específico]
**I want** [capacidad — qué quiere lograr, no cómo]
**So that** [beneficio — por qué es valioso]

**Acceptance Criteria:**
- [ ] Criterio 1 — comportamiento esperado, no implementación
- [ ] Criterio 2
- [ ] Criterio 3

### Story 2: [Título descriptivo]

**As a** [tipo de usuario]
**I want** [capacidad]
**So that** [beneficio]

**Acceptance Criteria:**
- [ ] Criterio 1
- [ ] Criterio 2

_Agregar tantas stories como sean necesarias. Ordenar por prioridad._

---

## Requisitos

### P0 — Must Have

_Sin estos, la feature no se puede lanzar. Si se corta uno, la feature no resuelve el problema._

1. **[Requisito]** — Descripción clara del comportamiento esperado
2. **[Requisito]** — ...
3. **[Requisito]** — ...

### P1 — Nice to Have

_Mejoran significativamente la experiencia pero el core funciona sin ellos. Candidatos para la siguiente iteración._

1. **[Requisito]** — Descripción
2. **[Requisito]** — ...

### P2 — Futuro

_Fuera de scope para v1 pero hay que diseñar de forma que no bloqueen su implementación futura._

1. **[Requisito]** — Descripción y por qué se pospone
2. **[Requisito]** — ...

---

## Diseño técnico

### Approach de alto nivel

_¿Cómo funciona arquitectónicamente? Diagrama o descripción del flujo principal._

### Componentes necesarios

| Componente | Ubicación | Descripción |
|------------|-----------|-------------|
| `[ComponentName]` | `src/features/[name]/components/` | ... |
| `use[HookName]` | `src/features/[name]/hooks/` | ... |

### Cambios en API / Edge Functions

_¿Se necesitan nuevos endpoints, mutations, o cambios en funciones existentes?_

| Endpoint / Función | Tipo | Descripción |
|---------------------|------|-------------|
| `[nombre]` | Query / Mutation / Edge Function | ... |

### Data model

```typescript
// Nuevos tipos o cambios en tipos existentes
interface [NombreData] {
  // Definir campos
}
```

### State management

_¿Qué estado se necesita? ¿Dónde vive? (TanStack Query para server state, Zustand para client state, local state para formularios)_

---

## Dependencias

- [ ] **Técnicas:** [Librerías, infraestructura, o features que deben existir primero]
- [ ] **De datos:** [Tablas, RLS policies, Edge Functions necesarias]
- [ ] **De diseño:** [Mockups, decisiones de UX pendientes]

---

## Riesgos

| Riesgo | Impacto | Probabilidad | Mitigación |
|--------|---------|--------------|------------|
| [Descripción] | Alto / Medio / Bajo | Alta / Media / Baja | [Cómo mitigar] |
| [Descripción] | ... | ... | ... |

---

## Métricas de éxito

_¿Cómo sabemos que esta feature tuvo éxito?_

| Métrica | Target | Cómo medir | Cuándo evaluar |
|---------|--------|------------|----------------|
| [Métrica 1] | [Valor específico] | [Herramienta/query] | [1 semana / 1 mes] |
| [Métrica 2] | ... | ... | ... |

---

## Preguntas abiertas

- [ ] [Pregunta 1] — Quién responde: [eng / design / product]
- [ ] [Pregunta 2] — Quién responde: [...]

---

## Non-goals

_Qué NO incluye esta feature explícitamente y por qué._

1. **[Non-goal]** — Razón por la que está fuera de scope
2. **[Non-goal]** — ...

---

## Referencias

- [Link a research](../research/[initiative-name]/)
- [Link a ADR](../decisions/[NNN]-[titulo].md) (si aplica)
- [Links externos relevantes]
