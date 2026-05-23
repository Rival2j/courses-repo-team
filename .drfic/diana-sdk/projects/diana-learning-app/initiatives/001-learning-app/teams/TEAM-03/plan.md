# Plan de Equipo
## TEAM-03 - Backend

Identificador: 001-LMS-PLAN-TEAM-03
Proyecto: diana-learning-app
Iniciativa: 001-learning-app
Equipo: TEAM-03
Estado: Draft

## Autoridad

Plan subordinado a:
1. ../../001-lms-plan.md
2. ../../001-lms-spec.md
3. ./tasks.md

## Estrategia de ejecucion

Implementacion server-first por dominios criticos, liberando contratos estables para frontend y manteniendo enforcement constitucional continuo.
Como baseline operacional, TEAM-03 dispone de MCP de Supabase por proyecto con `cursos` como schema por defecto para verificaciones backend.

## Fases y entregables

### F0
Entregables:
* base de datos inicial
* RLS/claims
* API Gateway base
* logging/observabilidad base
* MCP de Supabase configurado por proyecto y verificado sobre `cursos`

Tareas:
* T021, T022, T023, T024, T025, T026

### F1
Entregables:
* CRUD academico y recursos
* tracking server-side

Tareas:
* T121, T122, T123, T124

### F2
Entregables:
* prerequisitos/rutas
* RPC can_enroll
* unlock server-side

Tareas:
* T221, T222, T223, T224

### F3
Entregables:
* evaluaciones completas
* grading seguro
* control de intentos

Tareas:
* T321, T322, T323, T324

### F4
Entregables:
* gamificacion dinamica
* certificacion verificable

Tareas:
* T421, T422, T423, T424

### F5
Entregables:
* IA socratica segura
* contexto controlado
* kill-switch
* notificaciones realtime

Tareas:
* T521, T522, T523, T524

### F6
Entregables:
* endpoints idempotentes
* politica de sincronizacion y conflicto

Tareas:
* T621, T622

### F7
Entregables:
* enforcement administrativo y moderacion

Tareas:
* T721, T722

### F8
Entregables:
* cierre de calidad y seguridad backend

Tareas:
* T821, T822

## Dependencias

* Handoffs y gates coordinados por TEAM-01.
* Consumo de contratos por TEAM-02 para experiencias de UI.

## Riesgos y mitigaciones

* reglas criticas mal ubicadas en cliente -> mitigar con revisiones de arquitectura server-first.
* regressiones de seguridad -> mitigar con pruebas de fuga y revisión de RLS por fase.
* drift de contratos -> mitigar con DTOs versionados y validacion de compatibilidad.
