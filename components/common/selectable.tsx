import { Colors } from '@/constants/theme';
import { scale, verticalScale } from '@/helpers/scale';
import { SelectableProps } from '@/helpers/types';
import { Feather } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  interpolateColor as interpolateColorRN,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Typography from './typography';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.createAnimatedComponent(View);

const Selectable = ({
  selected = false,
  icon,
  label,
  onPress,
}: SelectableProps) => {
  // Animate background and border color for the container
  const bgColor = useSharedValue(selected ? 1 : 0);
  // Animate checkbox scale/fade in
  const checkboxScale = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    bgColor.value = withTiming(selected ? 1 : 0, { duration: 250 });
    checkboxScale.value = withSpring(selected ? 1 : 0, {
      damping: 12,
      stiffness: 140,
      mass: 0.8,
    });
  }, [selected, bgColor, checkboxScale]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColorRN(
        bgColor.value,
        [0, 1],
        [Colors.muted, Colors.primaryLight]
      ),
      borderColor: interpolateColorRN(
        bgColor.value,
        [0, 1],
        [Colors.border, Colors.primary]
      ),
    };
  });

  const animatedCheckStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkboxScale.value }],
    opacity: checkboxScale.value,
  }));

  return (
    <AnimatedPressable
      style={[styles.container, animatedContainerStyle]}
      onPress={onPress}
    >
      <View style={styles.mainWrapper}>
        <View style={styles.contentWrapper}>
          {icon && icon}
          <View style={styles.labelWrapper}>
            <Typography
              color={selected ? 'onPrimary' : 'onSecondary'}
              size={18}
              textProps={{
                numberOfLines: 2,
                ellipsizeMode: 'tail',
              }}
            >
              {label}
            </Typography>
          </View>
        </View>

        <View style={styles.checkboxWrapper}>
          <AnimatedView style={[styles.checkbox, animatedCheckStyle]}>
            {selected && (
              <Feather name="check" size={16} color={Colors.onPrimary} />
            )}
          </AnimatedView>
        </View>
      </View>
    </AnimatedPressable>
  );
};

export default Selectable;

const CHECKBOX_SIZE = scale(24);

const styles = StyleSheet.create({
  container: {
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
    borderWidth: 1,
    borderRadius: 20,
    borderColor: Colors.border,
    backgroundColor: Colors.muted,
    minHeight: scale(52),
    width: '100%',
  },

  containerSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },

  mainWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: scale(12),
  },

  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: scale(8),
    minWidth: 0,
  },

  labelWrapper: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },

  checkboxWrapper: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    minWidth: CHECKBOX_SIZE,
    height: '100%',
  },

  checkbox: {
    width: CHECKBOX_SIZE,
    height: CHECKBOX_SIZE,
    backgroundColor: Colors.primary,
    borderRadius: CHECKBOX_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
});
