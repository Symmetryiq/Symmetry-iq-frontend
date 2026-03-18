import { Colors } from '@/constants/theme';
import { LandmarkModelError, NoFaceDetectedError } from '@/helpers/errors';
import {
  faceLandmarkDetectionOnImage,
  type FaceLandmarkDetectionResultBundle,
  type Landmark,
} from 'react-native-mediapipe';

export interface Score {
  overall: number;
  thirds: number;
  jaw: number;
  puff: number;
  clar: number;
  brow: number;
  eye: number;
  nose: number;
  cheek: number;
  chin: number;
}

// 3D Euclidean distance
const D = (a: Landmark[][number], b: Landmark[][number]): number => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

const range = (a: number, b: number) =>
  [...Array(b - a + 1)].map((_, i) => a + i);

const ASYM = (pts: Landmark[], A: number[], B: number[]): number => {
  if (A.length === 0 || B.length === 0) {
    return 0;
  }

  let sum = 0;
  let count = 0;

  for (const i of A) {
    for (const j of B) {
      if (i < pts.length && j < pts.length && i >= 0 && j >= 0) {
        const di = D(pts[i], pts[1]);
        const dj = D(pts[j], pts[1]);
        sum += Math.abs(di - dj);
        count++;
      }
    }
  }

  return count > 0 ? sum / count : 0;
};

/**
 * Gets facial landmarks from an image using MediaPipe FaceLandmarker
 * @param imagePath - Path to the image file
 * @returns Array of facial landmarks
 */
export const getLandmarks = async (imagePath: string): Promise<Landmark[]> => {
  if (!imagePath) {
    throw new LandmarkModelError('Invalid image path');
  }

  try {
    const result: FaceLandmarkDetectionResultBundle =
      await faceLandmarkDetectionOnImage(imagePath, 'face_landmarker.task');

    if (!result?.results?.length) {
      throw new NoFaceDetectedError();
    }

    const facialLandmarks = result.results?.[0]?.faceLandmarks?.[0];

    if (!Array.isArray(facialLandmarks) || facialLandmarks.length === 0) {
      throw new NoFaceDetectedError();
    }

    return facialLandmarks;
  } catch (error: unknown) {
    if (error instanceof NoFaceDetectedError) {
      throw error;
    }

    throw new LandmarkModelError(
      error instanceof Error ? error.message : 'Unknown face detection error',
    );
  }
};

/**
 * Computes 3D geometry scores from facial landmarks
 * @param pts - Array of facial landmarks
 * @returns Object containing computed scores
 */
