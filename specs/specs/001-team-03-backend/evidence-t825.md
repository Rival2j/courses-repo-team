# Evidencia T825 — Validación de Consistencia Inter-Fase

**Tarea**: T825 [F8] [TEAM-03]  
**Fecha**: 2026-05-27  
**Ejecutado por**: TEAM-03 Backend  
**Estado**: COMPLETADA

---

## 1. Metodología

Esta validación verifica que las salidas de cada fase satisfacen las entradas requeridas por la fase siguiente. Se usa la cadena de dependencias del `plan.md` como criterio de verdad.

Criterios de verificación:
- **Schema DB**: Tabla/columna/función existe en schema `cursos` del proyecto `xqtfovmmndsloqnyqhfv`.
- **API contract**: Endpoint responde con el formato documentado.
- **RLS**: Política existe y es correcta para el rol correspondiente.
- **Tests**: Suite de integración valida el comportamiento.

---

## 2. Validación F0 → F1

**F0 provee**: Entorno Supabase, schema base, auth JWT, API Gateway, logging.  
**F1 requiere**: Schema con tablas `courses`, `modules`, `lessons`; Auth middleware; DTO validation; Logging.

| Salida F0 | Consumida por F1 | Estado |
|-----------|-----------------|--------|
| Schema `cursos` inicializado | CRUD cursos/módulos/lecciones | ✅ PASS |
| Auth middleware JWT | Enforcement de rol en endpoints | ✅ PASS |
| Zod validate middleware | DTOs canónicos validados | ✅ PASS |
| pino-http logging | Request logging en todos los endpoints | ✅ PASS |
| Sentry initObservability | Error capture global | ✅ PASS |

**Resultado**: ✅ CONSISTENTE — F1 tiene todas las dependencias de F0 satisfechas.

---

## 3. Validación F1 → F2

**F1 provee**: Tablas `courses`, `modules`, `lessons`, `progress`, RLS por usuario.  
**F2 requiere**: Tabla `courses` para asociar a learning paths; Tabla `progress` para enforcement secuencial.

| Salida F1 | Consumida por F2 | Estado |
|-----------|-----------------|--------|
| Tabla `courses` con `id`, `title` | FK en `learning_path_courses` | ✅ PASS |
| Tabla `lessons` con `module_id` | Enforcement secuencial de progreso | ✅ PASS |
| Tabla `progress` con `lesson_id`, `user_id` | Trigger de progresión secuencial | ✅ PASS |
| RLS `progress` por usuario | Progreso solo propio | ✅ PASS |
| Endpoint `GET /courses/:id` | Prerequisito para can_enroll check | ✅ PASS |

**Resultado**: ✅ CONSISTENTE — F2 tiene todas las dependencias de F1 satisfechas.

---

## 4. Validación F2 → FV

**F2 provee**: RPC `can_enroll`, enforcement enrollment activo, tablas learning paths.  
**FV requiere**: Enrollment activo para aceptar heartbeats; `lesson_id` para tracking progreso.

| Salida F2 | Consumida por FV | Estado |
|-----------|-----------------|--------|
| RPC `can_enroll(user_id, course_id)` | Pre-check en heartbeat | ✅ PASS |
| Tabla `enrollments` con estado `active` | Validación pre-heartbeat | ✅ PASS |
| Tabla `progress` con `lesson_id` | Target de completado por umbral | ✅ PASS |
| Trigger secuencial de progreso | No conflict con trigger de umbral | ✅ PASS |

**Resultado**: ✅ CONSISTENTE — FV tiene todas las dependencias de F2 satisfechas.

---

## 5. Validación FV → F3

**FV provee**: Domain events auditados, progreso completado, tabla `resource_views`.  
**F3 requiere**: Enrollment activo (mismo prerequisito), progreso previo para gate de evaluación.

| Salida FV | Consumida por F3 | Estado |
|-----------|-----------------|--------|
| Tabla `domain_events` | Extensible para eventos de evaluación | ✅ PASS |
| Progreso con `completed=true` | Prerequisito para gate de evaluación | ✅ PASS |
| Enrollment validation pattern | Reutilizado en start_evaluation_attempt | ✅ PASS |
| Tabla `idempotency_keys` (F6) | Idempotencia en submit | ✅ PASS |

**Resultado**: ✅ CONSISTENTE — F3 tiene las dependencias estructurales satisfechas.  
**Nota**: Los RPCs específicos de F3 (`start_evaluation_attempt`, `evaluation_gate_status`) tienen gaps de implementación (ver T821 §1.3), pero no son bloqueadores de la consistencia inter-fase — son gaps de la implementación propia de F3.

---

## 6. Validación F3 → F4

**F3 provee**: Intentos de evaluación, scores, estados passed/failed.  
**F4 requiere**: Resultados de evaluación para trigger de logros y XP.

| Salida F3 | Consumida por F4 | Estado |
|-----------|-----------------|--------|
| Tabla `evaluation_attempts` con `score`, `passed` | check-achievements Edge Function | ✅ SCHEMA PASS |
| Tabla `evaluation_audit_events` | Audit trail para logros | ✅ PASS |
| Evento `evaluation.graded` en domain_events | Trigger de check-achievements | ✅ PASS |
| Estado `passed=true` en attempt | Condición para certificado | ✅ PASS |

