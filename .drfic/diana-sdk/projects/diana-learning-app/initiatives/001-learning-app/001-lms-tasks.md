---
project_id: diana-learning-app
alias: lms
initiative_id: 001-learning-app
tasks_id: 001-lms-tasks
action: generate
scope: project
source_mode: input
primary_source: tempo/001-lms-tasks.md
constitutional_source: .drfic/diana-sdk/projects/diana-learning-app/lms-constitution.md
spec_source: .drfic/diana-sdk/projects/diana-learning-app/initiatives/001-learning-app/001-lms-spec.md
plan_source: .drfic/diana-sdk/projects/diana-learning-app/initiatives/001-learning-app/001-lms-plan.md
initiative_meta: .drfic/diana-sdk/projects/diana-learning-app/initiatives/001-learning-app/meta.md
initiative_scope: .drfic/diana-sdk/projects/diana-learning-app/initiatives/001-learning-app/scope_primario.md
integration_profile: .drfic/diana-sdk/projects/diana-learning-app/initiatives/001-learning-app/integrations/integration-profile.md
version: 1.0.0
status: draft
generated_at: 2026-05-20
---

# BACKLOG CANONICO DEFINITIVO - LMS PWA ASISTIDA POR IA

Identificador: 001-LMS-TASKS
Proyecto: diana-learning-app
Iniciativa: 001-learning-app
Estado: Canonico Draft
Framework: Spec-Driven Development (DIANA-SDK + Speckit)

## Autoridad

Este backlog esta subordinado a:
1. `lms-constitution.md`
2. `001-lms-spec.md`
3. `001-lms-plan.md`
4. `001-lms-ucc.md`
5. `001-lms-tkt.md`

Ante conflicto, prevalece la constitucion.

## Entradas Oficiales Consumidas

* Constitucion del proyecto
* Especificacion canonica de la iniciativa
* Plan tecnico canonico de la iniciativa
* Borrador `tempo/001-lms-tasks.md`
* `meta.md`, `scope_primario.md`, `integration-profile.md`
* Shared skills manifest del SDK

## Politica de Derivacion hacia Speckit

* Este archivo es el backlog canonico global Diana.
* En topologia `multi_team`, las salidas operativas inmediatas son:
  - `teams/TEAM-01/tasks.md`
  - `teams/TEAM-02/tasks.md`
  - `teams/TEAM-03/tasks.md`
* No existe aun `specs/.../tasks.md` derivado por Speckit.
* Los IDs de tarea deben permanecer estables cuando posteriormente exista backlog operativo derivado.

## Topologia y criterio de reinterpretacion

El borrador original separaba trabajo en frontend, backend y QA. El canon vigente de la iniciativa registra:

* TEAM-01 -> scrum master / orquestacion
* TEAM-02 -> frontend / PWA
* TEAM-03 -> backend

Por ello, este backlog conserva y amplifica el contenido del borrador, pero lo redistribuye a la topologia real:

* TEAM-01 absorbe gobierno de handoffs, gates, evidencias y cierre tecnico.
* TEAM-02 absorbe el stream frontend/PWA/UX.
* TEAM-03 absorbe backend/datos/seguridad/logica critica.

## Formato de tareas

`[ID] [P?] [Fase] [TEAM] Descripcion`

* `[P]` indica paralelizable.
* `TR:` indica trazabilidad resumida a constitucion, RF/RNF y plan.

---

## Fase 0 - Fundamentos, Gobierno y Base Tecnica

Objetivo:
Establecer la base tecnica, los gates de control y el baseline de seguridad, trazabilidad y observabilidad desde el inicio.

Entregables:
* repositorio y toolchain base
* baseline de auth, datos y contratos
* baseline de gates y evidencias
* CI/observabilidad inicial

