# Diana Engine Handoff
## 001-learning-app

Identificador: 001-LMS-HANDOFF
Proyecto: diana-learning-app
Iniciativa: 001-learning-app
Engine objetivo: speckit
Stage objetivo: implement
Version de generacion: 1.0.0
Accion: /diana.integrate action="generate"

---

## Autoridad

Este handoff esta subordinado a:
1. lms-constitution.md
2. 001-lms-ucc.md
3. teams/TEAM-XX/spec.md
4. teams/TEAM-XX/plan.md
5. teams/TEAM-XX/tasks.md

Ante conflicto, prevalece el canon Diana.

---

## Objetivo

Definir exactamente que debe consumir Speckit, en que orden y con que limites,
sin reinterpretar el canon Diana.

---

## Engine y Stage Objetivo

- engine: speckit
- stage: implement
- etapa_equivalente_en_sdd_engine_matrix: implement -> speckit.implement (resuelto desde integration-profile.md)
- required_skills:
  - speckit.specify
  - speckit.plan
  - speckit.tasks
  - speckit.implement

---

## Perfil de Integracion (Fase 0)

- integration_profile_path: initiatives/001-learning-app/integrations/integration-profile.md
- engine_selection: speckit
- orchestration_mode: manual
- delivery_topology: multi_team
- authority_policy: diana_canon_strict
- sync_policy: on_merge + sync manual habilitado

---

## Artefactos Diana de Entrada Obligatoria

- Constitucion canonica:
  - .drfic/diana-sdk/projects/diana-learning-app/lms-constitution.md
- UCC canonico:
  - .drfic/diana-sdk/projects/diana-learning-app/governance/change-requests/001-lms-ucc.md
- Division de equipos:
  - .drfic/diana-sdk/projects/diana-learning-app/initiatives/001-learning-app/scope_primario.md
  - .drfic/diana-sdk/projects/diana-learning-app/initiatives/001-learning-app/meta.md
- Artefactos por equipo para ejecucion Speckit:
  - .drfic/diana-sdk/projects/diana-learning-app/initiatives/001-learning-app/teams/TEAM-01/spec.md
  - .drfic/diana-sdk/projects/diana-learning-app/initiatives/001-learning-app/teams/TEAM-01/plan.md
  - .drfic/diana-sdk/projects/diana-learning-app/initiatives/001-learning-app/teams/TEAM-01/tasks.md
  - .drfic/diana-sdk/projects/diana-learning-app/initiatives/001-learning-app/teams/TEAM-02/spec.md
  - .drfic/diana-sdk/projects/diana-learning-app/initiatives/001-learning-app/teams/TEAM-02/plan.md
  - .drfic/diana-sdk/projects/diana-learning-app/initiatives/001-learning-app/teams/TEAM-02/tasks.md
  - .drfic/diana-sdk/projects/diana-learning-app/initiatives/001-learning-app/teams/TEAM-03/spec.md
  - .drfic/diana-sdk/projects/diana-learning-app/initiatives/001-learning-app/teams/TEAM-03/plan.md
  - .drfic/diana-sdk/projects/diana-learning-app/initiatives/001-learning-app/teams/TEAM-03/tasks.md
- Indices de conocimiento requeridos:
  - .drfic/diana-sdk/projects/diana-learning-app/knowledge/indexes/sdd-engine-matrix.yaml
  - .drfic/diana-sdk/projects/diana-learning-app/knowledge/indexes/skills-manifest.yaml
  - .drfic/diana-sdk/projects/diana-learning-app/knowledge/indexes/agent-skill-matrix.yaml

---

## Orden de Ejecucion Recomendado

1. Cargar profile de integracion y validar topologia multi_team.
2. Ejecutar /diana.teams action="generate" para producir artefactos Speckit de coordinacion.
3. Generar canon por equipo con Diana:
   - /diana.specify
   - /diana.plan
   - /diana.tasks
4. Ejecutar por equipo en Speckit respetando entrada canonica:
   - speckit.specify (base: teams/TEAM-XX/spec.md)
   - speckit.plan (base: teams/TEAM-XX/plan.md + spec vigente)
   - speckit.tasks (base: teams/TEAM-XX/tasks.md + plan/spec vigentes)
   - speckit.implement (cuando no haya gaps)
5. Ejecutar reconciliacion de tareas con Diana (dry-run -> apply).

---

## Reglas de Consumo por Engine

