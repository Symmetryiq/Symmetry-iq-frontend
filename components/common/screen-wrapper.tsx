import { ScreenWrapperProps } from '@/helpers/types';
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ScreenWrapper = (props: ScreenWrapperProps) => {
  return (
    <SafeAreaView style={[props.style, { flex: 1 }]} {...props}>
      <StatusBar barStyle={'light-content'} backgroundColor={'transparent'} />
      {props.children}
    </SafeAreaView>
  );
};

export default ScreenWrapper;
