import { Router, type Response } from "express";
import { z } from "zod";
import { resolveCourseAccess, resolveLessonContext } from "../lib/courseAccess";
import { getDatabaseClient } from "../lib/database";
import { detectProvider } from "../lib/resourceProvider";
import { authenticateRequest, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  ResourceCreateSchema,
  ResourceDtoSchema,
  ResourceUpdateSchema,
} from "../dtos/resource";

type DatabaseRow = Record<string, unknown>;

const resourcesRouter = Router();
const database = getDatabaseClient();

const lessonIdParamsSchema = z.object({ lessonId: z.string().uuid() });
const resourceParamsSchema = z.object({
  lessonId: z.string().uuid(),
  resourceId: z.string().uuid(),
});

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

function parseResource(row: DatabaseRow) {
  return ResourceDtoSchema.parse(row);
}

function respondWithBlockedContent(
  res: Response,
  reason: "not_enrolled" | "prerequisites_incomplete",
  pendingPrerequisiteCourseIds: string[],
): void {
  res.status(403).json({
    error: "blocked",
    message: "Contenido bloqueado",
    reason,
    pending_prerequisite_course_ids: pendingPrerequisiteCourseIds,
  });
}

function getParamValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

resourcesRouter.use(authenticateRequest);

resourcesRouter.get(
  "/lessons/:lessonId/resources",
  validate({ params: lessonIdParamsSchema }),
  async (req, res) => {
    try {
      const lessonContext = await resolveLessonContext(
        getParamValue(req.params.lessonId),
      );

      if (!lessonContext) {
        res.status(404).json({
          error: "not_found",
          message: "Leccion no encontrada",
        });
        return;
      }

      const access = await resolveCourseAccess(
        req.auth!.userId,
        lessonContext.course_id,
      );

      if (access.status === "blocked") {
        respondWithBlockedContent(
          res,
          access.reason,
          access.pending_prerequisite_course_ids,
        );
        return;
      }

      const rows = await database`
          select
            id,
            lesson_id,
            url,
            provider,
            title,
            description,
            mime_type,
            thumbnail_url,
            duration_seconds,
            metadata,
            created_by,
            to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
          from cursos.external_resources
          where lesson_id = ${req.params.lessonId}
          order by created_at desc
        `;
      res.json({ data: rows.map((row: DatabaseRow) => parseResource(row)) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

resourcesRouter.post(
  "/lessons/:lessonId/resources",
  requireRole(["super_admin", "admin", "instructor"]),
  validate({ params: lessonIdParamsSchema, body: ResourceCreateSchema }),
  async (req, res) => {
    try {
      const provider = detectProvider(req.body.url);
      const metadata = JSON.stringify(req.body.metadata ?? {});

      const rows = await database`insert into cursos.external_resources (
        lesson_id,
        url,
        provider,
        title,
        description,
        mime_type,
        thumbnail_url,
        duration_seconds,
        metadata,
        created_by
      ) values (
        ${req.params.lessonId},
        ${req.body.url},
        ${provider},
        ${req.body.title ?? null},
        ${req.body.description ?? null},
        ${req.body.mime_type ?? null},
        ${req.body.thumbnail_url ?? null},
        ${req.body.duration_seconds ?? null},
        ${metadata},
        ${req.auth?.userId}
      ) returning *`;

      res.status(201).json({ data: parseResource(rows[0]) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

resourcesRouter.get(
  "/lessons/:lessonId/resources/:resourceId",
  validate({ params: resourceParamsSchema }),
  async (req, res) => {
    try {
      const lessonContext = await resolveLessonContext(
        getParamValue(req.params.lessonId),
      );

      if (!lessonContext) {
        res.status(404).json({
          error: "not_found",
          message: "Leccion no encontrada",
        });
        return;
      }

      const access = await resolveCourseAccess(
        req.auth!.userId,
        lessonContext.course_id,
      );

      if (access.status === "blocked") {
        respondWithBlockedContent(
          res,
          access.reason,
          access.pending_prerequisite_course_ids,
        );
        return;
      }

      const rows = await database`
        select
          id,
          lesson_id,
          url,
          provider,
          title,
          description,
          mime_type,
          thumbnail_url,
          duration_seconds,
          metadata,
          created_by,
          to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
        from cursos.external_resources
        where id = ${req.params.resourceId}
          and lesson_id = ${req.params.lessonId}
        limit 1
      `;

      if (rows.length === 0) {
        res.status(404).json({
          error: "not_found",
          message: "Recurso no encontrado",
        });
        return;
      }

      res.json({ data: parseResource(rows[0]) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

resourcesRouter.patch(
  "/lessons/:lessonId/resources/:resourceId",
  requireRole(["super_admin", "admin", "instructor"]),
  validate({ params: resourceParamsSchema, body: ResourceUpdateSchema }),
  async (req, res) => {
    try {
      const provider = req.body.url ? detectProvider(req.body.url) : null;
      const metadata = req.body.metadata
        ? JSON.stringify(req.body.metadata)
        : null;

      const rows = await database`update cursos.external_resources set
        url = coalesce(${req.body.url ?? null}, url),
        provider = coalesce(${provider ?? null}, provider),
        title = coalesce(${req.body.title ?? null}, title),
        description = coalesce(${req.body.description ?? null}, description),
        mime_type = coalesce(${req.body.mime_type ?? null}, mime_type),
        thumbnail_url = coalesce(${req.body.thumbnail_url ?? null}, thumbnail_url),
        duration_seconds = coalesce(${req.body.duration_seconds ?? null}, duration_seconds),
        metadata = coalesce(${metadata ?? null}, metadata)
        where id = ${req.params.resourceId} and lesson_id = ${req.params.lessonId}
        returning
          id,
          lesson_id,
          url,
          provider,
          title,
          description,
          mime_type,
          thumbnail_url,
          duration_seconds,
          metadata,
          created_by,
          to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at`;

      if (rows.length === 0) {
        res.status(404).json({
          error: "not_found",
          message: "Recurso no encontrado",
        });
        return;
      }

      res.json({ data: parseResource(rows[0]) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

resourcesRouter.delete(
  "/lessons/:lessonId/resources/:resourceId",
  requireRole(["super_admin", "admin", "instructor"]),
  validate({ params: resourceParamsSchema }),
  async (req, res) => {
    try {
      const rows =
        await database`delete from cursos.external_resources where id = ${req.params.resourceId} and lesson_id = ${req.params.lessonId} returning id`;

      if (rows.length === 0) {
        res.status(404).json({
          error: "not_found",
          message: "Recurso no encontrado",
        });
        return;
      }

      res.status(204).send();
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

export { resourcesRouter };
