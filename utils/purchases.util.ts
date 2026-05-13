import { PREMIUM_ENTITLEMENT_ID } from "@/constants/purchases";
import { Platform } from "react-native";
import Purchases, {
  CustomerInfo,
  LOG_LEVEL,
  PurchasesOffering,
  PurchasesPackage,
} from "react-native-purchases";

let configured = false;

/**
 * Returns the SDK key for the active environment + platform, or null if
 * missing. Picks the test-store key in dev builds (Metro / __DEV__) and the
 * platform-specific release key in preview/production.
 *
 * Each `process.env.EXPO_PUBLIC_*` reference is a literal property access so
 * Metro inlines all three at build time. Dynamic access (`process.env[key]`)
 * is not reliably inlined.
 */
function getApiKey(): { key: string | null; source: string } {
  if (__DEV__) {
    const key = process.env.EXPO_PUBLIC_REVENUECAT_TEST_API_KEY;
    return {
      key: key && key.length > 0 ? key : null,
      source: "test-store (dev)",
    };
  }

  if (Platform.OS === "ios") {
    const key = process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY;
    return {
      key: key && key.length > 0 ? key : null,
      source: "ios-production",
    };
  }

  if (Platform.OS === "android") {
    const key = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY;
    return {
      key: key && key.length > 0 ? key : null,
      source: "android-production",
    };
  }

  return { key: null, source: `unsupported-platform:${Platform.OS}` };
}

/**
 * Initializes the RevenueCat SDK exactly once. Subsequent calls are no-ops.
 * Returns true if the SDK is now configured.
 */
export function configurePurchases(appUserId?: string | null): boolean {
  if (configured) return true;

  const { key, source } = getApiKey();
  if (!key) {
    console.warn(
      `[Purchases] No RevenueCat API key for source=${source} — skipping configure().`,
    );
    return false;
  }

  if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.DEBUG);

  Purchases.configure({
    apiKey: key,
    appUserID: appUserId ?? null,
  });

  console.log(`[Purchases] configured with ${source} key`);
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
