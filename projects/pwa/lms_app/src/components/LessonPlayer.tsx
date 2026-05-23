import { useMemo, useState } from "react";
import type { Lesson, Resource } from "../types";

interface LessonPlayerProps {
  lesson: Lesson;
  onComplete: () => void;
}

const formatResourceLabel = (resource: Resource) => `${resource.title} (${resource.type})`;

export default function LessonPlayer({ lesson, onComplete }: LessonPlayerProps) {
  const [selectedResource, setSelectedResource] = useState<Resource>(lesson.resources[0]);

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
            onClick={() => setSelectedResource(resource)}
          >
            {formatResourceLabel(resource)}
          </button>
        ))}
      </div>

      <div className="resource-details">
        <p>{selectedResource.description}</p>
        {viewer}
      </div>

      <button className="button button-primary" type="button" onClick={onComplete}>
        Marcar lección como completada
      </button>
    </section>
  );
}
