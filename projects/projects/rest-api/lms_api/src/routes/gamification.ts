import { Router, type Response } from "express";
import { z } from "zod";
import {
  BadgeCreateSchema,
  BadgeDtoSchema,
  BadgeUpdateSchema,
  LevelCreateSchema,
  LevelDtoSchema,
  LevelUpdateSchema,
  TrophyCreateSchema,
  TrophyDtoSchema,
  TrophyUpdateSchema,
  XpOverrideCreateSchema,
  XpOverrideDtoSchema,
  XpOverrideUpdateSchema,
  XpRuleCreateSchema,
  XpRuleDtoSchema,
  XpRuleUpdateSchema,
} from "../dtos/gamification";
import { getDatabaseClient } from "../lib/database";
import { authenticateRequest, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";

type DatabaseRow = Record<string, unknown>;

const gamificationRouter = Router();
const database = getDatabaseClient();

const uuidParamSchema = z.object({ id: z.string().uuid() });
const xpOverrideParamsSchema = z.object({
  ruleId: z.string().uuid(),
  overrideId: z.string().uuid(),
});

function respondWithDatabaseError(res: Response, error: unknown): void {
  const dbError = error as { code?: string } | null;
  if (dbError?.code === "23505") {
    res.status(409).json({ error: "conflict", message: "Ya existe un registro con esos valores" });
    return;
  }
  if (dbError?.code === "23503") {
    res.status(400).json({ error: "invalid_reference", message: "La referencia relacionada no existe" });
    return;
  }
  res.status(500).json({ error: "internal_server_error", message: "Error interno del servidor" });
}

gamificationRouter.use(authenticateRequest);

// =====================================================
// XP Rules CRUD
// =====================================================

gamificationRouter.get("/gamification/xp-rules", async (_req, res) => {
  try {
    const rows = await database`
      select id, action, base_xp, multiplier, course_id, is_active, created_by,
        to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
      from cursos.xp_rules
      order by action, course_id nulls first
    `;
    res.json({ data: rows.map((r: DatabaseRow) => XpRuleDtoSchema.parse(r)) });
  } catch (error) {
    respondWithDatabaseError(res, error);
  }
});

gamificationRouter.get(
  "/gamification/xp-rules/:id",
  validate({ params: uuidParamSchema }),
  async (req, res) => {
    try {
      const rows = await database`
        select id, action, base_xp, multiplier, course_id, is_active, created_by,
          to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
        from cursos.xp_rules where id = ${req.params.id} limit 1
      `;
      if (rows.length === 0) { res.status(404).json({ error: "not_found", message: "Regla de XP no encontrada" }); return; }
      res.json({ data: XpRuleDtoSchema.parse(rows[0]) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

gamificationRouter.post(
  "/gamification/xp-rules",
  requireRole(["super_admin", "admin", "instructor"]),
  validate({ body: XpRuleCreateSchema }),
  async (req, res) => {
    try {
      const rows = await database`
        insert into cursos.xp_rules (action, base_xp, multiplier, course_id, is_active, created_by)
        values (${req.body.action}, ${req.body.base_xp}, ${req.body.multiplier ?? 1.0},
                ${req.body.course_id ?? null}, ${req.body.is_active ?? true}, ${req.auth?.userId})
        returning id, action, base_xp, multiplier, course_id, is_active, created_by,
          to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
      `;
      res.status(201).json({ data: XpRuleDtoSchema.parse(rows[0]) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

gamificationRouter.patch(
  "/gamification/xp-rules/:id",
  requireRole(["super_admin", "admin", "instructor"]),
  validate({ params: uuidParamSchema, body: XpRuleUpdateSchema }),
  async (req, res) => {
    try {
      const rows = await database`
        update cursos.xp_rules set
          base_xp    = coalesce(${req.body.base_xp ?? null}, base_xp),
          multiplier = coalesce(${req.body.multiplier ?? null}, multiplier),
          is_active  = coalesce(${req.body.is_active ?? null}, is_active)
        where id = ${req.params.id}
        returning id, action, base_xp, multiplier, course_id, is_active, created_by,
          to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
      `;
      if (rows.length === 0) { res.status(404).json({ error: "not_found", message: "Regla de XP no encontrada" }); return; }
      res.json({ data: XpRuleDtoSchema.parse(rows[0]) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

gamificationRouter.delete(
  "/gamification/xp-rules/:id",
  requireRole(["super_admin", "admin"]),
  validate({ params: uuidParamSchema }),
  async (req, res) => {
    try {
      const rows = await database`delete from cursos.xp_rules where id = ${req.params.id} returning id`;
      if (rows.length === 0) { res.status(404).json({ error: "not_found", message: "Regla de XP no encontrada" }); return; }
      res.status(204).send();
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

// =====================================================
// XP Overrides CRUD
// =====================================================

gamificationRouter.get(
  "/gamification/xp-rules/:ruleId/overrides",
  validate({ params: z.object({ ruleId: z.string().uuid() }) }),
  async (req, res) => {
    try {
      const rows = await database`
        select id, xp_rule_id, course_id, override_xp, created_by,
          to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
        from cursos.xp_overrides where xp_rule_id = ${req.params.ruleId}
        order by created_at desc
      `;
      res.json({ data: rows.map((r: DatabaseRow) => XpOverrideDtoSchema.parse(r)) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

gamificationRouter.post(
  "/gamification/xp-rules/:ruleId/overrides",
  requireRole(["super_admin", "admin", "instructor"]),
  validate({ params: z.object({ ruleId: z.string().uuid() }), body: XpOverrideCreateSchema }),
  async (req, res) => {
    try {
      const rows = await database`
        insert into cursos.xp_overrides (xp_rule_id, course_id, override_xp, created_by)
        values (${req.params.ruleId}, ${req.body.course_id ?? null}, ${req.body.override_xp}, ${req.auth?.userId})
        returning id, xp_rule_id, course_id, override_xp, created_by,
          to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
      `;
      res.status(201).json({ data: XpOverrideDtoSchema.parse(rows[0]) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

gamificationRouter.patch(
  "/gamification/xp-rules/:ruleId/overrides/:overrideId",
  requireRole(["super_admin", "admin", "instructor"]),
  validate({ params: xpOverrideParamsSchema, body: XpOverrideUpdateSchema }),
  async (req, res) => {
    try {
      const rows = await database`
        update cursos.xp_overrides set override_xp = ${req.body.override_xp}
        where id = ${req.params.overrideId} and xp_rule_id = ${req.params.ruleId}
        returning id, xp_rule_id, course_id, override_xp, created_by,
          to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
      `;
      if (rows.length === 0) { res.status(404).json({ error: "not_found", message: "Override no encontrado" }); return; }
      res.json({ data: XpOverrideDtoSchema.parse(rows[0]) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

gamificationRouter.delete(
  "/gamification/xp-rules/:ruleId/overrides/:overrideId",
  requireRole(["super_admin", "admin"]),
  validate({ params: xpOverrideParamsSchema }),
  async (req, res) => {
    try {
      const rows = await database`
        delete from cursos.xp_overrides
        where id = ${req.params.overrideId} and xp_rule_id = ${req.params.ruleId}
        returning id
      `;
      if (rows.length === 0) { res.status(404).json({ error: "not_found", message: "Override no encontrado" }); return; }
      res.status(204).send();
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

// =====================================================
// Levels CRUD
// =====================================================

gamificationRouter.get("/gamification/levels", async (_req, res) => {
  try {
    const rows = await database`
      select id, level_number, title, required_xp,
        to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
      from cursos.levels order by level_number asc
    `;
    res.json({ data: rows.map((r: DatabaseRow) => LevelDtoSchema.parse(r)) });
  } catch (error) {
    respondWithDatabaseError(res, error);
  }
});

gamificationRouter.post(
  "/gamification/levels",
  requireRole(["super_admin", "admin"]),
  validate({ body: LevelCreateSchema }),
  async (req, res) => {
    try {
      const rows = await database`
        insert into cursos.levels (level_number, title, required_xp)
        values (${req.body.level_number}, ${req.body.title}, ${req.body.required_xp})
        returning id, level_number, title, required_xp,
          to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
      `;
      res.status(201).json({ data: LevelDtoSchema.parse(rows[0]) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

gamificationRouter.patch(
  "/gamification/levels/:id",
  requireRole(["super_admin", "admin"]),
  validate({ params: uuidParamSchema, body: LevelUpdateSchema }),
  async (req, res) => {
    try {
      const rows = await database`
        update cursos.levels set
          title       = coalesce(${req.body.title ?? null}, title),
          required_xp = coalesce(${req.body.required_xp ?? null}, required_xp)
        where id = ${req.params.id}
        returning id, level_number, title, required_xp,
          to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
      `;
      if (rows.length === 0) { res.status(404).json({ error: "not_found", message: "Nivel no encontrado" }); return; }
      res.json({ data: LevelDtoSchema.parse(rows[0]) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

gamificationRouter.delete(
  "/gamification/levels/:id",
  requireRole(["super_admin", "admin"]),
  validate({ params: uuidParamSchema }),
  async (req, res) => {
    try {
      const rows = await database`delete from cursos.levels where id = ${req.params.id} returning id`;
      if (rows.length === 0) { res.status(404).json({ error: "not_found", message: "Nivel no encontrado" }); return; }
      res.status(204).send();
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

// =====================================================
// Badges CRUD
// =====================================================

gamificationRouter.get("/gamification/badges", async (_req, res) => {
  try {
    const rows = await database`
      select id, slug, title, description, icon_url, criteria, is_active,
        to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
      from cursos.badges order by created_at desc
    `;
    res.json({ data: rows.map((r: DatabaseRow) => BadgeDtoSchema.parse(r)) });
  } catch (error) {
    respondWithDatabaseError(res, error);
  }
});

gamificationRouter.post(
  "/gamification/badges",
  requireRole(["super_admin", "admin"]),
  validate({ body: BadgeCreateSchema }),
  async (req, res) => {
    try {
      const criteria = JSON.stringify(req.body.criteria ?? {});
      const rows = await database`
        insert into cursos.badges (slug, title, description, icon_url, criteria, is_active)
        values (${req.body.slug}, ${req.body.title}, ${req.body.description ?? null},
                ${req.body.icon_url ?? null}, ${criteria}, ${req.body.is_active ?? true})
        returning id, slug, title, description, icon_url, criteria, is_active,
          to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
      `;
      res.status(201).json({ data: BadgeDtoSchema.parse(rows[0]) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

gamificationRouter.patch(
  "/gamification/badges/:id",
  requireRole(["super_admin", "admin"]),
  validate({ params: uuidParamSchema, body: BadgeUpdateSchema }),
  async (req, res) => {
    try {
      const criteria = req.body.criteria ? JSON.stringify(req.body.criteria) : null;
      const rows = await database`
        update cursos.badges set
          title       = coalesce(${req.body.title ?? null}, title),
          description = coalesce(${req.body.description ?? null}, description),
          icon_url    = coalesce(${req.body.icon_url ?? null}, icon_url),
          criteria    = coalesce(${criteria ?? null}, criteria),
          is_active   = coalesce(${req.body.is_active ?? null}, is_active)
        where id = ${req.params.id}
        returning id, slug, title, description, icon_url, criteria, is_active,
          to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
      `;
      if (rows.length === 0) { res.status(404).json({ error: "not_found", message: "Badge no encontrado" }); return; }
      res.json({ data: BadgeDtoSchema.parse(rows[0]) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

gamificationRouter.delete(
  "/gamification/badges/:id",
  requireRole(["super_admin", "admin"]),
  validate({ params: uuidParamSchema }),
  async (req, res) => {
    try {
      const rows = await database`delete from cursos.badges where id = ${req.params.id} returning id`;
      if (rows.length === 0) { res.status(404).json({ error: "not_found", message: "Badge no encontrado" }); return; }
      res.status(204).send();
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

// =====================================================
// Trophies CRUD
// =====================================================

gamificationRouter.get("/gamification/trophies", async (_req, res) => {
  try {
    const rows = await database`
      select id, slug, title, description, icon_url, is_active,
        to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
      from cursos.trophies order by created_at desc
    `;
    res.json({ data: rows.map((r: DatabaseRow) => TrophyDtoSchema.parse(r)) });
  } catch (error) {
    respondWithDatabaseError(res, error);
  }
});

gamificationRouter.post(
  "/gamification/trophies",
  requireRole(["super_admin", "admin"]),
  validate({ body: TrophyCreateSchema }),
  async (req, res) => {
    try {
      const rows = await database`
        insert into cursos.trophies (slug, title, description, icon_url, is_active)
        values (${req.body.slug}, ${req.body.title}, ${req.body.description ?? null},
                ${req.body.icon_url ?? null}, ${req.body.is_active ?? true})
        returning id, slug, title, description, icon_url, is_active,
          to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
      `;
      res.status(201).json({ data: TrophyDtoSchema.parse(rows[0]) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

gamificationRouter.patch(
  "/gamification/trophies/:id",
  requireRole(["super_admin", "admin"]),
  validate({ params: uuidParamSchema, body: TrophyUpdateSchema }),
  async (req, res) => {
    try {
      const rows = await database`
        update cursos.trophies set
          title       = coalesce(${req.body.title ?? null}, title),
          description = coalesce(${req.body.description ?? null}, description),
          icon_url    = coalesce(${req.body.icon_url ?? null}, icon_url),
          is_active   = coalesce(${req.body.is_active ?? null}, is_active)
        where id = ${req.params.id}
        returning id, slug, title, description, icon_url, is_active,
          to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
      `;
      if (rows.length === 0) { res.status(404).json({ error: "not_found", message: "Trofeo no encontrado" }); return; }
      res.json({ data: TrophyDtoSchema.parse(rows[0]) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

gamificationRouter.delete(
  "/gamification/trophies/:id",
  requireRole(["super_admin", "admin"]),
  validate({ params: uuidParamSchema }),
  async (req, res) => {
    try {
      const rows = await database`delete from cursos.trophies where id = ${req.params.id} returning id`;
      if (rows.length === 0) { res.status(404).json({ error: "not_found", message: "Trofeo no encontrado" }); return; }
      res.status(204).send();
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

// =====================================================
// User badges and trophies (read-only for client)
// =====================================================

gamificationRouter.get("/gamification/me/badges", async (req, res) => {
  try {
    const rows = await database`
      select ub.id, ub.badge_id, ub.earned_at, b.slug, b.title, b.icon_url
      from cursos.user_badges ub
      join cursos.badges b on b.id = ub.badge_id
      where ub.user_id = ${req.auth!.userId}
      order by ub.earned_at desc
    `;
    res.json({ data: rows });
  } catch (error) {
    respondWithDatabaseError(res, error);
  }
});

gamificationRouter.get("/gamification/me/trophies", async (req, res) => {
  try {
    const rows = await database`
      select ut.id, ut.trophy_id, ut.earned_at, t.slug, t.title, t.icon_url
      from cursos.user_trophies ut
      join cursos.trophies t on t.id = ut.trophy_id
      where ut.user_id = ${req.auth!.userId}
      order by ut.earned_at desc
    `;
    res.json({ data: rows });
  } catch (error) {
    respondWithDatabaseError(res, error);
  }
});

gamificationRouter.get("/gamification/me/xp", async (req, res) => {
  try {
    const rows = await database`
      select total_xp, current_level from cursos.profiles
      where id = ${req.auth!.userId} limit 1
    `;
    if (rows.length === 0) { res.status(404).json({ error: "not_found", message: "Perfil no encontrado" }); return; }
    res.json({ data: { total_xp: rows[0].total_xp, current_level: rows[0].current_level } });
  } catch (error) {
    respondWithDatabaseError(res, error);
  }
});

export { gamificationRouter };
