import { Router, type Response } from "express";
import { z } from "zod";
import { EnrollmentCreateSchema } from "../dtos";
import { authenticateRequest, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  cancelEnrollment,
  courseExists,
  getCourseCreatedBy,
  createEnrollment,
  getEnrollmentById,
  listEnrollmentsByCourse,
  listEnrollmentsByUser,
  reactivateEnrollment,
} from "../lib/enrollments";

const enrollmentsRouter = Router();

const enrollmentIdParamsSchema = z.object({ enrollmentId: z.string().uuid() });
const courseIdParamsSchema = z.object({ courseId: z.string().uuid() });

const enrollmentQuerySchema = z.object({
  status: z.enum(["active", "cancelled", "completed"]).optional(),
  user_id: z.string().uuid().optional(),
});

function getParamValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

function respondWithNotFound(res: Response, message: string): void {
  res.status(404).json({ error: "not_found", message });
}

function respondWithEnrollmentError(res: Response, error: unknown): void {
  const err = error as { message?: string; code?: string } | null;
  const msg = err?.message ?? "";

  if (msg.includes("ENROLLMENT_NOT_FOUND")) {
    respondWithNotFound(res, "Inscripción no encontrada");
    return;
  }
  if (msg.includes("ENROLLMENT_COMPLETED_CANNOT_CANCEL")) {
    res.status(409).json({
      error: "conflict",
      message: "No se puede cancelar una inscripción completada",
    });
    return;
  }
  if (msg.includes("ENROLLMENT_COMPLETED_CANNOT_REACTIVATE")) {
    res.status(409).json({
      error: "conflict",
      message: "No se puede reactivar una inscripción completada",
    });
    return;
  }
  if (msg.includes("ENROLLMENT_ACTIVE_EXISTS")) {
    res.status(409).json({
      error: "conflict",
      message: "Ya existe una inscripción activa para este usuario y curso",
    });
    return;
  }

  const dbError = error as { code?: string } | null;
  if (dbError?.code === "23505") {
    res.status(409).json({
      error: "conflict",
      message: "Ya existe una inscripción activa para este curso",
    });
    return;
  }
  if (dbError?.code === "23503") {
    res.status(400).json({
      error: "invalid_reference",
      message: "El curso o usuario referenciado no existe",
    });
    return;
  }

  res.status(500).json({
    error: "internal_server_error",
    message: "Error interno del servidor",
  });
}

enrollmentsRouter.use(authenticateRequest);

// T125: Alta idempotente — el alumno se inscribe a sí mismo
// Valida que el curso exista antes del INSERT (→ 404 si no existe)
enrollmentsRouter.post(
  "/enrollments",
  validate({ body: EnrollmentCreateSchema }),
  async (req, res) => {
    try {
      const exists = await courseExists(req.body.course_id);
      if (!exists) {
        respondWithNotFound(res, "Curso no encontrado");
        return;
      }

      const enrollment = await createEnrollment(
        req.auth!.userId,
        req.body.course_id,
      );
      res.status(201).json({ data: enrollment });
    } catch (error) {
      respondWithEnrollmentError(res, error);
    }
  },
);

// T125: Listar inscripciones propias; admin ve las de otro usuario con ?user_id=
enrollmentsRouter.get(
  "/enrollments",
  validate({ query: enrollmentQuerySchema }),
  async (req, res) => {
    try {
      const isAdmin = ["admin", "super_admin"].includes(req.auth!.role);
      const targetUserId =
        isAdmin && typeof req.query.user_id === "string"
          ? req.query.user_id
          : req.auth!.userId;

      const enrollments = await listEnrollmentsByUser(targetUserId, {
        status:
          typeof req.query.status === "string" ? req.query.status : undefined,
      });

      res.json({ data: enrollments });
    } catch (error) {
      respondWithEnrollmentError(res, error);
    }
  },
);

