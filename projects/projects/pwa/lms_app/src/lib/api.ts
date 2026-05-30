import type {
  Course,
  Evaluation,
  EvaluationAttempt,
  EvaluationFeedback,
  ProgressState,
  Resource,
  ResourceType,
} from "../types";
import { supabase } from "./supabaseClient";

type JsonRecord = Record<string, unknown>;

export interface AppUserProfile {
  id: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  role?: string;
  createdAt?: string;
}

const DEFAULT_API_BASE_URL = "http://localhost:3000";
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL
).replace(/\/$/, "");
const SUPABASE_FUNCTIONS_BASE_URL = import.meta.env.VITE_SUPABASE_URL
  ? `${import.meta.env.VITE_SUPABASE_URL.replace(/\/$/, "")}/functions/v1`
  : null;

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNullableString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : typeof value === "string" && value.trim().length > 0 && Number.isFinite(Number(value))
    ? Number(value)
    : fallback;
}

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function toResourceType(value: unknown): ResourceType {
  if (value === "video" || value === "iframe" || value === "document") {
    return value;
  }

  return "document";
}

function normalizeResource(value: unknown): Resource {
  const resource = isRecord(value) ? value : {};

  return {
    id: asString(resource.id),
    title: asString(resource.title),
    type: toResourceType(resource.type),
    source: asString(resource.source ?? resource.url),
    description: asString(resource.description),
  };
}

function normalizeLesson(value: unknown) {
  const lesson = isRecord(value) ? value : {};

  return {
    id: asString(lesson.id),
    title: asString(lesson.title),
    description: asString(lesson.description),
    blockedBy: asArray<string>(
      lesson.blockedBy ?? lesson.blocked_by,
    ).filter((item) => typeof item === "string"),
    resources: asArray(lesson.resources).map(normalizeResource),
  };
}

function normalizeModule(value: unknown) {
  const moduleItem = isRecord(value) ? value : {};

  return {
    id: asString(moduleItem.id),
    title: asString(moduleItem.title),
    description: asString(moduleItem.description),
    lessons: asArray(moduleItem.lessons).map(normalizeLesson),
  };
}

function normalizeLanguage(value: unknown): Course["language"] {
  if (value === "Español" || value === "Inglés" || value === "Portugués") {
    return value;
  }

  return "Español";
}

function normalizeCategory(value: unknown): Course["category"] {
  if (
    value === "Desarrollo" ||
    value === "Diseño" ||
    value === "Marketing" ||
    value === "Data Science" ||
    value === "Seguridad"
  ) {
    return value;
  }

  return "Desarrollo";
}

function normalizeLevel(value: unknown): Course["level"] {
  if (
    value === "Principiante" ||
    value === "Intermedio" ||
    value === "Avanzado"
  ) {
    return value;
  }

  return "Intermedio";
}

export function normalizeCourse(value: unknown): Course {
  const course = isRecord(value) ? value : {};

  return {
    id: asString(course.id),
    title: asString(course.title),
    summary: asString(course.summary ?? course.description),
    instructor: asString(course.instructor, "Instructor"),
    difficulty: asString(course.difficulty, "Intermedio"),
    prerequisiteCourseIds: asArray<string>(
      course.prerequisiteCourseIds ?? course.prerequisite_course_ids,
    ).filter((item) => typeof item === "string"),
    image: asString(course.image),
    badge:
      course.badge === "BESTSELLER" || course.badge === "NUEVO"
        ? course.badge
        : undefined,
    rating: asNumber(course.rating ?? course.rating_average),
    reviewCount: asNumber(course.reviewCount ?? course.rating_count),
    price: asNumber(course.price),
    originalPrice:
      course.originalPrice !== undefined
        ? asNumber(course.originalPrice)
        : undefined,
    discountPercent:
      course.discountPercent !== undefined
        ? asNumber(course.discountPercent)
        : undefined,
    durationHours: asNumber(course.durationHours, 0),
    lessonsCount: asNumber(course.lessonsCount, 0),
    language: normalizeLanguage(course.language),
    category: normalizeCategory(course.category),
    level: normalizeLevel(course.level),
    createdAt:
      course.createdAt !== undefined
        ? asNumber(course.createdAt)
        : course.created_at !== undefined
        ? Date.parse(asString(course.created_at))
        : undefined,
    modules: asArray(course.modules).map(normalizeModule),
  };
}

