import { getDatabaseClient } from "./database";
import {
  CourseProgressSnapshotDtoSchema,
  LessonProgressStateDtoSchema,
  ProgressDtoSchema,
} from "../dtos";

type DatabaseRow = Record<string, unknown>;

type CourseAccess =
  | {
      status: "available";
      enrollment_id: string;
      pending_prerequisite_course_ids: string[];
    }
  | {
      status: "blocked";
      reason: "not_enrolled" | "prerequisites_incomplete";
      enrollment_id: string | null;
      pending_prerequisite_course_ids: string[];
    };

const database = getDatabaseClient();

function toStringArray(rows: DatabaseRow[], key: string): string[] {
  return rows
    .map((row) => row[key])
    .filter(
      (value): value is string => typeof value === "string" && value.length > 0,
    );
}

async function getActiveEnrollment(userId: string, courseId: string) {
  const rows = await database`
    select
      id,
      user_id,
      course_id,
      to_char(enrolled_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as enrolled_at,
      status
    from cursos.enrollments
    where user_id = ${userId}
      and course_id = ${courseId}
      and status = 'active'
    limit 1
  `;

  return rows[0] as DatabaseRow | undefined;
}

async function getCoursePrerequisites(courseId: string): Promise<string[]> {
  const rows = await database`
    select prerequisite_course_id
    from cursos.course_prerequisites
    where course_id = ${courseId}
    order by created_at asc
  `;

  return toStringArray(rows as DatabaseRow[], "prerequisite_course_id");
}

async function isCourseCompletedByUser(
  userId: string,
  courseId: string,
): Promise<boolean> {
  const enrollment = await getActiveEnrollment(userId, courseId);

  if (!enrollment) {
    return false;
  }

  const summaryRows = await database`
    select
      count(l.id)::int as total_lessons,
      coalesce(sum(case when p.completed then 1 else 0 end), 0)::int as completed_lessons
    from cursos.modules m
    join cursos.lessons l on l.module_id = m.id
    left join cursos.progress p
      on p.lesson_id = l.id
     and p.enrollment_id = ${enrollment.id}
    where m.course_id = ${courseId}
  `;

  const summary = summaryRows[0] as
    | { total_lessons?: number; completed_lessons?: number }
    | undefined;
  const totalLessons = summary?.total_lessons ?? 0;
  const completedLessons = summary?.completed_lessons ?? 0;

  return totalLessons === 0 || completedLessons >= totalLessons;
}

export async function resolveCourseAccess(
  userId: string,
  courseId: string,
): Promise<CourseAccess> {
  const enrollment = await getActiveEnrollment(userId, courseId);

  if (!enrollment) {
    return {
      status: "blocked",
      reason: "not_enrolled",
      enrollment_id: null,
      pending_prerequisite_course_ids: [],
    };
  }

  const prerequisiteCourseIds = await getCoursePrerequisites(courseId);
  const pendingPrerequisiteCourseIds: string[] = [];

  for (const prerequisiteCourseId of prerequisiteCourseIds) {
    const isCompleted = await isCourseCompletedByUser(
      userId,
      prerequisiteCourseId,
    );

    if (!isCompleted) {
      pendingPrerequisiteCourseIds.push(prerequisiteCourseId);
    }
  }

  if (pendingPrerequisiteCourseIds.length > 0) {
    return {
      status: "blocked",
      reason: "prerequisites_incomplete",
      enrollment_id: enrollment.id as string,
      pending_prerequisite_course_ids: pendingPrerequisiteCourseIds,
    };
  }

  return {
    status: "available",
    enrollment_id: enrollment.id as string,
    pending_prerequisite_course_ids: [],
  };
}

export async function resolveLessonContext(lessonId: string) {
  const rows = await database`
    select
      l.id as lesson_id,
      l.title as lesson_title,
      l.position as lesson_position,
      m.id as module_id,
      m.course_id
    from cursos.lessons l
    join cursos.modules m on m.id = l.module_id
    where l.id = ${lessonId}
    limit 1
  `;

  return rows[0] as
    | {
        lesson_id: string;
        lesson_title: string;
        lesson_position: number;
        module_id: string;
        course_id: string;
      }
    | undefined;
}

