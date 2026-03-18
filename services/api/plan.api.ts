import apiClient from './client';

const normalizeId = (data: any): any => {
  if (Array.isArray(data)) return data.map(normalizeId);
  if (data && typeof data === 'object') {
    const { _id, ...rest } = data;
    const normalized = _id ? { id: _id, ...rest } : rest;
    for (const key in normalized) {
      if (typeof normalized[key] === 'object') {
        normalized[key] = normalizeId(normalized[key]);
      }
    }
    return normalized;
  }
  return data;
};

/** Sync a locally-generated plan to the backend for persistence */
export const syncPlan = async (plan: any) => {
  const response = await apiClient.post('/plans/sync', plan);
  return normalizeId(response.data);
};

/** Fetch the current active plan from backend (for hydration after reinstall) */
export const fetchRemotePlan = async () => {
  const response = await apiClient.get('/plans/current');
  return normalizeId(response.data);
};

/** Get routine assignments + completion for a specific date */
export const getRoutinesForDate = async (planId: string, date: string) => {
  const response = await apiClient.get(`/plans/${planId}/routines/${date}`);
  return normalizeId(response.data);
};

/** Sync a routine completion to backend */
export const syncRoutineComplete = async (
  planId: string,
  routineId: string,
  date: string,
  durationSeconds?: number,
) => {
  const response = await apiClient.patch(
    `/plans/${planId}/routines/${routineId}/complete`,
    { date, ...(durationSeconds !== undefined && { durationSeconds }) },
  );
  return normalizeId(response.data);
};