Tareas:
- [ ] T001 [P] [F0] [TEAM-01] Definir matriz de ownership, dependencias entre fases y reglas de handoff entre TEAM-01, TEAM-02 y TEAM-03. TR: C-11, P-5, P-12.
- [ ] T002 [P] [F0] [TEAM-01] Crear checklist canonico de evidencia por fase con criterios de cierre tecnico, seguridad y aprobacion humana. TR: C-10, C-11, S-RNF-003, P-13.
- [ ] T003 [P] [F0] [TEAM-01] Definir politica de ADR, trazabilidad de decisiones y uso obligatorio del estandar de comentarios LMS en logica critica. TR: C-14, S-RNF-003, P-13.
- [ ] T004 [P] [F0] [TEAM-01] Preparar release gate inicial para readiness hacia Speckit y cierre de gaps documentales multi-team. TR: P-16, P-17.
- [ ] T011 [P] [F0] [TEAM-02] Configurar workspace frontend con Vite, React, TypeScript, pnpm, Tailwind, shadcn/ui y Radix. TR: C-13, S-RF-005, P-7.
- [ ] T012 [P] [F0] [TEAM-02] Integrar React Router, TanStack Query, Zustand, React Hook Form y Zod siguiendo boundaries por feature. TR: C-4, C-13, P-7.
- [ ] T013 [P] [F0] [TEAM-02] Implementar App Shell PWA con estados globales `loading`, `error`, `empty` y `offline`. TR: S-RF-005, S-RNF-004, P-9.
- [ ] T014 [P] [F0] [TEAM-02] Definir contratos de consumo frontend y mocks temporales desacoplados de la fuente fisica de datos. TR: C-3, S-RF-001, P-6.
- [x] T021 [P] [F0] [TEAM-03] Configurar entorno Supabase, storage privado, variables, seguridad base y lineamientos PITR/backup. TR: C-9, S-RNF-001, P-7. (Completada)
- [x] T022 [P] [F0] [TEAM-03] Diseñar esquema base de datos para perfiles, unidades, cursos, modulos, lecciones, enrollments y progreso. TR: S-RF-001, S-RF-003, P-8. (Completada)
- [x] T023 [P] [F0] [TEAM-03] Implementar RLS inicial, claims JWT y camino server-side autorizado para mutacion de roles. TR: C-6, C-9, S-RNF-001, S-RNF-002. (Completada)
- [ ] T024 [P] [F0] [TEAM-03] Crear API Gateway base con DTOs canonicos, validacion Zod y logging estructurado inicial. TR: C-4, C-13, S-RNF-003, P-7.
- [ ] T025 [P] [F0] [TEAM-03] Configurar Sentry/logging para backend y Edge Functions, correlacionando request y usuario. TR: C-10, S-RNF-003, P-14.
- [x] T026 [P] [F0] [TEAM-03] Configurar MCP de Supabase para el proyecto, restringir la operacion al schema `cursos` por defecto y validar la conexion con una prueba ejecutiva. TR: C-9, S-RNF-001, S-RNF-003. (Completada)

---

## Fase 1 - Nucleo Academico y Recursos

Objetivo:
Construir el dominio base de cursos, modulos, lecciones, recursos y experiencia inicial de consumo.

Entregables:
* CRUD academico funcional
* player de contenido
* tracking de progreso
* soporte de recursos externos

Tareas:
- [ ] T101 [P] [F1] [TEAM-01] Coordinar contrato de entrega por slice academico y checklist de evidencia funcional entre frontend y backend. TR: C-11, P-11, P-13.
- [ ] T111 [P] [F1] [TEAM-02] Implementar catalogo de cursos y pagina de detalle con experiencia tipo LMS moderna. TR: S-RF-001, P-8.
- [ ] T112 [P] [F1] [TEAM-02] Construir navegacion jerarquica de modulos y lecciones con componentes accesibles y estados de progreso. TR: S-RF-001, S-RNF-004, P-8.
- [ ] T113 [P] [F1] [TEAM-02] Implementar player de leccion con soporte para iframes, documentos y visores por tipo de recurso. TR: S-RF-001, P-8.
- [ ] T114 [P] [F1] [TEAM-02] Integrar actualizacion visual de tracking, estados bloqueados y retroalimentacion de consumo de recursos. TR: S-RF-001, S-RNF-003.
- [ ] T121 [P] [F1] [TEAM-03] Implementar CRUD de cursos, modulos y lecciones respetando DTOs canonicos y enforcement por rol. TR: C-4, C-6, S-RF-001.
- [ ] T122 [P] [F1] [TEAM-03] Implementar CRUD de recursos externos por leccion, incluyendo deteccion de proveedor y metadata minima. TR: C-8, S-RF-001.
- [ ] T123 [P] [F1] [TEAM-03] Implementar tracking de progreso server-side y contratos para sincronizar el estado del alumno. TR: C-5, S-RF-001, P-8.
- [ ] T124 [P] [F1] [TEAM-03] Definir reglas de acceso a contenido y estados bloqueados compatibles con prerequisitos futuros. TR: C-5, S-RF-003.

