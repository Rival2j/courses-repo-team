# Auditoría Cross-Project F10

**Feature**: `001-team-03-backend`  
**Fecha**: 2026-05-28  
**Scope auditado**: `projects/pwa/lms_app/src` y `projects/rest-api/lms_api/src`  
**Nota de corrección**: las rutas listadas en `T1001-T1003` ya apuntan a `projects/pwa/lms_app/...`; la ruta antigua `pwa_reference/projects/pwa/lms_app/...` quedó obsoleta tras mover el frontend.

## Resumen

La PWA estaba desacoplada del backend real en cuatro frentes:

1. `courses` consultaba Supabase directo en vez de usar los adapters `/pwa/courses`.
2. `evaluations` operaba completamente con mocks y omitía la Edge Function `submit-evaluation`.
3. `users` y `progress` no tenían cliente HTTP centralizado; el perfil en UI seguía hardcodeado y el progreso seguía solo en estado local.
4. Los contratos backend no toleraban bien el drift `snake_case/camelCase`, y `GET /evaluations/:evaluationId` no devolvía `policy`, aunque la PWA sí la requería.

## Hallazgos

| Área | Archivo PWA real | Situación encontrada | Contrato/backend correcto | Acción |
|------|-------------------|----------------------|---------------------------|--------|
| Courses | `projects/pwa/lms_app/src/features/course/courseService.ts` | `.from("cursos.courses")` directo y reconstrucción manual de módulos/lecciones | `GET /pwa/courses`, `GET /pwa/courses/:courseId` | Refactor a cliente HTTP central `src/lib/api.ts` |
| Users | `projects/pwa/lms_app/src/components/AppShell.tsx` | nombre/correo hardcodeados | `GET /users/me`, `GET /pwa/users/:userId/profile` | Cliente central preparado para ambas rutas |
| Progress | estado local en `courseStore.ts` | sin lectura del snapshot backend | `GET /courses/:courseId/progress`, `PUT /lessons/:lessonId/progress` | Normalización centralizada en `api.ts` |
| Evaluations | `projects/pwa/lms_app/src/features/evaluation/evaluationService.ts` | mocks para cargar, iniciar y enviar evaluaciones | `GET /evaluations/:evaluationId`, `POST /evaluations/:evaluationId/attempts`, Edge Function `POST {SUPABASE_URL}/functions/v1/submit-evaluation` | Refactor a rutas reales con fallback |
| DTO drift | `projects/rest-api/lms_api/src/dtos/*.ts` | esquemas rígidos en `snake_case`, incompatibles con adaptadores y consumo mixed-case | alias `snake_case/camelCase` y `policy` en evaluación | Endurecimiento Zod implementado |

## Discrepancias de contrato detectadas

### `courses`

- La PWA esperaba `summary`, `prerequisiteCourseIds`, `rating`, `reviewCount`, `modules`.
- El backend canónico ya lo resolvía vía `pwaAdapters.ts`; la PWA simplemente no lo consumía.

### `users`

- `GET /users/me` devuelve `{ auth, profile }`, mientras la UI esperaba un perfil plano.
- Se requiere normalización al borde cliente.

### `progress`

- El backend devuelve snapshot completo del curso con `lessons[]`.
- La PWA solo usa `completedLessons: Record<string, boolean>`.
- Se requiere proyección cliente, no cambio de endpoint.

### `evaluations`

- La PWA esperaba `policy.maxAttempts`, `policy.passingScore`, `policy.timeLimitSeconds`.
- `GET /evaluations/:evaluationId` no exponía `policy`; se corrigió en backend.
- El submit real no vive en REST sino en la Edge Function `submit-evaluation`.

## Decisiones aplicadas

- Mantener el backend canónico como fuente de verdad para `courses`, `users`, `progress` y `evaluations`.
- Usar `/pwa/*` solo donde ya existe un adapter explícito para la forma que consume la PWA.
- Mantener fallback local en la PWA para no dejar la app inutilizable cuando no exista sesión Supabase activa.
- Normalizar `snake_case/camelCase` tanto en DTOs backend como en el cliente PWA.
