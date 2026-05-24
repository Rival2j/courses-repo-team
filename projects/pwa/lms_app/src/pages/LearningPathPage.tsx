import { Link } from "react-router-dom";
import type { Course, LearningPath, ProgressState } from "../types";
import { ProgressBar } from "../components/ProgressBar";

interface LearningPathPageProps {
  courses: Course[];
  learningPaths: LearningPath[];
  progress: ProgressState["completedLessons"];
}

function countCourseProgress(course: Course, progress: LearningPathPageProps["progress"]) {
  const lessonIds = course.modules.flatMap((module) => module.lessons).map((lesson) => lesson.id);
  const completedCount = lessonIds.filter((lessonId) => progress[lessonId]).length;

  return {
    completed: completedCount,
    total: lessonIds.length,
    percentage: lessonIds.length ? Math.round((completedCount / lessonIds.length) * 100) : 0,
  };
}

function isCourseComplete(course: Course, progress: LearningPathPageProps["progress"]) {
  return course.modules
    .flatMap((module) => module.lessons)
    .every((lesson) => progress[lesson.id]);
}

function getPrerequisiteNames(course: Course, courses: Course[]) {
  return (course.prerequisiteCourseIds ?? []).map((courseId) => {
    const match = courses.find((item) => item.id === courseId);
    return match ? match.title : courseId;
  });
}

function isCourseUnlocked(course: Course, courses: Course[], progress: LearningPathPageProps["progress"]) {
  const prerequisiteIds = course.prerequisiteCourseIds ?? [];
  return prerequisiteIds.every((prerequisiteId) => {
    const prerequisiteCourse = courses.find((item) => item.id === prerequisiteId);
    return prerequisiteCourse ? isCourseComplete(prerequisiteCourse, progress) : false;
  });
}

export default function LearningPathPage({ courses, learningPaths, progress }: LearningPathPageProps) {
  return (
    <section aria-labelledby="learning-paths-heading" className="page-content">
      <div className="page-header">
        <h2 id="learning-paths-heading">Rutas de aprendizaje</h2>
        <p>Revisa los caminos disponibles, los cursos desbloqueados y cuál es el siguiente paso permitido.</p>
      </div>

      {learningPaths.length === 0 ? (
        <div className="state-panel state-empty">No hay rutas de aprendizaje configuradas.</div>
      ) : (
        learningPaths.map((path) => {
          const pathCourses = path.courseIds
            .map((courseId) => courses.find((course) => course.id === courseId))
            .filter((course): course is Course => Boolean(course));

          const nextAllowedCourse = pathCourses.find(
            (course) => isCourseUnlocked(course, courses, progress) && !isCourseComplete(course, progress)
          );

          return (
            <article key={path.id} className="course-card">
              <div className="page-header">
                <h3>{path.title}</h3>
                <p>{path.description}</p>
              </div>

              <div className="path-summary">
                <strong>Próximo curso permitido:</strong>{" "}
                {nextAllowedCourse ? (
                  <Link to={`/cursos/${nextAllowedCourse.id}`} className="resource-button">
                    {nextAllowedCourse.title}
                  </Link>
                ) : (
                  "Ninguno por ahora. Completa los cursos desbloqueados para seguir avanzando."
                )}
              </div>

              <ol className="module-list">
                {pathCourses.map((course) => {
                  const progressStats = countCourseProgress(course, progress);
                  const unlocked = isCourseUnlocked(course, courses, progress);
                  const completed = isCourseComplete(course, progress);
                  const prerequisiteNames = getPrerequisiteNames(course, courses);

                  return (
                    <li key={course.id} className="module-item">
                      <div className="module-header">
                        <span className="module-title">
                          {course.title}
                          {completed ? " — Completado" : unlocked ? " — Desbloqueado" : " — Bloqueado"}
                        </span>
                      </div>
                      <p className="module-description">{course.summary}</p>
                      <ProgressBar
                        value={progressStats.percentage}
                        label={`Progreso del curso: ${progressStats.percentage}%`}
                      />
                      {completed ? null : unlocked ? (
                        <p className="lesson-locked-reason">Puedes avanzar en este curso ahora.</p>
                      ) : prerequisiteNames.length > 0 ? (
                        <p className="lesson-locked-reason">
                          Bloqueado por prerequisitos: {prerequisiteNames.join(", ")}.
                        </p>
                      ) : null}
                      <Link className="button" to={`/cursos/${course.id}`}>
                        Ver detalles
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </article>
          );
        })
      )}
    </section>
  );
}
