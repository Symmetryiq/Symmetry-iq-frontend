import {
  Animation,
  Colors,
  Fonts,
  Layout,
  Radii,
  Shadows,
  Spacing,
} from "@/constants/theme";
import { RoutineId, RoutineImages } from "@/data/routines";
import { getRoutineById } from "@/helpers/routine";
import { moderateScale } from "@/helpers/scaling";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  ClockCountdown,
  ListChecks,
  LockSimple,
  Play,
} from "phosphor-react-native";
import React, { useCallback } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Badge, Text } from "../ui";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ─── Types ──────────────────────────────────────────────────────────────────────
type RoutineCardProps = {
  routineId: RoutineId;
  locked?: boolean;
};

// ─── Component ──────────────────────────────────────────────────────────────────
const RoutineCard = ({ routineId, locked = false }: RoutineCardProps) => {
  const routine = getRoutineById(routineId);
  const stepCount = routine.instructions.length;

  // ── Pressable animation ──
  const cardScale = useSharedValue(1);

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const handlePressIn = useCallback(() => {
    cardScale.value = withTiming(0.97, {
      duration: Animation.duration.fast,
    });
  }, []);

  const handlePressOut = useCallback(() => {
    cardScale.value = withTiming(1, {
      duration: Animation.duration.fast,
    });
  }, []);

  const handlePress = useCallback(() => {
    if (locked) return;
    router.push({
      pathname: "/routines/[id]",
      params: { id: routine.id },
    });
  }, [locked, routine.id]);

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={locked}
      style={[styles.card, animatedCardStyle]}
    >
      {/* ─── Hero Image ──────────────────────────────────────────────── */}
      <View style={styles.imageContainer}>
        <Image
          source={RoutineImages[routine.id]}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Gradient overlay — cinematic bottom fade */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.25)", Colors.card]}
          locations={[0, 0.55, 1]}
          style={styles.imageGradient}
        />

        {/* ── Floating Duration Pill (top-right) ── */}
        <View style={styles.durationPill}>
          <BlurView
            intensity={40}
            tint="dark"
            experimentalBlurMethod="dimezisBlurView"
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.durationPillContent}>
            <ClockCountdown
              weight="bold"
              size={moderateScale(13)}
              color={Colors.onPrimary}
            />
            <Text
              variant="overline"
              color={Colors.onPrimary}
              style={styles.durationText}
            >
              {routine.duration.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* ── Steps count pill (bottom-left, floating over the gradient) ── */}
        <View style={styles.stepsIndicator}>
          <ListChecks
            weight="bold"
            size={moderateScale(13)}
            color={Colors.primary}
          />
          <Text variant="overline" color={Colors.primary}>
            {stepCount} STEPS
          </Text>
        </View>
      </View>

      {/* ─── Content Area ────────────────────────────────────────────── */}
      <View style={styles.content}>
        {/* Title */}
        <Text
          variant="h4"
          color={Colors.onCard}
          numberOfLines={1}
        >
          {routine.title}
        </Text>

        {/* Description */}
        <Text
          variant="body2"
          color={Colors.onSecondary}
          numberOfLines={2}
          style={styles.description}
        >
          {routine.description}
        </Text>

        {/* ── Action Row ── */}
        <View style={styles.actionRow}>
          {/* Products badge - shows if routine needs equipment */}
          {routine.products.length > 0 &&
            routine.products[0] !== "None" && (
              <Badge
                label={routine.products[0]}
                variant="soft"
                color="info"
                size="sm"
                style={styles.productBadge}
              />
            )}

          {/* Spacer pushes button to the right */}
          <View style={{ flex: 1 }} />

          {/* Start Button */}
          <Pressable
            style={({ pressed }) => [
              styles.startButton,
              pressed && styles.startButtonPressed,
            ]}
            onPress={handlePress}
            disabled={locked}
            hitSlop={Layout.hitSlop}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.startButtonGradient}
            >
              <Play
                weight="fill"
                size={moderateScale(16)}
                color={Colors.onPrimary}
              />
              <Text
                variant="button"
                color={Colors.onPrimary}
                style={styles.startButtonLabel}
              >
                Start
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>

      {/* ─── Locked Overlay ──────────────────────────────────────────── */}
      {locked && (
        <View style={styles.lockedOverlay}>
          <BlurView
            intensity={25}
            tint="dark"
            experimentalBlurMethod="dimezisBlurView"
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.lockedContent}>
            <View style={styles.lockedIconRing}>
              <LockSimple
                weight="fill"
                size={moderateScale(28)}
                color={Colors.onPrimary}
              />
            </View>
            <Text variant="subtitle1" color={Colors.onPrimary}>
              Coming Soon
            </Text>
            <Text
              variant="caption"
              color={Colors.onSecondary}
              style={{ opacity: 0.7 }}
            >
              This routine is being prepared for you
            </Text>
          </View>
        </View>
      )}
    </AnimatedPressable>
  );
};

export default RoutineCard;

// ─── Styles ─────────────────────────────────────────────────────────────────────
const CARD_RADIUS = Radii["2xl"];

const styles = StyleSheet.create({
  // ─── Card shell ───
  card: {
    backgroundColor: Colors.card,
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: "hidden",
    ...Shadows.md,
  },

  // ─── Image ───
  imageContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  imageGradient: {
    ...StyleSheet.absoluteFillObject,
  },

  // ─── Floating pills ───
  durationPill: {
    position: "absolute",
    top: Spacing.md,
    right: Spacing.md,
    borderRadius: Radii.full,
    overflow: "hidden",
  },

  durationPillContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(4),
    paddingVertical: moderateScale(5),
    paddingHorizontal: Spacing.sm,
  },

  durationText: {
    letterSpacing: 0.8,
  },

  stepsIndicator: {
    position: "absolute",
    bottom: Spacing.md,
    left: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(4),
    backgroundColor: Colors.primaryLight,
    paddingVertical: moderateScale(4),
    paddingHorizontal: Spacing.sm,
    borderRadius: Radii.full,
  },

  // ─── Content ───
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    gap: moderateScale(6),
  },

  description: {
    opacity: 0.85,
  },

  // ─── Action Row ───
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },

  productBadge: {
    maxWidth: "60%",
  },

  // ─── Start Button (gradient) ───
  startButton: {
    borderRadius: Radii.full,
    overflow: "hidden",
    ...Shadows.glow,
  },

  startButtonPressed: {
    opacity: 0.85,
  },

  startButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    gap: moderateScale(6),
    borderRadius: Radii.full,
  },

  startButtonLabel: {
    fontFamily: Fonts.semiBold,
  },

  // ─── Locked ───
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  lockedContent: {
    alignItems: "center",
    gap: Spacing.sm,
  },

  lockedIconRing: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: Radii.full,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
});
