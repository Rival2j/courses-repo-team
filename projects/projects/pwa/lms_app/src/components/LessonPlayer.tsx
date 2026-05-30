import { useMemo, useState } from "react";
import type { Lesson, Resource } from "../types";

interface LessonPlayerProps {
  lesson: Lesson;
  onComplete: () => void;
  isLocked?: boolean;
}

const formatResourceLabel = (resource: Resource) => `${resource.title} (${resource.type})`;

export default function LessonPlayer({ lesson, onComplete, isLocked = false }: LessonPlayerProps) {
  const [selectedResource, setSelectedResource] = useState<Resource>(lesson.resources[0]);
  const [resourceFeedback, setResourceFeedback] = useState(
    "Selecciona un recurso para recibir retroalimentación de consumo y estado."
  );

  const viewer = useMemo(() => {
    switch (selectedResource.type) {
      case "video":
        return (
          <video controls className="resource-viewer">
            <source src={selectedResource.source} type="video/mp4" />
            Tu navegador no soporta video HTML5.
          </video>
        );
      case "document":
        return (
          <iframe
            className="resource-viewer"
            src={selectedResource.source}
            title={selectedResource.title}
            aria-label={selectedResource.description}
          />
        );
      case "iframe":
        return (
          <iframe
            className="resource-viewer"
            src={selectedResource.source}
            title={selectedResource.title}
            aria-label={selectedResource.description}
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        );
      default:
        return <p>Tipo de recurso no soportado.</p>;
    }
  }, [selectedResource]);

  const handleSelectResource = (resource: Resource) => {
    setSelectedResource(resource);
    setResourceFeedback(
      `Recurso seleccionado: ${resource.title}. Tipo de consumo: ${resource.type}.` +
        " Puedes cambiar entre recursos para comparar consumo visual."
    );
  };

  return (
    <section className="lesson-player" aria-labelledby="player-heading">
      <div className="player-header">
        <h3 id="player-heading">Reproductor de lección</h3>
        <p>{lesson.description}</p>
      </div>

      <div className="resource-selector" role="group" aria-label="Selector de recurso">
        {lesson.resources.map((resource) => (
          <button
            key={resource.id}
            type="button"
            className={resource.id === selectedResource.id ? "resource-button active" : "resource-button"}
            onClick={() => handleSelectResource(resource)}
            disabled={isLocked}
            aria-pressed={resource.id === selectedResource.id}
          >
            {formatResourceLabel(resource)}
          </button>
        ))}
      </div>

      <div className="resource-feedback-panel">
        <p>{resourceFeedback}</p>
        <p className="resource-meta">
          Recurso actual: <strong>{selectedResource.title}</strong> — {selectedResource.type}
        </p>
      </div>

      <div className="resource-details">
        <p>{selectedResource.description}</p>
        {isLocked ? (
          <p className="resource-locked">
            Esta lección está bloqueada. Completa primero las lecciones requeridas para desbloquear el contenido.
          </p>
        ) : (
          viewer
        )}
      </div>

      <button
        className="button button-primary"
        type="button"
        onClick={onComplete}
        disabled={isLocked}
      >
        {isLocked ? "Lección bloqueada" : "Marcar lección como completada"}
      </button>
    </section>
  );
}
