# Handoff Readiness — TEAM-03 Backend

**Tarea**: T823 [F8] [TEAM-03]  
**Fecha**: 2026-05-27  
**Periodo de referencia**: 2026-05-22 → 2026-05-27  
**Autor**: TEAM-03 Backend (Miguel)

---

## Resumen Ejecutivo

TEAM-03 ha completado las fases F0, F1, F2, FV, F3, F4, F5, F6 y F7 del backend canónico. El sistema expone una REST API con autenticación JWT, RLS en todas las tablas, logging estructurado y observabilidad Sentry. Las fases FE y FE-2 (usuarios y enrollments completos) están parcialmente implementadas a nivel de fixtures/tests, con dependencia en configuración de roles auth.

---

## TEAM-03 → TEAM-02 (Frontend) — Estado por Fase

### F0 — Setup y Foundation

| Artefacto | Estado | Notas |
|-----------|--------|-------|
| `GET /health` | **READY** | Responde 200 con status `ok` |
| Auth JWT (ES256 + HS256 fallback) | **READY** | Header `Authorization: Bearer <token>` |
| Error format canónico | **READY** | `{ error: string, message?: string, details?: array }` |
| Base URL de la API | **READY** | `http://localhost:3000` (dev), variable `API_BASE_URL` |

### F1 — Gestión de Contenido y Progreso

| Endpoint | Estado | Contrato |
|----------|--------|---------|
| `GET /courses` | **READY** | `{ data: Course[], total: number }` |
| `GET /courses/:id` | **READY** | `Course` con módulos y lecciones |
| `POST /courses` | **READY** | Requiere rol `instructor` o `admin` |
| `PUT /courses/:id` | **READY** | Requiere rol `instructor` o `admin` |
| `DELETE /courses/:id` | **READY** | Requiere rol `admin` |
| `GET /courses/:id/modules` | **READY** | Array de módulos con lecciones |
| `GET /lessons/:id/resources` | **READY** | Array de recursos con metadata |
| `GET /users/:userId/progress` | **READY** | Array de `ProgressRecord` con `version` |
| `PUT /lessons/:lessonId/progress` | **READY** | Acepta `If-Match` header, retorna `ETag` |

### F2 — Learning Paths y Prerequisitos

| Endpoint | Estado | Contrato |
|----------|--------|---------|
| `GET /learning-paths` | **READY** | Array de paths con cursos asociados |
| `GET /learning-paths/:id` | **READY** | Path completo con prerequisitos |
| `POST /learning-paths` | **READY** | Requiere `admin` |
| `GET /courses/:id/can-enroll` | **READY** | `{ eligible: boolean, reason?: string }` |
| Anti-ciclos prerequisitos | **READY** | Trigger server-side — rechaza con error 409 |

### FV — Verificación de Avance de Recursos

| Endpoint | Estado | Contrato |
|----------|--------|---------|
| `POST /resources/:id/heartbeat` | **READY** | Body: `{ session_id, seen_at }` |
| Umbral completado automático | **READY** | Trigger 300s — completa progreso automáticamente |
| Domain event `resource.viewed` | **READY** | Un evento por sesión/recurso |

### F3 — Evaluaciones

| Endpoint | Estado | Contrato |
|----------|--------|---------|
| `GET /evaluations/:id` | **GAP** | Retorna preguntas sin `is_correct` — vista safe pendiente de fix |
| `POST /evaluations/:id/start` | **GAP** | RPC `start_evaluation_attempt` — verificar en DB |
| `POST /attempts/:id/submit` | **READY** | Edge Function `submit-evaluation` operativa |
| `GET /attempts/:id` | **GAP** | Incluir respuestas y audit events — T321C pendiente |
| `GET /evaluations/:id/gate-status` | **GAP** | RPC `evaluation_gate_status` — verificar en DB |
| Control max_attempts | **READY** | Rechaza con 422 cuando excede |
| Seguridad `is_correct` | **READY** | Vista `question_options_safe` existe y filtra |

**Nota TEAM-02**: Los endpoints de evaluaciones F3 tienen implementación parcial. Los tests que validan el comportamiento end-to-end están fallando. Usar con cautela hasta confirmar resolución de gaps.

### F4 — Gamificación

| Endpoint | Estado | Contrato |
|----------|--------|---------|
| `GET /gamification/rules` | **READY** | Reglas de XP y niveles |
| `POST /gamification/achievements/check` | **READY** | Edge Function `check-achievements` |
| `GET /certificates/:id/verify` | **READY** | RPC `verify_certificate(code)` — público, no requiere auth |
| `POST /certificates` | **READY** | Edge Function `issue-certificate` |

### F5 — IA y Notificaciones

| Endpoint | Estado | Contrato |
|----------|--------|---------|
| `POST /ai-chat` (SSE) | **READY** | Edge Function `ai-chat` con rate limiting |
| Kill-switch durante evaluación activa | **READY** | Bloquea si hay intento abierto |
| `GET /notifications` | **GAP** | Bug: query params no se parsean correctamente con Express 5 |
| `POST /notifications/:id/read` | **READY** | Marca como leída |
| `GET /notification-topics` | **READY** | Lista topics disponibles |
| Realtime subscriptions | **READY** | `REPLICA IDENTITY FULL` en tabla `notifications` |

