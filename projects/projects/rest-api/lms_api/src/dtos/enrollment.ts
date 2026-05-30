import { z } from "zod";
import {
  isoDateTimeSchema,
  uuidSchema,
  withObjectKeyAliases,
} from "./common";

export const enrollmentStatusValues = ["active", "cancelled", "completed"] as const;
export type EnrollmentStatus = (typeof enrollmentStatusValues)[number];

export const EnrollmentDtoSchema = withObjectKeyAliases({
    id: uuidSchema,
    user_id: uuidSchema,
    course_id: uuidSchema,
    status: z.enum(enrollmentStatusValues),
    enrolled_at: isoDateTimeSchema,
    cancelled_at: isoDateTimeSchema.nullable().optional(),
    completed_at: isoDateTimeSchema.nullable().optional(),
    reactivated_at: isoDateTimeSchema.nullable().optional(),
  }, {
    userId: "user_id",
    courseId: "course_id",
    enrolledAt: "enrolled_at",
    cancelledAt: "cancelled_at",
    completedAt: "completed_at",
    reactivatedAt: "reactivated_at",
  });

export type EnrollmentDto = z.infer<typeof EnrollmentDtoSchema>;

export const EnrollmentCreateSchema = withObjectKeyAliases({
  course_id: uuidSchema,
}, {
  courseId: "course_id",
});

export const EnrollmentCancelSchema = z.object({}).strict();

export const EnrollmentReactivateSchema = z.object({}).strict();
