import React, { useState } from "react";
import { useChatStore } from "../features/chat/chatStore";

export default function ChatBox() {
  const [text, setText] = useState("");
  const messages = useChatStore((s) => s.messages);
  const blocked = useChatStore((s) => s.blocked);
  const addMessage = useChatStore((s) => s.addMessage);

  const send = () => {
    if (!text.trim()) return;
    const userMsg = { id: `u-${Date.now()}`, role: "user" as const, text: text.trim(), createdAt: new Date().toISOString() };
    addMessage(userMsg);
    setText("");

    // Simulate assistant response (no external API calls here)
    setTimeout(() => {
      const reply = {
        id: `a-${Date.now()}`,
        role: "assistant" as const,
        text: "Respuesta automatizada: aún no está habilitado el asistente IA en la app local.",
        createdAt: new Date().toISOString(),
      };
      addMessage(reply);
    }, 700);
  };

  return (
    <div className="chat-box">
      {blocked ? (
        <div role="status" className="chat-blocked">El chat está bloqueado para este flujo.</div>
      ) : null}

      <div className="chat-history" aria-live="polite">
        {messages.map((m) => (
          <div key={m.id} className={`chat-line chat-${m.role}`}>
            <strong>{m.role === "user" ? "Tú" : m.role === "assistant" ? "Asistente" : "Sistema"}:</strong>{" "}
            <span>{m.text}</span>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <textarea value={text} onChange={(e) => setText(e.target.value)} disabled={blocked} rows={3} />
        <button onClick={send} disabled={blocked}>Enviar</button>
      </div>
    </div>
  );
}
