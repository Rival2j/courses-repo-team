import type { ReactNode } from "react";

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
        <div>
          <h1>LMS PWA TEAM-02</h1>
          <p className="subtitle">Aplicación con contrato de datos desacoplado, shell de estados y navegación por feature.</p>
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
