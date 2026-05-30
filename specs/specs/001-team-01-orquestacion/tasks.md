# Tasks: TEAM-01 Orquestacion Multi-Team

**Input**: `specs/001-team-01-orquestacion/spec.md`, `specs/001-team-01-orquestacion/plan.md`
**Prerequisites**: spec.md, plan.md

## F0 - Baseline y Gobierno Inicial

- [x] T001 [F0] [TEAM-01] Construir en la raiz del repo la estructura base canonica bajo `projects/` (`packages/ui-library`, `packages/utils`, `packages/types`, `pwa/lms_app`, `rest-api/lms_api`) respetando su jerarquia minima de directorios y archivos de configuracion.
- [ ] T002 [F0] [TEAM-01] Definir matriz de ownership y dependencias entre TEAM-01, TEAM-02 y TEAM-03.
- [ ] T003 [F0] [TEAM-01] Crear checklist canonico de evidencia por fase con criterios de cierre tecnico, seguridad y aprobacion humana.
- [ ] T004 [F0] [TEAM-01] Definir politica de ADR y trazabilidad de decisiones relevantes.
- [ ] T005 [F0] [TEAM-01] Ejecutar gate inicial de readiness para Speckit y registrar gaps.
- [ ] T006 [F0] [TEAM-01] Registrar evidencia canonica de F0 en `.drfic/diana-sdk/projects/diana-learning-app/initiatives/001-learning-app/teams/TEAM-01/evidence/f0-structure-baseline.md` (archivo oficial) y enlazar esa misma ruta en el cierre de F0 de esta feature.
- [ ] T007 [F0] [TEAM-01] Ejecutar validacion reproducible de conformidad F0 para confirmar que los archivos base (`package.json`, `tsconfig.json`, `index.html`, `.env.example`, `DATABASE_CONFIG.yaml`, `vite.config.ts`) no incluyen logica de negocio.

## F1-F7 - Control Inter-fase

- [ ] T101 [F1] [TEAM-01] Validar handoff y evidencia del slice de fase.
- [ ] T201 [F2] [TEAM-01] Validar consistencia de dependencias F1 -> F2.
- [ ] T301 [F3] [TEAM-01] Verificar protocolo de integridad academica y evidencia de seguridad.
- [ ] T401 [F4] [TEAM-01] Consolidar matriz de evidencia para logros/certificados.
- [ ] T501 [F5] [TEAM-01] Verificar protocolo de kill-switch IA y trazabilidad.
- [ ] T601 [F6] [TEAM-01] Validar readiness de resiliencia frontend/backend.
- [ ] T701 [F7] [TEAM-01] Consolidar criterios de cierre para permisos y moderacion.

## F8 - Cierre

- [ ] T801 [F8] [TEAM-01] Ejecutar gate final con evidencia consolidada, riesgos remanentes y aprobacion humana.