- Speckit puede optimizar, ampliar y complementar el contenido canonico.
- Speckit NO puede omitir requisitos, decisiones o alcance ya validados por Diana.
- Speckit NO puede reinterpretar autoridad de canon.
- Si aparece dropped no justificado en cobertura, detener etapa y marcar GAP.
- Reporte de cobertura obligatorio por etapa:
  - preserved
  - expanded
  - merged
  - dropped

---

## Multi-equipo

- requiere_diana_teams: true
- equipos_registrados:
  - TEAM-01 (scrum-master)
  - TEAM-02 (frontend)
  - TEAM-03 (backend)
- archivos_de_equipo_obligatorios:
  - teams/TEAM-XX/spec.md
  - teams/TEAM-XX/plan.md
  - teams/TEAM-XX/tasks.md
- politica_de_ownership:
  - cada equipo opera en su carpeta TEAM-XX
  - cambios transversales requieren trazabilidad inter-equipo en plan/tasks

---

## Reconciliacion de Tareas

- trigger_automatico: on_merge
- comando_manual: /diana.sync action="tasks"
- regla_cierre_global: all_slices_completed
- manejo_de_conflictos: block_global_close

---

## Ready / Gaps

- ready_status: parcial
- gaps:
  1. Falta sdd-engine-matrix.yaml en knowledge/indexes.
  2. Falta skills-manifest.yaml en knowledge/indexes.
  3. Falta agent-skill-matrix.yaml en knowledge/indexes.
  4. Faltan spec.md por equipo (TEAM-01, TEAM-02, TEAM-03).
  5. Faltan plan.md por equipo (TEAM-01, TEAM-02, TEAM-03).
  6. Faltan tasks.md por equipo (TEAM-01, TEAM-02, TEAM-03).
  7. Falta carpeta speckit con team-task-allocation.md y team-agent-bootstrap.md (a generar por /diana.teams action="generate").
- acciones_recomendadas:
  1. /diana.skills action="generate" scope="project" project="diana-learning-app"
  2. /diana.knowledge scope="project" project="diana-learning-app"
  3. /diana.teams action="generate" project="diana-learning-app" initiative="001-learning-app"
  4. /diana.specify project="diana-learning-app" initiative="001-learning-app"
  5. /diana.plan project="diana-learning-app" initiative="001-learning-app"
  6. /diana.tasks project="diana-learning-app" initiative="001-learning-app"
  7. /diana.integrate action="validate" engine="speckit" project="diana-learning-app" initiative="001-learning-app"

---

## Lista Canonica para Consumo del Engine (Sin Reinterpretar)

1. .drfic/diana-sdk/projects/diana-learning-app/lms-constitution.md
2. .drfic/diana-sdk/projects/diana-learning-app/governance/change-requests/001-lms-ucc.md
3. .drfic/diana-sdk/projects/diana-learning-app/initiatives/001-learning-app/meta.md
4. .drfic/diana-sdk/projects/diana-learning-app/initiatives/001-learning-app/scope_primario.md
5. .drfic/diana-sdk/projects/diana-learning-app/initiatives/001-learning-app/teams/TEAM-01/spec.md
6. .drfic/diana-sdk/projects/diana-learning-app/initiatives/001-learning-app/teams/TEAM-01/plan.md
7. .drfic/diana-sdk/projects/diana-learning-app/initiatives/001-learning-app/teams/TEAM-01/tasks.md
8. .drfic/diana-sdk/projects/diana-learning-app/initiatives/001-learning-app/teams/TEAM-02/spec.md
9. .drfic/diana-sdk/projects/diana-learning-app/initiatives/001-learning-app/teams/TEAM-02/plan.md
10. .drfic/diana-sdk/projects/diana-learning-app/initiatives/001-learning-app/teams/TEAM-02/tasks.md
11. .drfic/diana-sdk/projects/diana-learning-app/initiatives/001-learning-app/teams/TEAM-03/spec.md
12. .drfic/diana-sdk/projects/diana-learning-app/initiatives/001-learning-app/teams/TEAM-03/plan.md
13. .drfic/diana-sdk/projects/diana-learning-app/initiatives/001-learning-app/teams/TEAM-03/tasks.md
14. .drfic/diana-sdk/projects/diana-learning-app/knowledge/indexes/sdd-engine-matrix.yaml
15. .drfic/diana-sdk/projects/diana-learning-app/knowledge/indexes/skills-manifest.yaml
16. .drfic/diana-sdk/projects/diana-learning-app/knowledge/indexes/agent-skill-matrix.yaml

---

## Estado

Este documento constituye el Handoff Oficial entre Diana y Speckit para la iniciativa 001-learning-app.
