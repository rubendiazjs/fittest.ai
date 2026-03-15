# Feature Lifecycle Framework

> Reemplaza `FEATURE-WORKFLOW.md`. Define el ciclo completo que sigue cualquier iniciativa en Fittest.ai — desde la idea hasta la iteración post-deploy.

## Principios

1. **Investigar antes de construir.** No se escribe código sin evidencia de que el problema existe y entendimiento de cómo resolverlo.
2. **Gates humanos, ejecución asistida.** Los agentes AI son herramientas que aceleran cada fase. Las decisiones de avanzar, pivotar o descartar son siempre humanas.
3. **Documentación como artefacto, no como ceremonia.** Cada fase produce un documento vivo que sirve de input para la siguiente. No se documentan cosas que nadie va a leer.
4. **Progreso sobre perfección.** Las fases son incrementales. Mejor un MVP testeable que una spec perfecta que no se ejecuta.
5. **Scope explícito.** Lo que NO se incluye está tan definido como lo que sí. Cada fase tiene criterios de entrada y salida claros.

---

## Ciclo de vida

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  1. RESEARCH │────▶│   2. PLAN   │────▶│  3. EXECUTE │────▶│   4. TEST   │
│              │     │             │     │             │     │             │
│  Entender    │     │  Definir    │     │  Construir  │     │  Verificar  │
│  el problema │     │  la solución│     │  el MVP     │     │  calidad    │
└──────────────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
                                                                    │
