export type FeatureID =
  | 'overall_symmetry'
  | 'eye_alignment'
  | 'nose_centering'
  | 'jawline_symmetry'
  | 'chin_alignment'
  | 'lower_face_proportion'
  | 'eye_spacing_ratio'
  | 'facial_thirds';

export interface Feature {
  id: FeatureID;
  title: string;
  description: string;
  goal: number;
  polarity: 'higher' | 'lower';
}
