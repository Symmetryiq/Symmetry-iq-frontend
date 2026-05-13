import {
  configurePurchases,
  getCurrentOffering,
  getCustomerInfo,
  identifyUser,
  isConfigured,
  logoutUser,
} from "@/utils/purchases.util";
import { useUser } from "@clerk/expo";
import { useEffect } from "react";
import { Platform } from "react-native";
import Purchases from "react-native-purchases";
import { usePurchasesStore } from "./usePurchasesStore";

function activeRevenueCatKey(): { source: string; raw: string | undefined } {
  if (__DEV__) {
    return {
      source: "test-store (dev)",
      raw: process.env.EXPO_PUBLIC_REVENUECAT_TEST_API_KEY,
    };
  }
  if (Platform.OS === "ios") {
    return {
      source: "ios-production",
      raw: process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY,
    };
  }
  if (Platform.OS === "android") {
    return {
      source: "android-production",
      raw: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY,
    };
  }
  return { source: `unsupported:${Platform.OS}`, raw: undefined };
}

/**
 * Bootstraps RevenueCat once the user lands inside the protected app:
 * 1. Configures the SDK with the active platform's API key (idempotent)
 * 2. Identifies the Clerk user so subscriptions follow them across devices
 * 3. Loads the current offering and seeds customer info into the store
 * 4. Subscribes to live customer-info updates and mirrors them in the store
 */
export function usePurchasesBootstrap() {
  const { user, isLoaded: userLoaded } = useUser();
  const setReady = usePurchasesStore((s) => s.setReady);
  const setOffering = usePurchasesStore((s) => s.setOffering);
  const setCustomerInfo = usePurchasesStore((s) => s.setCustomerInfo);
  const setLoadingOfferings = usePurchasesStore((s) => s.setLoadingOfferings);
  const setOfferingsError = usePurchasesStore((s) => s.setOfferingsError);

  useEffect(() => {
    if (!userLoaded) return;

    let cancelled = false;

    async function bootstrap() {
      const { source, raw } = activeRevenueCatKey();
      const keyPreview =
        raw && raw.length > 0
          ? `${raw.slice(0, 6)}…(${raw.length})`
          : "<empty>";
      console.log(
        `[Purchases] active key source=${source} value=${keyPreview}`,
      );

      const ok = configurePurchases(user?.id ?? null);
      if (!ok) {
        setReady(false);
        setOfferingsError(
          `RevenueCat API key missing for ${source} (got ${keyPreview}). Check EAS env vars.`,
        );
        return;
      }

      if (user?.id) {
        try {
          const info = await identifyUser(user.id);
          if (!cancelled) setCustomerInfo(info);
        } catch (e) {
          console.warn("[Purchases] identifyUser failed", e);
        }
      } else {
        try {
          await logoutUser();
          const info = await getCustomerInfo();
          if (!cancelled) setCustomerInfo(info);
        } catch (e) {
          console.warn("[Purchases] anonymous customer info failed", e);
        }
      }

      setLoadingOfferings(true);
      try {
        const offering = await getCurrentOffering();
        console.log("[Purchases] offering loaded", {
          identifier: offering?.identifier,
          packageCount: offering?.availablePackages?.length ?? 0,
          hasWeekly: !!offering?.weekly,
          hasMonthly: !!offering?.monthly,
          hasAnnual: !!offering?.annual,
        });
        if (!cancelled) {
          setOffering(offering);
          if (!offering) {
            setOfferingsError(
              'No current offering returned. Check that an offering is marked "Current" in the RevenueCat dashboard and includes Test Store products.',
            );
          } else if ((offering.availablePackages?.length ?? 0) === 0) {
            setOfferingsError(
              `Offering "${offering.identifier}" has no packages. Add Test Store packages to it in RevenueCat.`,
            );
          } else {
            setOfferingsError(null);
          }
        }
      } catch (e) {
        console.warn("[Purchases] getCurrentOffering failed", e);
        if (!cancelled) {
          setOffering(null);
          const msg =
            e instanceof Error
              ? e.message
              : "Could not load subscription plans.";
          setOfferingsError(`Failed to load offerings: ${msg}`);
        }
      } finally {
        if (!cancelled) setLoadingOfferings(false);
      }

      if (!cancelled) setReady(true);
    }

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, [
    user?.id,
    userLoaded,
    setReady,
    setOffering,
    setCustomerInfo,
    setLoadingOfferings,
    setOfferingsError,
  ]);

  useEffect(() => {
    if (!isConfigured()) return;

    const listener = (info: import("react-native-purchases").CustomerInfo) => {
      setCustomerInfo(info);
    };

    Purchases.addCustomerInfoUpdateListener(listener);
    return () => {
      Purchases.removeCustomerInfoUpdateListener(listener);
    };
  }, [setCustomerInfo]);
}
