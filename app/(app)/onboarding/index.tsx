import Button from '@/components/Button';
import ScreenView from '@/components/ScreenView';
import ThemedText from '@/components/ThemedText';
import { navigateTo } from '@/utils/router.util';
import { verticalScale } from '@/utils/scaling.util';
import { Image } from 'expo-image';
import { ArrowRightIcon } from 'phosphor-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const WelcomeScreen = () => {
  return (
    <ScreenView>
      <View style={styles.contentContainer}>
        <Image
          source={require('@/assets/images/welcome.jpg')}
          style={styles.image}
          contentFit="cover"
        />

        <View style={styles.textContainer}>
          <ThemedText variant="h1" color="onPrimary">
            Symmetry IQ
          </ThemedText>
          <ThemedText color="onSecondary">Become Symmetrical</ThemedText>
        </View>
      </View>

      <Button
        title="Get Started"
        size="lg"
        iconPosition="right"
        icon={ArrowRightIcon}
        onPress={() => navigateTo('/onboarding/features')}
      />
    </ScreenView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: verticalScale(16),
  },

  image: {
    width: '100%',
    height: verticalScale(350),
    borderRadius: 56,
    borderCurve: 'continuous',
    alignSelf: 'center',
    overflow: 'hidden',
  },

  textContainer: {
    gap: verticalScale(4),
    alignItems: 'center',
  },
});
