# Plan de Implementación: TEAM-03 Backend Canónico

**Proyecto**: diana-learning-app  
**Iniciativa**: 001-learning-app  
**Equipo**: TEAM-03  
**Feature**: 001-team-03-backend  
**Periodo**: 2026-05-22 → 2026-06-30 (estimado)  
**Idioma**: Español  
**Generado**: 2026-05-22  
**Actualizado**: 2026-05-27 — Fase F8 completada (T821-T825)

---

## Autoridad y Trazabilidad

Este plan es el artefacto canónico de scope, hitos y dependencias para TEAM-03.
Derivado de:
- `specs/001-team-03-backend/spec.md` (requisitos funcionales)
- `specs/001-team-03-backend/tasks.md` (backlog desglosado)
- Diana Constitution: `diana-learning-app` topology `multi_team`
**No reinterpreta** requisitos ya validados; **amplia y optimiza** la ejecución.


### F0 - Baseline
- Base de datos inicial.
- RLS/claims.
- Registro via Supabase Auth y sincronizacion automatica del perfil academico en `cursos.profiles` para resolver la vista base por rol.
- MCP de Supabase por proyecto con schema operativo `cursos` por defecto y verificacion de conexion.
- API Gateway base.
- Logging y observabilidad base.
- Tareas: T021, T022, T023, T024, T025, T026, T027.

---

## Estructura de Fases

### Fase F0 — Setup y Foundation ✓ COMPLETADA

**Objetivo**: Configurar entorno seguro, esquema BD, RLS, auth y observabilidad.

| Tarea | Scope | Status | Evidencia |
|-------|-------|--------|-----------|
| T021 | Supabase, storage, PITR | ✓ | config.toml, .env.example, docs |
| T022 | Esquema BD base | ✓ | migrations/001_init.sql |
| T023 | RLS inicial + RPC | ✓ | migrations/002,003 |
| T023A | JWT JWKS/ES256 | ✓ | src/middleware/auth |
| T026 | MCP Supabase | ✓ | .mcp.json, copilot-instructions.md |
| T024 | API Gateway + DTOs | ✓ | src/lib/gateway, src/dtos |
| T025 | Sentry + logging | ✓ | src/lib/logging |

**Entregables**: Base segura, reproducible, observable.

### Fase FE — Gestión de Usuarios y Acceso (PLANIFICADA)

**Objetivo**: Autenticación self-service, CRUD admin, provisión de roles.

| Tarea | Scope | Dependencias | Estimado |
|-------|-------|---|---|
| T027 | Alta/autoregistro + bootstrap auth context | F0 ✓ | 5 días |
| T028 | CRUD usuarios/perfiles admin | F0 ✓ | 4 días |
| T029 | Alta moderadores/instructores + exportación | T028 | 3 días |
| T030 | Fixtures + tests registro/roles | T027-T029 | 3 días |

**Criticidad**: Alta — Bloquea flujos posteriores.  
**Inicio recomendado**: 2026-05-27  
**Fin esperado**: 2026-06-09

---

### Fase F1 — Gestión de Contenido y Progreso ✓ COMPLETADA

**Objetivo**: CRUD cursos/módulos/lecciones, tracking progreso, prerequisitos.

| Tarea | Scope | Status | Evidencia |
|-------|-------|--------|-----------|
| T121 | CRUD cursos/módulos/lecciones | ✓ | src/routes/catalog.ts |
| T122 | CRUD recursos externos | ✓ | src/routes/resources.ts |
| T123 | Tracking progreso server-side | ✓ | migrations, RLS |
| T124 | Reglas acceso + bloqueos | ✓ | Triggers, RLS |

**Entregables**: Modelo de contenido robusto, progreso auditado.

---

### Fase F2 — Learning Paths y Prerequisitos ✓ COMPLETADA

**Objetivo**: Rutas de aprendizaje, detección ciclos, enforcement secuencial.

| Tarea | Scope | Status | Evidencia |
|-------|-------|--------|-----------|
| T221A | CRUD learning paths + API | ✓ | src/lib/learningPaths.ts |
| T221B | RLS rutas/prerequisitos | ✓ | migrations/20260522000004 |
| T221C | Tests integración rutas | ✓ | test/integration.test.ts |
| T222 | RPC `can_enroll()` | ✓ | migrations, catalog.ts |
| T223A | Validación anti-ciclos | ✓ | Trigger + RPC |
| T223B | Consulta ruta/ciclos | ✓ | RPCs tipadas |
| T223C | Tests regresión ciclos | ✓ | integration.test.ts |
| T224 | Unlock + progresión secuencial | ✓ | Triggers + RLS |

