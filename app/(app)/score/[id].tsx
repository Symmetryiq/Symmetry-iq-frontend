import Button from '@/components/Button';
import ScreenView from '@/components/ScreenView';
import ThemedText from '@/components/ThemedText';
import { FEATURES } from '@/constants/features';
import { COLOR, FONT, RADIUS, SHADOW, SPACE, TEXT, THEME } from '@/constants/theme';
import { useScanStore } from '@/hooks/useScanStore';
import { Feature, FeatureID } from '@/types/feature.types';
import {
  getScoreColor,
  getScoreLabel,
  normalizeScore,
} from '@/utils/feature.util';
import { goBack } from '@/utils/router.util';
import { useLocalSearchParams } from 'expo-router';
import {
  ArrowLeftIcon,
  InfoIcon,
  SparkleIcon,
  XIcon,
} from 'phosphor-react-native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

/* ─── Constants ────────────────────────────────────────────── */

const CARDS_PER_PAGE = 6;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PAGE_WIDTH = SCREEN_WIDTH - THEME.PADDING.screen * 2;

function buildPages(features: Feature[]): Feature[][] {
  const pages: Feature[][] = [];
  for (let i = 0; i < features.length; i += CARDS_PER_PAGE) {
    pages.push(features.slice(i, i + CARDS_PER_PAGE));
  }
  return pages;
}

const PAGES = buildPages(FEATURES);

/* ─── Sub-components ───────────────────────────────────────── */

type ScoreCardProps = {
  featureId: FeatureID;
  title: string;
  score: number;
  polarity: 'higher' | 'lower';
  onInfoPress: () => void;
};

function ScoreCard({
  featureId,
  title,
  score,
  polarity,
  onInfoPress,
}: ScoreCardProps) {
  const normalized = normalizeScore(score, polarity);
  const color = getScoreColor(featureId, score);
  const label = getScoreLabel(featureId, score);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <ThemedText variant="body" style={styles.cardTitle} numberOfLines={1}>
          {title}
        </ThemedText>
        <Pressable onPress={onInfoPress} hitSlop={6}>
          <InfoIcon color={COLOR.onMuted} size={18} />
        </Pressable>
      </View>

      <ThemedText style={[TEXT.h1, { color }]}>{score}%</ThemedText>

      <View style={styles.barTrack}>
        <View
          style={[
            styles.barFill,
            { width: `${normalized}%`, backgroundColor: color },
          ]}
        />
      </View>

      <ThemedText style={[styles.scoreLabel, { color }]}>{label}</ThemedText>
    </View>
  );
}

type FeatureModalProps = {
  feature: Feature | null;
  visible: boolean;
  onClose: () => void;
};