export async function resolveModuleContext(moduleId: string) {
  const rows = await database`
    select
      id as module_id,
      course_id
    from cursos.modules
    where id = ${moduleId}
    limit 1
  `;

  return rows[0] as { module_id: string; course_id: string } | undefined;
}

export async function loadCourseProgressSnapshot(
  userId: string,
  courseId: string,
) {
  const access = await resolveCourseAccess(userId, courseId);
  const totalLessonRows = await database`
    select count(*)::int as total_lessons
    from cursos.modules m
    join cursos.lessons l on l.module_id = m.id
    where m.course_id = ${courseId}
  `;
  const totalLessons =
    (totalLessonRows[0] as { total_lessons?: number } | undefined)
      ?.total_lessons ?? 0;

  if (access.status === "blocked") {
    return CourseProgressSnapshotDtoSchema.parse({
      course_id: courseId,
      enrollment_id: access.enrollment_id,
      access: {
        status: access.status,
        reason: access.reason,
        pending_prerequisite_course_ids: access.pending_prerequisite_course_ids,
      },
      total_lessons: totalLessons,
      completed_lessons: 0,
      completion_rate: 0,
      lessons: [],
    });
  }

  const lessonRows = await database`
    select
      l.id as lesson_id,
      l.title as lesson_title,
      l.position as lesson_position,
      p.id as progress_id,
      coalesce(p.completed, false) as completed,
      to_char(p.completed_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as completed_at
    from cursos.modules m
    join cursos.lessons l on l.module_id = m.id
    left join cursos.progress p
      on p.lesson_id = l.id
     and p.enrollment_id = ${access.enrollment_id}
    where m.course_id = ${courseId}
    order by m.position asc, l.position asc
  `;

  const lessons = (lessonRows as DatabaseRow[]).map((row) =>
    LessonProgressStateDtoSchema.parse({
      lesson_id: row.lesson_id,
      lesson_title: row.lesson_title,
      lesson_position: row.lesson_position,
      progress_id: row.progress_id ?? null,
      completed: Boolean(row.completed),
      completed_at: row.completed_at ?? null,
    }),
  );

  const completedLessons = lessons.filter((lesson) => lesson.completed).length;
  const completionRate =
    totalLessons === 0
      ? 0
      : Math.round((completedLessons / totalLessons) * 10000) / 100;

  return CourseProgressSnapshotDtoSchema.parse({
    course_id: courseId,
    enrollment_id: access.enrollment_id,
    access: {
      status: access.status,
      pending_prerequisite_course_ids: access.pending_prerequisite_course_ids,
    },
    total_lessons: totalLessons,
    completed_lessons: completedLessons,
    completion_rate: completionRate,
    lessons,
  });
}

export async function upsertLessonProgress(
  userId: string,
  lessonId: string,
  completed: boolean,
) {
  const lessonContext = await resolveLessonContext(lessonId);

  if (!lessonContext) {
    return null;
  }

  const access = await resolveCourseAccess(userId, lessonContext.course_id);

  if (access.status === "blocked") {
    return {
      blocked: true as const,
      reason: access.reason,
      pending_prerequisite_course_ids: access.pending_prerequisite_course_ids,
    };
  }

  const completedAt = completed ? new Date().toISOString() : null;
  const enrollmentId = access.enrollment_id;

  const existingRows = await database`
    select
      id,
      enrollment_id,
      lesson_id,
      completed,
      to_char(completed_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as completed_at
    from cursos.progress
    where enrollment_id = ${enrollmentId}
      and lesson_id = ${lessonId}
    limit 1
  `;

  if (existingRows.length > 0) {
    const rows = await database`
      update cursos.progress
      set completed = ${completed},
          completed_at = ${completedAt}
      where enrollment_id = ${enrollmentId}
        and lesson_id = ${lessonId}
      returning
        id,
        enrollment_id,
        lesson_id,
        completed,
        to_char(completed_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as completed_at
    `;

    return ProgressDtoSchema.parse(rows[0]);
  }

  const rows = await database`
    insert into cursos.progress (
      enrollment_id,
      lesson_id,
      completed,
      completed_at
    ) values (
      ${enrollmentId},
      ${lessonId},
      ${completed},
      ${completedAt}
    )
    returning
      id,
      enrollment_id,
      lesson_id,
      completed,
      to_char(completed_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as completed_at
  `;

  return ProgressDtoSchema.parse(rows[0]);
}
