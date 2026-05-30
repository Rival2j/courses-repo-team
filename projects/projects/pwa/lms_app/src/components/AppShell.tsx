import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { UserProfile } from "./UserProfile";
import NotificationBell from "./NotificationBell";

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
      <a href="#main-content" className="skip-link">Saltar al contenido</a>
      <header className="app-header">
        <div className="app-header-brand">
          <h1>LMS</h1>
        </div>
        <nav className="app-nav" aria-label="Navegación principal">
          <Link to="/">Catálogo</Link>
          <Link to="/rutas">Rutas de aprendizaje</Link>
          <Link to="/perfil">Perfil</Link>
          <Link to="/chat">Chat IA</Link>
        </nav>
        <div className="app-header-profile">
          <NotificationBell />
          <UserProfile />
        </div>
      </header>

      {isOffline ? (
        <div className="app-banner app-banner-offline">
          Estás offline. La navegación se limita a contenido cargado en memoria.
        </div>
      ) : null}

      <main id="main-content" role="main" tabIndex={-1}>
        {isLoading ? (
          <div className="state-panel state-loading" role="status" aria-live="polite">Cargando el catálogo de cursos...</div>
        ) : isError ? (
          <div className="state-panel state-error" role="alert">
            <strong>Error:</strong> {errorText ?? "No fue posible cargar los datos."}
          </div>
        ) : emptyState ? (
          <div className="state-panel state-empty" role="status">{emptyText ?? "No hay contenido disponible actualmente."}</div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}
