import {
  EvaluationAttemptDetailDto,
  EvaluationAttemptDetailDtoSchema,
  EvaluationAttemptDto,
  EvaluationAttemptDtoSchema,
  EvaluationGateStatusDto,
  EvaluationGateStatusDtoSchema,
  EvaluationWithQuestionsDto,
  EvaluationWithQuestionsDtoSchema,
  QuestionDtoSchema,
  StartAttemptResponseDto,
  StartAttemptResponseDtoSchema,
} from "../dtos";
import { getDatabaseClient } from "./database";

type DatabaseRow = Record<string, unknown>;

const TS_FORMAT =
  'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"';

function fmtTs(col: string): string {
  return `to_char(${col} at time zone 'UTC', '${TS_FORMAT}')`;
}

const database = getDatabaseClient();

export async function getEvaluationWithQuestions(
  evaluationId: string,
): Promise<EvaluationWithQuestionsDto | null> {
  const evalRows = await database`
    select
      e.id,
      e.course_id,
      e.title,
      ${database.unsafe(fmtTs("e.created_at"))} as created_at,
      coalesce(ep.max_attempts, 1) as max_attempts,
      ep.passing_score,
      ep.time_limit_seconds,
      coalesce(ep.allow_review, false) as allow_review,
      coalesce(ep.shuffle_questions, false) as shuffle_questions
    from cursos.evaluations e
    left join cursos.evaluation_policies ep
      on ep.evaluation_id = e.id
    where id = ${evaluationId}
    limit 1
  `;

  if (evalRows.length === 0) {
    return null;
  }

  const questionRows = await database`
    select
      id,
      evaluation_id,
      text,
      meta
    from cursos.questions
    where evaluation_id = ${evaluationId}
    order by id
  `;

  const questions = await Promise.all(
    questionRows.map(async (q: DatabaseRow) => {
      // Use the safe view — is_correct is excluded at the DB level (T323)
      const optionRows = await database`
        select
          id,
          question_id,
          text
        from cursos.question_options_safe
        where question_id = ${q.id as string}
        order by id
      `;

      return QuestionDtoSchema.parse({ ...q, options: optionRows });
    }),
  );

  return EvaluationWithQuestionsDtoSchema.parse({
    evaluation: evalRows[0],
    questions,
  });
}

export async function getEvaluationAttempts(
  userId: string,
  evaluationId: string,
): Promise<EvaluationAttemptDto[]> {
  const rows = await database`
    select
      id,
      user_id,
      evaluation_id,
      ${database.unsafe(fmtTs("started_at"))} as started_at,
      ${database.unsafe(fmtTs("finished_at"))} as finished_at,
      score
    from cursos.evaluation_attempts
    where user_id = ${userId}
      and evaluation_id = ${evaluationId}
    order by started_at desc
  `;

  return rows.map((row: DatabaseRow) => EvaluationAttemptDtoSchema.parse(row));
}

export async function getEvaluationAttemptDetail(
  userId: string,
  attemptId: string,
  evaluationId: string,
): Promise<EvaluationAttemptDetailDto | "forbidden" | null> {
  const attemptRows = await database`
    select
      id,
      user_id,
      evaluation_id,
      ${database.unsafe(fmtTs("started_at"))} as started_at,
      ${database.unsafe(fmtTs("finished_at"))} as finished_at,
      score
    from cursos.evaluation_attempts
    where id = ${attemptId}
      and evaluation_id = ${evaluationId}
    limit 1
  `;

  if (attemptRows.length === 0) {
    return null;
  }

  const attempt = attemptRows[0] as DatabaseRow;

  // Users can only access their own attempts
  if (attempt.user_id !== userId) {
    return "forbidden" as const;
  }

  const answerRows = await database`
    select
      id,
      question_id,
      selected_option_id,
      ${database.unsafe(fmtTs("answered_at"))} as answered_at
    from cursos.evaluation_attempt_answers
    where attempt_id = ${attemptId}
    order by answered_at
  `;

  const eventRows = await database`
    select
      id,
      event_type,
      ${database.unsafe(fmtTs("created_at"))} as created_at
    from cursos.evaluation_attempt_events
    where attempt_id = ${attemptId}
    order by created_at
  `;

  return EvaluationAttemptDetailDtoSchema.parse({
    attempt,
    answers: answerRows,
    events: eventRows,
  });
}

export async function startEvaluationAttempt(
  userId: string,
  evaluationId: string,
): Promise<
  | StartAttemptResponseDto
  | "enrollment_required"
  | "attempt_already_open"
  | "max_attempts_exceeded"
  | "evaluation_not_found"
> {
  try {
    const rows = await database`
      select cursos.start_evaluation_attempt(
        ${userId}::uuid,
        ${evaluationId}::uuid
      ) as result
    `;
    const raw = (rows[0] as DatabaseRow).result as Record<string, unknown>;
    if (raw?.error === "max_attempts_exceeded") return "max_attempts_exceeded";
    return StartAttemptResponseDtoSchema.parse(raw);
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : String(err);
    if (msg.includes("evaluation_not_found"))    return "evaluation_not_found";
    if (msg.includes("enrollment_required"))     return "enrollment_required";
    if (msg.includes("attempt_already_open"))    return "attempt_already_open";
    if (msg.includes("max_attempts_exceeded"))   return "max_attempts_exceeded";
    throw err;
  }
}

export async function getEvaluationGateStatus(
  userId: string,
  courseId: string,
): Promise<EvaluationGateStatusDto> {
  const rows = await database`
    select cursos.evaluation_gate_status(
      ${userId}::uuid,
      ${courseId}::uuid
    ) as result
  `;
  return EvaluationGateStatusDtoSchema.parse(
    (rows[0] as DatabaseRow).result,
  );
}
