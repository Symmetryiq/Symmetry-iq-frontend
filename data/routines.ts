import { ImageSourcePropType } from 'react-native';

export type RoutineId =
  | 'hard-mewing-hold'
  | 'masseter-balance-training'
  | 'neck-curls-extensions'
  | 'chin-tucks'
  | 'wall-posture-reset'
  | 'scm-neck-stretch'
  | 'mandibular-fascia-release'
  | 'gua-sha-jawline'
  | 'cheekbone-lift-massage'
  | 'smile-symmetry-routine'
  | 'orb-oculi-training'
  | 'wall-posture-training'
  | 'neck-stretch'
  | 'nose-centering-routine';

export interface Routine {
  id: RoutineId;
  title: string;
  description: string;
  image: ImageSourcePropType;
  duration: string;
  products: string[];
  instructions: string[];
}

export const RoutineImages: Record<RoutineId, ImageSourcePropType> = {
  'hard-mewing-hold': require('../assets/images/routines/hard-mewing-hold.jpg'),
  'masseter-balance-training': require('../assets/images/routines/masseter-balance-training.jpg'),
  'neck-curls-extensions': require('../assets/images/routines/neck-curls-and-extensions.jpg'),
  'chin-tucks': require('../assets/images/routines/chin-tucks.jpg'),
  'wall-posture-reset': require('../assets/images/routines/wall-posture-reset.jpg'),
  'scm-neck-stretch': require('../assets/images/routines/scm-neck-stretch.jpg'),
  'mandibular-fascia-release': require('../assets/images/routines/mandibular-fascia-release.jpg'),
  'gua-sha-jawline': require('../assets/images/routines/gua-sha-jawline.jpg'),
  'cheekbone-lift-massage': require('../assets/images/routines/cheekbone-lift-massage.jpg'),
  'smile-symmetry-routine': require('../assets/images/routines/smile-symmetry-routine.jpg'),
  'orb-oculi-training': require('../assets/images/routines/orb-oculi-training.jpg'),
  'wall-posture-training': require('../assets/images/routines/wall-posture-training.jpg'),
  'neck-stretch': require('../assets/images/routines/neck-stretch.jpg'),
  'nose-centering-routine': require('../assets/images/routines/nose-centering-routine.jpg'),
};

