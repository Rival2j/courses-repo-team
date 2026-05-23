# Feature Specification: TEAM-03 Backend Canonico

**Feature Branch**: `001-team-03-backend`  
**Created**: 2026-05-21  
**Status**: Draft  
**Input**: User description: "Ejecutar /speckit.specify para crear/actualizar el feature slug canonico 001-team-03-backend en espanol tecnico, preservando TEAM-03 y ampliando con TEAM-01 y spec global"

**Constitution Alignment**:
- Se preserva el idioma oficial en espanol tecnico.
- Se preservan requisitos validados canonicos de TEAM-03 sin eliminacion de alcance.
- Se refuerza enforcement server-side para seguridad, trazabilidad y control humano explicito.
- Se mantiene subordinacion a artefactos canonicos globales y constitucion del proyecto.

## Clarifications

### Session 2026-05-22

- Q: ¿Dónde debe residir el enforcement de reglas críticas (RLS solo en BD, solo en app, o ambos)? → A: Opción C: DB RLS + app (RLS en la base de datos y validaciones adicionales en la capa de aplicación para defensa en profundidad).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Backend academico seguro y trazable (Priority: P1)

Como equipo de plataforma, necesitamos un backend LMS que ejecute reglas academicas criticas del lado servidor para garantizar integridad de evaluaciones, progresion controlada y evidencia auditable.

**Why this priority**: Sin este nucleo backend, el producto no puede garantizar seguridad academica ni cumplimiento constitucional.

**Independent Test**: Puede probarse de forma independiente validando un flujo completo de curso->evaluacion->progreso->logro con enforcement server-side y auditoria activa.

**Acceptance Scenarios**:

1. **Given** un alumno autenticado con rol valido y curso con prerequisitos, **When** intenta avanzar sin cumplir prerequisitos, **Then** el backend bloquea la accion y registra evidencia de la decision.
2. **Given** un intento de evaluacion activo, **When** se procesa la calificacion, **Then** la evaluacion se resuelve exclusivamente en servidor sin exponer respuestas correctas al cliente.
3. **Given** una accion de emision de logro o certificado, **When** la accion concluye, **Then** el backend registra trazabilidad completa (actor, regla aplicada, resultado, timestamp).

---

### User Story 2 - Contratos canonicos para consumo frontend (Priority: P2)

Como TEAM-02, necesitamos contratos backend estables y canonicos para integrar UI/PWA sin acoplamiento a la fuente de datos fisica ni a logica sensible.

**Why this priority**: El frontend depende de contratos consistentes para entregar experiencia funcional sin romper restricciones de seguridad.

**Independent Test**: Puede probarse validando que las operaciones principales de cursos, progreso, evaluaciones y notificaciones se consumen con contratos estables y sin filtrar datos sensibles.

**Acceptance Scenarios**:

1. **Given** un endpoint canonico de cursos, **When** TEAM-02 consulta catalogo y detalle, **Then** recibe estructuras consistentes con el modelo de dominio acordado.
2. **Given** una consulta de evaluacion para alumno, **When** se retorna informacion al cliente, **Then** no se expone `is_correct` ni secretos ni logica de grading.
3. **Given** un cambio interno en adaptador de datos, **When** se mantiene el contrato canonico, **Then** TEAM-02 no requiere cambios de negocio en su capa de consumo.

---

### User Story 3 - Gobierno operativo inter-team y readiness (Priority: P3)

Como TEAM-01, necesitamos evidencia y handoffs verificables para cerrar fases sin gaps entre backend y frontend.

**Why this priority**: Reduce riesgo de cierre falso de fase y mejora continuidad operativa multi-team.

**Independent Test**: Puede probarse validando una fase con checklist de evidencia, estado de handoff y decision trazada en ADR para cambios relevantes.

**Acceptance Scenarios**:

