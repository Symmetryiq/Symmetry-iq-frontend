import CircularProgress from "@/components/common/circle-progress";
import { Colors, Fonts } from "@/constants/theme";
import { Routine, RoutineId, RoutineImages } from "@/data/routines";
import { getRoutineById } from "@/helpers/routine";
import { scale, verticalScale } from "@/helpers/scaling";
import { router, useLocalSearchParams } from "expo-router";
import {
  CaretLeftIcon,
  CaretRightIcon,
  CheckIcon,
  PauseIcon,
  PlayIcon,
  XIcon,
} from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Params = { id?: RoutineId };

const STEP_DURATION = 60; // 60 seconds per step for now

const RoutinePlayer = () => {
  const { id } = useLocalSearchParams<Params>();
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeLeft, setTimeLeft] = useState(STEP_DURATION);

  useEffect(() => {
    if (id) {
      try {
        setRoutine(getRoutineById(id));
      } catch (e) {
        router.back();
      }
    }
  }, [id]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleNext();
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const handleNext = () => {
    if (!routine) return;
    if (currentStepIndex < routine.instructions.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setTimeLeft(STEP_DURATION); // Reset timer for next step
      setIsPlaying(true);
    } else {
      // Finished
      router.back();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setTimeLeft(STEP_DURATION);
      setIsPlaying(true);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (!routine) return null;

  const currentInstruction = routine.instructions[currentStepIndex];
  const progressPercent = ((STEP_DURATION - timeLeft) / STEP_DURATION) * 100;
  const isLastStep = currentStepIndex === routine.instructions.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.iconButton}>
          <XIcon color={Colors.onBackground} size={24} />
        </Pressable>
        <View style={styles.headerTextWrapper}>
          <Text style={styles.headerTitle}>{routine.title}</Text>
          <Text style={styles.headerSubtitle}>
            Step {currentStepIndex + 1} of {routine.instructions.length}
          </Text>
        </View>
        <View style={{ width: 40 }} /> {/* Spacer */}
      </View>

      {/* Visual / Image */}
      <View style={styles.visualContainer}>
        <Image
          style={styles.routineImage}
          source={RoutineImages[routine.id]}
          resizeMode="cover"
        />
        <View style={styles.darkOverlay} />
        <View style={styles.timerOverlay}>
          <CircularProgress
            progress={progressPercent}
            size={scale(180)}
            strokeWidth={14}
            progressCircleColor={Colors.primary}
            outerCircleColor="rgba(255,255,255,0.2)"
            labelColor={Colors.primary}
          />
          <View style={styles.timerTextContainer}>
            <Text style={styles.timerText}>
              0:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </Text>
          </View>
        </View>
      </View>

      {/* Instruction */}
      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>{currentInstruction}</Text>
      </View>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        <Pressable
          style={[styles.controlButton, currentStepIndex === 0 && { opacity: 0.5 }]}
          onPress={handlePrev}
          disabled={currentStepIndex === 0}
        >
          <CaretLeftIcon size={32} color={Colors.onSecondary} weight="bold" />
        </Pressable>

        <Pressable style={styles.playPauseButton} onPress={togglePlayPause}>
          {isPlaying ? (
            <PauseIcon size={40} color={Colors.onPrimary} weight="fill" />
          ) : (
            <PlayIcon size={40} color={Colors.onPrimary} weight="fill" />
          )}
        </Pressable>

        <Pressable style={styles.controlButton} onPress={handleNext}>
          {isLastStep ? (
            <CheckIcon size={32} color={Colors.success} weight="bold" />
          ) : (
            <CaretRightIcon size={32} color={Colors.onSecondary} weight="bold" />
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default RoutinePlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
  },
  iconButton: {
    padding: scale(8),
    backgroundColor: Colors.card,
    borderRadius: scale(20),
  },
  headerTextWrapper: {
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.onBackground,
  },
  headerSubtitle: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.onSecondary,
    marginTop: 2,
  },
  visualContainer: {
    width: "100%",
    height: verticalScale(350),
    justifyContent: "center",
    alignItems: "center",
    marginVertical: verticalScale(16),
    position: "relative",
  },
  routineImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  timerOverlay: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  timerTextContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  timerText: {
    fontFamily: Fonts.bold,
    fontSize: 48,
    color: "#fff",
  },
  instructionContainer: {
    flex: 1,
    paddingHorizontal: scale(24),
    justifyContent: "center",
    alignItems: "center",
  },
  instructionText: {
    fontFamily: Fonts.semiBold,
    fontSize: 24,
    color: Colors.onBackground,
    textAlign: "center",
    lineHeight: 34,
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: verticalScale(32),
    paddingHorizontal: scale(48),
    gap: scale(48),
  },
  controlButton: {
    padding: scale(16),
    backgroundColor: Colors.card,
    borderRadius: scale(32),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  playPauseButton: {
    padding: scale(24),
    backgroundColor: Colors.primary,
    borderRadius: scale(50),
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
});
