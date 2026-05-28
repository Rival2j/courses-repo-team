import { useState } from "react";
import { User, LogOut, Settings } from "lucide-react";

interface UserProfileProps {
  userName?: string;
  userEmail?: string;
  onLogout?: () => void;
}

export function UserProfile({ userName = "Usuario", userEmail = "usuario@ejemplo.com", onLogout }: UserProfileProps) {
  const [showMenu, setShowMenu] = useState(false);

  const initials = userName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="user-profile">
      <button
        type="button"
        className="user-avatar-button"
        onClick={() => setShowMenu(!showMenu)}
        aria-label="Menú de usuario"
        aria-expanded={showMenu}
      >
        <div className="user-avatar">{initials}</div>
      </button>

      {showMenu && (
        <div className="user-menu" role="menu">
          <div className="user-menu-header">
            <div className="user-avatar user-avatar-menu">{initials}</div>
            <div>
              <p className="user-menu-name">{userName}</p>
              <p className="user-menu-email">{userEmail}</p>
            </div>
          </div>

          <div className="user-menu-divider" />

          <button type="button" className="user-menu-item" role="menuitem" onClick={() => setShowMenu(false)}>
            <Settings size={16} />
            Configuración
          </button>

          <div className="user-menu-divider" />

          <button
            type="button"
            className="user-menu-item user-menu-item-danger"
            role="menuitem"
            onClick={() => {
              onLogout?.();
              setShowMenu(false);
            }}
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
