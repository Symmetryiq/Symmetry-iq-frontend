import { SCORING_API_URL } from '@/constants';
import axios, { isAxiosError } from 'axios';
import {
  faceLandmarkDetectionOnImage,
  Landmark,
  type FaceLandmarkDetectionResultBundle,
} from 'react-native-mediapipe';
import { getValidJWTToken } from './analyze';

export const getLandmarks = async (imagePath: string): Promise<Landmark[]> => {
  try {
    const result: FaceLandmarkDetectionResultBundle =
      await faceLandmarkDetectionOnImage(
        imagePath,
        'mediapipe/face_landmarker.task'
      );

    if (result.results.length <= 0) throw new Error('No Face Detected');

    const initialResult = result.results[0];
    const facialLandmarks =
      initialResult.faceLandmarks.length >= 0
        ? initialResult.faceLandmarks[0]
        : undefined;

    if (
      !facialLandmarks ||
      !Array.isArray(facialLandmarks) ||
      facialLandmarks.length <= 0
    )
      throw new Error('No Face Detected');

    return facialLandmarks;
  } catch (error: any) {
    // If it's already an Error, preserve its message
    if (error instanceof Error) {
      throw error;
    }
    // Otherwise, create a new Error with the error message or string representation
    throw new Error(
      typeof error === 'string'
        ? error
        : error?.message || 'Failed to detect face landmarks'
    );
  }
};

export const getScores = async (landmarks: Landmark[]) => {
  try {
    const scoringAuthToken = await getValidJWTToken();

    const response = await axios.request({
      method: 'POST',
      url: SCORING_API_URL,
      headers: {
        Authorization: `Bearer ${scoringAuthToken}`,
      },
      data: {
        landmarks,
      },
    });

    return response;
  } catch (error: any) {
    // Handle axios errors specifically
    if (isAxiosError(error)) {
      if (error.response) {
        // Server responded with error status
        throw new Error(
          error.response.data?.message ||
            `Server error: ${error.response.status}`
        );
      } else if (error.request) {
        // Request made but no response received
        throw new Error(
          'Network error: Unable to reach the server. Please check your connection.'
        );
      }
    }

    // If it's already an Error, preserve it
    if (error instanceof Error) {
      throw error;
    }

    // Otherwise, create a new Error
    throw new Error(
      typeof error === 'string'
        ? error
        : error?.message || 'Failed to get scores'
    );
  }
};
