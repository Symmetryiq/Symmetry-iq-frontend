import { COLOR, FONT, RADIUS, SHADOW, TEXT } from '@/constants/theme';
import { ScanRecord } from '@/hooks/useScanStore';
import { FeatureID } from '@/types/feature.types';
import { getScoreColor, getSortedFeatureScores } from '@/utils/feature.util';
import { navigateTo } from '@/utils/router.util';
import { verticalScale } from '@/utils/scaling.util';
import { Image } from 'expo-image';
import { ArrowRightIcon } from 'phosphor-react-native';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import ThemedText from './ThemedText';

/* ─── Types ────────────────────────────────────────────────── */

type ResultCardProps = {
  scan: ScanRecord;
};

type ScoreRowProps = {
  title: string;
  score: number;
  featureId: FeatureID;
};

function ScoreRow({ title, score, featureId }: ScoreRowProps) {
  const color = getScoreColor(featureId, score);

  return (
    <View style={styles.scoreRow}>
      <View style={styles.scoreHeader}>
        <ThemedText variant="label" style={styles.scoreTitle} numberOfLines={1}>
          {title}
        </ThemedText>
        <ThemedText style={[styles.scoreValue, { color }]}>{score}%</ThemedText>
      </View>

      <View style={styles.barTrack}>
        <View
          style={[
            styles.barFill,
            { width: `${Math.min(score, 100)}%`, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
}

/* ─── Main component ───────────────────────────────────────── */

const IMAGE_SIZE = verticalScale(110);

const ResultCard = ({ scan }: ResultCardProps) => {
  const { scores, imageUri, createdAt, id } = scan;

  /* Pick 2 features to highlight: best + worst (by normalized score) */
  const highlights = useMemo(() => {
    const sorted = getSortedFeatureScores(scores);
    if (sorted.length < 2) return sorted;
    return [sorted[0], sorted[sorted.length - 1]];
  }, [scores]);

  const dateLabel = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  });

  const handleSeeMore = () => {
    navigateTo(`/score/${id}` as any);
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={handleSeeMore}
    >
      {/* Left: Photo with scan corners */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          contentFit="cover"
        />
      </View>

      {/* Right: Scores + See More */}
      <View style={styles.contentContainer}>
        <ThemedText variant="caption" color="onMuted">
          {dateLabel}
        </ThemedText>

        <View style={styles.scoresContainer}>
          {highlights.map((f) => (
            <ScoreRow
              key={f.id}
              featureId={f.id}
              title={f.title}
              score={f.rawScore}
            />
          ))}
        </View>

        <View style={styles.seeMoreRow}>
          <ThemedText variant="label" color="onSecondary">
            See More
          </ThemedText>
          <ArrowRightIcon size={14} color={COLOR.onSecondary} weight="bold" />
        </View>
      </View>
    </Pressable>
  );
};

export default ResultCard;

/* ─── Styles ───────────────────────────────────────────────── */

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: verticalScale(14),
    borderRadius: RADIUS['3xl'],
    backgroundColor: COLOR.card,
    boxShadow: SHADOW.md,
    gap: verticalScale(14),
  },

  pressed: {
    opacity: 0.9,
  },

  /* ── Image ── */

  imageWrapper: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: RADIUS['2xl'],
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  /* ── Content ── */

  contentContainer: {
    flex: 1,
    gap: verticalScale(6),
  },

  dateText: {
    fontFamily: FONT.medium,
    fontStyle: 'italic',
  },

  scoresContainer: {
    gap: verticalScale(8),
  },

  /* ── Score row ── */

  scoreRow: {
    gap: verticalScale(3),
  },

  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  scoreTitle: {
    flex: 1,
    marginRight: 4,
  },

  scoreValue: {
    ...TEXT.label,
    fontFamily: FONT.bold,
  },

  barTrack: {
    height: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLOR.muted,
    overflow: 'hidden',
  },

  barFill: {
    height: '100%',
    borderRadius: RADIUS.full,
  },

  /* ── See More ── */

  seeMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: verticalScale(2),
  },
});
