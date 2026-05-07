import Button from '@/components/Button';
import ScreenView from '@/components/ScreenView';
import ThemedText from '@/components/ThemedText';
import { SPACE, THEME } from '@/constants/theme';
import { navigateTo } from '@/utils/router.util';
import { verticalScale } from '@/utils/scaling.util';
import { Image } from 'expo-image';
import { ArrowRightIcon } from 'phosphor-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const FEATURES = [
  { emoji: '💡', text: 'Works in any lighting' },
  { emoji: '🔒', text: 'Completely private, stored securely' },
  { emoji: '📊', text: 'Real-time tracking & insights' },
];

const FeaturesScreen = () => {
  return (
    <ScreenView padded={false} edges={['bottom']}>
      <Image
        source={require('@/assets/images/feature.jpg')}
        style={styles.image}
        contentFit="cover"
      />

      <View style={styles.body}>
        <View style={styles.header}>
          <ThemedText variant="h1" color="onBackground">
            Smart Face Scanning
          </ThemedText>
          <ThemedText variant="body" color="onMuted">
            AI-powered analysis built for clarity, improvement and confidence
          </ThemedText>
        </View>

        <View style={styles.featureList}>
          {FEATURES.map((f) => (
            <View key={f.text} style={styles.featureRow}>
              <ThemedText style={styles.emoji}>{f.emoji}</ThemedText>
              <ThemedText variant="body" color="onSecondary">
                {f.text}
              </ThemedText>
            </View>
          ))}
        </View>

        <Button
          title="Start"
          size="lg"
          iconPosition="right"
          icon={ArrowRightIcon}
          onPress={() => navigateTo('/onboarding/questions')}
        />
      </View>
    </ScreenView>
  );
};

export default FeaturesScreen;

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: verticalScale(350),
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  body: {
    padding: THEME.PADDING.screen,
    flex: 1,
    gap: verticalScale(SPACE['2xl']),
  },
  header: {
    gap: SPACE.xs,
  },
  featureList: {
    gap: SPACE.lg,
    flex: 1,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACE.md,
  },
  emoji: {
    fontSize: 24,
  },
  footer: {
    paddingBottom: SPACE.sm,
  },
});
