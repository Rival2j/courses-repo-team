import { Link } from "react-router-dom";
import type { Course, ProgressState } from "../types";
import { ProgressBar } from "../components/ProgressBar";

interface CatalogPageProps {
  courses: Course[];
  progress: ProgressState["completedLessons"];
  enrolledCourses: string[];
}

function countCourseProgress(course: Course, progress: CatalogPageProps["progress"]) {
  const allLessons = course.modules.flatMap((module) => module.lessons);
  const completed = allLessons.filter((lesson) => progress[lesson.id]).length;
  return {
    completed,
    total: allLessons.length,
    percentage: allLessons.length ? Math.round((completed / allLessons.length) * 100) : 0,
  };
}

function isCourseLockedByPrerequisites(course: Course, courses: Course[], progress: CatalogPageProps["progress"]) {
  return (course.prerequisiteCourseIds ?? []).some((prerequisiteId) => {
    const prerequisite = courses.find((item) => item.id === prerequisiteId);
    return (
      !prerequisite ||
      prerequisite.modules.flatMap((module) => module.lessons).some((lesson) => !progress[lesson.id])
    );
  });
}

export default function CatalogPage({ courses, progress, enrolledCourses }: CatalogPageProps) {
  return (
    <section aria-labelledby="catalog-heading" className="page-content">
      <div className="page-header">
        <h2 id="catalog-heading">Catálogo de cursos</h2>
        <p>Explora los cursos disponibles y abre el detalle para ver módulos, lecciones y progreso.</p>
      </div>

      <div className="course-grid">
        {courses.map((course) => {
          const stats = countCourseProgress(course, progress);
          const isEnrolled = enrolledCourses.includes(course.id);
          const locked = isCourseLockedByPrerequisites(course, courses, progress);

          return (
            <article key={course.id} className="course-card">
              <h3>{course.title}</h3>
              <p className="course-summary">{course.summary}</p>
              <ProgressBar
                value={stats.percentage}
                label={`Progreso: ${stats.completed}/${stats.total} lecciones completadas`}
              />
              <p className="course-meta">
                <strong>Instructor:</strong> {course.instructor}
              </p>
              <p className="course-meta">
                <strong>Dificultad:</strong> {course.difficulty}
              </p>
              <p className="course-meta course-status">
                <strong>Estado:</strong> {isEnrolled ? "Inscrito" : locked ? "Requiere prerequisitos" : "Disponible"}
              </p>
              <Link className="button" to={`/cursos/${course.id}`}>
                Ver curso
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
