import apiClient from './client';

export const getUserProfile = async () => {
  const response = await apiClient.get('/user/profile');
  return response.data;
};

export const updateUserProfile = async (data: any) => {
  const response = await apiClient.patch('/user/profile', data);
  return response.data;
};