function normalizeUserProfile(value: unknown): AppUserProfile {
  const profile = isRecord(value) ? value : {};

  return {
    id: asString(profile.id),
    displayName: asString(profile.display_name ?? profile.displayName, "Usuario"),
    email: asString(profile.email),
    avatarUrl: asNullableString(profile.avatar_url ?? profile.avatarUrl),
    bio: asNullableString(profile.bio),
    role: typeof profile.role === "string" ? profile.role : undefined,
    createdAt: typeof profile.created_at === "string"
      ? profile.created_at
      : typeof profile.createdAt === "string"
      ? profile.createdAt
      : undefined,
  };
}

export function normalizeProgressState(value: unknown): ProgressState {
  const snapshot = isRecord(value) ? value : {};
  const lessons = asArray<JsonRecord>(snapshot.lessons);
  const completedLessons = lessons.reduce<Record<string, boolean>>(
    (acc, lesson) => {
      const lessonId = asString(lesson.lesson_id ?? lesson.lessonId);
      if (lessonId) {
        acc[lessonId] = asBoolean(lesson.completed);
      }
      return acc;
    },
    {},
  );

  return { completedLessons };
}

export function normalizeEvaluation(value: unknown): Evaluation {
  const payload = isRecord(value) ? value : {};
  const evaluation = isRecord(payload.evaluation) ? payload.evaluation : payload;
  const policy = isRecord(evaluation.policy) ? evaluation.policy : {};
  const questions = asArray<JsonRecord>(payload.questions ?? evaluation.questions);

  return {
    id: asString(evaluation.id),
    title: asString(evaluation.title),
    description: asNullableString(
      evaluation.description ?? evaluation.summary,
    ) ?? undefined,
    questions: questions.map((question) => ({
      id: asString(question.id),
      text: asString(question.text),
      options: asArray<JsonRecord>(question.options).map((option) => ({
        id: asString(option.id),
        text: asString(option.text),
      })),
    })),
    policy: {
      maxAttempts: asNumber(policy.max_attempts ?? policy.maxAttempts, 1),
      passingScore:
        policy.passing_score !== undefined || policy.passingScore !== undefined
          ? asNumber(policy.passing_score ?? policy.passingScore)
          : undefined,
      timeLimitSeconds:
        policy.time_limit_seconds !== undefined ||
        policy.timeLimitSeconds !== undefined
          ? asNumber(policy.time_limit_seconds ?? policy.timeLimitSeconds)
          : undefined,
      allowReview: asBoolean(policy.allow_review ?? policy.allowReview),
      shuffleQuestions: asBoolean(
        policy.shuffle_questions ?? policy.shuffleQuestions,
      ),
    },
  };
}

function normalizeAttempt(value: unknown): EvaluationAttempt {
  const attempt = isRecord(value) ? value : {};
  const finishedAt = attempt.finished_at ?? attempt.finishedAt;

  return {
    id: asString(attempt.id ?? attempt.attempt_id ?? attempt.attemptId),
    evaluationId: asString(
      attempt.evaluation_id ?? attempt.evaluationId,
    ),
    status: finishedAt ? "submitted" : "started",
    startedAt: asString(attempt.started_at ?? attempt.startedAt),
    submittedAt:
      typeof finishedAt === "string"
        ? finishedAt
        : undefined,
  };
}

function normalizeEvaluationFeedback(value: unknown): EvaluationFeedback {
  const feedback = isRecord(value) ? value : {};
  const score = asNumber(feedback.score);
  const passed = asBoolean(feedback.passed, score >= 70);

  return {
    score,
    message: passed
      ? "Evaluación enviada correctamente. Has aprobado."
      : "Evaluación enviada correctamente. Revisa el material y vuelve a intentarlo.",
  };
}

async function getAccessToken(): Promise<string> {
  if (!supabase) {
    throw new Error("Supabase client is not configured");
  }

  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  const accessToken = data.session?.access_token;
  if (!accessToken) {
    throw new Error("No active Supabase session");
  }

  return accessToken;
}

