import { isPremium as computeIsPremium } from '@/utils/purchases.util';
import { CustomerInfo, PurchasesOffering } from 'react-native-purchases';
import { create } from 'zustand';

type PurchasesState = {
  ready: boolean;
  offering: PurchasesOffering | null;
  customerInfo: CustomerInfo | null;
  isPremium: boolean;
  loadingOfferings: boolean;
  offeringsError: string | null;
};

type PurchasesActions = {
  setReady: (ready: boolean) => void;
  setOffering: (offering: PurchasesOffering | null) => void;
  setCustomerInfo: (info: CustomerInfo | null) => void;
  setLoadingOfferings: (loading: boolean) => void;
  setOfferingsError: (error: string | null) => void;
  reset: () => void;
};

// NOTE: While RevenueCat is disabled for preview testing, default isPremium to
// true so paywall-gated features unlock end-to-end. Flip back to false once
// usePurchasesBootstrap is re-enabled in app/(app)/_layout.tsx.
const INITIAL: PurchasesState = {
  ready: true,
  offering: null,
  customerInfo: null,
  isPremium: true,
  loadingOfferings: false,
  offeringsError: null,
};

export const usePurchasesStore = create<PurchasesState & PurchasesActions>(
  (set) => ({
    ...INITIAL,

    setReady: (ready) => set({ ready }),

    setOffering: (offering) => set({ offering }),

    setCustomerInfo: (info) =>
      set({ customerInfo: info, isPremium: computeIsPremium(info) }),

    setLoadingOfferings: (loading) => set({ loadingOfferings: loading }),

    setOfferingsError: (error) => set({ offeringsError: error }),

    reset: () => set(INITIAL),
  }),
);

/**
 * Convenience selector — read just the boolean without subscribing to other
 * fields.
 */
export const useIsPremium = () => usePurchasesStore((s) => s.isPremium);
