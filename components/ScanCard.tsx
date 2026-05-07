import { COLOR, RADIUS, SHADOW } from '@/constants/theme';
import { navigateTo } from '@/utils/router.util';
import { verticalScale } from '@/utils/scaling.util';
import { Image } from 'expo-image';
import { ArrowRightIcon } from 'phosphor-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Button from './Button';
import ThemedText from './ThemedText';

const ScanCard = () => {
  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image
          source={require('@/assets/images/scan.jpg')}
          style={styles.image}
          contentFit="cover"
        />
      </View>

      <View style={styles.contentContainer}>
        <View style={{ gap: verticalScale(4) }}>
          <ThemedText variant="h3">Scan your face</ThemedText>
          <ThemedText variant="bodySmall" numberOfLines={3}>
            Get a detailed analysis of your face health and receive personalized
            routines.
          </ThemedText>
        </View>

        <Button
          title="Scan Now"
          size="sm"
          iconPosition="right"
          icon={ArrowRightIcon}
          onPress={() => navigateTo('/(app)/(tabs)/scan')}
        />
      </View>
    </View>
  );
};

export default ScanCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: verticalScale(16),
    borderRadius: RADIUS['3xl'],
    backgroundColor: COLOR.card,
    boxShadow: SHADOW.md,
    gap: verticalScale(16),
  },

  imageWrapper: {
    height: verticalScale(110),
    aspectRatio: 1,
    borderRadius: RADIUS['3xl'],
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  contentContainer: {
    flex: 1,
    gap: verticalScale(8),
  },
});
