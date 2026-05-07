import { COLOR, TEXT } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

type ThemedTextProps = TextProps & {
  variant?: keyof typeof TEXT;
  color?: keyof typeof COLOR;
};

const ThemedText = ({ variant, color, ...rest }: ThemedTextProps) => {
  const textStyle = variant ? TEXT[variant] : TEXT.body;
  const colorStyle = color
    ? { color: COLOR[color] }
    : { color: COLOR.onBackground };

  return (
    <Text {...rest} style={[textStyle, colorStyle, rest.style]}>
      {rest.children}
    </Text>
  );
};

export default ThemedText;

const styles = StyleSheet.create({});
