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

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  items: [],
  addNotification: (n) => set((s) => ({ items: [n, ...s.items] })),
  markRead: (id) => set((s) => ({ items: s.items.map((i) => (i.id === id ? { ...i, read: true } : i)) })),
  markAllRead: () => set((s) => ({ items: s.items.map((i) => ({ ...i, read: true })) })),
  unreadCount: () => get().items.filter((i) => !i.read).length,
}));
