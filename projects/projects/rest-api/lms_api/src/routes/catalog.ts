import { Router, type Response } from "express";
import { z } from "zod";
import { CourseDtoSchema, LessonDtoSchema, ModuleDtoSchema } from "../dtos";
import { CourseReviewDtoSchema } from "../dtos/course-review";
import {
  resolveCourseAccess,
  resolveLessonContext,
  resolveModuleContext,
} from "../lib/courseAccess";
import { createCourseReview, getCourseReviews } from "../lib/courseReviews";
import { getDatabaseClient } from "../lib/database";
import {
  addCourseToLearningPath,
  createLearningPath,
  deleteLearningPath,
  getLearningPathById,
  listLearningPaths,
  removeCourseFromLearningPath,
  resolveCanEnroll,
  updateLearningPath,
  updateLearningPathCourse,
} from "../lib/learningPaths";
import { authenticateRequest, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";

type DatabaseRow = Record<string, unknown>;

const catalogRouter = Router();
const database = getDatabaseClient();

const courseIdParamsSchema = z.object({ courseId: z.string().uuid() });
const moduleIdParamsSchema = z.object({ moduleId: z.string().uuid() });
const lessonIdParamsSchema = z.object({ lessonId: z.string().uuid() });
const learningPathIdParamsSchema = z.object({
  learningPathId: z.string().uuid(),
});
const learningPathCourseParamsSchema = z.object({
  learningPathId: z.string().uuid(),
  courseId: z.string().uuid(),
});

const courseCreateSchema = z.object({
  slug: z.string().trim().min(1),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1).nullable().optional(),
});

const courseUpdateSchema = courseCreateSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Debe incluir al menos un campo para actualizar",
  });

const moduleCreateSchema = z.object({
  title: z.string().trim().min(1),
  position: z.number().int().optional(),
});

const moduleUpdateSchema = moduleCreateSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Debe incluir al menos un campo para actualizar",
  });

const lessonCreateSchema = z.object({
  title: z.string().trim().min(1),
  content: z.unknown().optional().nullable(),
  position: z.number().int().optional(),
});

const lessonUpdateSchema = lessonCreateSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Debe incluir al menos un campo para actualizar",
  });

const learningPathCreateSchema = z.object({
  slug: z.string().trim().min(1),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1).nullable().optional(),
  isActive: z.boolean().optional(),
});

const learningPathUpdateSchema = learningPathCreateSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Debe incluir al menos un campo para actualizar",
  });

const learningPathCourseCreateSchema = z.object({
  courseId: z.string().uuid(),
  position: z.number().int().optional(),
  isRequired: z.boolean().optional(),
});

