import create from "zustand";
import type { ProgressState } from "../../types";

interface CourseProgressState extends ProgressState {
  markLessonComplete: (lessonId: string) => void;
  resetProgress: () => void;
}

export const useCourseProgressStore = create<CourseProgressState>((set) => ({
  completedLessons: {},
  markLessonComplete: (lessonId) =>
    set((state) => ({
      completedLessons: {
        ...state.completedLessons,
        [lessonId]: true,
      },
    })),
  resetProgress: () => ({ completedLessons: {} }),
}));
