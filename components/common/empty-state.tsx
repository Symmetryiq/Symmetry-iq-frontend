import { scale, verticalScale } from '@/helpers/scaling';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Button from './button';
import Typography from './typography';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Typography size={20} font="bold" color="onBackground" style={styles.title}>
        {title}
      </Typography>
      <Typography size={16} color="onSecondary" style={styles.description}>
        {description}
      </Typography>
      {actionLabel && onAction && (
        <Button onPress={onAction} style={styles.button}>
          <Typography font="semiBold">{actionLabel}</Typography>
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
    opacity: 0.8,
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    marginTop: verticalScale(8),
    minWidth: '50%',
  },
});

export default EmptyState;
