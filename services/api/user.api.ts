import apiClient from './client';

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  age?: number;
  gender?: 'male' | 'female';
  fcmToken?: string;
  notificationsEnabled: boolean;
}

export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await apiClient.get('/user/profile');
  return response.data;
};

export const updateUserProfile = async (
  data: Partial<UserProfile>
): Promise<{ success: boolean; user: UserProfile }> => {
  const response = await apiClient.put('/user/profile', data);
  return response.data;
};

export const updateNotificationSettings = async (
  enabled: boolean
): Promise<{ success: boolean; notificationsEnabled: boolean }> => {
  const response = await apiClient.patch('/user/notifications', { enabled });
  return response.data;
};
