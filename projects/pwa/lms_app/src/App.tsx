import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useCourses } from "./features/course/useCourses";
import { useCourseProgressStore } from "./features/course/courseStore";
import CatalogPage from "./pages/CatalogPage";
import CoursePage from "./pages/CoursePage";
import LessonPage from "./pages/LessonPage";
import { AppShell } from "./components/AppShell";

function App() {
  const { data: courses = [], isLoading, isError, error } = useCourses();
  const completedLessons = useCourseProgressStore((state) => state.completedLessons);
  const markLessonComplete = useCourseProgressStore((state) => state.markLessonComplete);
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
        <Route path="/" element={<CatalogPage courses={courses} progress={completedLessons} />} />
        <Route path="/cursos/:courseId" element={<CoursePage courses={courses} progress={completedLessons} />} />
        <Route
          path="/cursos/:courseId/leccion/:lessonId"
          element={<LessonPage courses={courses} progress={completedLessons} onComplete={markLessonComplete} />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}

export default App;
