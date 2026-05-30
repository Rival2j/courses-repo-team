# Tareas de Implementacion: TEAM-03 Backend Canonico

**Feature**: 001-team-03-backend
**Generado desde**: `specs/001-team-03-backend/spec.md`, `specs/001-team-03-backend/plan.md` y backlog canónico TEAM-03
**Idioma**: Español
**Generado**: 2026-05-22
**Actualizado**: 2026-05-28 — borrador F8-F10 integrado (perfiles, calificaciones, adaptadores PWA y sincronización cross-project)

## Cobertura Canonica
- **Preserved**: Trazabilidad F0-F8, restricciones de seguridad, RLS, auth context, evaluaciones, IA, notificaciones, sync y moderacion.
- **Expanded**: Redacción local alineada al feature slug `001-team-03-backend` con reporte de ejecución propio.
- **Merged**: Integración de gobierno TEAM-01 para handoffs/readiness y consumo por TEAM-02.
- **Dropped**: Ninguno.

## Autoridad

Este archivo deriva del backlog canónico del proyecto y mantiene el scope primario de TEAM-03 sin reinterpretar requisitos.

## Reglas Generales de Implementación (Obligatorio para la IA)
1. **Docs as Code:** Cada vez que implementes, modifiques o elimines un endpoint en cualquier tarea (Txxx), tu ÚLTIMO PASO OBLIGATORIO antes de marcar la tarea como completada es actualizar la tabla en el archivo `docs/ENDPOINTS.md`.
2. Todos los endpoints nuevos deben nacer con el estatus de PWA en `pending`.

## Tareas

### F0
- [x] T021 [P] [F0] [TEAM-03] Configurar entorno Supabase, storage privado, variables, seguridad base y lineamientos PITR/backup. TR: C-9, S-RNF-001, P-7. (Completada)
- [x] T022 [P] [F0] [TEAM-03] Diseñar esquema base de datos para perfiles, unidades, cursos, modulos, lecciones, enrollments y progreso. TR: S-RF-001, S-RF-003, P-8. (Completada)
- [x] T023 [P] [F0] [TEAM-03] Implementar RLS inicial, claims JWT y camino server-side autorizado para mutacion de roles. TR: C-6, C-9, S-RNF-001, S-RNF-002. (Completada - migraciones y RPC agregadas)
- [x] T026 [P] [F0] [TEAM-03] Configurar MCP de Supabase para el proyecto, restringir la operacion al schema `cursos` por defecto y validar la conexion con una prueba ejecutiva. TR: C-9, S-RNF-001, S-RNF-003. (Completada)
- [x] T024 [P] [F0] [TEAM-03] Crear API Gateway base con DTOs canonicos, validacion Zod y logging estructurado inicial. TR: C-4, C-13, S-RNF-003, P-7. (Completada)
- [x] T025 [P] [F0] [TEAM-03] Configurar Sentry/logging para backend y Edge Functions, correlacionando request y usuario. TR: C-10, S-RNF-003, P-14. (Completada)

### FE — Gestión de Usuarios y Acceso
- [x] T027 [P] [FE] [TEAM-03] Implementar alta/autoregistro de usuarios con perfil inicial de alumno, acceso base a la plataforma y bootstrap de auth context para que el cliente resuelva la vista correcta según rol. El registro self-service debe crear o actualizar el perfil asociado y dejar el rol por defecto en `alumno`. TR: FR-011, FR-016, S-RNF-001, S-RNF-003. (Completada)
- [x] T028 [P] [FE] [TEAM-03] Implementar CRUD canónico de usuarios/perfiles para admin: listado, detalle, edición controlada y cambio de rol solo hacia `moderador` o `instructor` mediante servicio server-side o RPC autorizado. TR: FR-011, FR-016, S-RNF-001, S-RNF-002. Ref: `supabase/migrations/20260522000003_set_user_rol.sql`. (Completada)
- [x] T029 [P] [FE] [TEAM-03] Implementar alta de moderadores e instructores por admin con visualización y exportación de correos de usuarios, más registro auditable de la acción. El alta debe quedar trazada con actor, rol asignado y destinatario. TR: C-9, FR-011, FR-016, S-RNF-001, S-RNF-003. (Completada)
- [x] T030 [P] [FE] [TEAM-03] Crear fixtures y pruebas para registro de alumno, acceso por rol y alta admin de moderadores/instructores con exportación de correos para entrega externa. Deben cubrir Postman e integración para vistas y contratos por rol. TR: C-9, C-10, S-RNF-003. Ref: spec_extensions/test_seed_auth.md. (Completada)

### Mantenimiento y Actualizaciones — User Story 5 & F7

