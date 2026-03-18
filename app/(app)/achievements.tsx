import BackButton from "@/components/common/back-button";
import ScreenWrapper from "@/components/common/screen-wrapper";
import Typography from "@/components/common/typography";
import { Colors } from "@/constants/theme";
import { Achievements as AchievementsData } from "@/data/achievements";
import { scale, verticalScale } from "@/helpers/scaling";
import { useAchievementStore } from "@/stores/achievement-store";
import { LockKey } from "phosphor-react-native";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const AchievementsScreen = () => {
  const { unlockedIds } = useAchievementStore();

  const groupedAchievements = useMemo(() => {
    return AchievementsData.reduce((acc, achievement) => {
      const cat = achievement.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(achievement);
      return acc;
    }, {} as Record<string, typeof AchievementsData>);
  }, []);

  const totalUnlocked = unlockedIds.length;
  const totalAvailable = AchievementsData.length;
  const progressPercent = Math.round((totalUnlocked / totalAvailable) * 100);

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <BackButton />
        <Typography color="onSecondary">My Achievements</Typography>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.summaryContainer}>
          <Typography size={32} font="bold" color="onBackground">
            Trophy Room
          </Typography>
          <View style={styles.progressBarWrapper}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${progressPercent}%` },
                ]}
              />
            </View>
            <View style={styles.progressTextRow}>
              <Typography size={14} color="onSecondary">
                Progress
              </Typography>
              <Typography size={14} font="bold" color="onBackground">
                {totalUnlocked} / {totalAvailable}
              </Typography>
            </View>
          </View>
        </View>

        {Object.entries(groupedAchievements).map(([category, items]) => (
          <View key={category} style={styles.categorySection}>
            <Typography size={22} font="semiBold" color="onBackground" style={styles.categoryTitle}>
              {category}
            </Typography>

            <View style={styles.achievementsGrid}>
              {items.map((achievement) => {
                const isUnlocked = unlockedIds.includes(achievement.id);
                const Icon = achievement.icon;

                return (
                  <View
                    key={achievement.id}
                    style={[
                      styles.achievementCard,
                      !isUnlocked && styles.achievementCardLocked,
                    ]}
                  >
                    <View style={styles.iconContainer}>
                      {isUnlocked ? (
                        <Icon size={32} color={achievement.color} weight="duotone" />
                      ) : (
                        <LockKey size={32} color={Colors.onMuted} weight="duotone" />
                      )}
                    </View>
                    <Typography
                      size={16}
                      font="bold"
                      color={isUnlocked ? "onBackground" : "onSecondary"}
                      style={styles.achievementTitle}
                    >
                      {achievement.secret && !isUnlocked ? "Secret Achievement" : achievement.title}
                    </Typography>
                    <Typography
                      size={13}
                      color="onTertiary"
                      style={styles.achievementDesc}
                    >
                      {achievement.secret && !isUnlocked
                        ? "Keep playing to discover how to unlock this."
                        : achievement.description}
                    </Typography>
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </ScreenWrapper>
  );
};

export default AchievementsScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
  },
  scrollContent: {
    paddingBottom: verticalScale(40),
  },
  summaryContainer: {
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(16),
    gap: verticalScale(16),
  },
  progressBarWrapper: {
    gap: verticalScale(8),
  },
  progressBar: {
    width: "100%",
    height: verticalScale(10),
    backgroundColor: Colors.border,
    borderRadius: verticalScale(5),
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: verticalScale(5),
  },
  progressTextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  categorySection: {
    paddingHorizontal: scale(20),
    marginBottom: verticalScale(24),
  },
  categoryTitle: {
    marginBottom: verticalScale(12),
  },
  achievementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: scale(12),
  },
  achievementCard: {
    width: "48%",
    backgroundColor: Colors.card,
    borderRadius: verticalScale(16),
    padding: scale(16),
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.3)",
    alignItems: "center",
    gap: verticalScale(8),
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  achievementCardLocked: {
    backgroundColor: Colors.background,
    borderColor: Colors.border,
    shadowOpacity: 0,
    elevation: 0,
    opacity: 0.7,
  },
  iconContainer: {
    marginBottom: verticalScale(4),
  },
  achievementTitle: {
    textAlign: "center",
  },
  achievementDesc: {
    textAlign: "center",
    lineHeight: 18,
  },
});