**Nota TEAM-02 para Realtime**: Suscribir al canal `notifications:user_id=eq.<uuid>` con Supabase client. Los topics disponibles son: `progress`, `evaluation`, `achievement`, `system`, `moderation`.

### F6 — Sincronización Offline

| Artefacto | Estado | Contrato |
|-----------|--------|---------|
| `GET /sync/policy` | **READY** | Retorna config de retry y estrategia de conflictos |
| Idempotency keys | **READY** | Header `Idempotency-Key: <uuid>` soportado |
| `If-Match` / `ETag` en progreso | **READY** | Conflict detection operativo |
| Política completed-wins | **GAP** | 2 tests fallando — lógica necesita ajuste |

### F7 — Administración

| Endpoint | Estado | Contrato |
|----------|--------|---------|
| `GET /administrative/*` | **READY** | 25+ endpoints con validación Zod |
| Enforcement de roles admin | **READY** | Solo `admin` puede acceder |
| Unidades organizativas | **READY** | CRUD completo de institutional_units |

---

## TEAM-03 → TEAM-01 (Governance) — Estado por Fase

### Cumplimiento de Requisitos Funcionales

| Requisito | Cobertura | Estado |
|-----------|-----------|--------|
| FR-001: Autenticación JWT | T023A | ✅ READY |
| FR-002: RLS por usuario/rol | T022, T023 | ✅ READY |
| FR-003: CRUD contenido | T121-T124 | ✅ READY |
| FR-004: Learning paths | T221-T224 | ✅ READY |
| FR-005: Prerequisitos anti-ciclo | T223 | ✅ READY |
| FR-006: Tracking progreso | T123, TV21-TV24 | ✅ READY |
| FR-007: Evaluaciones | T321-T324, T322 | ⚠️ GAP (F3 parcial) |
| FR-008: Gamificación | T421-T424 | ✅ READY |
| FR-009: IA Chat | T521-T523 | ✅ READY |
| FR-010: Notificaciones | T524 | ⚠️ GAP (bug query params) |
| FR-011: Sync offline | T621-T622 | ⚠️ GAP (2 tests fallando) |
| FR-012: Admin enforcement | T721-T722 | ✅ READY |

### Requisitos No Funcionales

| RNF | Estado | Evidencia |
|-----|--------|-----------|
| S-RNF-001: Seguridad (RLS, JWT) | ✅ READY | `evidence-t821.md` §2 |
| S-RNF-002: No exposición de secretos | ✅ READY | `evidence-t822.md` §3 |
| S-RNF-003: Observabilidad | ✅ READY | pino + Sentry operativos |
| S-RNF-004: Trazabilidad errores | ✅ READY | `evidence-t822.md` §4 |

---

## Gaps Bloqueadores por Equipo

### Bloqueadores para TEAM-02

| Gap | Severidad | Workaround disponible |
|-----|-----------|----------------------|
| F3 evaluaciones incompletas | Alta | Usar `submit-evaluation` Edge Function directamente |
| GET /notifications bug query params | Media | Pasar `limit` y `offset` siempre en URL |
| Completed-wins policy incompleta | Baja | No usar PUT /progress con `If-Match` para completed=false |

### Gaps para TEAM-01

| Gap | Categoría | Acción requerida |
|-----|-----------|-----------------|
| F3 RPCs no verificados en DB | Técnico | TEAM-03 debe correr migration de evaluaciones del compañero |
| FE/FE-2 (usuarios/enrollments) | Funcional | Planificadas para siguiente sprint |
| Tests F3 al 0% en integration.test.ts | Cobertura | Depende de DB state correcto |

---

## Contratos de API — Consumo por TEAM-02

### Headers requeridos en todos los endpoints protegidos

```
Authorization: Bearer <supabase-jwt>
Content-Type: application/json
```

### Formato de error canónico

```json
{
  "error": "error_code_snake_case",
  "message": "Descripción legible (opcional)",
  "details": [
    { "location": "body|query|params", "path": "field.name", "message": "..." }
  ]
}
```

### Paginación

```
GET /courses?limit=20&offset=0
Respuesta: { "data": [...], "total": N }
```

### Conflict detection (F6)

```
Request: PUT /lessons/:id/progress
         If-Match: "3"

Response 200: { ..., version: 4 }
              ETag: "4"

Response 409: { error: "conflict", current_version: 5 }
```

---

## Próximos Pasos

1. **Inmediato**: Corregir bug `GET /notifications` (Express 5 `req.query`)
2. **Sprint siguiente**: Completar FE/FE-2 (T027-T030, T125-T127) — usuarios y enrollments
3. **Verificación**: Correr migration de evaluaciones del compañero y re-ejecutar tests F3
4. **Gate final**: Completar T825 (inter-phase consistency) para habilitar gate de producción
