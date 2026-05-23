---
project_id: diana-learning-app
alias: lms
initiative_id: 001-learning-app
plan_id: 001-lms-plan
action: generate
scope: project
source_mode: input
primary_source: tempo/001-lms-plan.md
constitutional_source: .drfic/diana-sdk/projects/diana-learning-app/lms-constitution.md
spec_source: .drfic/diana-sdk/projects/diana-learning-app/initiatives/001-learning-app/001-lms-spec.md
change_source: .drfic/diana-sdk/projects/diana-learning-app/governance/change-requests/001-lms-ucc.md
ticket_source: .drfic/diana-sdk/projects/diana-learning-app/governance/tickets/001-lms-tkt.md
initiative_meta: .drfic/diana-sdk/projects/diana-learning-app/initiatives/001-learning-app/meta.md
initiative_scope: .drfic/diana-sdk/projects/diana-learning-app/initiatives/001-learning-app/scope_primario.md
integration_profile: .drfic/diana-sdk/projects/diana-learning-app/initiatives/001-learning-app/integrations/integration-profile.md
engine_handoff: .drfic/diana-sdk/projects/diana-learning-app/initiatives/001-learning-app/integrations/speckit-handoff.md
version: 1.0.0
status: draft
generated_at: 2026-05-20
---

# PLAN TECNICO CANONICO - LMS PWA ASISTIDA POR IA

Identificador: 001-LMS-PLAN
Proyecto: diana-learning-app
Iniciativa: 001-learning-app
Estado: Draft
Autoridad: Subordinado a la Constitucion y a la Spec Canonica

Framework de ejecucion:
Spec-Driven Development (DIANA-SDK + Speckit)

## Resumen Ejecutivo

Este plan tecnico define **como implementar** la plataforma LMS institucional descrita en la spec canonica, sin redefinir alcance funcional ni introducir nuevos requisitos. Conserva la base del borrador entregado en `tempo/001-lms-plan.md`, pero la reorganiza para:

* alinearse con la topologia **real** de 3 equipos registrada en la iniciativa,
* mantener trazabilidad a RF/RNF de la spec,
* preparar el proyecto para alimentar `/speckit.plan`,
* explicitar los gaps actuales de knowledge, skills y artefactos por equipo sin bloquear la planeacion.

---

## 1. AUTORIDAD Y JERARQUIA DOCUMENTAL

Este plan tecnico canonico esta subordinado, en orden de precedencia, a:

1. `lms-constitution.md`
2. `001-lms-spec.md`
3. `001-lms-ucc.md`
4. `001-lms-tkt.md`
5. `integration-profile.md`
6. `speckit-handoff.md`

Ante cualquier conflicto:
**prevalece la Constitucion del Proyecto**.

Este plan:
* NO redefine alcance funcional
* NO introduce nuevos requisitos
* SI define como implementar tecnicamente lo ya aprobado
* SI define responsabilidad operativa entre los 3 equipos
* SI define gates tecnicos para derivacion posterior a Speckit

---

## 2. OBJETIVO DEL PLAN

Definir el **como tecnico, organizativo y operativo** para implementar el LMS descrito en la especificacion canonica, habilitando:

* ejecucion por equipos multiples,
* trazabilidad SDD,
* preparacion de artefactos posteriores para Speckit,
* seguridad y cumplimiento desde Fase 0,
* validacion humana explicita antes de cada cierre de fase.

Este plan convierte la especificacion en un **camino de construccion real**, secuencial en dependencias duras y paralelizable donde el canon lo permite.

---

## 3. CONTEXTO DE PLANIFICACION Y DEGRADACION CONTROLADA

### 3.1 Fuentes utilizadas

Fuentes oficiales cargadas para esta generacion:

* Radar de proyectos
* Constitucion canonica del proyecto
* Spec canonica `001-lms-spec.md`
* UCC `001-lms-ucc.md`
* Ticket `001-lms-tkt.md`
* `meta.md` y `scope_primario.md`
* `integration-profile.md`
* `speckit-handoff.md`
* borrador `tempo/001-lms-plan.md`

### 3.2 Skills y knowledge cargados

Disponibles:

* `.drfic/diana-sdk/sdk/diana/knowledge/indexes/shared-skills-manifest.yaml`

No encontrados a nivel proyecto:

