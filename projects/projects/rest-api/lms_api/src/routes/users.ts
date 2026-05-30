import { Router, type Response } from "express";
import { z } from "zod";
import {
  UserAuthContextSchema,
  UserProfileBootstrapSchema,
  UserProfileDtoSchema,
  UserProfileEnvelopeSchema,
  UserProfileUpdateSchema,
  UserProvisionSchema,
  profileRoleValues,
} from "../dtos";
import { authenticateRequest, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  bootstrapUserProfile,
  getUserProfileById,
  listUserProfileEmails,
  listUserProfiles,
  provisionUserRole,
  updateUserProfile,
} from "../lib/userProfiles";

const usersRouter = Router();

const userIdParamsSchema = z.object({ userId: z.string().uuid() });
const userEmailsQuerySchema = z.object({
  role: z
    .preprocess(
      (value) => (value === "student" ? "alumno" : value),
      z.enum(profileRoleValues).optional(),
    )
    .optional(),
  format: z.enum(["json", "csv"]).optional(),
});

function respondWithNotFound(res: Response, message: string): void {
  res.status(404).json({
    error: "not_found",
    message,
  });
}

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

function respondWithProvisioningError(res: Response, error: unknown): boolean {
  const databaseError = error as { code?: string; message?: string } | null;
  const message = databaseError?.message ?? "";

  if (message.includes("unauthenticated")) {
    res.status(401).json({
      error: "unauthorized",
      message: "Acceso no autorizado",
    });
    return true;
  }

  if (message.includes("permission denied")) {
    res.status(403).json({
      error: "forbidden",
      message: "No tienes permisos para realizar esta operacion",
    });
    return true;
  }

  if (message.includes("invalid role")) {
    res.status(400).json({
      error: "invalid_role",
      message: "El rol solicitado no es valido",
    });
    return true;
  }

  if (databaseError?.code === "23505") {
    res.status(409).json({
      error: "conflict",
      message: "Ya existe un registro con esos valores",
    });
    return true;
  }

  if (databaseError?.code === "23503") {
    res.status(400).json({
      error: "invalid_reference",
      message: "La referencia relacionada no existe",
    });
    return true;
  }

  return false;
}

function getClaimedEmail(claims: Record<string, unknown>): string | null {
  return typeof claims.email === "string" && claims.email.trim().length > 0
    ? claims.email.trim()
    : null;
}

function buildAuthEnvelope(
  req: { auth?: { userId: string; role: string } },
  email: string,
) {
  return UserAuthContextSchema.parse({
    user_id: req.auth!.userId,
    email,
    role: req.auth!.role,
  });
}

function getParamValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function getQueryStringValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0
    ? value
    : undefined;
}

function buildCsv(
  rows: Array<{
    id: string;
    display_name: string;
    email: string;
    role: string;
  }>,
): string {
  const escapeCell = (value: string) => `"${value.replace(/"/g, '""')}"`;
  const header = ["id", "display_name", "email", "role"];
  const lines = [header.join(",")];

  for (const row of rows) {
    lines.push(
      [row.id, row.display_name, row.email, row.role]
        .map((cell) => escapeCell(cell))
        .join(","),
    );
  }

  return lines.join("\n");
}

usersRouter.use(authenticateRequest);

usersRouter.get("/users/me", async (req, res) => {
  try {
    const email = getClaimedEmail(req.auth!.claims);
    if (!email) {
      respondWithNotFound(
        res,
        "No se pudo resolver el correo del usuario autenticado",
      );
      return;
    }

    const profile = await getUserProfileById(req.auth!.userId);
    if (!profile) {
      respondWithNotFound(res, "Perfil de usuario no encontrado");
      return;
    }

    res.json({
      data: UserProfileEnvelopeSchema.parse({
        auth: buildAuthEnvelope(req, email),
        profile,
      }),
    });
  } catch (error) {
    respondWithDatabaseError(res, error);
  }
});

