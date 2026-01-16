import Button from '@/components/common/button';
import ScreenWrapper from '@/components/common/screen-wrapper';
import Typography from '@/components/common/typography';
import { scale, verticalScale } from '@/helpers/scale';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';



const WelcomeScreen = () => {
  const handlePress = () => {
    router.push('/onboarding/features');
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View
          style={{ flex: 1, justifyContent: 'center', gap: verticalScale(16) }}
        >
          <Animated.Image
            entering={FadeIn.duration(700)}
            source={require('@/assets/images/face-symmetry.png')}
            style={styles.welcomeImage}
            resizeMode={'contain'}
          />

          <View style={{ alignItems: 'center' }}>
            <Typography color="onBackground" font="bold" size={32}>
              Symmetry IQ
            </Typography>
            <Typography color="onSecondary" font="regular" size={16}>
              Become Symmetrical.
            </Typography>
          </View>
        </View>

        <Button onPress={handlePress}>
          <Typography color="onPrimary" font="semiBold" size={16}>
            Get Started
          </Typography>
        </Button>
      </View>
    </ScreenWrapper>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    marginVertical: verticalScale(16),
  },

  welcomeImage: {
    height: verticalScale(300),
    aspectRatio: 1,
    borderRadius: verticalScale(56),
    alignSelf: 'center',
  },
});
