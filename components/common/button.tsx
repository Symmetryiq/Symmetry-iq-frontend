import { Colors } from '@/constants/theme';
import { scale, verticalScale } from '@/helpers/scale';
import { ButtonProps } from '@/helpers/types';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

const Button = ({
  style,
  onPress,
  loading = false,
  disabled = false,
  children,
}: ButtonProps) => {
  // if (loading) {
  //   return (
  //     <View style={[styles.button, style, { backgroundColor: 'transparent' }]}>
  //       <Loading />
  //     </View>
  //   );
  // }

  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, style, disabled && styles.disabledState]}
      disabled={disabled}
    >
      {children}
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 200,
    borderCurve: 'continuous',
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
    justifyContent: 'center',
    alignItems: 'center',
  },

  disabledState: {
    opacity: 0.5,
  },
});

// import { Colors, Fonts } from '@/constants/theme';
// import React, { ReactNode } from 'react';
// import {
//   Pressable,
//   PressableStateCallbackType,
//   StyleProp,
//   StyleSheet,
//   Text,
//   TextStyle,
//   View,
//   ViewStyle,
// } from 'react-native';

// type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
// type ButtonSize = 'sm' | 'md' | 'lg';

// export interface ButtonProps {
//   label?: string;
//   onPress?: () => void;
//   disabled?: boolean;

//   /** Variant & sizing */
//   variant?: ButtonVariant;
//   size?: ButtonSize;

//   /** Icon support */
//   leadingIcon?: ReactNode;
//   trailingIcon?: ReactNode;
//   iconOnly?: boolean;

//   /** Full override */
//   children?: ReactNode;

//   /** Styling overrides */
//   containerStyle?: StyleProp<ViewStyle>;
//   labelStyle?: StyleProp<TextStyle>;
//   pressedStyle?: StyleProp<ViewStyle>;
//   disabledStyle?: StyleProp<ViewStyle>;

//   /** Accessibility */
//   accessibilityLabel?: string;
//   hitSlop?: number;

//   /** Advanced Pressable control */
//   pressableStyle?: (state: PressableStateCallbackType) => StyleProp<ViewStyle>;
// }

// export const Button: React.FC<ButtonProps> = ({
//   label,
//   onPress,
//   disabled = false,
//   variant = 'primary',
//   size = 'md',
//   leadingIcon,
//   trailingIcon,
//   iconOnly = false,
//   children,
//   containerStyle,
//   labelStyle,
//   pressedStyle,
//   disabledStyle,
//   accessibilityLabel,
//   hitSlop = 8,
//   pressableStyle,
// }) => {
//   const isIconOnly = iconOnly || (!!children && !label);

//   return (
//     <Pressable
//       onPress={onPress}
//       disabled={disabled}
//       hitSlop={hitSlop}
//       accessibilityRole="button"
//       accessibilityLabel={accessibilityLabel || label}
//       style={(state) => [
//         styles.base,
//         stylesByVariant[variant],
//         stylesBySize[size],
//         isIconOnly && styles.iconOnly,
//         state.pressed && styles.pressed,
//         state.pressed && pressedStyle,
//         disabled && styles.disabled,
//         disabled && disabledStyle,
//         typeof pressableStyle === 'function' && pressableStyle(state),
//         containerStyle,
//       ]}
//     >
//       {children ? (
//         children
//       ) : (
//         <View style={styles.content}>
//           {leadingIcon && <View style={styles.icon}>{leadingIcon}</View>}

//           {!iconOnly && label && (
//             <Text
//               style={[styles.label, labelStylesByVariant[variant], labelStyle]}
//               numberOfLines={1}
//             >
//               {label}
//             </Text>
//           )}

//           {trailingIcon && <View style={styles.icon}>{trailingIcon}</View>}
//         </View>
//       )}
//     </Pressable>
//   );
// };

// const styles = StyleSheet.create({
//   base: {
//     borderRadius: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'row',
//   },

//   content: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },

//   icon: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   label: {
//     fontSize: 16,
//     fontFamily: Fonts.semiBold,
//   },

//   pressed: {
//     opacity: 0.85,
//   },

//   disabled: {
//     opacity: 0.5,
//   },

//   iconOnly: {
//     paddingHorizontal: 16,
//   },
// });

// const stylesByVariant = StyleSheet.create({
//   primary: {
//     backgroundColor: Colors.primary,
//   },
//   secondary: {
//     backgroundColor: Colors.secondary,
//   },
//   outline: {
//     borderWidth: 1,
//     borderColor: Colors.border,
//     backgroundColor: 'transparent',
//   },
//   ghost: {
//     backgroundColor: 'transparent',
//   },
//   danger: {
//     backgroundColor: Colors.danger,
//   },
// });

// const labelStylesByVariant = StyleSheet.create({
//   primary: { color: Colors.onPrimary },
//   secondary: { color: Colors.onSecondary },
//   outline: { color: Colors.onBackground },
//   ghost: { color: Colors.primary },
//   danger: { color: Colors.onState },
// });

// const stylesBySize = StyleSheet.create({
//   sm: {
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//   },
//   md: {
//     paddingVertical: 16,
//     paddingHorizontal: 24,
//   },
//   lg: {
//     paddingVertical: 16,
//     paddingHorizontal: 32,
//   },
// });
