import type { Evaluation, EvaluationAttempt } from "../../types";

// Mock service for evaluation operations
// TODO: Replace with actual API calls when backend is ready

const mockEvaluations: Record<string, Evaluation> = {
  "eval-001": {
    id: "eval-001",
    title: "React Fundamentals Quiz",
    description: "Test your knowledge of React basics",
    questions: [
      {
        id: "q-001",
        text: "What is React?",
        options: [
          { id: "opt-1", text: "A JavaScript library for building UIs" },
          { id: "opt-2", text: "A CSS framework" },
          { id: "opt-3", text: "A database tool" },
          { id: "opt-4", text: "A version control system" },
        ],
      },
      {
        id: "q-002",
        text: "What is JSX?",
        options: [
          { id: "opt-5", text: "A syntax extension for JavaScript" },
          { id: "opt-6", text: "A markup language" },
          { id: "opt-7", text: "A style format" },
          { id: "opt-8", text: "A testing library" },
        ],
      },
    ],
    policy: {
      maxAttempts: 3,
      passingScore: 70,
      timeLimitSeconds: 600,
      allowReview: true,
      shuffleQuestions: true,
    },
  },
};

export const evaluationService = {
  async getEvaluation(evaluationId: string): Promise<Evaluation> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockEvaluations[evaluationId] || mockEvaluations["eval-001"]);
      }, 500);
    });
  },

  async startAttempt(evaluationId: string): Promise<EvaluationAttempt> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `attempt-${Date.now()}`,
          evaluationId,
          status: "started",
          startedAt: new Date().toISOString(),
        });
      }, 300);
    });
  },

  async submitAttempt(
    attemptId: string,
    answers: Record<string, string>
  ): Promise<EvaluationAttempt> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: attemptId,
          evaluationId: "eval-001",
          status: "submitted",
          startedAt: new Date().toISOString(),
          submittedAt: new Date().toISOString(),
        });
      }, 1000);
    });
  },

  async getAttemptFeedback(
    attemptId: string
  ): Promise<{ score: number; message: string; questionsReview?: any[] }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          score: 75,
          message: "Great job! You passed the evaluation.",
        });
      }, 1500);
    });
  },
};
