import { Router, type Response } from "express";
import { z } from "zod";
import {
  OrganizationalUnitDtoSchema,
  OrganizationalUnitCreateSchema,
  OrganizationalUnitUpdateSchema,
  InstitutionalBrandingDtoSchema,
  InstitutionalBrandingCreateSchema,
  InstitutionalBrandingUpdateSchema,
  PolicyTemplateDtoSchema,
  PolicyTemplateCreateSchema,
  PolicyTemplateUpdateSchema,
  InstitutionalPolicyDtoSchema,
  InstitutionalPolicyCreateSchema,
  InstitutionalPolicyUpdateSchema,
  AdminScopeDtoSchema,
  AdminScopeCreateSchema,
  AdminScopeUpdateSchema,
  GlobalConfigurationDtoSchema,
  GlobalConfigurationCreateSchema,
  GlobalConfigurationUpdateSchema,
  ModerationActionDtoSchema,
  ModerationActionCreateSchema,
} from "../dtos/administrative";
import { getDatabaseClient } from "../lib/database";
import { authenticateRequest, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";

type DatabaseRow = Record<string, unknown>;

const adminRouter = Router();
const database = getDatabaseClient();

// Validation schemas for path parameters
const uuidParamSchema = z.object({ id: z.string().uuid() });
const orgUnitIdSchema = z.object({ orgUnitId: z.string().uuid() });

// =====================================================================
// Helper Functions
// =====================================================================
function respondWithDatabaseError(res: Response, error: unknown): void {
  const databaseError = error as { code?: string } | null;

  if (databaseError?.code === "23505") {
    res.status(409).json({
      error: "conflict",
      message: "Ya existe un registro con esos valores",
    });
    return;
  }

  if (databaseError?.code === "23503") {
    res.status(400).json({
      error: "invalid_reference",
      message: "La referencia relacionada no existe",
    });
    return;
  }

  res.status(500).json({
    error: "internal_server_error",
    message: "Error interno del servidor",
  });
}

function getParamValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  return value ?? "";
}

// Bug 2 fix: postgres.js 3.x returns timestamp/timestamptz as Date objects.
// Zod schemas expect z.string() for dates → convert before parsing.
function formatRow(row: DatabaseRow): DatabaseRow {
  const out: DatabaseRow = {};
  for (const [k, v] of Object.entries(row)) {
    out[k] = v instanceof Date ? v.toISOString() : v;
  }
  return out;
}

// =====================================================================
// ORGANIZATIONAL UNITS ENDPOINTS
// =====================================================================
adminRouter.use(authenticateRequest);

// GET /administrative/organizational-units
adminRouter.get("/organizational-units", async (_req, res) => {
  try {
    const rows = await database`
      SELECT * FROM cursos.organizational_units
      ORDER BY created_at DESC
    `;
    res.json({ data: rows.map((row: DatabaseRow) => OrganizationalUnitDtoSchema.parse(formatRow(row))) });
  } catch (error) {
    respondWithDatabaseError(res, error);
  }
});

