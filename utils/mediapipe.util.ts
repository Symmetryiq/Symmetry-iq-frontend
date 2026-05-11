import { MEDIAPIPE_FACE_LANDMARKER_MODEL } from '@/constants/app';
import { FeatureID } from '@/types/feature.types';
import { faceLandmarkDetectionOnImage, Landmark } from 'react-native-mediapipe';
import { LandmarkModelError, NoFaceDetectedError } from './error.util';
import {
  calculateChinAlignment,
  calculateEyeAlignment,
  calculateEyeSpacingRatio,
  calculateFacialThirds,
  calculateJawlineSymmetry,
  calculateLowerFaceProportion,
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
    jawline_symmetry: Math.round(calculateJawlineSymmetry(landmarks)),
    chin_alignment: Math.round(calculateChinAlignment(landmarks)),
    lower_face_proportion: Math.round(calculateLowerFaceProportion(landmarks)),
    eye_spacing_ratio: Math.round(calculateEyeSpacingRatio(landmarks)),
    facial_thirds: Math.round(calculateFacialThirds(landmarks)),
  };
}
