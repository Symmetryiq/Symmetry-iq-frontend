import CircularScoreCard from '@/components/CircularScoreCard';
import DateSelector from '@/components/DateSelector';
import Header from '@/components/Header';
import RoutineCard from '@/components/RoutineCard';
import ScreenView from '@/components/ScreenView';
import ThemedText from '@/components/ThemedText';
import { COLOR, RADIUS, SHADOW, THEME } from '@/constants/theme';
import { TIPS } from '@/constants/tips';
import { usePlanStore } from '@/hooks/usePlanStore';
import { useRoutineStore } from '@/hooks/useRoutineStore';
import {
  getScanDates,
  getScanForDate,
  toDateKey,
  useScanStore,
} from '@/hooks/useScanStore';
import { RoutineID } from '@/types/routine.types';
import {
  FeatureScore,
  getScoreColor,
  getSortedFeatureScores,
} from '@/utils/feature.util';
import { getTodaysPlan } from '@/utils/planner.util';
import { verticalScale } from '@/utils/scaling.util';
import { useRouter } from 'expo-router';
import { CheckCircleIcon } from 'phosphor-react-native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = 12;
const PEEK = 24;
const CARD_WIDTH = SCREEN_WIDTH - THEME.PADDING.screen * 2 - PEEK;
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;

const ScoreCarousel = ({ data }: { data: FeatureScore[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SNAP_INTERVAL);
    setActiveIndex(index);
  }, []);

  const renderScoreCard = useCallback(
    ({ item }: { item: FeatureScore }) => (
      <View style={styles.carouselCard}>
        <CircularScoreCard
          score={item.rawScore}
          title={item.title}
          scoreColor={item.color}
        />
      </View>
    ),
    [],
  );

  return (
    <>
      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderScoreCard}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={SNAP_INTERVAL}
        decelerationRate="fast"
        contentContainerStyle={styles.carouselList}
        onScroll={onScroll}
        scrollEventThrottle={16}
      />

      {data.length > 1 && (
        <View style={styles.dots}>
          {data.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === activeIndex && styles.dotActive]}
            />
          ))}
        </View>
      )}
    </>
  );
};

