import Button from '@/components/common/button';
import ScreenWrapper from '@/components/common/screen-wrapper';
import Typography from '@/components/common/typography';
import { POLICY_URL, TERMS_URL } from '@/constants';
import { PREMIUM_FEATURES, SUBSCRIPTION_PLANS } from '@/constants/subscriptions';
import { Colors } from '@/constants/theme';
import { scale, verticalScale } from '@/helpers/scale';
import { openBrowserLink } from '@/helpers/utils';
import { updateUserProfile } from '@/services/api/user.api';
import { useOnboardingStore } from '@/stores/onboarding';
import { LinearGradient } from 'expo-linear-gradient';
import {
  BookOpen,
  CheckCircle,
  ListChecks,
  Prohibit,
  Scan,
  ShieldCheck,
  Sparkle,
  Star
} from 'phosphor-react-native';
import React, { useState } from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  View
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const IconMap: Record<string, any> = {
  Scan,
  Brain: Sparkle,
  ListChecks,
  BookOpen,

  Prohibit,
};

const Purchase = () => {
  const { setOnboardingCompleted, age, gender } = useOnboardingStore();
  const [selectedPlan, setSelectedPlan] = useState('yearly');

  // useEffect(() => {
  //   initializePaywall();
  // }, [])

  // const packages = getPackages().then((packages) => {
  //   console.log(packages);
  // })

  const handleCompleteOnboarding = async () => {
    try {
      // Sync onboarding data to backend metadata
      await updateUserProfile({
        age: age,
        gender: gender,
        notifications: true, // Default to true
      });

      // Mark onboarding as completed
      setOnboardingCompleted(true);
    } catch (error) {
      console.error('Error syncing onboarding data:', error);
      // Still complete onboarding even if API fails - data is in store
      setOnboardingCompleted(true);
    }
  };

  return (
    <ScreenWrapper style={styles.wrapper}>
      <LinearGradient
        colors={[Colors.primaryLight, 'transparent', Colors.background]}
        locations={[0, 0.4, 0.9]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Star size={32} weight="fill" color={Colors.primary} />
          </View>
          <Typography size={28} font="bold" center style={styles.title}>
            Symmetry Premium
          </Typography>
          <Typography size={15} color="onMuted" center style={styles.subtitle}>
            Your ultimate tool for facial aesthetics
          </Typography>
        </View>

        {/* Features Grid - 2 Column Layout to save vertical space */}
        <View style={styles.featuresGrid}>
          {PREMIUM_FEATURES.map((feature, index) => {
            const Icon = IconMap[feature.icon] || ShieldCheck;
            return (
              <View key={index} style={styles.featureItemWrapper}>
                <View style={styles.featureIconSmall}>
                  <Icon size={18} weight="fill" color={Colors.primary} />
                </View>
                <Typography size={13} font="medium" style={styles.featureTitle}>
                  {feature.title}
                </Typography>
              </View>
            );
          })}
        </View>

        {/* Plans Section - Compressed height */}
        <View style={styles.plansContainer}>
          {SUBSCRIPTION_PLANS.map((plan) => (
            <Pressable
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.selectedPlanCard,
              ]}
              onPress={() => setSelectedPlan(plan.id)}
            >
              <View style={styles.planInfo}>
                <Typography size={16} font="bold">
                  {plan.title.split(' ')[0]} Premium
                </Typography>
                <Typography size={12} color="onMuted">
                  {plan.duration}
                </Typography>
              </View>

              <View style={styles.planPriceAndBadge}>
                {plan.badge && (
                  <View style={styles.smallBadge}>
                    <Typography size={10} font="bold" color="onPrimary">
                      {plan.badge}
                    </Typography>
                  </View>
                )}
                <View style={styles.priceRow}>
                  <Typography size={20} font="bold">
                    {plan.price}
                  </Typography>
                  {selectedPlan === plan.id && (
                    <CheckCircle size={22} weight="fill" color={Colors.primary} />
                  )}
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Action Section */}
        <View style={styles.footer}>
          <Button
            onPress={handleCompleteOnboarding}
            style={styles.ctaButton}
          >
            <Typography font="bold" color="onPrimary" size={18}>
              Start Your Glow Up
            </Typography>
          </Button>

          <View style={styles.legalLinks}>
            <Pressable hitSlop={10}>
              <Typography size={12} color="onMuted">Restore</Typography>
            </Pressable>
            <Typography size={12} color="onMuted">•</Typography>
            <Pressable hitSlop={10} onPress={() => openBrowserLink(TERMS_URL)}>
              <Typography size={12} color="onMuted">Terms</Typography>
            </Pressable>
            <Typography size={12} color="onMuted">•</Typography>
            <Pressable hitSlop={10} onPress={() => openBrowserLink(POLICY_URL)}>
              <Typography size={12} color="onMuted">Privacy</Typography>
            </Pressable>
          </View>

          <Typography size={10} color="onMuted" center style={styles.disclaimer}>
            Recurring billing. Cancel anytime.
          </Typography>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Purchase;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.background,
    flex: 1
  },
  container: {
    flex: 1,
    paddingHorizontal: scale(20),
    justifyContent: 'space-between',
    paddingVertical: verticalScale(16),
  },
  header: {
    alignItems: 'center',
    marginTop: verticalScale(8),
  },
  logoContainer: {
    width: scale(60),
    height: scale(60),
    borderRadius: 200,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  title: {
    marginBottom: verticalScale(4),
  },
  subtitle: {
    opacity: 0.8,
    paddingHorizontal: scale(20),
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: verticalScale(16),
    gap: verticalScale(10),
  },
  featureItemWrapper: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    padding: scale(8),
    borderRadius: 12,
    gap: scale(8),
  },
  featureIconSmall: {
    width: scale(28),
    height: scale(28),
    borderRadius: 8,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTitle: {
    flex: 1,
  },
  plansContainer: {
    gap: verticalScale(10),
  },
  planCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(16),
    borderWidth: 2,
    borderColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedPlanCard: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(74, 58, 255, 0.08)',
  },
  planInfo: {
    gap: verticalScale(2),
  },
  planPriceAndBadge: {
    alignItems: 'flex-end',
    gap: verticalScale(4),
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  smallBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(2),
    borderRadius: 6,
  },
  footer: {
    alignItems: 'center',
    gap: verticalScale(12),
    marginTop: verticalScale(10),
  },
  ctaButton: {
    width: '100%',
    paddingVertical: verticalScale(16),
    borderRadius: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  legalLinks: {
    flexDirection: 'row',
    gap: scale(12),
    opacity: 0.6,
  },
  disclaimer: {
    opacity: 0.5,
  },
});


