import { z } from "zod";
import { isoDateTimeSchema, nonEmptyTextSchema, uuidSchema } from "./common";

export const LearningPathDtoSchema = z
  .object({
    id: uuidSchema,
    slug: nonEmptyTextSchema,
    title: nonEmptyTextSchema,
    description: z.string().nullable(),
    is_active: z.boolean(),
    created_by: uuidSchema.nullable(),
    created_at: isoDateTimeSchema,
  })
  .strict();

export const LearningPathCourseDtoSchema = z
  .object({
    id: uuidSchema,
    learning_path_id: uuidSchema,
    course_id: uuidSchema,
    position: z.number().int(),
    is_required: z.boolean(),
  })
  .strict();

export const LearningPathDetailDtoSchema = z
  .object({
    learning_path: LearningPathDtoSchema,
    courses: z.array(LearningPathCourseDtoSchema),
  })
  .strict();

export const CourseEnrollmentEligibilityDtoSchema = z
  .object({
    user_id: uuidSchema,
    course_id: uuidSchema,
    can_enroll: z.boolean(),
    reason: z.enum([
      "eligible",
      "already_enrolled",
      "course_not_found",
      "prerequisites_incomplete",
    ]),
    enrollment_id: uuidSchema.nullable(),
    pending_prerequisite_course_ids: z.array(uuidSchema),
  })
  .strict();

export type LearningPathDto = z.infer<typeof LearningPathDtoSchema>;
export type LearningPathCourseDto = z.infer<
  typeof LearningPathCourseDtoSchema
>;
export type LearningPathDetailDto = z.infer<
  typeof LearningPathDetailDtoSchema
>;
export type CourseEnrollmentEligibilityDto = z.infer<
  typeof CourseEnrollmentEligibilityDtoSchema
>;