const InsightScreen = () => {
  const router = useRouter();
  const history = useScanStore((s) => s.history);
  const currentScan = useScanStore((s) => s.currentScan);
  const plan = usePlanStore((s) => s.plan);
  const completions = useRoutineStore((s) => s.completions);

  const scanDates = useMemo(() => getScanDates(history), [history]);

  const [selectedScan, setSelectedScan] = useState(currentScan);

  const handleDateChange = useCallback(
    (date: Date) => {
      const key = toDateKey(date);
      const scan = getScanForDate(history, key);
      setSelectedScan(scan);
    },
    [history],
  );

  const scores = selectedScan?.scores;

  const overallScore = scores?.overall_symmetry ?? 0;
  const overallColor = scores
    ? getScoreColor('overall_symmetry', overallScore)
    : COLOR.primary;

  const { bestFeatures, needsImprovement } = useMemo(() => {
    if (!scores) return { bestFeatures: [], needsImprovement: [] };
    const sorted = getSortedFeatureScores(scores);
    return {
      bestFeatures: sorted.filter((f) => f.normalizedScore >= 75),
      needsImprovement: sorted.filter((f) => f.normalizedScore < 75).reverse(),
    };
  }, [scores]);

  /* ── Available (non-completed) routines from today's plan ── */
  const todayKey = useMemo(() => toDateKey(new Date()), []);

  const availableRoutines = useMemo(() => {
    if (!plan) return [];
    const todayPlan = getTodaysPlan(plan);
    if (!todayPlan) return [];

    const allRoutines: RoutineID[] = [todayPlan.main, ...todayPlan.bonus];
    const todayCompletions = completions[todayKey] ?? [];

    return allRoutines.filter((id) => !todayCompletions.includes(id));
  }, [plan, completions, todayKey]);

  const allRoutinesCompleted = useMemo(() => {
    if (!plan) return false;
    const todayPlan = getTodaysPlan(plan);
    if (!todayPlan) return false;
    const allRoutines: RoutineID[] = [todayPlan.main, ...todayPlan.bonus];
    const todayCompletions = completions[todayKey] ?? [];
    return allRoutines.every((id) => todayCompletions.includes(id));
  }, [plan, completions, todayKey]);

  /* ── Routine carousel ── */
  const [routineIndex, setRoutineIndex] = useState(0);
  const routineListRef = useRef<FlatList>(null);

  const onRoutineScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(e.nativeEvent.contentOffset.x / SNAP_INTERVAL);
      setRoutineIndex(index);
    },
    [],
  );

  const renderRoutineCard = useCallback(
    ({ item }: { item: RoutineID }) => (
      <View style={styles.carouselCard}>
        <RoutineCard routineId={item} />
      </View>
    ),
    [],
  );

  return (
    <ScreenView edges={['top', 'left', 'right']} padded={false}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Header />

        <DateSelector
          onDateChange={handleDateChange}
          availableDates={scanDates}
        />

        {selectedScan ? (
          <>
            <View>
              <ThemedText variant="h2">Your Facial Report</ThemedText>
              <ThemedText color="onSecondary">
                A personalized facial balance summary, with areas to celebrate
                and recommendations to improve.
              </ThemedText>
            </View>

            <CircularScoreCard
              score={overallScore}
              title="Overall Symmetry"
              scoreColor={overallColor}
              description="Your overall facial symmetry score based on all measured features."
            />

            {bestFeatures.length > 0 && (
              <View style={styles.section}>
                <ThemedText variant="h2">Best Features</ThemedText>
                <ScoreCarousel data={bestFeatures} />
              </View>
            )}

            {needsImprovement.length > 0 && (
              <View style={styles.section}>
                <ThemedText variant="h2">Needs Improvement</ThemedText>
                <ScoreCarousel data={needsImprovement} />
              </View>
            )}

            <View style={styles.section}>
              <View>
                <ThemedText variant="h2" style={{ textAlign: 'center' }}>
                  How can you improve?
                </ThemedText>
                <ThemedText color="onSecondary" style={{ textAlign: 'center' }}>
                  Based on your report, here are the routines picked to help you
                  improve your overall symmetry.
                </ThemedText>
              </View>

              {allRoutinesCompleted ? (
                <View style={styles.allDoneCard}>
                  <CheckCircleIcon
                    color={COLOR.green}
                    size={32}
                    weight="fill"
                  />
                  <ThemedText variant="h4" style={{ color: COLOR.green }}>
                    All Routines Completed!
                  </ThemedText>
                  <ThemedText
                    variant="bodySmall"
                    color="onSecondary"
                    style={{ textAlign: 'center' }}
                  >
                    Great job! You've finished all your routines for today.
                    Check back tomorrow for new ones.
                  </ThemedText>
                </View>
              ) : availableRoutines.length > 0 ? (
                <>
                  <FlatList
                    ref={routineListRef}
                    data={availableRoutines}
                    keyExtractor={(item) => item}
                    renderItem={renderRoutineCard}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={SNAP_INTERVAL}
                    decelerationRate="fast"
                    contentContainerStyle={styles.carouselList}
                    onScroll={onRoutineScroll}
                    scrollEventThrottle={16}
                  />

                  {availableRoutines.length > 1 && (
                    <View style={styles.dots}>
                      {availableRoutines.map((_, i) => (
                        <View
                          key={i}
                          style={[
                            styles.dot,
                            i === routineIndex && styles.dotActive,
                          ]}
                        />
                      ))}
                    </View>
                  )}
                </>
              ) : null}
            </View>

            <View style={styles.section}>
              <ThemedText variant="h2">Tips to Improve</ThemedText>

              <View style={styles.tipsGrid}>
                {TIPS.map((tip) => (
                  <Pressable
                    key={tip.id}
                    style={styles.tipCard}
                    onPress={() =>
                      router.push({
                        pathname: '/tip/[id]',
                        params: { id: tip.id },
                      })
                    }
                  >
                    <ThemedText style={styles.tipIcon}>{tip.icon}</ThemedText>
                    <ThemedText variant="label" style={styles.tipTitle}>
                      {tip.title}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>

            <ThemedText
              variant="badge"
              color="onMuted"
              style={{ textAlign: 'center' }}
            >
              This report is an overview generated by our facial symmetry model,
              and may not represent medical standards. For best results, combine
              routines and track your progress every week!
            </ThemedText>
          </>
        ) : (
          <View style={styles.emptyState}>
            <ThemedText variant="h3" style={styles.emptyTitle}>
              No Scan Data
            </ThemedText>
            <ThemedText color="onSecondary" style={styles.emptyText}>
              There is no scan data available for this date. Complete a scan to
              see your facial report.
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </ScreenView>
  );
};

export default InsightScreen;

const styles = StyleSheet.create({
  container: {
    gap: verticalScale(20),
    paddingHorizontal: THEME.PADDING.screen,
    paddingBottom: THEME.PADDING.screen,
  },

  section: {
    gap: verticalScale(12),
  },

  carouselList: {
    gap: CARD_GAP,
  },

  carouselCard: {
    width: CARD_WIDTH,
  },

  dots: {
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
    backgroundColor: COLOR.primary,
    width: 24,
  },

  allDoneCard: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: verticalScale(8),
    paddingVertical: verticalScale(32),
    paddingHorizontal: THEME.PADDING.screen,
    backgroundColor: COLOR.card,
    borderRadius: RADIUS['3xl'],
    borderWidth: 1,
    borderColor: COLOR.border,
    boxShadow: SHADOW.sm,
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(60),
    gap: verticalScale(8),
  },

  emptyTitle: {
    textAlign: 'center',
  },

  emptyText: {
    textAlign: 'center',
    paddingHorizontal: THEME.PADDING.screen,
  },

  tipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  tipCard: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: COLOR.card,
    borderWidth: 1,
    borderColor: COLOR.border,
    borderRadius: RADIUS['3xl'],
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    boxShadow: SHADOW.sm,
  },

  tipIcon: {
    fontSize: 32,
  },

  tipTitle: {
    textAlign: 'center',
  },
});