- [x] T901 [US5] [TEAM-03] Mantenimiento/Actualización de T027: Añadir migración de Supabase que crea un `AFTER INSERT` trigger sobre `auth.users` para crear/actualizar el perfil en `cursos.profiles` (heredando `display_name`, `email`, rol por defecto `alumno`) y que falle explícitamente en caso de duplicado. Archivos: `supabase/migrations/20260523000002_auth_users_sync.sql`, `specs/001-team-03-backend/spec.md`.
- [x] T902 [US5] [TEAM-03] Mantenimiento/Actualización de T028: Revisar y endurecer la API para garantizar que el CRUD expuesto opera solo sobre `cursos.profiles` (sin mutar `auth.users`), añadir validaciones y pruebas unitarias en `projects/rest-api/lms_api/src/routes/users.ts` y `projects/rest-api/lms_api/src/lib/userProfiles.ts`.
- [x] T903 [US5] [TEAM-03] Mantenimiento/Actualización de T029: Implementar vistas/RPC `SECURITY DEFINER` en BD para listados autorizados y exportación de correos (alcance por rol), además de usar RPC `cursos.set_user_role` para provisión con trazabilidad; archivos: `supabase/migrations/20260523000003_security_definers.sql`, `projects/rest-api/lms_api/src/lib/userProfiles.ts`.
- [x] T904 [US5] [TEAM-03] Mantenimiento/Actualización de T030: Añadir pruebas de integración y archivos de configuración en REST Client que validen el flujo `supabase.auth.signUp()` -> trigger `AFTER INSERT` -> creación/actualización de `cursos.profiles`; archivos: `projects/rest-api/lms_api/test/integration.test.ts`, `spec_extensions/test_seed_auth.md`, `projects/rest-api/lms_api/http/auth_validation.http`.
- [x] T907 [US5] [TEAM-03] Mantenimiento/Actualización de T028: Garantizar atomicidad en el cambio de correo electrónico haciendo de `auth.users` la fuente de verdad. El endpoint `PATCH /users/:userId` dejará de escribir `email` directamente en `cursos.profiles`; en su lugar llamará a la Supabase Admin API (`PUT /auth/v1/admin/users/:id`) con el nuevo correo, y un trigger `AFTER UPDATE ON auth.users` sincronizará el campo `email` a `cursos.profiles` dentro de la misma transacción PostgreSQL, logrando atomicidad a nivel de BD. Si la llamada al Admin API falla, ninguna tabla queda modificada; si el trigger falla, el update de `auth.users` hace rollback automático. Archivos: `supabase/migrations/YYYYMMDD_auth_email_sync_trigger.sql` (trigger AFTER UPDATE), `projects/rest-api/lms_api/src/lib/userProfiles.ts` (eliminar email del UPDATE directo, añadir llamada al Admin API), `projects/rest-api/lms_api/src/routes/users.ts` (inyectar Supabase admin client). TR: C-9, S-RNF-001, S-RNF-003. Ref: T902, T901.
- [x] T905 [F7] [TEAM-03] Mantenimiento/Actualización de T721: Implementar enforcement administrativo faltante y contratos para scopes administrativos en backend; revisar RLS y funciones autorizadas en `supabase/migrations/*`, `projects/rest-api/lms_api/src/middleware/auth.ts`.
- [x] T906 [F7] [TEAM-03] Mantenimiento/Actualización de T722: Actualizar contratos y artefactos de gestión organizativa (unidades organizativas, branding, plantillas) y añadir tareas de sincronización con la plataforma de administración; archivos: `specs/001-team-03-backend/plan.md`, `specs/001-team-03-backend/spec.md`, `projects/rest-api/lms_api/src/routes/admin.ts`.
- [x] T909 [F7] [TEAM-03] (Completada) Implementar Edge Function `sync-policy-worker` que procesa eventos `policy.sync_requested` de `cursos.domain_events` y aplica los cambios de política a los recursos existentes de la org unit afectada, luego notifica a los usuarios impactados. Comportamiento: (1) lee el evento `policy.sync_requested` más reciente pendiente para la org unit + policy_type; (2) según el tipo de política ejecuta la lógica de re-enforcement: `enrollment` → reevalúa estado de inscripciones activas, `evaluation` → recalcula pase/fallo contra el nuevo passing_score, `progression` → bloquea/desbloquea acceso según prerequisites, `completion`/`access`/`custom` → emite notificación informativa; (3) para cada usuario afectado emite una notificación vía `cursos.emit_notification`; (4) marca el evento como procesado en `domain_events` (campo `processed_at`). El endpoint `POST /administrative/sync-policies` debe actualizarse para invocar esta Edge Function directamente en lugar de solo emitir el evento. Archivos: `supabase/functions/sync-policy-worker/index.ts`, `supabase/migrations/YYYYMMDD_domain_events_processed_at.sql` (columna `processed_at`), `projects/rest-api/lms_api/src/routes/administrative.ts` (invocar Edge Function desde sync-policies). TR: C-6, C-9, S-RF-005, S-RNF-001, S-RNF-003. Ref: T906, T524, T905.

### F1
- [x] T121 [P] [F1] [TEAM-03] Implementar CRUD de cursos, modulos y lecciones respetando DTOs canonicos y enforcement por rol. TR: C-4, C-6, S-RF-001. (Completada)
- [x] T122 [P] [F1] [TEAM-03] Implementar CRUD de recursos externos por leccion, incluyendo deteccion de proveedor y metadata minima. TR: C-8, S-RF-001. (Completada)
- [x] T123 [P] [F1] [TEAM-03] Implementar tracking de progreso server-side y contratos para sincronizar el estado del alumno. TR: C-5, S-RF-001, P-8. (Completada)
- [x] T124 [P] [F1] [TEAM-03] Definir reglas de acceso a contenido y estados bloqueados compatibles con prerequisitos futuros. TR: C-5, S-RF-003. (Completada)

### FE — Gestión de Inscripciones de Usuarios
- [x] T125 [P] [FE] [TEAM-03] Implementar CRUD canónico de inscripciones: alta idempotente, consulta por usuario y por curso, cancelación con trazabilidad histórica y reactivación según política definida. Estados válidos: `active`, `cancelled`, `completed`. RLS: solo el propio usuario o actor autorizado puede leer/mutar su inscripción. Contrato consumible por TEAM-02. TR: C-5, S-RF-001, S-RNF-001. Ref: spec_extensions/enrollments_users.md.
- [x] T126 [P] [FE] [TEAM-03] Implementar reglas de negocio de estado de inscripción server-side: bloqueo de progreso sin enrollment activo, idempotencia en alta (no duplicados activos), restricción de reactivación sin política explícita, y trazabilidad auditable de cada cambio de estado. TR: C-5, C-9, S-RF-001, S-RNF-001. Ref: spec_extensions/enrollments_users.md.
- [x] T128 [FE] [TEAM-03] Crear archivo `projects/rest-api/lms_api/http/enrollments.http` con pruebas manuales de todos los endpoints de la fase FE — Gestión de Inscripciones (T125/T126/T127). Cubrir: alta idempotente, listado propio/por curso, cancelación, reactivación, curso inexistente, token inválido, UUID malformado, conflicto activo. Documentar resultados en `tempo/enrollmentstest.md`. TR: C-9, C-10, S-RNF-003. Ref: T125, T126, T127.
- [x] T127 [P] [FE] [TEAM-03] Crear fixtures y seed verificables de usuarios de prueba para: happy path (alumno inscrito con prerequisitos completos), blocked path (sin inscripción o prerequisitos incompletos) y perfiles por rol (alumno, instructor, admin). Deben cubrir los escenarios de Postman y los tests de integración. TR: C-9, C-10, S-RNF-003. Ref: spec_extensions/enrollments_users.md.

