import { z } from "zod";

export const CertificateTemplateDtoSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  type: z.enum(["certificate", "diploma"]),
  version: z.number().int(),
  title: z.string(),
  layout: z.unknown(),
  variables: z.unknown(),
  is_current: z.boolean(),
  is_active: z.boolean(),
  created_by: z.string().uuid().nullable(),
  created_at: z.string(),
});

export const CertificateTemplateCreateSchema = z.object({
  slug: z.string().trim().min(1).regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  type: z.enum(["certificate", "diploma"]).optional(),
  title: z.string().trim().min(1),
  layout: z.record(z.unknown()),
  variables: z.array(z.string()).optional(),
});

export const CertificateTemplateVersionSchema = z.object({
  title: z.string().trim().min(1).optional(),
  layout: z.record(z.unknown()),
  variables: z.array(z.string()).optional(),
});

export const IssuedCertificateDtoSchema = z.object({
  id: z.string().uuid(),
  template_id: z.string().uuid(),
  user_id: z.string().uuid(),
  course_id: z.string().uuid().nullable(),
  verify_code: z.string(),
  issued_at: z.string(),
  payload: z.unknown(),
});

export const IssueCertificateRequestSchema = z.object({
  user_id: z.string().uuid(),
  template_slug: z.string().min(1),
  course_id: z.string().uuid().nullable().optional(),
  payload: z.record(z.unknown()).optional(),
});
