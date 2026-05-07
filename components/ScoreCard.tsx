import { ThemedText } from '@/archives/ui/ThemedText';
import { COLOR, RADIUS } from '@/constants/theme';
import { InfoIcon } from 'phosphor-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type ScoreCardProps = {
  title: string;
  score: number;
};

const ScoreCard = ({ title, score }: ScoreCardProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText variant="bodySmall" color="onCard" style={{ flex: 1 }}>
          {title}
        </ThemedText>

        <InfoIcon size={16} color={COLOR.onCard} />
      </View>

      <View style={styles.scoreWrapper}>
        <ThemedText variant="displayLarge" color="green">
          {score}
        </ThemedText>

        <ThemedText variant="h3" color="onMuted">
          / 100
        </ThemedText>
      </View>

      <View style={styles.progressWrapper}>
        <View style={styles.progressBar} />
      </View>
    </View>
  );
};

export default ScoreCard;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: COLOR.border,
    borderRadius: RADIUS['3xl'],
    backgroundColor: COLOR.card,
    padding: 20,
    gap: 8,
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  scoreWrapper: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },

  progressWrapper: {
    width: '100%',
    height: 12,
    borderRadius: RADIUS.full,
    backgroundColor: COLOR.accent,
  },

  progressBar: {
    width: '60%',
    height: '100%',
    borderRadius: RADIUS.full,
    backgroundColor: COLOR.green,
  },
});
