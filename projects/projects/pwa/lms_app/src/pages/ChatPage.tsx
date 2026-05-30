import { useEffect } from "react";
import { Link } from "react-router-dom";
import ChatBox from "../components/ChatBox";
import { useChatStore } from "../features/chat/chatStore";
import { useAuthStore } from "../features/auth/authStore";

export default function ChatPage() {
  const setBlocked = useChatStore((s) => s.setBlocked);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    setBlocked(!Boolean(user));
    return () => {
      setBlocked(false);
    };
  }, [setBlocked, user]);

  return (
    <section className="page-content">
      <div className="page-header">
        <h2>Asistente de Chat (IA)</h2>
        <p>El asistente IA ofrece respuestas de guía de curso y contexto personalizado mientras estés autenticado.</p>
      </div>

      {!user ? (
        <div className="state-panel state-empty">
          <p>Inicia sesión para activar el chat y recibir soporte adaptado a tu progreso.</p>
          <Link to="/login" className="button">
            Iniciar sesión
          </Link>
        </div>
      ) : (
        <ChatBox />
      )}
    </section>
  );
}