* `knowledge/indexes/skills-manifest.yaml`
* `knowledge/indexes/agent-skill-matrix.yaml`
* `knowledge/indexes/sdd-engine-matrix.yaml`
* `knowledge/indexes/master-index.md`

No encontrada spec operativa en:

* `specs/*/spec.md`

### 3.3 Decision de planificacion

Se genera el plan en **modo degradado controlado**, usando metodologia estandar SDD y el manifiesto compartido del SDK. Esto **no bloquea** la generacion del plan canonico, pero deja gaps formales para readiness multi-team con Speckit.

Comandos recomendados para cerrar gaps:

* `/diana.skills action="generate" scope="project" project="diana-learning-app"`
* `/diana.knowledge scope="project" project="diana-learning-app"`
* `/diana.teams action="generate" project="diana-learning-app" initiative="001-learning-app"`

Baseline MCP validado para TEAM-03:

* `.mcp.json` configurado para `project_ref=xqtfovmmndsloqnyqhfv`
* `search_path=cursos` como schema por defecto en las connection strings operativas del backend
* prueba de conexion ejecutada y verificada contra `cursos`

---

## 4. MODELO DE EJECUCION (SDD + SPECKIT)

El modelo de ejecucion sigue estrictamente Spec-Driven Development:

1. **Spec Canonica** -> fuente de verdad funcional
2. **Plan Tecnico Canonico** -> este documento
3. **Spec Operativa Derivada** (Speckit)
4. **Tasks ejecutables**
5. **Evidencia verificable**
6. **Validacion humana explicita**

Speckit **NO modifica la spec canonica**.
Solo genera derivados operativos subordinados al canon Diana.

Para esta iniciativa, el motor objetivo es `speckit`, con orquestacion `manual` y topologia `multi_team`.

---

## 5. TOPOLOGIA DE EQUIPOS Y RESPONSABILIDADES

### 5.1 Topologia confirmada

* Modelo: `multi_team`
* Equipos registrados: 3
* Orquestacion: manual
* Politica de autoridad: `diana_canon_strict`

### 5.2 Equipos registrados y reinterpretacion operativa valida

Los equipos **registrados** en `meta.md` y `scope_primario.md` son:

#### TEAM-01 - Scrum Master / Orquestacion
Responsabilidad principal:
* coordinacion de slices y dependencias
* gobierno de handoffs entre equipos
* control de readiness para Speckit
* consolidacion de evidencia y gates de fase
* gestion transversal de riesgos, observabilidad y cierre tecnico

#### TEAM-02 - Frontend / PWA
Responsabilidad principal:
* PWA React
* UX tipo Udemy/Platzi
* consumo de API Gateway
* offline, caching, routing y accesibilidad
* shell instalable y sincronizacion basica

#### TEAM-03 - Backend
Responsabilidad principal:
* API Gateway (Node + Express)
* adaptadores Supabase / SharePoint
* Edge Functions
* RLS, RPCs, seguridad y logica deterministica
* soporte tecnico a quality gates de seguridad y performance
* acceso MCP de Supabase por proyecto con verificacion operativa sobre `cursos` por defecto

### 5.3 Responsabilidades transversales no excluyentes

Aunque TEAM-03 esta registrado como backend y no como equipo QA puro, este plan conserva el objetivo del borrador original incorporando validacion tecnica transversal:

* TEAM-01 coordina gates, evidencias y cierre de fase.
* TEAM-02 es responsable de accesibilidad, experiencia PWA y contratos de integracion frontend.
* TEAM-03 es responsable de seguridad server-side, datos, performance backend y verificacion tecnica de reglas criticas.

La calidad global se valida **entre equipos**, no como una fourth lane implicita.

---

## 6. PRINCIPIOS TECNICOS DE IMPLEMENTACION

### 6.1 Principio rector

**El frontend no conoce la fuente de datos.**
Consume unicamente contratos canonicos expuestos por el API Gateway.

### 6.2 Principios obligatorios

* Backend-first para reglas, seguridad y contratos.
* Frontend desacoplado del storage y del origen fisico de datos.
* Grading, roles, logros y certificados solo server-side.
* IA exclusivamente via Edge Functions con kill-switch.
* Trazabilidad tecnica y funcional desde Fase 0.
* Ningun cierre de fase sin evidencia funcional y validacion humana.

---

## 7. ARQUITECTURA DE IMPLEMENTACION

### 7.1 Capas

