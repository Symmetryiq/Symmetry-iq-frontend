import { Tip } from '@/types/tips.types';

export const TIPS: Tip[] = [
  {
    id: 'facial-thirds',
    title: 'Facial Thirds',
    icon: '📏',
    description:
      "Your face can be divided into three equal parts:\n\n• Upper third: hairline to eyebrows\n• Middle third: eyebrows to bottom of the nose\n• Lower third: bottom of the nose to the chin\n\nWhen these three parts are close in size, your face looks balanced. But if one is longer or shorter, it can make your face look slightly uneven.\n\nA longer midface can make the eyes look lower, while a shorter lower face can make the jawline look weaker.\n\nMost of these differences don't come from bone structure. They often come from posture, muscle tension, or puffiness, which can easily change with daily habits.",
    actionItems: [
      {
        emoji: '🧘',
        text: 'Fix posture: Keep your chin slightly tucked and neck straight to make your midface appear shorter.',
      },
      {
        emoji: '😐',
        text: 'Relax your face: Avoid frowning, clenching, or raising your eyebrows too often.',
      },
      {
        emoji: '💪',
        text: 'Train the lower third: Try mewing and chew evenly on both sides to strengthen the jaw.',
      },
      {
        emoji: '💧',
        text: 'Reduce puffiness: Sleep on your back and do a short facial massage each morning.',
      },
      {
        emoji: '⚖️',
        text: "Avoid habits that unbalance the face: Don't rest your chin on your hand or press your face into a pillow.",
      },
      {
        emoji: '✂️',
        text: 'Style smart: A haircut or beard that adds balance to your upper or lower third can instantly improve symmetry.',
      },
    ],
    proTip:
      'Even small changes in posture and jaw strength can improve your facial balance in just a few weeks.',
    commonMistakes: [
      'Training the jaw on only one side',
      'Using makeup that over highlights one third',
      'Sitting or standing with the head tilted forward',
    ],
  },
  {
    id: 'hairstyles-balance',
    title: 'Hairstyles & Balance',
    icon: '💇',
    description:
      'Your hairstyle can completely change how balanced your face looks. Hair creates structure and frames your features.\n\nA good haircut can make your face appear more symmetrical, while the wrong one can exaggerate unevenness.\n\nA middle part works best when both sides are already even. A side part can highlight asymmetry if one side of your face is fuller.\n\nFor men, even fade height and beard lines affect how balanced the face looks. For women, curtain bangs or layered cuts help balance longer or wider faces.',
    actionItems: [
      {
        emoji: '🔍',
        text: 'Check your scan: If one side is higher or fuller, part your hair away from that side.',
      },
      {
        emoji: '🚫',
        text: 'Avoid strong side parts if your face is already uneven.',
      },
      {
        emoji: '✂️',
        text: 'Keep both sides the same length: Uneven cuts or fades make your face look tilted.',
      },
      {
        emoji: '💨',
        text: 'Add volume where needed: Lift near the crown or sides to balance a softer jawline.',
      },
      { emoji: '🧔', text: 'For men: Keep fade heights and beard lines even.' },
      {
        emoji: '👩',
        text: 'For women: Curtain bangs or soft layers work well to balance proportions.',
      },
      {
        emoji: '⚖️',
        text: "Don't style one side heavier: Too much volume on one side throws off symmetry.",
      },
    ],
    proTip:
      "Flip a front facing selfie horizontally. You'll quickly see which hairstyle makes your face look more balanced.",
    commonMistakes: [
      'Uneven hair lengths on the sides',
      'Too much styling or volume on one side',
      'Ignoring natural hair direction, which can make one side look heavier',
    ],
  },
  {
    id: 'sleep-puffiness',
    title: 'Sleep & Puffiness',
    icon: '💤',
    description:
      "Your sleeping position has a big effect on how your face looks in the morning.\n\nIf you always sleep on one side, gravity pushes fluid and fat to that side, which makes it puffier and rounder over time. This can make one eye look smaller, one cheek fuller, or your jawline softer.\n\nBad sleep quality also raises stress hormones that cause inflammation and water retention in the face. That's why your cheeks or under-eyes look swollen when you wake up after a bad night's sleep.",
    actionItems: [
      {
        emoji: '😴',
        text: 'Sleep on your back: Keeps both sides of your face evenly supported.',
      },
      {
        emoji: '💧',
        text: 'Stay hydrated: Drink enough water during the day to help drain fluids naturally.',
      },
      {
        emoji: '🧂',
        text: 'Avoid salt late at night: Salt causes your face to hold extra water overnight.',
      },
      {
        emoji: '🧊',
        text: 'Use cold therapy: Apply a cold roller or spoon under your eyes in the morning to reduce puffiness.',
      },
      {
        emoji: '🧘',
        text: 'Try gentle facial massage: Helps drain built-up fluid from your cheeks and jaw.',
      },
      {
        emoji: '🛏',
        text: 'Use a thin or adjustable pillow: Keeps your neck aligned and prevents pressure on your face.',
      },
      {
        emoji: '🧻',
        text: 'Add a rolled towel under your neck: It keeps your head straight, supports your spine, and makes it easier to stay sleeping on your back.',
      },
      {
        emoji: '🕒',
        text: 'Keep a consistent sleep schedule: Good rest keeps hormones balanced and your face tighter over time.',
      },
    ],
    proTip:
      'Even 5–7 nights of sleeping on your back can make your face look more even and reduce under-eye puffiness.',
    commonMistakes: [
      'Sleeping on the same side every night',
      'Using a high pillow that bends your neck',
      'Skipping morning hydration after waking up',
    ],
  },
  {
    id: 'eyebrow-symmetry',
    title: 'Eyebrow Symmetry',
    icon: '🪞',
    description:
      'Your eyebrows have a big impact on how balanced your face looks. Even small differences in height or thickness can make your face look uneven.\n\nFollow these simple steps to shape them more symmetrical.',
    steps: [
      { number: 1, text: 'Look straight in the mirror with a relaxed face.' },
      {
        number: 2,
        text: 'Use a pencil or ruler:\n  • Next to your nose → where the brow should start\n  • Through the middle of your eye → where the arch should be\n  • To the outer corner → where it should end',
      },
      {
        number: 3,
        text: 'Lightly mark these points on both brows to check if they line up evenly.',
      },
      {
        number: 4,
        text: 'Use a small razor, trimmer, or tweezers to remove hairs outside the marked lines.',
      },
      {
        number: 5,
        text: 'Work slowly, switch between brows, and check both sides after each step.',
      },
      {
        number: 6,
        text: 'Brush both brows upward and clean around the edges.',
      },
    ],
    commonMistakes: [
      'Raising your eyebrows while shaping',
      'Removing too much before checking both sides',
      'Not brushing or cleaning between each step',
    ],
  },
  {
    id: 'beard-jaw-balance',
    title: 'Beard & Jaw Balance',
    icon: '🧔',
    description:
      'Your beard and jawline are the frame of your face.\n\nIf one side of your beard grows thicker, starts higher, or is trimmed differently, it can make your entire face look uneven even if your bone structure is perfectly symmetrical underneath.\n\nA well balanced beard helps define the lower third of your face and makes the jawline appear sharper and more even. Uneven trimming or patchy growth can make one side seem heavier or the jaw look slanted.',
    actionItems: [
      {
        emoji: '✂️',
        text: 'Trim evenly: Always check both sides in the mirror before finishing one side.',
      },
      {
        emoji: '📏',
        text: "Keep cheek and neck lines level: The highest point of your beard should match on both sides, and the neck line should stay just above the Adam's apple.",
      },
      {
        emoji: '🧴',
        text: 'Brush daily: It spreads natural oils and helps your beard grow in the same direction.',
      },
      {
        emoji: '💧',
        text: 'Moisturize and condition: Healthy, soft beard hair sits more evenly and fills patches naturally.',
      },
    ],
    products: [
      {
        name: 'Beard trimmer with adjustable guard',
        description: 'Helps you keep both sides even',
      },
      {
        name: 'Transparent shaving gel',
        description: 'Lets you see the shape clearly while shaving',
      },
      {
        name: 'Beard oil or balm',
        description: 'Softens hair, fills patches, and keeps growth even',
      },
      {
        name: 'Beard brush or comb',
        description: 'Trains the hair to grow symmetrically',
      },
    ],
    commonMistakes: [
      'Trimming one side too short before checking the other',
      'Ignoring patchy areas that make the beard look uneven',
      'Shaving the neckline too high or unevenly',
    ],
  },
  {
    id: 'eye-alignment',
    title: 'Eye Alignment & Eye Bags',
    icon: '👁',
    description:
      'The area around your eyes strongly affects how symmetrical your face looks.\n\nEven small differences like one eye sitting slightly higher or one side being puffier can make your whole face look uneven or tired.\n\nMost of this comes from fluid retention, lack of sleep, or muscle tension, not bone structure. Swelling under one eye or drooping from poor sleep habits often makes one side appear lower or heavier.',
    actionItems: [
      {
        emoji: '😴',
        text: 'Sleep on your back: Avoid pressing one side of your face into the pillow.',
      },
      {
        emoji: '🧊',
        text: 'Use cold therapy in the morning: A chilled spoon, roller, or ice globe can reduce puffiness fast.',
      },
      {
        emoji: '💆',
        text: 'Massage gently: Use your ring finger to move fluid from the inner corner outward.',
      },
      {
        emoji: '💧',
        text: 'Stay hydrated: Dehydration makes your eyes retain more water, especially after salty food.',
      },
      {
        emoji: '📱',
        text: 'Take screen breaks: Looking down or squinting too long can affect muscle balance around the eyes.',
      },
    ],
    products: [
      {
        name: 'Caffeine eye serum or cream',
        description: 'Tightens and brightens under eye skin',
      },
      {
        name: 'Cold roller or ice globes',
        description: 'Reduce swelling and cool the skin',
      },
      {
        name: 'Hydrating eye patches',
        description: 'Perfect in the morning to reduce puffiness',
      },
      {
        name: 'Mineral tinted sunscreen',
        description: 'Covers redness and protects delicate skin from UV damage',
      },
    ],
    commonMistakes: [
      'Rubbing your eyes too hard or too often',
      'Sleeping on the same side every night',
      'Ignoring hydration and sodium balance',
    ],
  },
  {
    id: 'diet-symmetry',
    title: 'Diet & Symmetry',
    icon: '🥦',
    description:
      'What you eat plays a big role in how symmetrical your face looks.\n\nA clean, balanced diet helps reduce puffiness, bloating, and uneven swelling that make one side look fuller or softer.\n\nWhen you eat too much salt, sugar, or processed food, your body holds onto water, which can make your jawline, cheeks, and eyes look uneven.\n\nA diet rich in whole, nutrient dense foods keeps inflammation low, skin tighter, and muscles balanced. It does not change your bone structure, but it changes how defined and proportionate your face appears.',
    actionItems: [
      {
        emoji: '🥗',
        text: 'Eat whole foods: Choose vegetables, fruits, lean protein, and healthy fats.',
      },
      {
        emoji: '🍗',
        text: 'Keep protein high: Eat roughly twice your bodyweight in kilograms (in grams of protein) each day to support muscle tone and facial definition.',
      },
      {
        emoji: '💧',
        text: 'Stay hydrated: Water flushes out excess sodium and helps the face stay lean and even.',
      },
      {
        emoji: '🚫',
        text: 'Avoid salty and processed foods: They cause water retention and puffiness.',
      },
      {
        emoji: '🍌',
        text: 'Add potassium rich foods: Bananas, kiwis, spinach, and avocado help reduce bloating.',
      },
      {
        emoji: '🍷',
        text: 'Limit alcohol and sugar: Both can make your face look rounder and tired.',
      },
    ],
    products: [
      {
        name: 'Green tea or herbal detox tea',
        description: 'Helps reduce bloating and inflammation',
      },
      {
        name: 'Electrolyte mix or coconut water',
        description: 'Restores balance when hydrating',
      },
      {
        name: 'Zinc or omega-3 supplements',
        description: 'Support clear skin and reduced puffiness',
      },
    ],
    commonMistakes: [
      'Skipping water all day and drinking it only at night',
      'Eating too salty before bed',
      'Believing that diet has no impact on facial balance',
    ],
  },
  {
    id: 'nose-centering',
    title: 'Nose Centering',
    icon: '👃',
    description:
      'Your nose is the center of your face, and even a small tilt or curve can make your whole face appear off balance.\n\nThis can be natural, but it can also come from uneven muscle tension, posture, or sleeping habits that affect the tissues around the nose.\n\nMost people have a slightly off center nose, which is completely normal. Still, you can make it appear more centered by improving your breathing, posture, and muscle balance around the face.',
    actionItems: [
      {
        emoji: '😴',
        text: 'Sleep on your back: Keeps pressure off one side of your nose.',
      },
      {
        emoji: '🫁',
        text: 'Practice nasal breathing: Try to breathe evenly through both nostrils during the day.',
      },
      {
        emoji: '🧲',
        text: 'Use a nose magnet or nasal trainer: It helps open both sides of the nose and encourages even airflow.',
      },
      {
        emoji: '💆',
        text: 'Massage the nose bridge: Use gentle upward strokes with your fingers for 30 seconds daily to relax tight muscles.',
      },
      {
        emoji: '🧘',
        text: 'Fix your posture: Keep your head straight and avoid tilting slightly to one side when looking at screens or mirrors.',
      },
    ],
    products: [
      {
        name: 'Nose magnet or nasal breathing trainer',
        description: 'Improves airflow and helps keep both sides open',
      },
      {
        name: 'Saline nasal spray',
        description: 'Clears blockages and prevents uneven breathing habits',
      },
      {
        name: 'Cold compress or ice roller',
        description: 'Reduces swelling after sleeping on one side',
      },
      {
        name: 'Light facial oil or serum',
        description:
          'Can be used for gentle nose massages to relax surrounding muscles',
      },
    ],
    commonMistakes: [
      'Always sleeping on the same side',
      'Breathing mainly through one nostril',
      'Tilting your head in photos or mirrors without noticing',
    ],
  },
  {
    id: 'jaw-muscle-balance',
    title: 'Jaw Muscle Balance',
    icon: '💪',
    description:
      "Your masseter muscles is the large muscles on each side of your jaw.\n\nIf you chew mostly on one side, clench unevenly, or have an unbalanced bite, one side of your masseter can grow stronger and larger than the other.\n\nThis creates visible asymmetry around your jawline and cheeks over time. Training both sides evenly helps balance your face and make your lower third appear sharper and more aligned.\n\nIt's not about overtraining but about building control and awareness of both sides equally.",
    actionItems: [
      {
        emoji: '🍽',
        text: 'Chew evenly: Pay attention to which side you use more and switch sides while eating.',
      },
      {
        emoji: '😌',
        text: 'Relax your jaw: Avoid constant clenching or grinding your teeth.',
      },
      {
        emoji: '💪',
        text: 'Train the weaker side: Light jaw exercises or chewing tools can help balance muscle tone.',
      },
      {
        emoji: '💆',
        text: 'Massage daily: Use gentle circular motions to release tension on both sides.',
      },
      {
        emoji: '🧘',
        text: 'Keep good posture: A forward head position can strain one side of your jaw more.',
      },
    ],
    products: [
      {
        name: 'Jaw trainer or chewing device',
        description: 'Build even strength on both sides',
      },
      {
        name: 'Massage gun or facial massager',
        description: 'Release tightness and improve blood flow',
      },
      {
        name: 'Gua Sha or facial roller',
        description: 'Smooth tension and improve muscle balance',
      },
      {
        name: 'Warm compress',
        description: 'Use before massage to relax the jaw muscles',
      },
    ],
    commonMistakes: [
      'Overtraining one side with jaw trainers',
      'Chewing gum all day on one side',
      'Ignoring jaw tension or uneven clenching',
    ],
  },
  {
    id: 'makeup-balance',
    title: 'Makeup Balance',
    icon: '💄',
    description:
      'Makeup can instantly make your face appear more balanced when applied with small adjustments.\n\nEven if your facial structure is slightly uneven, the right placement of contour, blush, and highlight can make your features look symmetrical and well defined.\n\nThe goal is not to cover your face but to guide attention evenly, so both sides match naturally in light, shadow, and color.',
    actionItems: [
      {
        emoji: '🎨',
        text: 'Contour evenly: Apply slightly more contour on the fuller side of your face to balance width.',
      },
      {
        emoji: '✨',
        text: 'Highlight the center: Use highlight down the middle of your nose and forehead to draw attention to symmetry.',
      },
      {
        emoji: '💗',
        text: 'Balance your blush: Place blush a little higher on the lower cheek to even out height differences.',
      },
      {
        emoji: '💋',
        text: 'Shape lips evenly: Overline only where needed to match both sides of your mouth.',
      },
      {
        emoji: '👁',
        text: 'Match your brows and eyeliner: Make sure they rise and end at the same angle on both sides.',
      },
    ],
    products: [
      {
        name: 'Cream contour stick',
        description: 'For smooth blending and natural symmetry',
      },
      {
        name: 'Highlighter pen or liquid',
        description: 'To brighten the center of the face',
      },
      {
        name: 'Angled blush brush',
        description: 'For more controlled, even application',
      },
      {
        name: 'Makeup mirror with even lighting',
        description: 'To avoid shadows that distort symmetry',
      },
    ],
    commonMistakes: [
      'Applying contour unevenly on both sides',
      'Using lighting from only one direction when doing makeup',
      'Over highlighting one cheekbone',
    ],
  },
];
