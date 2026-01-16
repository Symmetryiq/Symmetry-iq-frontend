import { FeatureId } from '@/constants/factors';

export interface Feature {
  id: FeatureId;
  title: string;
  emoji: string;
  description: string;
  whatToDo: {
    title: string;
    items: {
      emoji: string;
      label: string;
      description: string;
    }[];
  };
  proTip?: string;
  commonMistakes: {
    title: string;
    items: string[];
  };
  recommendedProducts?: {
    title: string;
    items: {
      name: string;
      benefit: string;
    }[];
  };
  howToShape?: {
    title: string;
    steps: string[];
  };
  tiktokFilter?: {
    text: string;
    url: string;
  };
}

export const Features: Feature[] = [
  {
    id: 'facial-thirds',
    title: 'Facial Thirds',
    emoji: '📏',
    description:
      'Facial balance is measured in thirds: Upper (hairline to brows), Middle (brows to nose base), and Lower (nose base to chin). Perfect symmetry occurs when these sections are equal. Most imbalances stem from daily habits, posture, and muscle tension rather than bone structure.',
    whatToDo: {
      title: 'Optimization Guide',
      items: [
        {
          emoji: '🧘',
          label: 'Correct Posture',
          description:
            'Keep your chin slightly tucked and neck straight to visually shorten the midface.',
        },
        {
          emoji: '😐',
          label: 'Face Relaxation',
          description:
            'Avoid chronic brow raising or jaw clenching to prevent muscle-driven imbalance.',
        },
        {
          emoji: '💪',
          label: 'Jaw Training',
          description:
            'Practice mewing and ensure even chewing on both sides to strengthen the lower third.',
        },
        {
          emoji: '💧',
          label: 'Fluid Drainage',
          description:
            'Sleep on your back and perform a quick morning facial massage to reduce puffiness.',
        },
        {
          emoji: '✂️',
          label: 'Smart Styling',
          description:
            'Use haircuts or beard lines to frame your features and balance proportions.',
        },
      ],
    },
    proTip:
      'Consistency is key—small postural adjustments can visibly shift your balance in just 3-4 weeks.',
    commonMistakes: {
      title: 'Common Pitfalls',
      items: [
        'Chewing exclusively on one side of the mouth',
        'Applying makeup that over-highlights a single facial third',
        'Looking down at devices with a "tech neck" posture',
      ],
    },
  },
  {
    id: 'hairstyles-balance',
    title: 'Hair & Structure',
    emoji: '💇‍♂️',
    description:
      'Your hair is the natural frame of your face. A strategic cut can mask natural asymmetries and create an illusion of perfect proportions, while the wrong style can exaggerate uneven features.',
    whatToDo: {
      title: 'Styling Strategy',
      items: [
        {
          emoji: '🔍',
          label: 'Analyze Your Scan',
          description:
            'Identify your "fuller" side and part your hair away from it to create balance.',
        },
        {
          emoji: '✂️',
          label: 'Even Lengths',
          description:
            'Ensure fades and side lengths are identical to prevent a "tilted" appearance.',
        },
        {
          emoji: '💨',
          label: 'Volume Control',
          description:
            'Add lift at the crown to balance a softer jaw or narrow lower third.',
        },
        {
          emoji: '🧔',
          label: 'Sharp Lines',
          description:
            'For men, keep beard and fade heights perfectly symmetrical across both sides.',
        },
        {
          emoji: '💁‍♀️',
          label: 'Face Framing',
          description:
            'Use layers or curtain bangs to soften wider features and balance length.',
        },
      ],
    },
    proTip:
      'Check your reflection in a horizontal "flip"—it reveals exactly where your hair is throwing off your balance.',
    commonMistakes: {
      title: 'Styling Errors',
      items: [
        'Ignoring the natural direction of hair growth (cowlicks)',
        'Heavily styling one side while leaving the other flat',
        'Uneven ear-to-ear measurements on fades and tapers',
      ],
    },
  },
  {
    id: 'sleep-puffiness',
    title: 'Sleep & Fluid',
    emoji: '💤',
    description:
      'Gravity is your face’s silent sculptor. Sleeping on your side pools fluid and fat into one half of your face, leading to asymmetrical puffiness, smaller eyes, and softer jawlines over time.',
    whatToDo: {
      title: 'Nightly Protocol',
      items: [
        {
          emoji: '😴',
          label: 'Back Sleeping',
          description:
            'The "Golden Rule" for symmetry. Keeps facial tissues evenly supported.',
        },
        {
          emoji: '💧',
          label: 'Hydration Balance',
          description:
            'Drink water throughout the day to flush out fluids that cause overnight swelling.',
        },
        {
          emoji: '🧂',
          label: 'Low Sodium Nights',
          description:
            'Avoid salty snacks before bed to prevent water retention in the cheeks and eyes.',
        },
        {
          emoji: '🛏️',
          label: 'Neck Alignment',
          description:
            'Use a cervical or thin pillow to keep your head centered and neck neutral.',
        },
        {
          emoji: '🧊',
          label: 'Cold Therapy',
          description:
            'Use a chilled roller in the morning to instantly drain lymphatic fluid.',
        },
      ],
    },
    proTip:
      'A rolled towel under the neck can prevent you from rolling onto your side during deep sleep.',
    commonMistakes: {
      title: 'Morning Mistakes',
      items: [
        'Sleeping with the face pressed into the pillow',
        'Using a high pillow that creates "double chin" tension',
        'Neglecting morning hydration after 8 hours of fluid loss',
      ],
    },
  },
  {
    id: 'eyebrow-symmetry',
    title: 'Brow Alignment',
    emoji: '🪞',
    description:
      'Brows are the most expressive part of your face. Micro-differences in height or thickness can shift your entire expression. Symmetry starts with mapping, not plucking.',
    howToShape: {
      title: 'Precision Mapping',
      steps: [
        'Relax your face completely—avoid looking up or frowning.',
        'Mark the start: Use a straight edge from the nostril edge up.',
        'Mark the arch: Use a line from the nostril through the pupil center.',
        'Mark the tail: Use a line from the nostril to the outer eye corner.',
        'Check levels: Ensure all three points on both brows align horizontally.',
        'Trim slowly: Remove only hairs outside your mapped boundaries.',
      ],
    },
    whatToDo: {
      title: 'Symmetry Tools',
      items: [
        {
          emoji: '🤳',
          label: 'Virtual Guide',
          description:
            'Use the specialized AR filter to reveal your face’s ideal brow architecture.',
        },
      ],
    },
    tiktokFilter: {
      text: 'Open Precision Brow Filter',
      url: 'https://vm.tiktok.com/ZNHvPgW5tKn8x-Yfqy1/',
    },
    commonMistakes: {
      title: 'Mapping Errors',
      items: [
        'Shaping while raising eyebrows (muscle compensation)',
        'Removing too much hair before checking for symmetry',
        'Ignoring natural brow direction during trimming',
      ],
    },
  },
  {
    id: 'beard-jaw-balance',
    title: 'Beard & Jawline',
    emoji: '🧔',
    description:
      'A well-groomed beard acts as a scaffold for your jawline. Uneven growth or asymmetrical trimming can make your face look slanted, even if your bone structure is perfect.',
    whatToDo: {
      title: 'Sculpting Habit',
      items: [
        {
          emoji: '✂️',
          label: 'Level Trimming',
          description:
            'Use adjustable guards to maintain identical density on both cheeks.',
        },
        {
          emoji: '📏',
          label: 'Line Matching',
          description:
            'Keep the highest cheek points and lowest neckline points perfectly level.',
        },
        {
          emoji: '🧴',
          label: 'Conditioning',
          description:
            'Use balm to soften hairs and allow them to lay flat against the skin.',
        },
        {
          emoji: '🪮',
          label: 'Directional Training',
          description:
            'Brush daily to train hair growth and fill in asymmetrical patches.',
        },
      ],
    },
    recommendedProducts: {
      title: 'The Grooming Kit',
      items: [
        { name: 'Precision Trimmer', benefit: 'Ensures micro-level symmetry' },
        { name: 'Clear Shaving Gel', benefit: 'Total visibility while lining' },
        { name: 'Boar Bristle Brush', benefit: 'Trains hair growth patterns' },
        { name: 'Beard Balm', benefit: 'Adds structure and fills patches' },
      ],
    },
    commonMistakes: {
      title: 'Grooming Fails',
      items: [
        'Trimming one side fully before starting the other',
        'Setting the neckline too high on the jaw',
        'Ignoring differences in sideburn height',
      ],
    },
  },
  {
    id: 'eye-alignment-bags',
    title: 'Eye Symmetry',
    emoji: '👁️',
    description:
      'Eye focus defines your facial presence. Most "unevenness" is actually localized swelling, fatigue, or muscle tension rather than bone position.',
    whatToDo: {
      title: 'Refresh Ritual',
      items: [
        {
          emoji: '🧊',
          label: 'Cold Compression',
          description:
            'Apply cold rollers to flush fluid from under-eye bags instantly.',
        },
        {
          emoji: '💆',
          label: 'Lymphatic Drainage',
          description:
            'Gently sweep fluid from the inner corner toward the temples.',
        },
        {
          emoji: '🌑',
          label: 'Digital Detox',
          description:
            'Reduce squinting and "tech neck" to keep orbital muscles balanced.',
        },
        {
          emoji: '💧',
          label: 'Hydration Control',
          description:
            'Balance sodium intake to prevent focal water retention around the eyes.',
        },
      ],
    },
    recommendedProducts: {
      title: 'The Eye Reboot',
      items: [
        { name: 'Caffeine Serum', benefit: 'Rapidly tightens under-eye skin' },
        { name: 'Ice Globes', benefit: 'Reduces inflammation and swelling' },
        { name: 'Hydrating Patches', benefit: 'Deep moisture for eye hollows' },
        {
          name: 'Tinted Mineral Sunscreen',
          benefit: 'Evens tone and protects',
        },
      ],
    },
    commonMistakes: {
      title: 'Eye Habits',
      items: [
        'Aggressive rubbing which damages thin skin',
        'Consistent side-sleeping on the same eye',
        'Dehydration coupled with high sodium intake',
      ],
    },
  },
  {
    id: 'diet-symmetry',
    title: 'Nutritional Balance',
    emoji: '🥦',
    description:
      'Your diet is the fuel for your skin and muscle tone. Inflammation from sugar and salt manifests as focal swelling, hiding your natural bone structure and profile.',
    whatToDo: {
      title: 'Dietary Protocol',
      items: [
        {
          emoji: '🥩',
          label: 'Protein Priority',
          description:
            'Maintain high protein intake to support facial muscle tone and skin elasticity.',
        },
        {
          emoji: '🍌',
          label: 'Potassium Intake',
          description:
            'Eat spinach and avocados to counter-balance sodium and reduce bloating.',
        },
        {
          emoji: '🌿',
          label: 'Anti-Inflammation',
          description:
            'Focus on whole foods to keep skin tight and jawline definition sharp.',
        },
        {
          emoji: '🍵',
          label: 'Detoxifying Fluids',
          description:
            'Use green tea or herbal infusions to assist natural fluid drainage.',
        },
      ],
    },
    recommendedProducts: {
      title: 'Anti-Bloat Stack',
      items: [
        { name: 'Green Tea Extract', benefit: 'Reduces systemic inflammation' },
        { name: 'Magnesium/Potassium', benefit: 'Flushes excess water weight' },
        {
          name: 'Omega-3 (Fish Oil)',
          benefit: 'Maintains skin barrier health',
        },
      ],
    },
    commonMistakes: {
      title: 'Fueling Errors',
      items: [
        'Drinking all daily water in one sitting at night',
        'Consuming high-sodium "cheat meals" before bed',
        'Ignoring the inflammatory effect of refined sugar',
      ],
    },
  },
  {
    id: 'nose-centering',
    title: 'Nasal Alignment',
    emoji: '👃',
    description:
      "The nose is your face's anchor. While structural deviation is common, muscle tension and breathing habits often pull the nose visually off-center over time.",
    whatToDo: {
      title: 'Alignment Habits',
      items: [
        {
          emoji: '👃',
          label: 'Nasal Breathing',
          description:
            'Practice even airflow through both nostrils to keep nasal muscles balanced.',
        },
        {
          emoji: '💆',
          label: 'Bridge Massage',
          description:
            'Perform gentle upward strokes to release tension in the procerus muscle.',
        },
        {
          emoji: '🧘',
          label: 'Head Leveling',
          description:
            'Adjust your posture to avoid a chronic head tilt that skews nasal perspective.',
        },
        {
          emoji: '😴',
          label: 'Back Support',
          description:
            'Eliminate side-pressure on the bridge by sleeping on your back.',
        },
      ],
    },
    recommendedProducts: {
      title: 'Nasal Support',
      items: [
        {
          name: 'Nasal Strips',
          benefit: 'Ensures even airflow while sleeping',
        },
        {
          name: 'Saline Rinse',
          benefit: 'Clears blockages for even breathing',
        },
        {
          name: 'Cold Roller',
          benefit: 'Reduces focal swelling on the bridge',
        },
      ],
    },
    commonMistakes: {
      title: 'Alignment Blocks',
      items: [
        'Breathing predominantly through one nostril',
        'Resting the head on your hand, pushing against the nose',
        'Tilting the head to one side in photos and mirrors',
      ],
    },
  },
  {
    id: 'jaw-muscle-balance',
    title: 'Jaw Muscle Toning',
    emoji: '💪',
    description:
      'The masseters are the strongest muscles in the face. Uneven chewing or clenching creates "bulges" on one side, destroying jawline symmetry and sharpening.',
    whatToDo: {
      title: 'Muscle Training',
      items: [
        {
          emoji: '🍖',
          label: 'Bilateral Chewing',
          description:
            'Consciously alternate sides when eating to ensure even muscle growth.',
        },
        {
          emoji: '🧘',
          label: 'Clench Awareness',
          description:
            'Maintain a slight space between teeth to prevent masseter overgrowth.',
        },
        {
          emoji: '💆',
          label: 'Release Massage',
          description:
            'Use circular motions daily to release "knots" in the jaw muscles.',
        },
        {
          emoji: '🔨',
          label: 'Isometric Drills',
          description:
            'Use jaw resistance tools to specifically target the weaker side.',
        },
      ],
    },
    recommendedProducts: {
      title: 'Jaw Sculptors',
      items: [
        {
          name: 'Jaw Resistance Tool',
          benefit: 'Builds even muscle definition',
        },
        { name: 'Gua Sha Stone', benefit: 'Releases chronic muscle tension' },
        { name: 'Warm Compress', benefit: 'Prioritizes muscle relaxation' },
        {
          name: 'Facial Massager',
          benefit: 'Deep tissue release for masseters',
        },
      ],
    },
    commonMistakes: {
      title: 'Muscle Excess',
      items: [
        'Overtraining one side with hard gum or tools',
        'Chewing gum for extended periods on a favorite side',
        'Ignoring grinding (bruxism) while sleeping',
      ],
    },
  },
  {
    id: 'makeup-balance',
    title: 'Aesthetic Scaling',
    emoji: '💄',
    description:
      'Makeup is the art of shadow and light. Strategic placement can instantly correct perceived asymmetry by guiding the eye toward balance.',
    whatToDo: {
      title: 'Corrective Technique',
      items: [
        {
          emoji: '🎭',
          label: 'Dynamic Contouring',
          description:
            'Use deeper shadows on the fuller side to visually compress width.',
        },
        {
          emoji: '✨',
          label: 'Center Highlighting',
          description:
            'Keep highlight on the midline (nose, forehead) to anchor symmetry.',
        },
        {
          emoji: '🎨',
          label: 'Blush Leveling',
          description:
            'Adjust blush height to compensate for one cheek being lower or fuller.',
        },
        {
          emoji: '👄',
          label: 'Lip Balancing',
          description:
            'Overline micro-sections of the mouth to match the fuller side.',
        },
      ],
    },
    recommendedProducts: {
      title: 'The Symmetry Kit',
      items: [
        { name: 'Cream Contour Stick', benefit: 'Precision shadow placement' },
        { name: 'Highlighter Pen', benefit: 'Sharp midline illumination' },
        { name: 'Angled Blush Brush', benefit: 'Controlled lifting effect' },
        { name: 'Dual-Side Mirror', benefit: 'Shows even light distribution' },
      ],
    },
    commonMistakes: {
      title: 'Application Fails',
      items: [
        'Applying makeup in uneven, side-angled lighting',
        'Using heavy products that settle into asymmetrical lines',
        'Over-highlighting an already prominent feature',
      ],
    },
  },
];
