import { Router, type Response } from "express";
import type postgres from "postgres";
import { z } from "zod";
import {
  CertificateTemplateDtoSchema,
  CertificateTemplateCreateSchema,
  CertificateTemplateVersionSchema,
  IssueCertificateRequestSchema,
} from "../dtos/certificate";
import { getDatabaseClient } from "../lib/database";
import { loadConfig } from "../config";
import { authenticateRequest, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";

type DatabaseRow = Record<string, unknown>;

const certificatesRouter = Router();
const database = getDatabaseClient();

const slugParamSchema = z.object({ slug: z.string().min(1) });
const slugVersionParamSchema = z.object({
  slug: z.string().min(1),
  version: z.string().regex(/^\d+$/).transform(Number),
});

const TEMPLATE_SELECT = `
  id, slug, type, version, title, layout, variables, is_current, is_active, created_by,
  to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
`;

function respondWithDatabaseError(res: Response, error: unknown): void {
  const dbError = error as { code?: string } | null;
  if (dbError?.code === "23505") {
    res.status(409).json({ error: "conflict", message: "Ya existe un registro con esos valores" });
    return;
  }
  res.status(500).json({ error: "internal_server_error", message: "Error interno del servidor" });
}

// certificate-templates: todos los endpoints requieren auth
certificatesRouter.use("/certificate-templates", authenticateRequest);
// /certificates/me y POST /certificates requieren auth inline; /certificates/verify/:code es público

// =====================================================
// List current version of all templates
// =====================================================
certificatesRouter.get("/certificate-templates", async (_req, res) => {
  try {
    const rows = await database`
      select ${database.unsafe(TEMPLATE_SELECT)}
      from cursos.certificate_templates
      where is_current = true and is_active = true
      order by slug asc
    `;
    res.json({ data: rows.map((r: DatabaseRow) => CertificateTemplateDtoSchema.parse(r)) });
  } catch (error) {
    respondWithDatabaseError(res, error);
  }
});

// =====================================================
// Get current version of a specific template
// =====================================================
certificatesRouter.get(
  "/certificate-templates/:slug",
  validate({ params: slugParamSchema }),
  async (req, res) => {
    try {
      const rows = await database`
        select ${database.unsafe(TEMPLATE_SELECT)}
        from cursos.certificate_templates
        where slug = ${req.params.slug} and is_current = true and is_active = true
        limit 1
      `;
      if (rows.length === 0) {
        res.status(404).json({ error: "not_found", message: "Plantilla no encontrada" });
        return;
      }
      res.json({ data: CertificateTemplateDtoSchema.parse(rows[0]) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

// =====================================================
// List all versions of a template
// =====================================================
certificatesRouter.get(
  "/certificate-templates/:slug/versions",
  validate({ params: slugParamSchema }),
  async (req, res) => {
    try {
      const rows = await database`
        select ${database.unsafe(TEMPLATE_SELECT)}
        from cursos.certificate_templates
        where slug = ${req.params.slug}
        order by version desc
      `;
      if (rows.length === 0) {
        res.status(404).json({ error: "not_found", message: "Plantilla no encontrada" });
        return;
      }
      res.json({ data: rows.map((r: DatabaseRow) => CertificateTemplateDtoSchema.parse(r)) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

// =====================================================
// Get a specific version of a template
// =====================================================
certificatesRouter.get(
  "/certificate-templates/:slug/versions/:version",
  validate({ params: slugVersionParamSchema }),
  async (req, res) => {
    try {
      const rows = await database`
        select ${database.unsafe(TEMPLATE_SELECT)}
        from cursos.certificate_templates
        where slug = ${req.params.slug} and version = ${req.params.version}
        limit 1
      `;
      if (rows.length === 0) {
        res.status(404).json({ error: "not_found", message: "Versión no encontrada" });
        return;
      }
      res.json({ data: CertificateTemplateDtoSchema.parse(rows[0]) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

// =====================================================
// Create new template (version 1)
// =====================================================
certificatesRouter.post(
  "/certificate-templates",
  requireRole(["super_admin", "admin"]),
  validate({ body: CertificateTemplateCreateSchema }),
  async (req, res) => {
    try {
      // Ensure slug does not already exist
      const existing = await database`
        select id from cursos.certificate_templates where slug = ${req.body.slug} limit 1
      `;
      if (existing.length > 0) {
        res.status(409).json({
          error: "conflict",
          message: "Ya existe una plantilla con ese slug. Usa POST /certificate-templates/:slug/versions para crear una nueva versión.",
        });
        return;
      }

      const layout = JSON.stringify(req.body.layout);
      const variables = JSON.stringify(req.body.variables ?? []);

      const rows = await database`
        insert into cursos.certificate_templates
          (slug, type, version, title, layout, variables, is_current, created_by)
        values (
          ${req.body.slug},
          ${req.body.type ?? "certificate"},
          1,
          ${req.body.title},
          ${layout},
          ${variables},
          true,
          ${req.auth?.userId}
        )
        returning ${database.unsafe(TEMPLATE_SELECT)}
      `;
      res.status(201).json({ data: CertificateTemplateDtoSchema.parse(rows[0]) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

// =====================================================
// Create new version of existing template
// Creates version+1, sets as current, keeps old version as history
// =====================================================
certificatesRouter.post(
  "/certificate-templates/:slug/versions",
  requireRole(["super_admin", "admin"]),
  validate({ params: slugParamSchema, body: CertificateTemplateVersionSchema }),
  async (req, res) => {
    try {
      // Resolve next version number and existing title/type
      const existing = await database`
        select max(version) as max_version, max(title) as last_title, max(type) as last_type
        from cursos.certificate_templates
        where slug = ${req.params.slug}
      `;

      if (!existing[0] || existing[0].max_version === null) {
        res.status(404).json({ error: "not_found", message: "Plantilla no encontrada. Usa POST /certificate-templates para crearla." });
        return;
      }

      const nextVersion = Number(existing[0].max_version) + 1;
      const layout = JSON.stringify(req.body.layout);
      const variables = JSON.stringify(req.body.variables ?? []);
      const title = req.body.title ?? (existing[0].last_title as string);
      const type = existing[0].last_type as string;

      // Transaction: deactivate current, insert new version
      const [newTemplate] = await database.begin(async (tx: postgres.TransactionSql) => {
        await tx`
          update cursos.certificate_templates
          set is_current = false
          where slug = ${req.params.slug} and is_current = true
        `;

        return tx`
          insert into cursos.certificate_templates
            (slug, type, version, title, layout, variables, is_current, created_by)
          values (
            ${req.params.slug}, ${type}, ${nextVersion}, ${title},
            ${layout}, ${variables}, true, ${req.auth?.userId ?? null}
          )
          returning ${tx.unsafe(TEMPLATE_SELECT)}
        `;
      });

      res.status(201).json({ data: CertificateTemplateDtoSchema.parse(newTemplate) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

// =====================================================
// Activate a specific version (rollback)
// Sets the given version as current, deactivates the rest
// =====================================================
certificatesRouter.post(
  "/certificate-templates/:slug/activate/:version",
  requireRole(["super_admin", "admin"]),
  validate({ params: slugVersionParamSchema }),
  async (req, res) => {
    try {
      const target = await database`
        select id from cursos.certificate_templates
        where slug = ${req.params.slug} and version = ${req.params.version}
        limit 1
      `;
      if (target.length === 0) {
        res.status(404).json({ error: "not_found", message: "Versión no encontrada" });
        return;
      }

      await database.begin(async (tx: postgres.TransactionSql) => {
        await tx`
          update cursos.certificate_templates
          set is_current = false
          where slug = ${req.params.slug}
        `;
        await tx`
          update cursos.certificate_templates
          set is_current = true
          where slug = ${req.params.slug} and version = ${req.params.version}
        `;
      });

      const rows = await database`
        select ${database.unsafe(TEMPLATE_SELECT)}
        from cursos.certificate_templates
        where slug = ${req.params.slug} and version = ${req.params.version}
        limit 1
      `;
      res.json({ data: CertificateTemplateDtoSchema.parse(rows[0]) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

// =====================================================
// Soft-delete all versions of a template
// =====================================================
certificatesRouter.delete(
  "/certificate-templates/:slug",
  requireRole(["super_admin", "admin"]),
  validate({ params: slugParamSchema }),
  async (req, res) => {
    try {
      const rows = await database`
        update cursos.certificate_templates
        set is_active = false, is_current = false
        where slug = ${req.params.slug}
        returning id
      `;
      if (rows.length === 0) {
        res.status(404).json({ error: "not_found", message: "Plantilla no encontrada" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

// =====================================================
// Issued certificates — read own
// =====================================================
certificatesRouter.get("/certificates/me", authenticateRequest, async (req, res) => {
  try {
    const rows = await database`
      select
        ic.id, ic.template_id, ic.user_id, ic.course_id, ic.verify_code,
        to_char(ic.issued_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as issued_at,
        ic.payload,
        ct.slug as template_slug, ct.type as template_type, ct.title as template_title
      from cursos.issued_certificates ic
      join cursos.certificate_templates ct on ct.id = ic.template_id
      where ic.user_id = ${req.auth!.userId}
      order by ic.issued_at desc
    `;
    res.json({ data: rows });
  } catch (error) {
    respondWithDatabaseError(res, error);
  }
});

// =====================================================
// Public verification endpoint — exported separately so se monta
// ANTES de catalogRouter (que tiene auth global) en index.ts
// =====================================================
const certificateVerifyRouter = Router();
certificateVerifyRouter.get("/certificates/verify/:code", async (req, res) => {
  try {
    const rows = await database`
      select
        ic.id, ic.verify_code, ic.user_id, ic.course_id,
        to_char(ic.issued_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as issued_at,
        ct.slug as template_slug, ct.type as template_type, ct.title as template_title,
        ct.version as template_version,
        p.display_name as recipient_name
      from cursos.issued_certificates ic
      join cursos.certificate_templates ct on ct.id = ic.template_id
      join cursos.profiles p on p.id = ic.user_id
      where ic.verify_code = ${req.params.code}
      limit 1
    `;
    if (rows.length === 0) {
      res.status(404).json({ error: "not_found", message: "Certificado no encontrado" });
      return;
    }
    res.json({ data: rows[0] });
  } catch (error) {
    respondWithDatabaseError(res, error);
  }
});

// =====================================================
// Issue a certificate — delegates to Edge Function issue-certificate
// Only admin/super_admin can trigger manual issuance
// =====================================================
certificatesRouter.post(
  "/certificates",
  authenticateRequest,
  requireRole(["super_admin", "admin"]),
  validate({ body: IssueCertificateRequestSchema }),
  async (req, res) => {
    const config = loadConfig();
    const edgeFnUrl = `${config.SUPABASE_URL}/functions/v1/issue-certificate`;

    let edgeResponse: Awaited<ReturnType<typeof fetch>>;
    try {
      edgeResponse = await fetch(edgeFnUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify(req.body),
      });
    } catch {
      res.status(502).json({ error: "edge_function_unavailable", message: "No se pudo contactar issue-certificate" });
      return;
    }

    const data = await edgeResponse.json() as unknown;
    res.status(edgeResponse.status).json(data);
  },
);

export { certificatesRouter, certificateVerifyRouter };
