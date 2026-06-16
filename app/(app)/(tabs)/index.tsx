import Header from '@/components/Header';
import ResultCard from '@/components/ResultCard';
import RoutineCard from '@/components/RoutineCard';
import ScanCard from '@/components/ScanCard';
import ScreenView from '@/components/ScreenView';
import TaskList from '@/components/TaskList';
import ThemedText from '@/components/ThemedText';
import { THEME } from '@/constants/theme';
import { usePlanStore } from '@/hooks/usePlanStore';
import { useRoutineStore } from '@/hooks/useRoutineStore';
import { getTodaysScan, useScanStore } from '@/hooks/useScanStore';
import { getTodaysPlan } from '@/utils/planner.util';
import { verticalScale } from '@/utils/scaling.util';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

const index = () => {
  const history = useScanStore((s) => s.history);
  const plan = usePlanStore((s) => s.plan);
  const isCompletedToday = useRoutineStore((s) => s.isCompletedToday);

  const todaysScan = useMemo(() => getTodaysScan(history), [history]);

  const pastScans = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return history.filter((s) => !s.createdAt.startsWith(today)).slice(0, 2);
  }, [history]);

  const todaysPlan = useMemo(() => {
    if (!plan) return null;
    return getTodaysPlan(plan);
  }, [plan]);

  return (
    <ScreenView edges={['top', 'left', 'right']} padded={false}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Header />

        <View style={styles.section}>
          <ThemedText variant="h2">Today&apos;s Scan</ThemedText>

          {todaysScan ? <ResultCard scan={todaysScan} /> : <ScanCard />}
        </View>

        {todaysPlan && (
          <View style={styles.section}>
            <ThemedText variant="h2">Today&apos;s Routine</ThemedText>

            <RoutineCard
              routineId={todaysPlan.main}
              completed={isCompletedToday(todaysPlan.main)}
            />
          </View>
        )}

        <View style={styles.section}>
          <ThemedText variant="h2">Today&apos;s Tasks</ThemedText>

          <TaskList />
        </View>

        {pastScans.length > 0 && (
          <View style={styles.section}>
            <ThemedText variant="h2">Past Scans</ThemedText>

            {pastScans.map((scan) => (
              <ResultCard key={scan.id} scan={scan} />
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenView>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    gap: verticalScale(20),
    paddingHorizontal: THEME.PADDING.screen,
    paddingBottom: THEME.PADDING.screen,
  },

  section: {
    gap: verticalScale(12),
  },
});
