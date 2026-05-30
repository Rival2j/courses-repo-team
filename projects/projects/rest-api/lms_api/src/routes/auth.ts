import { Router, type Request, type Response } from "express";
import { z } from "zod";
import { loadConfig } from "../config";
import { bootstrapUserProfile } from "../lib/userProfiles";
import { validate } from "../middleware/validate";

const authRouter = Router();
const config = loadConfig();

const AuthRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  password_confirmation: z.string().optional(),
});

const AuthLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const AuthLogoutSchema = z.object({
  refresh_token: z.string().min(1).optional(),
});

const AuthPasswordResetSchema = z.object({
  email: z.string().email(),
});

type SupabaseAuthResult = Record<string, unknown>;

type SupabaseAuthResponse = {
  status: number;
  body: SupabaseAuthResult;
};

async function callSupabaseAuth(
  path: string,
  init: {
    method: string;
    body?: string;
    headers?: Record<string, string>;
  },
  authorizationToken?: string,
): Promise<SupabaseAuthResponse> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    apikey: config.SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${authorizationToken ?? config.SUPABASE_SERVICE_ROLE_KEY}`,
    ...init.headers,
  };

  const response = await fetch(`${config.SUPABASE_URL}${path}`, {
    method: init.method,
    headers,
    body: init.body,
  });

  const body = await response
    .json()
    .catch(() => ({})) as SupabaseAuthResult;

  return {
    status: response.status,
    body,
  };
}

function getBearerToken(req: Request): string | undefined {
  const authorization = req.header("authorization");
  if (!authorization) {
    return undefined;
  }

  const [scheme, token] = authorization.split(" ");
  if (scheme !== "Bearer" || !token) {
    return undefined;
  }

  return token;
}

authRouter.post(
  "/auth/register",
  validate({ body: AuthRegisterSchema }),
  async (req, res) => {
    const { email, password, password_confirmation } = req.body as z.infer<
      typeof AuthRegisterSchema
    >;

    if (
      typeof password_confirmation === "string" &&
      password !== password_confirmation
    ) {
      res.status(400).json({
        error: "validation_error",
        message: "Las contraseñas no coinciden",
      });
      return;
    }

    try {
      const result = await callSupabaseAuth("/auth/v1/signup", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (result.status >= 400) {
        res.status(result.status).json(result.body);
        return;
      }

      const user = result.body.user as { id?: string; email?: string } | undefined;
      if (user?.id && typeof user.email === "string") {
        await bootstrapUserProfile({
          userId: user.id,
          email: user.email,
        });
      }

      res.status(result.status).json(result.body);
    } catch (error) {
      res.status(500).json({
        error: "internal_server_error",
        message: "Error al registrar el usuario",
      });
    }
  },
);

authRouter.post(
  "/auth/login",
  validate({ body: AuthLoginSchema }),
  async (req, res) => {
    const { email, password } = req.body as z.infer<typeof AuthLoginSchema>;

    try {
      const result = await callSupabaseAuth("/auth/v1/token?grant_type=password", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      res.status(result.status).json(result.body);
    } catch (error) {
      res.status(500).json({
        error: "internal_server_error",
        message: "Error al iniciar sesión",
      });
    }
  },
);

authRouter.post(
  "/auth/logout",
  validate({ body: AuthLogoutSchema }),
  async (req, res) => {
    const token = getBearerToken(req) ?? req.body.refresh_token;

    if (!token) {
      res.status(400).json({
        error: "invalid_request",
        message: "Token de sesión requerido para cerrar sesión",
      });
      return;
    }

    try {
      const result = await callSupabaseAuth(
        "/auth/v1/logout",
        {
          method: "POST",
          body: JSON.stringify({}),
        },
        token,
      );

      res.status(result.status).json(result.body);
    } catch (error) {
      res.status(500).json({
        error: "internal_server_error",
        message: "Error al cerrar sesión",
      });
    }
  },
);

authRouter.post(
  "/auth/password-reset",
  validate({ body: AuthPasswordResetSchema }),
  async (req, res) => {
    const { email } = req.body as z.infer<typeof AuthPasswordResetSchema>;

    try {
      const result = await callSupabaseAuth("/auth/v1/recover", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      res.status(result.status).json(result.body);
    } catch (error) {
      res.status(500).json({
        error: "internal_server_error",
        message: "Error al solicitar restablecimiento de contraseña",
      });
    }
  },
);

export { authRouter };
