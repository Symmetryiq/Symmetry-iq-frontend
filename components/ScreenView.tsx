import { THEME } from '@/constants/theme';
import React from 'react';
import { StyleSheet } from 'react-native';
import {
  SafeAreaView,
  SafeAreaViewProps,
} from 'react-native-safe-area-context';

// TODO - This is a placeholder for the actual ScreenView component

type ScreenViewProps = SafeAreaViewProps & {
  padded?: boolean;
};

const ScreenView = ({ padded = true, ...props }: ScreenViewProps) => {
  return (
    <SafeAreaView
      {...props}
      style={[
        styles.container,
        props.style,
        padded && { padding: THEME.PADDING.screen },
      ]}
    >
      {props.children}
    </SafeAreaView>
  );
};

export default ScreenView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