export function getScores(pts: Landmark[]): Score {
  if (!pts || pts.length < 468) {
    throw new Error('468 FaceMesh landmarks required');
  }

  // Validate landmark structure
  for (let i = 0; i < Math.min(pts.length, 468); i++) {
    if (
      typeof pts[i]?.x !== 'number' ||
      typeof pts[i]?.y !== 'number' ||
      typeof pts[i]?.z !== 'number'
    ) {
      throw new Error(
        `Invalid landmark at index ${i}. Expected {x, y, z} object`,
      );
    }
  }

  /* --------------------------------------------------
   * Global scale (still used for asymmetry-based metrics)
   * -------------------------------------------------- */
  let M = 0;
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const dist = D(pts[i], pts[j]);
      if (dist > M) M = dist;
    }
  }

  // Prevent division by zero
  if (M === 0) {
    M = 1;
  }

  /* --------------------------------------------------
   * Local facial reference scales
   * -------------------------------------------------- */
  // Validate critical landmark indices exist
  const requiredIndices = [
    1, 4, 10, 13, 14, 27, 33, 50, 61, 70, 94, 133, 152, 159, 197, 205, 234, 257,
    263, 280, 291, 336, 360, 362, 386, 425, 454, 467,
  ];
  for (const idx of requiredIndices) {
    if (idx >= pts.length) {
      throw new Error(
        `Required landmark index ${idx} is out of bounds. Only ${pts.length} landmarks provided.`,
      );
    }
  }

  const FACE_WIDTH = D(pts[234], pts[454]); // cheek → cheek
  const MOUTH_WIDTH = D(pts[61], pts[291]);

  /* --------------------------------------------------
   * Metrics (unchanged ones stay unchanged)
   * -------------------------------------------------- */

  const jaw = 100 * (1 - ASYM(pts, range(234, 253), range(454, 467)) / M);

  const brow = 100 * (1 - ASYM(pts, range(70, 94), range(336, 360)) / M);

  const eye = 100 * (1 - ASYM(pts, range(33, 133), range(263, 362)) / M);

  const nose =
    100 * (1 - Math.abs(D(pts[1], pts[4]) - D(pts[1], pts[197])) / M);

  const clar = 100 * (1 - ASYM(pts, range(0, 233), range(234, 467)) / M);

  // --- FACE LEANNESS SCORE (FINAL SOFT BOOST) ---

  const cheekDepth = (pts[205].z + pts[425].z) / 2;

  const noseDepth = pts[1].z;
  const relativeCheekDepth = cheekDepth - noseDepth;

  const faceHeight = D(pts[10], pts[152]);
  const puffNorm = faceHeight > 0 ? relativeCheekDepth / faceHeight : 0;

  // Ideal lean face puffNorm
  const IDEAL = 0.26;
  const RANGE = 0.08;

  // Distance from ideal
  const dist = Math.abs(puffNorm - IDEAL);

  // Base leanness
  let leanness01 = Math.max(0, 1 - dist / RANGE);

  // 🔹 Slightly stronger soft bias (favor lean faces a bit more)
  let boosted01 = Math.pow(leanness01, 0.25); // lower exponent → more mid-range lift

  // Slight extra offset
  boosted01 = Math.min(1, boosted01 + 0.1); // +10% boost, capped at 1

  // Final score
  const puff = Math.max(45, Math.min(95, 100 * boosted01));

  /* --------------------------------------------------
   * FIXED METRICS
   * -------------------------------------------------- */

  // Mouth proportion (so "normal" mouths don't get 0)
  const idealMouthRatio = 0.38;
  const mouthRatio = FACE_WIDTH > 0 ? MOUTH_WIDTH / FACE_WIDTH : 0;
  const mouthDeviation =
    Math.abs(mouthRatio - idealMouthRatio) / idealMouthRatio;
  // Soft penalty and soft floor so almost‑normal mouths stay in 40–90 range
  const mouthRaw = 100 * (1 - mouthDeviation * 0.6);
  const cheek = Math.max(20, Math.min(95, mouthRaw));

  // Chin projection using depth (z-axis), wider band and capped to avoid 100
  const chinDepth = pts[152].z - pts[1].z;
  // Map roughly [-0.035, 0.035] → [0, 1]
  const chinNorm = (chinDepth + 0.035) / 0.07;
  const chinRaw = 100 * Math.min(Math.max(chinNorm, 0), 1);
  // Keep typical chins away from hard 0/100
  const chin = Math.max(15, Math.min(90, chinRaw));

  // Face thirds as ratio, not absolute difference
  const upperFace = D(pts[10], pts[1]);
  const lowerFace = D(pts[1], pts[152]);
  const thirds =
    lowerFace > 0
      ? 100 * Math.max(0, 1 - Math.abs(upperFace / lowerFace - 1))
      : 0;

  /* --------------------------------------------------
   * Aggregate
   * -------------------------------------------------- */

  const values = [jaw, cheek, brow, eye, nose, chin, thirds, clar, puff];

  const overall = values.reduce((a, b) => a + b, 0) / values.length;

  const r = (v: number) => Number(v.toFixed(2));

  const cal = {
    overall: r(overall),
    thirds: r(thirds),
    jaw: r(jaw),
    puff: r(puff),
    clar: r(clar),
    brow: r(brow),
    eye: r(eye),
    nose: r(nose),
    cheek: r(cheek),
    chin: r(chin),
  };

  return cal;
}

export function getScanByDate(date: Date) {
  return 0;
}

export function hasScannedToday(): boolean {
  const today = new Date();

  const hasScannedToday = getScanByDate(today);

  return hasScannedToday ? true : false;
}

/**
 * Gets the color for a given score
 * @param score - The score to get the color for
 * @param isReversed - Whether the score is reversed
 * @returns The color for the given score
 */
export function getColorByScore(
  score: number,
  isReversed: boolean = false,
): string {
  const value = isReversed ? 100 - score : score;
  const color =
    value >= 75 ? Colors.success : value >= 50 ? Colors.warning : Colors.danger;

  return color;
}

/**
 * Gets the label for a given score
 * @param score - The score to get the label for
 * @param isReversed - Whether the score is reversed
 * @returns The label for the given score
 */
export function getLabelByScore(score: number, isReversed: boolean = false) {
  const value = isReversed ? 100 - score : score;
  const label =
    value >= 75 ? 'Excellent' : value >= 50 ? 'Good' : 'Needs Improvement';

  return label;
}