const learningPathCourseUpdateSchema = z
  .object({
    position: z.number().int().optional(),
    isRequired: z.boolean().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "Debe incluir al menos un campo para actualizar",
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

function parseCourse(row: DatabaseRow) {
  return CourseDtoSchema.parse(row);
}

function parseModule(row: DatabaseRow) {
  return ModuleDtoSchema.parse(row);
}

function parseLesson(row: DatabaseRow) {
  return LessonDtoSchema.parse(row);
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

catalogRouter.use(authenticateRequest);

catalogRouter.get("/courses", async (_req, res) => {
  try {
    const rows = await database`
      select
        id,
        slug,
        title,
        description,
        created_by,
        to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at,
        rating_average,
        rating_count
      from cursos.courses
      order by created_at desc
    `;
    res.json({ data: rows.map((row: DatabaseRow) => parseCourse(row)) });
  } catch (error) {
    respondWithDatabaseError(res, error);
  }
});

catalogRouter.get(
  "/courses/:courseId",
  validate({ params: courseIdParamsSchema }),
  async (req, res) => {
    try {
      const rows = await database`
        select
          id,
          slug,
          title,
          description,
          created_by,
          to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at,
          rating_average,
          rating_count
        from cursos.courses
        where id = ${req.params.courseId}
        limit 1
      `;

      if (rows.length === 0) {
        res.status(404).json({
          error: "not_found",
          message: "Curso no encontrado",
        });
        return;
      }

      res.json({ data: parseCourse(rows[0]) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

catalogRouter.post(
  "/courses",
  requireRole(["super_admin", "admin", "instructor"]),
  validate({ body: courseCreateSchema }),
  async (req, res) => {
    try {
      const rows =
        await database`insert into cursos.courses (slug, title, description, created_by)
      values (${req.body.slug}, ${req.body.title}, ${req.body.description ?? null}, ${req.auth?.userId})
      returning *`;

      res.status(201).json({ data: parseCourse(rows[0]) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

catalogRouter.patch(
  "/courses/:courseId",
  requireRole(["super_admin", "admin", "instructor"]),
  validate({ params: courseIdParamsSchema, body: courseUpdateSchema }),
  async (req, res) => {
    try {
      const rows = await database`update cursos.courses set
      slug = coalesce(${req.body.slug ?? null}, slug),
      title = coalesce(${req.body.title ?? null}, title),
      description = coalesce(${req.body.description ?? null}, description)
      where id = ${req.params.courseId}
      returning *`;

      if (rows.length === 0) {
        res.status(404).json({
          error: "not_found",
          message: "Curso no encontrado",
        });
        return;
      }

      res.json({ data: parseCourse(rows[0]) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

catalogRouter.delete(
  "/courses/:courseId",
  requireRole(["super_admin", "admin", "instructor"]),
  validate({ params: courseIdParamsSchema }),
  async (req, res) => {
    try {
      const rows =
        await database`delete from cursos.courses where id = ${req.params.courseId} returning id`;

      if (rows.length === 0) {
        res.status(404).json({
          error: "not_found",
          message: "Curso no encontrado",
        });
        return;
      }

      res.status(204).send();
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

// ──────────────────────────────────────────────────────────────────────────
// T828: Course reviews
// ──────────────────────────────────────────────────────────────────────────

const reviewCreateSchema = z.object({
  rating_stars: z.number().int().min(1).max(5),
  comment: z.string().trim().max(1000).nullable().optional(),
});

catalogRouter.post(
  "/courses/:courseId/reviews",
  validate({ params: courseIdParamsSchema, body: reviewCreateSchema }),
  async (req, res) => {
    try {
      const review = await createCourseReview({
        userId: req.auth!.userId,
        courseId: req.params.courseId as string,
        ratingStars: req.body.rating_stars,
        comment: req.body.comment ?? null,
      });
      res.status(201).json({ data: review });
    } catch (error) {
      const reviewError = error as { code?: string } | null;
      if (reviewError?.code === "ENROLLMENT_NOT_COMPLETED") {
        res.status(403).json({
          error: "enrollment_not_completed",
          message: "Solo los alumnos con el curso completado pueden dejar una reseña",
        });
        return;
      }
      if (reviewError?.code === "23505") {
        res.status(409).json({
          error: "conflict",
          message: "Ya existe una reseña tuya para este curso",
        });
        return;
      }
      respondWithDatabaseError(res, error);
    }
  },
);

catalogRouter.get(
  "/courses/:courseId/reviews",
  validate({ params: courseIdParamsSchema }),
  async (req, res) => {
    try {
      const reviews = await getCourseReviews(req.params.courseId as string);
      res.json({ data: reviews });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

catalogRouter.get(
  "/courses/:courseId/modules",
  validate({ params: courseIdParamsSchema }),
  async (req, res) => {
    try {
      const rows = await database`
        select
          id,
          course_id,
          title,
          position
        from cursos.modules
        where course_id = ${req.params.courseId}
        order by position asc
      `;
      res.json({ data: rows.map((row: DatabaseRow) => parseModule(row)) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

catalogRouter.post(
  "/courses/:courseId/modules",
  requireRole(["super_admin", "admin", "instructor"]),
  validate({ params: courseIdParamsSchema, body: moduleCreateSchema }),
  async (req, res) => {
    try {
      const rows =
        await database`insert into cursos.modules (course_id, title, position)
      values (${req.params.courseId}, ${req.body.title}, ${req.body.position ?? 0})
      returning *`;

      res.status(201).json({ data: parseModule(rows[0]) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

catalogRouter.get(
  "/modules/:moduleId",
  validate({ params: moduleIdParamsSchema }),
  async (req, res) => {
    try {
      const rows = await database`
        select
          id,
          course_id,
          title,
          position
        from cursos.modules
        where id = ${req.params.moduleId}
        limit 1
      `;

      if (rows.length === 0) {
        res.status(404).json({
          error: "not_found",
          message: "Modulo no encontrado",
        });
        return;
      }

      res.json({ data: parseModule(rows[0]) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

catalogRouter.patch(
  "/modules/:moduleId",
  requireRole(["super_admin", "admin", "instructor"]),
  validate({ params: moduleIdParamsSchema, body: moduleUpdateSchema }),
  async (req, res) => {
    try {
      const rows = await database`update cursos.modules set
      title = coalesce(${req.body.title ?? null}, title),
      position = coalesce(${req.body.position ?? null}, position)
      where id = ${req.params.moduleId}
      returning *`;

      if (rows.length === 0) {
        res.status(404).json({
          error: "not_found",
          message: "Modulo no encontrado",
        });
        return;
      }

      res.json({ data: parseModule(rows[0]) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

catalogRouter.delete(
  "/modules/:moduleId",
  requireRole(["super_admin", "admin", "instructor"]),
  validate({ params: moduleIdParamsSchema }),
  async (req, res) => {
    try {
      const rows =
        await database`delete from cursos.modules where id = ${req.params.moduleId} returning id`;

      if (rows.length === 0) {
        res.status(404).json({
          error: "not_found",
          message: "Modulo no encontrado",
        });
        return;
      }

      res.status(204).send();
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

catalogRouter.get(
  "/modules/:moduleId/lessons",
  validate({ params: moduleIdParamsSchema }),
  async (req, res) => {
    try {
      const moduleContext = await resolveModuleContext(
        getParamValue(req.params.moduleId),
      );

      if (!moduleContext) {
        res.status(404).json({
          error: "not_found",
          message: "Modulo no encontrado",
        });
        return;
      }

      const access = await resolveCourseAccess(
        req.auth!.userId,
        moduleContext.course_id,
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
          module_id,
          title,
          content,
          position
        from cursos.lessons
        where module_id = ${req.params.moduleId}
        order by position asc
      `;
      res.json({ data: rows.map((row: DatabaseRow) => parseLesson(row)) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

catalogRouter.post(
  "/modules/:moduleId/lessons",
  requireRole(["super_admin", "admin", "instructor"]),
  validate({ params: moduleIdParamsSchema, body: lessonCreateSchema }),
  async (req, res) => {
    try {
      const rows =
        await database`insert into cursos.lessons (module_id, title, content, position)
      values (${req.params.moduleId}, ${req.body.title}, ${req.body.content ?? null}, ${req.body.position ?? 0})
      returning *`;

      res.status(201).json({ data: parseLesson(rows[0]) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

catalogRouter.get(
  "/lessons/:lessonId",
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
          module_id,
          title,
          content,
          position
        from cursos.lessons
        where id = ${req.params.lessonId}
        limit 1
      `;

      if (rows.length === 0) {
        res.status(404).json({
          error: "not_found",
          message: "Leccion no encontrada",
        });
        return;
      }

      res.json({ data: parseLesson(rows[0]) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

catalogRouter.patch(
  "/lessons/:lessonId",
  requireRole(["super_admin", "admin", "instructor"]),
  validate({ params: lessonIdParamsSchema, body: lessonUpdateSchema }),
  async (req, res) => {
    try {
      const rows = await database`update cursos.lessons set
      title = coalesce(${req.body.title ?? null}, title),
      content = coalesce(${req.body.content ?? null}, content),
      position = coalesce(${req.body.position ?? null}, position)
      where id = ${req.params.lessonId}
      returning *`;

      if (rows.length === 0) {
        res.status(404).json({
          error: "not_found",
          message: "Leccion no encontrada",
        });
        return;
      }

      res.json({ data: parseLesson(rows[0]) });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

catalogRouter.delete(
  "/lessons/:lessonId",
  requireRole(["super_admin", "admin", "instructor"]),
  validate({ params: lessonIdParamsSchema }),
  async (req, res) => {
    try {
      const rows =
        await database`delete from cursos.lessons where id = ${req.params.lessonId} returning id`;

      if (rows.length === 0) {
        res.status(404).json({
          error: "not_found",
          message: "Leccion no encontrada",
        });
        return;
      }

      res.status(204).send();
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

catalogRouter.get("/learning-paths", async (_req, res) => {
  try {
    const learningPaths = await listLearningPaths();
    res.json({ data: learningPaths });
  } catch (error) {
    respondWithDatabaseError(res, error);
  }
});

catalogRouter.get(
  "/learning-paths/:learningPathId",
  validate({ params: learningPathIdParamsSchema }),
  async (req, res) => {
    try {
      const learningPath = await getLearningPathById(
        getParamValue(req.params.learningPathId),
      );

      if (!learningPath) {
        res.status(404).json({
          error: "not_found",
          message: "Ruta de aprendizaje no encontrada",
        });
        return;
      }

      res.json({ data: learningPath });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

catalogRouter.post(
  "/learning-paths",
  requireRole(["super_admin", "admin", "instructor"]),
  validate({ body: learningPathCreateSchema }),
  async (req, res) => {
    try {
      const learningPath = await createLearningPath(
        {
          slug: req.body.slug,
          title: req.body.title,
          description: req.body.description ?? null,
          isActive: req.body.isActive,
        },
        req.auth!.userId,
      );

      res.status(201).json({ data: learningPath });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

catalogRouter.patch(
  "/learning-paths/:learningPathId",
  requireRole(["super_admin", "admin", "instructor"]),
  validate({ params: learningPathIdParamsSchema, body: learningPathUpdateSchema }),
  async (req, res) => {
    try {
      const learningPath = await updateLearningPath(
        getParamValue(req.params.learningPathId),
        {
          slug: req.body.slug,
          title: req.body.title,
          description: req.body.description,
          isActive: req.body.isActive,
        },
      );

      if (!learningPath) {
        res.status(404).json({
          error: "not_found",
          message: "Ruta de aprendizaje no encontrada",
        });
        return;
      }

      res.json({ data: learningPath });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

catalogRouter.delete(
  "/learning-paths/:learningPathId",
  requireRole(["super_admin", "admin", "instructor"]),
  validate({ params: learningPathIdParamsSchema }),
  async (req, res) => {
    try {
      const removed = await deleteLearningPath(
        getParamValue(req.params.learningPathId),
      );

      if (!removed) {
        res.status(404).json({
          error: "not_found",
          message: "Ruta de aprendizaje no encontrada",
        });
        return;
      }

      res.status(204).send();
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

catalogRouter.get(
  "/learning-paths/:learningPathId/courses",
  validate({ params: learningPathIdParamsSchema }),
  async (req, res) => {
    try {
      const learningPath = await getLearningPathById(
        getParamValue(req.params.learningPathId),
      );

      if (!learningPath) {
        res.status(404).json({
          error: "not_found",
          message: "Ruta de aprendizaje no encontrada",
        });
        return;
      }

      res.json({ data: learningPath.courses });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

catalogRouter.post(
  "/learning-paths/:learningPathId/courses",
  requireRole(["super_admin", "admin", "instructor"]),
  validate({ params: learningPathIdParamsSchema, body: learningPathCourseCreateSchema }),
  async (req, res) => {
    try {
      const course = await addCourseToLearningPath(
        getParamValue(req.params.learningPathId),
        req.body.courseId,
        {
          position: req.body.position,
          isRequired: req.body.isRequired,
        },
      );

      res.status(201).json({ data: course });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

catalogRouter.patch(
  "/learning-paths/:learningPathId/courses/:courseId",
  requireRole(["super_admin", "admin", "instructor"]),
  validate({ params: learningPathCourseParamsSchema, body: learningPathCourseUpdateSchema }),
  async (req, res) => {
    try {
      const course = await updateLearningPathCourse(
        getParamValue(req.params.learningPathId),
        getParamValue(req.params.courseId),
        {
          position: req.body.position,
          isRequired: req.body.isRequired,
        },
      );

      if (!course) {
        res.status(404).json({
          error: "not_found",
          message: "Asociacion de ruta no encontrada",
        });
        return;
      }

      res.json({ data: course });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

catalogRouter.delete(
  "/learning-paths/:learningPathId/courses/:courseId",
  requireRole(["super_admin", "admin", "instructor"]),
  validate({ params: learningPathCourseParamsSchema }),
  async (req, res) => {
    try {
      const removed = await removeCourseFromLearningPath(
        getParamValue(req.params.learningPathId),
        getParamValue(req.params.courseId),
      );

      if (!removed) {
        res.status(404).json({
          error: "not_found",
          message: "Asociacion de ruta no encontrada",
        });
        return;
      }

      res.status(204).send();
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

catalogRouter.get(
  "/courses/:courseId/can-enroll",
  validate({ params: courseIdParamsSchema }),
  async (req, res) => {
    try {
      const eligibility = await resolveCanEnroll(
        req.auth!.userId,
        getParamValue(req.params.courseId),
      );

      res.json({ data: eligibility });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

export { catalogRouter };
