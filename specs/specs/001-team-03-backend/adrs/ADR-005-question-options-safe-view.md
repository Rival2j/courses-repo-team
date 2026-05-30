# ADR-005: Vista `question_options_safe` — Garantía de No-Exposición de is_correct

**Estado**: Aceptado  
**Fecha**: 2026-05-27  
**Autores**: TEAM-03 Backend  
**Contexto**: T323, evaluaciones

---

## Contexto

La tabla `cursos.question_options` incluye la columna `is_correct` (boolean) que indica cuál es la respuesta correcta de cada opción. Esta información **jamás debe llegar al cliente** — exponerla permitiría hacer trampa en evaluaciones.

El riesgo es que un query directo a `question_options` (incluso via Supabase client autenticado) retorne `is_correct`. RLS puede prevenir reads completos, pero no puede ocultar columnas específicas.

## Decisión

Crear una vista `cursos.question_options_safe` que excluye `is_correct`:

```sql
CREATE VIEW cursos.question_options_safe AS
  SELECT id, question_id, text, position
  FROM cursos.question_options;
```

Reglas de uso:
1. Todos los queries client-facing que retornan opciones de preguntas **deben** usar `question_options_safe`.
2. `question_options` (con `is_correct`) solo se usa en Edge Functions server-side para grading.
3. RLS en `question_options` deniega SELECT directo a roles no-service.

## Alternativas consideradas

| Opción | Pros | Contras |
|--------|------|---------|
| RLS que oculta filas | Nativo de Postgres | No puede ocultar columnas, solo filas |
| Column-level security | Granular | No disponible en Supabase de forma directa |
| **Vista sin is_correct (elegida)** | Simple, imposible de bypassear | Requiere disciplina de uso en código |
| Encriptar is_correct en DB | Máxima seguridad | Complejo, innecesario para este threat model |

## Consecuencias

- `getEvaluationWithQuestions()` debe usar `question_options_safe` — actualmente usa `question_options` directa (gap en T323).
- Tests verifican que `SELECT * FROM question_options_safe` no retorna `is_correct` — ✅ pasando.
- Tests verifican que la vista existe — ✅ pasando.
- Test de integración `getEvaluationWithQuestions uses safe view` — ⚠️ fallando (función usa tabla directa).

## Plan de resolución

Actualizar `getEvaluationWithQuestions()` en `src/lib/evaluations.ts`:

```typescript
// Actual (incorrecto):
FROM question_options WHERE question_id = $1

// Correcto:
FROM question_options_safe WHERE question_id = $1
```

## Trazabilidad

- Vista creada en: migration de evaluaciones (compañero de equipo)
- Validación: `test/integration.test.ts` — T323 suite
- Gap pendiente: `src/lib/evaluations.ts` o equivalente — usar `question_options_safe`
