export const SUBSCRIPTION_PLANS = [
  {
    id: 'weekly',
    title: 'Weekly Premium',
    price: '$4.99',
    duration: '7 days',
    features: [
      'AI face scans',
      'Full routine library',
      'Daily tasks',
      'AI insights & guidance',
      'Ad-free experience',
    ],
    recommended: false,
  },
  {
    id: 'monthly',
    title: 'Monthly Premium',
    price: '$12.99',
    duration: '30 days',
    features: [
      'AI face scans',
      'Full routine library',
      'Daily tasks',
      'AI insights & guidance',
      'Ad-free experience',
    ],
    recommended: false,
  },
  {
    id: 'yearly',
    title: 'Yearly Premium',
    price: '$29.99',
    duration: '12 months',
    features: [
      'AI face scans',
      'Full routine library',
      'Daily tasks',
      'AI insights & guidance',
      'Ad-free experience',
    ],
    recommended: true,
    badge: 'BEST VALUE',
  },
];

export const PREMIUM_FEATURES = [
  {
    title: 'AI Face Scans',
    description: 'Instant facial metrics and symmetry analysis.',
    icon: 'Scan',
  },
  {
    title: 'Full Routine Library',
    description: 'Mewing, masseter balance, posture work & more.',
    icon: 'Brain',
  },
  {
    title: 'Daily Personalized Tasks',
    description: 'Dynamic checklist based on your scan scores.',
    icon: 'ListChecks',
  },
  {
    title: 'Expert Guidance',
    description: 'Text-based plans to improve your facial balance.',
    icon: 'BookOpen',
  },
  {
    title: 'Ad-Free Experience',
    description: 'Focus on your progress without interruptions.',
    icon: 'Prohibit',
  },
];
