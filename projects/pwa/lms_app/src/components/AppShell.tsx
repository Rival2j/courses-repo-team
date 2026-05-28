import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { UserProfile } from "./UserProfile";

interface AppShellProps {
  children: ReactNode;
  isOffline: boolean;
  isLoading: boolean;
  isError: boolean;
  emptyState: boolean;
  errorText?: string;
  emptyText?: string;
}

export function AppShell({
  children,
  isOffline,
  isLoading,
  isError,
  emptyState,
  errorText,
  emptyText,
}: AppShellProps) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-brand">
          <h1>LMS</h1>
        </div>
        <nav className="app-nav" aria-label="Navegación principal">
          <Link to="/">Catálogo</Link>
          <Link to="/rutas">Rutas de aprendizaje</Link>
        </nav>
        <div className="app-header-profile">
          <UserProfile userName="Estudiante Usuario" userEmail="usuario@lms.edu" />
        </div>
      </header>

      {isOffline ? (
        <div className="app-banner app-banner-offline">
          Estás offline. La navegación se limita a contenido cargado en memoria.
        </div>
      ) : null}

      <main>
        {isLoading ? (
          <div className="state-panel state-loading">Cargando el catálogo de cursos...</div>
        ) : isError ? (
          <div className="state-panel state-error">
            <strong>Error:</strong> {errorText ?? "No fue posible cargar los datos."}
          </div>
        ) : emptyState ? (
          <div className="state-panel state-empty">{emptyText ?? "No hay contenido disponible actualmente."}</div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}
