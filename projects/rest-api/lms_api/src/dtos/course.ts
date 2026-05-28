import { z } from "zod";
import { isoDateTimeSchema, nonEmptyTextSchema, uuidSchema } from "./common";

export const CourseDtoSchema = z
  .object({
    id: uuidSchema,
    slug: nonEmptyTextSchema,
    title: nonEmptyTextSchema,
    description: z.string().nullable(),
    created_by: uuidSchema.nullable(),
    created_at: isoDateTimeSchema,
  })
  .strict();

export type CourseDto = z.infer<typeof CourseDtoSchema>;