1. **Given** un hito de fase F3/F4/F5, **When** TEAM-03 declara readiness, **Then** existe evidencia minima publicada y estado de handoff explicito (ready/gap/blocked).
2. **Given** una decision de cambio en contrato backend, **When** se aprueba, **Then** queda trazada en ADR y comunicada a equipos dependientes.

---

### User Story 4 - Acceso operativo a Supabase MCP con alcance controlado (Priority: P3)

Como TEAM-03, necesitamos un acceso MCP de Supabase configurado por proyecto para inspeccionar y validar el backend sin salir del esquema operativo `cursos`.

**Why this priority**: Sin un canal MCP validado, la verificacion asistida del backend y la trazabilidad de consultas queda incompleta para el trabajo diario del equipo.

**Independent Test**: Puede probarse conectando el MCP al proyecto `xqtfovmmndsloqnyqhfv` y ejecutando una consulta de verificacion que confirme `current_schema() = cursos` y acceso solo a objetos del esquema `cursos`.

**Acceptance Scenarios**:

1. **Given** la configuracion MCP del proyecto, **When** TEAM-03 usa herramientas de Supabase, **Then** el alcance queda restringido al proyecto `xqtfovmmndsloqnyqhfv` y las operaciones se orientan por defecto a `cursos`.
2. **Given** una consulta de verificacion sobre tablas del backend, **When** se ejecuta la prueba de conexion, **Then** la respuesta confirma que el schema activo es `cursos`.

---

### Edge Cases

- Que ocurre si un cliente manipula payload para forzar aprobacion de evaluacion: el backend ignora campos no autorizados y aplica reglas deterministicas server-side.
- Como se maneja una desconexion durante sincronizacion offline: la operacion se reintenta con idempotencia y resolucion deterministica de conflictos.
- Que ocurre si el kill-switch IA esta activo durante evaluacion: cualquier invocacion al tutor IA se bloquea y se registra evento de control.
- Como responde el sistema ante rol/claim invalido o expirado: rechaza operacion, no altera estado academico y genera evento de auditoria.

## Requirements *(mandatory)*

### Functional Requirements

#### Definiciones RF/RNF Referenciadas

- **RF-001**: Gestion academica server-side de cursos, modulos, lecciones y recursos con contratos canonicos para consumo frontend.
- **RF-002**: Evaluaciones seguras con grading exclusivamente server-side, control de intentos y bloqueo de progresion por reglas.
- **RF-003**: Progresion academica deterministica con prerequisitos, rutas de aprendizaje y trazabilidad de avance.
- **RF-004**: Tutor IA socratico operando server-side con controles de seguridad, auditoria y kill-switch durante evaluaciones activas.
- **RF-005**: Operacion administrativa/realtime con notificaciones, moderacion y contratos estables entre equipos.
- **RNF-001**: Seguridad y cumplimiento: RLS activa, secretos fuera del cliente, controles de acceso por rol/claim y evidencia verificable.
- **RNF-002**: Integridad y resiliencia operativa: no exposicion de datos sensibles de evaluacion, idempotencia, sincronizacion consistente y observabilidad auditable.

