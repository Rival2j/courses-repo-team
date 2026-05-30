const express = require("express") as typeof import("express");
const pino = require("pino") as typeof import("pino");
const pinoHttp: any = require("pino-http");

import type { NextFunction } from "express";
import type { IncomingMessage, ServerResponse } from "http";
import { loadConfig } from "./config";
import { captureException, initObservability } from "./lib/observability";
import { healthRouter } from "./routes/health";
import { catalogRouter } from "./routes/catalog";
import { pwaRouter } from "./routes/pwaAdapters";
import { usersRouter } from "./routes/users";
import { resourcesRouter } from "./routes/resources";
import { progressRouter } from "./routes/progress";
import { evaluationsRouter } from "./routes/evaluations";
import { gamificationRouter } from "./routes/gamification";
import { certificatesRouter, certificateVerifyRouter } from "./routes/certificates";
import { adminRouter } from "./routes/administrative";
import { notificationsRouter } from "./routes/notifications";
import { enrollmentsRouter } from "./routes/enrollments";

export const app = express();
const config = loadConfig();

const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  base: {
    service: "lms-api",
  },
});

initObservability({
  sentryDsn: config.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: process.env.npm_package_version ?? "0.0.0",
  serviceName: "lms-api",
});

app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use((req, res, next) => {
  const allowedOrigins = (
    process.env.CORS_ALLOWED_ORIGINS ??
    "http://localhost:4173,http://127.0.0.1:4173,http://localhost:5173,http://127.0.0.1:5173"
  )
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  const origin = req.header("origin");

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Authorization, Content-Type, If-Match, X-Request-Id",
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );

  if (req.method === "OPTIONS") {
    res.status(204).send();
    return;
  }

  next();
});
app.use(
  pinoHttp({
    logger,
    genReqId: (req: IncomingMessage) => {
      const headerRequestId = req.headers["x-request-id"];
      if (Array.isArray(headerRequestId)) {
        return headerRequestId[0];
      }

      return headerRequestId ?? undefined;
    },
    customLogLevel: (_req: IncomingMessage, res: ServerResponse, error: Error | null) => {
      if (error || res.statusCode >= 500) {
        return "error";
      }

      if (res.statusCode >= 400) {
        return "warn";
      }

      return "info";
    },
  }),
);

app.use(healthRouter);
app.use(certificateVerifyRouter);
app.use(catalogRouter);
app.use(pwaRouter);
app.use(usersRouter);
app.use(resourcesRouter);
app.use(progressRouter);
app.use(evaluationsRouter);
app.use(gamificationRouter);
app.use(certificatesRouter);
app.use("/administrative", adminRouter);
app.use(notificationsRouter);
app.use(enrollmentsRouter);

app.use((_req, res) => {
  res.status(404).json({
    error: "not_found",
    message: "Ruta no encontrada",
  });
});

app.use(
  (
    error: unknown,
    req: typeof app.request,
    res: typeof app.response,
    _next: NextFunction,
  ) => {
    logger.error({ error }, "Unhandled request error");
    const requestWithId = req as typeof req & { id?: string | number };
    captureException(error, {
      requestId: requestWithId.id,
      method: req.method,
      url: req.originalUrl,
      userId:
        req.header("x-user-id") ??
        req.header("x-supabase-user-id") ??
        undefined,
    });

    if (res.headersSent) {
      return;
    }

    res.status(500).json({
      error: "internal_server_error",
      message: "Error interno del servidor",
    });
  },
);

async function startServer(): Promise<void> {
  app.listen(config.PORT, () => {
    logger.info({ port: config.PORT }, "Backend REST started");
  });
}

if (require.main === module) {
  startServer().catch((error: unknown) => {
    logger.fatal({ error }, "Unable to start backend REST");
    process.exit(1);
  });
}

export { startServer };