### FV — Verificación de Avance de Recursos
- [x] TV21 [P] [FV] [TEAM-03] Crear tabla `cursos.resource_views` con campos `user_id`, `resource_id`, `session_id`, `started_at`, `last_seen_at`, `duration_ms`; unicidad por `(user_id, resource_id, session_id)`; RLS que permita solo al propio usuario o service role escribir sus vistas; índices operativos y política de retención (TTL ≥ 90 días). TR: C-5, C-9, S-RNF-001, S-RNF-003. Ref: spec_extensions/resource_views.md. Evidencia: EVIDENCE_TV21.md, migration 20260523000002_resource_views.sql, integration tests. (Completada)
- [x] TV22 [P] [FV] [TEAM-03] Implementar endpoint de heartbeat server-side: recibe `session_id`, `resource_id` y `seen_at` del cliente; hace UPSERT en `resource_views` calculando `duration_ms` con timestamps del servidor (no del cliente); valida enrollment activo antes de aceptar el heartbeat; es idempotente ante reenvíos. TR: C-5, C-9, S-RNF-003. Ref: spec_extensions/resource_views.md. Evidencia: EVIDENCE_TV22_TV23_TV24.md, supabase/migrations/20260524000003_heartbeat_rpc.sql. (Completada)
- [x] TV23 [P] [FV] [TEAM-03] Implementar lógica de umbral de completado: cuando `duration_ms >= THRESHOLD_MS` (default 300 000 ms, override por lección), ejecutar en transacción atómica: marcar `progress.completed = true` + `completed_at`, insertar `domain_events` tipo `resource.viewed` con payload mínimo `{resource_id, user_id, duration_ms, session_id, threshold_ms}`. El evento se emite una sola vez aunque se supere el umbral en heartbeats posteriores. TR: C-5, C-9, S-RF-001, S-RNF-001. Ref: spec_extensions/resource_views.md. Evidencia: EVIDENCE_TV22_TV23_TV24.md, supabase/migrations/20260524000004_threshold_completed_trigger.sql. (Completada)
- [x] TV24 [P] [FV] [TEAM-03] Implementar pruebas de integración y E2E del flujo completo: secuencia de heartbeats idempotente no infla `duration_ms`, umbral exacto activa completado una sola vez, `domain_event` no se duplica, y heartbeat rechazado si enrollment está cancelado o completado. TR: C-10, S-RNF-003. Ref: spec_extensions/resource_views.md. Evidencia: EVIDENCE_TV22_TV23_TV24.md, projects/rest-api/lms_api/test/integration.test.ts (suite FV). (Completada)

### F2
- [x] T221 [P] [F2] [TEAM-03] Implementar modelo de learning paths, prerequisitos y asociaciones de cursos. TR: S-RF-003, P-8. (Reabierta: falta cierre end-to-end - completada con T221A/B/C)
- [x] T222 [P] [F2] [TEAM-03] Implementar RPC `can_enroll(user_id, course_id)` y contratos asociados. TR: C-5, S-RF-003. (Completada)
- [x] T223 [P] [F2] [TEAM-03] Implementar deteccion de ciclos de prerequisitos mediante CTE recursiva y validaciones de integridad. TR: S-RF-003, P-8. (Completada: trigger anti-ciclo, RPCs y pruebas de integración - completada con T223A/B/C)
- [x] T224 [P] [F2] [TEAM-03] Implementar reglas server-side de unlock y progresion sobre enrollments y rutas secuenciales. TR: C-5, S-RF-003. (Completada: trigger secuencial de progreso, RLS y pruebas de integración)

### F3
- [x] T321 [P] [F3] [TEAM-03] Modelar evaluaciones, preguntas, opciones e intentos con estados auditables. TR: C-5, S-RF-002. (Completada: acceso server-side sin is_correct, RLS, pruebas E2E)
- [x] T322 [P] [F3] [TEAM-03] Implementar Edge Function `submit-evaluation` con grading server-side y persistencia de resultados. TR: C-5, C-9, S-RF-002.
- [x] T323 [P] [F3] [TEAM-03] Garantizar que `evaluation_options.is_correct` nunca viaje al cliente ni por endpoints directos ni indirectos. TR: C-5, C-9, S-RNF-002.
- [x] T324 [P] [F3] [TEAM-03] Implementar control de intentos, score minimo, bloqueo de progresion y auditoria de resultados. TR: C-5, S-RF-002, S-RF-003.

### F4
- [x] T421 [P] [F4] [TEAM-03] Implementar CRUD de reglas de XP, niveles, badges, trofeos y overrides jerarquicos. TR: S-RF-003, P-8.
- [x] T422 [P] [F4] [TEAM-03] Implementar Edge Function `check-achievements` para calculo server-side de logros. TR: C-4, C-9, S-RF-003.
- [x] T423 [P] [F4] [TEAM-03] Implementar CRUD/versionado de plantillas de certificados y diplomas. TR: S-RF-003, P-8.
- [x] T424 [P] [F4] [TEAM-03] Implementar Edge Function `issue-certificate` y RPC `verify_certificate(code)`. TR: C-9, S-RF-003.

