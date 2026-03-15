# Tasks: [Nombre del Feature]

> Template para la fase **Plan** del [Feature Lifecycle](../FEATURE-LIFECYCLE.md).
> Copiar a `docs/features/[feature-name]/TASKS.md` y completar.

## Resumen

| Campo | Valor |
|-------|-------|
| **Feature** | [Nombre] |
| **Esfuerzo total estimado** | [XS–XL] |
| **Nº de tareas** | [N] |
| **Dependencias externas** | [Sí / No] |
| **Branch** | `feature/[feature-name]` |

---

## Orden de ejecución

_Diagrama simple del orden y dependencias entre tareas._

```
Task 1 (setup) ──┬──▶ Task 2 (data layer)
                  │
                  └──▶ Task 3 (UI shell)
                              │
Task 2 ──────────────────────▶ Task 4 (integration)
                                       │
                                       ▶ Task 5 (polish + QA)
```

---

## Tareas

### Task 1: [Nombre descriptivo]

| Campo | Valor |
|-------|-------|
| **Tipo** | Frontend / Backend / Data / Docs / Infra |
| **Esfuerzo** | XS / S / M / L |
| **Depende de** | Ninguna / Task N |

**Descripción:**
_Qué hay que hacer concretamente._

**Acceptance criteria:**
- [ ] Criterio 1
- [ ] Criterio 2

**Notas técnicas:**
_Consideraciones de implementación, archivos a modificar, patrones a seguir._

---

### Task 2: [Nombre descriptivo]

| Campo | Valor |
|-------|-------|
| **Tipo** | Frontend / Backend / Data / Docs / Infra |
| **Esfuerzo** | XS / S / M / L |
| **Depende de** | Task 1 |

**Descripción:**
_..._

**Acceptance criteria:**
- [ ] ...

**Notas técnicas:**
_..._

---

### Task 3: [Nombre descriptivo]

| Campo | Valor |
|-------|-------|
| **Tipo** | ... |
| **Esfuerzo** | ... |
| **Depende de** | ... |

**Descripción:**
_..._

**Acceptance criteria:**
- [ ] ...

---

_Agregar tantas tareas como sean necesarias. Para features M+ suelen ser 4-8 tareas._

---

## Progreso

_Actualizar durante Phase 3 (Execute)._

| Task | Status | Notas |
|------|--------|-------|
| Task 1 | ⬜ Pending / 🔄 In Progress / ✅ Done | — |
| Task 2 | ⬜ Pending | — |
| Task 3 | ⬜ Pending | — |

---

## Descubrimientos durante ejecución

_Registrar aquí cualquier descubrimiento técnico, cambio de plan, o riesgo nuevo encontrado durante la implementación._

| Fecha | Descubrimiento | Impacto | Acción |
|-------|---------------|---------|--------|
| YYYY-MM-DD | [Qué se encontró] | [Bajo / Medio / Alto] | [Qué se decidió hacer] |