// GET /administrative/organizational-units/:id
adminRouter.get(
  "/organizational-units/:id",
  validate({ params: uuidParamSchema }),
  async (req, res) => {
    try {
      const rows = await database`
        SELECT * FROM cursos.organizational_units
        WHERE id = ${getParamValue(req.params.id)}
      `;

      if (rows.length === 0) {
        res.status(404).json({
          error: "not_found",
          message: "Unidad organizativa no encontrada",
        });
        return;
      }

      res.json({ data: OrganizationalUnitDtoSchema.parse(rows[0]) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

// POST /administrative/organizational-units
adminRouter.post(
  "/organizational-units",
  requireRole(["super_admin", "admin"]),
  validate({ body: OrganizationalUnitCreateSchema }),
  async (req, res) => {
    try {
      const rows = await database`
        INSERT INTO cursos.organizational_units (slug, name, description, parent_unit_id, metadata)
        VALUES (${req.body.slug}, ${req.body.name}, ${req.body.description ?? null}, ${req.body.parent_unit_id ?? null}, ${req.body.metadata ?? {}})
        RETURNING *
      `;

      res.status(201).json({ data: OrganizationalUnitDtoSchema.parse(rows[0]) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

// PATCH /administrative/organizational-units/:id
adminRouter.patch(
  "/organizational-units/:id",
  requireRole(["super_admin", "admin"]),
  validate({ params: uuidParamSchema, body: OrganizationalUnitUpdateSchema }),
  async (req, res) => {
    try {
      const rows = await database`
        UPDATE cursos.organizational_units SET
          slug = COALESCE(${req.body.slug ?? null}, slug),
          name = COALESCE(${req.body.name ?? null}, name),
          description = COALESCE(${req.body.description ?? null}, description),
          parent_unit_id = COALESCE(${req.body.parent_unit_id ?? null}, parent_unit_id),
          metadata = COALESCE(${req.body.metadata ?? null}, metadata),
          updated_at = NOW()
        WHERE id = ${getParamValue(req.params.id)}
        RETURNING *
      `;

      if (rows.length === 0) {
        res.status(404).json({
          error: "not_found",
          message: "Unidad organizativa no encontrada",
        });
        return;
      }

      res.json({ data: OrganizationalUnitDtoSchema.parse(rows[0]) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

// =====================================================================
// INSTITUTIONAL BRANDING ENDPOINTS
// =====================================================================

// GET /administrative/organizational-units/:orgUnitId/branding
adminRouter.get(
  "/organizational-units/:orgUnitId/branding",
  validate({ params: orgUnitIdSchema }),
  async (req, res) => {
    try {
      const rows = await database`
        SELECT * FROM cursos.institutional_branding
        WHERE organizational_unit_id = ${getParamValue(req.params.orgUnitId)}
          AND is_active = true
      `;

      if (rows.length === 0) {
        res.status(404).json({
          error: "not_found",
          message: "Configuración de marca no encontrada",
        });
        return;
      }

      res.json({ data: InstitutionalBrandingDtoSchema.parse(formatRow(rows[0])) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

// POST /administrative/organizational-units/:orgUnitId/branding
adminRouter.post(
  "/organizational-units/:orgUnitId/branding",
  requireRole(["super_admin", "admin"]),
  validate({ params: orgUnitIdSchema, body: InstitutionalBrandingCreateSchema }),
  async (req, res) => {
    try {
      const rows = await database`
        INSERT INTO cursos.institutional_branding (
          organizational_unit_id, logo_url, primary_color, secondary_color, 
          accent_color, institution_name, institution_website, support_email, 
          support_phone, metadata
        ) VALUES (
          ${getParamValue(req.params.orgUnitId)}, ${req.body.logo_url ?? null}, 
          ${req.body.primary_color}, ${req.body.secondary_color}, 
          ${req.body.accent_color}, ${req.body.institution_name}, 
          ${req.body.institution_website ?? null}, ${req.body.support_email ?? null},
          ${req.body.support_phone ?? null}, ${req.body.metadata ?? {}}
        )
        RETURNING *
      `;

      res.status(201).json({ data: InstitutionalBrandingDtoSchema.parse(formatRow(rows[0])) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

// PATCH /administrative/organizational-units/:orgUnitId/branding
adminRouter.patch(
  "/organizational-units/:orgUnitId/branding",
  requireRole(["super_admin", "admin"]),
  validate({ params: orgUnitIdSchema, body: InstitutionalBrandingUpdateSchema }),
  async (req, res) => {
    try {
      const rows = await database`
        UPDATE cursos.institutional_branding SET
          logo_url = COALESCE(${req.body.logo_url ?? null}, logo_url),
          primary_color = COALESCE(${req.body.primary_color ?? null}, primary_color),
          secondary_color = COALESCE(${req.body.secondary_color ?? null}, secondary_color),
          accent_color = COALESCE(${req.body.accent_color ?? null}, accent_color),
          institution_name = COALESCE(${req.body.institution_name ?? null}, institution_name),
          institution_website = COALESCE(${req.body.institution_website ?? null}, institution_website),
          support_email = COALESCE(${req.body.support_email ?? null}, support_email),
          support_phone = COALESCE(${req.body.support_phone ?? null}, support_phone),
          metadata = COALESCE(${req.body.metadata ?? null}, metadata),
          updated_at = NOW()
        WHERE organizational_unit_id = ${getParamValue(req.params.orgUnitId)}
        RETURNING *
      `;

      if (rows.length === 0) {
        res.status(404).json({
          error: "not_found",
          message: "Configuración de marca no encontrada",
        });
        return;
      }

      res.json({ data: InstitutionalBrandingDtoSchema.parse(formatRow(rows[0])) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

// =====================================================================
// POLICY TEMPLATES ENDPOINTS
// =====================================================================

// GET /administrative/policy-templates
adminRouter.get("/policy-templates", async (_req, res) => {
  try {
    const rows = await database`
      SELECT * FROM cursos.policy_templates
      WHERE is_active = true
      ORDER BY created_at DESC
    `;
    res.json({ data: rows.map((row: DatabaseRow) => PolicyTemplateDtoSchema.parse(formatRow(row))) });
  } catch (error) {
    respondWithDatabaseError(res, error);
  }
});

// GET /administrative/policy-templates/:id
adminRouter.get(
  "/policy-templates/:id",
  validate({ params: uuidParamSchema }),
  async (req, res) => {
    try {
      const rows = await database`
        SELECT * FROM cursos.policy_templates
        WHERE id = ${getParamValue(req.params.id)}
      `;

      if (rows.length === 0) {
        res.status(404).json({
          error: "not_found",
          message: "Plantilla de política no encontrada",
        });
        return;
      }

      res.json({ data: PolicyTemplateDtoSchema.parse(formatRow(rows[0])) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

// POST /administrative/policy-templates
adminRouter.post(
  "/policy-templates",
  requireRole(["super_admin"]),
  validate({ body: PolicyTemplateCreateSchema }),
  async (req, res) => {
    try {
      const rows = await database`
        INSERT INTO cursos.policy_templates (slug, name, description, policy_type, policy_schema)
        VALUES (${req.body.slug}, ${req.body.name}, ${req.body.description ?? null}, ${req.body.policy_type}, ${req.body.policy_schema})
        RETURNING *
      `;

      res.status(201).json({ data: PolicyTemplateDtoSchema.parse(formatRow(rows[0])) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

// =====================================================================
// INSTITUTIONAL POLICIES ENDPOINTS
// =====================================================================

// GET /administrative/organizational-units/:orgUnitId/policies
adminRouter.get(
  "/organizational-units/:orgUnitId/policies",
  validate({ params: orgUnitIdSchema }),
  async (req, res) => {
    try {
      const rows = await database`
        SELECT * FROM cursos.institutional_policies
        WHERE organizational_unit_id = ${getParamValue(req.params.orgUnitId)}
          AND is_active = true
        ORDER BY enforcement_level DESC, created_at DESC
      `;
      res.json({ data: rows.map((row: DatabaseRow) => InstitutionalPolicyDtoSchema.parse(formatRow(row))) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

// POST /administrative/organizational-units/:orgUnitId/policies
// T906: emite domain_event 'policy.created' para trazabilidad y sincronización
adminRouter.post(
  "/organizational-units/:orgUnitId/policies",
  requireRole(["super_admin", "admin"]),
  validate({ params: orgUnitIdSchema, body: InstitutionalPolicyCreateSchema }),
  async (req, res) => {
    try {
      const orgUnitId = getParamValue(req.params.orgUnitId);
      const rows = await database`
        INSERT INTO cursos.institutional_policies (
          organizational_unit_id, policy_template_id, name, description,
          policy_type, policy_rules, enforcement_level, applies_to_roles, created_by
        ) VALUES (
          ${orgUnitId}, ${req.body.policy_template_id ?? null},
          ${req.body.name}, ${req.body.description ?? null},
          ${req.body.policy_type}, ${req.body.policy_rules},
          ${req.body.enforcement_level ?? "mandatory"},
          ${req.body.applies_to_roles ?? ["alumno", "instructor", "moderador", "admin"]},
          ${req.auth?.userId}
        )
        RETURNING *
      `;

      const policy = InstitutionalPolicyDtoSchema.parse(formatRow(rows[0]));

      await database`
        INSERT INTO cursos.domain_events (event_type, aggregate_type, aggregate_id, actor_user_id, payload)
        VALUES (
          'policy.created', 'institutional_policy', ${policy.id},
          ${req.auth?.userId ?? null},
          ${{ org_unit_id: orgUnitId, policy_type: policy.policy_type, enforcement_level: policy.enforcement_level, version: policy.version }}
        )
      `;

      res.status(201).json({ data: policy });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

// PATCH /administrative/institutional-policies/:id
// T906: incrementa version + emite domain_event 'policy.updated' para sync
adminRouter.patch(
  "/institutional-policies/:id",
  requireRole(["super_admin", "admin"]),
  validate({ params: uuidParamSchema, body: InstitutionalPolicyUpdateSchema }),
  async (req, res) => {
    try {
      const policyId = getParamValue(req.params.id);
      const rows = await database`
        UPDATE cursos.institutional_policies SET
          name = COALESCE(${req.body.name ?? null}, name),
          description = COALESCE(${req.body.description ?? null}, description),
          policy_rules = COALESCE(${req.body.policy_rules ? req.body.policy_rules : null}, policy_rules),
          enforcement_level = COALESCE(${req.body.enforcement_level ?? null}, enforcement_level),
          applies_to_roles = COALESCE(${req.body.applies_to_roles ?? null}, applies_to_roles),
          updated_at = NOW(),
          version = version + 1
        WHERE id = ${policyId}
        RETURNING *
      `;

      if (rows.length === 0) {
        res.status(404).json({ error: "not_found", message: "Política institucional no encontrada" });
        return;
      }

      const policy = InstitutionalPolicyDtoSchema.parse(formatRow(rows[0]));

      await database`
        INSERT INTO cursos.domain_events (event_type, aggregate_type, aggregate_id, actor_user_id, payload)
        VALUES (
          'policy.updated', 'institutional_policy', ${policyId},
          ${req.auth?.userId ?? null},
          ${{ org_unit_id: policy.organizational_unit_id, new_version: policy.version, enforcement_level: policy.enforcement_level }}
        )
      `;

      res.json({ data: policy });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

// =====================================================================
// ADMIN SCOPES ENDPOINTS
// =====================================================================

// GET /administrative/admin-scopes (super_admin only)
adminRouter.get(
  "/admin-scopes",
  requireRole(["super_admin"]),
  async (_req, res) => {
    try {
      const rows = await database`
        SELECT * FROM cursos.admin_scopes
        WHERE is_active = true
        ORDER BY created_at DESC
      `;
      res.json({ data: rows.map((row: DatabaseRow) => AdminScopeDtoSchema.parse(formatRow(row))) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

// GET /administrative/admin-scopes/me
adminRouter.get("/admin-scopes/me", async (req, res) => {
  try {
    const rows = await database`
      SELECT * FROM cursos.admin_scopes
      WHERE user_id = ${req.auth?.userId}
        AND is_active = true
    `;
    res.json({ data: rows.map((row: DatabaseRow) => AdminScopeDtoSchema.parse(formatRow(row))) });
  } catch (error) {
    respondWithDatabaseError(res, error);
  }
});

// POST /administrative/admin-scopes (super_admin only)
adminRouter.post(
  "/admin-scopes",
  requireRole(["super_admin"]),
  validate({ body: AdminScopeCreateSchema }),
  async (req, res) => {
    try {
      const rows = await database`
        INSERT INTO cursos.admin_scopes (
          user_id, organizational_unit_id, role, scope_level, scoped_units, permissions
        ) VALUES (
          ${req.body.user_id}, ${req.body.organizational_unit_id},
          ${req.body.role}, ${req.body.scope_level},
          ${req.body.scoped_units ?? []},
          ${req.body.permissions ?? []}
        )
        RETURNING *
      `;

      res.status(201).json({ data: AdminScopeDtoSchema.parse(formatRow(rows[0])) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

// =====================================================================
// GLOBAL CONFIGURATION ENDPOINTS
// =====================================================================

// GET /administrative/global-config
// T905: secret configs only returned to super_admin; type-safe role check
adminRouter.get("/global-config", async (req, res) => {
  try {
    const rows = await database`
      SELECT * FROM cursos.global_configurations
      ORDER BY config_key ASC
    `;
    const isSuperAdmin = req.auth?.role === "super_admin";
    res.json({
      data: rows.map((row: DatabaseRow) => {
        const dto = GlobalConfigurationDtoSchema.parse(formatRow(row));
        if (dto.is_secret && !isSuperAdmin) {
          return { ...dto, config_value: {} };
        }
        return dto;
      }),
    });
  } catch (error) {
    respondWithDatabaseError(res, error);
  }
});

// POST /administrative/global-config (super_admin only)
adminRouter.post(
  "/global-config",
  requireRole(["super_admin"]),
  validate({ body: GlobalConfigurationCreateSchema }),
  async (req, res) => {
    try {
      const rows = await database`
        INSERT INTO cursos.global_configurations (config_key, config_value, description, is_secret, is_mutable)
        VALUES (${req.body.config_key}, ${req.body.config_value}, ${req.body.description ?? null}, ${req.body.is_secret ?? false}, ${req.body.is_mutable ?? true})
        RETURNING *
      `;

      res.status(201).json({ data: GlobalConfigurationDtoSchema.parse(formatRow(rows[0])) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

// PATCH /administrative/global-config/:id (super_admin only)
// T905: triggers DB-level immutability check (trg_global_config_immutable)
adminRouter.patch(
  "/global-config/:id",
  requireRole(["super_admin"]),
  validate({ params: uuidParamSchema, body: GlobalConfigurationUpdateSchema }),
  async (req, res) => {
    try {
      const rows = await database`
        UPDATE cursos.global_configurations SET
          config_value = COALESCE(${req.body.config_value ?? null}, config_value),
          description = COALESCE(${req.body.description ?? null}, description),
          updated_at = NOW()
        WHERE id = ${getParamValue(req.params.id)}
        RETURNING *
      `;

      if (rows.length === 0) {
        res.status(404).json({
          error: "not_found",
          message: "Configuración global no encontrada",
        });
        return;
      }

      res.json({ data: GlobalConfigurationDtoSchema.parse(formatRow(rows[0])) });
    } catch (error) {
      const err = error as { message?: string } | null;
      if (err?.message?.includes("GLOBAL_CONFIG_IMMUTABLE")) {
        res.status(409).json({
          error: "immutable_config",
          message: "Esta configuración no puede ser modificada (is_mutable = false)",
        });
        return;
      }
      respondWithDatabaseError(res, error);
    }
  },
);

// =====================================================================
// MODERATION ACTIONS ENDPOINTS
// =====================================================================

// GET /administrative/moderation-actions
adminRouter.get(
  "/moderation-actions",
  requireRole(["super_admin", "admin", "moderador"]),
  async (_req, res) => {
    try {
      const rows = await database`
        SELECT * FROM cursos.moderation_actions
        ORDER BY created_at DESC
        LIMIT 100
      `;
      res.json({ data: rows.map((row: DatabaseRow) => ModerationActionDtoSchema.parse(formatRow(row))) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

// POST /administrative/moderation-actions
adminRouter.post(
  "/moderation-actions",
  requireRole(["super_admin", "admin", "moderador"]),
  validate({ body: ModerationActionCreateSchema }),
  async (req, res) => {
    try {
      const rows = await database`
        INSERT INTO cursos.moderation_actions (
          actor_id, action_type, target_resource_type, target_resource_id,
          organizational_unit_id, reason, metadata
        ) VALUES (
          ${req.auth?.userId}, ${req.body.action_type}, 
          ${req.body.target_resource_type}, ${req.body.target_resource_id},
          ${req.body.organizational_unit_id ?? null}, ${req.body.reason},
          ${req.body.metadata ?? {}}
        )
        RETURNING *
      `;

      res.status(201).json({ data: ModerationActionDtoSchema.parse(formatRow(rows[0])) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

// =====================================================================
// T906: SYNC POLICIES ENDPOINT
// Dispara una tarea de sincronización de políticas para una org unit.
// Emite domain_event 'policy.sync_requested' que puede ser consumido
// por un worker/Edge Function para re-aplicar políticas a usuarios.
// =====================================================================

const syncPoliciesBodySchema = z.object({
  org_unit_id: z.string().uuid(),
  policy_type: z.enum(["enrollment", "evaluation", "progression", "completion", "access", "custom"]).optional(),
  reason: z.string().min(1).optional(),
});

// POST /administrative/sync-policies
adminRouter.post(
  "/sync-policies",
  requireRole(["super_admin", "admin"]),
  validate({ body: syncPoliciesBodySchema }),
  async (req, res) => {
    try {
      const { org_unit_id, policy_type, reason } = req.body as z.infer<typeof syncPoliciesBodySchema>;

      const policyRows = await database`
        SELECT id, name, policy_type, enforcement_level, version
        FROM cursos.institutional_policies
        WHERE organizational_unit_id = ${org_unit_id}
          AND is_active = true
          ${policy_type ? database`AND policy_type = ${policy_type}` : database``}
        ORDER BY enforcement_level DESC, policy_type ASC
      `;

      if (policyRows.length === 0) {
        res.status(404).json({ error: "not_found", message: "No hay políticas activas para esta unidad organizativa" });
        return;
      }

      // T909: emit domain_event + invoke sync-policy-worker Edge Function
      await database`
        INSERT INTO cursos.domain_events (event_type, aggregate_type, aggregate_id, actor_user_id, payload)
        VALUES (
          'policy.sync_requested', 'organizational_unit', ${org_unit_id},
          ${req.auth!.userId},
          ${{
            org_unit_id,
            policy_type: policy_type ?? "all",
            policy_count: policyRows.length,
            reason: reason ?? "manual_sync",
            requested_at: new Date().toISOString(),
          }}
        )
      `;

      // Invoke Edge Function asynchronously (fire-and-forget with timeout fallback)
      const supabaseUrl = process.env.SUPABASE_URL;
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      let workerResult: Record<string, unknown> = { status: "sync_requested" };

      if (supabaseUrl && serviceKey) {
        try {
          const workerResponse = await fetch(
            `${supabaseUrl}/functions/v1/sync-policy-worker`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${serviceKey}`,
              },
              body: JSON.stringify({ org_unit_id, policy_type: policy_type ?? "all", reason: reason ?? "manual_sync" }),
              signal: AbortSignal.timeout(25_000),
            },
          );
          if (workerResponse.ok) {
            const wData = await workerResponse.json() as { data?: Record<string, unknown> };
            workerResult = wData.data ?? workerResult;
          }
        } catch {
          // Worker invocation failed — event is already in domain_events, will be retried
        }
      }

      res.json({
        data: {
          org_unit_id,
          policies_queued: policyRows.length,
          policy_type: policy_type ?? "all",
          ...workerResult,
          message: "Sincronización de políticas procesada.",
        },
      });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

// =====================================================================
// T906: TEAM-02 CONTRACTS ENDPOINT
// Expone el catálogo de contratos disponibles para consumo por TEAM-02.
// Incluye constantes, tipos válidos y rutas de los endpoints admin.
// =====================================================================

// GET /administrative/team02/contracts
adminRouter.get(
  "/team02/contracts",
  requireRole(["super_admin", "admin", "instructor"]),
  async (_req, res) => {
    res.json({
      data: {
        version: "1.0.0",
        generated_at: new Date().toISOString(),
        contracts: {
          policy_types:       ["enrollment", "evaluation", "progression", "completion", "access", "custom"],
          action_types:       ["user_suspend", "user_reactivate", "content_flag", "content_remove", "role_change", "policy_override", "custom"],
          enforcement_levels: ["mandatory", "advisory", "informational"],
          scope_levels:       ["global", "organizational_unit", "restricted"],
          admin_roles:        ["super_admin", "admin", "moderador"],
        },
        endpoints: {
          org_units:        "GET|POST|PATCH /administrative/organizational-units",
          branding:         "GET|POST|PATCH /administrative/organizational-units/:id/branding",
          policies:         "GET|POST /administrative/organizational-units/:id/policies",
          policy_patch:     "PATCH /administrative/institutional-policies/:id",
          policy_templates: "GET|POST|PATCH /administrative/policy-templates",
          admin_scopes:     "GET|POST /administrative/admin-scopes",
          global_config:    "GET|POST|PATCH /administrative/global-config",
          moderation:       "GET|POST /administrative/moderation-actions",
          sync:             "POST /administrative/sync-policies",
          scope_check:      "GET /administrative/scope-check?org_unit_id=<uuid>",
        },
      },
    });
  },
);

// =====================================================================
// T905: SCOPE CHECK ENDPOINT
// Permite verificar si el usuario autenticado tiene scope admin para
// una org unit. Consumible por TEAM-02 para enforcement en frontend.
// =====================================================================

// GET /administrative/scope-check?org_unit_id=<uuid>
const scopeCheckQuerySchema = z.object({ org_unit_id: z.string().uuid() });

adminRouter.get(
  "/scope-check",
  requireRole(["super_admin", "admin", "moderador"]),
  validate({ query: scopeCheckQuerySchema }),
  async (req, res) => {
    try {
      const orgUnitId = req.query.org_unit_id as string;
      const rows = await database`
        SELECT cursos.check_admin_scope_for_unit(
          ${req.auth!.userId}::uuid,
          ${orgUnitId}::uuid
        ) AS has_scope
      `;
      const hasScope = (rows[0] as { has_scope: boolean }).has_scope;
      res.json({ data: { user_id: req.auth!.userId, org_unit_id: orgUnitId, has_scope: hasScope } });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

export { adminRouter };
