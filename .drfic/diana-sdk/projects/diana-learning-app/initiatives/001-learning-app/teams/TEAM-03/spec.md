# Especificacion de Equipo
## TEAM-03 - Backend

Identificador: 001-LMS-SPEC-TEAM-03
Proyecto: diana-learning-app
Iniciativa: 001-learning-app
Equipo: TEAM-03
Estado: Draft

## Autoridad

Este documento esta subordinado a:
1. ../../001-lms-spec.md
2. ../../001-lms-plan.md
3. ./tasks.md

## Objetivo del equipo

Implementar el nucleo backend del LMS con seguridad, trazabilidad y enforcement server-side: API Gateway, datos, RLS, RPCs, Edge Functions, integraciones y reglas deterministicas criticas.

## Alcance funcional del equipo

* modelo de datos y RLS
* auth context, roles y claims
* CRUD academico y tracking
* prerequisitos, rutas y progresion
* evaluaciones y grading server-side
* gamificacion y certificacion verificable
* tutor IA por Edge Functions con kill-switch
* notificaciones realtime
* idempotencia y resolucion de sync
* enforcement de administracion/moderacion

## Requisitos del equipo

* REQ-T1: Debe cumplir RNF-001 y RNF-002 de forma estricta (T021-T026, T323, T523, T721).
* REQ-T2: Debe cubrir RF-001, RF-002, RF-003, RF-004 y RF-005 en su capa server-side.
* REQ-T3: Debe garantizar trazabilidad/auditoria de evaluaciones, logros y IA (T324, T422, T424, T521-T524).
* REQ-T4: Debe proveer contratos canonicos estables para consumo de TEAM-02.
* REQ-T5: Debe disponer de MCP de Supabase por proyecto y operar por defecto sobre `cursos` para verificaciones y consultas de backend (T026).

## Trazabilidad con backlog

* F0: T021, T022, T023, T024, T025, T026
* F1: T121, T122, T123, T124
* F2: T221, T222, T223, T224
* F3: T321, T322, T323, T324
* F4: T421, T422, T423, T424
* F5: T521, T522, T523, T524
* F6: T621, T622
* F7: T721, T722
* F8: T821, T822

## Restricciones tecnicas

* `is_correct` nunca expuesto al cliente.
* secretos solo en backend/edge.
* kill-switch IA no sobreescribible desde cliente.
* integraciones externas solo por backend/adaptador.

## Criterios de exito del equipo

* 100% de reglas criticas en server-side.
* RLS activa y validada en tablas objetivo.
* evidencias de seguridad y observabilidad en cada fase.
* acceso MCP verificado con schema `cursos` por defecto antes de consultas operativas del backend.
