# Especificación propuesta: `resource_views`

Propósito
- Registrar evidencia fiable de que un usuario vio un recurso durante un periodo mínimo.
- Soporta decisiones académicas (marcar `progress.completed`), auditoría y disparo de procesos asíncronos (notificaciones, XP, analytics).

Dónde reside
- Datos operativos: `resource_views` (heartbeats, duración por sesión).
- Estado académico: `progress` (marca final de completado por lección/enrollment).
- Integración/asíncrono: `domain_events` (evento `resource.viewed`).

Cuándo usarlo
- Cuando el requisito es "usuario vio X recurso por al menos Y tiempo" y no basta con un simple clic.
- Para medir engagement, activar desbloqueos y calcular logros/XP.

Esquema mínimo propuesto
```sql
CREATE TABLE cursos.resource_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES cursos.profiles(id),
  resource_id uuid NOT NULL,
  session_id uuid NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  duration_ms bigint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, resource_id, session_id)
);
```

Flujo operativo (resumen)
1. El cliente envía heartbeats periódicos (p. ej. cada 10–30s) con `session_id` generado por el cliente.
2. El servidor hace `UPSERT`/`ON CONFLICT` en `resource_views`, calculando `duration_ms` usando timestamps del servidor.
3. Cuando `duration_ms >= umbral` (p. ej. 5 min) se ejecuta en una transacción:
   - Actualiza `progress.completed = true` y `completed_at`.
   - Inserta un `domain_events` tipo `resource.viewed` con payload mínimo.
   - Emite notificaciones/XP via consumer (worker o Edge Function).

Ejemplo mínimo de inserción de evento
```sql
INSERT INTO cursos.domain_events (event_type, aggregate_type, aggregate_id, actor_user_id, payload)
VALUES (
  'resource.viewed', 'resource', '<<resource_id>>', '<<user_id>>',
  jsonb_build_object('duration_ms', 310000, 'session_id', '<<session_id>>')
);
```

Requisitos operativos y seguridad
- Usar timestamps del servidor para duración; no confiar en reloj del cliente.
- RLS: permitir solo que el propio usuario o servicios autorizados escriban sus `resource_views`.
- Idempotencia: usar `session_id` + opcional `idempotency_key` para prevenir sobreconteos.
- Pruebas: unitarias (upsert), de integración (simular heartbeats) y E2E (usuario completa flujo). 

Relación con tareas
- Recomendar incluir la creación de `resource_views` y la función/trigger upsert en `T123` (tracking de progreso). Añadir subtarea: `T123A Crear resource_views + trigger/función`.

Notas
- Esta especificación es propuesta y requiere aceptación por el PO/arquitecto. Se puede migrar a `db/migrations/` como `00xx_resource_views.sql` y añadir pruebas en `tests/`.


Detalles operativos y de diseño (para revisar con el equipo)

Archivo de migration sugerido: supabase/migrations/00xx_resource_views.sql (usar numeración secuencial).
Task recomendada: crear T123 resource_views e implementarla antes de T321 (auto‑completado) y T524 (notifications).
Umbrales y defaults

Umbral por defecto para considerar "vista completada": THRESHOLD_MS = 5 * 60 * 1000 (300000 ms). Debe permitirse override por evaluación/lesson.
Heartbeat cliente: cada 10–30s. Calcular duración en servidor (no confiar en reloj cliente).
Shape del payload (ejemplos y contractos)

Heartbeat (cliente → API):
{
"session_id":"uuid",
"resource_id":"uuid",
"seen_at":"2026-05-22T12:34:56Z",
"progress_pct": 0..100 (opcional)
}
domain_events payload resource.viewed:
{
"resource_id":"uuid",
"user_id":"uuid",
"duration_ms": 310000,
"session_id":"uuid",
"threshold_ms":300000
}
Migration SQL ejemplo (minimizada)

Función upsert (esquema / ejemplo reducido)

Nota: sustituir mark_progress_from_resource_view por la lógica real (RPC o función) que actualiza progress y verifica RLS/service role. Mantener todo en la misma transacción cuando se marque progreso.
RLS / Seguridad (ejemplo)

En Supabase podrías usar auth.uid() y current_setting o el rol service_role desde Edge Functions; ajustar a vuestra convención.
Índices & rendimiento

Indexes por user_id y resource_id (ya arriba).
Si se añaden campos JSON, añadir GIN si se consultan por keys.
Purga/retención: planificar TTL (p. ej. retention 90–365 días) o job de archivado.
Idempotencia y deduplicación

