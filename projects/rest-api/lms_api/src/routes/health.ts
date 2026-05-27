import { Router } from "express";

function resolveAppVersion(): string {
  return process.env.npm_package_version ?? require("../../package.json").version ?? "0.0.0";
}

export const healthRouter = Router();

healthRouter.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: resolveAppVersion(),
  });
});