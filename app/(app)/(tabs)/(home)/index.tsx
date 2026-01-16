import Calendar from '@/components/calendar';
import Checklist from '@/components/checklist';
import ScreenWrapper from '@/components/common/screen-wrapper';
import Section from '@/components/common/section';
import Typography from '@/components/common/typography';
import PastScore from '@/components/past-score';
import RoutineCardLarge from '@/components/routine-card';
import ScanCard from '@/components/scan-card';
import { Colors } from '@/constants/theme';
import { scale, verticalScale } from '@/helpers/scale';
import { useAuthStore } from '@/stores/auth-store';
import { useNotificationStore } from '@/stores/notification-store';
import { usePlanStore } from '@/stores/plan-store';
import { useScanStore } from '@/stores/scan-store';
import { router, useFocusEffect } from 'expo-router';
import { BellIcon } from 'phosphor-react-native';
import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';

const Home = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { user } = useAuthStore();
  const { currentPlan, fetchCurrentPlan } = usePlanStore();
  const { unreadCount, refreshUnreadCount } = useNotificationStore();
  const { scans, fetchScans } = useScanStore();

  // Fetch plan and unread count on mount/focus
  useFocusEffect(
    React.useCallback(() => {
      fetchCurrentPlan();
      refreshUnreadCount();
      fetchScans();
    }, [])
  );

  const planDates = useMemo(() => {
    if (!currentPlan) return undefined;
    return currentPlan.dailyRoutines.map((dr) => new Date(dr.date));
  }, [currentPlan]);

  // Find routine for selected date
  const dailyRoutineId = React.useMemo(() => {
    if (!currentPlan) return null;

    const targetDate = new Date(selectedDate);
    targetDate.setHours(0, 0, 0, 0);

    const routineForDate = currentPlan.dailyRoutines.find((dr) => {
      const drDate = new Date(dr.date);
      drDate.setHours(0, 0, 0, 0);
      return drDate.getTime() === targetDate.getTime();
    })
    return routineForDate?.routineId || null;
  }, [currentPlan, selectedDate]);

  const handlePressScanNow = () => {
    router.push('/scan');
  };

  // Helper to check if selected date is today
  const isToday = React.useMemo(() => {
    const today = new Date();
    return selectedDate.toDateString() === today.toDateString();
  }, [selectedDate]);

  // Separate today's scan and the most recent scan before today
  const { todayScan, previousDayScan } = React.useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayScan = scans.find(s => {
      const d = new Date(s.scanDate);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === today.getTime();
    });

    const previousDayScan = scans.find(s => {
      const d = new Date(s.scanDate);
      d.setHours(0, 0, 0, 0);
      return d.getTime() < today.getTime();
    });

    return { todayScan, previousDayScan };
  }, [scans]);

  return (
    <ScreenWrapper edges={['top']}>
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <View style={styles.headerContentContainer}>
            <Image
              source={require('@/assets/images/icon.png')}
              style={styles.headerAvatar}
            />

            <View style={styles.headerContentWrapper}>
              <Typography color="onSecondary">Welcome back,</Typography>
              <Typography font="semiBold" size={20} color="onBackground">
                {user?.displayName || 'User'}
              </Typography>
            </View>
          </View>

          <Pressable
            style={styles.headerPressable}
            onPress={() => router.push('/(app)/(tabs)/(home)/notifications')}
          >
            <BellIcon weight="fill" size={24} color={Colors.onMuted} />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Typography size={10} font="semiBold" color="onPrimary">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Typography>
              </View>
            )}
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          <Calendar onSelect={setSelectedDate} selectedDate={selectedDate} availableDates={planDates} />

          <View style={styles.contentContainer}>
            <Section>
              <Typography font="semiBold" size={28} color="onSecondary">
                Ready to scan?
              </Typography>

              <ScanCard onPress={handlePressScanNow} />
            </Section>

            {dailyRoutineId ? (
              <Section>
                <Typography font="semiBold" size={28} color="onSecondary">
                  {isToday ? "Today's Routine" : "Daily Routine"}
                </Typography>

                <RoutineCardLarge
                  routineId={dailyRoutineId}
                />
              </Section>
            ) : (
              <Section>
                <Typography font="semiBold" size={28} color="onSecondary">
                  Daily Routine
                </Typography>
                <View style={{ padding: 20, alignItems: 'center', backgroundColor: Colors.card, borderRadius: 24 }}>
                  <Typography color="onSecondary">No routine scheduled for this date</Typography>
                </View>
              </Section>
            )}

            <Section>
              <Typography font="semiBold" size={28} color="onSecondary">
                {isToday ? "Today's Task" : 'Daily Tasks'}
              </Typography>

              <Checklist date={selectedDate} />
            </Section>

            {todayScan && (
              <Section>
                <Typography font="semiBold" size={28} color="onSecondary">
                  Today's Score
                </Typography>

                <PastScore scan={todayScan} />
              </Section>
            )}

            {previousDayScan && (
              <Section>
                <Typography font="semiBold" size={28} color="onSecondary">
                  Previous Score
                </Typography>

                <PastScore scan={previousDayScan} />
              </Section>
            )}
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingBottom: 32,
  },

  header: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
    backgroundColor: Colors.card,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerContentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },

  headerAvatar: {
    width: scale(52),
    height: verticalScale(52),
    borderRadius: verticalScale(50),
  },

  headerContentWrapper: {
    gap: verticalScale(4),
  },

  headerPressable: {
    padding: verticalScale(8),
    backgroundColor: Colors.muted,
    borderRadius: verticalScale(8),
  },

  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.danger,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },

  calendarContainer: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
    gap: verticalScale(12),
    flexDirection: 'row',
  },

  calendarItemContainer: {
    width: scale(64),
    height: verticalScale(64),
    borderRadius: 200,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  calendarItemContainerActive: {
    borderColor: Colors.primary,
  },

  calendarItem: {
    width: scale(56),
    height: verticalScale(56),
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    gap: verticalScale(4),
    borderRadius: 200,
  },

  calendarItemActive: {
    backgroundColor: Colors.primaryLight,
  },

  contentContainer: {
    gap: verticalScale(16),
  },
});
