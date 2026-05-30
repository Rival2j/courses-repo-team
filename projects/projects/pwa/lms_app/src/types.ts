export type ResourceType = "video" | "document" | "iframe";

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  source: string;
  description: string;
}

export interface DbLesson {
  id: string;
  module_id: string;
  title: string;
  content: string;
  position: number;
  blocked_by?: string[];
}

export interface DbModule {
  id: string;
  course_id: string;
  title: string;
  position: number;
}

export interface DbCourse {
  id: string;
  slug: string;
  title: string;
  description: string;
  created_by: string;
  created_at: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  resources: Resource[];
  blockedBy?: string[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  summary: string;
  instructor: string;
  difficulty: string;
  prerequisiteCourseIds?: string[];
  image: string;
  badge?: "BESTSELLER" | "NUEVO";
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  durationHours: number;
  lessonsCount: number;
  language: "Español" | "Inglés" | "Portugués";
  category: "Desarrollo" | "Diseño" | "Marketing" | "Data Science" | "Seguridad";
  level: "Principiante" | "Intermedio" | "Avanzado";
  createdAt?: number;
  modules: Module[];
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  courseIds: string[];
}

export interface ProgressState {
  completedLessons: Record<string, boolean>;
}

export interface User {
  name: string;
  email: string;
}

export interface EvaluationOption {
  id: string;
  text: string;
}

export interface EvaluationQuestion {
  id: string;
  text: string;
  options: EvaluationOption[];
}

export interface EvaluationPolicy {
  maxAttempts: number;
  passingScore?: number;
  timeLimitSeconds?: number;
  allowReview?: boolean;
  shuffleQuestions?: boolean;
}

export interface Evaluation {
  id: string;
  title: string;
  description?: string;
  questions: EvaluationQuestion[];
  policy: EvaluationPolicy;
}

export interface EvaluationAttempt {
  id: string;
  evaluationId: string;
  status: "started" | "submitted";
  startedAt: string;
  submittedAt?: string;
}

export interface EvaluationFeedback {
  score: number;
  message: string;
  questionsReview?: {
    question: string;
    userAnswer: string;
    isCorrect?: boolean;
  }[];
}
