import { Landmark } from 'react-native-mediapipe';
import apiClient from './client';

export interface SaveScanPayload {
  landmarks: Landmark[];
  scores: {
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
  };
}

export const saveScan = async (payload: SaveScanPayload) => {
  const response = await apiClient.post('/scans', payload);
  return response.data;
};

export const getScans = async () => {
  const response = await apiClient.get('/scans');
  return response.data;
};

export const getScan = async (id: string) => {
  const response = await apiClient.get(`/scans/${id}`);
  return response.data;
};
