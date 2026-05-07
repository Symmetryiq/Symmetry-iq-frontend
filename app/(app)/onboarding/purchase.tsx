import Button from '@/components/Button';
import ScreenView from '@/components/ScreenView';
import ThemedText from '@/components/ThemedText';
import { PRIVACY_POLICY_URL, TERMS_OF_SERVICE_URL } from '@/constants/app';
import { COLOR, FONT, RADIUS, SHADOW, SPACE, TEXT } from '@/constants/theme';
import { useOnboardingStore } from '@/hooks/useOnboardingStore';
import { openURL } from '@/utils/router.util';
import {
  CheckCircleIcon,
  CrownIcon,
  SparkleIcon,
} from 'phosphor-react-native';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

/* ─── Types ────────────────────────────────────────────────── */

type PlanTier = 'weekly' | 'monthly' | 'yearly';

type PlanOption = {
  id: PlanTier;
  label: string;
  price: string;
  period: string;
  badge?: string;
  savings?: string;
  trialLabel?: string;
};

const PLANS: PlanOption[] = [
  {
    id: 'weekly',
    label: 'Weekly',
    price: '$4.99',
    period: '/week',
    trialLabel: '3-day free trial',
  },
  {
    id: 'monthly',
    label: 'Monthly',
    price: '$14.99',
    period: '/month',
    badge: 'Most Popular',
    trialLabel: '7-day free trial',
  },
  {
    id: 'yearly',
    label: 'Yearly',
    price: '$49.99',
    period: '/year',
    badge: 'Best Value',
    savings: 'Save 80%',
    trialLabel: '7-day free trial',
  },
];

const FEATURES = [
  'All 10 facial feature scores unlocked',
  'Personalized 4-week routine plans',
  'Daily guided exercises & routines',
  'Progress tracking with scan history',
  'Daily task checklist & reminders',
  'Tips & insights to maximize results',
];

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
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>('yearly');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = useCallback(async () => {
    setLoading(true);

    // TODO: Integrate with RevenueCat / StoreKit for actual purchase
    // For now, simulate a short delay and complete onboarding
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      completeOnboarding();
    } catch {
      Alert.alert(
        'Purchase Failed',
        'Something went wrong. Please try again.',
        [{ text: 'OK' }],
        { userInterfaceStyle: 'dark' },
      );
    } finally {
      setLoading(false);
    }
  }, [completeOnboarding, selectedPlan]);

  const handleRestore = useCallback(() => {
    // TODO: Integrate with RevenueCat / StoreKit for restore
    Alert.alert(
      'Restore Purchases',
      'No previous purchases found. Please subscribe to continue.',
      [{ text: 'OK' }],
      { userInterfaceStyle: 'dark' },
    );
  }, []);

  const selected = PLANS.find((p) => p.id === selectedPlan)!;

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
        <View style={styles.plansSection}>
          <ThemedText variant="h3" style={styles.plansTitle}>
            Choose Your Plan
          </ThemedText>

          {PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              selected={selectedPlan === plan.id}
              onSelect={() => setSelectedPlan(plan.id)}
            />
          ))}
        </View>

        {/* ── CTA ── */}
        <View style={styles.ctaSection}>
          <Button
            title={
              selected.trialLabel
                ? `Start Free Trial`
                : `Subscribe ${selected.price}${selected.period}`
            }
            variant="primary"
            size="lg"
            icon={SparkleIcon}
            iconPosition="right"
            onPress={handleSubscribe}
            loading={loading}
          />

          <Pressable onPress={handleRestore} hitSlop={8}>
            <ThemedText
              variant="label"
              color="onMuted"
              style={styles.restoreText}
            >
              Restore Purchases
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
            {selected.trialLabel
              ? `After the free trial, your subscription will automatically renew at ${selected.price}${selected.period}. `
              : `Your subscription will automatically renew at ${selected.price}${selected.period}. `}
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