// T125: Listar inscripciones por curso
// admin/super_admin → ven todas; instructor → solo cursos que creó; moderador/alumno → 403
enrollmentsRouter.get(
  "/courses/:courseId/enrollments",
  requireRole(["admin", "super_admin", "instructor"]),
  validate({ params: courseIdParamsSchema, query: enrollmentQuerySchema }),
  async (req, res) => {
    try {
      const courseId = getParamValue(req.params.courseId);
      const isAdmin = ["admin", "super_admin"].includes(req.auth!.role);

      if (!isAdmin) {
        const createdBy = await getCourseCreatedBy(courseId);
        if (!createdBy) {
          respondWithNotFound(res, "Curso no encontrado");
          return;
        }
        if (createdBy !== req.auth!.userId) {
          res.status(403).json({
            error: "forbidden",
            message: "Solo puedes ver inscripciones de cursos que creaste",
          });
          return;
        }
      }

      const enrollments = await listEnrollmentsByCourse(courseId, {
        status:
          typeof req.query.status === "string" ? req.query.status : undefined,
      });
      res.json({ data: enrollments });
    } catch (error) {
      respondWithEnrollmentError(res, error);
    }
  },
);

// T125: Detalle de una inscripción — propio usuario o admin
enrollmentsRouter.get(
  "/enrollments/:enrollmentId",
  validate({ params: enrollmentIdParamsSchema }),
  async (req, res) => {
    try {
      const enrollment = await getEnrollmentById(
        getParamValue(req.params.enrollmentId),
      );

      if (!enrollment) {
        respondWithNotFound(res, "Inscripción no encontrada");
        return;
      }

      const isAdmin = ["admin", "super_admin"].includes(req.auth!.role);
      if (!isAdmin && enrollment.user_id !== req.auth!.userId) {
        res.status(403).json({
          error: "forbidden",
          message: "No tienes permisos para ver esta inscripción",
        });
        return;
      }

      res.json({ data: enrollment });
    } catch (error) {
      respondWithEnrollmentError(res, error);
    }
  },
);

// T125/T126: Cancelación — propio usuario o admin/super_admin
enrollmentsRouter.patch(
  "/enrollments/:enrollmentId/cancel",
  validate({ params: enrollmentIdParamsSchema }),
  async (req, res) => {
    try {
      const enrollmentId = getParamValue(req.params.enrollmentId);
      const existing = await getEnrollmentById(enrollmentId);

      if (!existing) {
        respondWithNotFound(res, "Inscripción no encontrada");
        return;
      }

      const isAdmin = ["admin", "super_admin"].includes(req.auth!.role);
      if (!isAdmin && existing.user_id !== req.auth!.userId) {
        res.status(403).json({
          error: "forbidden",
          message: "No tienes permisos para cancelar esta inscripción",
        });
        return;
      }

      const enrollment = await cancelEnrollment(enrollmentId, req.auth!.userId);
      res.json({ data: enrollment });
    } catch (error) {
      respondWithEnrollmentError(res, error);
    }
  },
);

// T126: Reactivación — propio usuario (si está cancelada) o admin/super_admin
enrollmentsRouter.patch(
  "/enrollments/:enrollmentId/reactivate",
  validate({ params: enrollmentIdParamsSchema }),
  async (req, res) => {
    try {
      const enrollmentId = getParamValue(req.params.enrollmentId);
      const existing = await getEnrollmentById(enrollmentId);

      if (!existing) {
        respondWithNotFound(res, "Inscripción no encontrada");
        return;
      }

      const isAdmin = ["admin", "super_admin"].includes(req.auth!.role);
      if (!isAdmin && existing.user_id !== req.auth!.userId) {
        res.status(403).json({
          error: "forbidden",
          message: "No tienes permisos para reactivar esta inscripción",
        });
        return;
      }

      const enrollment = await reactivateEnrollment(enrollmentId, req.auth!.userId);
      res.json({ data: enrollment });
    } catch (error) {
      respondWithEnrollmentError(res, error);
    }
  },
);

export { enrollmentsRouter };
