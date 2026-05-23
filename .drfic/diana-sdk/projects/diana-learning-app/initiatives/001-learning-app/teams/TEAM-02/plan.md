# Plan de Equipo
## TEAM-02 - Frontend / PWA

Identificador: 001-LMS-PLAN-TEAM-02
Proyecto: diana-learning-app
Iniciativa: 001-learning-app
Equipo: TEAM-02
Estado: Draft

## Autoridad

Plan subordinado a:
1. ../../001-lms-plan.md
2. ../../001-lms-spec.md
3. ./tasks.md

## Estrategia de ejecucion

Construccion por slices de interfaz, sincronizada con contratos backend de TEAM-03 y gobernada por gates de TEAM-01.

## Fases y entregables

### F0
Entregables:
* base tecnica frontend
* shell PWA
* arquitectura por features

Tareas:
* T011, T012, T013, T014

### F1
Entregables:
* catalogo/curso/player
* experiencia de consumo de recursos

Tareas:
* T111, T112, T113, T114

### F2
Entregables:
* experiencia de prerequisitos y rutas

Tareas:
* T211, T212

### F3
Entregables:
* runner de evaluaciones
* feedback sin fuga de respuestas

Tareas:
* T311, T312

### F4
Entregables:
* perfil de logros
* visualizacion de certificacion

Tareas:
* T411, T412

### F5
Entregables:
* UI de chat IA
* notificaciones en tiempo real

Tareas:
* T511, T512

### F6
Entregables:
* PWA offline y sync

Tareas:
* T611, T612

### F7
Entregables:
* paneles administrativos

Tareas:
* T711

### F8
Entregables:
* cierre de hallazgos de calidad frontend

Tareas:
* T811

## Dependencias

* Contratos de API y enforcement server-side de TEAM-03.
* Gates de entrega y cierre definidos por TEAM-01.

## Riesgos y mitigaciones

* Drift de contratos -> mitigar con contrato versionado y mocks alineados.
* deuda de accesibilidad -> mitigar con chequeos tempranos por fase.
* problemas offline -> mitigar con pruebas incrementales de sync.
