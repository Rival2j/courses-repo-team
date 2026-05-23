# Tareas de Implementacion: TEAM-03 Backend Canonico

**Feature**: 001-team-03-backend
**Generado desde**: `specs/001-team-03-backend/spec.md`, `specs/001-team-03-backend/plan.md` y backlog canónico TEAM-03
**Idioma**: Español
**Generado**: 2026-05-22

## Cobertura Canonica
- **Preserved**: Trazabilidad F0-F8, restricciones de seguridad, RLS, auth context, evaluaciones, IA, notificaciones, sync y moderacion.
- **Expanded**: Redacción local alineada al feature slug `001-team-03-backend` con reporte de ejecución propio.
- **Merged**: Integración de gobierno TEAM-01 para handoffs/readiness y consumo por TEAM-02.
- **Dropped**: Ninguno.

## Autoridad

Este archivo deriva del backlog canónico del proyecto y mantiene el scope primario de TEAM-03 sin reinterpretar requisitos.

## Tareas

- ### F0
- [x] T021 [P] [F0] [TEAM-03] Configurar entorno Supabase, storage privado, variables, seguridad base y lineamientos PITR/backup. TR: C-9, S-RNF-001, P-7. (Completada)
- [x] T022 [P] [F0] [TEAM-03] Diseñar esquema base de datos para perfiles, unidades, cursos, modulos, lecciones, enrollments y progreso. TR: S-RF-001, S-RF-003, P-8. (Completada)
- [x] T023 [P] [F0] [TEAM-03] Implementar RLS inicial, claims JWT y camino server-side autorizado para mutacion de roles. TR: C-6, C-9, S-RNF-001, S-RNF-002. (Completada - migraciones y RPC agregadas)
- [x] T026 [P] [F0] [TEAM-03] Configurar MCP de Supabase para el proyecto, restringir la operacion al schema `cursos` por defecto y validar la conexion con una prueba ejecutiva. TR: C-9, S-RNF-001, S-RNF-003. (Completada)
- [ ] T024 [P] [F0] [TEAM-03] Crear API Gateway base con DTOs canonicos, validacion Zod y logging estructurado inicial. TR: C-4, C-13, S-RNF-003, P-7.
- [ ] T025 [P] [F0] [TEAM-03] Configurar Sentry/logging para backend y Edge Functions, correlacionando request y usuario. TR: C-10, S-RNF-003, P-14.

### F1
- [ ] T121 [P] [F1] [TEAM-03] Implementar CRUD de cursos, modulos y lecciones respetando DTOs canonicos y enforcement por rol. TR: C-4, C-6, S-RF-001.
- [ ] T122 [P] [F1] [TEAM-03] Implementar CRUD de recursos externos por leccion, incluyendo deteccion de proveedor y metadata minima. TR: C-8, S-RF-001.
- [ ] T123 [P] [F1] [TEAM-03] Implementar tracking de progreso server-side y contratos para sincronizar el estado del alumno. TR: C-5, S-RF-001, P-8.
- [ ] T124 [P] [F1] [TEAM-03] Definir reglas de acceso a contenido y estados bloqueados compatibles con prerequisitos futuros. TR: C-5, S-RF-003.

### F2
- [ ] T221 [P] [F2] [TEAM-03] Implementar modelo de learning paths, prerequisitos y asociaciones de cursos. TR: S-RF-003, P-8. (Reabierta: falta cierre end-to-end)
- [ ] T222 [P] [F2] [TEAM-03] Implementar RPC `can_enroll(user_id, course_id)` y contratos asociados. TR: C-5, S-RF-003.
- [ ] T223 [P] [F2] [TEAM-03] Implementar deteccion de ciclos de prerequisitos mediante CTE recursiva y validaciones de integridad. TR: S-RF-003, P-8. (Reabierta: falta cierre end-to-end)
- [ ] T224 [P] [F2] [TEAM-03] Implementar reglas server-side de unlock y progresion sobre enrollments y rutas secuenciales. TR: C-5, S-RF-003.

