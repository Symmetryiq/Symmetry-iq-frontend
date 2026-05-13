import Button from '@/components/Button';
import ScreenView from '@/components/ScreenView';
import ThemedText from '@/components/ThemedText';
import { PRIVACY_POLICY_URL, TERMS_OF_SERVICE_URL } from '@/constants/app';
import { COLOR, FONT, RADIUS, SHADOW, SPACE } from '@/constants/theme';
import { useOnboardingStore } from '@/hooks/useOnboardingStore';
import { usePurchasesStore } from '@/hooks/usePurchasesStore';
import { openURL } from '@/utils/router.util';
import {
  isPremium as computeIsPremium,
  isUserCancelledError,
  purchasePackage,
  restorePurchases,
} from '@/utils/purchases.util';
import {
  CheckCircleIcon,
  CrownIcon,
  SparkleIcon,
} from 'phosphor-react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { PurchasesPackage } from 'react-native-purchases';

type PlanTier = 'weekly' | 'monthly' | 'yearly';

type PlanOption = {
  id: PlanTier;
  label: string;
  price: string;
  period: string;
  badge?: string;
  savings?: string;
  trialLabel?: string;
  package: PurchasesPackage;
};

const PERIOD_LABEL: Record<PlanTier, string> = {
  weekly: '/week',
  monthly: '/month',
  yearly: '/year',
};

const TIER_LABEL: Record<PlanTier, string> = {
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
};

// Flip to true to let QA skip the paywall (treats it as a successful purchase).
const BYPASS_PAYWALL = true;

const FEATURES = [
  'Full facial feature score breakdown unlocked',
  'Personalized 4-week routine plans',
  'Daily guided exercises & routines',
  'Progress tracking with scan history',
  'Daily task checklist & reminders',
  'Tips & insights to maximize results',
];

/* ─── Helpers ──────────────────────────────────────────────── */

function getTrialLabel(pkg: PurchasesPackage): string | undefined {
  const trialPeriod = pkg.product.introPrice?.periodNumberOfUnits;
  const trialUnit = pkg.product.introPrice?.periodUnit;
  if (!trialPeriod || !trialUnit) return undefined;
  const unit = trialPeriod === 1 ? trialUnit.toLowerCase() : `${trialUnit.toLowerCase()}s`;
  return `${trialPeriod}-${unit} free trial`;
}

function buildPlanOptions(
  offering: ReturnType<typeof usePurchasesStore.getState>['offering'],
): PlanOption[] {
  if (!offering) return [];

  const plans: PlanOption[] = [];

  const tiers: { tier: PlanTier; pkg: PurchasesPackage | null }[] = [
    { tier: 'weekly', pkg: offering.weekly ?? null },
    { tier: 'monthly', pkg: offering.monthly ?? null },
    { tier: 'yearly', pkg: offering.annual ?? null },
  ];

  for (const { tier, pkg } of tiers) {
    if (!pkg) continue;
    plans.push({
      id: tier,
      label: TIER_LABEL[tier],
      price: pkg.product.priceString,
      period: PERIOD_LABEL[tier],
      badge:
        tier === 'monthly'
          ? 'Most Popular'
          : tier === 'yearly'
            ? 'Best Value'
            : undefined,
      savings: tier === 'yearly' ? 'Best long-term value' : undefined,
      trialLabel: getTrialLabel(pkg),
      package: pkg,
    });
  }

  return plans;
}

/* ─── Sub-components ───────────────────────────────────────── */

function PlanCard({
  plan,
  selected,
  onSelect,
}: {
  plan: PlanOption;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <Pressable
      style={[styles.planCard, selected && styles.planCardSelected]}
      onPress={onSelect}
    >
      {plan.badge && (
        <View
          style={[
            styles.planBadge,
            plan.id === 'yearly' && styles.planBadgeBestValue,
          ]}
        >
          <ThemedText variant="badge" color="onPrimary">
            {plan.badge}
          </ThemedText>
        </View>
      )}

      <View style={styles.planHeader}>
        <View style={styles.planRadio}>
          {selected && <View style={styles.planRadioInner} />}
        </View>

        <View style={styles.planInfo}>
          <ThemedText variant="h4">{plan.label}</ThemedText>
          {plan.trialLabel && (
            <ThemedText variant="badge" color="primaryLight">
              {plan.trialLabel}
            </ThemedText>
          )}
        </View>

        <View style={styles.planPricing}>
          <ThemedText variant="h3" color="onBackground">
            {plan.price}
          </ThemedText>
          <ThemedText variant="caption" color="onMuted">
            {plan.period}
          </ThemedText>
        </View>
      </View>

      {plan.savings && (
        <View style={styles.savingsBadge}>
          <ThemedText
            variant="badge"
            style={{ color: COLOR.green, fontFamily: FONT.semiBold }}
          >
            {plan.savings}
          </ThemedText>
        </View>
      )}
    </Pressable>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <View style={styles.featureItem}>
      <CheckCircleIcon color={COLOR.green} size={20} weight="fill" />
      <ThemedText variant="body" style={styles.featureText}>
        {text}
      </ThemedText>
    </View>
  );
}

