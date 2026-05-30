import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../features/auth/authStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Ingresa email y contraseña para continuar.");
      return;
    }

    const success = login(email, password);
    if (success) {
      navigate("/perfil");
      return;
    }

    setError("No se encontró una cuenta válida con esas credenciales.");
  };

  return (
    <section className="page-content" aria-labelledby="login-heading">
      <div className="page-header">
        <h2 id="login-heading">Iniciar sesión</h2>
        <p>Accede a tu cuenta para sincronizar progresos, recibir notificaciones y usar el chat del asistente.</p>
      </div>

      <form className="enrollment-form" onSubmit={handleSubmit}>
        <p className="form-meta">Usuario demo: <strong>demo@lms.local</strong> / Contraseña: <strong>Demo1234</strong></p>
        <label className="form-label">
          Correo electrónico
          <input
            className="form-input"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
          />
        </label>

        <label className="form-label">
          Contraseña
          <input
            className="form-input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />
        </label>

        {error ? <p className="form-error">{error}</p> : null}

        <button type="submit" className="button">
          Iniciar sesión
        </button>
        <p className="form-meta">
          ¿No tienes cuenta? <Link to="/registrarse">Regístrate aquí</Link>.
        </p>
      </form>
    </section>
  );
}