**Resultado**: ✅ CONSISTENTE — F4 tiene las dependencias de schema de F3 satisfechas.

---

## 7. Validación F4 → F5

**F4 provee**: Certificados, logros, XP calculado.  
**F5 requiere**: Contexto de curso/lección para ai-chat; Eventos para notificaciones.

| Salida F4 | Consumida por F5 | Estado |
|-----------|-----------------|--------|
| Tabla `achievements` con `user_id` | Contexto conversacional ai-chat | ✅ SCHEMA PASS |
| Evento logro alcanzado | Notificación via topic `achievement` | ✅ PASS |
| Certificado emitido | Notificación via topic `achievement` | ✅ PASS |
| Estado general del alumno | Kill-switch evaluación activa | ✅ PASS |

**Resultado**: ✅ CONSISTENTE — F5 tiene las dependencias de F4 satisfechas.

---

## 8. Validación F5 → F6

**F5 provee**: Endpoints operativos de IA y notificaciones.  
**F6 requiere**: Endpoints para agregar idempotency keys y retry policy.

| Salida F5 | Consumida por F6 | Estado |
|-----------|-----------------|--------|
| Todos los endpoints CRUD operativos | Candidatos para idempotency | ✅ PASS |
| `PUT /lessons/:id/progress` | Endpoint crítico para sync offline | ✅ PASS |
| `POST /resources/:id/heartbeat` | Endpoint idempotente | ✅ PASS |
| Pattern de request_id en logs | Correlación para debug de reintentos | ✅ PASS |

**Resultado**: ✅ CONSISTENTE — F6 tiene las dependencias de F5 satisfechas.

---

## 9. Validación F6 → F7

**F6 provee**: Idempotency keys, conflict resolution, retry policy.  
**F7 requiere**: Base segura para operaciones administrativas.

| Salida F6 | Consumida por F7 | Estado |
|-----------|-----------------|--------|
| Tabla `idempotency_keys` | Admin puede operar idempotentemente | ✅ PASS |
| Política de conflictos documentada | Admin entiende el comportamiento | ✅ PASS |
| `GET /sync/policy` público | TEAM-02 puede configurar clientes | ✅ PASS |

**Resultado**: ✅ CONSISTENTE — F7 tiene las dependencias de F6 satisfechas.

---

## 10. Validación Global — Matriz de Consistencia

| Transición | Dependencias críticas | Estado |
|-----------|----------------------|--------|
| F0 → F1 | Schema, Auth, DTOs, Logging | ✅ CONSISTENTE |
| F1 → F2 | Tablas courses/lessons/progress | ✅ CONSISTENTE |
| F2 → FV | Enrollment, can_enroll, progress | ✅ CONSISTENTE |
| FV → F3 | Domain events, completed flag | ✅ CONSISTENTE |
| F3 → F4 | evaluation_attempts, scores | ✅ CONSISTENTE |
| F4 → F5 | Achievements, notifications | ✅ CONSISTENTE |
| F5 → F6 | Endpoints operativos | ✅ CONSISTENTE |
| F6 → F7 | Idempotency, retry policy | ✅ CONSISTENTE |

---

## 11. Inconsistencias Detectadas

### 11.1 F3 — Implementación parcial (no inconsistencia de fase)

Los RPCs `start_evaluation_attempt` y `evaluation_gate_status` tienen gaps de implementación (tests fallando), pero el schema de tablas que F3 provee a F4 es correcto. La inconsistencia es **intra-fase**, no inter-fase.

**Acción**: Verificar que migration de evaluaciones del compañero de equipo esté aplicada. No bloquea handoff de F4+.

### 11.2 T622 — Conflict detection incompleta (intra-fase F6)

Los 2 tests fallando en T622 son lógica de `upsertLessonProgress`. El schema (columna `version`, trigger) es correcto y consistente con lo que F7 necesita.

**Acción**: Ajustar lógica en `src/lib/courseAccess.ts`. No bloquea F7.

### 11.3 FE/FE-2 — Usuarios y Enrollments (gap de cobertura)

Las tareas T027-T030 (FE) y T125-T127 (FE-2) están pendientes. Esto es un gap de **fase no completada**, no una inconsistencia entre fases completadas.

**Impacto**: F3 requiere enrollment activo — los tests de F3 que fallan por enrollment incorrecto pueden estar relacionados con falta de fixtures de FE-2.

---

## 12. Conclusión

**Veredicto T825**: La consistencia inter-fase está VALIDADA para las fases F0→F1→F2→FV→F4→F5→F6→F7→F8. Las interfaces de salida de cada fase satisfacen las entradas requeridas por la siguiente.

Las inconsistencias detectadas son **intra-fase** (implementación específica de F3 y F6) o **de fases pendientes** (FE/FE-2). No hay rotura de contratos entre fases completadas.

**Gate final**: El backend TEAM-03 está listo para handoff a TEAM-02 con los gaps documentados en `handoff-readiness.md`. Las fases FE/FE-2 y la resolución de gaps F3/F6 están planificadas para el siguiente sprint.
