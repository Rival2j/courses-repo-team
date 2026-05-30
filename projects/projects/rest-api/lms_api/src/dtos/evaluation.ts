import { z } from "zod";
import {
  isoDateTimeSchema,
  uuidSchema,
  withObjectKeyAliases,
} from "./common";

// is_correct is intentionally omitted — never sent to the client
export const QuestionOptionDtoSchema = withObjectKeyAliases({
    id: uuidSchema,
    question_id: uuidSchema,
    text: z.string(),
  }, {
    questionId: "question_id",
  });

export const EvaluationPolicyDtoSchema = withObjectKeyAliases({
  max_attempts: z.number().int().positive(),
  passing_score: z.preprocess(
    (value) => (value === null || value === undefined ? null : Number(value)),
    z.number().min(0).max(100).nullable(),
  ),
  time_limit_seconds: z.number().int().positive().nullable(),
  allow_review: z.boolean(),
  shuffle_questions: z.boolean(),
}, {
  maxAttempts: "max_attempts",
  passingScore: "passing_score",
  timeLimitSeconds: "time_limit_seconds",
  allowReview: "allow_review",
  shuffleQuestions: "shuffle_questions",
});

export const QuestionDtoSchema = withObjectKeyAliases({
    id: uuidSchema,
    evaluation_id: uuidSchema,
    text: z.string(),
    meta: z.unknown().nullable(),
    options: z.array(QuestionOptionDtoSchema),
  }, {
    evaluationId: "evaluation_id",
  });

export const EvaluationDtoSchema = withObjectKeyAliases({
    id: uuidSchema,
    course_id: uuidSchema.nullable(),
    title: z.string(),
    created_at: isoDateTimeSchema,
    policy: EvaluationPolicyDtoSchema,
  }, {
    courseId: "course_id",
    createdAt: "created_at",
  });

export const EvaluationWithQuestionsDtoSchema = withObjectKeyAliases({
    evaluation: EvaluationDtoSchema,
    questions: z.array(QuestionDtoSchema),
  }, {});

export const EvaluationAttemptDtoSchema = withObjectKeyAliases({
    id: uuidSchema,
    user_id: uuidSchema,
    evaluation_id: uuidSchema,
    started_at: isoDateTimeSchema,
    finished_at: isoDateTimeSchema.nullable(),
    score: z.number().nullable(),
  }, {
    userId: "user_id",
    evaluationId: "evaluation_id",
    startedAt: "started_at",
    finishedAt: "finished_at",
  });

export const EvaluationAttemptAnswerDtoSchema = withObjectKeyAliases({
    id: uuidSchema,
    question_id: uuidSchema,
    selected_option_id: uuidSchema.nullable(),
    answered_at: isoDateTimeSchema,
  }, {
    questionId: "question_id",
    selectedOptionId: "selected_option_id",
    answeredAt: "answered_at",
  });

export const EvaluationAttemptEventDtoSchema = withObjectKeyAliases({
    id: uuidSchema,
    event_type: z.string(),
    created_at: isoDateTimeSchema,
  }, {
    eventType: "event_type",
    createdAt: "created_at",
  });

export const EvaluationAttemptDetailDtoSchema = withObjectKeyAliases({
    attempt: EvaluationAttemptDtoSchema,
    answers: z.array(EvaluationAttemptAnswerDtoSchema),
    events: z.array(EvaluationAttemptEventDtoSchema),
  }, {});

export type QuestionOptionDto = z.infer<typeof QuestionOptionDtoSchema>;
export type QuestionDto = z.infer<typeof QuestionDtoSchema>;
export type EvaluationPolicyDto = z.infer<typeof EvaluationPolicyDtoSchema>;
export type EvaluationDto = z.infer<typeof EvaluationDtoSchema>;
export type EvaluationWithQuestionsDto = z.infer<
  typeof EvaluationWithQuestionsDtoSchema
>;
export type EvaluationAttemptDto = z.infer<typeof EvaluationAttemptDtoSchema>;
export type EvaluationAttemptAnswerDto = z.infer<
  typeof EvaluationAttemptAnswerDtoSchema
>;
export type EvaluationAttemptDetailDto = z.infer<
  typeof EvaluationAttemptDetailDtoSchema
>;

export const StartAttemptResponseDtoSchema = withObjectKeyAliases({
    attempt_id: uuidSchema,
    evaluation_id: uuidSchema,
    attempt_number: z.number().int(),
    max_attempts: z.number().int().nullable(),
    started_at: isoDateTimeSchema,
  }, {
    attemptId: "attempt_id",
    evaluationId: "evaluation_id",
    attemptNumber: "attempt_number",
    maxAttempts: "max_attempts",
    startedAt: "started_at",
  });

export const EvaluationGateStatusDtoSchema = withObjectKeyAliases({
    course_id: uuidSchema,
    user_id: uuidSchema,
    all_evaluations_passed: z.boolean(),
    total_required: z.number().int(),
    pending_evaluation_ids: z.array(uuidSchema),
  }, {
    courseId: "course_id",
    userId: "user_id",
    allEvaluationsPassed: "all_evaluations_passed",
    totalRequired: "total_required",
    pendingEvaluationIds: "pending_evaluation_ids",
  });

export type StartAttemptResponseDto = z.infer<
  typeof StartAttemptResponseDtoSchema
>;
export type EvaluationGateStatusDto = z.infer<
  typeof EvaluationGateStatusDtoSchema
>;
