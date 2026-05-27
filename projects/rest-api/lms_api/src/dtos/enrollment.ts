import { z } from "zod";
import { isoDateTimeSchema, uuidSchema } from "./common";

export const EnrollmentDtoSchema = z
  .object({
    id: uuidSchema,
    user_id: uuidSchema,
    course_id: uuidSchema,
    enrolled_at: isoDateTimeSchema,
    status: z.string().trim().min(1),
  })
  .strict();

export type EnrollmentDto = z.infer<typeof EnrollmentDtoSchema>;