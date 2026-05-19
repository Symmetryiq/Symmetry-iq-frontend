import { PREMIUM_ENTITLEMENT_ID } from '@/constants/purchases';
import { CustomerInfo } from 'react-native-purchases';

export function isPremium(info: CustomerInfo | null): boolean {
  if (!info) return false;
  return Boolean(info.entitlements.active[PREMIUM_ENTITLEMENT_ID]);
}

/**
 * RevenueCat throws the same exception class for real failures and user
 * cancellations. This narrows that down so callers can swallow cancels.
 */
export function isUserCancelledError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false;
  const e = error as { userCancelled?: boolean; code?: string };
  return e.userCancelled === true || e.code === 'PURCHASE_CANCELLED';
}
