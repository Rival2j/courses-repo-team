import type { NextFunction, Request, RequestHandler, Response } from "express";
import { z, type ZodTypeAny } from "zod";

type ValidationSchemas = {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
};

type ValidationErrorDetail = {
  location: keyof ValidationSchemas;
  path: string;
  message: string;
};

function collectIssues(location: keyof ValidationSchemas, issues: z.ZodIssue[]): ValidationErrorDetail[] {
  return issues.map((issue) => ({
    location,
    path: issue.path.length > 0 ? issue.path.join(".") : location,
    message: issue.message,
  }));
}

export function validate(schemas: ValidationSchemas): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const details: ValidationErrorDetail[] = [];

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        details.push(...collectIssues("body", result.error.issues));
      } else {
        req.body = result.data;
      }
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        details.push(...collectIssues("query", result.error.issues));
      } else {
        req.query = result.data as Request["query"];
      }
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        details.push(...collectIssues("params", result.error.issues));
      } else {
        req.params = result.data as Request["params"];
      }
    }

    if (details.length > 0) {
      res.status(400).json({
        error: "validation_error",
        details,
      });
      return;
    }

    next();
  };
}