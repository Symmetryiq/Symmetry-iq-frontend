import Button from '@/components/Button';
import ScreenView from '@/components/ScreenView';
import ThemedText from '@/components/ThemedText';
import { PRIVACY_POLICY_URL, TERMS_OF_SERVICE_URL } from '@/constants/app';
import { COLOR, FONT, RADIUS, SHADOW, SPACE } from '@/constants/theme';
import { useOnboardingStore } from '@/hooks/useOnboardingStore';
import { usePurchasesStore } from '@/hooks/usePurchasesStore';
import { openURL } from '@/utils/router.util';
import { isPremium, isUserCancelledError } from '@/utils/purchases.util';
import {
  ArrowRightIcon,
  ChartLineUpIcon,
  CheckIcon,
  CrownIcon,
  ListChecksIcon,
  ScanIcon,
  SparkleIcon,
  StarIcon,
  TargetIcon,
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
import Purchases, {
  PurchasesOffering,
  PurchasesPackage,
} from 'react-native-purchases';

type PlanTier = 'weekly' | 'monthly' | 'yearly';

const PERIOD_LABEL: Record<PlanTier, string> = {
  weekly: 'per week',
  monthly: 'per month',
  yearly: 'per year',
};

const TIER_LABEL: Record<PlanTier, string> = {
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
};

const FEATURES = [
  { Icon: ScanIcon, text: 'Full facial feature score breakdown' },
  { Icon: TargetIcon, text: 'Personalized 4-week routine plans' },
  { Icon: ListChecksIcon, text: 'Daily guided exercises & tasks' },
  { Icon: ChartLineUpIcon, text: 'Progress tracking with scan history' },
  { Icon: SparkleIcon, text: 'Tips & insights to maximize results' },
];

const PurchaseScreen = () => {
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);
  const setCustomerInfo = usePurchasesStore((s) => s.setCustomerInfo);

  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<PlanTier>('yearly');
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const offerings = await Purchases.getOfferings();
        if (cancelled) return;
        const current = offerings.current;
        if (!current || current.availablePackages.length === 0) {
          setError('Subscription plans are unavailable right now.');
        } else {
          setOffering(current);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Could not load plans.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const plans = useMemo(() => {
    if (!offering) return [] as { tier: PlanTier; pkg: PurchasesPackage }[];
    const map: { tier: PlanTier; pkg: PurchasesPackage | null }[] = [
      { tier: 'weekly', pkg: offering.weekly ?? null },
      { tier: 'monthly', pkg: offering.monthly ?? null },
      { tier: 'yearly', pkg: offering.annual ?? null },
    ];
    return map.filter(
      (p): p is { tier: PlanTier; pkg: PurchasesPackage } => p.pkg !== null,
    );
  }, [offering]);

  const selectedPlan =
    plans.find((p) => p.tier === selectedTier) ?? plans[plans.length - 1];
  const weeklyPlan = plans.find((p) => p.tier === 'weekly');

  const handleSubscribe = useCallback(async () => {
    if (!selectedPlan) return;
    setPurchasing(true);
    try {
      const { customerInfo } = await Purchases.purchasePackage(
        selectedPlan.pkg,
      );
      setCustomerInfo(customerInfo);
      if (isPremium(customerInfo)) {
        completeOnboarding();
      } else {
        Alert.alert(
          'Purchase incomplete',
          'The purchase finished but premium is not active yet. Try Restore Purchases or contact support.',
        );
      }
    } catch (e) {
      if (isUserCancelledError(e)) return;
      Alert.alert('Purchase failed', 'Something went wrong. Please try again.');
    } finally {
      setPurchasing(false);
    }
  }, [selectedPlan, completeOnboarding, setCustomerInfo]);

  const handleRestore = useCallback(async () => {
    setRestoring(true);
    try {
      const customerInfo = await Purchases.restorePurchases();
      setCustomerInfo(customerInfo);
      if (isPremium(customerInfo)) {
        completeOnboarding();
      } else {
        Alert.alert(
          'Restore Purchases',
          'No active subscription found on this account.',
        );
      }
    } catch {
      Alert.alert('Restore failed', 'Could not restore purchases.');
    } finally {
      setRestoring(false);
    }
  }, [completeOnboarding, setCustomerInfo]);

  const ctaTitle = selectedPlan
    ? `Continue with ${TIER_LABEL[selectedPlan.tier]}`
    : 'Continue';

  return (
    <ScreenView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroIconCircle}>
            <CrownIcon color={COLOR.primaryLight} size={36} weight="fill" />
          </View>
          <ThemedText variant="h1" style={styles.heroTitle}>
            Unlock Symmetry{'\n'}Premium
          </ThemedText>
          <ThemedText
            variant="body"
            color="onSecondary"
            style={styles.heroSubtitle}
          >
            Everything you need to track and improve your facial harmony.
          </ThemedText>
        </View>

        <View style={styles.featuresCard}>
          {FEATURES.map(({ Icon, text }, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={styles.featureIconWrap}>
                <Icon size={18} color={COLOR.primaryLight} weight="fill" />
              </View>
              <ThemedText variant="body" style={styles.featureText}>
                {text}
              </ThemedText>
            </View>
          ))}
        </View>

        <View style={styles.plansSection}>
          <ThemedText variant="h3" style={styles.plansTitle}>
            Choose your plan
          </ThemedText>

          {loading && (
            <View style={styles.plansFallback}>
              <ActivityIndicator color={COLOR.primaryLight} />
              <ThemedText variant="bodySmall" color="onSecondary">
                Loading plans…
              </ThemedText>
            </View>
          )}

          {!loading && error && (
            <View style={styles.plansFallback}>
              <ThemedText
                variant="bodySmall"
                color="onSecondary"
                style={styles.plansFallbackText}
              >
                {error}
              </ThemedText>
            </View>
          )}

          {!loading &&
            !error &&
            plans.map(({ tier, pkg }) => (
              <PlanCard
                key={tier}
                tier={tier}
                pkg={pkg}
                weeklyPrice={weeklyPlan?.pkg.product.price}
                selected={selectedTier === tier}
                onSelect={() => setSelectedTier(tier)}
              />
            ))}
        </View>

        <View style={styles.ctaSection}>
          <Button
            title={ctaTitle}
            variant="primary"
            size="lg"
            icon={ArrowRightIcon}
            iconPosition="right"
            onPress={handleSubscribe}
            loading={purchasing}
            disabled={!selectedPlan}
          />
          <Pressable onPress={handleRestore} hitSlop={8} disabled={restoring}>
            <ThemedText
              variant="label"
              color="onMuted"
              style={styles.restoreText}
            >
              {restoring ? 'Restoring…' : 'Restore Purchases'}
            </ThemedText>
          </Pressable>
        </View>

        <View style={styles.legalSection}>
          <ThemedText
            variant="badge"
            color="onMuted"
            style={styles.legalText}
          >
            {selectedPlan
              ? `Auto-renews at ${selectedPlan.pkg.product.priceString} ${PERIOD_LABEL[selectedPlan.tier]}. Cancel anytime. `
              : 'Cancel anytime. '}
            By subscribing, you agree to our{' '}
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

function PlanCard({
  tier,
  pkg,
  weeklyPrice,
  selected,
  onSelect,
}: {
  tier: PlanTier;
  pkg: PurchasesPackage;
  weeklyPrice: number | undefined;
  selected: boolean;
  onSelect: () => void;
}) {
  const savings = computeSavings(tier, pkg.product.price, weeklyPrice);
  const isMostPopular = tier === 'yearly';

  return (
    <Pressable
      onPress={onSelect}
      style={[styles.planCard, selected && styles.planCardSelected]}
    >
      {isMostPopular && (
        <View style={styles.planBadge}>
          <StarIcon size={11} color={COLOR.onPrimary} weight="fill" />
          <ThemedText variant="badge" color="onPrimary">
            Most Popular
          </ThemedText>
        </View>
      )}

      <View style={styles.planBody}>
        <View style={[styles.planRadio, selected && styles.planRadioSelected]}>
          {selected && (
            <CheckIcon size={14} color={COLOR.onPrimary} weight="bold" />
          )}
        </View>

        <View style={styles.planInfo}>
          <View style={styles.planTitleRow}>
            <ThemedText variant="h4">{TIER_LABEL[tier]}</ThemedText>
            {savings && (
              <View style={styles.savingsPill}>
                <ThemedText variant="badge" style={styles.savingsPillText}>
                  {savings}
                </ThemedText>
              </View>
            )}
          </View>
          <ThemedText variant="bodySmall" color="onMuted">
            {pkg.product.priceString} {PERIOD_LABEL[tier]}
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

function computeSavings(
  tier: PlanTier,
  planPrice: number | undefined,
  weeklyPrice: number | undefined,
): string | undefined {
  if (tier === 'weekly' || !planPrice || !weeklyPrice) return undefined;
  const weeks = tier === 'yearly' ? 52 : 4.345;
  const fullPrice = weeklyPrice * weeks;
  if (fullPrice <= planPrice) return undefined;
  const pct = Math.round(((fullPrice - planPrice) / fullPrice) * 100);
  return pct > 0 ? `Save ${pct}%` : undefined;
}

export default PurchaseScreen;

const styles = StyleSheet.create({
  screen: { flex: 1 },

  container: {
    gap: SPACE['2xl'],
    paddingBottom: SPACE['3xl'],
  },

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
  heroTitle: { textAlign: 'center', lineHeight: 44 },
  heroSubtitle: { textAlign: 'center', maxWidth: 320, lineHeight: 24 },

  featuresCard: {
    backgroundColor: COLOR.card,
    borderRadius: RADIUS['2xl'],
    borderWidth: 1,
    borderColor: COLOR.border,
    padding: SPACE.xl,
    gap: SPACE.lg,
    boxShadow: SHADOW.sm,
  },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: SPACE.md },
  featureIconWrap: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.md,
    backgroundColor: 'hsla(250, 50%, 50%, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: { flex: 1 },

  plansSection: { gap: SPACE.lg },
  plansTitle: { textAlign: 'center' },
  plansFallback: {
    backgroundColor: COLOR.card,
    borderRadius: RADIUS['2xl'],
    borderWidth: 1,
    borderColor: COLOR.border,
    padding: SPACE.xl,
    alignItems: 'center',
    gap: SPACE.sm,
  },
  plansFallbackText: { textAlign: 'center' },

  planCard: {
    backgroundColor: COLOR.card,
    borderRadius: RADIUS['2xl'],
    borderWidth: 2,
    borderColor: COLOR.border,
    paddingHorizontal: SPACE.lg,
    paddingVertical: SPACE.lg,
    boxShadow: SHADOW.sm,
    position: 'relative',
  },
  planCardSelected: {
    borderColor: COLOR.primary,
    backgroundColor: 'hsla(250, 50%, 50%, 0.08)',
    boxShadow: SHADOW.primary,
  },
  planBadge: {
    position: 'absolute',
    top: -10,
    right: SPACE.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLOR.primary,
    paddingHorizontal: SPACE.md,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  planBody: { flexDirection: 'row', alignItems: 'center', gap: SPACE.md },
  planRadio: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    borderColor: COLOR.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planRadioSelected: {
    backgroundColor: COLOR.primary,
    borderColor: COLOR.primary,
  },
  planInfo: { flex: 1, gap: 4 },
  planTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACE.sm,
    flexWrap: 'wrap',
  },
  savingsPill: {
    backgroundColor: 'hsla(125, 50%, 50%, 0.15)',
    paddingHorizontal: SPACE.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  savingsPillText: { color: COLOR.green, fontFamily: FONT.semiBold },

  ctaSection: { gap: SPACE.md, alignItems: 'stretch' },
  restoreText: { textAlign: 'center', textDecorationLine: 'underline' },

  legalSection: { alignItems: 'center', paddingHorizontal: SPACE.md },
  legalText: { textAlign: 'center', lineHeight: 18 },
  legalLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  legalLink: { color: COLOR.primaryLight, textDecorationLine: 'underline' },
});
