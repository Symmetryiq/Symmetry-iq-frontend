import { TIPS } from '@/constants/tips';
import { Tip } from '@/types/tips.types';

export const getTipById = (id: string): Tip | undefined => {
  return TIPS.find((tip) => tip.id === id);
};

export const getAllTipIds = (): string[] => {
  return TIPS.map((tip) => tip.id);
};
