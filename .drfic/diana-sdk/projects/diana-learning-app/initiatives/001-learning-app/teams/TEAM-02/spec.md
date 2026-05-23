# Especificacion de Equipo
## TEAM-02 - Frontend / PWA

Identificador: 001-LMS-SPEC-TEAM-02
Proyecto: diana-learning-app
Iniciativa: 001-learning-app
Equipo: TEAM-02
Estado: Draft

## Autoridad

Este documento esta subordinado a:
1. ../../001-lms-spec.md
2. ../../001-lms-plan.md
3. ./tasks.md

## Objetivo del equipo

Construir la experiencia de usuario del LMS (web app + PWA) consumiendo contratos canonicos del backend, garantizando accesibilidad, trazabilidad visual del progreso y cumplimiento de restricciones de seguridad del lado cliente.

## Alcance funcional del equipo

* shell de aplicacion y navegacion
* catalogo, detalle y player de cursos/lecciones
* UX de inscripcion, rutas y bloqueos por prerequisitos
* runner de evaluaciones (sin logica sensible)
* vistas de gamificacion, certificados y notificaciones
* interfaz de chat IA con estados de restriccion
* capacidades PWA/offline
* UI administrativa y moderacion

## Requisitos del equipo

* REQ-T1: El frontend no conoce la fuente de datos ni contiene logica sensible (T014).
* REQ-T2: Debe cubrir RF-001, RF-002, RF-003, RF-004 y RF-005 desde UX (T111-T114, T211-T212, T311-T312, T411-T412, T511-T512, T611-T612, T711).
* REQ-T3: Debe cumplir RNF-004 (accesibilidad/UX) y soportar evidencia para RNF-003 (T811).
* REQ-T4: Debe respetar restriccion de IA durante evaluaciones activas en estados de interfaz (T511).

## Trazabilidad con backlog

* F0: T011, T012, T013, T014
* F1: T111, T112, T113, T114
* F2: T211, T212
* F3: T311, T312
* F4: T411, T412
* F5: T511, T512
* F6: T611, T612
* F7: T711
* F8: T811

## Restricciones tecnicas

* Sin secretos en cliente.
* Sin grading ni decision academica en cliente.
* Sin bypass de kill-switch desde UI.

## Criterios de exito del equipo

* UX completa y funcional por fase segun tasks.
* Cumplimiento WCAG 2.1 AA en vistas criticas.
* PWA instalable con offline basico y sincronizacion controlada.
