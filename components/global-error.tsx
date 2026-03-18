import React from 'react';
import ErrorState from './common/error-state';
import { View } from 'react-native';
import { Colors } from '@/constants/theme';

export function GlobalError({ error, retry }: { error: Error; retry: () => Promise<void> | void }) {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <ErrorState 
        title="Unexpected Error" 
        message={__DEV__ ? error.message : "Something went wrong. Please try again."} 
        onRetry={retry} 
      />
    </View>
  );
}
