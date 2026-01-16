import Button from '@/components/common/button';
import ScreenWrapper from '@/components/common/screen-wrapper';
import Typography from '@/components/common/typography';
import { Colors } from '@/constants/theme';
import { scale, verticalScale } from '@/helpers/scale';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

const features = [
  'Works in any lighting',
  'Completely private, stored securely',
  'Real time tracking',
];

const FeaturesScreen = () => {
  const handleSetupStart = () => {
    router.push('/onboarding/name');
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Animated.View
          entering={FadeIn.duration(700)}
          style={styles.imageWrapper}
        >
          <Image
            source={require('@/assets/images/face-analysis.jpg')}
            resizeMode="cover"
            style={styles.image}
          />
        </Animated.View>
        {/* <Animated.Image style={styles.image} /> */}
        <View style={{ flex: 1, marginVertical: verticalScale(28) }}>
          <Typography color="onBackground" font="bold" size={32}>
            Smart Face Scanning
          </Typography>

          <Typography color="onSecondary" font="regular" size={16}>
            AI-powered analysis built for clarity, improvement and confidence
          </Typography>

          <View style={styles.listContainer}>
            {features.map((value, idx) => {
              return (
                <View key={idx} style={styles.listItem}>
                  <Feather
                    name="check-circle"
                    size={24}
                    color={Colors.onBackground}
                  />

                  <Typography color="onMuted" font="regular" size={16}>
                    {value}
                  </Typography>
                </View>
              );
            })}
          </View>
        </View>

        <Button onPress={handleSetupStart}>
          <Typography color="onPrimary" font="bold" size={16}>
            Continue
          </Typography>
        </Button>
      </View>
    </ScreenWrapper>
  );
};

export default FeaturesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
  },

  imageWrapper: {
    width: '100%',
    height: verticalScale(350),
    borderRadius: 56,
    borderCurve: 'continuous',
    alignSelf: 'center',
    overflow: 'hidden',
  },

  image: {
    height: '100%',
    width: '100%',
    aspectRatio: 1,
  },

  listContainer: {
    gap: verticalScale(16),
    paddingVertical: verticalScale(16),
    flex: 1,
  },

  listItem: {
    flexDirection: 'row',
    gap: scale(16),
    alignItems: 'center',
  },
});
