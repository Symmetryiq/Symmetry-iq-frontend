/**
 * Plan Engine — Client-side plan generation
 *
 * Generates 28-day exercise plans from scan scores. This runs entirely
 * on-device so the app works offline. The generated plan is synced to
 * the backend for persistence.
 *
 * Algorithm: priority = distanceFromGoal × routineImpact
 * - Highest-priority routine appears every other day
 * - Supporting routines rotate through remaining slots
 * - Every 7th day is a rest day
 * - Week 3-4 get an extra supporting routine per day
 */

import { RoutineId } from '@/data/routines';
import {
  GOALS,
  ROUTINE_FACTOR_MAP,
  type ScoreKey,
  type RoutineMapping,
} from '@/helpers/routine-mapping';

export interface GeneratedPlan {
  schedule: Record<string, string[]>; // { "2026-03-15": ["hard-mewing-hold", "chin-tucks"] }
  bonusRoutines: RoutineId[];
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  durationDays: number;
}

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

interface CandidateRoutine {
  routineId: RoutineId;
  priority: number;
}

const calculateDistance = (
  factor: ScoreKey,
  score: number,
  goal: number,
): number => {
  return factor === 'facialPuffiness'
    ? Math.max(0, score - goal)
    : Math.max(0, goal - score);
};

const selectWeightedRoutines = (
  scores: Scores,
): { primary: RoutineId[]; supporting: RoutineId[]; bonus: RoutineId[] } => {
  const candidates: CandidateRoutine[] = [];

  for (const [factorKey, goal] of Object.entries(GOALS)) {
    const factor = factorKey as ScoreKey;
    const score = scores[factor as keyof Scores];
    if (score === undefined) continue;

    const distance = calculateDistance(factor, score, goal);
    if (distance > 0) {
      const mappings: RoutineMapping[] = ROUTINE_FACTOR_MAP[factor];
      for (const mapping of mappings) {
        const priority = distance * mapping.impact;
        candidates.push({ routineId: mapping.routineId, priority });
      }
    }
  }

  candidates.sort((a, b) => b.priority - a.priority);

  const uniqueRoutines: RoutineId[] = [];
  const seen = new Set<RoutineId>();

  for (const candidate of candidates) {
    if (!seen.has(candidate.routineId)) {
      uniqueRoutines.push(candidate.routineId);
      seen.add(candidate.routineId);
    }
  }

  const primary = uniqueRoutines.slice(0, 2);
  const supporting = uniqueRoutines.slice(2, 6);
  const bonus = uniqueRoutines.slice(6);

  // Fallbacks if scan scores are all near-perfect
  if (primary.length === 0) primary.push('hard-mewing-hold');
  if (supporting.length === 0) supporting.push('chin-tucks');

  return { primary, supporting, bonus };
};

const formatDate = (date: Date): string => date.toISOString().split('T')[0];

/**
 * Generate a 28-day plan from scan scores.
 * Pure function — no database, no network. Runs instantly on-device.
 */
export const generatePlan = (scores: Scores): GeneratedPlan => {
  const { primary, supporting, bonus } = selectWeightedRoutines(scores);

  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 27);

  const schedule: Record<string, string[]> = {};

  for (let dayOffset = 0; dayOffset < 28; dayOffset++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + dayOffset);
    const dateStr = formatDate(d);

    const dayOfWeek = (dayOffset % 7) + 1;

    // Day 7 is always rest
    if (dayOfWeek === 7) {
      schedule[dateStr] = [];
      continue;
    }

    const dailyTasks: string[] = [];

    // Alternate primary routine every other active day
    dailyTasks.push(primary[dayOffset % primary.length] || primary[0]);

    // Add 1 supporting routine in weeks 1-2, 2 in weeks 3-4
    const supportCount = dayOffset >= 14 ? 2 : 1;
    for (let i = 0; i < supportCount; i++) {
      const suppItem = supporting[(dayOffset + i) % supporting.length];
      if (suppItem && !dailyTasks.includes(suppItem)) {
        dailyTasks.push(suppItem);
      }
    }

    schedule[dateStr] = dailyTasks;
  }

  return {
    schedule,
    bonusRoutines: bonus,
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    durationDays: 28,
  };
};
