import { z } from "zod";
import {
  isoDateTimeSchema,
  nonEmptyTextSchema,
  uuidSchema,
  withObjectKeyAliases,
} from "./common";

export const ProgressDtoSchema = withObjectKeyAliases({
    id: uuidSchema,
    enrollment_id: uuidSchema,
    lesson_id: uuidSchema,
    completed: z.boolean(),
    completed_at: isoDateTimeSchema.nullable(),
    version: z.number().int().positive(),
  }, {
    enrollmentId: "enrollment_id",
    lessonId: "lesson_id",
    completedAt: "completed_at",
  });

export type ProgressDto = z.infer<typeof ProgressDtoSchema>;

export const ProgressUpdateSchema = z
  .object({
    completed: z.boolean(),
  })
  .strict();

export const LessonProgressStateDtoSchema = withObjectKeyAliases({
    lesson_id: uuidSchema,
    lesson_title: nonEmptyTextSchema,
    lesson_position: z.number().int(),
    progress_id: uuidSchema.nullable(),
    completed: z.boolean(),
    completed_at: isoDateTimeSchema.nullable(),
    version: z.number().int().nonnegative(),
  }, {
    lessonId: "lesson_id",
    lessonTitle: "lesson_title",
    lessonPosition: "lesson_position",
    progressId: "progress_id",
    completedAt: "completed_at",
  });

export const CourseProgressAccessDtoSchema = withObjectKeyAliases({
    status: z.enum(["available", "blocked"]),
    reason: z.enum(["not_enrolled", "prerequisites_incomplete"]).optional(),
    pending_prerequisite_course_ids: z.array(uuidSchema),
  }, {
    pendingPrerequisiteCourseIds: "pending_prerequisite_course_ids",
  });

export const CourseProgressSnapshotDtoSchema = withObjectKeyAliases({
    course_id: uuidSchema,
    enrollment_id: uuidSchema.nullable(),
    access: CourseProgressAccessDtoSchema,
    total_lessons: z.number().int().nonnegative(),
    completed_lessons: z.number().int().nonnegative(),
    completion_rate: z.number().min(0).max(100),
    lessons: z.array(LessonProgressStateDtoSchema),
  }, {
    courseId: "course_id",
    enrollmentId: "enrollment_id",
    totalLessons: "total_lessons",
    completedLessons: "completed_lessons",
    completionRate: "completion_rate",
  });

export type ProgressUpdate = z.infer<typeof ProgressUpdateSchema>;
export type LessonProgressStateDto = z.infer<
  typeof LessonProgressStateDtoSchema
>;
export type CourseProgressAccessDto = z.infer<
  typeof CourseProgressAccessDtoSchema
>;
export type CourseProgressSnapshotDto = z.infer<
  typeof CourseProgressSnapshotDtoSchema
>;