async function requestJson<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const token = await getAccessToken();
  const headers = new Headers(init?.headers);

  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Accept", "application/json");

  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  const payload = await response.json().catch(() => null) as
    | { data?: T; message?: string }
    | null;

  if (!response.ok) {
    throw new Error(payload?.message ?? `Request failed with status ${response.status}`);
  }

  return (payload?.data ?? payload) as T;
}

async function requestFunctionJson<T>(
  functionName: string,
  body: JsonRecord,
): Promise<T> {
  if (!SUPABASE_FUNCTIONS_BASE_URL) {
    throw new Error("Supabase Functions base URL is not configured");
  }

  const token = await getAccessToken();
  const response = await fetch(
    `${SUPABASE_FUNCTIONS_BASE_URL}/${functionName}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  const payload = await response.json().catch(() => null) as
    | { data?: T; message?: string }
    | null;

  if (!response.ok) {
    throw new Error(payload?.message ?? `Function failed with status ${response.status}`);
  }

  return (payload?.data ?? payload) as T;
}

export const lmsApi = {
  async bootstrapCurrentUser(input: {
    displayName?: string;
    avatarUrl?: string | null;
    bio?: string | null;
  }): Promise<AppUserProfile> {
    const payload = await requestJson<{
      auth?: unknown;
      profile?: unknown;
    }>("/users/bootstrap", {
      method: "POST",
      body: JSON.stringify({
        display_name: input.displayName,
        avatar_url: input.avatarUrl,
        bio: input.bio,
      }),
    });

    return normalizeUserProfile(payload.profile);
  },

  async getCourses(): Promise<Course[]> {
    const payload = await requestJson<unknown[]>("/pwa/courses");
    return asArray(payload).map(normalizeCourse);
  },

  async getCourseById(courseId: string): Promise<Course> {
    const payload = await requestJson<unknown>(`/pwa/courses/${courseId}`);
    return normalizeCourse(payload);
  },

  async getCurrentUserProfile(): Promise<AppUserProfile> {
    if (!supabase) {
      throw new Error("Supabase client is not configured");
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      throw new Error(sessionError.message);
    }

    const userId = sessionData.session?.user.id;
    if (!userId) {
      throw new Error("No active Supabase session");
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, user_id, display_name, email, avatar_url, bio, role, created_at")
      .eq("user_id", userId)
      .single();

    if (profileError) {
      throw new Error(profileError.message);
    }

    if (!profile) {
      throw new Error("User profile not found");
    }

    return normalizeUserProfile(profile);
  },

  async getUserProfile(userId: string): Promise<AppUserProfile> {
    const payload = await requestJson<unknown>(`/pwa/users/${userId}/profile`);
    return normalizeUserProfile(payload);
  },

  async getCourseProgress(courseId: string): Promise<ProgressState> {
    const payload = await requestJson<unknown>(`/courses/${courseId}/progress`);
    return normalizeProgressState(payload);
  },

  async updateLessonProgress(
    lessonId: string,
    completed: boolean,
    version?: number,
  ) {
    return requestJson<unknown>(`/lessons/${lessonId}/progress`, {
      method: "PUT",
      headers: version !== undefined ? { "If-Match": `"${version}"` } : undefined,
      body: JSON.stringify({ completed }),
    });
  },

  async getEvaluation(evaluationId: string): Promise<Evaluation> {
    const payload = await requestJson<unknown>(`/evaluations/${evaluationId}`);
    return normalizeEvaluation(payload);
  },

  async startEvaluationAttempt(
    evaluationId: string,
  ): Promise<EvaluationAttempt> {
    const payload = await requestJson<unknown>(
      `/evaluations/${evaluationId}/attempts`,
      { method: "POST" },
    );

    return normalizeAttempt(payload);
  },

  async submitEvaluationAttempt(
    attemptId: string,
    answers: Record<string, string>,
  ): Promise<EvaluationFeedback> {
    const payload = await requestFunctionJson<unknown>("submit-evaluation", {
      attempt_id: attemptId,
      answers: Object.entries(answers).map(
        ([question_id, selected_option_id]) => ({
          question_id,
          selected_option_id,
        }),
      ),
    });

    return normalizeEvaluationFeedback(payload);
  },
};
