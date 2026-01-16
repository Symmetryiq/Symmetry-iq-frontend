import { RoutineId } from '@/data/routines';

/**
 * Score keys matching the API response structure.
 */
export type ScoreKey =
  | 'overallSymmetry'
  | 'eyeAlignment'
  | 'noseCentering'
  | 'facialPuffiness'
  | 'skinClarity'
  | 'chinAlignment'
  | 'facialThirds'
  | 'jawlineSymmetry'
  | 'cheekboneBalance'
  | 'eyebrowSymmetry';

/**
 * Represents a routine mapped to a factor with an impact score.
 * Higher impact = more effective for improving that factor.
 */
export interface RoutineMapping {
  routineId: RoutineId;
  impact: number; // 1-10 scale
}

/**
 * Goal scores for each facial factor.
 * facialPuffiness is inverted (lower is better).
 */
export const GOALS: Record<ScoreKey, number> = {
  overallSymmetry: 85,
  eyeAlignment: 85,
  noseCentering: 80,
  facialPuffiness: 30, // Lower is better
  skinClarity: 70,
  chinAlignment: 80,
  facialThirds: 70,
  jawlineSymmetry: 80,
  cheekboneBalance: 75,
  eyebrowSymmetry: 80,
};

/**
 * Maps each facial factor to routines that can improve it.
 * Each routine has an impact score indicating effectiveness.
 * This should stay in sync with the backend ROUTINE_FACTOR_MAP.
 */
export const ROUTINE_FACTOR_MAP: Record<ScoreKey, RoutineMapping[]> = {
  overallSymmetry: [
    { routineId: 'hard-mewing-hold', impact: 9 },
    { routineId: 'chin-tucks', impact: 8 },
    { routineId: 'neck-curls-extensions', impact: 7 },
  ],
  facialThirds: [
    { routineId: 'hard-mewing-hold', impact: 8 },
    { routineId: 'chin-tucks', impact: 7 },
  ],
  eyeAlignment: [
    { routineId: 'orb-oculi-training', impact: 9 },
    { routineId: 'scm-neck-stretch', impact: 6 },
  ],
  eyebrowSymmetry: [{ routineId: 'orb-oculi-training', impact: 8 }],
  noseCentering: [
    { routineId: 'nose-centering-routine', impact: 9 },
    { routineId: 'scm-neck-stretch', impact: 5 },
  ],
  facialPuffiness: [
    { routineId: 'gua-sha-jawline', impact: 9 },
    { routineId: 'mandibular-fascia-release', impact: 7 },
  ],
  skinClarity: [{ routineId: 'gua-sha-jawline', impact: 7 }],
  jawlineSymmetry: [
    { routineId: 'masseter-balance-training', impact: 9 },
    { routineId: 'mandibular-fascia-release', impact: 7 },
  ],
  cheekboneBalance: [
    { routineId: 'cheekbone-lift-massage', impact: 9 },
    { routineId: 'gua-sha-jawline', impact: 6 },
  ],
  chinAlignment: [
    { routineId: 'chin-tucks', impact: 9 },
    { routineId: 'masseter-balance-training', impact: 7 },
  ],
};

/**
 * Calculate distance from goal for a factor.
 * For facialPuffiness (lower is better), distance = value - goal
 * For others, distance = goal - value
 */
const calculateDistance = (
  factor: ScoreKey,
  score: number,
  goal: number
): number => {
  if (factor === 'facialPuffiness') {
    return Math.max(0, score - goal);
  }
  return Math.max(0, goal - score);
};

interface CandidateRoutine {
  routineId: RoutineId;
  priority: number;
}

/**
 * Calculate recommended routines based on scan scores.
 * Uses weighted priority algorithm: priority = distanceFromGoal × routineImpact
 *
 * @param scores - The scan scores object
 * @param maxRoutines - Maximum number of routines to return (default: 5)
 * @returns Array of routine IDs sorted by priority
 */
export const getRecommendedRoutines = (
  scores: Partial<Record<ScoreKey, number>>,
  maxRoutines = 5
): RoutineId[] => {
  const candidates: CandidateRoutine[] = [];

  for (const [factorKey, goal] of Object.entries(GOALS)) {
    const factor = factorKey as ScoreKey;
    const score = scores[factor];

    if (score === undefined) continue;

    const distance = calculateDistance(factor, score, goal);

    // Only consider factors that need improvement
    if (distance > 0) {
      const mappings = ROUTINE_FACTOR_MAP[factor];

      for (const mapping of mappings) {
        candidates.push({
          routineId: mapping.routineId,
          priority: distance * mapping.impact,
        });
      }
    }
  }

  // Sort by priority descending
  candidates.sort((a, b) => b.priority - a.priority);

  // Deduplicate and limit
  const result: RoutineId[] = [];
  const seen = new Set<RoutineId>();

  for (const c of candidates) {
    if (!seen.has(c.routineId)) {
      result.push(c.routineId);
      seen.add(c.routineId);
    }
    if (result.length >= maxRoutines) break;
  }

  return result;
};
