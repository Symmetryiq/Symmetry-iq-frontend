import Button from '@/components/Button';
import ScreenView from '@/components/ScreenView';
import ThemedText from '@/components/ThemedText';
import { COLOR, RADIUS, SHADOW, THEME } from '@/constants/theme';
import { TIPS } from '@/constants/tips';
import { verticalScale } from '@/utils/scaling.util';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  ArrowSquareOut,
  Lightning,
  Warning,
} from 'phosphor-react-native';
import React from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';

const TipScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const tip = TIPS.find((t) => t.id === id);

  if (!tip) {
    return (
      <ScreenView>
        <ThemedText variant="h2">Tip not found</ThemedText>
      </ScreenView>
    );
  }

  return (
    <ScreenView padded={false}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={22} color={COLOR.onBackground} />
          </Pressable>
        </View>

        <View style={styles.heroCard}>
          <ThemedText style={styles.heroIcon}>{tip.icon}</ThemedText>
          <ThemedText variant="h2" style={styles.heroTitle}>
            {tip.title}
          </ThemedText>
        </View>

        <ThemedText color="onSecondary" style={styles.description}>
          {tip.description}
        </ThemedText>

        {tip.actionItems && tip.actionItems.length > 0 && (
          <View style={styles.section}>
            <ThemedText variant="h4">What You Can Do</ThemedText>
            <View style={styles.itemsContainer}>
              {tip.actionItems.map((item, index) => (
                <View key={index} style={styles.actionItem}>
                  <ThemedText style={styles.actionEmoji}>
                    {item.emoji}
                  </ThemedText>
                  <ThemedText
                    variant="bodySmall"
                    color="onCard"
                    style={styles.actionText}
                  >
                    {item.text}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
        )}

        {tip.steps && tip.steps.length > 0 && (
          <View style={styles.section}>
            <ThemedText variant="h4">Step by Step</ThemedText>
            <View style={styles.itemsContainer}>
              {tip.steps.map((step) => (
                <View key={step.number} style={styles.stepItem}>
                  <View style={styles.stepBadge}>
                    <ThemedText variant="label" color="onPrimary">
                      {step.number}
                    </ThemedText>
                  </View>
                  <ThemedText
                    variant="bodySmall"
                    color="onCard"
                    style={styles.stepText}
                  >
                    {step.text}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
        )}

        {tip.proTip && (
          <View style={styles.proTipCard}>
            <View style={styles.proTipHeader}>
              <Lightning size={18} color={COLOR.yellow} weight="fill" />
              <ThemedText variant="label" color="yellow">
                Pro Tip
              </ThemedText>
            </View>
            <ThemedText variant="bodySmall" color="onCard">
              {tip.proTip}
            </ThemedText>
          </View>
        )}

        {tip.products && tip.products.length > 0 && (
          <View style={styles.section}>
            <ThemedText variant="h4">Recommended Products</ThemedText>
            <View style={styles.productsGrid}>
              {tip.products.map((product, index) => (
                <View key={index} style={styles.productCard}>
                  <ThemedText variant="label">{product.name}</ThemedText>
                  <ThemedText variant="caption" color="onMuted">
                    {product.description}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
        )}

        {tip.commonMistakes && tip.commonMistakes.length > 0 && (
          <View style={styles.section}>
            <View style={styles.mistakesHeader}>
              <Warning size={20} color={COLOR.red} weight="fill" />
              <ThemedText variant="h4">Common Mistakes</ThemedText>
            </View>
            <View style={styles.itemsContainer}>
              {tip.commonMistakes.map((mistake, index) => (
                <View key={index} style={styles.mistakeItem}>
                  <View style={styles.mistakeDot} />
                  <ThemedText
                    variant="bodySmall"
                    color="onSecondary"
                    style={styles.mistakeText}
                  >
                    {mistake}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
        )}

        {tip.externalLink && (
          <Button
            title={tip.externalLink.text}
            variant="secondary"
            icon={ArrowSquareOut}
            iconPosition="right"
            onPress={() => Linking.openURL(tip.externalLink!.url)}
            fullWidth
          />
        )}
      </ScrollView>
    </ScreenView>
  );
};

export default TipScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: THEME.PADDING.screen,
    paddingBottom: verticalScale(40),
    gap: verticalScale(20),
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: COLOR.card,
    borderWidth: 1,
    borderColor: COLOR.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  heroCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.card,
    borderWidth: 1,
    borderColor: COLOR.border,
    borderRadius: RADIUS['3xl'],
    paddingVertical: verticalScale(32),
    paddingHorizontal: THEME.PADDING.card,
    gap: verticalScale(12),
    boxShadow: SHADOW.lg,
  },

  heroIcon: {
    fontSize: 56,
  },

  heroTitle: {
    textAlign: 'center',
  },

  description: {
    lineHeight: 24,
  },

  section: {
    gap: verticalScale(12),
  },

  itemsContainer: {
    gap: 10,
  },

  actionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLOR.card,
    borderWidth: 1,
    borderColor: COLOR.border,
    borderRadius: RADIUS.xl,
    padding: THEME.PADDING.card,
    gap: 12,
  },

  actionEmoji: {
    fontSize: 20,
    marginTop: 2,
  },

  actionText: {
    flex: 1,
    lineHeight: 22,
  },

  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },

  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.full,
    backgroundColor: COLOR.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },

  stepText: {
    flex: 1,
    lineHeight: 22,
  },

  proTipCard: {
    backgroundColor: 'hsla(45, 50%, 50%, 0.08)',
    borderWidth: 1,
    borderColor: 'hsla(45, 50%, 50%, 0.2)',
    borderRadius: RADIUS['3xl'],
    padding: THEME.PADDING.card,
    gap: 8,
  },

  proTipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  productsGrid: {
    gap: 10,
  },

  productCard: {
    backgroundColor: COLOR.card,
    borderWidth: 1,
    borderColor: COLOR.border,
    borderRadius: RADIUS.xl,
    padding: THEME.PADDING.card,
    gap: 4,
  },

  mistakesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  mistakeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingLeft: 4,
  },

  mistakeDot: {
    width: 6,
    height: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLOR.red,
    marginTop: 7,
  },

  mistakeText: {
    flex: 1,
    lineHeight: 22,
  },
});
