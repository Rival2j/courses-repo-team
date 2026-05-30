import { getDatabaseClient } from "./database";
import { EnrollmentDtoSchema } from "../dtos";

type DatabaseRow = Record<string, unknown>;

const database = getDatabaseClient();

const ENROLLMENT_SELECT = `
  id,
  user_id,
  course_id,
  status,
  to_char(enrolled_at    at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as enrolled_at,
  to_char(cancelled_at   at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as cancelled_at,
  to_char(completed_at   at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as completed_at,
  to_char(reactivated_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as reactivated_at
`;

function parseEnrollment(row: DatabaseRow) {
  return EnrollmentDtoSchema.parse(row);
}

// T125: Consulta por ID
export async function getEnrollmentById(enrollmentId: string) {
  const rows = await database`
    SELECT ${database.unsafe(ENROLLMENT_SELECT)}
    FROM cursos.enrollments
    WHERE id = ${enrollmentId}
    LIMIT 1
  `;
  return rows.length === 0 ? null : parseEnrollment(rows[0] as DatabaseRow);
}

// T125: Alta idempotente vía RPC — obtiene el id retornado y hace SELECT completo
export async function createEnrollment(userId: string, courseId: string) {
  const rpcRows = await database`
    SELECT (cursos.enroll_user(${userId}::uuid, ${courseId}::uuid)).id AS id
  `;
  const id = (rpcRows[0] as DatabaseRow).id as string;
  return (await getEnrollmentById(id))!;
}

// T125: Consulta por usuario (propio actor)
export async function listEnrollmentsByUser(
  userId: string,
  input?: { status?: string },
) {
  const rows = await database`
    SELECT ${database.unsafe(ENROLLMENT_SELECT)}
    FROM cursos.enrollments
    WHERE user_id = ${userId}
      ${input?.status ? database`AND status = ${input.status}` : database``}
    ORDER BY enrolled_at DESC
  `;
  return (rows as DatabaseRow[]).map(parseEnrollment);
}

// T125: Consulta por curso (admin/instructor — contrato TEAM-02)
export async function listEnrollmentsByCourse(
  courseId: string,
  input?: { status?: string },
) {
  const rows = await database`
    SELECT ${database.unsafe(ENROLLMENT_SELECT)}
    FROM cursos.enrollments
    WHERE course_id = ${courseId}
      ${input?.status ? database`AND status = ${input.status}` : database``}
    ORDER BY enrolled_at DESC
  `;
  return (rows as DatabaseRow[]).map(parseEnrollment);
}

// T125/T126: Cancelación con trazabilidad
export async function cancelEnrollment(
  enrollmentId: string,
  actorUserId: string,
) {
  // The RPC raises named exceptions for business rule violations (caught in route handler)
  await database`
    SELECT cursos.cancel_enrollment(${enrollmentId}::uuid, ${actorUserId}::uuid)
  `;
  return (await getEnrollmentById(enrollmentId))!;
}

// T125: Verifica si un curso existe (para retornar 404 antes del INSERT)
export async function courseExists(courseId: string): Promise<boolean> {
  const rows = await database`
    SELECT 1 FROM cursos.courses WHERE id = ${courseId} LIMIT 1
  `;
  return rows.length > 0;
}

// T125: Retorna el created_by de un curso (para validar pertenencia del instructor)
export async function getCourseCreatedBy(courseId: string): Promise<string | null> {
  const rows = await database`
    SELECT created_by FROM cursos.courses WHERE id = ${courseId} LIMIT 1
  `;
  if (rows.length === 0) return null;
  return (rows[0] as DatabaseRow).created_by as string | null;
}

// T126: Reactivación con restricción de política
export async function reactivateEnrollment(
  enrollmentId: string,
  actorUserId: string,
) {
  await database`
    SELECT cursos.reactivate_enrollment(${enrollmentId}::uuid, ${actorUserId}::uuid)
  `;
  return (await getEnrollmentById(enrollmentId))!;
}
