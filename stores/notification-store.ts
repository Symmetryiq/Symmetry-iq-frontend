import {
  getNotifications,
  getUnreadCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  Notification,
  registerPushToken,
} from '@/services/api/notification.api';
import { updateNotificationSettings } from '@/services/api/user.api';
import {
  registerForPushNotificationsAsync,
  setBadgeCount,
} from '@/services/notifications';
import { create } from 'zustand';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  tokenRegistered: boolean;
  notificationsEnabled: boolean;

  // Actions
  registerToken: () => Promise<void>;
  fetchNotifications: (refresh?: boolean) => Promise<void>;
  loadMore: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
  toggleNotifications: (enabled: boolean) => Promise<void>;
  clearError: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  page: 1,
  hasMore: true,
  tokenRegistered: false,

  registerToken: async () => {
    try {
      const token = await registerForPushNotificationsAsync();

      if (token) {
        await registerPushToken(token);
        set({ tokenRegistered: true });
      }
    } catch (error: any) {
      console.error('Failed to register push token:', error.message);
    }
  },

  fetchNotifications: async (refresh = false) => {
    const state = get();
    if (state.loading && !refresh) return;

    set({ loading: true, error: null });

    try {
      const page = refresh ? 1 : state.page;
      const response = await getNotifications(page);

      set({
        notifications: refresh
          ? response.notifications
          : [...state.notifications, ...response.notifications],
        unreadCount: response.unreadCount,
        page: page + 1,
        hasMore: page < response.pagination.pages,
        loading: false,
      });

      // Update badge count
      await setBadgeCount(response.unreadCount);
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  loadMore: async () => {
    const state = get();
    if (state.loading || !state.hasMore) return;
    await get().fetchNotifications(false);
  },

  markAsRead: async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);

      set((state) => {
        const updatedNotifications = state.notifications.map((n) =>
          n._id === notificationId ? { ...n, read: true } : n
        );
        const newUnreadCount = Math.max(0, state.unreadCount - 1);

        // Update badge
        setBadgeCount(newUnreadCount);

        return {
          notifications: updatedNotifications,
          unreadCount: newUnreadCount,
        };
      });
    } catch (error: any) {
      console.error('Failed to mark notification as read:', error.message);
    }
  },

  markAllAsRead: async () => {
    try {
      await markAllNotificationsAsRead();

      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      }));

      await setBadgeCount(0);
    } catch (error: any) {
      console.error('Failed to mark all as read:', error.message);
    }
  },

  refreshUnreadCount: async () => {
    try {
      const count = await getUnreadCount();
      set({ unreadCount: count });
      await setBadgeCount(count);
    } catch (error: any) {
      console.error('Failed to refresh unread count:', error.message);
    }
  },

  notificationsEnabled: true,

  // ... existing code ...

  toggleNotifications: async (enabled: boolean) => {
    try {
      set({ notificationsEnabled: enabled });
      // Call API to persist
      await updateNotificationSettings(enabled);
    } catch (error: any) {
      // Revert on error
      set((state) => ({
        notificationsEnabled: !enabled,
        error: error.message,
      }));
      console.error('Failed to toggle notifications:', error);
    }
  },

  // Initialize store with profile data if needed
  initialize: async () => {
    try {
      // logic to fetch initial setting could go here
    } catch (error) {}
  },

  clearError: () => set({ error: null }),
}));
