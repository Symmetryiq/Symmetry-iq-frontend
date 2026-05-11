import { PREMIUM_ENTITLEMENT_ID } from "@/constants/purchases";
import Purchases, {
  CustomerInfo,
  LOG_LEVEL,
  PurchasesOffering,
  PurchasesPackage,
} from "react-native-purchases";

let configured = false;

/**
 * Returns the SDK key for the active platform, or null if it's missing.
 * Uses direct `process.env.EXPO_PUBLIC_*` access so Expo/Metro inlines the
 * value at build time. Dynamic access via a wrapper (`process.env[key]`) is
 * not reliably inlined.
 */
function getApiKey(): string | null {
  const key = process.env.EXPO_PUBLIC_REVENUECAT_TEST_STORE_API_KEY;
  return key && key.length > 0 ? key : null;
}

/**
 * Initializes the RevenueCat SDK exactly once. Subsequent calls are no-ops.
 * Returns true if the SDK is now configured.
 */
export function configurePurchases(appUserId?: string | null): boolean {
  if (configured) return true;

  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn(
      "[Purchases] No RevenueCat API key configured for this platform — skipping configure().",
    );
    return false;
  }

  if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.DEBUG);

  Purchases.configure({
    apiKey,
    appUserID: appUserId ?? null,
  });

  configured = true;
  return true;
}

export function isConfigured(): boolean {
  return configured;
}

/**
 * Aligns the RevenueCat appUserID with the signed-in app user. Safe to call
 * repeatedly — RevenueCat is a no-op if the same id is already active.
 */
export async function identifyUser(appUserId: string): Promise<CustomerInfo> {
  const { customerInfo } = await Purchases.logIn(appUserId);
  return customerInfo;
}

/**
 * Resets the SDK to an anonymous user. Call on sign-out.
 */
export async function logoutUser(): Promise<void> {
  if (!configured) return;
  try {
    await Purchases.logOut();
  } catch {
    // logOut throws if already anonymous — ignore.
  }
}

export async function getCurrentOffering(): Promise<PurchasesOffering | null> {
  const offerings = await Purchases.getOfferings();
  return offerings.current ?? null;
}

export async function purchasePackage(
  pkg: PurchasesPackage,
): Promise<CustomerInfo> {
  const result = await Purchases.purchasePackage(pkg);
  return result.customerInfo;
}

export async function restorePurchases(): Promise<CustomerInfo> {
  return Purchases.restorePurchases();
}

export async function getCustomerInfo(): Promise<CustomerInfo> {
  return Purchases.getCustomerInfo();
}

export function isPremium(info: CustomerInfo | null): boolean {
  if (!info) return false;
  return Boolean(info.entitlements.active[PREMIUM_ENTITLEMENT_ID]);
}

/**
 * RevenueCat surfaces the same exception class for both real failures and
 * user-cancelled flows. This narrows that down for callers.
 */
export function isUserCancelledError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const e = error as { userCancelled?: boolean; code?: string };
  return e.userCancelled === true || e.code === "PURCHASE_CANCELLED";
}
