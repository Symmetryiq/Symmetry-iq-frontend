import { Colors, Fonts } from '@/constants/theme';
import { moderateScale } from '@/helpers/scaling';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { Text } from './Text';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  /** Image source — URI string or require() */
  source?: string | number;
  /** Fallback initials (1–2 chars) */
  initials?: string;
  /** Size preset */
  size?: AvatarSize;
  /** Border width for status rings */
  borderWidth?: number;
  /** Border color */
  borderColor?: string;
  /** Custom background color for initials */
  backgroundColor?: string;
  /** Additional style */
  style?: ViewStyle;
}

const sizeMap: Record<AvatarSize, number> = {
  xs: moderateScale(28),
  sm: moderateScale(36),
  md: moderateScale(44),
  lg: moderateScale(56),
  xl: moderateScale(72),
};

const fontSizeMap: Record<AvatarSize, number> = {
  xs: moderateScale(8),
  sm: moderateScale(10),
  md: moderateScale(14),
  lg: moderateScale(18),
  xl: moderateScale(24),
};

export function Avatar({
  source,
  initials,
  size = 'md',
  borderWidth = 0,
  borderColor = Colors.primary,
  backgroundColor = Colors.secondary,
  style,
}: AvatarProps) {
  const dim = sizeMap[size];

  const containerStyle: ViewStyle = {
    width: dim,
    height: dim,
    borderRadius: dim / 2,
    borderWidth,
    borderColor,
    backgroundColor,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  };

  if (source) {
    const imageSource = typeof source === 'string' ? { uri: source } : source;
    return (
      <View style={[containerStyle, style]}>
        <Image
          source={imageSource}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      </View>
    );
  }

  return (
    <View style={[containerStyle, style]}>
      <Text
        variant="button"
        color={Colors.onSecondary}
        style={{ fontSize: fontSizeMap[size], fontFamily: Fonts.semiBold }}
      >
        {(initials ?? '?').toUpperCase().slice(0, 2)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
});
