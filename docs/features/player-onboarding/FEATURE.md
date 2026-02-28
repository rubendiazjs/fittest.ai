# Feature: Player Onboarding Questionnaire

**Status:** Planning
**Priority:** Critical
**Estimated Effort:** M
**Assignee:** TBD
**Started:** 2026-01-10
**Target Completion:** TBD

---

## Problem Statement

Cuando un usuario llega por primera vez a la plataforma Fittest.ai, necesitamos entender su perfil como jugador de pádel para poder personalizar su experiencia de entrenamiento. Sin esta información inicial, no podemos generar sesiones adaptadas a su nivel, experiencia y condición física.

---

## User Stories

### Story 1: Primer Acceso - Cuestionario de Perfil
**As a** nuevo usuario de Fittest.ai
**I want** completar un cuestionario sobre mi experiencia de juego y actitud física
**So that** la plataforma pueda generar sesiones de entrenamiento personalizadas para mí

**Acceptance Criteria:**
- [ ] El usuario es redirigido al cuestionario en su primer acceso
- [ ] El cuestionario recopila información sobre experiencia de juego
- [ ] El cuestionario recopila información sobre condición física actual
- [ ] El usuario puede completar el cuestionario en menos de 3 minutos
- [ ] Los datos del perfil se guardan correctamente en la base de datos
- [ ] Al finalizar, el usuario es redirigido al dashboard principal

### Story 2: Clasificación de Tipo de Jugador
**As a** usuario completando el onboarding
**I want** ser clasificado según mi tipo de jugador
**So that** las sesiones se adapten a mi estilo de juego

**Acceptance Criteria:**
- [ ] El sistema clasifica al usuario en un tipo de jugador basado en sus respuestas
- [ ] Se muestra el resultado de la clasificación al usuario
- [ ] El tipo de jugador influye en las sesiones generadas posteriormente

---

## Technical Approach

### High-Level Design

Flujo de onboarding multi-paso que recopila información del usuario y genera un perfil de jugador:

1. **Pantalla de bienvenida** - Introducción al cuestionario
2. **Experiencia de juego** - Nivel, frecuencia, tiempo jugando
3. **Condición física** - Actividad actual, lesiones previas, objetivos
4. **Estilo de juego** - Preferencias, fortalezas, áreas de mejora
5. **Resultado** - Clasificación y resumen del perfil

### Components Needed

- **OnboardingWizard**: Componente contenedor del flujo multi-paso
- **WelcomeStep**: Pantalla de bienvenida
- **GameExperienceStep**: Formulario de experiencia de juego
- **PhysicalConditionStep**: Formulario de condición física
- **PlayStyleStep**: Formulario de estilo de juego
- **ProfileResultStep**: Pantalla de resultado con clasificación

### API Integration

**Endpoints needed:**
- `POST /api/player-profile` - Guardar perfil completo del jugador
- `GET /api/player-profile/:userId` - Obtener perfil existente

**Supabase Tables:**
- `player_profiles` - Almacena el perfil completo del jugador

### State Management

**State needed:**
- Server state: TanStack Query para player profile
- Client state: Zustand o useState para estado del wizard (paso actual, respuestas parciales)
- Local state: useState para cada formulario individual

**Mutations:**
```typescript
useCreatePlayerProfileMutation()
```

**Queries:**
```typescript
useGetPlayerProfileQuery(userId)
```

### Data Model

El perfil del jugador se clasifica en **tres dimensiones**:

| Dimensión | Propósito | Output |
|-----------|-----------|--------|
| **Game Experience** | ¿Qué puede hacer técnicamente? | Level + Score (0-10) |
| **Fitness Level** | ¿Qué puede manejar físicamente? | Level + Score (0-10) |
| **Lifestyle** | ¿Qué encaja en su vida? ¿Qué le motiva? | Profile (sin score) |

Ver tipos completos en: `src/features/player-onboarding/types/index.ts`

### Research Completado

| Dimensión | Documento | Preguntas |
|-----------|-----------|-----------|
| Game Experience | [QUESTIONNAIRE-RESEARCH.md](./QUESTIONNAIRE-RESEARCH.md) | 5 |
| Fitness Level | [QUESTIONNAIRE-RESEARCH.md](./QUESTIONNAIRE-RESEARCH.md) | 5 |
| Lifestyle | [LIFESTYLE-RESEARCH.md](./LIFESTYLE-RESEARCH.md) | 5 |

**Total: 15 preguntas (~3 minutos)**

---

## UI/UX Design

### Mockup
[TBD - Link to Figma / v0.dev]

### Layout Description
- **Main view**: Wizard a pantalla completa con indicador de progreso
- **Key interactions**: Navegación entre pasos, selección de opciones, inputs de texto
- **Navigation**: Botones "Anterior" / "Siguiente" / "Finalizar"

### UI States to Handle

Following `.claude/skills/react-ui-patterns/`:

- [ ] **Loading state**: Al guardar el perfil
- [ ] **Error state**: Errores de validación y de guardado
- [ ] **Empty state**: N/A (flujo de creación)
- [ ] **Success state**: Pantalla de resultado con clasificación
- [ ] **Form validation**: Validación en cada paso antes de avanzar
- [ ] **Button states**: Disabled mientras se procesa

