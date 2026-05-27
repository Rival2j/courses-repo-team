const express = require("express") as typeof import("express");
const pino = require("pino") as typeof import("pino");
const pinoHttp: any = require("pino-http");

import type { NextFunction } from "express";
import { loadConfig } from "./config";
import { captureException, initObservability } from "./lib/observability";
import { healthRouter } from "./routes/health";
import { catalogRouter } from "./routes/catalog";
import { resourcesRouter } from "./routes/resources";
import { progressRouter } from "./routes/progress";

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
app.use(
  pinoHttp({
    logger,
    genReqId: (req) => {
      const headerRequestId = req.headers["x-request-id"];
      if (Array.isArray(headerRequestId)) {
        return headerRequestId[0];
      }

      return headerRequestId ?? undefined;
    },
    customLogLevel: (_req, res, error) => {
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
app.use(catalogRouter);
app.use(resourcesRouter);
app.use(progressRouter);

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
