import create from "zustand";

export interface NotificationItem {
  id: string;
  title: string;
  body?: string;
  createdAt: string;
  read?: boolean;
}

interface NotificationsState {
  items: NotificationItem[];
  addNotification: (n: NotificationItem) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  unreadCount: () => number;
}

const NOTIFICATIONS_KEY = "lms-notifications";

function loadNotifications(): NotificationItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(NOTIFICATIONS_KEY);
    return raw ? (JSON.parse(raw) as NotificationItem[]) : [];
  } catch {
    return [];
  }
}

function persistNotifications(items: NotificationItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(items));
  } catch {
    // ignore write errors
  }
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  items: loadNotifications(),
  addNotification: (n) =>
    set((s) => {
      const updatedItems = [n, ...s.items];
      persistNotifications(updatedItems);
      return { items: updatedItems };
    }),
  markRead: (id) =>
    set((s) => {
      const updatedItems = s.items.map((i) => (i.id === id ? { ...i, read: true } : i));
      persistNotifications(updatedItems);
      return { items: updatedItems };
    }),
  markAllRead: () =>
    set((s) => {
      const updatedItems = s.items.map((i) => ({ ...i, read: true }));
      persistNotifications(updatedItems);
      return { items: updatedItems };
    }),
  unreadCount: () => get().items.filter((i) => !i.read).length,
}));
