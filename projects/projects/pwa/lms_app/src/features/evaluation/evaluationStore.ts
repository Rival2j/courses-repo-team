import { create } from "zustand";
import type { EvaluationAttempt } from "../../types";

interface EvaluationStoreState {
  currentAttempt: EvaluationAttempt | null;
  answers: Record<string, string>;
  isSubmitting: boolean;
  timeRemaining: number;
  feedbackData: {
    score: number;
    message: string;
    questionsReview?: any[];
  } | null;

  setCurrentAttempt: (attempt: EvaluationAttempt | null) => void;
  setAnswer: (questionId: string, optionId: string) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setTimeRemaining: (time: number) => void;
  setFeedbackData: (feedback: any) => void;
  resetEvaluation: () => void;
}

export const useEvaluationStore = create<EvaluationStoreState>((set) => ({
  currentAttempt: null,
  answers: {},
  isSubmitting: false,
  timeRemaining: 0,
  feedbackData: null,

  setCurrentAttempt: (attempt) =>
    set({ currentAttempt: attempt, answers: {} }),

  setAnswer: (questionId, optionId) =>
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: optionId,
      },
    })),

  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  setTimeRemaining: (time) => set({ timeRemaining: time }),
  setFeedbackData: (feedback) => set({ feedbackData: feedback }),

  resetEvaluation: () =>
    set({
      currentAttempt: null,
      answers: {},
      isSubmitting: false,
      timeRemaining: 0,
      feedbackData: null,
    }),
}));