export const Routines: Routine[] = [
  {
    id: 'hard-mewing-hold',
    title: '👅 Hard Mewing Hold',
    description:
      'Lifts your midface and improves facial symmetry by training firm and correct tongue posture',
    image: require('@/assets/images/routines/hard-mewing-hold.jpg'),
    duration: '3–5 minutes',
    products: [],
    instructions: [
      'Close your mouth and keep your lips sealed',
      'Say the word “sing” when you reach the “ng” sound, notice how the back of your tongue naturally presses against the roof of your mouth',
      'Keep your tongue in that exact position',
      'From there, press firmly with your whole tongue, including the back part near your throat',
      'Keep your teeth lightly touching without clenching',
      'Breathe only through your nose',
      'Hold the strong pressure for 2–3 minutes, then rest',
      'Keep your head level and neck straight',
      'Repeat 2–3 times per day to strengthen tongue posture and lift your midface',
    ],
  },

  {
    id: 'masseter-balance-training',
    title: '🦴 Masseter Balance Training',
    description:
      'Strengthens your jaw evenly on both sides by using light hand resistance to build balance and muscle control',
    image: require('@/assets/images/routines/masseter-balance-training.jpg'),
    duration: '4–6 minutes',
    products: [],
    instructions: [
      'Sit or stand straight with your lips closed and shoulders relaxed',
      'Place one hand under your chin',
      'Slowly open your mouth while your hand gives light resistance',
      'Close your mouth slowly back to the starting position',
      'Repeat this 10 times',
      'Move your hand to the right side of your jaw',
      'Push your jaw slightly toward your hand, then return to center',
      'Do 10 reps, then switch to the left side and repeat',
      'Keep all movements slow and controlled — avoid sudden pressure',
      'Finish by gently opening and closing your mouth to relax the muscles',
    ],
  },

  {
    id: 'neck-curls-extensions',
    title: '💪 Neck Curls & Extensions',
    description:
      'Strengthens the front and back of your neck to improve posture, jawline definition, and overall facial symmetry',
    image: require('@/assets/images/routines/neck-curls-and-extensions.jpg'),
    duration: '5–7 minutes',
    products: ['Dumbbell or weight plate'],
    instructions: [
      'Lie on your back with your head hanging slightly off a bed or bench',
      'Hold a light dumbbell or plate on your forehead (use a towel for comfort)',
      'Slowly lift your chin toward your chest, then lower back down',
      'Perform 20–30 reps with controlled motion',
      'Turn over and lie face down with the weight resting on the back of your head',
      'Lift your head upward, hold 2 seconds, then lower slowly',
      'Repeat for 20–30 reps again',
      'Move slowly and keep your neck muscles engaged throughout',
      'If you can do more than 30 reps easily, increase the weight slightly next time',
      'Over time, use progressive overload, add small amounts of weight or reps each week for steady improvement',
    ],
  },

  {
    id: 'chin-tucks',
    title: '🧍‍♂️ Chin Tucks',
    description:
      'Fixes forward head posture and strengthens your neck for a more balanced, symmetrical profile.',
    image: require('@/assets/images/routines/chin-tucks.jpg'),
    duration: '6–8 minutes',
    products: ['Mirror (optional)'],
    instructions: [
      'Sit or stand tall with your shoulders relaxed',
      'Place your hand on your forehead',
      'Try to push your head forward, but use your hand to stop it, feel your neck working',
      'Hold that tension for 8–10 seconds, then relax',
      'Repeat this 8–10 times',
      'Move your hand to the back of your head',
      'Try to push backward while your hand resists, keep it slow and controlled',
      'Do 8–10 reps again',
      'Finish by doing 10 light chin tucks without your hand, keeping your neck straight',
      'End by holding tall, perfect posture for 1 minute',
    ],
  },

  {
    id: 'wall-posture-reset',
    title: '🧱 Wall Posture Reset',
    description:
      'Aligns your head and shoulders so your face looks straighter and more symmetrical.',
    image: require('@/assets/images/routines/wall-posture-reset.jpg'),
    duration: '3–5 minutes',
    products: ['Wall'],
    instructions: [
      'Stand with your back, shoulders, and head touching the wall',
      'Keep your heels 2–3 cm away',
      'Slightly tuck your chin',
      'Pull shoulder blades gently together',
      'Hold for 1 minute, rest 20 seconds, then repeat',
      'Keep your head against the wall the whole time',
      'Avoid arching your lower back',
    ],
  },

  {
    id: 'scm-neck-stretch',
    title: '🧖‍♂️ SCM Neck Stretch',
    description:
      'Releases tight neck muscles that can pull your jawline unevenly and tilt your face',
    image: require('@/assets/images/routines/scm-neck-stretch.jpg'),
    duration: '3–5 minutes',
    products: [],
    instructions: [
      'Sit or stand tall with your shoulders relaxed',
      'Slowly tilt your head to one side until you feel a stretch on the opposite side of your neck',
      'Gently turn your chin upward and away from that shoulder',
      'Place one hand on your chest to stop your body from moving',
      'Hold the stretch for 25–30 seconds and breathe slowly',
      'Switch sides and repeat the same motion',
      'Roll your shoulders a few times to release tension',
      'Do this 2–3 times a day to keep your neck balanced and straight',
    ],
  },

  {
    id: 'mandibular-fascia-release',
    title: '💆‍♂️ Mandibular Fascia Release',
    description:
      'Loosens jaw tightness that can make one side of your face look lower or uneven',
    image: require('@/assets/images/routines/mandibular-fascia-release.jpg'),
    duration: '3–4 minutes',
    products: ['Facial oil or moisturizer (optional)'],
    instructions: [
      'Apply a small amount of oil along your jawline',
      'Relax your jaw and keep your mouth slightly open',
      'Place two fingers on the firm muscles under your cheekbones',
      'Gently massage in small circles for about 1–2 minutes per side',
      'Spend a little more time on the tighter side',
      'Slowly move your fingers down toward your chin as you go',
      'Finish by gliding from your chin down to your neck to release tension',
    ],
  },

  {
    id: 'gua-sha-jawline',
    title: '💎 Gua Sha Jawline',
    description:
      'Reduces puffiness and defines both sides of your face for a sharper, more symmetrical look.',
    image: require('@/assets/images/routines/gua-sha-jawline.jpg'),
    duration: '4–6 minutes',
    products: ['Gua Sha stone', 'Facial oil or serum'],
    instructions: [
      'Apply a few drops of oil to your face and neck',
      'Hold the Gua Sha at a 15° angle',
      'Start at your chin and glide upward toward your ear',
      'Move to your cheeks and sweep from nose to temples',
      'Use light pressure under the eyes, stronger along the jawline',
      'Repeat 5–10 times per side',
      'Glide down the neck to drain fluid',
      'Clean your Gua Sha after each use',
      'Use morning or evening for best effect',
    ],
  },

  {
    id: 'cheekbone-lift-massage',
    title: '💆 Cheekbone Lift Massage',
    description:
      'Lifts your cheeks and improves blood flow for better symmetry and definition',
    image: require('@/assets/images/routines/cheekbone-lift-massage.jpg'),
    duration: '3–4 minutes',
    products: ['Facial oil or moisturizer (optional)'],
    instructions: [
      'Apply a small amount of oil to your face',
      'Place your fingers right under your cheekbones',
      'Gently lift your skin upward in small circles',
      'Hold each lift for 2 seconds, then release',
      'Repeat 15–20 times on each side',
      'Move higher toward your temples as you go',
      'Finish with long upward strokes on both cheeks',
      'Do this once a day to keep your cheeks lifted and even',
    ],
  },

  {
    id: 'smile-symmetry-routine',
    title: '😄 Smile Symmetry Routine',
    description:
      'Trains both sides of your mouth to move evenly for a more balanced and natural smile',
    image: require('@/assets/images/routines/smile-symmetry-routine.jpg'),
    duration: '3–4 minutes',
    products: ['Mirror'],
    instructions: [
      'Stand in front of a mirror with your shoulders relaxed',
      'Slowly smile and see which side lifts higher',
      'Focus on lifting both corners at the same time',
      'Hold your smile for 3 seconds, then relax',
      'Repeat this 15–20 times',
      'Use your fingertip to help the weaker side lift evenly',
      'Finish with 5 slow full smiles while keeping your eyes relaxed',
    ],
  },

  {
    id: 'orb-oculi-training',
    title: '👁 Orb Oculi Training',
    description:
      'Strengthens the muscles around your eyes so both open and close evenly for better facial balance',
    image: require('@/assets/images/routines/orb-oculi-training.jpg'),
    duration: '3–5 minutes',
    products: ['Mirror (optional)'],
    instructions: [
      'Look into a mirror with your face relaxed',
      'Place your index fingers at the outer corners of your eyes',
      'Gently lift upward to add light resistance',
      'Squint for 2 seconds, then relax for 2 seconds',
      'Repeat 15–20 times',
      'Keep your forehead and eyebrows still',
      'Do a few extra reps for the weaker eye if needed',
      'Finish with 3–5 slow blinks to relax the muscles',
    ],
  },

  {
    id: 'wall-posture-training',
    title: '🧍‍♀️ Wall Posture Training',
    description:
      'Improves your posture and head alignment so your neck stays straight and your face looks more symmetrical',
    image: require('@/assets/images/routines/wall-posture-training.jpg'),
    duration: '4–6 minutes',
    products: ['Wall'],
    instructions: [
      'Stand with your heels about 5 cm away from the wall',
      'Press your back, shoulders, and head gently against it',
      'Keep your chin slightly tucked and your neck straight',
      'Pull your shoulder blades together lightly',
      'Hold this position for 1 minute, then rest for 20 seconds',
      'Repeat 3 times',
      'Keep breathing slowly and evenly',
      'Walk away from the wall while keeping the same straight posture',
    ],
  },

  {
    id: 'neck-stretch',
    title: '🧘‍♂️ Neck Stretch',
    description:
      'Releases neck tightness that can tilt your head and make your face look uneven',
    image: require('@/assets/images/routines/neck-stretch.jpg'),
    duration: '3–4 minutes',
    products: [],
    instructions: [
      'Sit or stand tall with your shoulders relaxed',
      'Tilt your head slowly to one side until you feel a light stretch',
      'Keep your neck straight and your body still',
      'Hold for 25–30 seconds while breathing slowly',
      'Return to the center and repeat on the other side',
      'Turn your head gently left and right a few times',
      'Drop your chin slightly to stretch the back of your neck',
      'Finish with a few slow shoulder rolls to release tension',
    ],
  },

  {
    id: 'nose-centering-routine',
    title: '👃 Nose Centering Routine',
    description:
      'Helps make your nose look straighter by gently pushing it toward the center',
    image: require('@/assets/images/routines/nose-centering-routine.jpg'),
    duration: '3–5 minutes',
    products: ['None'],
    instructions: [
      'Sit or stand straight and relax your face',
      'Put your thumb on the side where your nose looks a bit higher or bent',
      'Gently push that side toward the middle for 10–15 seconds',
      'Relax and repeat this 5–6 times',
      'Now place both thumbs on each side of your nose, around the middle part',
      'Slowly push down toward the tip of your nose — do not push hard',
      'Hold for 10 seconds, then relax',
      'Repeat this 5–6 times',
      'Finish by sliding your fingers down the sides of your nose to relax it',
    ],
  },
];