### F3
- [ ] T321 [P] [F3] [TEAM-03] Modelar evaluaciones, preguntas, opciones e intentos con estados auditables. TR: C-5, S-RF-002. (Reabierta: falta cierre end-to-end)
- [ ] T322 [P] [F3] [TEAM-03] Implementar Edge Function `submit-evaluation` con grading server-side y persistencia de resultados. TR: C-5, C-9, S-RF-002.
- [ ] T323 [P] [F3] [TEAM-03] Garantizar que `evaluation_options.is_correct` nunca viaje al cliente ni por endpoints directos ni indirectos. TR: C-5, C-9, S-RNF-002.
- [ ] T324 [P] [F3] [TEAM-03] Implementar control de intentos, score minimo, bloqueo de progresion y auditoria de resultados. TR: C-5, S-RF-002, S-RF-003.

### F4
- [ ] T421 [P] [F4] [TEAM-03] Implementar CRUD de reglas de XP, niveles, badges, trofeos y overrides jerarquicos. TR: S-RF-003, P-8.
- [ ] T422 [P] [F4] [TEAM-03] Implementar Edge Function `check-achievements` para calculo server-side de logros. TR: C-4, C-9, S-RF-003.
- [ ] T423 [P] [F4] [TEAM-03] Implementar CRUD/versionado de plantillas de certificados y diplomas. TR: S-RF-003, P-8.
- [ ] T424 [P] [F4] [TEAM-03] Implementar Edge Function `issue-certificate` y RPC `verify_certificate(code)`. TR: C-9, S-RF-003.

### F5
- [ ] T521 [P] [F5] [TEAM-03] Implementar Edge Function `ai-chat` con SSE, JWT, rate limiting y logging estructurado. TR: C-7, C-9, S-RF-004.
- [ ] T522 [P] [F5] [TEAM-03] Implementar context builder usando curso, leccion, recursos e historial conversacional permitido. TR: C-7, S-RF-004.
- [ ] T523 [P] [F5] [TEAM-03] Implementar kill-switch automatico durante evaluaciones activas sin override desde frontend. TR: C-7, S-RF-004, S-RNF-002.
- [ ] T524 [P] [F5] [TEAM-03] Implementar modelo y emision selectiva de notificaciones via Supabase Realtime. TR: S-RF-005, S-RNF-003. (Reabierta: falta cierre end-to-end)

### F6
- [ ] T621 [P] [F6] [TEAM-03] Garantizar idempotencia y reintentos seguros en endpoints criticos para flujos offline/sync. TR: C-9, S-RNF-003.
- [ ] T622 [P] [F6] [TEAM-03] Definir politicas de retry y resolucion de conflictos para sincronizacion diferida. TR: S-RNF-003, P-12.

### F7
- [ ] T721 [P] [F7] [TEAM-03] Implementar enforcement server-side de scopes administrativos, moderacion y configuraciones globales. TR: C-6, C-9, S-RNF-001.
- [ ] T722 [P] [F7] [TEAM-03] Implementar contratos para gestion de unidades organizativas, branding, plantillas y politicas institucionales. TR: S-RF-005, P-8.

### F8
- [ ] T821 [P] [F8] [TEAM-03] Completar suite Vitest, integracion, E2E, security review y validacion de observabilidad. TR: C-9, C-10, S-RNF-001, S-RNF-003.
- [ ] T822 [P] [F8] [TEAM-03] Validar metricas Lighthouse, CSP, no exposicion de secretos y trazabilidad final de errores criticos. TR: C-9, S-RNF-002, S-RNF-004.
- [ ] T823 [F8] [TEAM-03] Publicar evidencia de handoff/readiness TEAM-03->TEAM-02 y TEAM-03->TEAM-01 con estado explicito por fase (`ready/gap/blocked`). TR: FR-018, SC-005.
- [ ] T824 [F8] [TEAM-03] Registrar ADRs de cambios relevantes de contrato/alcance y vincularlos al cierre de fase con evidencia verificable. TR: FR-019, SC-006.
- [ ] T825 [F8] [TEAM-03] Ejecutar validacion formal de consistencia inter-fase (entrada/salida por fase) y documentar resultado para gate final. TR: FR-020, SC-008.

