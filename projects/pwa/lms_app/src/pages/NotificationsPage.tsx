import React from "react";
import { useNotificationsStore } from "../features/notifications/notificationsStore";

export default function NotificationsPage() {
  const items = useNotificationsStore((s) => s.items);
  const markRead = useNotificationsStore((s) => s.markRead);
  const markAllRead = useNotificationsStore((s) => s.markAllRead);

  return (
    <div>
      <h1>Notificaciones</h1>
      <button onClick={markAllRead}>Marcar todas como leídas</button>
      <ul>
        {items.length === 0 ? (
          <li>No hay notificaciones.</li>
        ) : (
          items.map((n) => (
            <li key={n.id} className={n.read ? "read" : "unread"}>
              <strong>{n.title}</strong>
              <p>{n.body}</p>
              <small>{new Date(n.createdAt).toLocaleString()}</small>
              {!n.read && <button onClick={() => markRead(n.id)}>Marcar leída</button>}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
