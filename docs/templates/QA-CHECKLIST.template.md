# QA Checklist: [Nombre del Feature]

> Template para la fase **Test** del [Feature Lifecycle](../FEATURE-LIFECYCLE.md).
> Copiar a la descripción de la PR o incluir como comentario en la PR.

## Feature info

| Campo | Valor |
|-------|-------|
| **Feature** | [Nombre] |
| **PR** | #[número] |
| **Branch** | `feature/[feature-name]` |
| **FEATURE.md** | [Link] |
| **Tester** | [Nombre] |
| **Fecha** | YYYY-MM-DD |

---

## 1. Build & Lint

- [ ] `npm run type-check` — TypeScript compila sin errores
- [ ] `npm run lint` — Linting pasa sin warnings
- [ ] `npm run build` — Build de producción exitoso
- [ ] Sin `console.log`, `debugger`, o código temporal

---

## 2. Código

- [ ] Sin uso de `any` en TypeScript — usar tipos explícitos o `unknown`
- [ ] Interfaces definidas para todos los props y data structures
- [ ] Hooks custom extraídos para lógica compleja
- [ ] Feature-based file structure respetada (`src/features/[name]/`)
- [ ] Exports limpios via `index.ts`
- [ ] Sin dependencias nuevas innecesarias
- [ ] `code-quality.md` ejecutado sobre el directorio del feature

---

## 3. UI States

Para cada vista/componente principal del feature:

### [Nombre del componente/vista 1]

| State | Implementado | Notas |
|-------|:------------:|-------|
| Loading | ☐ | Skeleton / spinner — sin flash of content |
| Error | ☐ | Mensaje claro + acción de recovery |
| Empty | ☐ | Estado útil con CTA (si aplica) |
| Success | ☐ | Feedback visual de acciones completadas |

### [Nombre del componente/vista 2]

| State | Implementado | Notas |
|-------|:------------:|-------|
| Loading | ☐ | |
| Error | ☐ | |
| Empty | ☐ | |
| Success | ☐ | |

_Agregar sección por cada vista/componente principal._

---

## 4. Interacciones

- [ ] Botones deshabilitados durante operaciones async
- [ ] Formularios validan antes de submit
- [ ] Feedback visual en acciones del usuario (toasts, estados de botón, etc.)
- [ ] Navegación funciona correctamente (rutas, back button)
- [ ] Focus management correcto (accesibilidad básica)

---

## 5. Responsive

- [ ] Desktop (1280px+) — layout correcto
- [ ] Tablet (768px) — layout se adapta
- [ ] Mobile (375px) — layout usable, sin overflow horizontal

---

## 6. Acceptance Criteria (de FEATURE.md)

_Copiar los acceptance criteria del FEATURE.md y verificar cada uno:_

### Story 1: [Título]
- [ ] Criterio 1
- [ ] Criterio 2
- [ ] Criterio 3

### Story 2: [Título]
- [ ] Criterio 1
- [ ] Criterio 2

---

## 7. Edge Cases

| Caso | Resultado esperado | ¿Verificado? |
|------|-------------------|:------------:|
| Input vacío en [campo] | [Comportamiento esperado] | ☐ |
| Datos inexistentes (perfil no creado) | [Comportamiento esperado] | ☐ |
| Error de red durante [acción] | [Comportamiento esperado] | ☐ |
| Sesión expirada | [Comportamiento esperado] | ☐ |
| [Otro caso relevante] | [Comportamiento esperado] | ☐ |

---

## 8. Regression

- [ ] Features existentes siguen funcionando (onboarding, daily check-in, warmup generation)
- [ ] Navegación principal no rota
- [ ] Auth flow intacto

---

## 9. Documentación

- [ ] FEATURE.md actualizado (status, approach final)
- [ ] TASKS.md actualizado (progreso)
- [ ] Comentarios en código para lógica compleja
- [ ] `doc-sync.md` ejecutado
- [ ] ARCHITECTURE.md actualizado (si hay cambios estructurales)
- [ ] ADR creado (si hay decisión arquitectónica nueva)

---

## 10. Screenshots

_Adjuntar screenshots de los estados principales del feature._

| Vista / Estado | Screenshot |
|---------------|------------|
| Happy path | [adjuntar] |
| Loading state | [adjuntar] |
| Error state | [adjuntar] |
| Empty state | [adjuntar] |
| Mobile view | [adjuntar] |

---

## Resultado

- [ ] **APROBADO** — Listo para merge
- [ ] **CAMBIOS NECESARIOS** — Ver notas abajo

### Notas del reviewer

_Observaciones, issues encontrados, sugerencias._
