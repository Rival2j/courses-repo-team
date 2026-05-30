import React from 'react';
import { useAuthStore } from '../features/auth/authStore';

export default function AdminPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div style={{padding:20}}>
      <h1>Panel Administrativo</h1>
      <p>Sección para gestionar roles, configuraciones y moderación de contenido.</p>

      <section style={{marginTop:20}}>
        <h2>Acciones rápidas</h2>
        <ul>
          <li>Gestionar roles de usuario</li>
          <li>Ajustes de la plataforma</li>
          <li>Moderación de recursos y comentarios</li>
        </ul>
      </section>

      <section style={{marginTop:20}}>
        <h2>Usuario actual</h2>
        {user ? (
          <div>
            <div><strong>id:</strong> {user.id}</div>
            <div><strong>email:</strong> {user.email || '—'}</div>
            <div><strong>nombre:</strong> {user.name || user.displayName || '—'}</div>
          </div>
        ) : (
          <div>No hay sesión activa</div>
        )}
      </section>
    </div>
  );
}