- **FR-001**: El sistema MUST implementar el nucleo backend LMS con enforcement server-side para reglas criticas academicas y de seguridad.
- **FR-002**: El sistema MUST cubrir RF-001, RF-002, RF-003, RF-004 y RF-005 en la capa server-side del dominio TEAM-03.
- **FR-003**: El sistema MUST cumplir RNF-001 y RNF-002 de forma estricta durante todo el ciclo de vida operativo.
- **FR-004**: El sistema MUST garantizar trazabilidad y auditoria de evaluaciones, logros e interacciones IA con evidencia verificable.
- **FR-005**: El sistema MUST proveer contratos canonicos estables para consumo de TEAM-02, desacoplados de la fuente fisica de datos.
- **FR-006**: El sistema MUST aplicar RLS activa y validada en tablas objetivo desde el inicio de operaciones; además, deberá existir enforcement complementario en la capa de aplicación (defense-in-depth) para las reglas de negocio críticas, garantizando que la validación no dependa exclusivamente de una sola capa.
- **FR-007**: El sistema MUST ejecutar grading de evaluaciones exclusivamente en backend/edge sin exposicion de `is_correct` al cliente.
- **FR-008**: El sistema MUST mantener secretos y credenciales solo en backend/edge; el cliente no puede acceder a ellos.
- **FR-009**: El sistema MUST imponer kill-switch de IA durante evaluaciones activas sin posibilidad de sobreescritura desde cliente.
- **FR-010**: El sistema MUST canalizar integraciones externas exclusivamente por backend o adaptadores autorizados.
- **FR-011**: El sistema MUST soportar auth context, roles y claims firmados para control de acceso por rol y alcance organizativo.
- **FR-012**: El sistema MUST habilitar CRUD academico y tracking de progreso con reglas de prerequisitos, rutas y progresion deterministica.
- **FR-013**: El sistema MUST gestionar gamificacion y certificacion verificable mediante reglas evaluadas en backend.
- **FR-014**: El sistema MUST soportar notificaciones realtime y eventos operativos relevantes para experiencia de aprendizaje.
- **FR-015**: El sistema MUST implementar idempotencia y resolucion de sincronizacion para operaciones potencialmente repetidas por conectividad intermitente.
- **FR-016**: El sistema MUST reforzar enforcement de administracion/moderacion segun jerarquia de roles definida por la iniciativa.
- **FR-017**: El sistema MUST mantener trazabilidad con backlog TEAM-03 por fases F0-F8: F0(T021-T026), F1(T121-T124), F2(T221-T224), F3(T321-T324), F4(T421-T424), F5(T521-T524), F6(T621-T622), F7(T721-T722), F8(T821-T825).
- **FR-018**: El sistema MUST exponer evidencia de handoffs y readiness por fase para validacion transversal de TEAM-01.
- **FR-019**: El sistema MUST registrar decisiones relevantes de cambios de contrato o alcance en artefactos ADR trazables.
- **FR-020**: El sistema MUST validar consistencia inter-fase de slices funcionales antes de cierre operativo.
- **FR-021**: El sistema MUST contar con MCP de Supabase configurado por proyecto y validado para operar por defecto sobre el schema `cursos`, sin depender de otros esquemas para tareas ordinarias de backend.

### Key Entities *(include if feature involves data)*

- **AuthContext**: contexto de autenticacion y autorizacion con usuario, rol, claims firmados y alcance organizativo.
- **RolePolicy**: reglas jerarquicas de permisos para super_admin, admin, instructor, moderador y alumno.
- **CourseAggregate**: entidad academica compuesta por curso, modulos, lecciones y recursos asociados.
- **EvaluationAttempt**: intento evaluativo con estado, respuestas, resultado server-side, auditoria y restricciones de IA.
- **ProgressRecord**: trazas de avance academico por alumno y leccion con bloqueos por prerequisitos.
- **LearningPathRule**: reglas de rutas de aprendizaje y dependencias entre cursos.
- **GamificationEvent**: evento de XP, badge o trofeo con regla aplicada y evidencia de otorgamiento.
- **CertificateRecord**: certificado/diploma emitido con codigo verificable y metadata de validacion.
- **NotificationEvent**: evento de notificacion realtime generado por progreso, evaluacion o logro.
- **ModerationAction**: accion administrativa/moderacion con actor, alcance, motivo y resultado auditado.
- **AuditEvent**: evidencia transversal de decisiones criticas, errores de seguridad y controles constitucionales.
- **HandoffEvidence**: evidencia de handoff entre equipos con estado ready/gap/blocked y referencias de cierre.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de reglas academicas criticas (grading, prerequisitos, progresion, certificacion) se ejecutan server-side sin excepciones en validaciones de aceptacion.
- **SC-002**: El 100% de tablas objetivo del dominio TEAM-03 operan con politicas de acceso activas y verificadas antes del cierre de fase.
- **SC-003**: El 100% de respuestas a cliente en evaluaciones excluyen datos sensibles de correccion y secretos operativos.
- **SC-004**: Al menos 95% de flujos backend criticos generan eventos de auditoria completos (actor, accion, regla, resultado, timestamp), medidos por release de fase usando eventos `AuditEvent` en logging estructurado y validados por TEAM-03 con revisiones de TEAM-01.
- **SC-005**: El 100% de handoffs de fase TEAM-03->TEAM-02 y TEAM-03->TEAM-01 cuentan con estado explicito y evidencia minima publicada.
- **SC-006**: El 100% de decisiones de cambio relevante en contratos backend quedan trazadas en artefactos de decision y vinculadas al cierre de fase.
- **SC-007**: El 100% de intentos de uso de IA durante evaluaciones activas son bloqueados por kill-switch y auditados.
- **SC-008**: La tasa de incidencias por inconsistencia inter-fase reportadas en cierre operativo es menor o igual a 5% por release de fase, medida sobre el total de handoffs evaluados por fase y validada en gate de cierre por TEAM-01 y TEAM-03.
- **SC-009**: El 100% de sesiones de verificacion MCP usadas por TEAM-03 confirman el proyecto correcto y el schema activo `cursos` antes de ejecutar consultas de validacion.

