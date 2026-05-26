import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useCourses } from "./features/course/useCourses";
import { useCourseProgressStore } from "./features/course/courseStore";
import CatalogPage from "./pages/CatalogPage";
import CoursePage from "./pages/CoursePage";
import LessonPage from "./pages/LessonPage";
import LearningPathPage from "./pages/LearningPathPage";
import { EvaluationPage } from "./pages/EvaluationPage";
import { AppShell } from "./components/AppShell";
import { learningPaths } from "./data";

function App() {
  const { data: courses = [], isLoading, isError, error } = useCourses();
  const completedLessons = useCourseProgressStore((state) => state.completedLessons);
  const enrolledCourses = useCourseProgressStore((state) => state.enrolledCourses);
  const markLessonComplete = useCourseProgressStore((state) => state.markLessonComplete);
  const enrollCourse = useCourseProgressStore((state) => state.enrollCourse);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const hasEmptyState = !isLoading && !isError && courses.length === 0;

  return (
    <AppShell
      isOffline={isOffline}
      isLoading={isLoading}
      isError={isError}
      emptyState={hasEmptyState}
      errorText={error instanceof Error ? error.message : undefined}
      emptyText="No se encontró contenido para mostrar. Intenta recargar más tarde."
    >
      <Routes>
        <Route
          path="/"
          element={<CatalogPage courses={courses} progress={completedLessons} enrolledCourses={enrolledCourses} />}
        />
        <Route
          path="/cursos/:courseId"
          element={
            <CoursePage
              courses={courses}
              progress={completedLessons}
              enrolledCourses={enrolledCourses}
              onEnrollCourse={enrollCourse}
              isOffline={isOffline}
            />
          }
        />
        <Route
          path="/cursos/:courseId/leccion/:lessonId"
          element={
            <LessonPage
              courses={courses}
              progress={completedLessons}
              enrolledCourses={enrolledCourses}
              onComplete={markLessonComplete}
            />
          }
        />
        <Route
          path="/rutas"
          element={<LearningPathPage courses={courses} learningPaths={learningPaths} progress={completedLessons} />}
        />
        <Route
          path="/evaluacion/:evaluationId"
          element={<EvaluationPage />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}

export default App;
