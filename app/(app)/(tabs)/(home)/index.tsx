import RoutineCard from "@/components/cards/routine-card";
import { Button, Card, IconButton, ProgressBar, ScreenWrapper, Spacer, Text } from "@/components/ui";
import { QUICK_ACTIONS } from "@/constants/data";
import { Animation, Colors, Radii, Shadows, Spacing } from "@/constants/theme";
import { moderateScale, scale, verticalScale } from "@/helpers/scaling";
import { getColorByScore } from "@/helpers/scan";
import { usePlanStore } from "@/stores/plan-store";
import { useScanStore } from "@/stores/scan-store";
import { useUser } from "@clerk/expo";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Href, router, useFocusEffect } from "expo-router";
import {
  ArrowRight,
  BellIcon,
  CheckCircle,
  SparkleIcon,
  TrendUpIcon
} from "phosphor-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const formatDate = (date: Date): string => date.toISOString().split("T")[0];

// ─── Mock scanned state (toggle to test) ────────────────────────────────────────
const HAS_SCANNED = true;
const MOCK_SCAN_DATE = new Date(2026, 2, 18, 14, 32);
const MOCK_SCORES = { overallSymmetry: 78, facialHarmony: 82 };

// ─── Home Screen ────────────────────────────────────────────────────────────────
const Home = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { user } = useUser();
  const { currentPlan, fetchCurrentPlan, getRoutinesForDate, completedRoutines } = usePlanStore();
  const { scans, fetchScans, latestScan } = useScanStore();

  // ── Scan card animations (only used for unscanned state) ──
  const cardScale = useSharedValue(1);
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (!HAS_SCANNED) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false,
      );
    }
  }, []);

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const pulseRingStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 1], [0.25, 0.7]),
    transform: [{ scale: interpolate(pulse.value, [0, 1], [1, 1.3]) }],
  }));

  const handleScanCardPressIn = useCallback(() => {
    cardScale.value = withTiming(0.97, { duration: Animation.duration.fast });
  }, []);

  const handleScanCardPressOut = useCallback(() => {
    cardScale.value = withTiming(1, { duration: Animation.duration.fast });
  }, []);

  // ── Data fetching ──
  useFocusEffect(
    React.useCallback(() => {
      fetchCurrentPlan();
      fetchScans();
    }, []),
  );

  const planDates = useMemo(() => {
    if (!currentPlan?.schedule) return undefined;
    return Object.keys(currentPlan.schedule).map((d) => new Date(d));
  }, [currentPlan]);

  const dailyRoutineId = useMemo(() => {
    if (!currentPlan?.schedule) return null;
    const dateStr = formatDate(selectedDate);
    const routines = currentPlan.schedule[dateStr];
    return routines && routines.length > 0 ? routines[0] : null;
  }, [currentPlan, selectedDate]);

  const isToday = useMemo(() => {
    const today = new Date();
    return selectedDate.toDateString() === today.toDateString();
  }, [selectedDate]);

  const { todayScan, previousDayScan } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayScan = scans.find((s) => {
      const d = new Date(s.scanDate);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === today.getTime();
    });
    const previousDayScan = scans.find((s) => {
      const d = new Date(s.scanDate);
      d.setHours(0, 0, 0, 0);
      return d.getTime() < today.getTime();
    });
    return { todayScan, previousDayScan };
  }, [scans]);

  const streak = useMemo(() => {
    if (!completedRoutines) return 0;
    let count = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = formatDate(d);
      if (completedRoutines[dateStr] && completedRoutines[dateStr].length > 0) {
        count++;
      } else if (i > 0) {
        break;
      }
    }
    return count;
  }, [completedRoutines]);

  const scoreImprovement = useMemo(() => {
    if (scans.length < 2) return null;
    const latest = scans[0]?.scores.overallSymmetry;
    const prev = scans[1]?.scores.overallSymmetry;
    if (latest === undefined || prev === undefined) return null;
    return Math.round(latest - prev);
  }, [scans]);

  const currentScore = latestScan?.scores.overallSymmetry || 0;
  const scoreColor = getColorByScore(currentScore);

  const scanDateLabel = MOCK_SCAN_DATE.toLocaleDateString("en-US", {
    month: "short", day: "numeric",
  });

  return (
    <ScreenWrapper scroll padded edges={['top']}>
      <Spacer size="lg" />
      {/* ─── Header ──────────────────────────────────────────────── */}
      <View style={styles.header}>
        <View>
          <Text variant="h3" color={Colors.onBackground}>Hey, {user?.firstName || 'User'} 👋</Text>
          <Text>Welcome back!</Text>
        </View>
        <IconButton icon={<BellIcon color={Colors.onBackground} />} variant="soft" backgroundColor={Colors.card} haptic />
      </View>

      <Spacer size="lg" />
      {/* ─── Score Card ──────────────────────────────────────────── */}
      <Card variant="elevated" padding={Spacing.xl} radius={Radii["2xl"]} style={{ overflow: "hidden", flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text variant="body1" color={Colors.onSecondary}>Overall Symmetry</Text>
          <Spacer size="sm" />
          <Text variant="h1">73 <Text color={Colors.onMuted}>/100</Text></Text>
          <Spacer size="sm" />
          <View style={styles.delta}>
            <TrendUpIcon color={Colors.success} size={moderateScale(16)} />
            <Text variant="body2" color={Colors.success}>+2.3 since last week</Text>
          </View>
        </View>
        <Image
          source={require("@/assets/images/face-capture.jpg")}
          style={{ width: moderateScale(100), height: moderateScale(100), borderRadius: Radii["2xl"] }}
          contentFit="cover"
        />
      </Card>

      <Spacer size="lg" />
      {/* ─── Stat Cards ──────────────────────────────────────────── */}
      <View style={{ flexDirection: 'row', gap: Spacing.md }}>
        <Card style={styles.statCard}>
          <Text variant="h2">{streak}</Text>
          <Text variant="caption" align="center">Day Streak</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text variant="h2">{scans.length}</Text>
          <Text variant="caption" align="center">Total Scans</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text variant="h2">{completedRoutines?.length || 0}</Text>
          <Text variant="caption" align="center">Tasks Done</Text>
        </Card>
      </View>

      <Spacer size="lg" />
      {/* ─── Quick Actions ───────────────────────────────────────── */}
      <Text variant="h3">Quick Actions</Text>
      <Spacer size="md" />
      <View style={{ flexDirection: 'row', gap: Spacing.md }}>
        {QUICK_ACTIONS.map((action, index) => (
          <Pressable key={index} onPress={() => router.push(action.route as Href)} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <IconButton icon={<action.icon color={action.color} size={moderateScale(24)} />} variant="soft" backgroundColor={Colors.card} haptic />
            <Spacer size="xs" />
            <Text variant="caption" color={Colors.onSecondary}>{action.label}</Text>
          </Pressable>
        ))}
      </View>

      <Spacer size="xl" />

      {HAS_SCANNED ? (
        <View style={styles.scanCard}>
          <LinearGradient
            colors={["hsla(250, 28%, 16%, 1)", "hsla(250, 20%, 12%, 1)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />

          {/* Top row: badge + date */}
          <View style={styles.scanTopRow}>
            <View style={styles.scanBadge}>
              <CheckCircle weight="fill" size={moderateScale(13)} color={Colors.success} />
              <Text variant="caption" color={Colors.success}>Scanned</Text>
            </View>
            <Text variant="caption" color={Colors.onMuted}>{scanDateLabel}</Text>
          </View>

          {/* Message */}
          <Text variant="subtitle2" color={Colors.onBackground} style={{ marginTop: moderateScale(10) }}>
            Great results! Your symmetry is above average ✨
          </Text>

          {/* Score bars side by side */}
          <View style={styles.scanScoresRow}>
            <View style={styles.scanScoreItem}>
              <View style={styles.scanScoreLabelRow}>
                <Text variant="caption" color={Colors.onMuted}>Symmetry</Text>
                <Text variant="caption" color={Colors.primary}>{MOCK_SCORES.overallSymmetry}%</Text>
              </View>
              <ProgressBar
                progress={MOCK_SCORES.overallSymmetry / 100}
                height={moderateScale(5)}
                color={Colors.primary}
                trackColor={Colors.muted}
              />
            </View>
            <View style={styles.scanScoreItem}>
              <View style={styles.scanScoreLabelRow}>
                <Text variant="caption" color={Colors.onMuted}>Harmony</Text>
                <Text variant="caption" color={Colors.success}>{MOCK_SCORES.facialHarmony}%</Text>
              </View>
              <ProgressBar
                progress={MOCK_SCORES.facialHarmony / 100}
                height={moderateScale(5)}
                color={Colors.success}
                trackColor={Colors.muted}
              />
            </View>
          </View>

          {/* View report */}
          <Button
            label="View Report"
            variant="ghost"
            size="sm"
            rightIcon={<ArrowRight weight="bold" size={moderateScale(14)} color={Colors.primary} />}
            onPress={() => router.push("/report" as Href)}
            style={{ alignSelf: "flex-start", marginTop: moderateScale(2) }}
          />
        </View>
      ) : (
        <AnimatedPressable
          onPressIn={handleScanCardPressIn}
          onPressOut={handleScanCardPressOut}
          onPress={() => router.push("/scan")}
          style={[styles.scanCard, animatedCardStyle]}
        >
          <LinearGradient
            colors={["hsla(250, 28%, 16%, 1)", "hsla(250, 20%, 12%, 1)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />

          <View style={styles.scanUnscannedRow}>
            {/* Left: image thumbnail */}
            <Image
              source={require("@/assets/images/face-capture.jpg")}
              style={styles.scanThumb}
              contentFit="cover"
            />

            <View style={styles.scanTextBlock}>
              <View style={styles.scanAiBadge}>
                <SparkleIcon weight="fill" size={moderateScale(11)} color={Colors.warning} />
                <Text variant="overline" color={Colors.warning}>AI-POWERED</Text>
              </View>
              <Text variant="h4" color={Colors.onPrimary}>Scan Your Face</Text>
              <Text variant="caption" color={Colors.onMuted} numberOfLines={2}>
                Get an instant symmetry analysis with our AI scanner
              </Text>
            </View>
          </View>
        </AnimatedPressable>
      )}

      <Spacer size="lg" />
      {/* ─── Today's Routine ──────────────────────────────────────── */}
      <Text variant="h3">Today&apos;s Routine</Text>
      <Spacer size="md" />
      <PagerView initialPage={0} style={{ height: verticalScale(325) }} pageMargin={moderateScale(16)}>
        <RoutineCard routineId='cheekbone-lift-massage' />
        <RoutineCard routineId='chin-tucks' locked />
      </PagerView>
    </ScreenWrapper>
  );
};

export default Home;

// ─── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  delta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },

  // ─── Scan card (shared shell) ───
  scanCard: {
    borderRadius: Radii["2xl"],
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.lg,
    ...Shadows.md,
  },

  // ─── Scanned state ───
  scanAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: moderateScale(3),
  },
  scanTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  scanBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(4),
    backgroundColor: Colors.successLight,
    paddingVertical: moderateScale(3),
    paddingHorizontal: Spacing.sm,
    borderRadius: Radii.full,
  },
  scanScoresRow: {
    flexDirection: "row",
    gap: Spacing.lg,
    marginTop: moderateScale(12),
  },
  scanScoreItem: {
    flex: 1,
    gap: moderateScale(4),
  },
  scanScoreLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // ─── Unscanned state ───
  scanUnscannedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  scanThumb: {
    width: moderateScale(96),
    aspectRatio: 1,
    borderRadius: Radii.lg,
  },
  scanTextBlock: {
    flex: 1,
    gap: moderateScale(2),
  },
  scanAiBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(4),
    marginBottom: moderateScale(2),
  },
  scanBtnWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  scanPulseRing: {
    position: "absolute",
    width: moderateScale(52),
    height: moderateScale(52),
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  scanBtn: {
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: Radii.full,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.glow,
  },
});
