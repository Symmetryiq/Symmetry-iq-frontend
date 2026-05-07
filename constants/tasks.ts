import { Task } from '@/types/task.types';

export const TASKS: Task[] = [
  {
    id: 'tongue_posture',
    title: 'Tongue Posture',
    icon: {
      emoji: '👅',
      color: 'hsla(8, 85%, 55%, 0.18)',
    },
    description: 'Hold correct mewing for 10 mins.',
  },
  {
    id: 'chewing_balance',
    title: 'Chewing Balance',
    icon: {
      emoji: '🦷',
      color: 'hsla(160, 45%, 55%, 0.18)',
    },
    description: '5 mins gum chewing on weaker side.',
  },
  {
    id: 'symmetry_routine',
    title: 'Symmetry Routine',
    icon: {
      emoji: '🪞',
      color: 'hsla(340, 70%, 65%, 0.18)',
    },
    description: "Complete today's 5–10 min guided exercise.",
  },
  {
    id: 'face_scan',
    title: 'Face Scan',
    icon: {
      emoji: '📸',
      color: 'hsla(200, 80%, 60%, 0.18)',
    },
    description: "Track progress with today's scan.",
  },
  {
    id: 'sleep_alignment',
    title: 'Sleep Alignment',
    icon: {
      emoji: '😴',
      color: 'hsla(250, 65%, 65%, 0.18)',
    },
    description:
      'Reminder: prepare for back sleeping (small towel under neck, avoid side-sleeping).',
  },
];
