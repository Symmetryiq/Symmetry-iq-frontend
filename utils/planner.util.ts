import { FEATURES } from '@/constants/features';
import { ROUTINES } from '@/constants/routines';
import { ScanScores } from '@/hooks/useScanStore';
import { FeatureID } from '@/types/feature.types';
import { DailyPlan, MonthlyPlan } from '@/types/plan.types';
import { RoutineID } from '@/types/routine.types';
import { normalizeScore } from './feature.util';

const DAYS_PER_WEEK = 7;
const TOTAL_WEEKS = 4;
const BONUS_COUNT = 2;

type RankedFeature = {
  id: FeatureID;
  normalizedScore: number;
};

function rankFeatures(scores: ScanScores): RankedFeature[] {
  return FEATURES.map((f) => ({
    id: f.id,
    normalizedScore: normalizeScore(scores[f.id], f.polarity),
  })).sort((a, b) => a.normalizedScore - b.normalizedScore);
}

function buildFeatureRoutineIndex(): Map<FeatureID, RoutineID[]> {
  const index = new Map<FeatureID, RoutineID[]>();

  for (const feature of FEATURES) {
    const routines = ROUTINES.filter(
      (r) =>
        r.primaryTargets.includes(feature.id) ||
        r.secondaryTargets.includes(feature.id),
    )
      .sort((a, b) => {
        const aPrimary = a.primaryTargets.includes(feature.id) ? 0 : 1;
        const bPrimary = b.primaryTargets.includes(feature.id) ? 0 : 1;
        return aPrimary - bPrimary;
      })
      .map((r) => r.id);

    index.set(feature.id, routines);
  }

  return index;
}

function selectFrom(
  pool: RoutineID[],
  exclude: Set<RoutineID>,
  rotation: number,
): RoutineID | null {
  const available = pool.filter((id) => !exclude.has(id));
  if (available.length === 0) return null;
  return available[Math.abs(rotation) % available.length];
}

function getFocusIndex(dayInWeek: number, featureCount: number): number {
  if (featureCount <= 1) return 0;
  const t = dayInWeek / (DAYS_PER_WEEK - 1);
  return Math.round(t * (featureCount - 1));
}

function generateWeek(
  ranked: RankedFeature[],
  featureIndex: Map<FeatureID, RoutineID[]>,
  weekOffset: number,
): DailyPlan[] {
  const week: DailyPlan[] = [];
  let previousMain: RoutineID | null = null;

  for (let day = 0; day < DAYS_PER_WEEK; day++) {
    const baseIdx = getFocusIndex(day, ranked.length);
    const focusIdx = (baseIdx + weekOffset) % ranked.length;
    const focusFeature = ranked[focusIdx].id;

    const mainExclude = new Set<RoutineID>();
    if (previousMain) mainExclude.add(previousMain);

    const mainCandidates = featureIndex.get(focusFeature) || [];
    let main = selectFrom(mainCandidates, mainExclude, day + weekOffset);

    if (!main) {
      const allIds = ROUTINES.map((r) => r.id);
      main = selectFrom(allIds, mainExclude, day)!;
    }

    const bonusExclude = new Set<RoutineID>([main]);
    const bonus: RoutineID[] = [];

    const adjacentIndices = [
      (focusIdx + 1) % ranked.length,
      (focusIdx + 2) % ranked.length,
      (focusIdx + ranked.length - 1) % ranked.length,
      (focusIdx + 3) % ranked.length,
    ];

    for (const adjIdx of adjacentIndices) {
      if (bonus.length >= BONUS_COUNT) break;

      const adjFeature = ranked[adjIdx].id;
      const candidates = featureIndex.get(adjFeature) || [];
      const pick = selectFrom(
        candidates,
        bonusExclude,
        day + weekOffset + bonus.length,
      );

      if (pick) {
        bonus.push(pick);
        bonusExclude.add(pick);
      }
    }

    while (bonus.length < BONUS_COUNT) {
      const allIds = ROUTINES.map((r) => r.id);
      const pick = selectFrom(allIds, bonusExclude, day + bonus.length);
      if (pick) {
        bonus.push(pick);
        bonusExclude.add(pick);
      } else {
        break;
      }
    }

    week.push({
      main,
      bonus: bonus as [RoutineID, RoutineID],
      focusFeature,
    });

    previousMain = main;
  }

  return week;
}

export function generateMonthlyPlan(
  scores: ScanScores,
  scanId: string,
): MonthlyPlan {
  const featureIndex = buildFeatureRoutineIndex();
  const ranked = rankFeatures(scores).filter(
    (f) => (featureIndex.get(f.id)?.length ?? 0) > 0,
  );

  const weeks = Array.from({ length: TOTAL_WEEKS }, (_, weekIdx) =>
    generateWeek(ranked, featureIndex, weekIdx),
  );

  return {
    weeks,
    generatedAt: new Date().toISOString(),
    scanId,
  };
}

export function getTodaysPlan(plan: MonthlyPlan): DailyPlan | null {
  const start = new Date(plan.generatedAt);
  start.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.floor(
    (today.getTime() - start.getTime()) / 86_400_000,
  );

  if (diffDays < 0 || diffDays >= DAYS_PER_WEEK * TOTAL_WEEKS) return null;

  const weekIdx = Math.floor(diffDays / DAYS_PER_WEEK);
  const dayIdx = diffDays % DAYS_PER_WEEK;

  return plan.weeks[weekIdx]?.[dayIdx] ?? null;
}

export function getUpcomingDays(
  plan: MonthlyPlan,
  count: number,
): DailyPlan[] {
  const start = new Date(plan.generatedAt);
  start.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.floor(
    (today.getTime() - start.getTime()) / 86_400_000,
  );

  const totalDays = DAYS_PER_WEEK * TOTAL_WEEKS;
  const upcoming: DailyPlan[] = [];

  for (let i = 1; i <= count; i++) {
    const dayOffset = diffDays + i;
    if (dayOffset >= totalDays) break;

    const weekIdx = Math.floor(dayOffset / DAYS_PER_WEEK);
    const dayIdx = dayOffset % DAYS_PER_WEEK;

    const day = plan.weeks[weekIdx]?.[dayIdx];
    if (day) upcoming.push(day);
  }

  return upcoming;
}

export function getPlanForDate(
  plan: MonthlyPlan,
  date: Date,
): DailyPlan | null {
  const start = new Date(plan.generatedAt);
  start.setHours(0, 0, 0, 0);

  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  const diffDays = Math.floor(
    (target.getTime() - start.getTime()) / 86_400_000,
  );

  if (diffDays < 0 || diffDays >= DAYS_PER_WEEK * TOTAL_WEEKS) return null;

  const weekIdx = Math.floor(diffDays / DAYS_PER_WEEK);
  const dayIdx = diffDays % DAYS_PER_WEEK;

  return plan.weeks[weekIdx]?.[dayIdx] ?? null;
}

export function getPlanDates(plan: MonthlyPlan): Set<string> {
  const start = new Date(plan.generatedAt);
  start.setHours(0, 0, 0, 0);

  const totalDays = DAYS_PER_WEEK * TOTAL_WEEKS;
  const dates = new Set<string>();

  for (let i = 0; i < totalDays; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    dates.add(`${y}-${m}-${day}`);
  }

  return dates;
}

export function getPlanDateKey(plan: MonthlyPlan, date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