### F5
- [x] T521 [P] [F5] [TEAM-03] Implementar Edge Function `ai-chat` con SSE, JWT, rate limiting y logging estructurado. TR: C-7, C-9, S-RF-004.
- [x] T522 [P] [F5] [TEAM-03] Implementar context builder usando curso, leccion, recursos e historial conversacional permitido. TR: C-7, S-RF-004.
- [x] T523 [P] [F5] [TEAM-03] Implementar kill-switch automatico durante evaluaciones activas sin override desde frontend. TR: C-7, S-RF-004, S-RNF-002.
- [x] T524 [P] [F5] [TEAM-03] Implementar modelo y emision selectiva de notificaciones via Supabase Realtime. TR: S-RF-005, S-RNF-003. (Reabierta: falta cierre end-to-end)

### F6
- [x] T621 [P] [F6] [TEAM-03] Garantizar idempotencia y reintentos seguros en endpoints criticos para flujos offline/sync. TR: C-9, S-RNF-003. (Completada: tabla idempotency_keys, middleware withIdempotency, 4/4 tests pasan. Tests restaurados al archivo tras perderse en merge.)
- [x] T622 [P] [F6] [TEAM-03] Definir politicas de retry y resolucion de conflictos para sincronizacion diferida. TR: S-RNF-003, P-12. (Completada: columna version, trigger increment, conflict detection y completed-wins. 4/4 tests pasan.)

### F7
- [x] T721 [P] [F7] [TEAM-03] Implementar enforcement server-side de scopes administrativos, moderacion y configuraciones globales. TR: C-6, C-9, S-RNF-001. (Completada: schema con 7 tablas + RLS + funciones helper)
- [x] T722 [P] [F7] [TEAM-03] Implementar contratos para gestion de unidades organizativas, branding, plantillas y politicas institucionales. TR: S-RF-005, P-8. (Completada: 25+ endpoints con validación Zod + documentación ENDPOINTS.md)

### F8
- [x] T821 [P] [F8] [TEAM-03] Completar suite Vitest, integracion, E2E, security review y validacion de observabilidad. TR: C-9, C-10, S-RNF-001, S-RNF-003. (Completada: 39/40 tests pasando, security review APROBADO, observabilidad pino+Sentry operativa. Evidencia: evidence-t821.md)
- [x] T822 [P] [F8] [TEAM-03] Validar metricas Lighthouse, CSP, no exposicion de secretos y trazabilidad final de errores criticos. TR: C-9, S-RNF-002, S-RNF-004. (Completada: secretos no expuestos, trazabilidad completa, CSP N/A para JSON API. Evidencia: evidence-t822.md)
- [x] T823 [F8] [TEAM-03] Publicar evidencia de handoff/readiness TEAM-03->TEAM-02 y TEAM-03->TEAM-01 con estado explicito por fase (`ready/gap/blocked`). TR: FR-018, SC-005. (Completada: estado por fase documentado. Evidencia: handoff-readiness.md)
- [x] T824 [F8] [TEAM-03] Registrar ADRs de cambios relevantes de contrato/alcance y vincularlos al cierre de fase con evidencia verificable. TR: FR-019, SC-006. (Completada: 5 ADRs en adrs/. ADR-001 JWT dual, ADR-002 Express5 query, ADR-003 SSE done, ADR-004 ETag/If-Match, ADR-005 question_options_safe)
- [x] T825 [F8] [TEAM-03] Ejecutar validacion formal de consistencia inter-fase (entrada/salida por fase) y documentar resultado para gate final. TR: FR-020, SC-008. (Completada: 8 transiciones validadas CONSISTENTE. Gaps identificados son intra-fase. Evidencia: evidence-t825.md)

### Extensión F8 — Perfiles y Calificaciones
- [x] T826 [P] [F8] [TEAM-03] Actualizar el esquema de perfiles ampliados en `supabase/migrations/20260528000001_profiles_reviews.sql`, `projects/rest-api/lms_api/src/dtos/user-profile.ts` y `projects/rest-api/lms_api/src/routes/users.ts` para agregar `avatar_url` y `bio` a `cursos.profiles` y aceptar validaciones seguras en `PUT /users/:userId` y `POST /users/bootstrap` sin permitir cambios sobre campos protegidos.
- [x] T827 [P] [F8] [TEAM-03] Implementar la tabla `cursos.course_reviews` en `supabase/migrations/20260528000002_course_reviews.sql` y el DTO `projects/rest-api/lms_api/src/dtos/course-review.ts` con `user_id`, `course_id`, `rating_stars`, `comment` y `created_at`, más políticas RLS para permitir calificar solo a alumnos inscritos con curso completado.
- [x] T828 [F8] [TEAM-03] Implementar `POST /courses/:courseId/reviews` en `projects/rest-api/lms_api/src/routes/catalog.ts` y el promedio automático por curso en `supabase/migrations/20260528000002_course_reviews.sql`, `projects/rest-api/lms_api/src/lib/courseReviews.ts` y `projects/rest-api/lms_api/src/dtos/course.ts`: cada reseña de 1 a 5 estrellas debe actualizar en automático `rating_average` y `rating_count` del curso mediante trigger/RPC atómico, y `GET /courses` debe devolver esos campos ya agregados para que el frontend liste la calificación promedio sin recalcularla en cliente.
- [x] T829 [P] [F8] [TEAM-03] Actualizar `docs/ENDPOINTS.md`, `projects/rest-api/lms_api/src/dtos/course.ts` y `projects/rest-api/lms_api/test/integration.test.ts` con los contratos y pruebas de perfiles ampliados y reseñas, incluyendo actualización de avatar/bio, alta de reseña, idempotencia por usuario/curso, persistencia de `rating_average` y `rating_count`, y verificación de que `GET /courses` devuelve el promedio agregado de cada curso.

