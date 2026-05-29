import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../features/auth/authStore";

export default function SignupPage() {
  const navigate = useNavigate();
  const signup = useAuthStore((s) => s.signup);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const result = signup(name, email, password);
    if (!result.success) {
      setError(result.message);
      return;
    }

    setMessage(result.message);
    navigate("/perfil");
  };

  return (
    <section className="page-content" aria-labelledby="signup-heading">
      <div className="page-header">
        <h2 id="signup-heading">Crear cuenta</h2>
        <p>Regístrate para guardar tu progreso, explorar rutas y acceder al chat IA personalizado.</p>
      </div>

      <form className="enrollment-form" onSubmit={handleSubmit}>
        <label className="form-label">
          Nombre completo
          <input
            className="form-input"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
          />
        </label>

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
            autoComplete="new-password"
          />
        </label>

        {error ? <p className="form-error">{error}</p> : null}
        {message ? <p className="form-success">{message}</p> : null}

        <button type="submit" className="button">
          Regístrate
        </button>
        <p className="form-meta">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>.
        </p>
      </form>
    </section>
  );
}