/* ─── Main ─────────────────────────────────────────────────── */

const PurchaseScreen = () => {
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);
  const offering = usePurchasesStore((s) => s.offering);
  const loadingOfferings = usePurchasesStore((s) => s.loadingOfferings);
  const offeringsError = usePurchasesStore((s) => s.offeringsError);
  const setCustomerInfo = usePurchasesStore((s) => s.setCustomerInfo);

  const [selectedPlan, setSelectedPlan] = useState<PlanTier>('yearly');
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const plans = useMemo(() => buildPlanOptions(offering), [offering]);

  useEffect(() => {
    if (plans.length === 0) return;
    if (!plans.some((p) => p.id === selectedPlan)) {
      setSelectedPlan(plans[plans.length - 1].id);
    }
  }, [plans, selectedPlan]);

  const selected = plans.find((p) => p.id === selectedPlan) ?? plans[0];

  const handleSubscribe = useCallback(async () => {
    if (BYPASS_PAYWALL) {
      completeOnboarding();
      return;
    }
    if (!selected) return;
    setPurchasing(true);
    try {
      const info = await purchasePackage(selected.package);
      setCustomerInfo(info);

      if (computeIsPremium(info)) {
        completeOnboarding();
      } else {
        Alert.alert(
          'Purchase incomplete',
          'The purchase finished but the premium entitlement is not active yet. Try Restore Purchases or contact support.',
          [{ text: 'OK' }],
          { userInterfaceStyle: 'dark' },
        );
      }
    } catch (error) {
      if (isUserCancelledError(error)) return;
      Alert.alert(
        'Purchase Failed',
        'Something went wrong. Please try again.',
        [{ text: 'OK' }],
        { userInterfaceStyle: 'dark' },
      );
    } finally {
      setPurchasing(false);
    }
  }, [selected, completeOnboarding, setCustomerInfo]);

  const handleRestore = useCallback(async () => {
    if (BYPASS_PAYWALL) {
      completeOnboarding();
      return;
    }
    setRestoring(true);
    try {
      const info = await restorePurchases();
      setCustomerInfo(info);
      if (computeIsPremium(info)) {
        completeOnboarding();
      } else {
        Alert.alert(
          'Restore Purchases',
          'No active subscription found on this account. Please subscribe to continue.',
          [{ text: 'OK' }],
          { userInterfaceStyle: 'dark' },
        );
      }
    } catch {
      Alert.alert(
        'Restore Failed',
        'Could not restore purchases. Please try again.',
        [{ text: 'OK' }],
        { userInterfaceStyle: 'dark' },
      );
    } finally {
      setRestoring(false);
    }
  }, [completeOnboarding, setCustomerInfo]);

  const showLoader = loadingOfferings && plans.length === 0;
  const ctaTitle = BYPASS_PAYWALL
    ? 'Continue'
    : selected?.trialLabel
      ? 'Start Free Trial'
      : selected
        ? `Subscribe ${selected.price}${selected.period}`
        : 'Subscribe';

  return (
    <ScreenView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero ── */}
        <View style={styles.hero}>
          <View style={styles.heroIconCircle}>
            <CrownIcon color={COLOR.primaryLight} size={36} weight="fill" />
          </View>

          <ThemedText variant="h1" style={styles.heroTitle}>
            Unlock Your{'\n'}Full Potential
          </ThemedText>

          <ThemedText
            variant="body"
            color="onSecondary"
            style={styles.heroSubtitle}
          >
            Get unlimited access to all features and start your transformation
            today.
          </ThemedText>
        </View>

        {/* ── Features ── */}
        <View style={styles.featuresCard}>
          {FEATURES.map((feature, i) => (
            <FeatureItem key={i} text={feature} />
          ))}
        </View>

        {/* ── Plans ── */}
        {!BYPASS_PAYWALL && (
          <View style={styles.plansSection}>
            <ThemedText variant="h3" style={styles.plansTitle}>
              Choose Your Plan
            </ThemedText>

            {showLoader && (
              <View style={styles.plansFallback}>
                <ActivityIndicator color={COLOR.primaryLight} />
                <ThemedText variant="bodySmall" color="onSecondary">
                  Loading subscription plans…
                </ThemedText>
              </View>
            )}

            {!showLoader && plans.length === 0 && (
              <View style={styles.plansFallback}>
                <ThemedText
                  variant="bodySmall"
                  color="onSecondary"
                  style={styles.plansFallbackText}
                >
                  {offeringsError ??
                    'Subscription plans are temporarily unavailable. Please try again in a moment.'}
                </ThemedText>
              </View>
            )}

            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                selected={selectedPlan === plan.id}
                onSelect={() => setSelectedPlan(plan.id)}
              />
            ))}
          </View>
        )}

        {/* ── CTA ── */}
        <View style={styles.ctaSection}>
          <Button
            title={ctaTitle}
            variant="primary"
            size="lg"
            icon={SparkleIcon}
            iconPosition="right"
            onPress={handleSubscribe}
            loading={purchasing}
            disabled={BYPASS_PAYWALL ? false : !selected}
          />

          <Pressable
            onPress={handleRestore}
            hitSlop={8}
            disabled={restoring}
          >
            <ThemedText
              variant="label"
              color="onMuted"
              style={styles.restoreText}
            >
              {restoring ? 'Restoring…' : 'Restore Purchases'}
            </ThemedText>
          </Pressable>
        </View>

        {/* ── Legal footer ── */}
        <View style={styles.legalSection}>
          <ThemedText
            variant="badge"
            color="onMuted"
            style={styles.legalText}
          >
            {BYPASS_PAYWALL
              ? ''
              : selected?.trialLabel
                ? `After the free trial, your subscription will automatically renew at ${selected.price}${selected.period}. `
                : selected
                  ? `Your subscription will automatically renew at ${selected.price}${selected.period}. `
                  : ''}
            Cancel anytime. By subscribing, you agree to our{' '}
          </ThemedText>

          <View style={styles.legalLinks}>
            <Pressable onPress={() => openURL(TERMS_OF_SERVICE_URL)}>
              <ThemedText variant="badge" style={styles.legalLink}>
                Terms of Service
              </ThemedText>
            </Pressable>

            <ThemedText variant="badge" color="onMuted">
              {' '}and{' '}
            </ThemedText>

            <Pressable onPress={() => openURL(PRIVACY_POLICY_URL)}>
              <ThemedText variant="badge" style={styles.legalLink}>
                Privacy Policy
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenView>
  );
};

