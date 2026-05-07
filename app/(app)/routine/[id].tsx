import Button from '@/components/Button';
import ScreenView from '@/components/ScreenView';
import ThemedText from '@/components/ThemedText';
import { COLOR, FONT, RADIUS, SHADOW, SPACE, TEXT } from '@/constants/theme';
import { useRoutineStore } from '@/hooks/useRoutineStore';
import { Routine, RoutineID, RoutineStep } from '@/types/routine.types';
import { getRoutineByID } from '@/utils/routine.util';
import { ImageBackground } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockCountdownIcon,
  ListNumbersIcon,
  PlayIcon,
  XIcon,
} from 'phosphor-react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { goBack } from '@/utils/router.util';

/* ─── Types ────────────────────────────────────────────────── */

type ScreenPhase = 'intro' | 'active' | 'complete';

/* ─── Timer Hook ───────────────────────────────────────────── */

function useElapsedTimer(running: boolean) {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const formatted = useMemo(() => {
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, [elapsed]);

  return { elapsed, formatted };
}


/* ─── Progress Bar ─────────────────────────────────────────── */

function StepProgressBar({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming((current + 1) / total, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    });
  }, [current, total]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View style={styles.progressTrack}>
      <Animated.View style={[styles.progressFill, animatedStyle]} />
    </View>
  );
}

/* ─── Step Dots ────────────────────────────────────────────── */

function StepDots({
  total,
  current,
}: {
  total: number;
  current: number;
}) {
  return (
    <View style={styles.dotsRow}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i < current && styles.dotCompleted,
            i === current && styles.dotActive,
          ]}
        />
      ))}
    </View>
  );
}

/* ─── Intro Phase ──────────────────────────────────────────── */

