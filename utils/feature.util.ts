import { FEATURES } from '@/constants/features';
import { Feature, FeatureID } from '@/types/feature.types';
import { COLOR } from '../constants/theme';

export function getFeatureByID(id: FeatureID): Feature {
  const feature = FEATURES.find((feature) => feature.id === id);

  if (!feature) {
    throw new Error(`Feature with id ${id} not found`);
  }

  return feature;
}

export function normalizeScore(
  score: number,
  polarity: Feature['polarity'],
): number {
  if (polarity === 'lower') {
    return Math.max(0, Math.min(100, 100 - score));
  }

  return Math.max(0, Math.min(100, score));
}

export function getScoreColor(featureId: FeatureID, score: number): string {
  const feature = getFeatureByID(featureId);
  const normalizedScore = normalizeScore(score, feature.polarity);

  if (normalizedScore >= 75) return COLOR.green;
  if (normalizedScore >= 50) return COLOR.yellow;
  return COLOR.red;
}

export function getScoreLabel(featureId: FeatureID, score: number): string {
  const feature = getFeatureByID(featureId);
  const normalizedScore = normalizeScore(score, feature.polarity);

  if (normalizedScore >= 75) return 'Excellent';
  if (normalizedScore >= 50) return 'Good';
  return 'Needs Work';
}

export function getDistanceFromGoal(
  featureId: FeatureID,
  score: number,
): number {
  const feature = getFeatureByID(featureId);

  if (feature.polarity === 'lower') {
    return Math.max(0, score - feature.goal);
  }

  return Math.max(0, feature.goal - score);
}

function getComparisonText(
  featureId: FeatureID,
  prevScore: number,
  currScore: number,
): { text: string; color: string } {
  const feature = getFeatureByID(featureId);
  const diff = currScore - prevScore;
  if (diff === 0) return { text: 'No change', color: COLOR.secondary };
  const improved = feature.polarity === 'higher' ? diff > 0 : diff < 0;
  return {
    text: improved
      ? `Improved by ${Math.abs(diff)} pts`
      : `Declined by ${Math.abs(diff)} pts`,
    color: improved ? COLOR.green : COLOR.red,
  };
}

export type FeatureScore = {
  id: FeatureID;
  title: string;
  description: string;
  rawScore: number;
  normalizedScore: number;
  color: string;
  label: string;
};

export function getSortedFeatureScores(
  scores: Record<FeatureID, number>,
  exclude: FeatureID[] = ['overall_symmetry'],
): FeatureScore[] {
  return Object.entries(scores)
    .filter(([id]) => !exclude.includes(id as FeatureID))
    .map(([id, rawScore]) => {
      const featureId = id as FeatureID;
      const feature = getFeatureByID(featureId);
      const normalized = normalizeScore(rawScore, feature.polarity);

      return {
        id: featureId,
        title: feature.title,
        description: feature.description,
        rawScore,
        normalizedScore: normalized,
        color: getScoreColor(featureId, rawScore),
        label: getScoreLabel(featureId, rawScore),
      };
    })
    .sort((a, b) => b.normalizedScore - a.normalizedScore);
}
