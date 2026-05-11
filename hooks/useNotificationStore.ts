import { zustandStorage } from '@/utils/storage.util';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  data: Record<string, unknown>;
  receivedAt: string;
  read: boolean;
};

type NotificationState = {
  items: NotificationItem[];
  pushToken: string | null;
};

type NotificationActions = {
  addItem: (item: Omit<NotificationItem, 'read'>) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
  setPushToken: (token: string | null) => void;
  reset: () => void;
};

const INITIAL: NotificationState = {
  items: [],
  pushToken: null,
};

const MAX_ITEMS = 100;

export const useNotificationStore = create<
  NotificationState & NotificationActions
>()(
  persist(
    (set) => ({
      ...INITIAL,

      addItem: (item) =>
        set((s) => {
          if (s.items.some((existing) => existing.id === item.id)) return s;
          const next = [{ ...item, read: false }, ...s.items];
          return { items: next.slice(0, MAX_ITEMS) };
        }),

      markRead: (id) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, read: true } : i)),
        })),

      markAllRead: () =>
        set((s) => ({ items: s.items.map((i) => ({ ...i, read: true })) })),

      clearAll: () => set({ items: [] }),

      setPushToken: (token) => set({ pushToken: token }),

      reset: () => set(INITIAL),
    }),
    {
      name: 'symmetryiq.notifications',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

export function getUnreadCount(items: NotificationItem[]): number {
  return items.reduce((acc, i) => (i.read ? acc : acc + 1), 0);
}
