import { ImageURISource } from 'react-native';
import { FeatureID } from './feature.types';

export type RoutineID =
  | 'hard_mewing_hold'
  | 'masseter_balance_training'
  | 'neck_curls_extensions'
  | 'chin_tucks'
  | 'wall_posture_reset'
  | 'scm_neck_stretch'
  | 'mandibular_fascia_release'
  | 'gua_sha_jawline'
  | 'cheekbone_lift_massage'
  | 'smile_symmetry_routine'
  | 'orb_oculi_training'
  | 'wall_posture_training'
  | 'neck_stretch'
  | 'nose_centering_routine';

export type RoutineStep = {
  order: number;
  instruction: string;
};

export type RoutineProduct = {
  name: string;
  optional?: boolean;
};

export type Routine = {
  id: RoutineID;
  name: string;
  summary: string;
  duration: number;
  image: ImageURISource;
  products: RoutineProduct[];
  steps: RoutineStep[];
  primaryTargets: FeatureID[];
  secondaryTargets: FeatureID[];
};