export default PurchaseScreen;

/* ─── Styles ───────────────────────────────────────────────── */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  container: {
    gap: SPACE['2xl'],
    paddingBottom: SPACE['3xl'],
  },

  /* ── Hero ── */

  hero: {
    alignItems: 'center',
    gap: SPACE.md,
    paddingTop: SPACE.xl,
  },

  heroIconCircle: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.full,
    backgroundColor: 'hsla(250, 50%, 50%, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'hsla(250, 50%, 70%, 0.25)',
    boxShadow: SHADOW.primary,
  },

  heroTitle: {
    textAlign: 'center',
    lineHeight: 44,
  },

  heroSubtitle: {
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 24,
  },

  /* ── Features ── */

  featuresCard: {
    backgroundColor: COLOR.card,
    borderRadius: RADIUS['2xl'],
    borderWidth: 1,
    borderColor: COLOR.border,
    padding: SPACE.xl,
    gap: SPACE.lg,
    boxShadow: SHADOW.sm,
  },

  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACE.md,
  },

  featureText: {
    flex: 1,
  },

  /* ── Plans ── */

  plansSection: {
    gap: SPACE.md,
  },

  plansTitle: {
    textAlign: 'center',
  },

  plansFallback: {
    backgroundColor: COLOR.card,
    borderRadius: RADIUS['2xl'],
    borderWidth: 1,
    borderColor: COLOR.border,
    padding: SPACE.xl,
    alignItems: 'center',
    gap: SPACE.sm,
  },

  plansFallbackText: {
    textAlign: 'center',
  },

  planCard: {
    backgroundColor: COLOR.card,
    borderRadius: RADIUS['2xl'],
    borderWidth: 2,
    borderColor: COLOR.border,
    padding: SPACE.lg,
    gap: SPACE.sm,
    boxShadow: SHADOW.sm,
  },

  planCardSelected: {
    borderColor: COLOR.primary,
    backgroundColor: 'hsla(250, 50%, 50%, 0.06)',
    boxShadow: SHADOW.primary,
  },

  planBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLOR.primary,
    paddingHorizontal: SPACE.md,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },

  planBadgeBestValue: {
    backgroundColor: COLOR.green,
  },

  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACE.md,
  },

  planRadio: {
    width: 22,
    height: 22,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    borderColor: COLOR.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  planRadioInner: {
    width: 12,
    height: 12,
    borderRadius: RADIUS.full,
    backgroundColor: COLOR.primary,
  },

  planInfo: {
    flex: 1,
    gap: 2,
  },

  planPricing: {
    alignItems: 'flex-end',
  },

  savingsBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'hsla(125, 50%, 50%, 0.12)',
    paddingHorizontal: SPACE.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    marginLeft: 34,
  },

  /* ── CTA ── */

  ctaSection: {
    gap: SPACE.md,
    alignItems: 'center',
  },

  restoreText: {
    textDecorationLine: 'underline',
  },

  /* ── Legal ── */

  legalSection: {
    alignItems: 'center',
    paddingHorizontal: SPACE.md,
  },

  legalText: {
    textAlign: 'center',
    lineHeight: 18,
  },

  legalLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },

  legalLink: {
    color: COLOR.primaryLight,
    textDecorationLine: 'underline',
  },
});
