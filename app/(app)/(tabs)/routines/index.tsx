import Calendar from '@/components/calendar';
import ScreenWrapper from '@/components/common/screen-wrapper';
import Section from '@/components/common/section';
import Typography from '@/components/common/typography';
import RoutineCardLarge from '@/components/routine-card';
import { Colors } from '@/constants/theme';
import { RoutineId } from '@/data/routines';
import { verticalScale } from '@/helpers/scale';
import { usePlanStore } from '@/stores/plan-store';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

const Routines = () => {
  const { currentPlan, loading, fetchCurrentPlan, selectDate, selectedDate } = usePlanStore();
  const [dateRoutines, setDateRoutines] = useState<{
    today: RoutineId | null;
    bonus: RoutineId[];
    upcoming: RoutineId[];
    completed: RoutineId[];
  }>({
    today: null,
    bonus: [],
    upcoming: [],
    completed: [],
  });

  // Fetch plan when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchCurrentPlan();
    }, [fetchCurrentPlan])
  );

  // Update displayed routines when plan or selected date changes
  React.useEffect(() => {
    if (!currentPlan) {
      setDateRoutines({ today: null, bonus: [], upcoming: [], completed: [] });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);

    const isToday = selected.getTime() === today.getTime();
    const isPast = selected < today;
    const isFuture = selected > today;

    // Find routine for selected date
    const routineForDate = currentPlan.dailyRoutines.find((dr) => {
      const drDate = new Date(dr.date);
      drDate.setHours(0, 0, 0, 0);
      return drDate.getTime() === selected.getTime();
    });

    if (isToday) {
      const isDailyCompleted = routineForDate?.completed;

      setDateRoutines({
        today: isDailyCompleted ? null : (routineForDate?.routineId || null),
        bonus: currentPlan.bonusRoutines,
        upcoming: currentPlan.dailyRoutines
          .filter((dr) => new Date(dr.date) > today)
          .slice(0, 3)
          .map((dr) => dr.routineId),
        completed: isDailyCompleted && routineForDate ? [routineForDate.routineId] : [],
      });
    } else if (isPast) {
      setDateRoutines({
        today: null,
        bonus: [],
        upcoming: [],
        completed: routineForDate ? [routineForDate.routineId] : [],
      });
    } else if (isFuture) {
      setDateRoutines({
        today: null,
        bonus: [],
        upcoming: routineForDate ? [routineForDate.routineId] : [],
        completed: [],
      });
    }
  }, [currentPlan, selectedDate]);

  const handleDateSelect = (date: Date) => {
    selectDate(date);
  };

  // Extract dates that have routines from the plan
  const planDates = React.useMemo(() => {
    if (!currentPlan) return undefined;
    return currentPlan.dailyRoutines.map((dr) => new Date(dr.date));
  }, [currentPlan]);

  if (loading && !currentPlan) {
    return (
      <ScreenWrapper edges={['top']}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Typography style={{ marginTop: 16 }}>Loading your plan...</Typography>
        </View>
      </ScreenWrapper>
    );
  }

  if (!currentPlan) {
    return (
      <ScreenWrapper edges={['top']}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 24 }]}>
          <Typography size={24} font="bold" style={{ textAlign: 'center' }}>
            No Active Plan
          </Typography>
          <Typography color="onSecondary" style={{ textAlign: 'center', marginTop: 8 }}>
            Complete a face scan to generate your personalized routine plan
          </Typography>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Typography font="bold" size={32}>
            Routines
          </Typography>

          <Calendar
            onSelect={handleDateSelect}
            selectedDate={selectedDate}
            availableDates={planDates}
          />
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 24, gap: verticalScale(20) }}
        >
          {dateRoutines.today && (
            <Section>
              <Typography size={28} color="onBackground" font="bold">
                Today&apos;s Routine
              </Typography>

              <RoutineCardLarge
                routineId={dateRoutines.today}
              />
            </Section>
          )}

          {dateRoutines.bonus.length > 0 && (
            <Section>
              <Typography size={28} color="onBackground" font="bold">
                Bonus Routines
              </Typography>

              {dateRoutines.bonus.map((routineId) => (
                <RoutineCardLarge
                  key={routineId}
                  routineId={routineId}
                />
              ))}
            </Section>
          )}

          {dateRoutines.upcoming.length > 0 && (
            <Section>
              <Typography size={28} color="onBackground" font="bold">
                Upcoming Routines
              </Typography>

              {dateRoutines.upcoming.map((routineId) => (
                <RoutineCardLarge
                  key={routineId}
                  routineId={routineId}
                  locked={true}
                />
              ))}
            </Section>
          )}

          {dateRoutines.completed.length > 0 && (
            <Section>
              <Typography size={28} color="onBackground" font="bold">
                Completed
              </Typography>

              {dateRoutines.completed.map((routineId) => (
                <RoutineCardLarge
                  key={routineId}
                  routineId={routineId}
                />
              ))}
            </Section>
          )}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default Routines;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(4),
  },
});