┌─────────────┐     ┌─────────────┐     ┌─────────────┐            │
│  7. ITERATE │◀────│ 6. VALIDATE │◀────│  5. DEPLOY  │◀───────────┘
│              │     │             │     │             │
│  Decidir     │     │  Confirmar  │     │  Entregar   │
│  siguiente   │     │  en staging │     │  a staging  │
│  ciclo       │     │  y smoke    │     │  / prod     │
└──────────────┘     └─────────────┘     └─────────────┘
```

---

## Fase 1: Research (Investigar)

**Objetivo:** Entender el problema, el contexto competitivo, y validar que merece resolverse.

### Entradas
- Hipótesis o idea (puede venir del roadmap, feedback de usuarios, análisis competitivo, o la investigación de coach pain points)

### Actividades
| Actividad | Descripción | Herramientas AI |
|-----------|-------------|-----------------|
| Desk research | Buscar evidencia en foros, reviews, redes sociales, YouTube | Búsqueda paralela con agentes |
| Análisis competitivo | Mapear cómo resuelven el problema otras plataformas | Extracción estructurada de features |
| Síntesis de pain themes | Agrupar hallazgos en temas con frecuencia y severidad | Clustering asistido |
| Definición del perfil objetivo | Quién tiene el problema, cuándo, con qué frecuencia | — |

### Artefactos
- `docs/research/[initiative-name]/README.md` — Índice de la investigación
- `docs/research/[initiative-name]/DESK-RESEARCH.md` — Evidencia recopilada
- `docs/research/[initiative-name]/COMPETITOR-ANALYSIS.md` — Análisis competitivo
- `docs/research/[initiative-name]/PAIN-THEMES.md` — Temas de dolor sintetizados

### Gate de salida → Plan
- [ ] Existe evidencia documentada de que el problema es real (≥10 data points de ≥2 fuentes)
- [ ] El perfil de usuario objetivo está definido
- [ ] Se ha mapeado el landscape competitivo relevante
- [ ] Decisión humana: **¿Merece resolverse?** → Sí / No / Necesita más investigación

---

## Fase 2: Plan (Planificar)

**Objetivo:** Definir qué se va a construir, por qué, y cómo medir éxito. Acotar el scope al MVP mínimo viable.

### Entradas
- Artefactos de Research aprobados

### Actividades
| Actividad | Descripción | Herramientas AI |
|-----------|-------------|-----------------|
| Feature spec (FEATURE.md) | Problema, user stories, requisitos P0/P1/P2, métricas de éxito | Generación de borradores a partir de research |
| Diseño técnico | Approach de alto nivel, componentes, data model, API changes | Análisis de codebase y sugerencias |
| Task breakdown (TASKS.md) | Tareas estimadas, dependencias, orden de ejecución | — |
| ADR (si aplica) | Decisión arquitectónica significativa | — |
| Scope cut | Mover todo lo que no sea P0 a fases futuras | — |

### Artefactos
- `docs/features/[feature-name]/FEATURE.md` — Spec completa (usar template en Apéndice A)
- `docs/features/[feature-name]/TASKS.md` — Breakdown de tareas (usar template en Apéndice B)
- `docs/decisions/[NNN]-[titulo].md` — ADR si hay decisión arquitectónica

### Gate de salida → Execute
- [ ] FEATURE.md completado con problema, user stories, criterios de aceptación, y requisitos P0
- [ ] TASKS.md con tareas estimadas y dependencias identificadas
- [ ] Diseño técnico revisado (¿encaja en la arquitectura actual?)
- [ ] Scope P0 cabe en el timebox definido
- [ ] ADR creado si hay decisión arquitectónica nueva
- [ ] Decisión humana: **¿Estamos listos para construir?** → Sí / Necesita refinar scope / Descartar

---

## Fase 3: Execute (Construir)

**Objetivo:** Implementar el MVP definido en la spec, siguiendo las convenciones del proyecto.

### Entradas
- FEATURE.md y TASKS.md aprobados
- Branch `feature/[feature-name]` creada desde la rama base

### Actividades
| Actividad | Descripción | Herramientas AI |
|-----------|-------------|-----------------|
| Setup de branch | Crear branch, estructura de feature, onboard al agente AI | `onboard.md` para contexto AI |
| Implementación | Código siguiendo la estructura feature-based | Code generation, pair programming |
| Documentación inline | Comentarios en código, actualizar types, actualizar AI context | — |
| Self-review continuo | Revisar contra acceptance criteria mientras se construye | `code-quality.md` |

### Convenciones
- **Branch naming:** `feature/[feature-name]`
- **Feature structure:**
  ```
  src/features/[feature-name]/
  ├── components/
  ├── hooks/
  ├── api/
  │   ├── queries.ts
  │   ├── mutations.ts
  │   └── keys.ts
  ├── types/
  ├── utils/
  └── index.ts
  ```
- **Commits:** Conventional Commits (`feat`, `fix`, `docs`, `refactor`, `test`, `chore`)
- **UI States:** Toda vista debe manejar Loading, Error, Empty, y Success (ver `.claude/skills/react-ui-patterns/`)

### Artefactos
- Código en `src/features/[feature-name]/`
- TASKS.md actualizado con progreso
- FEATURE.md con status "In Progress"

### Gate de salida → Test
- [ ] Todos los P0 del acceptance criteria implementados
- [ ] TypeScript compila sin errores (`npm run type-check`)
- [ ] Linting pasa (`npm run lint`)
- [ ] No hay console.logs ni código de debugging
- [ ] Documentación actualizada (FEATURE.md status, code comments)
- [ ] `doc-sync.md` ejecutado
- [ ] Decisión humana: **¿Está completo el MVP?** → Sí / Faltan P0s

---

## Fase 4: Test (Verificar)

**Objetivo:** Verificar que el código cumple con los criterios de aceptación y no rompe funcionalidad existente.

### Entradas
- Feature implementada en branch

### Actividades
| Actividad | Descripción | Herramientas AI |
|-----------|-------------|-----------------|
| Revisión de código | Self-review + `code-quality.md` sobre el directorio del feature | Análisis estático |
| Testing funcional | Verificar cada acceptance criteria manualmente en el browser | — |
| Testing de UI states | Verificar Loading, Error, Empty, Success para cada vista | — |
| Testing de edge cases | Inputs inválidos, estados vacíos, errores de red | — |
| Regression check | Verificar que features existentes siguen funcionando | — |

### Checklist de calidad (ver Apéndice C para detalle)

**Código:**
- [ ] `code-quality.md` ejecutado sin issues críticos
- [ ] TypeScript strict — sin `any`, interfaces definidas
- [ ] Sin dependencias innecesarias agregadas

**UI/UX:**
- [ ] Loading: skeleton o spinner (no flash of content)
- [ ] Error: mensaje claro para el usuario, acción de recovery
- [ ] Empty: estado útil con CTA cuando aplique
- [ ] Success: feedback visual de acciones completadas
- [ ] Responsive en mobile y desktop
- [ ] Botones deshabilitados durante operaciones async

**Funcional:**
- [ ] Cada P0 acceptance criteria verificado
- [ ] Edge cases documentados probados
- [ ] No hay regresiones en features existentes

### Artefactos
- PR creada con template completado (ver CONTRIBUTING.md)
- Checklist de QA documentado en la PR
- Screenshots de UI states adjuntos a la PR

### Gate de salida → Deploy
- [ ] Checklist de calidad completado
- [ ] PR abierta con descripción, screenshots, y link a FEATURE.md
- [ ] Decisión humana: **¿La calidad es suficiente para deploy?** → Aprobar / Pedir cambios

---

## Fase 5: Deploy (Entregar)

**Objetivo:** Llevar el código al entorno de staging/producción de forma controlada.

### Entradas
- PR aprobada

### Actividades
| Actividad | Descripción | Herramientas AI |
|-----------|-------------|-----------------|
| Merge | Squash merge a la rama base | — |
| Deploy a staging | Verificar build exitoso y deploy automático | — |
| Smoke test en staging | Verificar que la feature funciona en el entorno real | — |

### Convenciones
- **Merge strategy:** Squash merge → un commit limpio por feature
- **Commit message del merge:** `feat([feature-name]): descripción concisa`
- **Branch cleanup:** Eliminar branch después del merge

### Artefactos
- Commit en rama base
- Feature visible en staging/producción

### Gate de salida → Validate
- [ ] Build exitoso en CI
- [ ] Feature accesible en staging
- [ ] Smoke test básico pasado (la feature carga, interacciones principales funcionan)
- [ ] Decisión humana: **¿El deploy fue exitoso?** → Sí / Rollback necesario

---

## Fase 6: Validate (Validar)

**Objetivo:** Confirmar que la feature funciona correctamente en el entorno real post-deploy.

### Entradas
- Feature desplegada en staging/producción

### Actividades
| Actividad | Descripción | Herramientas AI |
|-----------|-------------|-----------------|
| Smoke test de producción | Flujo completo end-to-end en el entorno real | — |
| Verificación de datos | Datos se guardan/leen correctamente en Supabase | — |
| Verificación de integración AI | Si la feature usa Claude, verificar respuestas | — |
| Monitoreo de errores | Revisar logs y consola por errores inesperados | — |

### Checklist post-deploy (ver Apéndice D para detalle)
- [ ] Happy path funciona end-to-end
- [ ] Datos persistidos correctamente en la base de datos
- [ ] No hay errores nuevos en consola/logs
- [ ] Performance aceptable (no hay llamadas lentas ni renders excesivos)
- [ ] Si usa AI: las respuestas son coherentes y dentro del formato esperado

### Artefactos
- FEATURE.md actualizado con status "Complete"
- Release notes entry (si aplica)
- README actualizado (si feature es user-facing)

### Gate de salida → Iterate
- [ ] Validación post-deploy completada sin issues blocking
- [ ] Documentación final actualizada
- [ ] Decisión humana: **¿La feature está estable?** → Sí / Necesita hotfix

---

## Fase 7: Iterate (Iterar)

**Objetivo:** Decidir qué viene después para esta iniciativa, basándose en lo aprendido.

### Entradas
- Feature estable en producción
- Feedback observado (si existe)

### Actividades
| Actividad | Descripción | Herramientas AI |
|-----------|-------------|-----------------|
| Retrospectiva ligera | ¿Qué funcionó? ¿Qué ajustar? ¿Estimación vs realidad? | — |
| Evaluación de P1s | ¿Los nice-to-have siguen siendo relevantes? | — |
| Backlog update | Actualizar roadmap con aprendizajes | — |
| Decisión de siguiente ciclo | Iniciar nuevo ciclo para P1s o pivotar a otra iniciativa | — |

### Artefactos
- `docs/features/[feature-name]/RETRO.md` — Retrospectiva ligera (opcional, solo si hay aprendizajes valiosos)
- Roadmap actualizado
- Backlog de P1s priorizado (si aplica)

### Gate de salida → Siguiente ciclo
- [ ] Retrospectiva registrada (puede ser un párrafo, no hace falta un ensayo)
- [ ] Decisión documentada: siguiente iteración / nueva feature / pausa
- [ ] Si hay P1s: crear nuevo ciclo empezando en Phase 2 (Plan) — la research ya está hecha

---

## Aplicando el framework por tipo de iniciativa

No todas las features requieren las 7 fases con la misma intensidad:

| Tipo | Research | Plan | Execute | Test | Deploy | Validate | Iterate |
|------|----------|------|---------|------|--------|----------|---------|
| **Feature nueva (L/XL)** | Completa | Completa | Completa | Completa | Completa | Completa | Completa |
| **Feature nueva (S/M)** | Ligera* | Completa | Completa | Completa | Completa | Ligera | Ligera |
| **Bug fix** | — | Ligera | Completa | Completa | Completa | Ligera | — |
| **Refactor técnico** | — | Completa | Completa | Completa | Completa | Ligera | — |
| **Mejora de UX** | Ligera* | Ligera | Completa | Completa | Completa | Completa | Ligera |
| **Iteración P1 sobre feature existente** | — | Ligera | Completa | Completa | Completa | Completa | Ligera |

*Ligera = desk research mínimo, puede ser 30 min de búsqueda enfocada en lugar de streams paralelos.

---

## Sizing Guide

| Size | Duración estimada | Ejemplo |
|------|-------------------|---------|
| **XS** | < 2 horas | Cambio de copy, fix de estilo |
| **S** | 2–4 horas | Página nueva con componentes existentes |
| **M** | 1–2 días | Componente complejo con state, nueva integración API |
| **L** | 3–5 días | Feature multi-pantalla, data model nuevo |
| **XL** | 1+ semana | Feature mayor con múltiples integraciones |

**Regla:** Si es > XL, dividir en features más pequeñas.

---

## Estructura de archivos

```
docs/
├── FEATURE-LIFECYCLE.md          ← Este documento
├── research/
│   └── [initiative-name]/
│       ├── README.md
│       ├── DESK-RESEARCH.md
│       ├── COMPETITOR-ANALYSIS.md
│       └── PAIN-THEMES.md
├── features/
│   └── [feature-name]/
│       ├── FEATURE.md
│       ├── TASKS.md
│       └── RETRO.md              (opcional)
├── decisions/
│   └── [NNN]-[titulo].md
└── templates/                    ← Templates referenciados
    ├── FEATURE-SPEC.template.md
    ├── TASK-BREAKDOWN.template.md
    ├── QA-CHECKLIST.template.md
    └── POST-DEPLOY.template.md