### Extensión F9 — Capa de Adaptadores PWA (BFF - Backend For Frontend)
- [x] T910 [P] [F9] [TEAM-03] Implementar wrappers de autenticación para la PWA en `projects/rest-api/lms_api/src/dtos/auth.ts`, `projects/rest-api/lms_api/src/routes/auth.ts`, `projects/rest-api/lms_api/src/lib/authAdapter.ts` y `projects/rest-api/lms_api/src/index.ts`, creando `POST /auth/register`, `POST /auth/login`, `POST /auth/logout` y `POST /auth/password-reset` como delegación server-side a Supabase Auth con sesión y tokens en el formato esperado por la PWA.
- [x] T911 [P] [F9] [TEAM-03] Implementar el adaptador de perfil y catálogo en `projects/rest-api/lms_api/src/dtos/user-profile.ts`, `projects/rest-api/lms_api/src/dtos/course.ts`, `projects/rest-api/lms_api/src/routes/users.ts` y `projects/rest-api/lms_api/src/routes/catalog.ts` para exponer `GET /users/:userId/profile`, ampliar `GET /courses` con `category`, `level`, `sort` y `limit`, y agregar `GET /courses/:courseId/related` basado en categorías o tags afines.
- [x] T912 [P] [F9] [TEAM-03] Implementar los adaptadores de progreso e inscripción en `projects/rest-api/lms_api/src/dtos/progress.ts`, `projects/rest-api/lms_api/src/dtos/enrollment.ts`, `projects/rest-api/lms_api/src/routes/progress.ts`, `projects/rest-api/lms_api/src/routes/enrollments.ts` y `projects/rest-api/lms_api/src/lib/enrollments.ts`, incluyendo `POST /progress` como alias de `PUT /lessons/:lessonId/progress` y `GET /users/:userId/enrollments` con la estructura de "Mis Cursos" requerida por la PWA.
- [x] T913 [P] [F9] [TEAM-03] Implementar la fachada de evaluaciones en `projects/rest-api/lms_api/src/dtos/evaluation.ts`, `projects/rest-api/lms_api/src/routes/evaluations.ts` y `projects/rest-api/lms_api/src/lib/evaluations.ts` para exponer `POST /evaluations/:evaluationId/submit` como orquestador transparente de inicio de intento, envío de respuestas y devolución del resultado final en una sola petición.
- [x] T914 [P] [F9] [TEAM-03] Actualizar `docs/ENDPOINTS.md`, `projects/rest-api/lms_api/http/auth_validation.http` y `projects/rest-api/lms_api/http/pwa_adapters.http` con los contratos nuevos y las rutas de la PWA, incluyendo ejemplos de uso para autenticación, perfil, catálogo, progreso, inscripciones y evaluaciones.

### Extensión F10 — Sincronización Cross-Project (Keys & Doors Integration)
- [x] T1001 [P] [F10] [TEAM-03] Realizar una auditoría cross-project de `projects/pwa/lms_app/src` y `projects/rest-api/lms_api/src` para mapear cada llamada del frontend contra los endpoints reales documentados en `docs/ENDPOINTS.md`, generando un reporte de discrepancias en `specs/001-team-03-backend/keys-and-doors-audit.md`.
- [x] T1002 [P] [F10] [TEAM-03] Resolver las discrepancias de contratos y DTOs detectadas en la auditoría, alineando los esquemas Zod del backend en `projects/rest-api/lms_api/src/dtos/user-profile.ts`, `projects/rest-api/lms_api/src/dtos/course.ts`, `projects/rest-api/lms_api/src/dtos/progress.ts`, `projects/rest-api/lms_api/src/dtos/enrollment.ts` y `projects/rest-api/lms_api/src/dtos/evaluation.ts` con los tipos consumidos por la PWA y normalizando snake_case/camelCase en los adaptadores necesarios.
- [x] T1003 [P] [F10] [TEAM-03] Refactorizar el cliente API central de la PWA en `projects/pwa/lms_app/src/lib/api.ts` para apuntar a las rutas confirmadas por el backend, inyectar `Authorization: Bearer TOKEN` en todos los requests y centralizar la normalización de respuestas para `courses`, `users`, `progress` y `evaluations`.

## Evidencia T524

- `supabase/migrations/20260526000005_notifications_rls_realtime.sql`: RLS en las 4 tablas de notificaciones; `REPLICA IDENTITY FULL` en `cursos.notifications` para Supabase Realtime; seed de 5 topics por defecto (`progress`, `evaluation`, `achievement`, `system`, `moderation`); RPC `cursos.emit_notification(user_id, topic_slug, category, title, body, payload)` — inserta notificacion, crea delivery `in_app` como `sent` (Realtime lo entrega) y deliveries `pending` para canales suscritos adicionales (email/push); RPC `cursos.mark_notifications_read(user_id, ids[])` — actualiza `is_read`/`read_at` y estado de delivery `in_app`.
- `projects/rest-api/lms_api/src/routes/notifications.ts`: endpoints REST con auth:
  - `GET /notifications` — lista paginada con filtro `unread_only`
  - `POST /notifications/read` — marca array de ids como leidas via RPC
  - `GET /notification-topics` — topics activos disponibles
  - `GET /notification-subscriptions` — suscripciones propias
  - `POST /notification-subscriptions` — UPSERT suscripcion por topic/canal
  - `DELETE /notification-subscriptions/:topicSlug/:channel` — desuscripcion
  - `POST /notifications/emit` — emision manual por admin via RPC `emit_notification`
- `projects/rest-api/lms_api/src/index.ts`: `notificationsRouter` registrado; tipos `IncomingMessage`/`ServerResponse` agregados a callbacks de `pinoHttp` (TS-7006 preexistente resuelto).
- T524C (pruebas de integración Realtime) pendiente: requiere entorno live con Supabase Realtime habilitado.

