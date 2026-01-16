import apiClient from './client';

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  unreadCount: number;
}

/**
 * Register FCM push token with backend
 */
export const registerPushToken = async (fcmToken: string): Promise<void> => {
  await apiClient.post('/notifications/register', { fcmToken });
};

/**
 * Fetch user's notifications
 */
export const getNotifications = async (
  page: number = 1,
  limit: number = 20
): Promise<NotificationsResponse> => {
  const response = await apiClient.get('/notifications', {
    params: { page, limit },
  });
  return response.data;
};

/**
 * Get unread notification count
 */
export const getUnreadCount = async (): Promise<number> => {
  const response = await apiClient.get('/notifications/unread-count');
  return response.data.unreadCount;
};

/**
 * Mark a notification as read
 */
export const markNotificationAsRead = async (
  notificationId: string
): Promise<Notification> => {
  const response = await apiClient.patch(
    `/notifications/${notificationId}/read`
  );
  return response.data.notification;
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = async (): Promise<void> => {
  await apiClient.patch('/notifications/read-all');
};
