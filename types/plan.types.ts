import { FeatureID } from './feature.types';
import { RoutineID } from './routine.types';

export type DailyPlan = {
  main: RoutineID;
  bonus: [RoutineID, RoutineID];
  focusFeature: FeatureID;
};

export type MonthlyPlan = {
  weeks: DailyPlan[][];
  generatedAt: string;
  scanId: string;
};
