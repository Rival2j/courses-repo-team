import { z } from "zod";
import { nonEmptyTextSchema, uuidSchema } from "./common";

export const ModuleDtoSchema = z
  .object({
    id: uuidSchema,
    course_id: uuidSchema,
    title: nonEmptyTextSchema,
    position: z.number().int(),
  })
  .strict();

export type ModuleDto = z.infer<typeof ModuleDtoSchema>;