---

## Fase 2 - Progresion, Inscripcion y Rutas

Objetivo:
Habilitar prerequisitos, inscripcion controlada, deteccion de ciclos y rutas de aprendizaje.

Entregables:
* `can_enroll`
* deteccion de ciclos
* unlock server-side
* UX de bloqueo/desbloqueo

Tareas:
- [ ] T201 [P] [F2] [TEAM-01] Establecer gate de validacion para dependencias F1 -> F2 y evidencia de reglas de progresion. TR: C-12, P-12, P-13.
- [ ] T211 [P] [F2] [TEAM-02] Implementar experiencia de inscripcion, bloqueo por prerequisitos y mensajes explicativos para usuario final. TR: S-RF-003, S-RNF-004.
- [ ] T212 [P] [F2] [TEAM-02] Construir vistas de rutas de aprendizaje con estados de desbloqueo, progreso y siguiente curso permitido. TR: S-RF-003.
- [ ] T221 [P] [F2] [TEAM-03] Implementar modelo de learning paths, prerequisitos y asociaciones de cursos. TR: S-RF-003, P-8.
- [ ] T222 [P] [F2] [TEAM-03] Implementar RPC `can_enroll(user_id, course_id)` y contratos asociados. TR: C-5, S-RF-003.
- [ ] T223 [P] [F2] [TEAM-03] Implementar deteccion de ciclos de prerequisitos mediante CTE recursiva y validaciones de integridad. TR: S-RF-003, P-8.
- [ ] T224 [P] [F2] [TEAM-03] Implementar reglas server-side de unlock y progresion sobre enrollments y rutas secuenciales. TR: C-5, S-RF-003.

---

## Fase 3 - Evaluaciones Academicas

Objetivo:
Implementar evaluaciones con integridad academica, grading server-side y control de intentos.

Entregables:
* builder y runner base
* `submit-evaluation`
* intentos trazables
* cero exposicion de respuestas correctas

Tareas:
- [ ] T301 [P] [F3] [TEAM-01] Definir protocolo de evidencia para integridad academica y fuga de datos de evaluacion. TR: C-5, C-10, P-13.
- [ ] T311 [P] [F3] [TEAM-02] Implementar UI del runner de evaluacion con flujo controlado, temporizador opcional y restricciones de navegacion. TR: S-RF-002, S-RNF-004.
- [ ] T312 [P] [F3] [TEAM-02] Implementar feedback post-evaluacion sin revelar respuestas correctas ni logica sensible. TR: C-5, S-RF-002.
- [ ] T321 [P] [F3] [TEAM-03] Modelar evaluaciones, preguntas, opciones e intentos con estados auditables. TR: C-5, S-RF-002.
- [ ] T322 [P] [F3] [TEAM-03] Implementar Edge Function `submit-evaluation` con grading server-side y persistencia de resultados. TR: C-5, C-9, S-RF-002.
- [ ] T323 [P] [F3] [TEAM-03] Garantizar que `evaluation_options.is_correct` nunca viaje al cliente ni por endpoints directos ni indirectos. TR: C-5, C-9, S-RNF-002.
- [ ] T324 [P] [F3] [TEAM-03] Implementar control de intentos, score minimo, bloqueo de progresion y auditoria de resultados. TR: C-5, S-RF-002, S-RF-003.

