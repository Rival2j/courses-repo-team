# Ticket de Servicio
## 001-lms-tkt

## Relacion
- UCC: 001-lms-ucc

## Titulo
Implementacion inicial de la plataforma LMS institucional con IA asistiva

## Solicitud
Ejecutar el requerimiento descrito en el UCC 001-lms-ucc para construir el MVP de la plataforma LMS PWA con evaluaciones seguras server-side, trazabilidad academica, roles jerarquicos y tutor IA socratico bajo control institucional.

## Prioridad
- medium

## Estado
- OPEN


---

## Descripcion de la necesidad

Como usuario del area academica,
necesito contar con una plataforma LMS institucional
que me permita organizar cursos, modulos y lecciones,
gestionar evaluaciones seguras y dar seguimiento trazable
al progreso de los alumnos,
para mejorar la calidad educativa y reducir procesos manuales.

Actualmente:
- El contenido academico esta disperso en herramientas no integradas.
- La evaluacion y el seguimiento requieren trabajo manual.
- No existe trazabilidad integral de progreso e intentos.
- No hay un esquema unificado de certificacion verificable.

---

## Objetivo del ticket

Solicitar el desarrollo de una plataforma LMS escolar PWA
asistida por IA, que permita:

- Gestionar contenido academico por cursos, modulos y lecciones.
- Aplicar prerequisitos y progresion verificable.
- Ejecutar evaluaciones con grading del lado servidor.
- Integrar tutor IA socratico como apoyo al aprendizaje.
- Emitir certificados verificables publicamente.
- Mantener control y trazabilidad de decisiones academicas.

---

## Alcance esperado (a nivel negocio)

Incluye:
- Gestion de cursos y contenido por rol.
- Progreso trazable del alumno.
- Evaluaciones con control de intentos.
- Gamificacion y certificacion verificable.
- Soporte IA para tutorias socraticas.

Excluye:
- Definicion de arquitectura tecnica detallada.
- Seleccion final de implementaciones internas por modulo.
- Cambios de alcance no aprobados por UCC.

Estos elementos seran definidos mediante
Spec-Driven Development (SDD).

---

## Criterios generales de aceptacion (negocio)

- La solucion debe ser auditable y trazable por rol.
- El grading de evaluaciones debe ejecutarse en servidor.
- La IA no debe responder evaluaciones activas ni omitir reglas academicas.
- El acceso a contenido debe respetar prerequisitos.
- Los certificados emitidos deben poder verificarse publicamente.

---

## Restricciones y reglas no negociables

- Alineacion obligatoria con la constitucion del proyecto.
- Control humano explicito en decisiones academicas clave.
- Seguridad de credenciales y secretos fuera del cliente.
- No exponer respuestas correctas de evaluaciones al frontend.

---

## Supuestos

- Se cuenta con equipo tecnico para ejecutar el plan por fases.
- Se dispone de entorno base para PWA y backend gestionado.
- El alcance inicial considera una base operativa de usuarios definida por negocio.

---

## Prioridad y estado

Prioridad:
Alta

Estado del ticket:
Aprobado para diseno mediante SDD

---

## Trazabilidad canonica

Artefactos vinculados:
- UCC: .drfic/diana-sdk/governance/change-requests/001-lms-ucc.md
- Constitucion: .drfic/diana-sdk/memory/project_constitution.md
- Spec fundacional operativa: specs/001-spec-fundacional/spec.md
- Spec canonica DIANA: .drfic/diana-sdk/specs/001-spec-drfic.md

---

## Notas adicionales

Este ticket describe la necesidad de negocio.
La solucion tecnica, planificacion y backlog
se definiran mediante DIANA-SDK y Speckit
sobre artefactos canonicamente aprobados.
