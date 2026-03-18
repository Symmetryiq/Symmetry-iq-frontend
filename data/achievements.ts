import {
  CheckCircle,
  Fire,
  Image as ImageIcon,
  Play as PlayIcon,
  Star,
  TrendUp as TrendUpIcon,
  Trophy,
  User as UserIcon,
  WarningCircle,
} from 'phosphor-react-native';

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
  icon: any; // Phosphor Icon component
  color: string;
  secret?: boolean;
}

export const Achievements: Achievement[] = [
  // Getting Started (4)
  { id: 'first_scan', title: 'First Glimpse', description: 'Complete your first ever facial scan.', category: 'Getting Started', icon: ImageIcon, color: '#3B82F6' },
  { id: 'first_routine', title: 'Taking Action', description: 'Complete your first routine.', category: 'Getting Started', icon: PlayIcon, color: '#3B82F6' },
  { id: 'profile_setup', title: 'Who Am I?', description: 'Complete your profile details.', category: 'Getting Started', icon: UserIcon, color: '#3B82F6' },
  { id: 'first_checklist', title: 'Task Master', description: 'Tick your first daily checklist item.', category: 'Getting Started', icon: CheckCircle, color: '#3B82F6' },

  // Consistency (6)
  { id: 'streak_3', title: 'Heating Up', description: 'Reach a 3-day streak.', category: 'Consistency', icon: Fire, color: '#F59E0B' },
  { id: 'streak_7', title: 'On Fire', description: 'Reach a 7-day streak.', category: 'Consistency', icon: Fire, color: '#F59E0B' },
  { id: 'streak_14', title: 'Unstoppable', description: 'Reach a 14-day streak.', category: 'Consistency', icon: Fire, color: '#F59E0B' },
  { id: 'streak_30', title: 'Habit Formed', description: 'Reach a 30-day streak.', category: 'Consistency', icon: Fire, color: '#F59E0B' },
  { id: 'weekend_warrior', title: 'Weekend Warrior', description: 'Complete routines on both Saturday and Sunday.', category: 'Consistency', icon: Trophy, color: '#8B5CF6' },
  { id: 'early_bird', title: 'Early Bird', description: 'Complete a routine before 8 AM.', category: 'Consistency', icon: CheckCircle, color: '#EC4899' },

  // Routines (6)
  { id: 'routine_5', title: 'Routine Regular', description: 'Complete 5 routines total.', category: 'Routines', icon: PlayIcon, color: '#10B981' },
  { id: 'routine_20', title: 'Routine Pro', description: 'Complete 20 routines total.', category: 'Routines', icon: PlayIcon, color: '#10B981' },
  { id: 'routine_50', title: 'Routine Master', description: 'Complete 50 routines total.', category: 'Routines', icon: PlayIcon, color: '#10B981' },
  { id: 'variety_spice', title: 'Variety is the Spice', description: 'Complete 5 different types of routines.', category: 'Routines', icon: Star, color: '#8B5CF6' },
  { id: 'double_duty', title: 'Double Duty', description: 'Complete two routines in one day.', category: 'Routines', icon: CheckCircle, color: '#10B981' },
  { id: 'perfect_week_routines', title: 'Perfect Week', description: 'Complete your daily routine every day for a week.', category: 'Routines', icon: Trophy, color: '#F59E0B' },

  // Scanning/Progress (6)
  { id: 'scan_5', title: 'Self-Aware', description: 'Complete 5 scans.', category: 'Scanning', icon: ImageIcon, color: '#3B82F6' },
  { id: 'scan_improvement_1', title: 'Level Up', description: 'Improve your overall symmetry score by 1%.', category: 'Scanning', icon: TrendUpIcon, color: '#10B981' },
  { id: 'scan_improvement_5', title: 'Glow Up', description: 'Improve your overall symmetry score by 5%.', category: 'Scanning', icon: TrendUpIcon, color: '#10B981' },
  { id: 'symmetry_90', title: 'Near Perfect', description: 'Achieve an overall symmetry score of 90+.', category: 'Scanning', icon: Star, color: '#F59E0B' },
  { id: 'symmetry_maintain', title: 'Holding Steady', description: 'Maintain your score within 1% for three consecutive scans.', category: 'Scanning', icon: CheckCircle, color: '#3B82F6' },
  { id: 'night_owl_scan', title: 'Midnight Oil', description: 'Scan your face after midnight.', category: 'Scanning', icon: ImageIcon, color: '#6366F1' },

  // Checklist (4)
  { id: 'check_50', title: 'Checking It Twice', description: 'Complete 50 checklist items total.', category: 'Checklist', icon: CheckCircle, color: '#8B5CF6' },
  { id: 'check_perfect_day', title: 'Flawless Victory', description: 'Complete all checklist items in a single day.', category: 'Checklist', icon: Trophy, color: '#F59E0B' },
  { id: 'check_water', title: 'Hydrated', description: 'Complete the water tracking checklist item 7 days in a row.', category: 'Checklist', icon: CheckCircle, color: '#3B82F6' },
  { id: 'check_posture', title: 'Stand Tall', description: 'Complete the posture check 7 days in a row.', category: 'Checklist', icon: CheckCircle, color: '#10B981' },

  // Hidden/Secret (2)
  { id: 'secret_dedication', title: 'True Dedication', description: 'Use the app every single day for 100 days.', category: 'Hidden', icon: Star, color: '#EF4444', secret: true },
  { id: 'secret_rest', title: 'Rest & Recover', description: 'Do absolutely zero routines or checklist items for a full day.', category: 'Hidden', icon: WarningCircle, color: '#6B7280', secret: true },
];
