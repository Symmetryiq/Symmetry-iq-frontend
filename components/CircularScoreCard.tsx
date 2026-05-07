import { COLOR, RADIUS, SHADOW, THEME } from '@/constants/theme';
import { verticalScale } from '@/utils/scaling.util';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import CircularProgress from './CircularProgress';
import ThemedText from './ThemedText';

type CircularScoreCardProps = {
  score: number;
  title: string;
  description?: string;
  scoreColor?: string;
  size?: number;
  strokeWidth?: number;
};

const CircularScoreCard = ({
  score,
  title,
  description,
  scoreColor = COLOR.primary,
  size = 150,
  strokeWidth = 10,
}: CircularScoreCardProps) => {
  return (
    <View style={styles.scoreCard}>
      <CircularProgress
        value={score}
        color={scoreColor}
        colorEnd={scoreColor}
        size={size}
        strokeWidth={strokeWidth}
      />

      <View>
        <ThemedText variant="h4" style={styles.textCenter}>
          {title}
        </ThemedText>

        {description && (
          <ThemedText color="onSecondary" style={styles.textCenter}>
            {description}
          </ThemedText>
        )}
      </View>
    </View>
  );
};

export default CircularScoreCard;

const styles = StyleSheet.create({
  scoreCard: {
    backgroundColor: COLOR.card,
    borderWidth: 1,
    borderColor: COLOR.border,
    borderRadius: RADIUS['3xl'],
    gap: verticalScale(8),
    alignItems: 'center',
    justifyContent: 'center',
    padding: THEME.PADDING.card,
    flex: 1,
    boxShadow: SHADOW.lg,
  },

  textCenter: {
    textAlign: 'center',
  },
});