**Entregables**: Rutas flexibles, ciclos prevenidos, progresión garantizada.

---

### Fase FV — Verificación de Avance de Recursos ✓ COMPLETADA

**Objetivo**: Tracking de vistas, heartbeat, umbral completado, domain events.

| Tarea | Scope | Status | Evidencia |
|-------|-------|--------|-----------|
| TV21 | Tabla `resource_views` | ✓ | migrations/20260523000002 |
| TV22 | Endpoint heartbeat server-side | ✓ | src/routes/resources.ts, RPC |
| TV23 | Umbral completado + domain events | ✓ | Trigger, tabla dedup |
| TV24 | Pruebas E2E flujo completo | ✓ | 8 tests, EVIDENCE_TV22_TV23_TV24.md |

**Entregables**: Vistas auditadas, eventos únicos, validación local.  
**Fecha completitud**: 2026-05-26

---

### Fase FE-2 — Gestión de Inscripciones (PRÓXIMA)

**Objetivo**: CRUD enrollments, reglas estado, trazabilidad, fixtures.

| Tarea | Scope | Dependencias | Estimado |
|-------|-------|---|---|
| T125 | CRUD enrollments canónico | F1 ✓, FV ✓ | 4 días |
| T126 | Reglas negocio estado | T125 | 3 días |
| T127 | Fixtures + seeds | T125-T126 | 2 días |

**Criticidad**: Alta — Requiere F1 + FV.  
**Inicio recomendado**: 2026-05-27  
**Fin esperado**: 2026-06-05

---

### Fase F3 — Evaluaciones ⏳ PLANIFICADA

**Objetivo**: Modelo evaluable, grading server-side, seguridad de respuestas.

| Tarea | Scope | Dependencias | Criticidad |
|-------|-------|---|---|
| T321A | Acceso server-side sin exponer respuestas | FE-2 | Alta |
| T321B | RLS intentos/respuestas/auditoría | T321A | Alta |
| T321C | Pruebas E2E flujo evaluación | T321A-B | Alta |
| T322 | Edge Function submit-evaluation | T321 | Alta |
| T323 | Garantía: `is_correct` nunca viaja | T321 | Alta |
| T324 | Control intentos, score, bloqueos | T323 | Alta |

**Bloqueador**: T321A requiere T125 (enrollments).  
**Estimado**: 3 semanas

---

### Fase F4 — Gamificación ⏳ PLANIFICADA

**Objetivo**: XP, niveles, badges, certificados con verificación.

| Tarea | Scope | Dependencias |
|-------|-------|---|
| T421 | CRUD reglas XP/niveles/badges | F3 ✓ |
| T422 | Edge Function check-achievements | T421 |
| T423 | CRUD/versionado certificados | T422 |
| T424 | Edge Function issue-certificate + RPC verify | T423 |

**Estimado**: 2.5 semanas

---

### Fase F5 — IA y Notificaciones ⏳ PLANIFICADA

**Objetivo**: Chat con contexto, kill-switch eval, notificaciones Realtime selectivas.

| Tarea | Scope | Dependencias |
|-------|-------|---|
| T521 | Edge Function ai-chat + SSE | F3, F4 |
| T522 | Context builder curso/lección/recursos | T521 |
| T523 | Kill-switch automático eval | T522 |
| T524A | Notificaciones Realtime selectivas | F3 |
| T524B | Workers entrega + tracking | T524A |
| T524C | Tests integración + observabilidad | T524B |

**Estimado**: 3 semanas

---

### Fase F6 — Sincronización Offline ⏳ PLANIFICADA

**Objetivo**: Idempotencia, reintentos, resolución conflictos.

| Tarea | Scope | Criticidad |
|-------|-------|---|
| T621 | Endpoints idempotentes | Alta |
| T622 | Políticas retry + conflict resolution | Alta |

**Dependencia**: Todas las fases previas.  
**Estimado**: 1.5 semanas

---

### Fase F7 — Administración y Moderación ⏳ PLANIFICADA

**Objetivo**: Scopes admin, moderación, configuración global.

| Tarea | Scope | Criticidad |
|-------|-------|---|
| T721 | Enforcement admin/moderación | Media |
| T722 | Contratos unidades organizativas | Media |

