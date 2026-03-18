import Button from "@/components/common/button";
import CircularProgress from "@/components/common/circle-progress";
import ScreenWrapper from "@/components/common/screen-wrapper";
import Typography from "@/components/common/typography";
import { Colors, Fonts } from "@/constants/theme";
import { scale, verticalScale } from "@/helpers/scaling";
import { getColorByScore, getLabelByScore } from "@/helpers/scan";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LockSimpleIcon, SparkleIcon } from "phosphor-react-native";
import React, { useEffect } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const METRIC_LABELS: Record<string, string> = {
  eyeAlignment: "Eye Alignment",
  noseCentering: "Nose Centering",
  facialThirds: "Facial Thirds",
  cheekboneBalance: "Cheekbone Balance",
  jawlineSymmetry: "Jawline Symmetry",
  skinClarity: "Skin Clarity",
  facialPuffiness: "Facial Puffiness",
  chinAlignment: "Chin Alignment",
  eyebrowSymmetry: "Eyebrow Symmetry",
};

const DemoResults = () => {
  const router = useRouter();
  const { scores: scoresParam, image } = useLocalSearchParams();
  const data = JSON.parse(scoresParam as string);
  const overallScore = Math.round(data.overallSymmetry);
  const overallColor = getColorByScore(data.overallSymmetry, false);
  const overallLabel = getLabelByScore(data.overallSymmetry, false);

  // Shimmer animation for locked cards
  const shimmerOpacity = useSharedValue(0.4);

  useEffect(() => {
    shimmerOpacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 1200 }),
        withTiming(0.4, { duration: 1200 }),
      ),
      -1,
      true,
    );
  }, [shimmerOpacity]);

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: shimmerOpacity.value,
  }));

  const lockedMetrics = Object.entries(METRIC_LABELS);

  return (
    <ScreenWrapper>
      <LinearGradient
        colors={[Colors.primaryLight, "transparent"]}
        locations={[0, 0.5]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
          <Typography size={22} font="bold" center>
            Your Facial Report
          </Typography>
        </Animated.View>

        {/* Avatar */}
        <Animated.View
          entering={FadeIn.duration(700).delay(100)}
          style={styles.avatarWrap}
        >
          <Image source={{ uri: image as string }} style={styles.avatar} />
        </Animated.View>

        {/* Overall Score — unlocked */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(200)}
          style={styles.overallCard}
        >
          <View style={styles.overallLeft}>
            <Typography size={14} color="onMuted" font="medium">
              OVERALL SYMMETRY
            </Typography>
            <View style={styles.overallScoreRow}>
              <Typography size={48} font="bold" style={{ color: overallColor }}>
                {overallScore}%
              </Typography>
            </View>
            <Typography
              size={14}
              font="semiBold"
              style={{ color: overallColor }}
            >
              {overallLabel}
            </Typography>
          </View>
          <CircularProgress
            progress={overallScore}
            size={scale(80)}
            strokeWidth={scale(6)}
            progressCircleColor={overallColor}
            outerCircleColor={Colors.border}
            showLabel={false}
          />
        </Animated.View>

        {/* Locked Metrics Grid */}
        <Animated.View entering={FadeInDown.duration(500).delay(400)}>
          <View style={styles.sectionHeader}>
            <LockSimpleIcon size={16} weight="fill" color={Colors.onMuted} />
            <Typography size={14} color="onMuted" font="medium">
              DETAILED BREAKDOWN
            </Typography>
          </View>

          <View style={styles.lockedGrid}>
            {lockedMetrics.map(([key, label], idx) => (
              <Animated.View
                key={key}
                entering={FadeInDown.duration(350).delay(450 + idx * 60)}
                style={styles.lockedCard}
              >
                <View style={styles.lockedCardHeader}>
                  <Typography
                    size={13}
                    font="medium"
                    color="onSecondary"
                    textProps={{ numberOfLines: 1 }}
                  >
                    {label}
                  </Typography>
                  <LockSimpleIcon
                    size={14}
                    weight="fill"
                    color={Colors.onMuted}
                  />
                </View>

                {/* Blurred score */}
                <Animated.View style={[styles.blurredScore, shimmerStyle]}>
                  <Typography size={28} font="bold" style={styles.blurredText}>
                    ??%
                  </Typography>
                </Animated.View>

                {/* Fake progress bar */}
                <View style={styles.track}>
                  <Animated.View style={[styles.fakeFill, shimmerStyle]} />
                </View>
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      {/* CTA Footer */}
      <Animated.View
        entering={FadeInDown.duration(500).delay(800)}
        style={styles.footer}
      >
        <View style={styles.ctaRow}>
          <SparkleIcon size={20} weight="fill" color={Colors.primary} />
          <Typography size={13} color="onSecondary" center>
            Unlock all 10 metrics, routines, and daily tasks
          </Typography>
        </View>

        <Button
          onPress={() => router.push("/onboarding/purchase")}
          style={styles.ctaButton}
        >
          <Typography font="bold" color="onPrimary" size={18}>
            Unlock Full Report
          </Typography>
        </Button>
      </Animated.View>
    </ScreenWrapper>
  );
};

export default DemoResults;

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(16),
  },
  header: {
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(8),
  },
  avatarWrap: {
    alignItems: "center",
    marginBottom: verticalScale(16),
  },
  avatar: {
    width: scale(88),
    height: scale(88),
    borderRadius: scale(44),
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  overallCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: scale(20),
    marginBottom: verticalScale(20),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  overallLeft: {
    flex: 1,
    gap: verticalScale(2),
  },
  overallScoreRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: scale(4),
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
    marginBottom: verticalScale(12),
  },
  lockedGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: scale(10),
  },
  lockedCard: {
    width: "48%",
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: scale(14),
    borderWidth: 1,
    borderColor: Colors.border,
    gap: verticalScale(6),
  },
  lockedCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  blurredScore: {
    alignItems: "flex-start",
  },
  blurredText: {
    color: Colors.onMuted,
    fontFamily: Fonts.bold,
  },
  track: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 100,
    overflow: "hidden",
  },
  fakeFill: {
    height: "100%",
    width: "55%",
    backgroundColor: Colors.muted,
    borderRadius: 100,
  },
  footer: {
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(16),
    paddingTop: verticalScale(8),
    gap: verticalScale(12),
    backgroundColor: Colors.background,
  },
  ctaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(6),
  },
  ctaButton: {
    width: "100%",
    paddingVertical: verticalScale(16),
    borderRadius: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});
