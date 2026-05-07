import { MEDIAPIPE_FACE_LANDMARKER_MODEL } from '@/constants/app';
import { FeatureID } from '@/types/feature.types';
import { faceLandmarkDetectionOnImage, Landmark } from 'react-native-mediapipe';
import { LandmarkModelError, NoFaceDetectedError } from './error.util';
import {
  calculateCheekboneBalance,
  calculateChinAlignment,
  calculateEyeAlignment,
  calculateEyebrowSymmetry,
  calculateFacialPuffiness,
  calculateFacialThirds,
  calculateJawlineSymmetry,
  calculateMidfaceRatio,
  calculateNoseCentering,
  calculateOverallSymmetry,
} from './scan.util';

/**
 * Gets facial landmarks from an image using MediaPipe FaceLandmarker.
 * @param imagePath - Path to the image
 * @returns Array of landmarks
 */
export async function getLandmarks(imagePath: string): Promise<Landmark[]> {
  if (!imagePath) throw new LandmarkModelError('Invalid image path');

  try {
    const result = await faceLandmarkDetectionOnImage(
      imagePath,
      MEDIAPIPE_FACE_LANDMARKER_MODEL,
    );

    if (!result.results.length) throw new NoFaceDetectedError();

    const landmarks = result.results[0].faceLandmarks[0];

    if (!Array.isArray(landmarks) || landmarks.length === 0)
      throw new NoFaceDetectedError();

    return landmarks;
  } catch (error) {
    if (error instanceof NoFaceDetectedError) throw error;
    throw new LandmarkModelError(
      error instanceof Error ? error.message : 'Unknown face detection error',
    );
  }
}

/**
 * Calculates scores for all features
 * @param landmarks - Array of landmarks
 * @returns Record of feature scores
 */
export function calculateScores(
  landmarks: Landmark[],
): Record<FeatureID, number> {
  return {
    overall_symmetry: Math.round(calculateOverallSymmetry(landmarks)),
    eye_alignment: Math.round(calculateEyeAlignment(landmarks)),
    nose_centering: Math.round(calculateNoseCentering(landmarks)),
    facial_puffiness: Math.round(calculateFacialPuffiness(landmarks)),
    facial_thirds: Math.round(calculateFacialThirds(landmarks)),
    jawline_symmetry: Math.round(calculateJawlineSymmetry(landmarks)),
    midface_ratio: Math.round(calculateMidfaceRatio(landmarks)),
    cheekbone_balance: Math.round(calculateCheekboneBalance(landmarks)),
    chin_alignment: Math.round(calculateChinAlignment(landmarks)),
    eyebrow_symmetry: Math.round(calculateEyebrowSymmetry(landmarks)),
  };
}
