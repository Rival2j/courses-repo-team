---
project_id: diana-learning-app
alias: lms
constitution_id: lms-constitution
action: generate
input_mode: draft
primary_source: .drfic/diana-sdk/projects/diana-learning-app/governance/change-requests/001-lms-ucc.md
draft_source: tempo/lms-constitution.md
version: 1.0.0
status: active
created_at: 2026-05-19
---

# Constitucion del Proyecto
## Plataforma LMS Escolar PWA Asistida por IA

Identificador: DIANA-LEARNING-APP-CONSTITUTION
Proyecto: DIANA LMS
Tipo: Constitucion Canonica del Proyecto

Autoridad:
Este documento constituye la fuente de verdad primaria y superior del proyecto
DIANA LMS. Define principios inmutables, limites, reglas no negociables,
gobierno de agentes, estandares tecnicos minimos y criterios rectores bajo los
cuales DEBEN alinearse especificaciones, planes, tareas, decisiones y codigo.

Ninguna especificacion, plan, ticket, agente o implementacion puede contradecir
esta constitucion sin una enmienda constitucional explicita y documentada.

## Idioma Oficial del Proyecto

El idioma oficial del proyecto DIANA Inversions es espanol.

Todas las especificaciones, planes tecnicos, tareas, contratos,
documentacion, reportes y artefactos derivados del proceso
Spec-Driven Development DEBEN redactarse en espanol.

Se permite ingles tecnico unicamente cuando:
- No exista traduccion clara o estandar
- Se trate de nombres propios, tecnologias, librerias o estandares

Esta regla aplica tambien a artefactos generados por herramientas
automaticas como Speckit.

---


## 1. Proposito y Alcance
Esta constitucion define los principios, limites, reglas de gobernanza y criterios de calidad no negociables del proyecto diana-learning-app.

El sistema MUST:
- Organizar el aprendizaje en cursos -> modulos -> lecciones con prerequisitos.
- Permitir gestion de contenido academico por instructores.
- Garantizar evaluaciones seguras con grading server-side.
- Integrar tutor IA socratico bajo control humano.
- Emitir certificados verificables.
- Operar como PWA instalable con soporte offline basico.

Fuera de alcance actual (v1):
- Pasarela de pagos.
- SSO/SAML.
- Auto-grading de respuestas abiertas por IA.
- Aplicacion movil nativa.
- Multi-tenant completo.

## 2. Objetivo Constitucional
La plataforma es un LMS institucional centrado en aprendizaje humano, con trazabilidad academica y seguridad por diseno.

Toda decision funcional, tecnica u operativa SHOULD alinearse al objetivo de:
- Mejorar seguimiento academico.
- Reducir operacion manual y errores de evaluacion.
- Escalar la oferta educativa digital sin comprometer integridad.

## 3. Principios Rectores No Negociables
1. Spec-Driven Development gobierna al codigo.
2. La especificacion gobierna al codigo; no se permiten inferencias funcionales no documentadas.
3. La IA es asistente, no autoridad.
4. Toda decision relevante MUST quedar documentada y trazable.
5. El progreso del alumno MUST ser auditable y reconstruible.
6. La seguridad de datos academicos y de evaluacion tiene prioridad sobre conveniencia de implementacion.

## 4. Modelo de Sistema y Features Canonicas
Arquitectura obligatoria: vertical slice por features desacopladas.

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

Cada feature SHOULD mantener boundaries claros de componentes, servicios, tipos, estado y contratos de API.

## 5. Progresion, Prerequisitos y Evaluaciones
Reglas de progresion:
- No hay avance sin prerequisitos cumplidos.
- No hay acceso a lecciones restringidas sin validacion de acceso.
- No hay promocion automatica sin cumplimiento de score minimo.

Reglas de evaluacion:
- Grading MUST ejecutarse exclusivamente en servidor.
- Respuestas correctas u objetos equivalentes MUST NOT exponerse al cliente.
- Control de intentos MUST respetar max_attempts.
- El estado de intentos y resultados MUST ser trazable.

## 6. Gobernanza de Roles y Permisos
Roles jerarquicos canonicos:
- super_admin
- admin
- instructor
- moderador
- alumno

Reglas:
- Solo super_admin puede promover a admin.
- Los cambios de rol MUST pasar por endpoint/funcion de servidor autorizada.
- El cliente MUST NOT poder autoasignar roles superiores.
- La jerarquia de permisos MUST reforzarse con politicas de datos (RLS) y validaciones server-side.

## 7. Relacion con IA (Tutor Socratico)
La IA (Gemini 2.5 Flash o equivalente aprobado) es un feature de apoyo pedagogico.

Reglas obligatorias:
- La IA SHOULD guiar con preguntas, no entregar respuestas de examen.
- La IA MUST ejecutarse solo server-side.
- API keys MUST NOT existir en cliente.
- Debe existir kill-switch de IA durante evaluaciones activas.
- La IA MUST NOT reemplazar reglas deterministicas de progreso, grading o permisos.

## 8. Integraciones de Contenido Externo
Integracion constitucional en v1:
- YouTube
- Vimeo
- Google Drive (PDF)
- Google Slides
- OneDrive/SharePoint (PPTX)
- Notion (web note)

Principio de integracion:
- El sistema NO requiere OAuth con proveedores de contenido para v1.
- El instructor provee URL y el sistema resuelve proveedor/embebido.
- La logica de progreso MUST ser agnostica al proveedor.

## 9. Seguridad y Cumplimiento
Controles minimos obligatorios:
1. RLS activo en todas las tablas.
2. Service role y secrets prohibidos en cliente.
3. CSP estricta en produccion.
4. Signed URLs con TTL corto para recursos privados.
5. Rate limit de IA y controles antiabuso.
6. Endpoint de verificacion publica para certificados sin exponer dataset sensible.
7. Estrategia de backup/recuperacion definida para datos criticos.

