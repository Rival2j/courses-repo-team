# Evidencia F0 - Structure Baseline

Proyecto: diana-learning-app
Iniciativa: 001-learning-app
Equipo: TEAM-01
Fase: F0
Fecha de registro: 2026-05-21
Estado: draft

## Trazabilidad

- T006 (TEAM-01 Diana): registro de evidencia canonica F0.
- T007 (TEAM-01 Diana): validacion reproducible sin logica de negocio en archivos base.
- T006 (Feature Speckit TEAM-01): referencia al cierre de F0.
- T007 (Feature Speckit TEAM-01): validacion reproducible de conformidad F0.

## Alcance Validado

Se valida el baseline minimo de estructura fisica en raiz del repositorio bajo `projects/`:

- `projects/packages/ui-library`
- `projects/packages/utils`
- `projects/packages/types`
- `projects/pwa/lms_app`
- `projects/rest-api/lms_api`

## Checklist de Estructura Base

- [ ] Existe `projects/` en la raiz del repo.
- [ ] Existe `projects/packages/ui-library/src/`.
- [ ] Existe `projects/packages/utils/src/`.
- [ ] Existe `projects/packages/types/src/`.
- [ ] Existe `projects/pwa/lms_app/public/`.
- [ ] Existe `projects/pwa/lms_app/src/`.
- [ ] Existe `projects/pwa/lms_app/tests/e2e/`.
- [ ] Existe `projects/rest-api/lms_api/src/`.
- [ ] Existe `projects/rest-api/lms_api/src/routes/`.
- [ ] Existe `projects/rest-api/lms_api/src/controllers/`.
- [ ] Existe `projects/rest-api/lms_api/src/services/`.
- [ ] Existe `projects/rest-api/lms_api/src/models/`.
- [ ] Existe `projects/rest-api/lms_api/src/migrations/`.
- [ ] Existe `projects/rest-api/lms_api/src/config/`.

## Checklist de Archivos Base Minimos

- [ ] `projects/packages/ui-library/package.json`
- [ ] `projects/packages/ui-library/tsconfig.json`
- [ ] `projects/packages/utils/package.json`
- [ ] `projects/packages/utils/tsconfig.json`
- [ ] `projects/packages/types/package.json`
- [ ] `projects/packages/types/tsconfig.json`
- [ ] `projects/pwa/lms_app/index.html`
- [ ] `projects/pwa/lms_app/package.json`
- [ ] `projects/pwa/lms_app/tsconfig.json`
- [ ] `projects/pwa/lms_app/vite.config.ts`
- [ ] `projects/rest-api/lms_api/.env.example`
- [ ] `projects/rest-api/lms_api/DATABASE_CONFIG.yaml`
- [ ] `projects/rest-api/lms_api/package.json`
- [ ] `projects/rest-api/lms_api/tsconfig.json`

## Validacion Reproducible - Sin Logica de Negocio

Criterio:
- Los archivos base del baseline F0 solo contienen configuracion/metadata.
- No incluyen implementacion funcional de negocio, reglas de dominio, endpoints operativos ni servicios de aplicacion.

Evidencia de validacion:
- Metodo usado: revision de contenido + verificacion de rutas.
- Resultado: pendiente.
- Observaciones: pendiente.

## Referencias

- Feature Speckit: `specs/001-team-01-orquestacion`
- Tasks Speckit: `specs/001-team-01-orquestacion/tasks.md`
- Tasks Diana TEAM-01: `.drfic/diana-sdk/projects/diana-learning-app/initiatives/001-learning-app/teams/TEAM-01/tasks.md`

## Aprobacion Humana

- Responsable TEAM-01: pendiente
- Fecha de aprobacion: pendiente
- Decision de cierre F0: pendiente
