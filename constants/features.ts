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
    id: 'eyebrow_symmetry',
    title: 'Eyebrow Symmetry',
    goal: 80,
    polarity: 'higher',
    description:
      'This shows how evenly your eyebrows sit and move on each side. Uneven brows can make one eye area appear more lifted or expressive. Grooming, tinting, or targeted brow care can help balance their height and shape.',
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
    id: 'facial_puffiness',
    title: 'Facial Puffiness',
    goal: 15,
    polarity: 'lower',
    description:
      'This reflects how lean or swollen your face currently appears. A higher score means your face is holding more water or sodium, often from diet, hormones, or lack of sleep. As your hydration and nutrition improve, this score should gradually drop.',
  },
  {
    id: 'midface_ratio',
    title: 'Midface Ratio',
    goal: 80,
    polarity: 'higher',
    description:
      'This measures the length of your midface (from the brow bone to the base of the nose) compared to your lower face. A balanced midface ratio creates a more harmonious and youthful look. Factors like genetics, aging, and even dental alignment can influence this measurement.',
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
    id: 'cheekbone_balance',
    title: 'Cheekbone Balance',
    goal: 75,
    polarity: 'higher',
    description:
      'This measures if your cheekbones are equally high and pronounced. Balanced cheekbones add structure and symmetry to your face, while puffiness or uneven muscle tone can make one side appear lower.',
  },
  {
    id: 'chin_alignment',
    title: 'Chin Alignment',
    goal: 80,
    polarity: 'higher',
    description:
      'This shows how centered your chin is compared to your lips and nose. A centered chin improves overall facial balance, while slight shifts can be influenced by posture, dental alignment, or facial tension.',
  },
];