---

## Dependencies

### External Libraries
- [ ] react-hook-form - Para gestión de formularios
- [ ] zod - Para validación de esquemas

### Internal Dependencies
- [ ] Sistema de autenticación debe estar completo
- [ ] Conexión a Supabase configurada

### API Requirements
- [ ] Tabla `player_profiles` en Supabase
- [ ] Row Level Security configurado

### Documentation
- [ ] Update `training-context.md` con tipos de jugador y clasificación
- [ ] Update `ai-agent-context.md` con patrón de onboarding

---

## Risk Assessment

### Technical Risks

**Risk 1: Complejidad del wizard multi-paso**
- Likelihood: Medium
- Impact: Medium
- Mitigation: Usar patrón de wizard probado, mantener estado simple

**Risk 2: Clasificación de jugador poco precisa**
- Likelihood: Medium
- Impact: High
- Mitigation: Iterar sobre algoritmo de clasificación con feedback de usuarios

### UX Risks

**Risk 1: Cuestionario demasiado largo**
- Mitigation: Limitar a 10-15 preguntas, mostrar progreso claro, permitir saltar preguntas opcionales

---

## Success Metrics

- **Completion rate**: > 80% de usuarios completan el onboarding
- **Time to complete**: < 3 minutos promedio
- **Profile completeness**: > 90% de campos completados
- **User satisfaction**: El usuario entiende su clasificación

---

## Implementation Plan

### Phase 1: Estructura Base
- [ ] Crear modelos de datos y tipos
- [ ] Configurar tabla en Supabase
- [ ] Crear componente OnboardingWizard base
- [ ] Implementar navegación entre pasos

### Phase 2: Formularios
- [ ] Implementar WelcomeStep
- [ ] Implementar GameExperienceStep
- [ ] Implementar PhysicalConditionStep
- [ ] Implementar PlayStyleStep
- [ ] Validación de cada formulario

### Phase 3: Integración y Resultado
- [ ] Conectar con Supabase (mutation)
- [ ] Implementar lógica de clasificación de jugador
- [ ] Implementar ProfileResultStep
- [ ] Redirect al dashboard después de completar

### Phase 4: Polish
- [ ] Animaciones de transición entre pasos
- [ ] Manejo de errores y estados de carga
- [ ] Tests manuales completos

---

## Open Questions

### Resueltas
- [x] ¿Qué tipos de jugador queremos clasificar?
  - **Decisión**: Dos dimensiones independientes:
    1. Game Experience: beginner, experienced, advanced, pro (cada uno con escala 0-10)
    2. Fitness Level: TBD con research

### Pendientes
- [x] ~~¿Qué preguntas específicas para evaluar Game Experience?~~ → Ver QUESTIONNAIRE-RESEARCH.md
- [x] ~~¿Qué preguntas y métricas para evaluar Fitness Level?~~ → Ver QUESTIONNAIRE-RESEARCH.md
- [ ] ¿Permitir que el usuario edite su perfil después?
- [ ] ¿Incluir preguntas sobre equipamiento disponible (gym, material, etc.)?

**Siguiente paso**: Implementar UI del wizard

---

## References

### Related Documentation
- Architecture: docs/ARCHITECTURE.md
- Domain: docs/training-context.md (Sección 7.2 - Personalización por Nivel)

### External Resources
- [Onboarding best practices](TBD)
- [Player classification in padel](TBD)

---

## Development Log

### 2026-01-10: Feature Created
Feature definida durante sesión de planificación inicial. Identificada como primera feature crítica para personalización de la plataforma.

### 2026-01-10: Modelo de Clasificación Definido
- Decisión: Clasificar usuarios en dos dimensiones independientes
- Game Experience: beginner/experienced/advanced/pro con escala 0-10
- Fitness Level: Pendiente de research para definir categorías y preguntas
- El cuestionario se iterará con feedback de usuarios

### 2026-01-10: Research de Cuestionarios Completado
- Definidas 15 preguntas totales (5 + 5 + 5 por dimensión)
- Tiempo estimado: ~3 minutos para completar
- Algoritmo de scoring simple definido para Game Experience y Fitness
- Lifestyle genera un perfil (no score) para personalizar recomendaciones
- Ver: QUESTIONNAIRE-RESEARCH.md, LIFESTYLE-RESEARCH.md
- Types actualizados con todas las opciones de respuesta

---

## Review Checklist

Before marking as "Complete":

**Functionality:**
- [ ] All acceptance criteria met
- [ ] Edge cases handled (usuario abandona a mitad, vuelve después)
- [ ] Works in browser

**Code Quality:**
- [ ] Follows CONTRIBUTING.md standards
- [ ] TypeScript strict mode passes
- [ ] No console.logs
- [ ] Proper error handling

**UI States (react-ui-patterns):**
- [ ] Loading state implemented correctly
- [ ] Error state shows to user
- [ ] Buttons disabled during operations

**Documentation:**
- [ ] Code commented where complex
- [ ] ARCHITECTURE.md updated if needed

**Testing:**
- [ ] Manual testing complete
- [ ] No obvious bugs
- [ ] Performance acceptable

---

**Last Updated:** 2026-01-10
**Status:** Planning
