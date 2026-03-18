import apiClient from './client';

export const saveChecklist = async (date: string, completedTaskIds: string[]) => {
  const response = await apiClient.post('/checklist', { date, completedTaskIds });
  return response.data;
};

export const getChecklist = async (date: string) => {
  const response = await apiClient.get(`/checklist/${date}`);
  return response.data;
};