## Estado

Backlog local generado para TEAM-03 en la feature `001-team-03-backend`.
Este archivo es derivado y operativo; la fuente canónica del backlog sigue siendo `.drfic/diana-sdk/projects/diana-learning-app/initiatives/001-learning-app/teams/TEAM-03/tasks.md`.

## Evidencia T021

- `supabase/config.toml` actualizado: buckets `private` y `backups` añadidos.
- `.env.example` creado en repo raíz.
- `docs/supabase-setup.md` creado con instrucciones y recomendaciones de PITR/backups.

## Evidencia T022

- `db/migrations/001_init.sql` creado con esquema base (profiles, courses, modules, lessons, enrollments, progress, evaluations, questions, options).
- `docs/db-schema.md` creado con diagrama ER y mapeo a requisitos.

## Evidencia T023

- `db/migrations/002_profiles_rls.sql` creado con políticas iniciales para `profiles`.
- `db/migrations/003_set_user_role.sql` creado con RPC `set_user_role(target_user, new_role)`.
- `docs/db-rls.md` creado con guía de despliegue seguro y recomendaciones.

## Evidencia T026

- `.mcp.json` configurado en el root del proyecto con `project_ref=xqtfovmmndsloqnyqhfv`.
- `.github/copilot-instructions.md` agregado para fijar `cursos` como schema operativo por defecto.
- `projects/rest-api/lms_api/.env` y `tempo/.env` actualizados con `search_path=cursos` en la connection string.
- Prueba de conexión ejecutada con `pg` y verificada sobre `cursos`:
	- `current_schema() = cursos`
	- consulta de validacion sobre `cursos.profiles` y `cursos.courses` completada con exito.

## Evidencia T221/T223/T321/T524

- `supabase/migrations/20260522000004_domain_expansion.sql` creado con modelo de datos para:
	- Learning paths y prerequisitos (`learning_paths`, `learning_path_courses`, `course_prerequisites`).
	- Detección de ciclos por CTE recursiva (`course_prerequisite_paths`, `course_prerequisite_cycles`).
	- Modelo de evaluaciones auditable (`evaluation_policies`, `evaluation_attempt_answers`, `evaluation_attempt_events`).
	- Modelo de notificaciones selectivas (`notification_topics`, `notification_subscriptions`, `notifications`, `notification_deliveries`, `domain_events`).

## Reapertura por ejecución parcial (solo modelo DB)

Las tareas T221/T223/T321/T524 se consideran **parcialmente implementadas** hasta completar API/RPC/RLS/pruebas.

- [ ] T221A [F2] Implementar endpoints/servicios para CRUD y asociación de learning paths con validaciones de negocio.
- [ ] T221B [F2] Implementar políticas RLS para tablas de rutas/prerequisitos y pruebas de acceso por rol.
- [ ] T221C [F2] Implementar pruebas de integración (casos felices, autorización, errores de dominio) para learning paths.

- [ ] T223A [F2] Implementar validación transaccional anti-ciclos en alta/edición de prerequisitos (bloqueo de escritura inválida).
- [ ] T223B [F2] Exponer contrato server-side para consulta de ruta/ciclos con respuestas tipadas.
- [ ] T223C [F2] Implementar pruebas de regresión para ciclos directos/indirectos y concurrencia.

- [ ] T321A [F3] Implementar acceso server-side a evaluaciones/ítems sin exponer respuestas correctas al cliente.
- [ ] T321B [F3] Implementar políticas RLS para intentos, respuestas y eventos de auditoría.
- [ ] T321C [F3] Implementar pruebas E2E de flujo de evaluación (inicio, envío, scoring, auditoría).

- [ ] T524A [F5] Implementar emisión selectiva en tiempo real por tópico/segmento con filtros por rol y curso.
- [ ] T524B [F5] Implementar workers/funciones de entrega y tracking de estado (`queued/sent/read/failed`).
- [ ] T524C [F5] Implementar pruebas de integración Realtime + fallback y observabilidad (latencia/errores).
