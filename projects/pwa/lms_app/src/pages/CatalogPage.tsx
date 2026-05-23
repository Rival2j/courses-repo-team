import { Link } from "react-router-dom";
import type { Course, ProgressState } from "../types";

interface CatalogPageProps {
  courses: Course[];
  progress: ProgressState["completedLessons"];
}

function countCourseProgress(course: Course, progress: CatalogPageProps["progress"]) {
  const allLessons = course.modules.flatMap((module) => module.lessons);
  const completed = allLessons.filter((lesson) => progress[lesson.id]).length;
  return {
    completed,
    total: allLessons.length,
  };
}

export default function CatalogPage({ courses, progress }: CatalogPageProps) {
  return (
    <section aria-labelledby="catalog-heading" className="page-content">
      <div className="page-header">
        <h2 id="catalog-heading">Catálogo de cursos</h2>
        <p>Explora los cursos disponibles y abre el detalle para ver módulos, lecciones y progreso.</p>
      </div>

      <div className="course-grid">
        {courses.map((course) => {
          const stats = countCourseProgress(course, progress);
          return (
            <article key={course.id} className="course-card">
              <h3>{course.title}</h3>
              <p className="course-summary">{course.summary}</p>
              <p className="course-meta">
                <strong>Instructor:</strong> {course.instructor}
              </p>
              <p className="course-meta">
                <strong>Dificultad:</strong> {course.difficulty}
              </p>
              <p className="course-progress">
                Progreso: {stats.completed}/{stats.total} lecciones completadas
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
