import { Colors, Fonts } from '@/constants/theme';
import { scale } from '@/helpers/scale';
import { TypographyProps } from '@/helpers/types';
import React from 'react';
import { Text, TextStyle } from 'react-native';

const Typography = ({
  size = 16,
  color = 'onBackground',
  font = 'regular',
  children,
  style,
  textProps = {},
  center = false,
}: TypographyProps) => {
  const textStyle: TextStyle = {
    fontSize: scale(size),
    color: Colors[color],
    fontFamily: Fonts[font],
    textAlign: center ? 'center' : 'left',
  };

  return (
    <Text style={[textStyle, style]} {...textProps}>
      {children}
    </Text>
  );
};

export default Typography;
