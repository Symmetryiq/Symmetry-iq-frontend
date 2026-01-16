export type FeatureId =
  | 'facial-thirds'
  | 'hairstyles-balance'
  | 'sleep-puffiness'
  | 'eyebrow-symmetry'
  | 'beard-jaw-balance'
  | 'eye-alignment-bags'
  | 'diet-symmetry'
  | 'nose-centering'
  | 'jaw-muscle-balance'
  | 'makeup-balance';

export interface Feature {
  id: FeatureId;
  title: string;
  emoji: string;
  description: string;
  whatToDo: {
    title: string;
    items: string[];
  };
  proTip?: string;
  commonMistakes: {
    title: string;
    items: string[];
  };
  recommendedProducts?: {
    title: string;
    items: string[];
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
      "Your face can be divided into three equal parts:\n\nUpper third: hairline to eyebrows\n\nMiddle third: eyebrows to bottom of the nose\n\nLower third: bottom of the nose to the chin\n\nWhen these three parts are close in size, your face looks balanced.\n\nBut if one is longer or shorter, it can make your face look slightly uneven.\n\nA longer midface can make the eyes look lower, while a shorter lower face can make the jawline look weaker.\n\nMost of these differences don't come from bone structure.\n\nThey often come from posture, muscle tension, or puffiness, which can easily change with daily habits.",
    whatToDo: {
      title: 'What to Do',
      items: [
        '🧘 Fix posture: Keep your chin slightly tucked and neck straight to make your midface appear shorter.',
        '😐 Relax your face: Avoid frowning, clenching, or raising your eyebrows too often.',
        '💪 Train the lower third: Try mewing and chew evenly on both sides to strengthen the jaw.',
        '💧 Reduce puffiness: Sleep on your back and do a short facial massage each morning.',
        "⚖️ Avoid habits that unbalance the face: Don't rest your chin on your hand or press your face into a pillow.",
        '✂️ Style smart: A haircut or beard that adds balance to your upper or lower third can instantly improve symmetry.',
      ],
    },
    proTip:
      'Even small changes in posture and jaw strength can improve your facial balance in just a few weeks.',
    commonMistakes: {
      title: 'Common Mistakes',
      items: [
        'Training the jaw on only one side',
        'Using makeup that over highlights one third',
        'Sitting or standing with the head tilted forward',
      ],
    },
  },
  {
    id: 'hairstyles-balance',
    title: 'Hairstyles & Balance',
    emoji: '💇‍♂️',
    description:
      'Your hairstyle can completely change how balanced your face looks.\n\nHair creates structure and frames your features.\n\nA good haircut can make your face appear more symmetrical, while the wrong one can exaggerate unevenness.\n\nA middle part works best when both sides are already even.\n\nA side part can highlight asymmetry if one side of your face is fuller.\n\nFor men, even fade height and beard lines affect how balanced the face looks.\n\nFor women, curtain bangs or layered cuts help balance longer or wider faces.',
    whatToDo: {
      title: 'What to Do',
      items: [
        '🔍 Check your scan: If one side is higher or fuller, part your hair away from that side.',
        '🚫 Avoid strong side parts if your face is already uneven.',
        '✂️ Keep both sides the same length: Uneven cuts or fades make your face look tilted.',
        '💨 Add volume where needed: Lift near the crown or sides to balance a softer jawline.',
        '🧔 For men: Keep fade heights and beard lines even.',
        '💁‍♀️ For women: Curtain bangs or soft layers work well to balance proportions.',
        "⚖️ Don't style one side heavier: Too much volume on one side throws off symmetry.",
      ],
    },
    proTip:
      "Flip a front facing selfie horizontally. You'll quickly see which hairstyle makes your face look more balanced.",
    commonMistakes: {
      title: 'Common Mistakes',
      items: [
        'Uneven hair lengths on the sides',
        'Too much styling or volume on one side',
        'Ignoring natural hair direction, which can make one side look heavier',
      ],
    },
  },
  {
    id: 'sleep-puffiness',
    title: 'Sleep & Puffiness',
    emoji: '💤',
    description:
      "Your sleeping position has a big effect on how your face looks in the morning.\n\nIf you always sleep on one side, gravity pushes fluid and fat to that side, which makes it puffier and rounder over time.\n\nThis can make one eye look smaller, one cheek fuller, or your jawline softer.\n\nBad sleep quality also raises stress hormones that cause inflammation and water retention in the face.\n\nThat's why your cheeks or under-eyes look swollen when you wake up after a bad night's sleep.",
    whatToDo: {
      title: 'What to Do',
      items: [
        '😴 Sleep on your back: Keeps both sides of your face evenly supported.',
        '💧 Stay hydrated: Drink enough water during the day to help drain fluids naturally.',
        '🧂 Avoid salt late at night: Salt causes your face to hold extra water overnight.',
        '🧊 Use cold therapy: Apply a cold roller or spoon under your eyes in the morning to reduce puffiness.',
        '🧘 Try gentle facial massage: Helps drain built-up fluid from your cheeks and jaw.',
        '🛏️ Use a thin or adjustable pillow: Keeps your neck aligned and prevents pressure on your face.',
        '🧻 Add a rolled towel under your neck: It keeps your head straight, supports your spine, and makes it easier to stay sleeping on your back.',
        '🕒 Keep a consistent sleep schedule: Good rest keeps hormones balanced and your face tighter over time.',
      ],
    },
    proTip:
      'Even 5–7 nights of sleeping on your back can make your face look more even and reduce under-eye puffiness.',
    commonMistakes: {
      title: 'Common Mistakes',
      items: [
        'Sleeping on the same side every night',
        'Using a high pillow that bends your neck',
        'Skipping morning hydration after waking up',
      ],
    },
  },
  {
    id: 'eyebrow-symmetry',
    title: 'Eyebrow Symmetry',
    emoji: '🪞',
    description:
      'Your eyebrows have a big impact on how balanced your face looks.\n\nEven small differences in height or thickness can make your face look uneven.\n\nFollow these simple steps to shape them more symmetrical.',
    howToShape: {
      title: 'How to shape your brows',
      steps: [
        'Look straight in the mirror with a relaxed face.',
        'Use a pencil or ruler:\n• Next to your nose → where the brow should start.\n• Through the middle of your eye → where the arch should be.\n• To the outer corner → where it should end.',
        'Lightly mark these points on both brows to check if they line up evenly.',
        'Use a small razor, trimmer, or tweezers to remove hairs outside the marked lines.',
        'Work slowly, switch between brows, and check both sides after each step.',
        'Brush both brows upward and clean around the edges.',
      ],
    },
    whatToDo: {
      title: 'What to Do',
      items: [
        'Use this TikTok filter to see the perfect eyebrow shape for your face.',
      ],
    },
    tiktokFilter: {
      text: '👉 Press here to try the filter',
      url: 'https://vm.tiktok.com/ZNHvPgW5tKn8x-Yfqy1/',
    },
    commonMistakes: {
      title: 'Common mistakes',
      items: [
        'Raising your eyebrows while shaping',
        'Removing too much before checking both sides',
        'Not brushing or cleaning between each step',
      ],
    },
  },
  {
    id: 'beard-jaw-balance',
    title: 'Beard & Jaw Balance',
    emoji: '🧔',
    description:
      'Your beard and jawline are the frame of your face.\n\nIf one side of your beard grows thicker, starts higher, or is trimmed differently, it can make your entire face look uneven even if your bone structure is perfectly symmetrical underneath.\n\nA well balanced beard helps define the lower third of your face and makes the jawline appear sharper and more even.\n\nUneven trimming or patchy growth can make one side seem heavier or the jaw look slanted.',
    whatToDo: {
      title: 'What to Do',
      items: [
        'Trim evenly: Always check both sides in the mirror before finishing one side.',
        "Keep cheek and neck lines level: The highest point of your beard should match on both sides, and the neck line should stay just above the Adam's apple.",
        'Brush daily: It spreads natural oils and helps your beard grow in the same direction.',
        'Moisturize and condition: Healthy, soft beard hair sits more evenly and fills patches naturally.',
      ],
    },
    recommendedProducts: {
      title: 'Recommended Products',
      items: [
        'Beard trimmer with adjustable guard helps you keep both sides even.',
        'Transparent shaving gel lets you see the shape clearly while shaving.',
        'Beard oil or balm softens hair, fills patches, and keeps growth even.',
        'Beard brush or comb trains the hair to grow symmetrically.',
      ],
    },
    commonMistakes: {
      title: 'Common Mistakes',
      items: [
        'Trimming one side too short before checking the other',
        'Ignoring patchy areas that make the beard look uneven',
        'Shaving the neckline too high or unevenly',
      ],
    },
  },
  {
    id: 'eye-alignment-bags',
    title: 'Eye Alignment & Eye Bags',
    emoji: '👁️',
    description:
      'The area around your eyes strongly affects how symmetrical your face looks.\n\nEven small differences like one eye sitting slightly higher or one side being puffier can make your whole face look uneven or tired.\n\nMost of this comes from fluid retention, lack of sleep, or muscle tension, not bone structure.\n\nSwelling under one eye or drooping from poor sleep habits often makes one side appear lower or heavier.',
    whatToDo: {
      title: 'What to Do',
      items: [
        'Sleep on your back: Avoid pressing one side of your face into the pillow.',
        'Use cold therapy in the morning: A chilled spoon, roller, or ice globe can reduce puffiness fast.',
        'Massage gently: Use your ring finger to move fluid from the inner corner outward.',
        'Stay hydrated: Dehydration makes your eyes retain more water, especially after salty food.',
        'Take screen breaks: Looking down or squinting too long can affect muscle balance around the eyes.',
      ],
    },
    recommendedProducts: {
      title: 'Recommended Products',
      items: [
        'Caffeine eye serum or cream tightens and brightens under eye skin.',
        'Cold roller or ice globes reduce swelling and cool the skin.',
        'Hydrating eye patches are perfect in the morning to reduce puffiness.',
        'Mineral tinted sunscreen covers redness and protects delicate skin from UV damage.',
      ],
    },
    commonMistakes: {
      title: 'Common Mistakes',
      items: [
        'Rubbing your eyes too hard or too often',
        'Sleeping on the same side every night',
        'Ignoring hydration and sodium balance',
      ],
    },
  },
  {
    id: 'diet-symmetry',
    title: 'Diet & Symmetry',
    emoji: '🥦',
    description:
      'What you eat plays a big role in how symmetrical your face looks.\n\nA clean, balanced diet helps reduce puffiness, bloating, and uneven swelling that make one side look fuller or softer.\n\nWhen you eat too much salt, sugar, or processed food, your body holds onto water, which can make your jawline, cheeks, and eyes look uneven.\n\nA diet rich in whole, nutrient dense foods keeps inflammation low, skin tighter, and muscles balanced.\n\nIt does not change your bone structure, but it changes how defined and proportionate your face appears.',
    whatToDo: {
      title: 'What to Do',
      items: [
        'Eat whole foods: Choose vegetables, fruits, lean protein, and healthy fats.',
        'Keep protein high: Eat roughly twice your bodyweight in kilograms (in grams of protein) each day to support muscle tone and facial definition.',
        'Stay hydrated: Water flushes out excess sodium and helps the face stay lean and even.',
        'Avoid salty and processed foods: They cause water retention and puffiness.',
        'Add potassium rich foods: Bananas, kiwis, spinach, and avocado help reduce bloating.',
        'Limit alcohol and sugar: Both can make your face look rounder and tired.',
      ],
    },
    recommendedProducts: {
      title: 'Recommended Products',
      items: [
        'Green tea or herbal detox tea helps reduce bloating and inflammation.',
        'Electrolyte mix or coconut water restores balance when hydrating.',
        'Zinc or omega-3 supplements support clear skin and reduced puffiness.',
      ],
    },
    commonMistakes: {
      title: 'Common Mistakes',
      items: [
        'Skipping water all day and drinking it only at night',
        'Eating too salty before bed',
        'Believing that diet has no impact on facial balance',
      ],
    },
  },
  {
    id: 'nose-centering',
    title: 'Nose Centering',
    emoji: '👃',
    description:
      'Your nose is the center of your face, and even a small tilt or curve can make your whole face appear off balance.\n\nThis can be natural, but it can also come from uneven muscle tension, posture, or sleeping habits that affect the tissues around the nose.\n\nMost people have a slightly off center nose, which is completely normal.\n\nStill, you can make it appear more centered by improving your breathing, posture, and muscle balance around the face.',
    whatToDo: {
      title: 'What to Do',
      items: [
        'Sleep on your back: Keeps pressure off one side of your nose.',
        'Practice nasal breathing: Try to breathe evenly through both nostrils during the day.',
        'Use a nose magnet or nasal trainer: It helps open both sides of the nose and encourages even airflow.',
        'Massage the nose bridge: Use gentle upward strokes with your fingers for 30 seconds daily to relax tight muscles. (This will be explained more clearly in one of our routines.)',
        'Fix your posture: Keep your head straight and avoid tilting slightly to one side when looking at screens or mirrors.',
      ],
    },
    recommendedProducts: {
      title: 'Recommended Products',
      items: [
        'Nose magnet or nasal breathing trainer improves airflow and helps keep both sides open.',
        'Saline nasal spray clears blockages and prevents uneven breathing habits.',
        'Cold compress or ice roller reduces swelling after sleeping on one side.',
        'Light facial oil or serum can be used for gentle nose massages to relax surrounding muscles.',
      ],
    },
    commonMistakes: {
      title: 'Common Mistakes',
      items: [
        'Always sleeping on the same side',
        'Breathing mainly through one nostril',
        'Tilting your head in photos or mirrors without noticing',
      ],
    },
  },
  {
    id: 'jaw-muscle-balance',
    title: 'Jaw Muscle Balance',
    emoji: '💪',
    description:
      "Your masseter muscles is the large muscles on each side of your jaw\n\nIf you chew mostly on one side, clench unevenly, or have an unbalanced bite, one side of your masseter can grow stronger and larger than the other.\n\nThis creates visible asymmetry around your jawline and cheeks over time.\n\nTraining both sides evenly helps balance your face and make your lower third appear sharper and more aligned.\n\nIt's not about overtraining but about building control and awareness of both sides equally.",
    whatToDo: {
      title: 'What to Do',
      items: [
        '• Chew evenly: Pay attention to which side you use more and switch sides while eating.',
        '• Relax your jaw: Avoid constant clenching or grinding your teeth.',
        '• Train the weaker side: Light jaw exercises or chewing tools can help balance muscle tone.',
        '• Massage daily: Use gentle circular motions to release tension on both sides.',
        '• Keep good posture: A forward head position can strain one side of your jaw more.',
      ],
    },
    recommendedProducts: {
      title: 'Recommended Products',
      items: [
        '• Jaw trainer or chewing device to build even strength on both sides.',
        '• Massage gun or facial massager to release tightness and improve blood flow.',
        '• Gua Sha or facial roller to smooth tension and improve muscle balance.',
        '• Warm compress before massage to relax the jaw muscles.',
      ],
    },
    commonMistakes: {
      title: 'Common Mistakes',
      items: [
        'Overtraining one side with jaw trainers',
        'Chewing gum all day on one side',
        'Ignoring jaw tension or uneven clenching',
      ],
    },
  },
  {
    id: 'makeup-balance',
    title: 'Makeup Balance',
    emoji: '💄',
    description:
      'Makeup can instantly make your face appear more balanced when applied with small adjustments.\n\nEven if your facial structure is slightly uneven, the right placement of contour, blush, and highlight can make your features look symmetrical and well defined.\n\nThe goal is not to cover your face but to guide attention evenly, so both sides match naturally in light, shadow, and color.',
    whatToDo: {
      title: 'What to Do',
      items: [
        'Contour evenly: Apply slightly more contour on the fuller side of your face to balance width.',
        'Highlight the center: Use highlight down the middle of your nose and forehead to draw attention to symmetry.',
        'Balance your blush: Place blush a little higher on the lower cheek to even out height differences.',
        'Shape lips evenly: Overline only where needed to match both sides of your mouth.',
        'Match your brows and eyeliner: Make sure they rise and end at the same angle on both sides.',
      ],
    },
    recommendedProducts: {
      title: 'Recommended Products',
      items: [
        'Cream contour stick for smooth blending and natural symmetry.',
        'Highlighter pen or liquid to brighten the center of the face.',
        'Angled blush brush for more controlled, even application.',
        'Makeup mirror with even lighting to avoid shadows that distort symmetry.',
      ],
    },
    commonMistakes: {
      title: 'Common Mistakes',
      items: [
        'Applying contour unevenly on both sides',
        'Using lighting from only one direction when doing makeup',
        'Over highlighting one cheekbone',
      ],
    },
  },
];