---

## Fase 4 - Gamificacion y Certificacion

Objetivo:
Implementar reglas dinamicas de logros, certificados, diplomas y verificacion publica.

Entregables:
* CRUD de reglas de gamificacion
* `check-achievements`
* `issue-certificate`
* `verify_certificate`

Tareas:
- [ ] T401 [P] [F4] [TEAM-01] Consolidar matriz de evidencias para logros, certificados y no-mutacion historica. TR: C-10, P-13, P-15.
- [ ] T411 [P] [F4] [TEAM-02] Implementar vistas de perfil, logros, badges, leaderboards y certificados verificables. TR: S-RF-003, S-RNF-004.
- [ ] T412 [P] [F4] [TEAM-02] Integrar feedback de XP, niveles, badges y trofeos sobre flujos del alumno. TR: S-RF-003.
- [ ] T421 [P] [F4] [TEAM-03] Implementar CRUD de reglas de XP, niveles, badges, trofeos y overrides jerarquicos. TR: S-RF-003, P-8.
- [ ] T422 [P] [F4] [TEAM-03] Implementar Edge Function `check-achievements` para calculo server-side de logros. TR: C-4, C-9, S-RF-003.
- [ ] T423 [P] [F4] [TEAM-03] Implementar CRUD/versionado de plantillas de certificados y diplomas. TR: S-RF-003, P-8.
- [ ] T424 [P] [F4] [TEAM-03] Implementar Edge Function `issue-certificate` y RPC `verify_certificate(code)`. TR: C-9, S-RF-003.

---

## Fase 5 - IA y Notificaciones

Objetivo:
Implementar tutor socratico, contexto seguro, kill-switch, rate limiting y notificaciones auditables.

Entregables:
* `ai-chat`
* context builder
* kill-switch
* feed de notificaciones

Tareas:
- [ ] T501 [P] [F5] [TEAM-01] Definir protocolo de verificacion para kill-switch IA, abuso y trazabilidad de contexto. TR: C-7, C-10, P-13.
- [ ] T511 [P] [F5] [TEAM-02] Implementar interfaz de chat IA con estados de bloqueo, historial y mensajes de restriccion. TR: S-RF-004, S-RNF-004.
- [ ] T512 [P] [F5] [TEAM-02] Implementar feed de notificaciones y bell badge conectados a eventos auditables. TR: S-RF-005, S-RNF-003.
- [ ] T521 [P] [F5] [TEAM-03] Implementar Edge Function `ai-chat` con SSE, JWT, rate limiting y logging estructurado. TR: C-7, C-9, S-RF-004.
- [ ] T522 [P] [F5] [TEAM-03] Implementar context builder usando curso, leccion, recursos e historial conversacional permitido. TR: C-7, S-RF-004.
- [ ] T523 [P] [F5] [TEAM-03] Implementar kill-switch automatico durante evaluaciones activas sin override desde frontend. TR: C-7, S-RF-004, S-RNF-002.
- [ ] T524 [P] [F5] [TEAM-03] Implementar modelo y emision selectiva de notificaciones via Supabase Realtime. TR: S-RF-005, S-RNF-003.

---

## Fase 6 - PWA, Offline y Resiliencia Cliente

Objetivo:
Habilitar instalacion, cache, sincronizacion y degradacion controlada en conectividad limitada.

Entregables:
* service worker
* background sync
* UI online/offline
* endpoints idempotentes

Tareas:
- [ ] T601 [P] [F6] [TEAM-01] Validar readiness de resiliencia entre frontend y backend con checklist de sincronizacion. TR: P-12, P-13, P-14.
- [ ] T611 [P] [F6] [TEAM-02] Integrar `vite-plugin-pwa`/Workbox, prompt de instalacion y placeholders offline. TR: S-RF-005, S-RNF-004.
- [ ] T612 [P] [F6] [TEAM-02] Implementar IndexedDB/background sync para acciones permitidas y restauracion del estado visual. TR: S-RF-005, P-9.
- [ ] T621 [P] [F6] [TEAM-03] Garantizar idempotencia y reintentos seguros en endpoints criticos para flujos offline/sync. TR: C-9, S-RNF-003.
- [ ] T622 [P] [F6] [TEAM-03] Definir politicas de retry y resolucion de conflictos para sincronizacion diferida. TR: S-RNF-003, P-12.

