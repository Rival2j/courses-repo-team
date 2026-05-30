import { useState } from "react";
import { AlertCircle, CheckCircle2, Lock, Mail, User, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Session } from "@supabase/supabase-js";
import { loginWithEmail, registerWithEmail } from "./authService";

const registerBaseSchema = z.object({
  displayName: z.string().trim().min(2, "Ingresa al menos 2 caracteres."),
  email: z.string().trim().email("Ingresa un correo válido."),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
  passwordConfirmation: z.string().min(8, "Confirma tu contraseña."),
});

const registerSchema = registerBaseSchema.refine((value) => value.password === value.passwordConfirmation, {
  path: ["passwordConfirmation"],
  message: "Las contraseñas no coinciden.",
});

const loginSchema = registerBaseSchema.pick({
  email: true,
  password: true,
});

type RegisterFormValues = z.infer<typeof registerSchema>;
type LoginFormValues = z.infer<typeof loginSchema>;
type AuthMode = "register" | "login";

interface AuthPageProps {
  onAuthenticated: (session: Session) => void;
}

export function AuthPage({ onAuthenticated }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>("register");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const schema = mode === "register" ? registerSchema : loginSchema;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setErrorMessage(null);
    setStatusMessage(null);
    reset({
      displayName: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    });
  };

  const onSubmit = async (values: RegisterFormValues) => {
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      if (mode === "register") {
        const session = await registerWithEmail(values);

        if (session) {
          onAuthenticated(session);
          return;
        }

        setStatusMessage("Revisa tu correo para confirmar la cuenta antes de iniciar sesión.");
        return;
      }

      const session = await loginWithEmail(values as LoginFormValues);
      onAuthenticated(session);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No fue posible completar la autenticación.",
      );
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="auth-title">
        <div className="auth-copy">
          <p className="auth-eyebrow">LMS institucional</p>
          <h1 id="auth-title">Acceso a la plataforma</h1>
          <p>
            Inicia sesión para cargar tu catálogo, progreso y evaluaciones con
            una sesión de Supabase protegida por token.
          </p>
        </div>

        <div className="auth-form-shell">
          <div className="auth-mode-switch" role="tablist" aria-label="Modo de autenticación">
            <button
              type="button"
              className={mode === "register" ? "auth-mode active" : "auth-mode"}
              onClick={() => switchMode("register")}
              role="tab"
              aria-selected={mode === "register"}
            >
              Crear cuenta
            </button>
            <button
              type="button"
              className={mode === "login" ? "auth-mode active" : "auth-mode"}
              onClick={() => switchMode("login")}
              role="tab"
              aria-selected={mode === "login"}
            >
              Entrar
            </button>
          </div>

          {errorMessage ? (
            <div className="auth-alert auth-alert-error" role="alert">
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          ) : null}

          {statusMessage ? (
            <div className="auth-alert auth-alert-success" role="status">
              <CheckCircle2 size={18} />
              <span>{statusMessage}</span>
            </div>
          ) : null}

          <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            {mode === "register" ? (
              <label className="form-label auth-field">
                Nombre de usuario
                <span className="auth-input-wrapper">
                  <User size={18} aria-hidden="true" />
                  <input
                    className="form-input auth-input"
                    type="text"
                    autoComplete="name"
                    {...register("displayName")}
                  />
                </span>
                {errors.displayName ? (
                  <span className="form-error">{errors.displayName.message}</span>
                ) : null}
              </label>
            ) : null}

            <label className="form-label auth-field">
              Correo electrónico
              <span className="auth-input-wrapper">
                <Mail size={18} aria-hidden="true" />
                <input
                  className="form-input auth-input"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                />
              </span>
              {errors.email ? (
                <span className="form-error">{errors.email.message}</span>
              ) : null}
            </label>

            <label className="form-label auth-field">
              Contraseña
              <span className="auth-input-wrapper">
                <Lock size={18} aria-hidden="true" />
                <input
                  className="form-input auth-input"
                  type="password"
                  autoComplete={mode === "register" ? "new-password" : "current-password"}
                  {...register("password")}
                />
              </span>
              {errors.password ? (
                <span className="form-error">{errors.password.message}</span>
              ) : null}
            </label>

            {mode === "register" ? (
              <label className="form-label auth-field">
                Confirmar contraseña
                <span className="auth-input-wrapper">
                  <Lock size={18} aria-hidden="true" />
                  <input
                    className="form-input auth-input"
                    type="password"
                    autoComplete="new-password"
                    {...register("passwordConfirmation")}
                  />
                </span>
                {errors.passwordConfirmation ? (
                  <span className="form-error">{errors.passwordConfirmation.message}</span>
                ) : null}
              </label>
            ) : null}

            <button className="button button-primary auth-submit" type="submit" disabled={isSubmitting}>
              <UserPlus size={18} aria-hidden="true" />
              {isSubmitting
                ? "Validando..."
                : mode === "register"
                ? "Crear cuenta"
                : "Entrar"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
