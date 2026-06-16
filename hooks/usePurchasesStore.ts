import { SCREENSHOT_MODE } from '@/constants/app';
import { PREMIUM_ENTITLEMENT_ID } from '@/constants/purchases';
import { CustomerInfo } from 'react-native-purchases';
import { create } from 'zustand';

type PurchasesState = {
  customerInfo: CustomerInfo | null;
  isPremium: boolean;
  customerInfoLoaded: boolean;
  setCustomerInfo: (info: CustomerInfo | null) => void;
};

function computeIsPremium(info: CustomerInfo | null): boolean {
  // Screenshot builds unlock everything so premium-gated screens can be
  // captured. No effect in production.
  if (SCREENSHOT_MODE) return true;
  if (!info) return false;
  return Boolean(info.entitlements.active[PREMIUM_ENTITLEMENT_ID]);
}

export const usePurchasesStore = create<PurchasesState>((set) => ({
  customerInfo: null,
  isPremium: SCREENSHOT_MODE,
  customerInfoLoaded: false,
  setCustomerInfo: (info) =>
    set({
      customerInfo: info,
      isPremium: computeIsPremium(info),
      customerInfoLoaded: true,
    }),
}));

export const useIsPremium = () => usePurchasesStore((s) => s.isPremium);
