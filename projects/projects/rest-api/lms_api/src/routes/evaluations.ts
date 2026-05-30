import { Router } from "express";
import { z } from "zod";
import {
  getEvaluationAttemptDetail,
  getEvaluationAttempts,
  getEvaluationGateStatus,
  getEvaluationWithQuestions,
  startEvaluationAttempt,
} from "../lib/evaluations";
import { authenticateRequest } from "../middleware/auth";
import { validate } from "../middleware/validate";

const evaluationsRouter = Router();

const evaluationIdParamsSchema = z.object({
  evaluationId: z.string().uuid(),
});

const attemptIdParamsSchema = z.object({
  evaluationId: z.string().uuid(),
  attemptId: z.string().uuid(),
});

const courseIdParamsSchema = z.object({
  courseId: z.string().uuid(),
});

evaluationsRouter.use(authenticateRequest);

evaluationsRouter.get(
  "/evaluations/:evaluationId",
  validate({ params: evaluationIdParamsSchema }),
  async (req, res) => {
    try {
      const result = await getEvaluationWithQuestions(
        req.params.evaluationId as string,
      );

      if (!result) {
        res.status(404).json({
          error: "not_found",
          message: "Evaluacion no encontrada",
        });
        return;
      }

      res.json({ data: result });
    } catch {
      res.status(500).json({
        error: "internal_server_error",
        message: "Error interno del servidor",
      });
    }
  },
);

// T324: Start a new evaluation attempt (enforces max_attempts)
evaluationsRouter.post(
  "/evaluations/:evaluationId/attempts",
  validate({ params: evaluationIdParamsSchema }),
  async (req, res) => {
    try {
      const result = await startEvaluationAttempt(
        req.auth!.userId,
        req.params.evaluationId as string,
      );

      if (result === "evaluation_not_found") {
        res.status(404).json({ error: "not_found", message: "Evaluacion no encontrada" });
        return;
      }
      if (result === "enrollment_required") {
        res.status(403).json({ error: "enrollment_required", message: "Debes estar inscrito al curso para intentar esta evaluacion" });
        return;
      }
      if (result === "attempt_already_open") {
        res.status(409).json({ error: "attempt_already_open", message: "Ya tienes un intento abierto para esta evaluacion" });
        return;
      }
      if (result === "max_attempts_exceeded") {
        res.status(409).json({ error: "max_attempts_exceeded", message: "Has alcanzado el limite de intentos para esta evaluacion" });
        return;
      }

      res.status(201).json({ data: result });
    } catch {
      res.status(500).json({ error: "internal_server_error", message: "Error interno del servidor" });
    }
  },
);

evaluationsRouter.get(
  "/evaluations/:evaluationId/attempts",
  validate({ params: evaluationIdParamsSchema }),
  async (req, res) => {
    try {
      const attempts = await getEvaluationAttempts(
        req.auth!.userId,
        req.params.evaluationId as string,
      );

      res.json({ data: attempts });
    } catch {
      res.status(500).json({
        error: "internal_server_error",
        message: "Error interno del servidor",
      });
    }
  },
);

evaluationsRouter.get(
  "/evaluations/:evaluationId/attempts/:attemptId",
  validate({ params: attemptIdParamsSchema }),
  async (req, res) => {
    try {
      const result = await getEvaluationAttemptDetail(
        req.auth!.userId,
        req.params.attemptId as string,
        req.params.evaluationId as string,
      );

      if (!result) {
        res.status(404).json({
          error: "not_found",
          message: "Intento no encontrado",
        });
        return;
      }

      if (result === "forbidden") {
        res.status(403).json({
          error: "forbidden",
          message: "No tienes permisos para ver este intento",
        });
        return;
      }

      res.json({ data: result });
    } catch {
      res.status(500).json({
        error: "internal_server_error",
        message: "Error interno del servidor",
      });
    }
  },
);

// T324: Evaluation gate status — used by TEAM-02 to gate progression display
evaluationsRouter.get(
  "/courses/:courseId/evaluation-gate",
  validate({ params: courseIdParamsSchema }),
  async (req, res) => {
    try {
      const status = await getEvaluationGateStatus(
        req.auth!.userId,
        req.params.courseId as string,
      );
      res.json({ data: status });
    } catch {
      res.status(500).json({ error: "internal_server_error", message: "Error interno del servidor" });
    }
  },
);

export { evaluationsRouter };