1. **PWA**
2. **API Gateway**
3. **Adaptadores de fuente**
4. **Plataformas de datos**
5. **Servicios sensibles en Edge Functions**

### 7.2 Distribucion por capa y ownership principal

| Capa | Descripcion | Owner principal | Colaboradores |
| ---- | ----------- | --------------- | ------------- |
| PWA | UI, rutas, formularios, estados cliente, offline | TEAM-02 | TEAM-01 |
| API Gateway | contratos, auth context, routers, servicios | TEAM-03 | TEAM-02 |
| Adaptadores | Supabase, SharePoint, homologacion canonica | TEAM-03 | TEAM-01 |
| Datos | PostgreSQL, RLS, RPCs, Realtime, Storage | TEAM-03 | TEAM-01 |
| Gates y evidencias | validacion, checklists, readiness | TEAM-01 | TEAM-02, TEAM-03 |

### 7.3 Implicaciones practicas

* CRUDs dinamicos -> backend primero
* Resolucion de reglas -> server-side
* IA -> Edge Functions
* SharePoint -> solo via adaptador
* Certificados -> Edge Function + verificacion publica
* PWA/offline -> frontend coordinado sobre contratos estables

---

## 8. DESGLOSE DE IMPLEMENTACION POR DOMINIOS

### 8.1 Dominio de autenticacion y gobierno

Incluye:
* autenticacion email/password y OAuth
* perfiles y contexto de usuario
* jerarquia de roles y unidades organizativas
* claims JWT y update-user-role

Dependencias:
* modelo canonico de usuarios
* RLS base
* contratos API de identidad

Owner principal:
* TEAM-03

Consumer principal:
* TEAM-02

### 8.2 Dominio academico

Incluye:
* cursos, modulos, lecciones
* CRUD de recursos externos
* player y tracking de progreso

Dependencias:
* auth
* modelo canonico
* RLS base

Owners:
* TEAM-03 para contratos y persistencia
* TEAM-02 para experiencia de consumo y gestion

### 8.3 Dominio de evaluaciones

Incluye:
* builder
* runner
* grading server-side
* control de intentos

Restricciones:
* `is_correct` jamas al cliente
* kill-switch IA obligatorio
* evidencia de intento y resultado trazable

Owner principal:
* TEAM-03

### 8.4 Dominio de gamificacion y certificacion

Incluye:
* CRUD de XP y bonus
* CRUD de niveles
* CRUD de badges y trofeos
* certificados y diplomas verificables
* templates y overrides por curso/unidad

Todo calculo:
* backend / Edge Functions

Owners:
* TEAM-03 para logica y emision
* TEAM-02 para visualizacion y feedback

### 8.5 Dominio de IA

Incluye:
* tutor socratico
* resumenes
* quizzes de practica

Restricciones:
* sin evaluaciones
* sin decisiones academicas
* kill-switch activo
* sin secretos en cliente

Owners:
* TEAM-03 para Edge Functions y control
* TEAM-02 para UX conversacional

### 8.6 Dominio de administracion y gobierno

Incluye:
* roles
* unidades organizativas
* moderacion
* configuraciones globales

Owners:
* TEAM-03 para enforcement
* TEAM-02 para paneles

---

## 9. ESTRATEGIA DE FASES

Las fases siguen el orden logico aprobado en la especificacion y amplian el borrador recibido con ownership explicito y gates tecnicos.

| Fase | Nombre | Objetivo tecnico | Owner principal | Colaboradores |
| ---- | ------ | ---------------- | --------------- | ------------- |
| F0 | Fundamentos | repo, CI, auth base, RLS, observabilidad, contratos semilla | TEAM-01 | TEAM-02, TEAM-03 |
| F1 | Nucleo academico | cursos, modulos, lecciones, recursos, player base | TEAM-02 | TEAM-03 |
| F2 | Progresion y prerrequisitos | enrollments, gating, learning paths, unlock rules | TEAM-03 | TEAM-02 |
| F3 | Evaluaciones | builder, runner, grading server-side, intentos | TEAM-03 | TEAM-02 |
| F4 | Gamificacion y certificacion | XP, niveles, badges, trofeos, certificados | TEAM-03 | TEAM-02 |
| F5 | IA | tutor socratico, resumenes, quizzes de practica | TEAM-03 | TEAM-02 |
| F6 | Notificaciones | realtime, eventos, feedback del sistema | TEAM-03 | TEAM-02 |
| F7 | PWA / Offline | instalacion, cache, sincronizacion, resiliencia cliente | TEAM-02 | TEAM-03 |
| F8 | Administracion | paneles, configuraciones, moderacion, scopes | TEAM-02 | TEAM-03 |
| F9 | Calidad, NFR y cierre | performance, accesibilidad, seguridad, hardening, release gate | TEAM-01 | TEAM-02, TEAM-03 |