## Assumptions

- Se mantiene la topologia multi-team con TEAM-01 (orquestacion), TEAM-02 (frontend PWA) y TEAM-03 (backend).
- El alcance de TEAM-03 permanece centrado en backend; implementaciones de UI quedan fuera del ownership principal.
- Los artefactos canonicos globales de la iniciativa mantienen vigencia y prevalecen ante conflicto.
- La fuente de datos puede cambiar por adaptador sin romper contratos de dominio expuestos a TEAM-02.
- El control humano explicito de operaciones criticas permanece obligatorio en cierres y gates operativos.
- La validacion de evidencia por fase se realiza antes de declarar readiness final de cada fase F0-F8.

## Constitutional Traceability *(mandatory)*

- **Preserved**:
  - Objetivo TEAM-03: nucleo backend LMS con seguridad, trazabilidad y enforcement server-side.
  - Alcance TEAM-03 completo: modelo de datos/RLS, auth context/roles/claims, CRUD academico/tracking, prerequisitos/rutas/progresion, evaluaciones/grading server-side, gamificacion/certificacion verificable, tutor IA por edge con kill-switch, notificaciones realtime, idempotencia/sync, administracion/moderacion.
  - Requisitos TEAM-03 REQ-T1, REQ-T2, REQ-T3, REQ-T4 preservados semanticamente.
  - Trazabilidad backlog TEAM-03 F0-F8 preservada con los mismos codigos de tarea.
  - Restricciones tecnicas no negociables preservadas: no exponer is_correct, secretos solo backend, kill-switch IA no sobreescribible, integraciones externas via backend/adaptador.
  - Criterios de exito TEAM-03 preservados: 100% reglas criticas server-side, RLS activa/validada, evidencias de seguridad/observabilidad por fase.
- **Expanded**:
  - Incorporacion de gobierno operativo transversal de TEAM-01: handoffs, evidencia por fase, readiness gates y consistencia inter-fase.
  - Incorporacion explicita de RF-001..RF-005 y RNF-001..RNF-002 desde la spec global como marco de cobertura funcional/no funcional.
  - Definicion de escenarios de borde, entidades clave y criterios medibles operativos para evaluacion objetiva de cumplimiento.
- **Merged**:
  - Integracion de REQ-T4 de TEAM-03 (contratos canonicos para TEAM-02) con principio global de fuente de datos intercambiable mediante contrato de dominio estable.
  - Integracion de trazabilidad/auditoria TEAM-03 con exigencia TEAM-01 de evidencia y ADR para decisiones relevantes.
  - Integracion de restriccion global IA subordinada con restriccion TEAM-03 de kill-switch no sobreescribible.
- **Dropped**:
  - Ninguno.
