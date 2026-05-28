import React from "react";
import ChatBox from "../components/ChatBox";
import { useChatStore } from "../features/chat/chatStore";

export default function ChatPage() {
  const setBlocked = useChatStore((s) => s.setBlocked);

  // Example: block chat in sensitive flows (the UI can toggle)
  React.useEffect(() => {
    // By default allow chat; components can set blocked=true when entering restricted flows
    setBlocked(false);
    return () => setBlocked(false);
  }, [setBlocked]);

  return (
    <div>
      <h1>Asistente de Chat (IA)</h1>
      <p>El asistente IA está disponible en modo demostración local. No se envían mensajes a servicios externos.</p>
      <ChatBox />
    </div>
  );
}
