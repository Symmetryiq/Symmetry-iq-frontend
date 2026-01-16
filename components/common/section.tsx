import { scale } from '@/helpers/scale';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

type SectionProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

const Section = ({ children, style }: SectionProps) => {
  return <View style={[styles.sectionContainer, style]}>{children}</View>;
};

export default Section;

const styles = StyleSheet.create({
  sectionContainer: {
    marginHorizontal: scale(16),
    gap: scale(8),
  },
});
