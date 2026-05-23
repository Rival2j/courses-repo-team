# CONTROL DE CAMBIOS (UCC)

---

## Identificacion del Proyecto
- Folio: 001-UCC-LMS
- Nombre del Proyecto: Plataforma LMS Escolar PWA Asistida por IA
- Sistema / Modulo: Auth, Courses, Lessons, Evaluations, Gamification, AI Chat, Admin
- Tipo de Proyecto: Desarrollo de Plataforma Web Educativa (LMS)
- Descripcion Breve: Plataforma LMS tipo PWA para instituciones escolares con progreso trazable, evaluaciones seguras del lado servidor, y tutor IA socratico.
- Area: Tecnologia / Educacion Digital
- Cliente(s) Interno(s): Direccion Academica, Coordinacion Academica, Instructores
- Fecha Planeada Inicio/Fin: PENDIENTE / PENDIENTE

---

## Tickets relacionados

| Tipo de Ticket | ID | Descripcion |
|----------------|----|-------------|
| TKT-LMS        | 001-TKT-LMS | Solicitud de plataforma LMS institucional con IA asistiva |

---

## Responsables
- Responsable del Cambio por el Area: PENDIENTE
- Key User Responsable: PENDIENTE
- Jefe de Area: PENDIENTE
- Gerente de Departamento: PENDIENTE

---

## Identificacion del Documento
- Autor(es): Equipo Producto / Equipo Tecnico
- Version: 1.0
- Estatus: En Especificacion
- Fecha: 2026-05-19
- Clasificacion del Documento: Control de Cambios / Requerimiento

---

## Objetivo del Requerimiento

Implementar una plataforma LMS escolar como PWA que permita a la institucion organizar contenido academico (cursos, modulos, lecciones), ejecutar evaluaciones con integridad y trazabilidad, habilitar gamificacion verificable y asistir al aprendizaje con IA socratica, sin comprometer seguridad ni control humano.

---

## Descripcion del Requerimiento

El sistema debe:
- Organizar el aprendizaje en cursos -> modulos -> lecciones con prerequisitos.
- Permitir a instructores crear y publicar contenido en formatos video, pdf, pptx y notas web.
- Aplicar evaluaciones con grading exclusivamente del lado servidor.
- Evitar exposicion al cliente de respuestas correctas u objetos sensibles de evaluacion.
- Integrar tutor IA socratico con kill-switch durante evaluaciones activas.
- Emitir certificados verificables publicamente con codigo unico.
- Proveer trazabilidad de progreso, intentos y resultados.
- Operar con arquitectura modular por features y control de acceso por roles.

Beneficios de SI hacerlo:
1. Estandariza el proceso de ensenanza y seguimiento academico.
2. Reduce carga operativa manual de evaluacion y evidencia academica.
3. Mejora calidad de aprendizaje con trazabilidad y soporte IA controlado.

Impactos de NO hacerlo:
1. Continuidad de procesos manuales con baja trazabilidad.
2. Mayor riesgo de inconsistencias en evaluacion y certificacion.
3. Menor capacidad institucional para escalar oferta educativa digital.

---

## Situacion Actual

Actualmente no existe una plataforma LMS institucional unificada con las reglas de seguridad, trazabilidad y progresion definidas en la constitucion del proyecto.

Problemas observados:
- Procesos de contenido y seguimiento distribuidos en herramientas no integradas.
- Falta de trazabilidad end-to-end de progreso y evaluaciones.
- Ausencia de un esquema formal de roles y permisos jerarquicos.
- Ausencia de un flujo de IA seguro y acotado para apoyo pedagogico.

---

## Proceso Actual (Relato)

- El contenido academico se publica en medios dispersos.
- La evaluacion y seguimiento se ejecutan parcialmente de forma manual.
- No existe un mecanismo unico para prerequisitos, historial de intentos y evidencia.
- No hay mecanismo institucional estandar para certificados verificables.

---

