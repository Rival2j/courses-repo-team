import type { NextFunction, Request, Response } from "express";
import { getDatabaseClient } from "../lib/database";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const database = getDatabaseClient();

/**
 * Idempotency-Key middleware for safe retries in offline/sync flows (T621).
 *
 * Clients supply an `Idempotency-Key: <uuid-v4>` header on mutating requests.
 * On retry the server returns the original response without re-executing the handler.
 * Keys are scoped to (key, user_id, method, path) and expire after 24 hours.
 * The header is optional — omitting it disables caching for that request.
 *
 * Must be placed AFTER authenticateRequest so req.auth is available.
 */
export function withIdempotency(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const rawKey = req.headers["idempotency-key"];

  if (!rawKey) {
    next();
    return;
  }

  const key = Array.isArray(rawKey) ? rawKey[0] : rawKey;

  if (!key || !UUID_RE.test(key)) {
    res.status(400).json({
      error: "invalid_idempotency_key",
      message: "Idempotency-Key debe ser un UUID v4 válido",
    });
    return;
  }

  const userId = req.auth?.userId;

  if (!userId) {
    next();
    return;
  }

  const method = req.method;
  const path = req.path;

  void (async () => {
    try {
      const cached = await database`
        select status_code, response_body
        from cursos.idempotency_keys
        where key       = ${key}
          and user_id   = ${userId}::uuid
          and method    = ${method}
          and path      = ${path}
          and expires_at > now()
        limit 1
      `;

      if (cached.length > 0) {
        const row = cached[0] as { status_code: number; response_body: unknown };
        res.setHeader("Idempotency-Replayed", "true");
        res.status(row.status_code).json(row.response_body);
        return;
      }

      // Intercept res.json to persist the response before sending it.
      const originalJson = res.json.bind(res) as (body?: unknown) => Response;
      res.json = function (body?: unknown): Response {
        const statusCode = res.statusCode;

        database`
          insert into cursos.idempotency_keys
            (key, user_id, method, path, status_code, response_body)
          values (
            ${key},
            ${userId}::uuid,
            ${method},
            ${path},
            ${statusCode},
            ${JSON.stringify(body ?? null)}::jsonb
          )
          on conflict (key, user_id, method, path) do nothing
        `.catch(() => {
          // Storage failure must not block the response.
        });

        return originalJson(body);
      };

      next();
    } catch {
      // On DB error checking the cache, fall through to the handler normally.
      next();
    }
  })();
}
