import BackButton from '@/components/common/back-button';
import ScreenWrapper from '@/components/common/screen-wrapper';
import Typography from '@/components/common/typography';
import { FeatureId } from '@/constants/factors';
import { Colors } from '@/constants/theme';
import { Features } from '@/data/insights';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  LayoutAnimation,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  UIManager,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FeatureDetailScreen = () => {
  const router = useRouter();
  const { factor: featureId } = useLocalSearchParams<{ factor: FeatureId }>();
  const [completedTips, setCompletedTips] = useState<Set<number>>(new Set());
  const [completedMistakes, setCompletedMistakes] = useState<Set<number>>(
    new Set()
  );
  const [expanded, setExpanded] = useState(false);

  const feature = useMemo(() => {
    if (!featureId) return null;
    return Features.find((f) => f.id === featureId) || null;
  }, [featureId]);

  const toggleTip = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCompletedTips((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const toggleMistake = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCompletedMistakes((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleTikTokLink = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error('Failed to open URL:', err)
    );
  };

  if (!feature) {
    return (
      <ScreenWrapper style={styles.container}>
        <View style={styles.errorContainer}>
          <Typography size={18} color="onSecondary">Factor details not available</Typography>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Typography color="primary" font="medium">Go Back</Typography>
          </Pressable>
        </View>
      </ScreenWrapper>
    );
  }

  const tipsProgress =
    feature.whatToDo.items.length > 0
      ? (completedTips.size / feature.whatToDo.items.length)
      : 0;

  return (
    <ScreenWrapper style={styles.container} edges={['top']}>
      {/* Dynamic Header */}
      <View style={styles.header}>
        <BackButton />
        <Typography size={18} font="semiBold" style={styles.headerTitle}>
          Symmetry Guide
        </Typography>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={[Colors.primaryLight, 'transparent']}
            style={styles.heroGradient}
          />
          <View style={styles.headingRow}>
            <View style={styles.emojiBadge}>
              <Typography size={40}>{feature.emoji}</Typography>
            </View>
            <View style={styles.headingText}>
              <Typography size={32} font="bold" color="onBackground">
                {feature.title}
              </Typography>
              <View style={styles.badge}>
                <Typography size={12} font="semiBold" color="primary">FACIAL FACTOR</Typography>
              </View>
            </View>
          </View>

          <View style={styles.descriptionCard}>
            <Typography size={16} color="onSecondary" style={styles.descriptionText}>
              {feature.description}
            </Typography>
          </View>
        </View>

        {/* Action Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Typography size={14} font="semiBold" color="onTertiary">GOAL PROGRESS</Typography>
            <Typography size={14} font="bold" color="primary">
              {Math.round(tipsProgress * 100)}%
            </Typography>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${tipsProgress * 100}%` }]} />
          </View>
        </View>

        {/* Precision Steps (How to Shape) */}
        {feature.howToShape && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="layers-outline" size={24} color={Colors.primary} />
              <Typography size={20} font="bold">{feature.howToShape.title}</Typography>
            </View>
            <View style={styles.stepsContainer}>
              {feature.howToShape.steps.map((step, index) => (
                <View key={index} style={styles.stepCard}>
                  <View style={styles.stepIndex}>
                    <Typography size={12} font="bold" color="onPrimary">{index + 1}</Typography>
                  </View>
                  <Typography size={15} color="onSecondary" style={styles.stepText}>{step}</Typography>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Master Checklist */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="check-circle" size={24} color={Colors.success} />
            <Typography size={20} font="bold">{feature.whatToDo.title}</Typography>
          </View>
          {feature.whatToDo.items.map((item, index) => {
            const isCompleted = completedTips.has(index);
            return (
              <Pressable
                key={index}
                onPress={() => toggleTip(index)}
                style={[styles.checkItem, isCompleted && styles.checkItemActive]}
              >
                <View style={[styles.checkbox, isCompleted && styles.checkboxActive]}>
                  {isCompleted && <Ionicons name="checkmark" size={16} color="#fff" />}
                </View>
                <View style={styles.checkContent}>
                  <View style={styles.checkTitleRow}>
                    <Typography size={16}>{item.emoji}</Typography>
                    <Typography
                      size={16}
                      font="semiBold"
                      color={isCompleted ? 'onMuted' : 'onBackground'}
                      style={isCompleted && styles.strikeThrough}
                    >
                      {item.label}
                    </Typography>
                  </View>
                  {!isCompleted && (
                    <Typography size={14} color="onSecondary" style={styles.checkDesc}>
                      {item.description}
                    </Typography>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* TikTok Integration */}
        {feature.tiktokFilter && (
          <Pressable
            onPress={() => handleTikTokLink(feature.tiktokFilter!.url)}
            style={styles.tiktokCard}
          >
            <LinearGradient
              colors={['#FE2C55', '#25F4EE']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.tiktokGradient}
            />
            <View style={styles.tiktokContent}>
              <View style={styles.tiktokIcon}>
                <Ionicons name="logo-tiktok" size={24} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Typography size={16} font="bold" color="onPrimary">AR Symmetry Filter</Typography>
                <Typography size={12} color="onPrimary" style={{ opacity: 0.8 }}>
                  {feature.tiktokFilter.text}
                </Typography>
              </View>
              <Feather name="arrow-right" size={20} color="#fff" />
            </View>
          </Pressable>
        )}

        {/* Recommendations */}
        {feature.recommendedProducts && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="shopping-bag" size={24} color="#FFD700" />
              <Typography size={20} font="bold">Expert Toolkit</Typography>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.productsScroll}
            >
              {feature.recommendedProducts.items.map((product, index) => (
                <View key={index} style={styles.productCard}>
                  <View style={styles.productIconBg}>
                    <MaterialCommunityIcons name="star-four-points" size={20} color="#FFD700" />
                  </View>
                  <Typography size={15} font="bold" color="onBackground">{product.name}</Typography>
                  <Typography size={12} color="onTertiary" style={{ marginTop: 4 }}>{product.benefit}</Typography>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Pro Tip */}
        {feature.proTip && (
          <View style={styles.proTipContainer}>
            <LinearGradient
              colors={[Colors.primary, '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.proTipBg}
            />
            <View style={styles.proTipHeader}>
              <Feather name="zap" size={18} color="#fff" />
              <Typography size={14} font="bold" color="onPrimary">PRO TIP</Typography>
            </View>
            <Typography size={15} color="onPrimary" style={styles.proTipText}>
              {feature.proTip}
            </Typography>
          </View>
        )}

        {/* Pitfalls to Avoid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="alert-triangle" size={24} color={Colors.danger} />
            <Typography size={20} font="bold">Habits to Break</Typography>
          </View>
          {feature.commonMistakes.items.map((mistake, index) => {
            const isAvoided = completedMistakes.has(index);
            return (
              <Pressable
                key={index}
                onPress={() => toggleMistake(index)}
                style={[styles.mistakeItem, isAvoided && styles.mistakeItemActive]}
              >
                <View style={[styles.mistakeIcon, isAvoided && styles.mistakeItemActive]}>
                  <Ionicons name={isAvoided ? "shield-checkmark" : "close-circle-outline"} size={20} color={isAvoided ? Colors.success : Colors.danger} />
                </View>
                <Typography
                  size={15}
                  color={isAvoided ? 'onMuted' : 'onSecondary'}
                  style={[styles.mistakeText, isAvoided && styles.strikeThrough]}
                >
                  {mistake}
                </Typography>
              </Pressable>
            );
          })}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </ScreenWrapper>
  );
};

export default FeatureDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    position: 'relative',
    overflow: 'hidden',
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    opacity: 0.5,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  emojiBadge: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingText: {
    flex: 1,
    gap: 4,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  descriptionCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  descriptionText: {
    lineHeight: 24,
    opacity: 0.9,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  stepsContainer: {
    gap: 12,
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 16,
    borderRadius: 16,
    gap: 16,
    alignItems: 'center',
  },
  stepIndex: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    flex: 1,
    lineHeight: 22,
  },
  checkItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 16,
  },
  checkItemActive: {
    borderColor: 'rgba(76, 175, 80, 0.2)',
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  checkContent: {
    flex: 1,
    gap: 4,
  },
  checkTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkDesc: {
    opacity: 0.7,
    lineHeight: 20,
  },
  strikeThrough: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  tiktokCard: {
    marginHorizontal: 20,
    height: 72,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 32,
    justifyContent: 'center',
  },
  tiktokGradient: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.9,
  },
  tiktokContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 16,
  },
  tiktokIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productsScroll: {
    gap: 12,
    paddingRight: 20,
  },
  productCard: {
    width: 160,
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  productIconBg: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  proTipContainer: {
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 24,
    marginBottom: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  proTipBg: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
  },
  proTipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  proTipText: {
    lineHeight: 24,
    fontStyle: 'italic',
  },
  mistakeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 16,
    marginBottom: 10,
    gap: 12,
  },
  mistakeItemActive: {
    opacity: 0.6,
  },
  mistakeIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mistakeText: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
  },
});