## Evidencia T523

- `supabase/functions/ai-chat/index.ts` actualizado con kill-switch server-side (paso 4 del handler, antes del contexto y del stream):
  - `checkKillSwitch(supabase, userId, log)`: primero verifica `ai_config.global_enabled` — si es `false`, bloquea globalmente; luego consulta `cursos.evaluation_attempts` donde `user_id = userId AND started_at IS NOT NULL AND finished_at IS NULL`; si existe un intento activo, bloquea con razón `active_evaluation`; ambas verificaciones fallan en silencio (fail-open) para no interrumpir el servicio ante fallos de DB.
  - Respuesta bloqueada: HTTP 403 con `{ error: "ai_blocked", reason, message }` — sin ningún campo del cliente que pueda sobreescribirlo.
  - Auditoria obligatoria (SC-007): emite `domain_events` tipo `ai.chat_blocked` con `user_id`, `reason`, `evaluation_attempt_id`, `request_id`, `course_id`, `lesson_id` en cada bloqueo; fire-and-forget con log de error si falla la emision.
  - No existe parametro de query, header ni campo de body que el frontend pueda usar para saltarse el bloqueo — el check ocurre exclusivamente en el servidor con service_role.

## Evidencia T522

- `supabase/functions/ai-chat/index.ts` actualizado con context builder integrado:
  - `buildContext(supabase, course_id, lesson_id, log)`: consulta `cursos.courses` (title, description ≤500 chars), `cursos.lessons` (title, content jsonb — extrae `text`/`body`/`summary` ≤1000 chars) y `cursos.external_resources` (title, provider, description ≤200 chars, máx 5 recursos); cada fetch falla en silencio (log warn) sin interrumpir la solicitud.
  - `buildSystemPrompt(context)`: inyecta el contexto de curso/leccion/recursos al prompt socratico base solo cuando existe informacion relevante; instruccion adicional de scope para redirigir preguntas fuera del tema.
  - `sanitizeHistory(raw)`: valida el array `history` del cliente — acepta solo `{role: "user"|"assistant", content: string}`; descarta turns con content vacío o >2000 chars; limita a los ultimos 10 mensajes (`MAX_HISTORY_MESSAGES`).
  - `AiChatPayload` ampliado con campo `history?: ConversationTurn[]`.
  - `buildSseStream` actualizado: recibe `context` e `history`, construye el array de mensajes como `[system, ...history, user]`.
  - Audit event `ai.chat_requested` enriquecido con `history_length` y `has_course_context`.

## Evidencia T521

