import { Link, useNavigate, useParams } from "react-router-dom";
import type { Course, ProgressState } from "../types";
import LessonPlayer from "../components/LessonPlayer";

interface LessonPageProps {
  courses: Course[];
  progress: ProgressState["completedLessons"];
  onComplete: (lessonId: string) => void;
}

export default function LessonPage({ courses, progress, onComplete }: LessonPageProps) {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const course = courses.find((item) => item.id === courseId);

  if (!course || !lessonId) {
    return (
      <section className="page-content">
        <h2>Lección no encontrada</h2>
        <p>La lección solicitada no existe o no pertenece al curso actual.</p>
        <Link to="/" className="button">
          Volver al catálogo
        </Link>
      </section>
    );
  }

  const lesson = course.modules
    .flatMap((module) => module.lessons)
    .find((item) => item.id === lessonId);

  if (!lesson) {
    return (
      <section className="page-content">
        <h2>Lección no encontrada</h2>
        <p>El identificador de lección es inválido para este curso.</p>
        <button className="button" type="button" onClick={() => navigate(-1)}>
          Volver
        </button>
      </section>
    );
  }

  const lockedPrerequisites = lesson.blockedBy?.filter((id) => !progress[id]) ?? [];
  const isLocked = lockedPrerequisites.length > 0;

  return (
    <section className="page-content">
      <div className="page-header">
        <h2>{lesson.title}</h2>
        <p>{lesson.description}</p>
      </div>

      <div className="lesson-meta">
        <p>
          <strong>Curso:</strong> {course.title}
        </p>
        <p>
          <strong>Estado:</strong> {progress[lesson.id] ? "Completada" : isLocked ? "Bloqueada" : "Pendiente"}
        </p>
      </div>

      {isLocked ? (
        <div className="status-banner status-banner-blocked">
          <strong>Esta lección está bloqueada.</strong> Completa primero las siguientes lecciones:
          <ul>
            {lockedPrerequisites.map((prerequisiteId) => {
              const prerequisite = course.modules
                .flatMap((module) => module.lessons)
                .find((item) => item.id === prerequisiteId);
              return <li key={prerequisiteId}>{prerequisite?.title ?? prerequisiteId}</li>;
            })}
          </ul>
        </div>
      ) : null}

      <LessonPlayer lesson={lesson} onComplete={() => onComplete(lesson.id)} isLocked={isLocked} />

      <div className="lesson-navigation">
        <button className="button" type="button" onClick={() => navigate(-1)}>
          Volver al curso
        </button>
        <Link to="/" className="button button-secondary">
          Ir al catálogo
        </Link>
      </div>
    </section>
  );
}
