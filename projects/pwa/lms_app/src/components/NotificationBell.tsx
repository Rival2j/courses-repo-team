import React from "react";
import { Link } from "react-router-dom";
import { useNotificationsStore } from "../features/notifications/notificationsStore";

export default function NotificationBell() {
  const unread = useNotificationsStore((s) => s.unreadCount());

  return (
    <Link to="/notificaciones" aria-label={`Notificaciones (${unread})`} className="notification-bell">
      🔔
      {unread > 0 && <span className="badge">{unread}</span>}
    </Link>
  );
}
