# Diana Integration Profile
## 001-learning-app

Identificador: 001-LMS-INTEGRATION-PROFILE
Proyecto: diana-learning-app
Iniciativa: 001-learning-app
Version de perfil: 1.0.0
Accion: /diana.integrate action="bootstrap"

---

## Decisiones Obligatorias de Integracion

1. motor_sdd:
- speckit

2. orquestacion:
- automatic

3. topologia_desarrollo:
- multi_team

4. politica_autoridad:
- diana_canon_strict

---

## Politica de Automatizacion por Etapa

- auto_on_constitution: false
- auto_on_specify: true
- auto_on_plan: true
- auto_on_tasks: true
- auto_on_teams: false
- auto_on_implement: false

Regla:
- Si topologia_desarrollo=multi_team, nunca disparar implementacion distribuida hasta completar /diana.teams.
- Si topologia_desarrollo=single_dev, se permite pipeline continuo por etapa.

---

## Politica de Sincronizacion de Tareas

- sync_trigger_automatico:
  - on_merge
- sync_manual_habilitado: true
- comando_manual_recomendado: /diana.sync action="tasks"
- regla_cierre_global: all_slices_completed
- conflicto_sin_mapeo: block_global_close

---

## Politica de Nomenclatura de Features Speckit

Regla obligatoria para `speckit.specify` en topologia `multi_team`:

- patron_slug_feature: `NNN-team-XX-descripcion-relacionada`
- ejemplo_TEAM-01: `001-team-01-orquestacion`
- ejemplo_TEAM-02: `001-team-02-frontend-pwa`
- ejemplo_TEAM-03: `001-team-03-backend`

Reglas de enforcement:

- Diana debe pasar el nombre del feature/branch a Speckit con el patron anterior.
- Si Speckit propone un slug distinto, se normaliza al patron canonico antes de crear carpeta en `specs/`.
- Si no se puede normalizar automaticamente, marcar `GAP` y detener la etapa.

---

## Equivalencia de Etapas (Engine: speckit)

- specify -> speckit.specify
- clarify -> speckit.clarify
- plan -> speckit.plan
- tasks -> speckit.tasks
- implement -> speckit.implement

required_skills:
- speckit.specify
- speckit.plan
- speckit.tasks
- speckit.implement

---

## Artefactos Diana de Entrada (Sin Reinterpretar Canon)

- initiatives/001-learning-app/teams/TEAM-XX/spec.md
- initiatives/001-learning-app/teams/TEAM-XX/plan.md
- initiatives/001-learning-app/teams/TEAM-XX/tasks.md
- knowledge/indexes/sdd-engine-matrix.yaml
- knowledge/indexes/skills-manifest.yaml
- knowledge/indexes/agent-skill-matrix.yaml

---

## Estado

Bootstrap de integracion completado para Speckit en topologia multi_team.
Este perfil es la fuente de verdad para topologia humana y debe ser consumido por /diana.teams action="topology".
