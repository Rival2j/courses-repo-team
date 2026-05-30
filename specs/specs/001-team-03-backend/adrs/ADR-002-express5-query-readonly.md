# ADR-002: req.query Read-Only en Express 5 — Impacto en Middleware de Validación

**Estado**: Aceptado (gap documentado)  
**Fecha**: 2026-05-27  
**Autores**: TEAM-03 Backend  
**Contexto**: T524, notifications.ts

---

## Contexto

En Express 4, `req.query` era un objeto mutable. El middleware `validate()` en `src/middleware/validate.ts` asigna el resultado parseado de Zod directamente: `req.query = result.data`. Esto permitía que los handlers recibieran valores tipados (number, boolean) en lugar de strings.

Al migrar a Express 5, `req.query` se convirtió en una propiedad getter read-only. La asignación `req.query = result.data` falla silenciosamente — el objeto no se modifica.

## Síntoma

`GET /notifications` sin query params explícitos en URL lanza:

```
PostgresError: PostgreSQL error code: UNDEFINED_VALUE
```

Porque `req.query.limit` y `req.query.offset` son `undefined` cuando no se pasan en la URL, y postgres.js rechaza interpolar `undefined`.

## Decisión

Para los handlers afectados, leer `req.query` directamente con valores por defecto en lugar de depender de la transformación del middleware:

```typescript
// Patrón correcto para Express 5
const limit = Number(req.query.limit ?? 20);
const offset = Number(req.query.offset ?? 0);
const unread_only = req.query.unread_only === "true";
```

El middleware `validate({ query: schema })` aún es útil para rechazar inputs inválidos (retorna 400), pero **no** se debe confiar en su capacidad de transformar `req.query`.

## Alternativas consideradas

| Opción | Pros | Contras |
|--------|------|---------|
| Monkey-patch `req.query` | Mantiene el patrón del middleware | Frágil, no documentado, puede romperse |
| Usar `Object.defineProperty` | Técnicamente funciona | Oscuro, viola el contrato de Express 5 |
| **Defaults en handlers (elegida)** | Simple, explícito, sin sorpresas | Duplica algo de lógica de parsing |
| Mover a body en POST | Evita el problema | Rompe semántica REST GET |

## Consecuencias

- Handlers que usan query params deben leer con defaults explícitos.
- El middleware `validate({ query: schema })` se mantiene para validación de tipos/formato, no para transformación.
- Este patrón aplica a: `/notifications`, cualquier endpoint con paginación via query que use undefined-safe defaults.

## Trazabilidad

- Archivo afectado: `projects/rest-api/lms_api/src/routes/notifications.ts`
- Middleware raíz: `projects/rest-api/lms_api/src/middleware/validate.ts`
- Bug conocido documentado en `evidence-t821.md` §2.5