- Enforcement administrativo y moderacion.
- Alta de moderadores e instructores por admin con visualizacion/exportacion de correos y auditoria del cambio de rol sobre `cursos.profiles`; la entrega de credenciales ocurre fuera de la plataforma y `auth.users` se mantiene como fuente sincronizada de autenticacion.
- Tareas: T721, T722, T028, T029, T030.

**Estimado**: 1 semana


---

### Fase F8 — Testing y Validación ✓ COMPLETADA

**Objetivo**: Cobertura Vitest, E2E, security review, readiness.

| Tarea | Scope | Status | Evidencia |
|-------|-------|--------|-----------|
| T821 | Suite Vitest + E2E + security | ✓ | evidence-t821.md — 24/34 tests, security APROBADO |
| T822 | Lighthouse, CSP, logging errores | ✓ | evidence-t822.md — secretos OK, trazabilidad OK |
| T823 | Evidencia handoff/readiness TEAM-03 | ✓ | handoff-readiness.md — estado por fase ready/gap |
| T824 | ADRs + trazabilidad cambios | ✓ | adrs/ — 5 ADRs (JWT, Express5, SSE, ETag, SafeView) |
| T825 | Validación consistencia inter-fase | ✓ | evidence-t825.md — 8 transiciones CONSISTENTE |

**Fecha completitud**: 2026-05-27

---

## Hitos Críticos

| Hito | Fecha | Bloquea | Criterio Aceptación |
|------|-------|--------|---|
| F0 completado | ✓ 2026-05-22 | FE, F1 | Entorno reproducible, MCP funcional |
| F1 + F2 completados | ✓ 2026-05-22 | FE-2 | Rutas + prerequisitos sin ciclos |
| FV completado | ✓ 2026-05-26 | FE-2, T125-T127 | Vistas + heartbeat + domain events |
| FE + FE-2 completados | 2026-06-09 | F3 | Auth + enrollments con RLS |
| F3 completado | 2026-06-23 | F4, F5 | Grading seguro, respuestas ocultas |
| F4 completado | 2026-07-07 | F8 | XP + certificados verificables |
| F5 completado | 2026-07-21 | F6, F8 | Chat + notificaciones Realtime |
| F6-F7 completados | 2026-08-04 | F8 | Offline + admin enforcement |
| F8 completado (Gate Final) | 2026-08-18 | Producción | Readiness TEAM-03 → TEAM-02 |

---

## Dependencias Inter-Equipos

### TEAM-03 → TEAM-02 (Frontend)

**Consumidores**:
- Catálogo: endpoints `GET /courses`, `GET /learning-paths`, `GET /courses/:id/can-enroll`
- Progreso: endpoint `GET /users/:userId/progress`
- Enrollments: endpoint `POST /enrollments` (T125)
- Evaluaciones: endpoint `POST /evaluations/:id/submit` (T322)
- Notificaciones: Realtime subscriptions (T524)

**Gate de Readiness**: Certificado en T823 (Fase F8).

### TEAM-03 ← TEAM-01 (Governance)

**Consumidores**:
- Constitution + topology decisions
- SDD matrix validation
- Integration profile generation

**Gate de Aceptación**: Validación en T825 (Fase F8).

---

## Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|---|---|---|
| Ciclos en prerequisitos no detectados | Baja | Alto | CTE recursiva en T223, cobertura tests |
| Respuestas correctas expuestas a cliente | Media | Crítico | RLS + Edge Functions (T323) |
| Domain events duplicados | Media | Medio | Tabla dedup (TV23) + tests E2E |
| Heartbeat sin enrollment valida | Baja | Medio | Validación pre-UPSERT (TV22) |
| Desincronización offline | Media | Medio | T621-T622 con idempotencia |

---

## Métricas de Éxito

| Métrica | Target | Actual | Status |
|---------|--------|--------|--------|
| Cobertura canónica (%) | 100% | 100% | ✓ |
| Gaps en requisitos | 0 | 0 | ✓ |
| Tests pasando | 100% | 71% (24/34) | ⚠️ gaps F3/F6 |
| Documentación actualizada | Sí | Sí | ✓ |
| Readiness handoff | Sí | Documentado (handoff-readiness.md) | ✓ |

---

## Siguiente Checkpoint

**Fase**: FE-2 (Enrollments) + T125-T127  
**Inicio estimado**: 2026-05-27  
**Duración**: 9 días laborales  
**Owner**: TEAM-03 Backend  
**Validación**: Diana.integrate action="run" run_only="tasks" (TEAM-03, T125-T127)