import apiClient from './client';

export const generatePlan = async (scanId: string) => {
  const response = await apiClient.post('/plans/generate', { scanId });
  return response.data;
};

export const getCurrentPlan = async () => {
  const response = await apiClient.get('/plans/current');
  return response.data;
};

export const getRoutinesForDate = async (planId: string, date: string) => {
  const response = await apiClient.get(`/plans/${planId}/routines/${date}`);
  return response.data;
};

export const markRoutineComplete = async (planId: string, routineId: string, date?: string) => {
  const response = await apiClient.patch(`/plans/${planId}/routines/${routineId}/complete`, { date });
  return response.data;
};
