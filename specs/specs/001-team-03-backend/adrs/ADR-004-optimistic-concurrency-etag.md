# ADR-004: Concurrencia Optimista con ETag/If-Match para Sincronización de Progreso

**Estado**: Aceptado  
**Fecha**: 2026-05-27  
**Autores**: TEAM-03 Backend  
**Contexto**: T622, progress.ts, courseAccess.ts

---

## Contexto

El sistema soporta uso offline (PWA). Un alumno puede continuar una lección sin conexión, y cuando recupera red, el cliente envía la actualización de progreso al servidor. El riesgo es que el servidor tenga un estado más reciente (ej. completado por otra sesión) y el write diferido lo revierta.

## Decisión

Implementar concurrencia optimista usando columna `version` en `cursos.progress` y headers HTTP estándar:

1. **Columna `version`**: Número entero auto-incrementado en cada UPDATE via trigger `trg_increment_progress_version`.
2. **Contrato HTTP**:
   - `GET /users/:id/progress` retorna `version` en cada registro.
   - `PUT /lessons/:id/progress` acepta header `If-Match: "<version>"`.
   - Si versión del cliente ≠ versión del servidor: HTTP 409 `{ error: "conflict", current_version: N }`.
   - Si coincide: aplica update, retorna HTTP 200 con `ETag: "<nueva_version>"`.
3. **Política completed-wins**: Si el servidor tiene `completed=true`, un write con `completed=false` se ignora silenciosamente (retorna estado actual, sin error, sin modificar).

## Alternativas consideradas

| Opción | Pros | Contras |
|--------|------|---------|
| Last-write-wins | Simple | Puede revertir progreso completado |
| Timestamps (updated_at) | Familiar | Race conditions en actualizaciones rápidas |
| **Versiones enteras (elegida)** | Determinístico, sin race conditions | Requiere `version` en DB y en cliente |
| CRDTs | Correcto sin coordinación | Complejo, innecesario para este modelo |

## Consecuencias

- El cliente debe almacenar el `version` de cada registro de progreso.
- El cliente debe enviar `If-Match: "<version>"` en cada PUT de progreso.
- Si recibe 409, debe hacer GET para obtener la versión actual y decidir qué hacer.
- La política completed-wins garantiza que el progreso nunca retrocede desde `completed=true`.

## Estado de implementación

- Columna `version` y trigger: ✅ Migration `20260527000002_sync_version.sql` aplicada.
- `upsertLessonProgress` con conflict detection: ✅ `src/lib/courseAccess.ts`.
- `PUT /lessons/:id/progress` con ETag: ✅ `src/routes/progress.ts`.
- `GET /sync/policy` con config de retry: ✅ `src/routes/sync.ts`.
- Tests T622 conflict/completed-wins: ⚠️ 2 de 4 tests aún fallando (en ajuste).

## Trazabilidad

- Migration: `supabase/migrations/20260527000002_sync_version.sql`
- Implementación: `src/lib/courseAccess.ts`, `src/routes/progress.ts`
- Endpoint de política: `GET /sync/policy`
- Tests: `test/integration.test.ts` (T622 suite)
