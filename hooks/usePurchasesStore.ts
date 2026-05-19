import { PREMIUM_ENTITLEMENT_ID } from '@/constants/purchases';
import { CustomerInfo } from 'react-native-purchases';
import { create } from 'zustand';

type PurchasesState = {
  customerInfo: CustomerInfo | null;
  isPremium: boolean;
  setCustomerInfo: (info: CustomerInfo | null) => void;
};

function computeIsPremium(info: CustomerInfo | null): boolean {
  if (!info) return false;
  return Boolean(info.entitlements.active[PREMIUM_ENTITLEMENT_ID]);
}

export const usePurchasesStore = create<PurchasesState>((set) => ({
  customerInfo: null,
  isPremium: false,
  setCustomerInfo: (info) =>
    set({ customerInfo: info, isPremium: computeIsPremium(info) }),
}));

export const useIsPremium = () => usePurchasesStore((s) => s.isPremium);
