import { z } from "zod";
import { isoDateTimeSchema, nonEmptyTextSchema, uuidSchema } from "./common";

export const ResourceProviderSchema = z.enum([
  "youtube",
  "vimeo",
  "pdf",
  "image",
  "audio",
  "article",
  "unknown",
]);

export const ResourceDtoSchema = z
  .object({
    id: uuidSchema,
    lesson_id: uuidSchema,
    url: z.string().url(),
    provider: ResourceProviderSchema,
    title: nonEmptyTextSchema.optional().nullable(),
    description: z.string().trim().min(1).optional().nullable(),
    mime_type: z.string().trim().optional().nullable(),
    thumbnail_url: z.string().url().optional().nullable(),
    duration_seconds: z.number().int().nonnegative().optional().nullable(),
    metadata: z.record(z.unknown()),
    created_by: uuidSchema.optional().nullable(),
    created_at: isoDateTimeSchema,
  })
  .strict();

export type ResourceDto = z.infer<typeof ResourceDtoSchema>;

export const ResourceCreateSchema = z
  .object({
    url: z.string().url(),
    title: nonEmptyTextSchema.optional().nullable(),
    description: z.string().trim().min(1).optional().nullable(),
    mime_type: z.string().trim().optional().nullable(),
    thumbnail_url: z.string().url().optional().nullable(),
    duration_seconds: z.number().int().nonnegative().optional().nullable(),
    metadata: z.record(z.unknown()).optional(),
  })
  .strict();

export const ResourceUpdateSchema = z
  .object({
    url: z.string().url().optional(),
    title: nonEmptyTextSchema.optional().nullable(),
    description: z.string().trim().min(1).optional().nullable(),
    mime_type: z.string().trim().optional().nullable(),
    thumbnail_url: z.string().url().optional().nullable(),
    duration_seconds: z.number().int().nonnegative().optional().nullable(),
    metadata: z.record(z.unknown()).optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Debe incluir al menos un campo para actualizar",
  });
