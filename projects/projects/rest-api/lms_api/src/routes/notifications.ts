import { Router } from "express";
import { z } from "zod";
import { getDatabaseClient } from "../lib/database";
import { authenticateRequest, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";

const notificationsRouter = Router();
const database = getDatabaseClient();

const pageSchema = z.object({
  limit: z.string().regex(/^\d+$/).transform(Number).default("20"),
  offset: z.string().regex(/^\d+$/).transform(Number).default("0"),
  unread_only: z.enum(["true", "false"]).optional().transform((v) => v === "true"),
});

const markReadSchema = z.object({
  notification_ids: z.array(z.string().uuid()).min(1).max(100),
});

const subscribeSchema = z.object({
  topic_slug: z.string().min(1),
  channel: z.enum(["in_app", "email", "push"]).default("in_app"),
  enabled: z.boolean().default(true),
});

const emitSchema = z.object({
  user_id: z.string().uuid(),
  topic_slug: z.string().min(1),
  category: z.enum(["progress", "evaluation", "achievement", "system", "moderation"]),
  title: z.string().min(1).max(255),
  body: z.string().max(1000).optional(),
  payload: z.record(z.unknown()).optional(),
});

notificationsRouter.use(authenticateRequest);

// ─── GET /notifications ───────────────────────────────────────────────────────
// Lista notificaciones del usuario autenticado con paginacion y filtro de no leidas

notificationsRouter.get(
  "/notifications",
  validate({ query: pageSchema }),
  async (req, res) => {
    const limit = Number(req.query.limit ?? 20);
    const offset = Number(req.query.offset ?? 0);
    const unread_only = req.query.unread_only === "true";
    const userId = req.auth!.userId;

    try {
      const rows = await database`
        select
          n.id, n.category, n.title, n.body, n.payload,
          n.is_read, n.read_at,
          to_char(n.created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at,
          nt.slug as topic_slug, nt.title as topic_title
        from cursos.notifications n
        left join cursos.notification_topics nt on nt.id = n.topic_id
        where n.user_id = ${userId}
          ${unread_only ? database`and n.is_read = false` : database``}
        order by n.created_at desc
        limit ${limit}
        offset ${offset}
      `;

      const countRows = await database`
        select count(*)::int as total
        from cursos.notifications n
        where n.user_id = ${userId}
          ${unread_only ? database`and n.is_read = false` : database``}
      `;

      res.json({ data: rows, total: countRows[0].total as number, limit, offset });
    } catch (error) {
      res.status(500).json({ error: "internal_server_error", message: String(error) });
    }
  },
);

// ─── POST /notifications/read ─────────────────────────────────────────────────
// Marca una o varias notificaciones como leidas

notificationsRouter.post(
  "/notifications/read",
  validate({ body: markReadSchema }),
  async (req, res) => {
    const userId = req.auth!.userId;
    const { notification_ids } = req.body as z.infer<typeof markReadSchema>;

    try {
      const rows = await database`
        select cursos.mark_notifications_read(${userId}::uuid, ${notification_ids}::uuid[]) as updated_count
      `;
      res.json({ data: { updated_count: (rows[0]?.updated_count as number) ?? 0 } });
    } catch (error) {
      res.status(500).json({ error: "internal_server_error", message: String(error) });
    }
  },
);

// ─── GET /notification-topics ─────────────────────────────────────────────────
// Lista los topics activos disponibles

notificationsRouter.get("/notification-topics", async (_req, res) => {
  try {
    const rows = await database`
      select id, slug, title, description, is_active,
        to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
      from cursos.notification_topics
      where is_active = true
      order by slug asc
    `;
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ error: "internal_server_error", message: String(error) });
  }
});

// ─── GET /notification-subscriptions ─────────────────────────────────────────
// Lista las suscripciones activas del usuario

notificationsRouter.get("/notification-subscriptions", async (req, res) => {
  const userId = req.auth!.userId;

  try {
    const rows = await database`
      select ns.id, ns.channel, ns.enabled,
        nt.slug as topic_slug, nt.title as topic_title,
        to_char(ns.updated_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at
      from cursos.notification_subscriptions ns
      join cursos.notification_topics nt on nt.id = ns.topic_id
      where ns.user_id = ${userId}
      order by nt.slug asc, ns.channel asc
    `;
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ error: "internal_server_error", message: String(error) });
  }
});

// ─── POST /notification-subscriptions ────────────────────────────────────────
// Crea o actualiza una suscripcion a un topic/canal

notificationsRouter.post(
  "/notification-subscriptions",
  validate({ body: subscribeSchema }),
  async (req, res) => {
    const userId = req.auth!.userId;
    const { topic_slug, channel, enabled } = req.body as z.infer<typeof subscribeSchema>;

    try {
      const topics = await database`
        select id from cursos.notification_topics where slug = ${topic_slug} and is_active = true limit 1
      `;
      if (topics.length === 0) {
        res.status(404).json({ error: "not_found", message: "Topic no encontrado o inactivo" });
        return;
      }

      const topicId = topics[0].id;

      const rows = await database`
        insert into cursos.notification_subscriptions (user_id, topic_id, channel, enabled, updated_at)
        values (${userId}, ${topicId}, ${channel}, ${enabled}, now())
        on conflict (user_id, topic_id, channel)
        do update set enabled = ${enabled}, updated_at = now()
        returning id, channel, enabled,
          to_char(updated_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at
      `;
      res.status(200).json({ data: rows[0] });
    } catch (error) {
      res.status(500).json({ error: "internal_server_error", message: String(error) });
    }
  },
);

// ─── DELETE /notification-subscriptions/:topicSlug/:channel ──────────────────
// Desuscribe al usuario de un topic/canal

notificationsRouter.delete(
  "/notification-subscriptions/:topicSlug/:channel",
  validate({
    params: z.object({
      topicSlug: z.string().min(1),
      channel: z.enum(["in_app", "email", "push"]),
    }),
  }),
  async (req, res) => {
    const userId = req.auth!.userId;
    const { topicSlug, channel } = req.params as { topicSlug: string; channel: string };

    try {
      const rows = await database`
        delete from cursos.notification_subscriptions
        where user_id = ${userId}
          and channel = ${channel}
          and topic_id = (select id from cursos.notification_topics where slug = ${topicSlug} limit 1)
        returning id
      `;
      if (rows.length === 0) {
        res.status(404).json({ error: "not_found", message: "Suscripcion no encontrada" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "internal_server_error", message: String(error) });
    }
  },
);

// ─── POST /notifications/emit (admin) ────────────────────────────────────────
// Emite una notificacion a un usuario especifico; solo admin/super_admin

notificationsRouter.post(
  "/notifications/emit",
  requireRole(["admin", "super_admin"]),
  validate({ body: emitSchema }),
  async (req, res) => {
    const { user_id, topic_slug, category, title, body: msgBody, payload } = req.body as z.infer<typeof emitSchema>;

    try {
      const rows = await database`
        select cursos.emit_notification(
          ${user_id}::uuid,
          ${topic_slug},
          ${category},
          ${title},
          ${msgBody ?? null},
          ${JSON.stringify(payload ?? {})}::jsonb
        ) as notification_id
      `;
      res.status(201).json({ data: { notification_id: rows[0].notification_id } });
    } catch (error) {
      res.status(500).json({ error: "internal_server_error", message: String(error) });
    }
  },
);

export { notificationsRouter };
