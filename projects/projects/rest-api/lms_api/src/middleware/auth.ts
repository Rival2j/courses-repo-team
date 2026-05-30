import type { NextFunction, Request, Response } from "express";
import type { JwtClaims } from "../lib/jwt";
import { verifyJwt } from "../lib/jwt";
import { loadConfig } from "../config";
import { getDatabaseClient } from "../lib/database";

export type AppRole =
  | "super_admin"
  | "admin"
  | "instructor"
  | "moderador"
  | "alumno";

export type AuthContext = {
  userId: string;
  role: AppRole;
  claims: JwtClaims;
};

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
    }
  }
}

const privilegedRoles: AppRole[] = ["super_admin", "admin", "instructor"];

function normalizeRole(value: unknown): AppRole | null {
  if (value === "student") {
    return "alumno";
  }

  if (
    value === "super_admin" ||
    value === "admin" ||
    value === "instructor" ||
    value === "moderador" ||
    value === "alumno"
  ) {
    return value;
  }

  return null;
}

function resolveRole(claims: JwtClaims): AppRole {
  const claimRole =
    normalizeRole(claims.app_metadata?.role) ??
    normalizeRole(claims.user_metadata?.role) ??
    normalizeRole(claims.role);

  if (claimRole) {
    return claimRole;
  }

  if (claims.role === "authenticated") {
    return "alumno";
  }

  return "alumno";
}

function getBearerToken(req: Request): string {
  const authorization = req.header("authorization");

  if (!authorization) {
    throw new Error("Missing authorization token");
  }

  const [scheme, token] = authorization.split(" ");
  if (scheme !== "Bearer" || !token) {
    throw new Error("Invalid authorization token");
  }

  return token;
}

export async function authenticateRequest(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const token = getBearerToken(req);
    const config = loadConfig();
    const claims = await verifyJwt(token, config.JWT_SECRET);
    const userId =
      typeof claims.sub === "string" && claims.sub.length > 0
        ? claims.sub
        : null;

    if (!userId) {
      res.status(401).json({
        error: "unauthorized",
        message: "Token invalido",
      });
      return;
    }

    // Resolve role from token claims, then fallback to DB by email when missing
    let role = resolveRole(claims);
    try {
      if ((role === "alumno" || role === null) && typeof claims.email === "string") {
        const db = getDatabaseClient();
        const rows = await db`
          select role from cursos.profiles where email = ${claims.email} limit 1
        `;
        if (rows && rows.length > 0) {
          const dbRole = normalizeRole(rows[0].role);
          if (dbRole) {
            role = dbRole;
          }
        }
      }
    } catch (err) {
      // If DB lookup fails, continue with resolved role from token
      // Keep silent to avoid leaking internals; middleware will enforce role checks.
    }

    req.auth = {
      userId,
      role: role ?? "alumno",
      claims,
    };

    next();
  } catch (err) {
    res.status(401).json({
      error: "unauthorized",
      message: "Acceso no autorizado",
    });
  }
}

export function requireRole(
  allowedRoles: AppRole[],
): (req: Request, res: Response, next: NextFunction) => void {
  return (req, res, next) => {
    if (!req.auth) {
      res.status(401).json({
        error: "unauthorized",
        message: "Acceso no autorizado",
      });
      return;
    }

    if (
      !allowedRoles.includes(req.auth.role) &&
      !allowedRoles.some(
        (role) => privilegedRoles.includes(role) && req.auth?.role === role,
      )
    ) {
      res.status(403).json({
        error: "forbidden",
        message: "No tienes permisos para esta operacion",
      });
      return;
    }

    next();
  };
}