Las fases **no incluyen tiempos** en este documento.

---

## 10. TRAZABILIDAD FASE -> RF / RNF

| Fase | RF cubiertos | RNF cubiertos | Evidencia minima esperada |
| ---- | ------------ | ------------- | ------------------------- |
| F0 | RF-005 | RNF-001, RNF-002, RNF-003 | CI verde, auth base, RLS base, logging inicial |
| F1 | RF-001, RF-005 | RNF-003, RNF-004 | CRUD academico funcional, player base, flujos UI |
| F2 | RF-003 | RNF-001, RNF-003 | prerequisitos calculados server-side, rutas verificables |
| F3 | RF-002 | RNF-001, RNF-002, RNF-003 | grading server-side, intentos, no exposicion de respuestas |
| F4 | RF-003 | RNF-001, RNF-003 | logros trazables, certificados verificables |
| F5 | RF-004 | RNF-002, RNF-003 | Edge Function IA, kill-switch, logs y rate limit |
| F6 | RF-005 | RNF-003 | notificaciones funcionales y auditables |
| F7 | RF-005 | RNF-003, RNF-004 | instalacion PWA, offline basico, sync controlado |
| F8 | RF-005, RF-001 | RNF-001, RNF-002, RNF-003 | paneles con scopes y controles por rol |
| F9 | RF-001, RF-002, RF-003, RF-004, RF-005 | RNF-001, RNF-002, RNF-003, RNF-004 | reportes, pruebas, metricas y aprobacion humana |

No existe hoy spec operativa con escenarios SC formales. Por tanto, la trazabilidad de este plan se apoya en RF/RNF de la spec canonica. Al generarse `speckit.plan`, debe completarse la cobertura a user stories y acceptance scenarios sin contradiccion del canon.

---

## 11. ESTRATEGIA DE IMPLEMENTACION POR EQUIPO

### 11.1 TEAM-01 - Orquestacion y readiness

Entregables tecnicos:
* matriz de dependencias entre fases
* checklist de evidencias por fase
* criterio de merge y cierre inter-equipo
* consolidacion de riesgos, observabilidad y release gate

No implementa una feature funcional aislada como owner de producto, pero es **owner del flujo y del cierre tecnico**.

### 11.2 TEAM-02 - Frontend / PWA

Slices prioritarios:
* shell de autenticacion y navegacion
* catalogo, detalle y player de curso
* formularios y paneles de gestion
* visualizacion de logros, certificados y notificaciones
* UX del tutor IA y soporte offline

Condicion de diseno:
* no depender de detalles fisicos de Supabase ni SharePoint

### 11.3 TEAM-03 - Backend / Datos / Seguridad

Slices prioritarios:
* auth context y enforcement por rol
* contratos y DTOs canonicos
* RLS, RPCs, Edge Functions
* grading, prerrequisitos, gamificacion, certificados
* adaptadores externos y control de IA

Condicion de seguridad:
* no delegar logica critica al cliente

---

## 12. DEPENDENCIAS DURAS Y ORDEN DE DESBLOQUEO

### 12.1 Dependencias duras

* F0 desbloquea todas las demas fases.
* F1 requiere auth, contratos base y RLS inicial.
* F2 requiere cursos/lecciones operables.
* F3 requiere F2 por control de progresion e intentos.
* F4 requiere F2 y F3 para logica de logros y certificados.
* F5 requiere F3 y F4 para kill-switch y contexto academico seguro.
* F7 requiere al menos F1 funcional y contratos estables.
* F9 requiere cobertura integral de fases previas.

### 12.2 Paralelizacion permitida

Puede existir paralelizacion parcial cuando no rompe dependencias duras:

* TEAM-02 puede avanzar shell UI y patrones de experiencia mientras TEAM-03 estabiliza contratos base.
* TEAM-01 puede preparar gates, criterios y trazabilidad desde F0.
* TEAM-02 y TEAM-03 pueden dividir administracion y notificaciones una vez definidos contratos y scopes.

