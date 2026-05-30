import { getDatabaseClient } from "./database";
import { CourseReviewDtoSchema } from "../dtos/course-review";

type DatabaseRow = Record<string, unknown>;

const database = getDatabaseClient();

export async function createCourseReview(input: {
  userId: string;
  courseId: string;
  ratingStars: number;
  comment?: string | null;
}) {
  // Service_role connection bypasses RLS, so enforce the completed-enrollment
  // business rule here before inserting.
  const enrollment = await database`
    select id from cursos.enrollments
    where user_id  = ${input.userId}
      and course_id = ${input.courseId}
      and status   = 'completed'
    limit 1
  `;

  if (enrollment.length === 0) {
    throw Object.assign(
      new Error("Solo los alumnos con el curso completado pueden dejar una reseña"),
      { code: "ENROLLMENT_NOT_COMPLETED" },
    );
  }

  const rows = await database`
    insert into cursos.course_reviews (user_id, course_id, rating_stars, comment)
    values (
      ${input.userId},
      ${input.courseId},
      ${input.ratingStars},
      ${input.comment ?? null}
    )
    returning
      user_id,
      course_id,
      rating_stars,
      comment,
      to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
  `;

  return CourseReviewDtoSchema.parse(rows[0] as DatabaseRow);
}

export async function getCourseReviews(courseId: string) {
  const rows = await database`
    select
      user_id,
      course_id,
      rating_stars,
      comment,
      to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
    from cursos.course_reviews
    where course_id = ${courseId}
    order by created_at desc
  `;

  return rows.map((row) => CourseReviewDtoSchema.parse(row as DatabaseRow));
}
