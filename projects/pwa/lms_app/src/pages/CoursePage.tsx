import { Link, useParams } from "react-router-dom";
import type { Course, ProgressState } from "../types";
import { ProgressBar } from "../components/ProgressBar";
import EnrollmentForm from "../features/enrollment/EnrollmentForm";

interface CoursePageProps {
  courses: Course[];
  progress: ProgressState["completedLessons"];
}

function countModuleProgress(module: Course["modules"][number], progress: CoursePageProps["progress"]) {
  const lessonIds = module.lessons.map((lesson) => lesson.id);
  const completedCount = lessonIds.filter((lessonId) => progress[lessonId]).length;

  return {
    completed: completedCount,
    total: lessonIds.length,
    percentage: lessonIds.length ? Math.round((completedCount / lessonIds.length) * 100) : 0,
  };
}

function getLockedLessons(module: Course["modules"][number], progress: CoursePageProps["progress"]) {
  return module.lessons.reduce<Record<string, boolean>>((locked, lesson) => {
    const requires = lesson.blockedBy ?? [];
    locked[lesson.id] = requires.some((requiredId) => !progress[requiredId]);
    return locked;
  }, {});
}

function getPrerequisiteNames(course: Course, lesson: Course["modules"][number]["lessons"][number]) {
  if (!lesson.blockedBy?.length) {
    return [];
  }

  return lesson.blockedBy.map((prerequisiteId) => {
    const match = course.modules
      .flatMap((module) => module.lessons)
      .find((item) => item.id === prerequisiteId);
    return match ? match.title : prerequisiteId;
  });
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

  const totalLessons = course.modules.reduce((sum, module) => sum + module.lessons.length, 0);
  const totalCompleted = course.modules
    .flatMap((module) => module.lessons)
    .filter((lesson) => progress[lesson.id]).length;
  const courseProgress = totalLessons ? Math.round((totalCompleted / totalLessons) * 100) : 0;

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
          <ProgressBar value={courseProgress} label={`Avance del curso: ${courseProgress}%`} />
          <EnrollmentForm courseTitle={course.title} />
        </div>

        <div className="course-modules" aria-label="Módulos y lecciones del curso">
          <h3>Contenido del curso</h3>
          <ol className="module-list">
            {course.modules.map((module) => {
              const moduleProgress = countModuleProgress(module, progress);
              const lockedLessons = getLockedLessons(module, progress);

              return (
                <li key={module.id} className="module-item">
                  <div className="module-header">
                    <span className="module-title">{module.title}</span>
                    <span className="module-description">{module.description}</span>
                  </div>
                  <div className="module-progress-summary">
                    Progreso del módulo: {moduleProgress.completed}/{moduleProgress.total} lecciones ({moduleProgress.percentage}%)
                  </div>
                  <ul className="lesson-list">
                    {module.lessons.map((lesson) => {
                      const isLocked = lockedLessons[lesson.id];
                      const prerequisiteNames = getPrerequisiteNames(course, lesson);

                      return (
                        <li key={lesson.id}>
                          {isLocked ? (
                            <span className="lesson-link lesson-link-locked" aria-disabled="true">
                              {lesson.title}
                            </span>
                          ) : (
                            <Link
                              className="lesson-link"
                              to={`/cursos/${course.id}/leccion/${lesson.id}`}
                              aria-current={progress[lesson.id] ? "true" : undefined}
                            >
                              {lesson.title}
                            </Link>
                          )}
                          <span className={`lesson-status ${isLocked ? "lesson-status--blocked" : ""}`}>
                            {isLocked ? "Bloqueada" : progress[lesson.id] ? "Completada" : "Pendiente"}
                          </span>
                          {isLocked && prerequisiteNames.length > 0 ? (
                            <p className="lesson-locked-reason">
                              Completa {prerequisiteNames.join(", ")} antes de continuar.
                            </p>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
