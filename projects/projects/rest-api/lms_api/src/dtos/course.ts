import { z } from "zod";
import {
  isoDateTimeSchema,
  nonEmptyTextSchema,
  uuidSchema,
  withObjectKeyAliases,
} from "./common";

export const CourseDtoSchema = withObjectKeyAliases({
    id: uuidSchema,
    slug: nonEmptyTextSchema,
    title: nonEmptyTextSchema,
    description: z.string().nullable(),
    created_by: uuidSchema.nullable(),
    created_at: isoDateTimeSchema,
    rating_average: z.preprocess(
      (v) => (v === null || v === undefined ? null : Number(v)),
      z.number().min(1).max(5).nullable(),
    ),
    rating_count: z.preprocess((v) => Number(v ?? 0), z.number().int().min(0)),
  }, {
    createdBy: "created_by",
    createdAt: "created_at",
    ratingAverage: "rating_average",
    ratingCount: "rating_count",
  });

export type CourseDto = z.infer<typeof CourseDtoSchema>;