## Informacion Tecnica Relacionada
- Stack objetivo: React + TypeScript + Vite (PWA), Supabase, Edge Functions.
- Seguridad: RLS obligatorio en tablas, JWT verificado, secretos fuera del cliente.
- Integraciones previstas: Google Gemini 2.5 Flash (solo server-side).
- Referencias canonicamente vinculadas:
  - .drfic/diana-sdk/memory/project_constitution.md
  - specs/001-spec-fundacional/spec.md

---

## Mejoras y Cambios Solicitados

1. Implementar arquitectura por features desacopladas para LMS.
2. Implementar modelo de roles jerarquicos (`super_admin`, `admin`, `instructor`, `moderador`, `alumno`).
3. Implementar evaluaciones con grading server-side y control de intentos.
4. Implementar prerequisitos y progresion verificable.
5. Implementar gamificacion y certificados verificables.
6. Implementar tutor IA socratico con kill-switch en evaluaciones activas.
7. Implementar PWA instalable con soporte offline basico.

---

## Pendientes y Acuerdos de Reunion

Pendientes:
- Confirmar responsables formales y aprobadores.
- Definir fechas objetivo y ventana de salida.
- Definir KPIs de exito institucional para fase inicial.

Acuerdos actuales:
- La constitucion del proyecto es autoridad primaria.
- La spec fundacional define el alcance funcional inicial.
- Cualquier implementacion debe seguir Spec-Driven Development.

---

## Validacion de la Meta del Proyecto

KPIs propuestos (pendientes de ratificacion):
- Cobertura operativa inicial: 50-100 usuarios.
- Grading server-side: 100% de intentos.
- Bloqueo de IA en evaluaciones activas: 100%.
- Soporte PWA: instalable y offline basico funcional.

---

## Identificacion de Causas Probables

- Maquinaria: No aplica directamente.
- Materiales: Dispersos (contenido en herramientas no estandarizadas).
- Mano de Obra: Alta dependencia de procesos manuales.
- Metodo: Falta de flujo canonicamente definido y gobernado para LMS.

---

## Entregables Esperados

- Constitucion vigente y ratificada.
- Spec fundacional aprobada para ejecucion.
- Plan tecnico canonicamente alineado.
- Backlog de tareas priorizado para implementacion.
- Plataforma MVP LMS con trazabilidad de aprendizaje y evaluacion segura.

---

## Impactos

| Factor | Descripcion |
|--------|-------------|
| Alcance | Implementacion de LMS fundacional con IA asistiva y control humano |
| Cronograma | PENDIENTE (estimado por fases en plan) |
| Recursos | Equipo producto + equipo tecnico |
| Presupuesto Estimado | PENDIENTE |
| Supuestos | Disponibilidad de equipo y entorno Supabase/hosting |
| Impacto de No hacer el cambio | Mantener baja trazabilidad y alta operacion manual |
| Impacto estimado de desarrollo/configuracion | Alto impacto inicial, alto retorno operativo y academico |
| Otro | Requiere gobierno activo de seguridad y cumplimiento |

---

## Aprobacion

| Nombre | Puesto | Fecha | Firma |
|--------|--------|-------|-------|
| PENDIENTE | PENDIENTE | PENDIENTE | PENDIENTE |
| PENDIENTE | PENDIENTE | PENDIENTE | PENDIENTE |
| PENDIENTE | PENDIENTE | PENDIENTE | PENDIENTE |

---

## Colaboradores

| Nombre | Puesto | Fecha | Firma |
|--------|--------|-------|-------|
| PENDIENTE | PENDIENTE | PENDIENTE | PENDIENTE |
| PENDIENTE | PENDIENTE | PENDIENTE | PENDIENTE |
| PENDIENTE | PENDIENTE | PENDIENTE | PENDIENTE |

---

## Estado

Documento creado como UCC base canonico del proyecto LMS.
Pendiente de ratificacion de responsables, fechas y aprobaciones.
