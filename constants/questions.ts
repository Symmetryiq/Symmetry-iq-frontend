import { Question } from '@/types/question.types';

export const QUESTIONS: Question[] = [
  {
    id: 'name',
    type: 'text',
    title: "What's your name?",
    subtitle: "We'll personalize your report.",
    placeholder: 'Enter your name',
    keyboardType: 'default',
  },

  {
    id: 'age',
    type: 'text',
    title: "What's your age?",
    subtitle: 'Your age affects your facial symmetry.',
    placeholder: 'Enter your age',
    keyboardType: 'number-pad',
  },

  {
    id: 'gender',
    type: 'single',
    title: 'Select your gender',
    subtitle: 'This helps us analyze your face more accurately',
    options: [
      {
        label: 'Male',
        value: 'male',
        icon: { type: 'emoji', value: '♂️' },
      },
      {
        label: 'Female',
        value: 'female',
        icon: { type: 'emoji', value: '♀️' },
      },
    ],
  },

  {
    id: 'goal',
    type: 'multi',
    title: 'What are your goals?',
    subtitle: "Select one or more reasons you'd like to improve your face.",
    options: [
      {
        label: 'Improve overall facial symmetry',
        value: '0',
        icon: { type: 'emoji', value: '🪞' },
      },
      {
        label: 'Reduce puffiness and bloating',
        value: '1',
        icon: { type: 'emoji', value: '😴' },
      },
      {
        label: 'Define jawline and muscles',
        value: '2',
        icon: { type: 'emoji', value: '💪' },
      },
      {
        label: 'Track progress and visual changes',
        value: '3',
        icon: { type: 'emoji', value: '📈' },
      },
    ],
  },

  {
    id: 'sleep',
    type: 'single',
    title: 'How do you usually sleep?',
    subtitle: 'Your sleeping position can affect your facial balance.',
    options: [
      {
        label: 'Back',
        value: 'back',
        icon: { type: 'emoji', value: '🛌' },
      },
      {
        label: 'Side',
        value: 'side',
        icon: { type: 'emoji', value: '🛏️' },
      },
      {
        label: 'Stomach',
        value: 'stomach',
        icon: { type: 'emoji', value: '😴' },
      },
    ],
  },

  {
    id: 'diet',
    type: 'single',
    title: 'How clean is your diet?',
    subtitle: 'Having a bad diet can impact various facial factors.',
    options: [
      {
        label: 'Mostly Junky',
        value: 'mostly-junky',
        icon: { type: 'emoji', value: '🍕' },
      },
      {
        label: 'Mixed',
        value: 'mixed',
        icon: { type: 'emoji', value: '🥪' },
      },
      {
        label: 'Clean',
        value: 'clean',
        icon: { type: 'emoji', value: '🥗' },
      },
    ],
  },

  {
    id: 'chewing',
    type: 'single',
    title: 'Do you chew mostly on one side?',
    subtitle: 'Your chewing position can impact your mouth.',
    options: [
      {
        label: 'Left',
        value: 'left',
        icon: { type: 'emoji', value: '👈' },
      },
      {
        label: 'Right',
        value: 'right',
        icon: { type: 'emoji', value: '👉' },
      },
      {
        label: 'Balanced',
        value: 'balanced',
        icon: { type: 'emoji', value: '⚖️' },
      },
    ],
  },

  {
    id: 'confidence',
    type: 'single',
    title: 'How do you feel about your face in photos?',
    subtitle: 'Be honest, this helps us understand your confidence level',
    options: [
      {
        label: 'Love it',
        value: 'love-it',
        icon: { type: 'emoji', value: '😍' },
      },
      {
        label: 'Like it',
        value: 'like-it',
        icon: { type: 'emoji', value: '😀' },
      },
      {
        label: 'Dislike it',
        value: 'dislike-it',
        icon: { type: 'emoji', value: '😔' },
      },
      {
        label: 'Avoid photos',
        value: 'avoid-photos',
        icon: { type: 'emoji', value: '😩' },
      },
    ],
  },

  {
    id: 'impact',
    type: 'multi',
    title: 'How does facial symmetry affect you?',
    subtitle: 'Select all that apply.',
    options: [
      {
        label: 'I avoid photos/selfies',
        value: '0',
        icon: { type: 'emoji', value: '📸' },
      },
      {
        label: 'I feel less confident in social settings',
        value: '1',
        icon: { type: 'emoji', value: '😔' },
      },
      {
        label: 'I think about it multiple times a day',
        value: '2',
        icon: { type: 'emoji', value: '🤔' },
      },
      {
        label: "I've tried fixing it before",
        value: '3',
        icon: { type: 'emoji', value: '🪄' },
      },
      {
        label: "I've never understood why my face looks uneven",
        value: '4',
        icon: { type: 'emoji', value: '😶' },
      },
    ],
  },

  {
    id: 'commitment',
    type: 'single',
    title: 'Are you committed to following our routines?',
    subtitle:
      'If we made you a daily routine to fix asymmetry, will you follow it?',
    options: [
      {
        label: "Yes, I'm done being uneven",
        value: 'yes-committed',
        icon: { type: 'emoji', value: '✅' },
      },
      {
        label: "No, I'll just pay for surgery",
        value: 'no-surgery',
        icon: { type: 'emoji', value: '💸' },
      },
      {
        label: "No, I'll stay asymmetrical forever",
        value: 'no-stay-uneven',
        icon: { type: 'emoji', value: '☠️' },
      },
    ],
  },
];
