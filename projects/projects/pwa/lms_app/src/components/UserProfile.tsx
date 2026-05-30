import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, Settings, LogIn, UserPlus } from "lucide-react";
import { useAuthStore } from "../features/auth/authStore";

export function UserProfile() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [showMenu, setShowMenu] = useState(false);

  const userName = user?.name ?? "Visitante";
  const userEmail = user?.email ?? "invitado@lms.local";

  const initials = userName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    logout();
    setShowMenu(false);
    navigate("/");
  };

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
              <p className="user-menu-name">{user ? userName : "Bienvenido"}</p>
              <p className="user-menu-email">{user ? userEmail : "Inicia sesión para personalizar la experiencia."}</p>
            </div>
          </div>

          <div className="user-menu-divider" />

          {user ? (
            <>
              <Link to="/perfil" className="user-menu-item" role="menuitem" onClick={() => setShowMenu(false)}>
                <Settings size={16} />
                Mi perfil
              </Link>
              <button
                type="button"
                className="user-menu-item user-menu-item-danger"
                role="menuitem"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="user-menu-item"
                role="menuitem"
                onClick={() => {
                  setShowMenu(false);
                  navigate("/login");
                }}
              >
                <LogIn size={16} />
                Iniciar sesión
              </button>
              <button
                type="button"
                className="user-menu-item"
                role="menuitem"
                onClick={() => {
                  setShowMenu(false);
                  navigate("/registrarse");
                }}
              >
                <UserPlus size={16} />
                Crear cuenta
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
