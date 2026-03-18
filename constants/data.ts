import {
  CameraIcon,
  ChartLineIcon,
  GearIcon,
  ListIcon,
} from 'phosphor-react-native';
import { Colors } from './theme';

export const QUICK_ACTIONS = [
  {
    label: 'Scan Now',
    icon: CameraIcon,
    color: Colors.primary,
    route: '/(app)/scan',
  },
  {
    label: 'Routines',
    icon: ListIcon,
    color: '#F59E0B',
    route: '/(app)/(tabs)/routines',
  },
  {
    label: 'Reports',
    icon: ChartLineIcon,
    color: '#34D399',
    route: '/(app)/(tabs)/insights',
  },
  {
    label: 'Settings',
    icon: GearIcon,
    color: 'gray',
    route: '/(app)/(tabs)/settings',
  },
];

export const DAILY_TIPS = [
  {
    emoji: '💧',
    title: 'Stay Hydrated',
    description: 'Drink at least 8 glasses of water a day',
  },
  {
    emoji: '🏃',
    title: 'Move Your Body',
    description: 'Take a 30-minute walk',
  },
  {
    emoji: '🍎',
    title: 'Eat Healthy',
    description: 'Add more fruits and vegetables to your diet',
  },
  {
    emoji: '😴',
    title: 'Get Enough Sleep',
    description: 'Aim for 7-8 hours of sleep per night',
  },
  {
    emoji: '🧘',
    title: 'Practice Mindfulness',
    description: 'Take a few deep breaths',
  },
  { emoji: '☀️', title: 'Get Some Sun', description: 'Spend time outdoors' },
  {
    emoji: '📚',
    title: 'Learn Something New',
    description: 'Read a book or article',
  },
  {
    emoji: '🤝',
    title: 'Connect with Others',
    description: 'Talk to a friend or family member',
  },
  {
    emoji: '🌱',
    title: 'Grow Something',
    description: 'Plant a seed or care for a plant',
  },
  {
    emoji: '🎨',
    title: 'Be Creative',
    description: 'Draw, paint, or write something',
  },
];