function FeatureInfoModal({ feature, visible, onClose }: FeatureModalProps) {
  if (!feature) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <ThemedText variant="h3">{feature.title}</ThemedText>
            <Pressable onPress={onClose} hitSlop={8}>
              <XIcon color={COLOR.onSecondary} size={22} />
            </Pressable>
          </View>

          <ThemedText color="onSecondary" style={styles.modalBody}>
            {feature.description}
          </ThemedText>

          <View style={styles.modalMeta}>
            <View style={styles.metaItem}>
              <ThemedText variant="caption" color="onMuted">
                Goal
              </ThemedText>
              <ThemedText variant="bodyLarge" style={styles.metaValue}>
                {feature.goal}
                {feature.polarity === 'lower' ? ' or below' : '+'}
              </ThemedText>
            </View>
            <View style={styles.metaItem}>
              <ThemedText variant="caption" color="onMuted">
                Direction
              </ThemedText>
              <ThemedText variant="bodyLarge" style={styles.metaValue}>
                {feature.polarity === 'higher'
                  ? '↑ Higher is better'
                  : '↓ Lower is better'}
              </ThemedText>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

type PageDotsProps = {
  total: number;
  active: number;
  onDotPress: (index: number) => void;
};

function PageDots({ total, active, onDotPress }: PageDotsProps) {
  return (
    <View style={styles.dotsRow}>
      {Array.from({ length: total }, (_, i) => (
        <Pressable key={i} onPress={() => onDotPress(i)} hitSlop={8}>
          <View style={[styles.dot, i === active && styles.dotActive]} />
        </Pressable>
      ))}
    </View>
  );
}

/* ─── Main screen ──────────────────────────────────────────── */

/**
 * Score screen — displays a full scan report.
 *
 * Route: /score/[id]
 *   - id = "current"  → shows the latest scan (currentScan)
 *   - id = scan_xxx   → looks up a specific scan from history
 */
const ScoreScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const currentScan = useScanStore((s) => s.currentScan);
  const history = useScanStore((s) => s.history);

  const scan = useMemo(() => {
    if (id === 'current') return currentScan;
    return history.find((s) => s.id === id) ?? null;
  }, [id, currentScan, history]);

  const [activePage, setActivePage] = useState(0);
  const [modalFeature, setModalFeature] = useState<Feature | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / PAGE_WIDTH);
    setActivePage(index);
  }, []);

  const goToPage = useCallback((index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
  }, []);

  const openFeatureInfo = useCallback((featureId: FeatureID) => {
    const feature = FEATURES.find((f) => f.id === featureId) ?? null;
    setModalFeature(feature);
  }, []);

  const closeFeatureInfo = useCallback(() => setModalFeature(null), []);

  /* ── Empty state ── */
  if (!scan) {
    return (
      <ScreenView style={styles.emptyContainer}>
        <ThemedText variant="h2">No Scan Found</ThemedText>
        <ThemedText color="onSecondary" style={styles.emptyText}>
          This scan could not be found. Try scanning again.
        </ThemedText>
        <Button title="Go Back" variant="primary" onPress={goBack} />
      </ScreenView>
    );
  }

  /* ── Derive score data ── */
  const { scores, imageUri } = scan;
  const overallScore = scores.overall_symmetry;
  const overallColor = getScoreColor('overall_symmetry', overallScore);

  const scanDate = new Date(scan.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <ScreenView style={styles.container}>
      {/* Back button */}
      <Pressable style={styles.backButton} onPress={goBack} hitSlop={8}>
        <ArrowLeftIcon color={COLOR.onBackground} size={22} />
      </Pressable>

      {/* Hero: photo + overall score */}
      <View style={styles.heroSection}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: imageUri }} style={styles.heroImage} />
        </View>

        <View style={styles.overallBadge}>
          <SparkleIcon color={overallColor} size={18} weight="fill" />
          <ThemedText style={[styles.overallScore, { color: overallColor }]}>
            {overallScore}
          </ThemedText>
        </View>

        <ThemedText variant="h2" style={styles.heroTitle}>
          Your Scan Results
        </ThemedText>
        <ThemedText color="onMuted" style={styles.heroDate}>
          {scanDate}
        </ThemedText>
        <ThemedText color="onSecondary" style={styles.heroSubtitle}>
          Swipe to explore all 10 feature scores.
        </ThemedText>
      </View>

      {/* Feature score cards — pager */}
      <View style={styles.pagerWrapper}>
        <FlatList
          ref={flatListRef}
          data={PAGES}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={PAGE_WIDTH}
          decelerationRate="fast"
          onScroll={onScroll}
          scrollEventThrottle={16}
          renderItem={({ item: page }) => (
            <View style={[styles.grid, { width: PAGE_WIDTH }]}>
              {page.map((feature: Feature) => (
                <ScoreCard
                  key={feature.id}
                  featureId={feature.id}
                  title={feature.title}
                  score={scores[feature.id]}
                  polarity={feature.polarity}
                  onInfoPress={() => openFeatureInfo(feature.id)}
                />
              ))}
            </View>
          )}
        />

        <PageDots
          total={PAGES.length}
          active={activePage}
          onDotPress={goToPage}
        />
      </View>

      {/* CTA */}
      <Button title="Done" variant="primary" onPress={goBack} />

      <FeatureInfoModal
        feature={modalFeature}
        visible={modalFeature !== null}
        onClose={closeFeatureInfo}
      />
    </ScreenView>
  );
};

export default ScoreScreen;

/* ─── Styles ───────────────────────────────────────────────── */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
  },

  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },

  emptyText: {
    textAlign: 'center',
    maxWidth: 260,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLOR.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  heroSection: {
    alignItems: 'center',
    gap: 6,
  },

  imageWrapper: {
    width: 96,
    height: 96,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLOR.primaryLight,
    boxShadow: SHADOW.primary,
  },

  heroImage: {
    width: '100%',
    height: '100%',
  },

  overallBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE.xs,
    borderRadius: RADIUS.full,
    backgroundColor: COLOR.secondary,
    marginTop: SPACE.xs,
  },

  overallScore: {
    ...TEXT.h3,
    fontFamily: FONT.bold,
  },

  heroTitle: {
    textAlign: 'center',
  },

  heroDate: {
    ...TEXT.caption,
    textAlign: 'center',
  },

  heroSubtitle: {
    textAlign: 'center',
    maxWidth: 280,
    ...TEXT.caption,
  },

  pagerWrapper: {
    flex: 1,
    gap: 12,
  },

  pager: {
    flex: 1,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    width: '100%',
  },

  card: {
    width: '48%',
    backgroundColor: COLOR.card,
    borderRadius: RADIUS.xl,
    padding: SPACE.lg,
    gap: 6,
    overflow: 'hidden',
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cardTitle: {
    flex: 1,
    marginRight: SPACE.xs,
  },

  scoreLabel: {
    ...TEXT.caption,
    fontFamily: FONT.medium,
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

  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLOR.muted,
  },

  dotActive: {
    backgroundColor: COLOR.primaryLight,
    width: 24,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACE.xl,
  },

  modalCard: {
    width: '100%',
    backgroundColor: COLOR.card,
    borderRadius: RADIUS['2xl'],
    padding: SPACE.xl,
    gap: 16,
    boxShadow: SHADOW.xl,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  modalBody: {
    lineHeight: 22,
  },

  modalMeta: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: SPACE.sm,
    borderTopWidth: 1,
    borderTopColor: COLOR.border,
  },

  metaItem: {
    flex: 1,
    gap: 2,
  },

  metaValue: {
    fontFamily: FONT.semiBold,
    color: COLOR.onBackground,
  },
});
