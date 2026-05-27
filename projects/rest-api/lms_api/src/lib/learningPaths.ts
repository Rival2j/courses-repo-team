import { getDatabaseClient } from "./database";
import {
  CourseEnrollmentEligibilityDtoSchema,
  LearningPathCourseDtoSchema,
  LearningPathDetailDtoSchema,
  LearningPathDtoSchema,
} from "../dtos";

type DatabaseRow = Record<string, unknown>;

const database = getDatabaseClient();

function parseLearningPath(row: DatabaseRow) {
  return LearningPathDtoSchema.parse(row);
}

function parseLearningPathCourse(row: DatabaseRow) {
  return LearningPathCourseDtoSchema.parse(row);
}

export async function listLearningPaths() {
  const rows = await database`
    select
      id,
      slug,
      title,
      description,
      is_active,
      created_by,
      to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
    from cursos.learning_paths
    order by created_at desc, title asc
  `;

  return rows.map((row: DatabaseRow) => parseLearningPath(row));
}

export async function getLearningPathById(learningPathId: string) {
  const learningPathRows = await database`
    select
      id,
      slug,
      title,
      description,
      is_active,
      created_by,
      to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
    from cursos.learning_paths
    where id = ${learningPathId}
    limit 1
  `;

  if (learningPathRows.length === 0) {
    return null;
  }

  const courseRows = await database`
    select
      id,
      learning_path_id,
      course_id,
      position,
      is_required
    from cursos.learning_path_courses
    where learning_path_id = ${learningPathId}
    order by position asc, id asc
  `;

  return LearningPathDetailDtoSchema.parse({
    learning_path: parseLearningPath(learningPathRows[0] as DatabaseRow),
    courses: courseRows.map((row: DatabaseRow) => parseLearningPathCourse(row)),
  });
}

export async function createLearningPath(
  input: {
    slug: string;
    title: string;
    description?: string | null;
    isActive?: boolean;
  },
  createdBy: string,
) {
  const rows = await database`
    insert into cursos.learning_paths (
      slug,
      title,
      description,
      is_active,
      created_by
    ) values (
      ${input.slug},
      ${input.title},
      ${input.description ?? null},
      ${input.isActive ?? true},
      ${createdBy}
    )
    returning
      id,
      slug,
      title,
      description,
      is_active,
      created_by,
      to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
  `;

  return parseLearningPath(rows[0] as DatabaseRow);
}

export async function updateLearningPath(
  learningPathId: string,
  input: {
    slug?: string;
    title?: string;
    description?: string | null;
    isActive?: boolean;
  },
) {
  const rows = await database`
    update cursos.learning_paths
    set
      slug = coalesce(${input.slug ?? null}, slug),
      title = coalesce(${input.title ?? null}, title),
      description = coalesce(${input.description ?? null}, description),
      is_active = coalesce(${input.isActive ?? null}, is_active)
    where id = ${learningPathId}
    returning
      id,
      slug,
      title,
      description,
      is_active,
      created_by,
      to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
  `;

  return rows.length === 0 ? null : parseLearningPath(rows[0] as DatabaseRow);
}

export async function deleteLearningPath(learningPathId: string) {
  const rows = await database`
    delete from cursos.learning_paths
    where id = ${learningPathId}
    returning id
  `;

  return rows.length > 0;
}

export async function addCourseToLearningPath(
  learningPathId: string,
  courseId: string,
  input: { position?: number; isRequired?: boolean },
) {
  const rows = await database`
    insert into cursos.learning_path_courses (
      learning_path_id,
      course_id,
      position,
      is_required
    ) values (
      ${learningPathId},
      ${courseId},
      ${input.position ?? 0},
      ${input.isRequired ?? true}
    )
    returning
      id,
      learning_path_id,
      course_id,
      position,
      is_required
  `;

  return parseLearningPathCourse(rows[0] as DatabaseRow);
}

export async function updateLearningPathCourse(
  learningPathId: string,
  courseId: string,
  input: { position?: number; isRequired?: boolean },
) {
  const rows = await database`
    update cursos.learning_path_courses
    set
      position = coalesce(${input.position ?? null}, position),
      is_required = coalesce(${input.isRequired ?? null}, is_required)
    where learning_path_id = ${learningPathId}
      and course_id = ${courseId}
    returning
      id,
      learning_path_id,
      course_id,
      position,
      is_required
  `;

  return rows.length === 0 ? null : parseLearningPathCourse(rows[0] as DatabaseRow);
}

export async function removeCourseFromLearningPath(
  learningPathId: string,
  courseId: string,
) {
  const rows = await database`
    delete from cursos.learning_path_courses
    where learning_path_id = ${learningPathId}
      and course_id = ${courseId}
    returning id
  `;

  return rows.length > 0;
}

export async function listCoursesForLearningPath(learningPathId: string) {
  const rows = await database`
    select
      id,
      learning_path_id,
      course_id,
      position,
      is_required
    from cursos.learning_path_courses
    where learning_path_id = ${learningPathId}
    order by position asc, id asc
  `;

  return rows.map((row: DatabaseRow) => parseLearningPathCourse(row));
}

export async function resolveCanEnroll(userId: string, courseId: string) {
  const rows = await database`
    select
      user_id,
      course_id,
      can_enroll,
      reason,
      enrollment_id,
      pending_prerequisite_course_ids
    from cursos.can_enroll(${userId}, ${courseId})
    limit 1
  `;

  return CourseEnrollmentEligibilityDtoSchema.parse(rows[0]);
}