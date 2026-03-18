import { Colors } from '@/constants/theme';
import { scale, verticalScale } from '@/helpers/scaling';
import { WarningCircle } from 'phosphor-react-native';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Button from './button';
import Typography from './typography';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  style?: ViewStyle;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        <WarningCircle size={scale(48)} color={Colors.danger} weight="fill" />
      </View>
      <Typography size={22} font="bold" color="onBackground" style={styles.title}>
        {title}
      </Typography>
      <Typography size={16} color="onSecondary" style={styles.message}>
        {message}
      </Typography>
      {onRetry && (
        <Button onPress={onRetry} style={styles.button}>
          <Typography font="semiBold">Try Again</Typography>
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(24),
    gap: verticalScale(16),
  },
  iconContainer: {
    marginBottom: verticalScale(8),
    padding: scale(16),
    backgroundColor: `${Colors.danger}15`,
    borderRadius: scale(32),
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    marginTop: verticalScale(16),
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: '50%',
  },
});

export default ErrorState;