---

## Fase 7 - Administracion y Moderacion

Objetivo:
Habilitar paneles administrativos, moderacion, configuraciones globales y scopes institucionales.

Entregables:
* panel admin/super-admin
* moderacion
* configuracion global
* enforcement por scope

Tareas:
- [ ] T701 [P] [F7] [TEAM-01] Consolidar criterios de cierre para administracion, permisos y moderacion multi-scope. TR: C-6, P-13.
- [ ] T711 [P] [F7] [TEAM-02] Implementar UI administrativa para roles, configuraciones y moderacion de contenido. TR: S-RF-005, S-RNF-004.
- [ ] T721 [P] [F7] [TEAM-03] Implementar enforcement server-side de scopes administrativos, moderacion y configuraciones globales. TR: C-6, C-9, S-RNF-001.
- [ ] T722 [P] [F7] [TEAM-03] Implementar contratos para gestion de unidades organizativas, branding, plantillas y politicas institucionales. TR: S-RF-005, P-8.

---

## Fase 8 - Calidad, NFR y Cierre

Objetivo:
Cerrar el proyecto con cobertura tecnica, seguridad, accesibilidad, observabilidad y aprobacion humana explicita.

Entregables:
* suite de pruebas
* validacion NFR
* security review
* release gate final

Tareas:
- [ ] T801 [P] [F8] [TEAM-01] Ejecutar release gate final con matriz de evidencia, riesgos remanentes y aprobacion humana. TR: C-10, C-11, P-13, P-18.
- [ ] T811 [P] [F8] [TEAM-02] Corregir hallazgos de A11Y, UX, responsive y performance del frontend antes del cierre. TR: S-RNF-004, P-14.
- [ ] T821 [P] [F8] [TEAM-03] Completar suite Vitest, integracion, E2E, security review y validacion de observabilidad. TR: C-9, C-10, S-RNF-001, S-RNF-003.
- [ ] T822 [P] [F8] [TEAM-03] Validar metricas Lighthouse, CSP, no exposicion de secretos y trazabilidad final de errores criticos. TR: C-9, S-RNF-002, S-RNF-004.

---

## Dependencias

* F0 desbloquea el resto del backlog.
* F1 debe cerrarse antes de F2 y condiciona F3.
* F2 condiciona reglas de F3 y F4.
* F3 condiciona kill-switch y parte del contexto de F5.
* F4 condiciona certificacion completa y parte del feedback de usuario.
* F5 y F6 pueden solaparse parcialmente una vez estabilizados contratos.
* F7 requiere enforcement de roles y scopes maduro.
* F8 requiere evidencia integral de todas las fases previas.

Restricciones de paralelismo:

* TEAM-02 puede avanzar UI base en paralelo con contratos semilla definidos por TEAM-03.
* TEAM-01 mantiene la responsabilidad transversal de gates, readiness y cierre.
* No se permite paralelizar implementaciones que contradigan dependencias duras del plan.

---

## Congruencia con Speckit

* backlog_operativo: no existe aun
* estado_congruencia: listo para derivacion posterior
* diferencias_relevantes:
  - faltan matrices de skills/knowledge del proyecto
  - faltan artefactos `spec.md` y `plan.md` por equipo
* accion_recomendada:
  - generar artefactos por equipo y luego derivar backlog operativo con Speckit

---

## Estado

Este documento constituye el **Backlog Canonico Global de la Iniciativa**.
Sirve como fuente de verdad para la derivacion a `teams/TEAM-XX/tasks.md` y para backlog operativo futuro en Speckit.