UNIQUE(user_id, resource_id, session_id) previene múltiples sesiones duplicadas.
El cliente debe enviar session_id estable por sesión; worker debe ignorar eventos antiguos (usar last_seen_at).
Pruebas y aceptación

Unit: upsert con secuencia de heartbeats y ver que duration_ms suma y que domain_events se inserta una sola vez.
Integration: simular heartbeats con latencias y ver RLS.
E2E: cliente envía heartbeats → progreso marcado → notification en worker.
Criterios de aceptación mínimos:
Tabla creada y RLS aplicadas.
Upsert idempotente y marca domain_events cuando se supera umbral.
No se expone duration_ms sensible sin filtrado.
Impacto en flujo existente

Debe implementarse antes de cualquier regla/worker que marque progress.completed o emita notificaciones basadas en vistas (recomendar T123 previo a T321 y T524).
Si se despliega cliente antes que la migration/RLS/funciones, los heartbeats fallarán o se perderán; evitar habilitar cliente hasta confirmación deployment.
Operación y métricas

Medir: heartbeats/sec, resource_views inserts/upserts, domain_events emitted, progress updates triggered, duplicate events.
Alertas: error rate de upsert > 1% por minuto, domain_events duplicates > N, RLS violations.
Siguiente paso propuesto para revisión

Revisar y aprobar este bloque con el equipo (PO/arquitecto + 1 backend) y si aceptado, crear T123—yo puedo generar la migration completa y el set de tests si me das OK.


Voy a preparar el bloque Markdown listo para pegar al final de resource_views.md.

Pega exactamente este bloque al final del archivo:

Detalles operativos y de diseño (para revisar con el equipo)

Archivo de migration sugerido: supabase/migrations/00xx_resource_views.sql (usar numeración secuencial).
Task recomendada: crear T123 resource_views e implementarla antes de T321 (auto‑completado) y T524 (notifications).
Umbrales y defaults

Umbral por defecto para considerar "vista completada": THRESHOLD_MS = 5 * 60 * 1000 (300000 ms). Debe permitirse override por evaluación/lesson.
Heartbeat cliente: cada 10–30s. Calcular duración en servidor (no confiar en reloj cliente).
Shape del payload (ejemplos y contratos)

Heartbeat (cliente → API):
domain_events payload resource.viewed:
Migration SQL ejemplo (minimizada)

Función upsert (esquema / ejemplo reducido)

Nota: sustituir mark_progress_from_resource_view por la lógica/RPC real que actualiza progress con la cuenta de RLS/service role; mantener la operación de marca y la inserción del evento en la misma transacción.

RLS / Seguridad (ejemplo)

Ajustar current_setting/service role según convención del equipo (Supabase auth.uid() y service role).

Índices, retención y rendimiento

Índices por user_id y resource_id (ver migration).
Plan de retención/archivado (p. ej. job nightly para purge > 90–365 días).
Si se añaden JSON fields y se consultan por keys, añadir índice GIN.
Idempotencia y deduplicación

UNIQUE(user_id, resource_id, session_id) evita duplicados por sesión.
session_id debe ser estable por sesión en cliente.
Workers deben ignorar heartbeats antiguos usando last_seen_at.
Pruebas y aceptación

Unit: secuencia de heartbeats -> duration_ms suma; domain_events insertado una sola vez.
Integration: heartbeats con latencia/reordenamiento; validar RLS.
E2E: cliente envía heartbeats → progress marcado → notification generada por worker.
Criterios mínimos: tabla + RLS aplicadas; upsert idempotente; evento emitido al superar umbral; no exponer datos sensibles.
Impacto en flujo existente

Implementar la migration/funciones antes de workers/rpc/cliente que consuman/escriban resource_views (recomendado: antes de T321 y T524).
Si el cliente se despliega antes de la migration/RLS/funciones, los heartbeats fallarán o se perderán.
Métricas y alertas operativas

Medir: heartbeats/sec, upserts/sec, domain_events emitted, progress updates, duplicated events.
Alertas recomendadas: upsert error rate > 1%/min, domain_event duplicates > N, RLS violation spikes.
Siguiente paso propuesto

Revisar y aprobar este bloque con PO/arquitecto + 1 backend.
Si se aprueba, crear T123 y generar migration + función upsert + pruebas.
