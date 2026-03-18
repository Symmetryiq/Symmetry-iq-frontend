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

export interface Scores {
  overallSymmetry: number;
  eyeAlignment: number;
  noseCentering: number;
  facialPuffiness: number;
  skinClarity: number;
  chinAlignment: number;
  facialThirds: number;
  jawlineSymmetry: number;
  cheekboneBalance: number;
  eyebrowSymmetry: number;
}

export interface SaveScanPayload {
  scores: Scores;
}

export const saveScan = async (payload: SaveScanPayload) => {
  const response = await apiClient.post('/scans', payload);
  return normalizeId(response.data);
};

export const getScans = async () => {
  const response = await apiClient.get('/scans');
  return normalizeId(response.data);
};

export const getScan = async (id: string) => {
  const response = await apiClient.get(`/scans/${id}`);
  return normalizeId(response.data);
};
