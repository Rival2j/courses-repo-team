import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useCourses } from "./features/course/useCourses";
import { useCourseProgressStore } from "./features/course/courseStore";
import { useNotificationsStore } from "./features/notifications/notificationsStore";
import CatalogPage from "./pages/CatalogPage";
import CoursePage from "./pages/CoursePage";
import LessonPage from "./pages/LessonPage";
import LearningPathPage from "./pages/LearningPathPage";
import { EvaluationPage } from "./pages/EvaluationPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ChatPage from "./pages/ChatPage";
import NotificationsPage from "./pages/NotificationsPage";
import { AppShell } from "./components/AppShell";
import { learningPaths } from "./data";

function App() {
  const { data: courses = [], isLoading, isError, error } = useCourses();
  const completedLessons = useCourseProgressStore((state) => state.completedLessons);
  const enrolledCourses = useCourseProgressStore((state) => state.enrolledCourses);
  const markLessonComplete = useCourseProgressStore((state) => state.markLessonComplete);
  const enrollCourse = useCourseProgressStore((state) => state.enrollCourse);
  const addNotification = useNotificationsStore((s) => s.addNotification);
  const notifications = useNotificationsStore((s) => s.items);
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

  useEffect(() => {
    if (notifications.length === 0) {
      addNotification({
        id: "welcome-notice",
        title: "Bienvenido a LMS",
        body: "Regístrate para conservar tu progreso y desbloquear el chat IA.",
        createdAt: new Date().toISOString(),
        read: false,
      });
      addNotification({
        id: "course-paths",
        title: "Explora rutas de aprendizaje",
        body: "Visita la sección de rutas para ver el mapa de dependencias de cursos.",
        createdAt: new Date().toISOString(),
        read: false,
      });
    }
  }, [notifications.length, addNotification]);

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
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registrarse" element={<SignupPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/notificaciones" element={<NotificationsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}

export default App;
