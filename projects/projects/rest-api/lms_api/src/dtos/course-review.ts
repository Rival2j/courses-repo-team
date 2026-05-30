import { z } from "zod";
import { isoDateTimeSchema, uuidSchema } from "./common";

export const CourseReviewDtoSchema = z
  .object({
    user_id: uuidSchema,
    course_id: uuidSchema,
    rating_stars: z.number().int().min(1).max(5),
    comment: z.string().trim().max(1000).nullable(),
    created_at: isoDateTimeSchema,
  })
  .strict();

export type CourseReviewDto = z.infer<typeof CourseReviewDtoSchema>;
