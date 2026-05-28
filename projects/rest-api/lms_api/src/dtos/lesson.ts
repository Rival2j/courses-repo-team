import { z } from "zod";
import { nonEmptyTextSchema, uuidSchema } from "./common";

export const LessonDtoSchema = z
  .object({
    id: uuidSchema,
    module_id: uuidSchema,
    title: nonEmptyTextSchema,
    content: z.unknown().nullable(),
    position: z.number().int(),
  })
  .strict();

export type LessonDto = z.infer<typeof LessonDtoSchema>;