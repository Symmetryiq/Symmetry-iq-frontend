import { Colors } from '@/constants/theme';
import { LoadingProps } from '@/helpers/types';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const Loading = ({ size = 'large', color = 'primary' }: LoadingProps) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={Colors[color]} />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
