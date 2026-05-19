import Button from '@/components/Button';
import Input from '@/components/Input';
import ScreenView from '@/components/ScreenView';
import Select from '@/components/Select';
import ThemedText from '@/components/ThemedText';
import { QUESTIONS } from '@/constants/questions';
import { COLOR, RADIUS, SPACE } from '@/constants/theme';
import { useOnboardingStore } from '@/hooks/useOnboardingStore';
import { navigateTo } from '@/utils/router.util';
import { verticalScale } from '@/utils/scaling.util';
import { useNavigation } from 'expo-router';
import { ArrowLeftIcon, ArrowRightIcon } from 'phosphor-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  BackHandler,
  Keyboard,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const DURATION = 350;

type Step = (typeof QUESTIONS)[number];

const QuestionsScreen = () => {
  const { currentIndex, answers, setAnswer, next, back, canContinue } =
    useOnboardingStore();
  const { width: screenWidth } = useWindowDimensions();
  const navigation = useNavigation();

  const direction = useRef<'forward' | 'backward'>('forward');
  const step = QUESTIONS[currentIndex];
  const progress = (currentIndex + 1) / QUESTIONS.length;
  const isFirst = currentIndex === 0;
  const isValid = canContinue();

  const [leavingStep, setLeavingStep] = useState<Step | null>(null);
  const leavingX = useSharedValue(0);
  const currentX = useSharedValue(0);

  const animateSwap = useCallback(
    (mode: 'forward' | 'backward', stepLeaving: Step) => {
      const exitTo = mode === 'forward' ? -screenWidth : screenWidth;
      const enterFrom = -exitTo;

      setLeavingStep(stepLeaving);
      leavingX.value = 0;
      currentX.value = enterFrom;

      leavingX.value = withTiming(exitTo, { duration: DURATION });
      currentX.value = withTiming(0, { duration: DURATION }, (finished) => {
        if (finished) runOnJS(setLeavingStep)(null);
      });
    },
    [screenWidth, leavingX, currentX],
  );

  const handleContinue = useCallback(() => {
    if (Keyboard.isVisible()) Keyboard.dismiss();
    if (!isValid) return;

    direction.current = 'forward';

    // Last question — navigate without inline transition (router handles it)
    if (currentIndex >= QUESTIONS.length - 1) {
      next();
      navigateTo('/onboarding/demo');
      return;
    }

    animateSwap('forward', step);
    next();
  }, [isValid, currentIndex, next, step, animateSwap]);

  const handleBack = useCallback(() => {
    if (Keyboard.isVisible()) Keyboard.dismiss();
    if (isFirst) return;
    direction.current = 'backward';
    animateSwap('backward', step);
    back();
  }, [isFirst, back, step, animateSwap]);

  // android back handler
  useEffect(() => {
    const backAction = () => {
      if (isFirst) return false;
      handleBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [isFirst, handleBack]);

  // ios back handler
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (isFirst) return;
      e.preventDefault();
      handleBack();
    });

    return unsubscribe;
  }, [handleBack, isFirst, navigation]);

  // Animated progress bar width
  const progressStyle = useAnimatedStyle(() => ({
    width: withTiming(`${progress * 100}%` as any, { duration: DURATION }),
  }));

  const leavingStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: leavingX.value }],
  }));

  const currentStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: currentX.value }],
  }));

  return (
    <ScreenView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.header}>
            {!isFirst && (
              <Pressable
                onPress={handleBack}
                style={[styles.backButton]}
                disabled={isFirst}
                hitSlop={12}
              >
                <ArrowLeftIcon size={24} color={COLOR.onBackground} />
              </Pressable>
            )}

            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressFill, progressStyle]} />
            </View>
          </View>

          <View style={styles.contentSlot}>
            {leavingStep && (
              <QuestionPanel
                step={leavingStep}
                animatedStyle={leavingStyle}
                interactive={false}
                answers={answers}
                setAnswer={setAnswer}
              />
            )}
            <QuestionPanel
              step={step}
              animatedStyle={currentStyle}
              interactive
              answers={answers}
              setAnswer={setAnswer}
            />
          </View>

          <Button
            title={currentIndex >= QUESTIONS.length - 1 ? 'Finish' : 'Continue'}
            size="lg"
            iconPosition="right"
            icon={ArrowRightIcon}
            onPress={handleContinue}
            disabled={!isValid}
          />
        </View>
      </TouchableWithoutFeedback>
    </ScreenView>
  );
};

type PanelProps = {
  step: Step;
  animatedStyle: ReturnType<typeof useAnimatedStyle>;
  interactive: boolean;
  answers: ReturnType<typeof useOnboardingStore.getState>['answers'];
  setAnswer: ReturnType<typeof useOnboardingStore.getState>['setAnswer'];
};

const QuestionPanel = ({
  step,
  animatedStyle,
  interactive,
  answers,
  setAnswer,
}: PanelProps) => {
  const currentAnswer = answers[step.id] ?? (step.type === 'multi' ? [] : '');

  const selectOptions =
    step.type !== 'text'
      ? step.options.map((o) => ({
          value: o.value,
          label: o.label,
          icon: o.icon
            ? o.icon.type === 'emoji'
              ? o.icon.value
              : o.icon.value
            : undefined,
        }))
      : [];

  return (
    <Animated.View
      style={[styles.content, animatedStyle]}
      pointerEvents={interactive ? 'auto' : 'none'}
    >
      <View style={styles.titleBlock}>
        <ThemedText variant="h2" color="onBackground" style={styles.centered}>
          {step.title}
        </ThemedText>
        <ThemedText variant="body" color="onMuted" style={styles.centered}>
          {step.subtitle}
        </ThemedText>
      </View>

      <View style={styles.fieldContainer}>
        {step.type === 'text' ? (
          <Input
            value={currentAnswer as string}
            onChangeText={(text) => setAnswer(step.id, text)}
            placeholder={step.placeholder}
            keyboardType={step.keyboardType}
          />
        ) : (
          <Select
            options={selectOptions}
            value={currentAnswer}
            onChange={(val) => setAnswer(step.id, val)}
            multi={step.type === 'multi'}
          />
        )}
      </View>
    </Animated.View>
  );
};

export default QuestionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: verticalScale(28),
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACE.md,
    marginBottom: SPACE['2xl'],
  },
  backButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLOR.border,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: COLOR.muted,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLOR.primary,
    borderRadius: RADIUS.full,
  },
  contentSlot: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    gap: SPACE['2xl'],
  },
  titleBlock: {
    gap: SPACE.sm,
    alignItems: 'center',
    paddingHorizontal: SPACE.lg,
  },
  centered: {
    textAlign: 'center',
  },
  fieldContainer: {
    flex: 1,
  },
});
