import React from "react";

interface AchievementListProps {
  badges: string[];
  trophies: string[];
}

export default function AchievementList({ badges, trophies }: AchievementListProps) {
  return (
    <section aria-labelledby="achievements-title">
      <h2 id="achievements-title">Logros</h2>
      <div className="achievements-grid">
        <div>
          <h3>Insignias</h3>
          {badges.length === 0 ? <p>No tienes insignias aún.</p> : (
            <ul>
              {badges.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h3>Trofeos</h3>
          {trophies.length === 0 ? <p>No tienes trofeos aún.</p> : (
            <ul>
              {trophies.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