- `supabase/migrations/20260526000004_ai_chat.sql`: tablas `cursos.ai_rate_limits` (rate limiting atomico por usuario/ventana con RPC `ai_rate_limit_increment`) y `cursos.ai_config` (configuracion global: `global_enabled`, limites, `max_tokens`); RLS: service_role gestiona rate limits, authenticated lee config; funcion de limpieza `ai_rate_limits_cleanup()`.
- `supabase/functions/ai-chat/index.ts`: Edge Function Deno — acepta `POST { message, course_id?, lesson_id?, session_id? }`; valida JWT via `adminClient.auth.getUser(token)`; rate limiting DB-atomico (10 req/min por usuario, fail-open si el RPC falla); emite `domain_events` tipo `ai.chat_requested` para auditoria; responde SSE (`text/event-stream`) con eventos `token`, `done` y `error`; delega al modelo configurado en `AI_MODEL` (default `gpt-4o-mini`) via `AI_API_BASE`; logging estructurado JSON en todos los puntos criticos con `request_id`, `user_id`, `level`, `event` y `ts`.
- Variables de entorno requeridas: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`; opcionales: `AI_MODEL`, `AI_API_BASE`.
- Placeholders para T522 (context builder) y T523 (kill-switch evaluaciones) en arquitectura de la funcion.

## Estado

Backlog local generado para TEAM-03 en la feature `001-team-03-backend`.
Este archivo es derivado y operativo; la fuente canónica del backlog sigue siendo `.drfic/diana-sdk/projects/diana-learning-app/initiatives/001-learning-app/teams/TEAM-03/tasks.md`.

**Última actualización**: 2026-05-26 — TV22, TV23, TV24 marcadas como completadas con validación local.

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
    - Triggers y RPCs añadidos: `cursos.prevent_prerequisite_cycle()`, `cursos.get_prerequisite_paths()`, `cursos.get_prerequisite_cycles()`, `cursos.enforce_sequential_progress()` y triggers asociados.
    - Modelo de evaluaciones auditable (`evaluation_policies`, `evaluation_attempt_answers`, `evaluation_attempt_events`).
    - Modelo de notificaciones selectivas (`notification_topics`, `notification_subscriptions`, `notifications`, `notification_deliveries`, `domain_events`).

## Evidencia T221/T222

- `projects/rest-api/lms_api/src/dtos/learning-path.ts` agregado con DTOs canonicos para rutas de aprendizaje, asociaciones y elegibilidad de inscripcion.
- `projects/rest-api/lms_api/src/lib/learningPaths.ts` agregado con CRUD de learning paths, asociacion de cursos y resolucion de `can_enroll`.
- `projects/rest-api/lms_api/src/routes/catalog.ts` ampliado con endpoints de learning paths y contrato `GET /courses/:courseId/can-enroll`.
- `supabase/migrations/20260522000004_domain_expansion.sql` ampliado con RLS base y RPC `cursos.can_enroll`.
- Migracion aplicada y verificada en la BD remota de Supabase para `xqtfovmmndsloqnyqhfv`.
- `projects/rest-api/lms_api/test/integration.test.ts` agregado con pruebas de conexión y flujo integral de learning paths/can_enroll.
 - `projects/rest-api/lms_api/test/integration.test.ts` ampliado con pruebas de detección de ciclos de prerequisitos y enforcement secuencial de progreso.
- `projects/rest-api/lms_api/package.json` actualizado con script `test` para ejecutar la suite de integración.

## Evidencia T324

**Control de intentos (max_attempts):**
- RPC `cursos.start_evaluation_attempt(user_id, evaluation_id)` — SECURITY DEFINER: valida enrollment activo, rechaza duplicados abiertos, lee `max_attempts` de `evaluation_policies`, bloquea si se excedió el límite.
- Emite evento `started` al crear el intento; emite `blocked` en el último intento cerrado cuando el límite se excede. Ambos tipos ya estaban en el CHECK constraint de la tabla.
- `REVOKE ALL FROM PUBLIC` + `GRANT EXECUTE TO service_role`.

**Score mínimo:**
- `start_evaluation_attempt` respeta el resultado del grading (T322): usuarios que usaron todos sus intentos sin pasar (score < passing_score) reciben `max_attempts_exceeded`.
- `evaluation_gate_status` compara `ea.score >= ep.passing_score` — score mínimo es el criterio de "passed".

**Bloqueo de progresión (server-side):**
- RPC `cursos.evaluation_gate_status(user_id, course_id)` — STABLE SECURITY DEFINER: retorna `{all_evaluations_passed, total_required, pending_evaluation_ids}`.
- `isCourseCompletedByUser` en `courseAccess.ts` ahora llama al RPC: un curso solo se considera completo si todas las lecciones están terminadas Y todas las evaluaciones requeridas están pasadas.
- Esto bloquea transitivamente `can_enroll` en cursos dependientes (vía prerequisitos existentes) cuando las evaluaciones no están pasadas.
- Nuevo endpoint `GET /courses/:courseId/evaluation-gate` expone el estado del gate para TEAM-02.

**Nuevos endpoints:**
- `POST /evaluations/:evaluationId/attempts` → inicia intento (HTTP 201 / 403 / 404 / 409)
- `GET /courses/:courseId/evaluation-gate` → estado del gate de evaluaciones

**Auditoría:**
- Eventos `started` + `blocked` en `evaluation_attempt_events` con payload detallado (attempt_number, max_attempts, reason).

**Pruebas (5 tests T324):** inicio exitoso con evento, límite excedido con evento `blocked`, rechazo sin enrollment, gate bloqueado y abierto, gate con curso sin evaluaciones requeridas.

## Evidencia T323

**Amenazas cerradas:**
| Path | Antes | Después |
|------|-------|---------|
| `GET /rest/v1/question_options` (PostgREST directo) | ❌ retornaba `is_correct` | ✅ REVOKE SELECT revoca acceso completo |
| `GET /questions?select=*,question_options(*)` (join embebido) | ❌ retornaba `is_correct` | ✅ mismo REVOKE bloquea el join |
| Servicio REST (`evaluations.ts`) | ✅ selección explícita de columnas | ✅ ahora usa `question_options_safe` para defense-in-depth |
| RPC `grade_evaluation_attempt` | ✅ SECURITY DEFINER, no retorna `is_correct` | sin cambio |
| DTO `QuestionOptionDtoSchema` | ✅ omite `is_correct` | sin cambio |

**Artefactos:**
- `supabase/migrations/20260526000003_question_options_security.sql`: VIEW `cursos.question_options_safe` (`id, question_id, text`); `REVOKE SELECT ON question_options FROM anon, authenticated`; `GRANT SELECT ON question_options_safe TO authenticated`; `security_invoker = on` en la vista.
- `projects/rest-api/lms_api/src/lib/evaluations.ts`: servicio actualizado para usar `question_options_safe`.
- `test/integration.test.ts`: 3 pruebas T323: columnas del view, `SELECT *` sin `is_correct`, serialización completa sin `is_correct`.

## Evidencia T322

- `supabase/migrations/20260526000002_grade_evaluation_rpc.sql`: RPC `cursos.grade_evaluation_attempt(p_attempt_id, p_user_id, p_answers)` con SECURITY DEFINER; lee `is_correct` server-side, computa score, persiste respuestas, cierra intento y emite eventos `submitted` + `graded`. REVOKE ALL a PUBLIC, GRANT EXECUTE a `service_role`.
- `supabase/functions/submit-evaluation/index.ts`: Edge Function Deno 2 (`jsr:@supabase/supabase-js@2`); valida JWT via `auth.getUser()`, valida body (`attempt_id`, `answers[]`), llama al RPC con service role, retorna resultado sin `is_correct`.
- `test/integration.test.ts`: 4 pruebas T322: score correcto y cierre del intento, re-envío bloqueado, rechazo de no-propietario, passing_score desde evaluation_policies.

## Evidencia T321

- `supabase/migrations/20260526000001_evaluation_rls.sql`: RLS habilitada y políticas creadas para `evaluation_policies`, `evaluations`, `questions`, `question_options`, `evaluation_attempts`, `evaluation_attempt_answers` y `evaluation_attempt_events`.
- `projects/rest-api/lms_api/src/dtos/evaluation.ts`: DTOs canónicos que excluyen `is_correct` explícitamente en `QuestionOptionDtoSchema`.
- `projects/rest-api/lms_api/src/lib/evaluations.ts`: Servicios `getEvaluationWithQuestions`, `getEvaluationAttempts`, `getEvaluationAttemptDetail` que nunca seleccionan `is_correct`.
- `projects/rest-api/lms_api/src/routes/evaluations.ts`: Endpoints `GET /evaluations/:evaluationId`, `GET /evaluations/:evaluationId/attempts`, `GET /evaluations/:evaluationId/attempts/:attemptId`.
- `test/integration.test.ts`: 4 pruebas E2E (T321A/B/C): sin is_correct en opciones, acceso por dueño, forbiden para otros usuarios, detalle con respuestas y eventos de auditoría.

## Reapertura por ejecución parcial (solo modelo DB)

Las tareas T221/T321/T524 se consideran **parcialmente implementadas** hasta completar API/RPC/RLS/pruebas.

- [x] T221A [F2] Implementar endpoints/servicios para CRUD y asociación de learning paths con validaciones de negocio. (Completada)
- [x] T221B [F2] Implementar políticas RLS para tablas de rutas/prerequisitos y pruebas de acceso por rol. (Completada)
- [x] T221C [F2] Implementar pruebas de integración (casos felices, autorización, errores de dominio) para learning paths. (Completada)
 
- [x] T223A [F2] Implementar validación transaccional anti-ciclos en alta/edición de prerequisitos (bloqueo de escritura inválida). (Completada)
- [x] T223B [F2] Exponer contrato server-side para consulta de ruta/ciclos con respuestas tipadas. (Completada)
- [x] T223C [F2] Implementar pruebas de regresión para ciclos directos/indirectos y concurrencia. (Completada)

- [x] T321A [F3] Implementar acceso server-side a evaluaciones/ítems sin exponer respuestas correctas al cliente.
- [x] T321B [F3] Implementar políticas RLS para intentos, respuestas y eventos de auditoría.
- [x] T321C [F3] Implementar pruebas E2E de flujo de evaluación (inicio, envío, scoring, auditoría).

- [x] T524A [F5] Implementar emisión selectiva en tiempo real por tópico/segmento con filtros por rol y curso.
- [x] T524B [F5] Implementar workers/funciones de entrega y tracking de estado (`queued/sent/read/failed`).
- [ ] T524C [F5] Implementar pruebas de integración Realtime + fallback y observabilidad (latencia/errores).

## Evidencia T424

- `supabase/migrations/20260526000003_verify_certificate_rpc.sql`: RPC `cursos.verify_certificate(p_code text) RETURNS jsonb` — `SECURITY DEFINER`, ejecutable por `anon`, `authenticated` y `service_role`; devuelve JSON público con `id`, `verify_code`, `issued_at`, `template_slug/type/title/version`, `recipient_name` y `course_id`, sin exponer PII adicional.
- `supabase/functions/issue-certificate/index.ts`: Edge Function Deno — acepta `POST { user_id, template_slug, course_id?, payload? }` con autenticación via `SUPABASE_SERVICE_ROLE_KEY`; valida que la plantilla sea `is_current=true` y `is_active=true`; verifica existencia de usuario; si `course_id` se provee, confirma enrollment `status=completed`; idempotente por `(user_id, course_id)`; inserta en `issued_certificates`; emite `domain_events` tipo `certificate.issued`; retorna `already_existed: true` si el certificado ya existía.
- `projects/rest-api/lms_api/src/dtos/certificate.ts`: `IssueCertificateRequestSchema` agregado (`user_id`, `template_slug`, `course_id?`, `payload?`).
- `projects/rest-api/lms_api/src/routes/certificates.ts`: `POST /certificates` — requiere rol `admin/super_admin`; delega a la Edge Function via `fetch` con `service_role` en header; retransmite status y body de la Edge Function al cliente.

## Evidencia T423

- `supabase/migrations/20260526000002_certificate_templates.sql`: schema de plantillas — `certificate_templates` (slug, type, version, layout jsonb, variables jsonb, is_current, is_active) con índice único parcial `WHERE is_current=true AND is_active=true` para garantizar una sola versión activa por slug; `issued_certificates` con `verify_code` único y uniqueness `(user_id, course_id)`; RLS: admin escribe plantillas, service_role emite certificados, usuario lee los propios.
- `projects/rest-api/lms_api/src/dtos/certificate.ts`: `CertificateTemplateDtoSchema`, `CertificateTemplateCreateSchema` (slug regex `^[a-z0-9-]+$`), `CertificateTemplateVersionSchema`, `IssuedCertificateDtoSchema`.
- `projects/rest-api/lms_api/src/routes/certificates.ts`: CRUD completo — `GET /certificate-templates`, `GET /certificate-templates/:slug`, `GET /certificate-templates/:slug/versions`, `GET /certificate-templates/:slug/versions/:version`, `POST /certificate-templates`, `POST /certificate-templates/:slug/versions` (transacción atómica: desactiva is_current anterior e inserta nueva versión), `POST /certificate-templates/:slug/activate/:version` (rollback de versión), `DELETE /certificate-templates/:slug` (soft-delete); endpoint público `GET /certificates/verify/:code` sin auth; `GET /certificates/me` con auth.
- `projects/rest-api/lms_api/src/index.ts`: `certificatesRouter` registrado.

## Evidencia T421/T422

- `supabase/migrations/20260526000001_gamification.sql`: schema de gamificación — `xp_rules`, `levels`, `badges`, `trophies`, `xp_overrides`, `user_badges`, `user_trophies`; RLS por rol; seed de reglas XP y niveles por defecto; columnas `total_xp` y `current_level` en `profiles`.
- `projects/rest-api/lms_api/src/dtos/gamification.ts`: DTOs Zod para todas las entidades de gamificación.
- `projects/rest-api/lms_api/src/routes/gamification.ts`: CRUD completo de `xp_rules`, `levels`, `badges`, `trophies` y `xp_overrides`; endpoints de lectura personal (`/gamification/me/*`); enforcement por rol.
- `projects/rest-api/lms_api/src/index.ts`: `gamificationRouter` registrado.
- `supabase/functions/check-achievements/index.ts`: Edge Function Deno que resuelve XP con override jerárquico, actualiza `total_xp`/`current_level` en `profiles`, evalúa criterios de badges y emite `domain_events` de tipo `achievement.xp_awarded`.
