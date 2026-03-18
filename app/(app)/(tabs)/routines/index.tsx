import Calendar from "@/components/calendar";
import RoutineCard from "@/components/cards/routine-card";
import ScreenWrapper from "@/components/common/screen-wrapper";
import Section from "@/components/common/section";
import Typography from "@/components/common/typography";
import { Colors } from "@/constants/theme";
import { RoutineId } from "@/data/routines";
import { verticalScale } from "@/helpers/scaling";
import { usePlanStore } from "@/stores/plan-store";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

const formatDate = (date: Date): string => date.toISOString().split("T")[0];

const Routines = () => {
  const { currentPlan, status, fetchCurrentPlan, getRoutinesForDate, completedRoutines } =
    usePlanStore();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Fetch plan when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchCurrentPlan();
    }, [fetchCurrentPlan]),
  );

  const dateStr = formatDate(selectedDate);

  const isToday = useMemo(() => {
    return selectedDate.toDateString() === new Date().toDateString();
  }, [selectedDate]);

  // Get routines for the selected date using the store helper
  const dateRoutines = useMemo(() => {
    if (!currentPlan?.schedule) {
      return { today: null, bonus: [] as RoutineId[], upcoming: [] as RoutineId[], completed: [] as string[] };
    }

    const { assigned, completed } = getRoutinesForDate(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);

    const isTodayDate = selected.getTime() === today.getTime();
    const isPast = selected < today;
    const isFuture = selected > today;

    // Find the first non-completed assigned routine for today
    const firstAssigned = assigned.find((r) => !completed.includes(r)) || null;

    if (isTodayDate) {
      // Get next 3 upcoming dates with routines
      const upcomingRoutines: RoutineId[] = [];
      const scheduleEntries = Object.entries(currentPlan.schedule);
      for (const [entryDate, routines] of scheduleEntries) {
        if (entryDate > dateStr && routines.length > 0 && upcomingRoutines.length < 3) {
          upcomingRoutines.push(routines[0] as RoutineId);
        }
      }

      return {
        today: firstAssigned as RoutineId | null,
        bonus: currentPlan.bonusRoutines || [],
        upcoming: upcomingRoutines,
        completed: completed as RoutineId[],
      };
    } else if (isPast) {
      return {
        today: null,
        bonus: [] as RoutineId[],
        upcoming: [] as RoutineId[],
        completed: completed.length > 0 ? completed as RoutineId[] : assigned as RoutineId[],
      };
    } else {
      // Future
      return {
        today: null,
        bonus: [] as RoutineId[],
        upcoming: assigned as RoutineId[],
        completed: [] as RoutineId[],
      };
    }
  }, [currentPlan, selectedDate, completedRoutines, dateStr, getRoutinesForDate]);

  // Extract dates that have routines from the plan schedule
  const planDates = useMemo(() => {
    if (!currentPlan?.schedule) return undefined;
    return Object.entries(currentPlan.schedule)
      .filter(([_, routines]) => routines.length > 0)
      .map(([d]) => new Date(d));
  }, [currentPlan]);

  if (status === "loading" && !currentPlan) {
    return (
      <ScreenWrapper edges={["top"]}>
        <View
          style={[
            styles.container,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <ActivityIndicator size="large" color={Colors.primary} />
          <Typography style={{ marginTop: 16 }}>
            Loading your plan...
          </Typography>
        </View>
      </ScreenWrapper>
    );
  }

  if (!currentPlan) {
    return (
      <ScreenWrapper edges={["top"]}>
        <View
          style={[
            styles.container,
            { justifyContent: "center", alignItems: "center", padding: 24 },
          ]}
        >
          <Typography size={24} font="bold" style={{ textAlign: "center" }}>
            No Active Plan
          </Typography>
          <Typography
            color="onSecondary"
            style={{ textAlign: "center", marginTop: 8 }}
          >
            Complete a face scan to generate your personalized routine plan
          </Typography>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Typography font="bold" size={32}>
            Routines
          </Typography>

          <Calendar
            onSelect={setSelectedDate}
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

              <RoutineCard routineId={dateRoutines.today} />
            </Section>
          )}

          {dateRoutines.bonus.length > 0 && (
            <Section>
              <Typography size={28} color="onBackground" font="bold">
                Bonus Routines
              </Typography>

              {dateRoutines.bonus.map((routineId) => (
                <RoutineCard key={routineId} routineId={routineId} />
              ))}
            </Section>
          )}

          {dateRoutines.upcoming.length > 0 && (
            <Section>
              <Typography size={28} color="onBackground" font="bold">
                Upcoming Routines
              </Typography>

              {dateRoutines.upcoming.map((routineId) => (
                <RoutineCard
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
                <RoutineCard key={routineId} routineId={routineId as any} />
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
    justifyContent: "center",
    alignItems: "center",
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(4),
  },
});
