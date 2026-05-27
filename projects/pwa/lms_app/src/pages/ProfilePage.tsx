import React from "react";
import { useCourseProgressStore } from "../features/course/courseStore";
import AchievementList from "../components/AchievementList";

export default function ProfilePage() {
  const xp = useCourseProgressStore((s) => s.xp);
  const level = useCourseProgressStore((s) => s.level);
  const badges = useCourseProgressStore((s) => s.badges);
  const trophies = useCourseProgressStore((s) => s.trophies);

  return (
    <div>
      <h1>Perfil</h1>
      <section>
        <h2>Progreso</h2>
        <p>XP acumulada: <strong>{xp}</strong></p>
        <p>Nivel: <strong>{level}</strong></p>
      </section>

      <AchievementList badges={badges} trophies={trophies} />

      <section>
        <h2>Certificados</h2>
        <p>No hay certificados emitidos aún.</p>
      </section>
    </div>
  );
}