usersRouter.post(
  "/users/bootstrap",
  validate({ body: UserProfileBootstrapSchema }),
  async (req, res) => {
    try {
      const email = getClaimedEmail(req.auth!.claims);
      if (!email) {
        respondWithNotFound(
          res,
          "No se pudo resolver el correo del usuario autenticado",
        );
        return;
      }

      const profile = await bootstrapUserProfile({
        userId: req.auth!.userId,
        email,
        displayName: req.body.display_name,
        avatarUrl: req.body.avatar_url,
        bio: req.body.bio,
      });

      res.status(201).json({
        data: UserProfileEnvelopeSchema.parse({
          auth: buildAuthEnvelope(req, email),
          profile,
        }),
      });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

usersRouter.get(
  "/users/emails",
  requireRole(["admin", "super_admin"]),
  validate({ query: userEmailsQuerySchema }),
  async (req, res) => {
    try {
      const rows = await listUserProfileEmails({
        role: getQueryStringValue(req.query.role),
      });

      if (req.query.format === "csv") {
        res.setHeader("content-type", "text/csv; charset=utf-8");
        res.send(buildCsv(rows));
        return;
      }

      res.json({
        data: rows,
      });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

usersRouter.get(
  "/users",
  requireRole(["admin", "super_admin"]),
  validate({ query: userEmailsQuerySchema }),
  async (req, res) => {
    try {
      const rows = await listUserProfiles({
        role: getQueryStringValue(req.query.role),
      });
      res.json({
        data: rows,
      });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

usersRouter.post(
  "/users/:userId/provision",
  requireRole(["admin", "super_admin"]),
  validate({ params: userIdParamsSchema, body: UserProvisionSchema }),
  async (req, res) => {
    try {
      const result = await provisionUserRole({
        actorUserId: req.auth!.userId,
        userId: getParamValue(req.params.userId),
        email: req.body.email,
        displayName: req.body.display_name,
        role: req.body.role,
      });

      res.status(201).json({
        data: {
          profile: UserProfileDtoSchema.parse(result.profile),
          audit_event: result.event,
        },
      });
    } catch (error) {
      if (respondWithProvisioningError(res, error)) {
        return;
      }

      respondWithDatabaseError(res, error);
    }
  },
);

usersRouter.get(
  "/users/:userId",
  requireRole(["admin", "super_admin"]),
  validate({ params: userIdParamsSchema }),
  async (req, res) => {
    try {
      const profile = await getUserProfileById(
        getParamValue(req.params.userId),
      );

      if (!profile) {
        respondWithNotFound(res, "Perfil de usuario no encontrado");
        return;
      }

      res.json({ data: profile });
    } catch (error) {
      respondWithDatabaseError(res, error);
    }
  },
);

usersRouter.patch(
  "/users/:userId",
  requireRole(["admin", "super_admin"]),
  validate({ params: userIdParamsSchema, body: UserProfileUpdateSchema }),
  async (req, res) => {
    try {
      const profile = await updateUserProfile(
        getParamValue(req.params.userId),
        {
          displayName: req.body.display_name,
          email: req.body.email,
          avatarUrl: req.body.avatar_url,
          bio: req.body.bio,
        },
      );

      if (!profile) {
        respondWithNotFound(res, "Perfil de usuario no encontrado");
        return;
      }

      res.json({ data: profile });
    } catch (error) {
      // T907: surface Admin API errors (e.g. email already in use) with the
      // appropriate HTTP status instead of mapping them to a 500.
      const emailError = error as {
        code?: string;
        status?: number;
        message?: string;
      } | null;
      if (emailError?.code === "EMAIL_UPDATE_FAILED") {
        const httpStatus = emailError.status === 422 ? 422 : 400;
        res.status(httpStatus).json({
          error: "email_update_failed",
          message:
            emailError.message ?? "No se pudo actualizar el correo electrónico",
        });
        return;
      }
      respondWithDatabaseError(res, error);
    }
  },
);

usersRouter.put(
  "/users/:userId",
  requireRole(["admin", "super_admin"]),
  validate({ params: userIdParamsSchema, body: UserProfileUpdateSchema }),
  async (req, res) => {
    try {
      const profile = await updateUserProfile(
        getParamValue(req.params.userId),
        {
          displayName: req.body.display_name,
          email: req.body.email,
          avatarUrl: req.body.avatar_url,
          bio: req.body.bio,
        },
      );

      if (!profile) {
        respondWithNotFound(res, "Perfil de usuario no encontrado");
        return;
      }

      res.json({ data: profile });
    } catch (error) {
      // T907: surface Admin API errors (e.g. email already in use) with the
      // appropriate HTTP status instead of mapping them to a 500.
      const emailError = error as {
        code?: string;
        status?: number;
        message?: string;
      } | null;
      if (emailError?.code === "EMAIL_UPDATE_FAILED") {
        const httpStatus = emailError.status === 422 ? 422 : 400;
        res.status(httpStatus).json({
          error: "email_update_failed",
          message:
            emailError.message ?? "No se pudo actualizar el correo electrónico",
        });
        return;
      }
      respondWithDatabaseError(res, error);
    }
  },
);

export { usersRouter };
