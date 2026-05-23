<!--
Sync Impact Report
- Version change: template-placeholder -> 1.0.0
- Modified principles:
	- principle-1-template -> I. Autoridad Constitucional y Aprendizaje Humano
	- principle-2-template -> II. Seguridad y Evaluacion Server-Side (No Negociable)
	- principle-3-template -> III. Arquitectura por Features y Contrato Canonico
	- principle-4-template -> IV. Trazabilidad, Evidencia y Calidad Verificable
	- principle-5-template -> V. Orquestacion Multi-Team y Gobierno de IA/Agentes
- Added sections:
	- Restricciones Operativas, Stack y Cumplimiento
	- Flujo de Trabajo, Gates y Modelo de Ejecucion
- Removed sections:
	- Ninguna (migracion desde plantilla vacia)
- Templates requiring updates:
	- ✅ updated: .specify/templates/plan-template.md
	- ✅ updated: .specify/templates/spec-template.md
	- ✅ updated: .specify/templates/tasks-template.md
	- ✅ reviewed (not present): .specify/templates/commands/*.md
- Runtime guidance requiring updates:
	- ✅ reviewed: .drfic/diana-sdk/projects/diana-learning-app/README.md
	- ✅ reviewed: .drfic/readme.md
- Follow-up TODOs:
	- TODO(KNOWLEDGE_INDEXES): generar knowledge/indexes del proyecto para cerrar gaps de skills/matriz.
-->

# DIANA Learning App Constitution

## Core Principles

### I. Autoridad Constitucional y Aprendizaje Humano
Esta constitucion es la fuente de verdad superior del proyecto diana-learning-app.
Toda especificacion, plan, backlog, ticket o implementacion MUST alinearse con ella.
Ante conflicto, esta constitucion prevalece.

El objetivo rector del sistema es un LMS institucional centrado en aprendizaje humano.
La plataforma MUST organizar cursos -> modulos -> lecciones con progresion auditable,
sin sustituir criterio pedagogico humano.

Reglas obligatorias:
- El idioma oficial del proyecto MUST ser espanol para artefactos SDD.
- La plataforma MUST mantener trazabilidad academica y de decisiones tecnicas.
- La solucion MUST respetar control humano explicito en cierres criticos.

### II. Seguridad y Evaluacion Server-Side (No Negociable)
La seguridad academica y de datos tiene prioridad sobre conveniencia de
implementacion.

Reglas obligatorias:
- Grading MUST ejecutarse exclusivamente en servidor.
- Respuestas correctas de evaluacion MUST NOT exponerse al cliente.
- RLS MUST estar activa en tablas del dominio.
- Secrets y service roles MUST NOT existir en frontend.
- Integraciones externas MUST pasar por backend/edge.
- IA MUST operar solo server-side y con kill-switch durante evaluaciones activas.

### III. Arquitectura por Features y Contrato Canonico
La arquitectura MUST ser modular por features desacopladas (vertical slice).

Features canonicas:
- auth
- courses
- lessons
- evaluations
- gamification
- ai-chat
- admin
- super-admin
- moderation
- profile
- notifications

Reglas obligatorias:
- Cada feature MUST mantener boundaries claros de componentes, servicios, tipos,
	estado y contratos.
- El frontend MUST consumir contratos canonicos y permanecer agnostico a la fuente
	fisica de datos.
- El sistema SHOULD soportar proveedores externos via adaptadores sin acoplamiento
	directo de UI.

### IV. Trazabilidad, Evidencia y Calidad Verificable
Toda fase de trabajo MUST ser verificable por evidencia funcional, tecnica y de
seguridad.

Reglas obligatorias:
- Cada cierre de fase MUST incluir evidencia trazable.
- Tests unitarios/integracion y E2E MUST cubrir flujos criticos.
- Observabilidad (logs/errores) MUST habilitar diagnostico reproducible.
- Ningun cierre de ticket o fase MUST ocurrir sin aprobacion humana explicita.

### V. Orquestacion Multi-Team y Gobierno de IA/Agentes
El proyecto opera en topologia multi_team con autoridad canonica estricta.

Reglas obligatorias:
- La orquestacion de agentes/equipos MUST respetar orden operativo definido y
	trazabilidad de salida.
- Ningun agente MUST implementar sin insumo de especificacion valido.
- Ningun agente MUST omitir contenido canonico validado.
- La IA es asistente pedagogico; MUST NOT reemplazar decisiones academicas,
	progreso, grading o permisos.

## Restricciones Operativas, Stack y Cumplimiento

Alcance v1 obligatorio:
- Gestion academica por cursos/modulos/lecciones.
- Evaluaciones seguras server-side.
- Prerequisitos y progresion verificable.
- Gamificacion y certificados verificables.
- Tutor IA socratico con kill-switch.
- PWA instalable con soporte offline basico.

Fuera de alcance v1:
- Pasarela de pagos.
- SSO/SAML.
- Auto-grading de respuestas abiertas por IA.
- Aplicacion movil nativa.
- Multi-tenant completo.

Roles jerarquicos canonicos:
- super_admin
- admin
- instructor
- moderador
- alumno

Stack base aprobado:
- Frontend: React + TypeScript/JavaScript + Vite
- UI: Tailwind + componentes accesibles
- Estado: Query para server-state + store para estado local/UI
- Backend: Node.js + Express (REST)
- Datos: Supabase (PostgreSQL, Auth, RLS, Realtime, Edge Functions)
- IA: Gemini 2.5 Flash via server-side
- CI/CD: pipelines con validaciones de calidad y seguridad

Estandar de documentacion de codigo:
- Logica critica MUST incluir comentarios con prefijo `FIC:`.
- Comentarios de logica critica SHOULD ser bilingues EN/ES cuando aplique.
- La ausencia de este estandar en logica critica MUST bloquear cierre de ticket.

## Flujo de Trabajo, Gates y Modelo de Ejecucion

Modelo de ejecucion por fases:
- El avance de fase MUST respetar dependencias duras.
- La paralelizacion SHOULD aplicarse solo cuando no rompa dependencias.

Politica de gates:
- Cada fase MUST tener criterio de entrada/salida verificable.
- Evidencia minima MUST cubrir comportamiento funcional, seguridad y trazabilidad.
- Aprobacion humana MUST registrarse para cierre de fase.

Calidad y cumplimiento:
- Verificaciones de performance/PWA SHOULD correr en CI segun plan vigente.
- Riesgos de seguridad (RLS, secretos, integridad evaluacion) MUST tener pruebas
	dedicadas.
- Cualquier desviacion significativa de stack o autoridad MUST tramitarse como
	enmienda constitucional.

## Governance

Versionado semantico de esta constitucion:
- MAJOR: cambios fundacionales o incompatibles.
- MINOR: ampliaciones no contradictorias.
- PATCH: aclaraciones y ajustes editoriales.

Proceso de enmienda obligatorio:
1. Propuesta documentada con impacto tecnico/operativo.
2. Revision de consistencia contra spec/plan/tasks.
3. Aprobacion segun tipo de cambio.
4. Actualizacion de constitucion y trazabilidad (issue -> commit -> constitucion).
5. Revalidacion de templates y artefactos dependientes.

Reglas de cumplimiento continuo:
- Toda revision de PR/artefacto MUST verificar cumplimiento constitucional.
- Violaciones MUST bloquear merge/cierre hasta remediacion.
- En beta/produccion, cambios SHOULD limitarse a PATCH salvo excepcion aprobada.

**Version**: 1.0.0 | **Ratified**: 2026-05-19 | **Last Amended**: 2026-05-21