function IntroPhase({
  routine,
  onBegin,
}: {
  routine: Routine;
  onBegin: () => void;
}) {
  return (
    <View style={styles.introContainer}>
      <View style={styles.introImageWrapper}>
        <ImageBackground
          source={routine.image}
          style={styles.introImage}
          contentFit="cover"
        >
          <LinearGradient
            colors={[
              'transparent',
              'hsla(250, 20%, 10%, 0.6)',
              COLOR.background,
            ]}
            locations={[0.3, 0.7, 1]}
            style={styles.introGradient}
          />
        </ImageBackground>
      </View>

      <Animated.View
        entering={FadeInUp.duration(500).delay(200)}
        style={styles.introContent}
      >
        <ThemedText variant="h1">{routine.name}</ThemedText>
        <ThemedText color="onSecondary" style={styles.introSummary}>
          {routine.summary}
        </ThemedText>

        <View style={styles.introMeta}>
          <View style={styles.metaBadge}>
            <ClockCountdownIcon
              color={COLOR.primaryLight}
              size={18}
              weight="fill"
            />
            <ThemedText variant="body" color="primaryLight">
              {routine.duration} min
            </ThemedText>
          </View>

          <View style={styles.metaBadge}>
            <ListNumbersIcon
              color={COLOR.primaryLight}
              size={18}
              weight="fill"
            />
            <ThemedText variant="body" color="primaryLight">
              {routine.steps.length} steps
            </ThemedText>
          </View>
        </View>

        {routine.products.length > 0 && (
          <View style={styles.productsSection}>
            <ThemedText variant="label" color="onMuted">
              You'll need
            </ThemedText>
            <View style={styles.productsList}>
              {routine.products.map((product, i) => (
                <View key={i} style={styles.productChip}>
                  <ThemedText variant="bodySmall" color="onSecondary">
                    {product.name}
                  </ThemedText>
                  {product.optional && (
                    <ThemedText variant="badge" color="onMuted">
                      optional
                    </ThemedText>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}
      </Animated.View>

      <Animated.View
        entering={FadeInDown.duration(400).delay(500)}
        style={styles.introActions}
      >
        <Button
          title="Begin Routine"
          variant="primary"
          icon={PlayIcon}
          iconPosition="right"
          onPress={onBegin}
          size="lg"
        />
      </Animated.View>
    </View>
  );
}

/* ─── Active Phase ─────────────────────────────────────────── */

function ActivePhase({
  routine,
  onComplete,
  onExit,
}: {
  routine: Routine;
  onComplete: (elapsed: number) => void;
  onExit: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const { elapsed, formatted } = useElapsedTimer(true);

  const step = routine.steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === routine.steps.length - 1;

  const handleNext = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isLast) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onComplete(elapsed);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  }, [isLast, elapsed, onComplete]);

  const handlePrev = useCallback(() => {
    if (!isFirst) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentStep((prev) => prev - 1);
    }
  }, [isFirst]);

  return (
    <View style={styles.activeContainer}>
      {/* Top bar: close + timer */}
      <View style={styles.activeTopBar}>
        <Pressable style={styles.closeButton} onPress={onExit} hitSlop={8}>
          <XIcon color={COLOR.onBackground} size={20} />
        </Pressable>

        <View style={styles.timerBadge}>
          <ClockCountdownIcon color={COLOR.primaryLight} size={16} weight="bold" />
          <ThemedText variant="body" color="primaryLight" style={styles.timerText}>
            {formatted}
          </ThemedText>
        </View>
      </View>

      {/* Progress */}
      <StepProgressBar current={currentStep} total={routine.steps.length} />

      {/* Step counter */}
      <ThemedText variant="label" color="onMuted" style={styles.stepCounter}>
        Step {currentStep + 1} of {routine.steps.length}
      </ThemedText>

      {/* Step instruction — main focus area */}
      <View style={styles.stepCard}>
        <Animated.View
          key={currentStep}
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(150)}
          style={styles.stepContent}
        >
          <View style={styles.stepNumberCircle}>
            <ThemedText variant="h2" color="onPrimary">
              {step.order}
            </ThemedText>
          </View>

          <ThemedText variant="h3" style={styles.stepInstruction}>
            {step.instruction}
          </ThemedText>
        </Animated.View>
      </View>

      {/* Step dots */}
      <StepDots total={routine.steps.length} current={currentStep} />

      {/* Navigation buttons */}
      <View style={styles.activeActions}>
        <Button
          title="Back"
          variant="secondary"
          icon={ArrowLeftIcon}
          iconPosition="left"
          onPress={handlePrev}
          disabled={isFirst}
          fullWidth
        />
        <Button
          title={isLast ? 'Finish' : 'Next'}
          variant="primary"
          icon={isLast ? CheckCircleIcon : ArrowRightIcon}
          iconPosition="right"
          onPress={handleNext}
          fullWidth
        />
      </View>
    </View>
  );
}

/* ─── Complete Phase ───────────────────────────────────────── */

function CompletePhase({
  routine,
  elapsedSeconds,
  onDone,
}: {
  routine: Routine;
  elapsedSeconds: number;
  onDone: () => void;
}) {
  const mins = Math.floor(elapsedSeconds / 60);
  const secs = elapsedSeconds % 60;
  const timeLabel = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

  return (
    <View style={styles.completeContainer}>
      <Animated.View
        entering={FadeInDown.duration(600).delay(200)}
        style={styles.completeContent}
      >
        <View style={styles.completeIconCircle}>
          <CheckCircleIcon color={COLOR.onPrimary} size={48} weight="fill" />
        </View>

        <ThemedText variant="h1" style={styles.completeTitle}>
          Routine Complete!
        </ThemedText>

        <ThemedText color="onSecondary" style={styles.completeSubtitle}>
          Great job finishing{' '}
          <ThemedText color="primaryLight" style={{ fontFamily: FONT.semiBold }}>
            {routine.name}
          </ThemedText>
          . Consistency is key to seeing results.
        </ThemedText>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <ThemedText variant="h2" color="primaryLight">
              {routine.steps.length}
            </ThemedText>
            <ThemedText variant="caption" color="onMuted">
              Steps Done
            </ThemedText>
          </View>

          <View style={styles.statCard}>
            <ThemedText variant="h2" color="primaryLight">
              {timeLabel}
            </ThemedText>
            <ThemedText variant="caption" color="onMuted">
              Time Spent
            </ThemedText>
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(400).delay(600)}>
        <Button
          title="Done"
          variant="primary"
          onPress={onDone}
          size="lg"
        />
      </Animated.View>
    </View>
  );
}

/* ─── Main Screen ──────────────────────────────────────────── */

const RoutineScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const routine = useMemo(() => {
    try {
      return getRoutineByID(id as any);
    } catch {
      return null;
    }
  }, [id]);

  const [phase, setPhase] = useState<ScreenPhase>('intro');
  const [finalElapsed, setFinalElapsed] = useState(0);

  const handleBegin = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPhase('active');
  }, []);

  const handleComplete = useCallback((elapsed: number) => {
    setFinalElapsed(elapsed);
    setPhase('complete');
  }, []);

  const handleDone = useCallback(() => {
    useRoutineStore.getState().markCompleted(id as RoutineID);
    goBack();
  }, [id]);

  const handleExit = useCallback(() => {
    goBack();
  }, []);

  if (!routine) {
    return (
      <ScreenView style={styles.errorContainer}>
        <ThemedText variant="h2">Routine Not Found</ThemedText>
        <ThemedText color="onSecondary" style={styles.errorText}>
          This routine could not be found.
        </ThemedText>
        <Button title="Go Back" variant="primary" onPress={goBack} />
      </ScreenView>
    );
  }

  return (
    <ScreenView
      edges={phase === 'intro' ? ['bottom'] : undefined}
      padded={phase !== 'intro'}
      style={phase === 'intro' ? styles.introScreen : styles.screen}
    >
      {phase === 'intro' && (
        <IntroPhase routine={routine} onBegin={handleBegin} />
      )}

      {phase === 'active' && (
        <ActivePhase
          routine={routine}
          onComplete={handleComplete}
          onExit={handleExit}
        />
      )}

      {phase === 'complete' && (
        <CompletePhase
          routine={routine}
          elapsedSeconds={finalElapsed}
          onDone={handleDone}
        />
      )}
    </ScreenView>
  );
};

