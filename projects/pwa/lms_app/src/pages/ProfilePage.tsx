import { Link } from "react-router-dom";
import { useCourseProgressStore } from "../features/course/courseStore";
import { useAuthStore } from "../features/auth/authStore";
import AchievementList from "../components/AchievementList";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const xp = useCourseProgressStore((s) => s.xp);
  const level = useCourseProgressStore((s) => s.level);
  const badges = useCourseProgressStore((s) => s.badges);
  const trophies = useCourseProgressStore((s) => s.trophies);

  if (!user) {
    return (
      <section className="page-content">
        <div className="page-header">
          <h2>Perfil</h2>
          <p>Inicia sesión para acceder a tu progreso, logros y recomendaciones personales.</p>
        </div>
        <div className="state-panel state-empty">
          <p>Necesitas una cuenta para ver tu perfil.</p>
          <Link to="/login" className="button">
            Iniciar sesión
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page-content" aria-labelledby="profile-heading">
      <div className="page-header">
        <h2 id="profile-heading">Perfil de {user.name}</h2>
        <p>Tu panel de aprendizaje personalizado.</p>
      </div>

      <section className="course-detail">
        <div>
          <h3>Cuenta</h3>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Rol:</strong> Estudiante
          </p>
        </div>

        <div>
          <h3>Estado de aprendizaje</h3>
          <p>XP acumulada: <strong>{xp}</strong></p>
          <p>Nivel: <strong>{level}</strong></p>
          <p>Progreso actual: tu experiencia se refresca cada vez que completas lecciones.</p>
        </div>
      </section>

      <AchievementList badges={badges} trophies={trophies} />

      <section>
        <h2>Certificados</h2>
        <p>No hay certificados emitidos aún. Completa cursos clave para desbloquear certificados verificables.</p>
      </section>
    </section>
  );
}
