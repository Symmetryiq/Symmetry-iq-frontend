export interface ChecklistTaskDef {
  id: string;
  title: string;
  description: string;
}

export const DailyChecklistTasks: ChecklistTaskDef[] = [
  {
    id: 'hydrate_morning',
    title: 'Morning Hydration',
    description: 'Drink a large glass of water shortly after waking up to hydrate skin and tissues.',
  },
  {
    id: 'tongue_posture',
    title: 'Proper Tongue Posture',
    description: 'Rest your tongue on the roof of your mouth (Mewing) throughout the day.',
  },
  {
    id: 'balanced_chewing',
    title: 'Balanced Chewing',
    description: 'Consciously chew food evenly on both sides of your jaw to prevent muscle imbalances.',
  },
  {
    id: 'posture_check',
    title: 'Posture Check',
    description: 'Keep your chin parallel to the floor and shoulders back to avoid "tech neck".',
  },
  {
    id: 'back_sleeping',
    title: 'Sleep Position Check',
    description: 'Did you sleep on your back last night? (Helps prevent asymmetrical facial pressure)',
  },
  {
    id: 'daily_scan',
    title: 'Daily Symmetry Scan',
    description: 'Complete at least one facial scan today to track your progress.',
  },
];
