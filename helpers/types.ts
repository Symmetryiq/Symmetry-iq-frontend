import { Colors, Fonts } from '@/constants/theme';
import React from 'react';
import {
  ActivityIndicatorProps,
  PressableProps,
  StyleProp,
  TextInput,
  TextInputProps,
  TextProps,
  TextStyle,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { SafeAreaViewProps } from 'react-native-safe-area-context';

export interface IconProps {
  size?: number;
  color?: string;
}

export interface ScreenWrapperProps extends SafeAreaViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  isModal?: boolean;
}

export interface TypographyProps {
  size?: number;
  color?: keyof typeof Colors;
  font?: keyof typeof Fonts;
  center?: boolean;
  children: any | null;
  style?: StyleProp<TextStyle>;
  textProps?: TextProps;
}

export interface LoadingProps {
  size?: ActivityIndicatorProps['size'];
  color?: keyof typeof Colors;
}

export interface ButtonProps extends PressableProps {
  style?: ViewStyle;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

export interface InputProps extends TextInputProps {
  icon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  inputRef?: React.RefObject<TextInput>;
}

export interface SelectableProps extends ViewProps {
  selected?: boolean;
  icon?: React.ReactNode;
  label: string;
  onPress?: () => void;
}
