import { Icon } from 'phosphor-react-native';

export type AchievementCategory =
  | 'Getting Started'
  | 'Consistency'
  | 'Routines'
  | 'Scanning'
  | 'Checklist'
  | 'Hidden';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  icon: Icon;
  color: string;
  secret?: boolean;
}
