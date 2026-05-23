import { Link, useParams } from "react-router-dom";
import type { Course, ProgressState } from "../types";

interface CoursePageProps {
  courses: Course[];
  progress: ProgressState["completedLessons"];
}

export default function CoursePage({ courses, progress }: CoursePageProps) {
  const { courseId } = useParams();
  const course = courses.find((item) => item.id === courseId);

  if (!course) {
    return (
      <section className="page-content">
        <h2>Curso no encontrado</h2>
        <p>El curso solicitado no existe o fue movido.</p>
        <Link to="/" className="button">
          Volver al catálogo
        </Link>
      </section>
    );
  }

  return (
    <section className="page-content">
      <div className="page-header">
        <h2>{course.title}</h2>
        <p>{course.summary}</p>
      </div>

      <div className="course-detail">
        <div className="course-summary-panel" aria-label="Resumen del curso">
          <p>
            <strong>Instructor:</strong> {course.instructor}
          </p>
          <p>
            <strong>Dificultad:</strong> {course.difficulty}
          </p>
          <p>
            <strong>Módulos:</strong> {course.modules.length}
          </p>
        </div>

        <div className="course-modules" aria-label="Módulos y lecciones del curso">
          <h3>Contenido del curso</h3>
          <ol className="module-list">
            {course.modules.map((module) => (
              <li key={module.id} className="module-item">
                <div className="module-header">
                  <span className="module-title">{module.title}</span>
                  <span className="module-description">{module.description}</span>
                </div>
                <ul className="lesson-list">
                  {module.lessons.map((lesson) => (
                    <li key={lesson.id}>
                      <Link
                        className="lesson-link"
                        to={`/cursos/${course.id}/leccion/${lesson.id}`}
                        aria-current={progress[lesson.id] ? "true" : undefined}
                      >
                        {lesson.title}
                      </Link>
                      <span className="lesson-status">
                        {progress[lesson.id] ? "Completada" : "Pendiente"}
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
