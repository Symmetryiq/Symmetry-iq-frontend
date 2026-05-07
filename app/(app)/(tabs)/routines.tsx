import DateSelector from '@/components/DateSelector';
import Header from '@/components/Header';
import RoutineCard from '@/components/RoutineCard';
import ScreenView from '@/components/ScreenView';
import TaskList from '@/components/TaskList';
import ThemedText from '@/components/ThemedText';
import { COLOR, RADIUS, SPACE, THEME } from '@/constants/theme';
import { usePlanStore } from '@/hooks/usePlanStore';
import { useRoutineStore } from '@/hooks/useRoutineStore';
import { toDateKey } from '@/hooks/useScanStore';
import { RoutineID } from '@/types/routine.types';
import { getFeatureByID } from '@/utils/feature.util';
import { getPlanDates, getPlanForDate } from '@/utils/planner.util';
import { verticalScale } from '@/utils/scaling.util';
import { useUser } from '@clerk/expo';
import { TargetIcon } from 'phosphor-react-native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = 12;
const PEEK = 24;
const CARD_WIDTH = SCREEN_WIDTH - THEME.PADDING.screen * 2 - PEEK;
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;

const RoutineScreen = () => {
  const { user } = useUser();
  const plan = usePlanStore((s) => s.plan);

  /* ── Date selection ── */
  const todayStr = useMemo(() => toDateKey(new Date()), []);
  const [selectedDateKey, setSelectedDateKey] = useState(todayStr);
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const planDates = useMemo(() => {
    if (!plan) return new Set<string>();
    return getPlanDates(plan);
  }, [plan]);

  const handleDateChange = useCallback((date: Date) => {
    const key = toDateKey(date);
    setSelectedDateKey(key);
    setSelectedDate(date);
  }, []);

  const isToday = selectedDateKey === todayStr;
  const isPast = selectedDateKey < todayStr;
  const isFuture = selectedDateKey > todayStr;

  /* ── Plan for selected date ── */
  const dayPlan = useMemo(() => {
    if (!plan) return null;
    return getPlanForDate(plan, selectedDate);
  }, [plan, selectedDate]);

  const tomorrow = new Date(selectedDate);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const tomorrowPlan = useMemo(() => {
    if (!plan) return null;

    return getPlanForDate(plan, tomorrow);
  }, [plan, tomorrow]);

  /* ── Completion tracking ── */
  const completions = useRoutineStore((s) => s.completions);

  const isRoutineCompleted = useCallback(
    (routineId: RoutineID) => {
      const list = completions[selectedDateKey] ?? [];
      return list.includes(routineId);
    },
    [completions, selectedDateKey],
  );

  /* ── Bonus carousel ── */
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SNAP_INTERVAL);
    setActiveIndex(index);
  }, []);

  const getUnlockDateStr = useCallback((date: Date) => {
    return date.toISOString();
  }, []);

  const renderBonusCard = useCallback(
    ({ item }: { item: RoutineID }) => (
      <View style={styles.carouselCard}>
        <RoutineCard
          routineId={item}
          locked={isFuture}
          completed={isRoutineCompleted(item)}
          unlockDate={isFuture ? getUnlockDateStr(selectedDate) : undefined}
        />
      </View>
    ),
    [isFuture, isRoutineCompleted, getUnlockDateStr, selectedDate],
  );

  /* ── Empty state ── */
  if (!plan) {
    return (
      <ScreenView edges={['top', 'left', 'right']} padded={false}>
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <Header
            name={user?.firstName || 'User'}
            profileImage={user?.imageUrl || ''}
          />

          <View style={styles.emptyState}>
            <ThemedText variant="h3" style={styles.emptyTitle}>
              No Routine Plan Yet
            </ThemedText>
            <ThemedText color="onSecondary" style={styles.emptyText}>
              Complete a face scan to generate your personalized 4-week routine
              plan based on your facial analysis.
            </ThemedText>
          </View>
        </ScrollView>
      </ScreenView>
    );
  }

  if (!dayPlan) {
    return (
      <ScreenView edges={['top', 'left', 'right']} padded={false}>
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <Header
            name={user?.firstName || 'User'}
            profileImage={user?.imageUrl || ''}
          />

          <DateSelector
            onDateChange={handleDateChange}
            availableDates={planDates}
          />

          <View style={styles.emptyState}>
            <ThemedText variant="h3" style={styles.emptyTitle}>
              No Routines
            </ThemedText>
            <ThemedText color="onSecondary" style={styles.emptyText}>
              There are no routines planned for this date. Select a date within
              your 4-week plan.
            </ThemedText>
          </View>
        </ScrollView>
      </ScreenView>
    );
  }

  const focusFeature = getFeatureByID(dayPlan.focusFeature);

  return (
    <ScreenView edges={['top', 'left', 'right']} padded={false}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Header
          name={user?.firstName || 'User'}
          profileImage={user?.imageUrl || ''}
        />

        <DateSelector
          onDateChange={handleDateChange}
          availableDates={planDates}
        />

        <View style={styles.focusBanner}>
          <TargetIcon color={COLOR.primaryLight} size={16} weight="fill" />
          <ThemedText variant="bodySmall" color="primaryLight">
            {isToday ? "Today's" : isPast ? 'Past' : 'Upcoming'} Focus:{' '}
            {focusFeature.title}
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText variant="h2">
            {isToday
              ? "Today's Routine"
              : isPast
                ? 'Routine'
                : 'Upcoming Routine'}
          </ThemedText>
          <RoutineCard
            routineId={dayPlan.main}
            locked={isFuture}
            completed={isRoutineCompleted(dayPlan.main)}
            unlockDate={isFuture ? getUnlockDateStr(selectedDate) : undefined}
          />
        </View>

        {dayPlan.bonus.length > 0 && (
          <View style={styles.section}>
            <ThemedText variant="h2">Bonus Routines</ThemedText>

            <FlatList
              ref={flatListRef}
              data={dayPlan.bonus}
              keyExtractor={(item) => item}
              renderItem={renderBonusCard}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={SNAP_INTERVAL}
              decelerationRate="fast"
              contentContainerStyle={styles.carouselList}
              onScroll={onScroll}
              scrollEventThrottle={16}
            />

            {dayPlan.bonus.length > 1 && (
              <View style={styles.dots}>
                {dayPlan.bonus.map((_, i) => (
                  <View
                    key={i}
                    style={[styles.dot, i === activeIndex && styles.dotActive]}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        {isToday && (
          <View style={styles.section}>
            <ThemedText variant="h2">Today&apos;s Tasks</ThemedText>
            <TaskList />
          </View>
        )}

        {isToday && tomorrowPlan && (
          <View style={styles.section}>
            <ThemedText variant="h2">Upcoming Routine</ThemedText>
            <RoutineCard
              routineId={tomorrowPlan.main}
              locked={true}
              completed={isRoutineCompleted(tomorrowPlan.main)}
              unlockDate={getUnlockDateStr(tomorrow)}
            />
          </View>
        )}
      </ScrollView>
    </ScreenView>
  );
};

export default RoutineScreen;

const styles = StyleSheet.create({
  container: {
    gap: verticalScale(20),
    paddingHorizontal: THEME.PADDING.screen,
    paddingBottom: THEME.PADDING.screen,
  },

  section: {
    gap: verticalScale(12),
  },

  focusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACE.xs,
    backgroundColor: 'hsla(250, 50%, 50%, 0.12)',
    borderWidth: 1,
    borderColor: 'hsla(250, 50%, 70%, 0.2)',
    borderRadius: RADIUS.full,
    paddingVertical: SPACE.sm,
    paddingHorizontal: SPACE.lg,
    alignSelf: 'center',
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

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(80),
    gap: verticalScale(8),
  },

  emptyTitle: {
    textAlign: 'center',
  },

  emptyText: {
    textAlign: 'center',
    paddingHorizontal: THEME.PADDING.screen,
    maxWidth: 300,
  },
});
