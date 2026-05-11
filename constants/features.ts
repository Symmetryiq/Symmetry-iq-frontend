import { Feature } from '@/types/feature.types';

export const FEATURES: Feature[] = [
  {
    id: 'overall_symmetry',
    title: 'Overall Symmetry',
    goal: 85,
    polarity: 'higher',
    description:
      'This score measures how evenly your facial features are aligned from left to right. A higher score means your face is well balanced, while a lower one suggests minor asymmetries that can be caused by muscle tension, sleeping position, or posture. Over time, balanced habits can improve your symmetry.',
  },
  {
    id: 'facial_thirds',
    title: 'Facial Thirds',
    goal: 70,
    polarity: 'higher',
    description:
      'This measures the proportion between your forehead, midface, and lower face. When all three areas are close in size, the face looks naturally more proportional and aesthetic. Changes in posture, hairstyle, or facial exercises can slightly improve this balance.',
  },
  {
    id: 'eye_alignment',
    title: 'Eye Alignment',
    goal: 85,
    polarity: 'higher',
    description:
      'This checks how level your eyes are in relation to each other. Small differences are normal, but a larger gap may be linked to puffiness, tension, or uneven sleep posture. As your facial balance improves, alignment tends to become more even.',
  },
  {
    id: 'nose_centering',
    title: 'Nose Centering',
    goal: 80,
    polarity: 'higher',
    description:
      'This measures how centered your nose is compared to your facial midline. A perfectly centered nose adds harmony, while small shifts can come from natural asymmetry or old habits like leaning on one side of your face.',
  },
  {
    id: 'jawline_symmetry',
    title: 'Jawline Symmetry',
    goal: 80,
    polarity: 'higher',
    description:
      'This checks if both sides of your jawline are equally sharp and defined. Unevenness can come from chewing habits, posture, or temporary puffiness. Over time, reducing bloating and balancing muscle use can enhance definition.',
  },
  {
    id: 'chin_alignment',
    title: 'Chin Alignment',
    goal: 80,
    polarity: 'higher',
    description:
      'This shows how centered your chin is compared to your lips and nose. A centered chin improves overall facial balance, while slight shifts can be influenced by posture, dental alignment, or facial tension.',
  },
  {
    id: 'lower_face_proportion',
    title: 'Lower Face Proportions',
    goal: 80,
    polarity: 'higher',
    description:
      'This compares the length of your midface to your lower face. A well-proportioned ratio creates a more harmonious profile. This measurement is largely structural — driven by bone proportion rather than daily habits — so it tends to stay stable over time.',
  },
  {
    id: 'eye_spacing_ratio',
    title: 'Eye Spacing Ratio',
    goal: 75,
    polarity: 'higher',
    description:
      'This measures the distance between your eyes relative to your face width. Balanced eye spacing contributes to a naturally proportional look. Like other skeletal measurements, this score is structural and remains fairly consistent.',
  },
];