```

---

## Anti-patterns

| ❌ Anti-pattern | ✅ Alternativa |
|----------------|----------------|
| Empezar a codear sin research ni spec | Siempre pasar por Phase 1-2 (aunque sea en modo ligero) |
| Research infinita sin converger | Poner timebox a la investigación. Si en X días no hay señal clara, decidir con lo que hay |
| Spec perfecta que nunca se ejecuta | Scope cut agresivo. El FEATURE.md define P0, no la feature completa |
| Saltarse los UI states | Loading/Error/Empty/Success son obligatorios en toda vista |
| No documentar decisiones arquitectónicas | Si dudaste entre dos opciones, crear ADR |
| Deploy sin smoke test | Siempre verificar el happy path post-deploy |
| No hacer retro | Al menos un párrafo: ¿qué funcionó? ¿qué ajustar? |
| Iterar sin decidir explícitamente | Cada ciclo termina con una decisión documentada: seguir / pivotar / pausa |

---

## Integración con herramientas AI

Los agentes AI (Claude Code, agentes de investigación) asisten en cada fase pero no toman decisiones de gate:

| Fase | Uso de AI | Decisión humana |
|------|-----------|-----------------|
| Research | Búsqueda paralela, extracción de datos, síntesis | ¿Merece resolverse? |
| Plan | Generación de borradores de spec, análisis de codebase | ¿Estamos listos para construir? |
| Execute | Code generation, pair programming, onboarding de contexto | ¿Está completo el MVP? |
| Test | Análisis estático, `code-quality.md` | ¿La calidad es suficiente? |
| Deploy | — | ¿Deploy exitoso? |
| Validate | — | ¿Feature estable? |
| Iterate | — | ¿Qué viene después? |

**Regla general:** Un agente puede generar, sugerir, y ejecutar. Pero avanzar de fase requiere revisión humana.

---

## Historial de versiones

| Versión | Fecha | Cambios |
|---------|-------|---------|
| v2.0 | Marzo 2026 | Reemplazo de FEATURE-WORKFLOW.md. Framework completo de 7 fases con research, QA, validación, e iteración |
| v1.0 | Enero 2026 | Workflow original de 5 fases (Define → Plan → Build → Review → Ship) |

---

## Apéndices

Los templates detallados están en `docs/templates/`:

- **Apéndice A:** [FEATURE-SPEC.template.md](./templates/FEATURE-SPEC.template.md) — Template para FEATURE.md
- **Apéndice B:** [TASK-BREAKDOWN.template.md](./templates/TASK-BREAKDOWN.template.md) — Template para TASKS.md
- **Apéndice C:** [QA-CHECKLIST.template.md](./templates/QA-CHECKLIST.template.md) — Checklist de calidad pre-PR
- **Apéndice D:** [POST-DEPLOY.template.md](./templates/POST-DEPLOY.template.md) — Checklist de validación post-deploy
