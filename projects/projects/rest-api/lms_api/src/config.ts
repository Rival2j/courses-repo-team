import * as dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z
  .object({
    SUPABASE_URL: z.string().url(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
    SUPABASE_CONNECTION_STRING: z.string().min(1),
    JWT_SECRET: z.string().min(1),
    SENTRY_DSN: z.string().url().optional(),
    PORT: z.coerce.number().int().positive().default(3000),
  })
  .passthrough();

export type AppConfig = z.infer<typeof envSchema>;

let cachedConfig: AppConfig | null = null;

function formatValidationIssues(issues: z.ZodIssue[]): string {
  return issues
    .map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join(".") : "env";
      return `${path}: ${issue.message}`;
    })
    .join("; ");
}

export function loadConfig(): AppConfig {
  if (cachedConfig) {
    return cachedConfig;
  }

  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    throw new Error(`Invalid environment configuration: ${formatValidationIssues(parsed.error.issues)}`);
  }

  cachedConfig = parsed.data;
  return cachedConfig;
}