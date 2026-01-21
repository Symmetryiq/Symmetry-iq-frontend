import { Colors } from '@/constants/theme';
import { scale, verticalScale } from '@/helpers/scale';
import { ArrowRightIcon } from 'phosphor-react-native';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Typography from './common/typography';

type ScanCardProps = {
  onPress: () => void;
};

const ScanCard = ({ onPress }: ScanCardProps) => {
  return (
    <View style={styles.scanCardContainer}>
      <View style={styles.scanCardImageWrapper}>
        <Image
          source={require('@/assets/images/face-capture.jpg')}
          style={styles.scanCardImage}
        />
      </View>

      <View style={styles.scanCardContentWrapper}>
        <View>
          <Typography size={24} font="semiBold" color="onCard">
            Scan Your Face
          </Typography>
          <Typography color="onSecondary">
            It&apos;s time for a scan, Debloat your face now!
          </Typography>
        </View>

        <Pressable style={styles.scanCardButton} onPress={onPress}>
          <Typography>Scan Now</Typography>

          <ArrowRightIcon size={16} color={Colors.onPrimary} />
        </Pressable>
      </View>
    </View>
  );
};

export default ScanCard;

const styles = StyleSheet.create({
  scanCardContainer: {
    padding: scale(16),
    gap: verticalScale(8),
    borderRadius: verticalScale(28),
    backgroundColor: Colors.card,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  scanCardImageWrapper: {
    width: scale(140),
    aspectRatio: 1,
    borderRadius: verticalScale(28),
    overflow: 'hidden',
  },

  scanCardImage: {
    height: '100%',
    width: '100%',
  },

  scanCardContentWrapper: {
    gap: verticalScale(16),
    width: '50%',
  },

  scanCardButton: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    gap: scale(8),
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: verticalScale(16),
    alignItems: 'center',
  },
});
