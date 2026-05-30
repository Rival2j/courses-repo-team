# ADR-003: Double-Send del Evento SSE `done` en ai-chat — Corrección con Flag Sentinela

**Estado**: Aceptado (fix aplicado)  
**Fecha**: 2026-05-27  
**Autores**: TEAM-03 Backend  
**Contexto**: T521, supabase/functions/ai-chat/index.ts

---

## Contexto

La Edge Function `ai-chat` hace streaming de respuestas de OpenAI via Server-Sent Events (SSE). El stream de OpenAI termina con el sentinel `[DONE]`. El código original tenía dos puntos de envío del evento `done`:

1. Dentro del loop, al detectar `[DONE]` en el stream de OpenAI.
2. Fuera del loop, como fallback post-stream.

Esto causaba que el cliente SSE recibiera dos eventos `done`, con el segundo llegando microsegundos después del primero.

## Síntoma

El cliente (TEAM-02) veía el evento `done` duplicado:

```
data: {"type":"done","request_id":"...","tokens":123}
data: {"type":"done","request_id":"...","tokens":123}
```

Dependiendo del cliente SSE, esto podía causar procesamiento duplicado del fin de stream.

## Decisión

Agregar un boolean `sentDone` que se setea en `true` cuando el evento se envía dentro del loop, y condicionar el envío post-loop:

```typescript
let sentDone = false;

// dentro del loop al detectar [DONE]:
if (chunk === "[DONE]") {
  send("done", { request_id: requestId, tokens: tokenCount });
  sentDone = true;
  break outer;
}

// después del loop:
if (!sentDone) {
  send("done", { request_id: requestId, tokens: tokenCount });
}
```

## Alternativas consideradas

| Opción | Pros | Contras |
|--------|------|---------|
| Eliminar el fallback post-loop | Más simple | Si OpenAI no envía `[DONE]` (timeout), el cliente queda colgado |
| **Flag sentinela (elegida)** | Cubre ambos casos — normal y timeout | Ligera complejidad adicional |
| Usar `return` en el punto [DONE] | Simple si el código lo permite | Depende de la estructura del try/catch |

## Consecuencias

- El cliente siempre recibe exactamente **un** evento `done`.
- Si OpenAI termina con `[DONE]`: el fallback no se activa (sentDone=true).
- Si el stream termina sin `[DONE]` (timeout, error): el fallback garantiza cierre limpio.

## Trazabilidad

- Fix aplicado en: `supabase/functions/ai-chat/index.ts`
- Detectado durante: validación F5 T821