export default RoutineScreen;

/* ─── Styles ───────────────────────────────────────────────── */

const styles = StyleSheet.create({
  /* Layout */
  screen: {
    flex: 1,
  },

  introScreen: {
    flex: 1,
    padding: 0,
  },

  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },

  errorText: {
    textAlign: 'center',
    maxWidth: 260,
  },

  /* ── Intro ── */

  introContainer: {
    flex: 1,
  },

  introImageWrapper: {
    width: '100%',
    height: '45%',
    position: 'absolute',
    top: 0,
  },

  introImage: {
    width: '100%',
    height: '100%',
  },

  introGradient: {
    ...StyleSheet.absoluteFillObject,
  },

  introContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: SPACE.xl,
    paddingBottom: SPACE.lg,
    gap: SPACE.lg,
  },

  introSummary: {
    ...TEXT.bodyLarge,
    lineHeight: 26,
  },

  introMeta: {
    flexDirection: 'row',
    gap: SPACE.md,
  },

  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACE.xs,
    backgroundColor: COLOR.secondary,
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE.sm,
    borderRadius: RADIUS.full,
  },

  productsSection: {
    gap: SPACE.sm,
  },

  productsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACE.sm,
  },

  productChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACE.xs,
    backgroundColor: COLOR.card,
    borderWidth: 1,
    borderColor: COLOR.border,
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE.sm,
    borderRadius: RADIUS.full,
  },

  introActions: {
    paddingHorizontal: SPACE.xl,
    paddingBottom: SPACE.xl,
  },

  /* ── Active ── */

  activeContainer: {
    flex: 1,
    gap: SPACE.lg,
  },

  activeTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  closeButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLOR.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACE.xs,
    backgroundColor: COLOR.secondary,
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE.sm,
    borderRadius: RADIUS.full,
  },

  timerText: {
    fontFamily: FONT.semiBold,
    fontVariant: ['tabular-nums'],
  },

  progressTrack: {
    height: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLOR.muted,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: RADIUS.full,
    backgroundColor: COLOR.primaryLight,
  },

  stepCounter: {
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },

  stepCard: {
    flex: 1,
    backgroundColor: COLOR.card,
    borderRadius: RADIUS['2xl'],
    borderWidth: 1,
    borderColor: COLOR.border,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACE.xl,
    boxShadow: SHADOW.lg,
  },

  stepContent: {
    alignItems: 'center',
    gap: SPACE.xl,
  },

  stepNumberCircle: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.full,
    backgroundColor: COLOR.primary,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: SHADOW.primary,
  },

  stepInstruction: {
    textAlign: 'center',
    lineHeight: 32,
    paddingHorizontal: SPACE.md,
  },

  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
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

  dotCompleted: {
    backgroundColor: 'hsla(250, 50%, 70%, 0.4)',
  },

  activeActions: {
    flexDirection: 'row',
    gap: SPACE.md,
  },

  /* ── Complete ── */

  completeContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: SPACE['2xl'],
  },

  completeContent: {
    alignItems: 'center',
    gap: SPACE.lg,
  },

  completeIconCircle: {
    width: 96,
    height: 96,
    borderRadius: RADIUS.full,
    backgroundColor: 'hsla(120, 50%, 50%, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACE.sm,
  },

  completeTitle: {
    textAlign: 'center',
  },

  completeSubtitle: {
    textAlign: 'center',
    ...TEXT.bodyLarge,
    lineHeight: 26,
    maxWidth: 300,
  },

  statsRow: {
    flexDirection: 'row',
    gap: SPACE.md,
    marginTop: SPACE.md,
  },

  statCard: {
    flex: 1,
    backgroundColor: COLOR.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLOR.border,
    padding: SPACE.lg,
    alignItems: 'center',
    gap: 4,
    boxShadow: SHADOW.sm,
  },
});