---

## 13. CRITERIOS DE VALIDACION TECNICA POR FASE

Cada fase requiere como minimo:

* evidencia funcional
* tests asociados
* cumplimiento NFR aplicable
* validacion humana
* registro de decisiones tecnicas relevantes

Sin evidencia:
no hay cierre de fase.

### 13.1 Gates minimos obligatorios

* Seguridad: secretos fuera del cliente, RLS activa, enforcement server-side.
* Resiliencia: comportamiento definido ante errores externos y degradacion controlada.
* Observabilidad: logs estructurados y errores trazables.
* Calidad: pruebas unitarias, integracion y E2E para el slice correspondiente.
* Accesibilidad: cumplimiento minimo aplicable en vistas activas.

---

## 14. ESTRATEGIA DE CALIDAD Y VALIDACION GLOBAL

### 14.1 Testing

* Unitario: hooks, stores, validadores, helpers de dominio.
* Integracion: RPCs criticos, Edge Functions sensibles, resolucion de reglas.
* End-to-End: registro, inscripcion, progreso, evaluacion, certificado, IA bloqueada, offline/sync.

### 14.2 Observabilidad

Debe activarse desde F0:

* logs estructurados backend
* logs Edge Functions
* correlacion request/usuario
* tracking de errores y eventos criticos

### 14.3 Seguridad

Controles minimos:

* RLS en todas las tablas
* `evaluation_options.is_correct` nunca expuesto al cliente
* JWT validado en backend y Edge Functions
* CSP estricta
* rate limiting de IA y endpoints publicos

### 14.4 Performance y UX

Objetivos heredados de la spec:

* LCP <= 2.5s
* navegacion critica <= 500ms
* primer token IA <= 1.5s
* submit de evaluacion <= 800ms server-side

---

## 15. RIESGOS OPERATIVOS CLAVE

| Riesgo | Mitigacion |
| ------ | ---------- |
| Complejidad de CRUDes dinamicos | Backend-first + contratos canonicos |
| Abuso de IA | Rate limit + kill-switch + auditoria |
| SharePoint inconsistente | Adaptador canonico + fallback controlado |
| Errores RLS | Testing dedicado + revision de politicas |
| Desalineacion entre equipos | TEAM-01 como owner de handoff y gates |
| Falta de indices skills/knowledge | Degradacion controlada + generacion posterior con Diana |
| Falta de artefactos por equipo | `/diana.teams action="generate"` antes de implementacion multi-team |

---

## 16. READYNESS PARA SPECKIT

### 16.1 Estado actual

El plan queda **listo como canon tecnico del proyecto** y sirve como base valida para `/speckit.plan`.

### 16.2 Gaps aun abiertos para flujo multi-team completo

Faltan:

* `knowledge/indexes/sdd-engine-matrix.yaml`
* `knowledge/indexes/skills-manifest.yaml`
* `knowledge/indexes/agent-skill-matrix.yaml`
* `knowledge/indexes/master-index.md`
* `teams/TEAM-01/spec.md`, `plan.md`, `tasks.md`
* `teams/TEAM-02/spec.md`, `plan.md`, `tasks.md`
* `teams/TEAM-03/spec.md`, `plan.md`, `tasks.md`
* artefactos de coordinacion Speckit por `/diana.teams action="generate"`

### 16.3 Decision operativa

* Si se ejecuta `/speckit.plan` a nivel proyecto, este plan ya es una base canonica valida.
* Si se ejecuta flujo **multi-team distribuido**, primero deben generarse artefactos por equipo y matrices de skills/knowledge.

---

## 17. ENTREGABLES DERIVADOS

Este plan habilita la generacion de:

* specs operativas por feature o slice
* planificacion operativa de Speckit
* tasks canonicas por equipo
* backlog priorizado
* checklists de calidad y release gate

---

## 18. DECLARACION FINAL

Este plan:

* conserva y mejora el contenido del borrador `tempo/001-lms-plan.md`
* corrige la topologia operativa segun los 3 equipos realmente registrados
* mantiene subordinacion estricta a la constitucion, spec, UCC y ticket
* queda preparado para alimentar la siguiente etapa del flujo SDD

No sustituye la planeacion fina ni las tareas por equipo,
pero define **como se construye correctamente el sistema**.
