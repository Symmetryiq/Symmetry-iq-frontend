import apiClient from './client';

export interface ChecklistTask {
  title: string;
  description: string;
  completed: boolean;
}

export const saveChecklist = async (date: string, tasks: ChecklistTask[]) => {
  const response = await apiClient.post('/checklist', { date, tasks });
  return response.data;
};

export const getChecklist = async (date: string) => {
  const response = await apiClient.get(`/checklist/${date}`);
  return response.data;
};
