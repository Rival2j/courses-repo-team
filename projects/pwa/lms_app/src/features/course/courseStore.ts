import create from "zustand";
import type { ProgressState } from "../../types";

interface CourseProgressState extends ProgressState {
  enrolledCourses: string[];
  markLessonComplete: (lessonId: string) => void;
  enrollCourse: (courseId: string) => void;
  resetProgress: () => void;
}

export const useCourseProgressStore = create<CourseProgressState>((set) => ({
  completedLessons: {},
  enrolledCourses: [],
  markLessonComplete: (lessonId) =>
    set((state) => ({
      completedLessons: {
        ...state.completedLessons,
        [lessonId]: true,
      },
    })),
  enrollCourse: (courseId) =>
    set((state) => ({
      enrolledCourses: state.enrolledCourses.includes(courseId)
        ? state.enrolledCourses
        : [...state.enrolledCourses, courseId],
    })),
  resetProgress: () => ({ completedLessons: {}, enrolledCourses: [] }),
}));
