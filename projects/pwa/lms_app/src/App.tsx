import { useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { courses } from "./data";
import type { ProgressState } from "./types";
import CatalogPage from "./pages/CatalogPage";
import CoursePage from "./pages/CoursePage";
import LessonPage from "./pages/LessonPage";

const initialProgress: ProgressState = {
  completedLessons: {},
};

function App() {
  const [progress, setProgress] = useState<ProgressState>(initialProgress);

  const progressMap = useMemo(
    () => progress.completedLessons,
    [progress]
  );

  const handleCompleteLesson = (lessonId: string) => {
    setProgress((current) => ({
      completedLessons: {
        ...current.completedLessons,
        [lessonId]: true,
      },
    }));
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>LMS PWA TEAM-02</h1>
          <p className="subtitle">Catálogo, cursos y lecciones con progreso accesible.</p>
        </div>
      </header>
      <main>
        <Routes>
          <Route
            path="/"
            element={<CatalogPage courses={courses} progress={progressMap} />}
          />
          <Route
            path="/cursos/:courseId"
            element={
              <CoursePage
                courses={courses}
                progress={progressMap}
              />
            }
          />
          <Route
            path="/cursos/:courseId/leccion/:lessonId"
            element={
              <LessonPage
                courses={courses}
                progress={progressMap}
                onComplete={handleCompleteLesson}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
