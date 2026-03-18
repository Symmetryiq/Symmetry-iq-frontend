import Button from "@/components/common/button";
import Input from "@/components/common/input";
import ScreenWrapper from "@/components/common/screen-wrapper";
import Selectable from "@/components/common/selectable";
import Typography from "@/components/common/typography";
import { Colors } from "@/constants/theme";
import { scale, verticalScale } from "@/helpers/scaling";
import {
  ChewingSide,
  CommitmentLevel,
  ConfidenceLevel,
  DietType,
  Gender,
  SleepPosition,
  useOnboardingStore,
} from "@/stores/onboarding-store";
import { useRouter } from "expo-router";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CaretLeftIcon,
  GenderFemaleIcon,
  GenderMaleIcon,
  StarIcon,
} from "phosphor-react-native";
import React, { useCallback, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

// ─── Step option type ──────────────────────────────────────────
interface StepOption {
  label: string;
  value: string;
  emoji?: string;
  iconName?: string;
}

const ICON_MAP: Record<string, any> = {
  "gender-male": GenderMaleIcon,
  "gender-female": GenderFemaleIcon,
  "arrow-left": ArrowLeftIcon,
  "arrow-right": ArrowRightIcon,
  "arrow-up": ArrowUpIcon,
};

// ─── Step config type ──────────────────────────────────────────
interface OnboardingStep {
  id: string;
  type: "text-input" | "single-select" | "multi-select" | "rating";
  title: string;
  subtitle: string;
  placeholder?: string;
  keyboardType?: "default" | "number-pad";
  options?: StepOption[];
}

// ─── All onboarding steps ──────────────────────────────────────
const STEPS: OnboardingStep[] = [
  {
    id: "name",
    type: "text-input",
    title: "What's your name?",
    subtitle: "We'll personalize your report.",
    placeholder: "Enter your name",
    keyboardType: "default",
  },
  {
    id: "age",
    type: "text-input",
    title: "What's your age?",
    subtitle: "Your age affects your facial symmetry.",
    placeholder: "Enter your age",
    keyboardType: "number-pad",
  },
  {
    id: "gender",
    type: "single-select",
    title: "Select your gender",
    subtitle: "This helps us analyze your face more accurately",
    options: [
      { label: "Male", value: "male", iconName: "gender-male" },
      { label: "Female", value: "female", iconName: "gender-female" },
    ],
  },
  {
    id: "goal",
    type: "multi-select",
    title: "What are your goals?",
    subtitle: "Select one or more reasons you'd like to improve your face.",
    options: [
      { label: "Improve overall facial symmetry", value: "0", emoji: "🪞" },
      { label: "Reduce puffiness and bloating", value: "1", emoji: "😴" },
      { label: "Define jawline and muscles", value: "2", emoji: "💪" },
      { label: "Track progress and visual changes", value: "3", emoji: "📈" },
    ],
  },
  {
    id: "sleep",
    type: "single-select",
    title: "How do you usually sleep?",
    subtitle: "Your sleeping position can affect your facial balance.",
    options: [
      { label: "Back", value: "back", iconName: "arrow-left" },
      { label: "Side", value: "side", iconName: "arrow-right" },
      { label: "Stomach", value: "stomach", iconName: "arrow-up" },
    ],
  },
  {
    id: "diet",
    type: "single-select",
    title: "How clean is your diet?",
    subtitle: "Having a bad diet can impact various facial factors.",
    options: [
      { label: "Mostly Junky", value: "mostly-junky", emoji: "🍕" },
      { label: "Mixed", value: "mixed", emoji: "🥪" },
      { label: "Clean", value: "clean", emoji: "🥗" },
    ],
  },
  {
    id: "chewing",
    type: "single-select",
    title: "Do you chew mostly on one side?",
    subtitle: "Your chewing position can impact your mouth.",
    options: [
      { label: "Left", value: "left", iconName: "arrow-left" },
      { label: "Right", value: "right", iconName: "arrow-right" },
      { label: "Balanced", value: "balanced", iconName: "arrow-up" },
    ],
  },
  {
    id: "confidence",
    type: "single-select",
    title: "How do you feel about your face in photos?",
    subtitle: "Be honest, this helps us understand your confidence level",
    options: [
      { label: "Love it", value: "love-it", emoji: "😍" },
      { label: "Like it", value: "like-it", emoji: "😀" },
      { label: "Dislike it", value: "dislike-it", emoji: "😔" },
      { label: "Avoid photos", value: "avoid-photos", emoji: "😩" },
    ],
  },
  {
    id: "impact",
    type: "multi-select",
    title: "How does facial symmetry affect you?",
    subtitle: "Select all that apply.",
    options: [
      { label: "I avoid photos/selfies", value: "0", emoji: "📸" },
      {
        label: "I feel less confident in social settings",
        value: "1",
        emoji: "😔",
      },
      {
        label: "I think about it multiple times a day",
        value: "2",
        emoji: "🤔",
      },
      { label: "I've tried fixing it before", value: "3", emoji: "🪄" },
      {
        label: "I've never understood why my face looks uneven",
        value: "4",
        emoji: "😶",
      },
    ],
  },
  {
    id: "commitment",
    type: "single-select",
    title: "Are you committed to following our routines?",
    subtitle:
      "If we made you a daily routine to fix asymmetry, will you follow it?",
    options: [
      {
        label: "Yes, I'm done being uneven",
        value: "yes-committed",
        emoji: "✅",
      },
      {
        label: "No, I'll just pay for surgery",
        value: "no-surgery",
        emoji: "💸",
      },
      {
        label: "No, I'll stay asymmetrical forever",
        value: "no-stay-uneven",
        emoji: "☠️",
      },
    ],
  },
  {
    id: "rating",
    type: "rating",
    title: "Are you happy with our app?",
    subtitle: "Give us feedback by rating our app. This helps us improve!",
  },
];

const TOTAL_STEPS = STEPS.length;
const NUM_STARS = 5;

// ─── Option icon renderer ──────────────────────────────────────
const OptionIcon = ({
  option,
  selected,
}: {
  option: StepOption;
  selected: boolean;
}) => {
  if (option.emoji) {
    return <Typography size={20}>{option.emoji}</Typography>;
  }
  if (option.iconName) {
    const Icon = ICON_MAP[option.iconName];
    if (Icon) {
      return (
        <Icon
          size={24}
          color={selected ? Colors.onPrimary : Colors.onSecondary}
          weight={"regular"}
        />
      );
    }
  }
  return null;
};

// ─── Main component ────────────────────────────────────────────
const OnboardingSteps = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const progressWidth = useSharedValue(1 / TOTAL_STEPS);

  const {
    name,
    setName,
    age,
    setAge,
    gender,
    setGender,
    goals,
    setGoals,
    sleepPosition,
    setSleepPosition,
    dietType,
    setDietType,
    chewingSide,
    setChewingSide,
    confidenceLevel,
    setConfidenceLevel,
    impactFactors,
    setImpactFactors,
    commitmentLevel,
    setCommitmentLevel,
    rating,
    setRating,
  } = useOnboardingStore();

  const step = STEPS[currentStep];

  // ─── Get current value for the active step ─────────────
  const getCurrentValue = useCallback((): any => {
    switch (step.id) {
      case "name":
        return name;
      case "age":
        return age;
      case "gender":
        return gender;
      case "goal":
        return goals;
      case "sleep":
        return sleepPosition;
      case "diet":
        return dietType;
      case "chewing":
        return chewingSide;
      case "confidence":
        return confidenceLevel;
      case "impact":
        return impactFactors;
      case "commitment":
        return commitmentLevel;
      case "rating":
        return rating;
      default:
        return null;
    }
  }, [
    step.id,
    name,
    age,
    gender,
    goals,
    sleepPosition,
    dietType,
    chewingSide,
    confidenceLevel,
    impactFactors,
    commitmentLevel,
    rating,
  ]);

  // ─── Set value for the active step ─────────────────────
  const setCurrentValue = useCallback(
    (value: any) => {
      switch (step.id) {
        case "name":
          setName(value);
          break;
        case "age":
          setAge(value);
          break;
        case "gender":
          setGender(value as Gender);
          break;
        case "goal":
          setGoals(value);
          break;
        case "sleep":
          setSleepPosition(value as SleepPosition);
          break;
        case "diet":
          setDietType(value as DietType);
          break;
        case "chewing":
          setChewingSide(value as ChewingSide);
          break;
        case "confidence":
          setConfidenceLevel(value as ConfidenceLevel);
          break;
        case "impact":
          setImpactFactors(value);
          break;
        case "commitment":
          setCommitmentLevel(value as CommitmentLevel);
          break;
        case "rating":
          setRating(value);
          break;
      }
    },
    [
      step.id,
      setName,
      setAge,
      setGender,
      setGoals,
      setSleepPosition,
      setDietType,
      setChewingSide,
      setConfidenceLevel,
      setImpactFactors,
      setCommitmentLevel,
      setRating,
    ],
  );

  // ─── Can continue? ─────────────────────────────────────
  const canContinue = useCallback((): boolean => {
    const value = getCurrentValue();
    if (step.type === "text-input")
      return typeof value === "string" && value.trim().length > 0;
    if (step.type === "multi-select")
      return Array.isArray(value) && value.length > 0;
    if (step.type === "rating") return value !== null;
    return value !== null && value !== undefined;
  }, [getCurrentValue, step.type]);

  // ─── Navigation ────────────────────────────────────────
  const animateProgress = (nextStep: number) => {
    progressWidth.value = withTiming((nextStep + 1) / TOTAL_STEPS, {
      duration: 350,
    });
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      const next = currentStep + 1;
      animateProgress(next);
      setCurrentStep(next);
    } else {
      // Last step → go to demo scan
      router.push("/onboarding/demo");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      const prev = currentStep - 1;
      animateProgress(prev);
      setCurrentStep(prev);
    } else {
      router.back();
    }
  };

  // ─── Toggle handler for multi-select ───────────────────
  const handleMultiToggle = (idx: number) => {
    const current: number[] = getCurrentValue() || [];
    if (current.includes(idx)) {
      setCurrentValue(current.filter((i: number) => i !== idx));
    } else {
      setCurrentValue([...current, idx]);
    }
  };

  // ─── Progress bar style ─────────────────────────────────
  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
  }));

  // ─── Render step content ────────────────────────────────
  const renderStepContent = () => {
    const value = getCurrentValue();

    if (step.type === "text-input") {
      return (
        <Input
          placeholder={step.placeholder}
          keyboardType={step.keyboardType}
          onChangeText={(text: string) => setCurrentValue(text)}
          value={value || ""}
          inputStyle={{ color: Colors.onCard }}
        />
      );
    }

    if (step.type === "single-select" && step.options) {
      return (
        <View style={styles.selectableWrapper}>
          {step.options.map((option, idx) => (
            <Animated.View
              key={option.value}
              entering={FadeIn.duration(300).delay(idx * 80)}
            >
              <Selectable
                label={option.label}
                icon={
                  <OptionIcon
                    option={option}
                    selected={value === option.value}
                  />
                }
                selected={value === option.value}
                onPress={() => setCurrentValue(option.value)}
              />
            </Animated.View>
          ))}
        </View>
      );
    }

    if (step.type === "multi-select" && step.options) {
      const selectedIndices: number[] = value || [];
      return (
        <View style={styles.selectableWrapper}>
          {step.options.map((option, idx) => (
            <Animated.View
              key={option.value}
              entering={FadeIn.duration(300).delay(idx * 80)}
            >
              <Selectable
                label={option.label}
                icon={
                  <OptionIcon
                    option={option}
                    selected={selectedIndices.includes(idx)}
                  />
                }
                selected={selectedIndices.includes(idx)}
                onPress={() => handleMultiToggle(idx)}
              />
            </Animated.View>
          ))}
        </View>
      );
    }

    if (step.type === "rating") {
      return (
        <View style={styles.ratingContainer}>
          {Array.from({ length: NUM_STARS }, (_, idx) => {
            const starValue = idx + 1;
            return (
              <TouchableOpacity
                key={starValue}
                onPress={() => setCurrentValue(starValue)}
                accessibilityLabel={`Rate ${starValue} star${starValue > 1 ? "s" : ""}`}
                accessibilityState={{ selected: value === starValue }}
                activeOpacity={0.8}
                style={styles.starButton}
              >
                <StarIcon
                  weight={
                    value !== null && value >= starValue ? "fill" : "regular"
                  }
                  size={32}
                  color={
                    value !== null && value >= starValue
                      ? Colors.primary
                      : Colors.onMuted
                  }
                />
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }

    return null;
  };

  // ─── Wrapper for keyboard-aware text inputs ─────────────
  const content = (
    <ScreenWrapper>
      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <Animated.View style={[styles.progressBarFill, progressStyle]} />
      </View>

      {/* Back Button */}
      <View style={styles.headerRow}>
        <Pressable onPress={handleBack} hitSlop={12}>
          <CaretLeftIcon size={28} color={Colors.onBackground} />
        </Pressable>
        <Typography color="onMuted" size={14}>
          {currentStep + 1} / {TOTAL_STEPS}
        </Typography>
      </View>

      {/* Content Card */}
      <View style={styles.contentContainer}>
        <Animated.View
          key={step.id}
          entering={SlideInRight.duration(350).springify().damping(60)}
          exiting={SlideOutLeft.duration(250)}
          style={styles.contentWrapper}
        >
          <View>
            <Typography color="onBackground" font="semiBold" size={32}>
              {step.title}
            </Typography>
            <Typography color="onSecondary">{step.subtitle}</Typography>
          </View>

          {renderStepContent()}
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(100)}
        >
          <Button onPress={handleNext} disabled={!canContinue()}>
            <Typography color="onSecondary" font="bold">
              {currentStep === TOTAL_STEPS - 1 ? "Try a Free Scan" : "Continue"}
            </Typography>
          </Button>
        </Animated.View>
      </View>
    </ScreenWrapper>
  );

  // Wrap in KeyboardAvoidingView for text inputs
  if (step.type === "text-input") {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 1 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{ flex: 1 }}>{content}</View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }

  return content;
};

export default OnboardingSteps;

// ─── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  progressBarContainer: {
    height: verticalScale(4),
    backgroundColor: Colors.muted,
    marginHorizontal: scale(16),
    marginTop: verticalScale(8),
    borderRadius: 100,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 100,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
    marginVertical: verticalScale(12),
  },
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.card,
    borderTopLeftRadius: verticalScale(50),
    borderTopRightRadius: verticalScale(50),
    marginTop: 8,
    borderCurve: "continuous",
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(32),
    paddingBottom: verticalScale(16),
  },
  contentWrapper: {
    flex: 1,
    justifyContent: "center",
    gap: verticalScale(24),
  },
  selectableWrapper: {
    gap: verticalScale(12),
  },
  ratingContainer: {
    flexDirection: "row",
    gap: verticalScale(16),
    justifyContent: "space-around",
    backgroundColor: Colors.muted,
    padding: verticalScale(16),
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: verticalScale(18),
    alignItems: "center",
    marginTop: verticalScale(16),
    marginBottom: verticalScale(8),
  },
  starButton: {
    padding: verticalScale(4),
    borderRadius: verticalScale(8),
  },
});
