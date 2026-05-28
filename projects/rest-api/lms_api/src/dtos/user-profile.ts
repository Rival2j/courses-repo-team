import { z } from "zod";
import { isoDateTimeSchema, nonEmptyTextSchema, uuidSchema } from "./common";

export const UserProfileDtoSchema = z
  .object({
    id: uuidSchema,
    display_name: nonEmptyTextSchema,
    email: z.string().email(),
    role: z.string().trim().min(1),
    created_at: isoDateTimeSchema,
  })
  .strict();

export type UserProfileDto = z.infer<typeof UserProfileDtoSchema>;