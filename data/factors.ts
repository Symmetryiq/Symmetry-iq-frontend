export type FacialFactorID =
  | 'overall-symmetry'
  | 'facial-thirds'
  | 'eye-alignment'
  | 'eyebrow-symmetry'
  | 'nose-centering'
  | 'facial-puffiness'
  | 'skin-clarity'
  | 'jawline-symmetry'
  | 'cheekbone-balance'
  | 'chin-alignment';

export type FacialKeys =
  | 'Overall Symmetry'
  | 'Facial Thirds'
  | 'Eye Alignment'
  | 'Eyebrow Symmetry'
  | 'Nose Centering'
  | 'Facial Puffiness'
  | 'Skin Clarity'
  | 'Jawline Symmetry'
  | 'Cheekbone Balance'
  | 'Chin Alignment';

export const FactorInfo: Record<FacialKeys, string> = {
  'Overall Symmetry':
    'This score measures how evenly your facial features are aligned from left to right. A higher score means your face is well balanced, while a lower one suggests minor asymmetries that can be caused by muscle tension, sleeping position, or posture. Over time, balanced habits can improve your symmetry.',
  'Facial Thirds':
    'This measures the proportion between your forehead, midface, and lower face. When all three areas are close in size, the face looks naturally more proportional and aesthetic. Changes in posture, hairstyle, or facial exercises can slightly improve this balance.',
  'Eye Alignment':
    'This checks how level your eyes are in relation to each other. Small differences are normal, but a larger gap may be linked to puffiness, tension, or uneven sleep posture. As your facial balance improves, alignment tends to become more even.',
  'Eyebrow Symmetry':
    'This shows how evenly your eyebrows sit and move on each side. Uneven brows can make one eye area appear more lifted or expressive. Grooming, tinting, or targeted brow care can help balance their height and shape.',
  'Nose Centering':
    'This measures how centered your nose is compared to your facial midline. A perfectly centered nose adds harmony, while small shifts can come from natural asymmetry or old habits like leaning on one side of your face.',
  'Facial Puffiness':
    'This reflects how lean or swollen your face currently appears. A higher score means your face is holding more water or sodium, often from diet, hormones, or lack of sleep. As your hydration and nutrition improve, this score should gradually drop.',
  'Skin Clarity':
    'This measures how smooth, even, and clear your skin looks. A higher score means balanced tone and fewer blemishes, while a lower score can indicate irritation or uneven texture. Consistent skincare, hydration, and good sleep can quickly improve this.',
  'Jawline Symmetry':
    'This checks if both sides of your jawline are equally sharp and defined. Unevenness can come from chewing habits, posture, or temporary puffiness. Over time, reducing bloating and balancing muscle use can enhance definition.',
  'Cheekbone Balance':
    'This measures if your cheekbones are equally high and pronounced. Balanced cheekbones add structure and symmetry to your face, while puffiness or uneven muscle tone can make one side appear lower.',
  'Chin Alignment':
    'This shows how centered your chin is compared to your lips and nose. A centered chin improves overall facial balance, while slight shifts can be influenced by posture, dental alignment, or facial tension.',
};
