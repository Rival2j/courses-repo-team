import create from "zustand";
import type { ProgressState } from "../../types";

interface CourseProgressState extends ProgressState {
  enrolledCourses: string[];
  markLessonComplete: (lessonId: string) => void;
  enrollCourse: (courseId: string) => void;
  resetProgress: () => void;
  xp: number;
  level: number;
  badges: string[];
  trophies: string[];
  awardXp: (amount: number) => void;
  awardBadge: (badgeId: string) => void;
}

export const useCourseProgressStore = create<CourseProgressState>((set) => ({
  completedLessons: {},
  xp: 0,
  level: 1,
  badges: [],
  trophies: [],
  enrolledCourses: [],
  markLessonComplete: (lessonId) =>
    set((state) => {
      if (state.completedLessons[lessonId]) return state;
      const gainedXp = 10; // XP por lección completada
      const newXp = state.xp + gainedXp;
      const newLevel = Math.floor(newXp / 100) + 1;
      return {
        completedLessons: {
          ...state.completedLessons,
          [lessonId]: true,
        },
        xp: newXp,
        level: newLevel,
      };
    }),
  enrollCourse: (courseId) =>
    set((state) => ({
      enrolledCourses: state.enrolledCourses.includes(courseId)
        ? state.enrolledCourses
        : [...state.enrolledCourses, courseId],
    })),
  awardXp: (amount) =>
    set((state) => ({ xp: state.xp + amount, level: Math.floor((state.xp + amount) / 100) + 1 })),
  awardBadge: (badgeId) =>
    set((state) => ({ badges: state.badges.includes(badgeId) ? state.badges : [...state.badges, badgeId] })),
  resetProgress: () => ({ completedLessons: {}, enrolledCourses: [], xp: 0, level: 1, badges: [], trophies: [] }),
}));
