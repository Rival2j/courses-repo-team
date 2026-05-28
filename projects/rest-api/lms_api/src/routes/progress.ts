import { Router, type Response } from "express";
import { z } from "zod";
import { ProgressDtoSchema, ProgressUpdateSchema } from "../dtos/progress";
import {
  loadCourseProgressSnapshot,
  upsertLessonProgress,
} from "../lib/courseAccess";
import { authenticateRequest } from "../middleware/auth";
import { validate } from "../middleware/validate";

const progressRouter = Router();

const courseIdParamsSchema = z.object({ courseId: z.string().uuid() });
const lessonIdParamsSchema = z.object({ lessonId: z.string().uuid() });

function getParamValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
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

progressRouter.use(authenticateRequest);

progressRouter.get(
  "/courses/:courseId/progress",
  validate({ params: courseIdParamsSchema }),
  async (req, res) => {
    try {
      const snapshot = await loadCourseProgressSnapshot(
        req.auth!.userId,
        getParamValue(req.params.courseId),
      );
      res.json({ data: snapshot });
    } catch {
      res.status(500).json({
        error: "internal_server_error",
        message: "Error interno del servidor",
      });
    }
  },
);

progressRouter.put(
  "/lessons/:lessonId/progress",
  validate({ params: lessonIdParamsSchema, body: ProgressUpdateSchema }),
  async (req, res) => {
    try {
      const result = await upsertLessonProgress(
        req.auth!.userId,
        getParamValue(req.params.lessonId),
        req.body.completed,
      );

      if (!result) {
        res.status(404).json({
          error: "not_found",
          message: "Leccion no encontrada",
        });
        return;
      }

      if ("blocked" in result) {
        respondWithBlockedContent(
          res,
          result.reason,
          result.pending_prerequisite_course_ids,
        );
        return;
      }

      res.json({ data: ProgressDtoSchema.parse(result) });
    } catch {
      res.status(500).json({
        error: "internal_server_error",
        message: "Error interno del servidor",
      });
    }
  },
);

export { progressRouter };
