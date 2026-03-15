# Post-Deploy Validation: [Nombre del Feature]

> Template para la fase **Validate** del [Feature Lifecycle](../FEATURE-LIFECYCLE.md).
> Usar como checklist después de cada deploy a staging/producción.

## Deploy info

| Campo | Valor |
|-------|-------|
| **Feature** | [Nombre] |
| **Entorno** | Staging / Producción |
| **PR** | #[número] |
| **Commit** | [SHA corto] |
| **Fecha deploy** | YYYY-MM-DD HH:MM |
| **Validado por** | [Nombre] |

---

## 1. Build & Deploy

- [ ] Build exitoso en CI (sin errores, sin warnings críticos)
- [ ] Deploy completado sin interrupciones
- [ ] Aplicación accesible en el entorno target
- [ ] Versión correcta desplegada (verificar commit o build number)

---

## 2. Smoke Test — Happy Path

_Ejecutar el flujo principal de la feature end-to-end._

| Paso | Acción | Resultado esperado | ¿OK? |
|------|--------|-------------------|:----:|
| 1 | [Acción del usuario] | [Qué debería pasar] | ☐ |
| 2 | [Acción del usuario] | [Qué debería pasar] | ☐ |
| 3 | [Acción del usuario] | [Qué debería pasar] | ☐ |
| 4 | [Acción del usuario] | [Qué debería pasar] | ☐ |

---

## 3. Persistencia de datos

- [ ] Datos se crean correctamente en Supabase (verificar en dashboard o MCP)
- [ ] Datos se leen correctamente al refrescar la página
- [ ] RLS policies funcionan (usuario solo ve sus propios datos)
- [ ] No hay datos huérfanos o duplicados

---

## 4. Integración AI (si aplica)

- [ ] Llamadas a Edge Functions retornan respuestas válidas
- [ ] Formato de respuesta del modelo es el esperado
- [ ] Tiempos de respuesta aceptables (< 10s para generación)
- [ ] Errores del modelo se manejan graciosamente

---

## 5. Performance

- [ ] Página carga en tiempo razonable (< 3s en primera carga)
- [ ] No hay renders excesivos (verificar con React DevTools Profiler)
- [ ] No hay llamadas API duplicadas o innecesarias
- [ ] No hay memory leaks evidentes (navegar ida y vuelta sin degradación)

---

## 6. Errores

- [ ] Consola del browser limpia (sin errores rojos)
- [ ] Network tab sin requests fallidos inesperados (4xx, 5xx)
- [ ] Logs del servidor sin errores nuevos (si hay acceso)

---

## 7. Regression

- [ ] Player onboarding sigue funcionando
- [ ] Daily check-in sigue funcionando
- [ ] Warmup generation sigue funcionando
- [ ] Auth flow intacto (login, logout, refresh)
- [ ] Navegación principal sin issues

_Actualizar esta lista conforme se agreguen features al producto._

---

## 8. Documentación post-deploy

- [ ] FEATURE.md status actualizado a "Complete"
- [ ] Release notes actualizadas (si aplica)
- [ ] README.md actualizado (si feature es user-facing)
- [ ] ARCHITECTURE.md actualizado (si hubo cambios estructurales)

---

## Resultado

- [ ] **VALIDADO** — Feature estable, lista para siguiente fase
- [ ] **ISSUES ENCONTRADOS** — Ver sección abajo
- [ ] **ROLLBACK NECESARIO** — Problema crítico, revertir

### Issues encontrados

| Issue | Severidad | Acción |
|-------|-----------|--------|
| [Descripción] | Blocker / Major / Minor | [Hotfix / Issue / Aceptar] |

### Notas

_Observaciones generales, performance, comportamiento inesperado no-blocking._