## 10. Calidad, Testing y Evidencia
Calidad minima obligatoria:
- Tests unitarios/integracion para logica critica.
- E2E para flujos criticos de negocio.
- Verificaciones de PWA y performance en CI.
- Evidencia funcional antes de cierre de fase/ticket.

Cierre de trabajo SHOULD requerir evidencia verificable de:
- Comportamiento funcional.
- Seguridad de acceso.
- Trazabilidad de decisiones.

## 11. Gobierno de Agentes de IA
Los roles de agentes (Picoro, Goku, Vegeta, Krilin, Bulma y aprobacion humana) son un modelo de orquestacion, no autoridad autonoma.

Reglas para cualquier agente:
- MUST declarar skill/rol activo y fase.
- MUST dejar evidencia de salida.
- MUST respetar orden operativo acordado.
- MUST NOT implementar sin insumo de especificacion valido.
- MUST NOT saltar aprobacion humana en cierres criticos.

Orden operativo recomendado:
Picoro -> (Goku || Krilin) -> (Vegeta || Bulma) -> Aprobacion Humana

## 12. Metodo de Ejecucion por Fases
El proyecto sigue fases secuenciales desde setup hasta QA/launch.

Regla:
- No se permite avanzar de fase cuando los criterios minimos de la fase previa no estan cumplidos.
- Paralelizacion parcial es valida solo cuando no rompe dependencias duras.

## 13. Stack Tecnologico Constitucional
Stack base aprobado:
- Frontend: React + TypeScript/JavaScript + Vite
- UI: Tailwind + componentes accesibles
- Estado: Query para server-state y store para UI/estado local
- Backend: - REST API, Node.js, Express como framework base
- Base de Datos: Supabase (PostgreSQL, Auth, RLS, Realtime, Edge Functions)
- IA: Gemini 2.5 Flash via server-side
- CI/CD: pipelines con validaciones de calidad y seguridad
- Arquitectura modular por features

Cualquier desviacion significativa del stack MUST tramitarse como enmienda constitucional (MINOR o MAJOR segun impacto).

## 14. Estandar de Documentacion de Codigo
Se adopta el estandar de comentarios funcionales y de seguridad para piezas criticas, incluyendo convenciones del proyecto LMS (por ejemplo prefijo LMS y marcadores por tipo de riesgo).

Regla:
- Logica critica de seguridad, evaluacion, progreso e IA MUST quedar documentada para auditoria tecnica.

## 15. Politica de Versionado y Enmiendas
Se usa Semantic Versioning para esta constitucion:
- MAJOR: cambios fundacionales
- MINOR: ampliaciones no contradictorias
- PATCH: ajustes editoriales y aclaraciones

Protocolo de enmienda:
1. Propuesta documentada con impacto.
2. Revision de consistencia.
3. Aprobacion segun tipo de cambio.
4. Actualizacion del documento y changelog.
5. Trazabilidad issue -> commit -> constitucion.

Estado de congelacion:
- En beta/produccion solo PATCH, salvo excepcion aprobada explicitamente.

## 16. Escalabilidad y Evolucion
El marco constitucional aplica a futuras extensiones del ecosistema educativo.

Evolucion prevista:
- Multi-tenant.
- Videoclases integradas.
- Capacidades IA avanzadas con controles reforzados.
- Nuevos proveedores de contenido.

Cambios que alteren control humano, seguridad de evaluacion o privacidad sensible MUST tratarse como enmienda explicita.

## 17. Trazabilidad de Fuentes
Fuente primaria (obligatoria):
- 001-lms-ucc.md

Fuente de profesionalizacion (draft):
- tempo/lms-constitution.md

Cobertura de trazabilidad:
- preserved:
  - Proposito LMS PWA institucional.
  - Arquitectura por features.
  - Roles jerarquicos y control de permisos.
  - Evaluaciones seguras server-side.
  - Tutor IA socratico con kill-switch.
  - Integraciones de contenido externo.
  - Seguridad y RLS como reglas no negociables.
  - Versionado semantico y gobernanza de enmiendas.
- expanded:
  - Reglas MUST/SHOULD para reducir ambiguedad normativa.
  - Criterios de calidad y evidencia para cierre de fases.
  - Regla de congelacion en beta/produccion.
- merged:
  - Consolidacion de metas de UCC + alcance tecnico del borrador.

## 18. Estado
Constitucion canonica activa para diana-learning-app.

Esta constitucion gobierna specs, planes, tasks, tickets y decisiones de implementacion del proyecto.

## Changelog
### [1.0.0] - 2026-05-19 - Constitution generation (draft mode)
Cambios:
- Generada constitucion canonica desde UCC-001 + borrador de constitucion.
- Normalizada estructura contra plantilla base del SDK.
- Formalizadas reglas normativas con lenguaje MUST/SHOULD y trazabilidad explicita.
Autorizado por: Diana constitution agent

## 19. Estandar Constitucional de Documentacion de Codigo

Todo codigo generado por humanos o agentes de IA DEBE cumplir el siguiente
estandar de documentacion:

- Comentarios con prefijo `FIC:`
- Comentarios bilingues ingles/espanol (EN/ES)
- Cobertura minima en modulos, servicios, hooks publicos, logica critica,
  integraciones con brokers y motores de senales

Ejemplo:

```ts
// FIC: Calculates RSI indicator for trading signals (EN)
// FIC: Calcula el indicador RSI para senales de trading (ES)
export function calculateRSI(...) { ... }
```

La ausencia de este estandar bloquea el cierre de tickets.
