import Calendar from '@/components/calendar';
import CircularProgress from '@/components/common/circle-progress';
import ScreenWrapper from '@/components/common/screen-wrapper';
import Section from '@/components/common/section';
import Typography from '@/components/common/typography';
import Header from '@/components/header';
import RoutineCardLarge from '@/components/routine-card';
import { Colors, Fonts } from '@/constants/theme';
import { Features } from '@/data/insights';
import { getColorByScore } from '@/helpers/analyze';
import {
  getRecommendedRoutines,
  ScoreKey,
} from '@/helpers/routine-mapping';
import { scale, verticalScale } from '@/helpers/scale';
import { useAuthStore } from '@/stores/auth-store';
import { useScanStore } from '@/stores/scan-store';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';

const Insights = () => {
  const [page, setPage] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { user } = useAuthStore();
  const { latestScan, scans, fetchScans, loading } = useScanStore();
  const { scanId } = useLocalSearchParams<{ scanId: string }>();

  useFocusEffect(
    React.useCallback(() => {
      fetchScans();
    }, [])
  );

  // Sync selectedDate if scanId changes (pushed from home)
  React.useEffect(() => {
    if (scanId && scans.length > 0) {
      const target = scans.find(s => s.id === scanId || s._id === scanId);
      if (target) {
        setSelectedDate(new Date(target.scanDate));
      }
    }
  }, [scanId, scans]);

  const availableDates = React.useMemo(() => {
    return scans.map(s => new Date(s.scanDate));
  }, [scans]);

  const currentScan = React.useMemo(() => {
    // Find scan for the selected date
    const targetDate = new Date(selectedDate);
    targetDate.setHours(0, 0, 0, 0);

    return scans.find(s => {
      const d = new Date(s.scanDate);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === targetDate.getTime();
    }) || null;
  }, [selectedDate, scans]);

  const reportDate = React.useMemo(() => {
    if (!currentScan) return '';
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date(currentScan.scanDate));
  }, [currentScan]);

  // Map API score keys to display titles
  const SCORE_DISPLAY_MAP: Record<string, string> = {
    overallSymmetry: 'Overall Symmetry',
    facialThirds: 'Facial Thirds',
    eyebrowSymmetry: 'Eyebrow Symmetry',
    eyeAlignment: 'Eye Alignment',
    noseCentering: 'Nose Centering',
    jawlineSymmetry: 'Jawline Symmetry',
    facialPuffiness: 'Facial Puffiness',
    skinClarity: 'Skin Clarity',
    chinAlignment: 'Chin Alignment',
    cheekboneBalance: 'Cheekbone Balance',
  };

  const { bestFeatures, improvements, overallScore } = React.useMemo(() => {
    if (!currentScan) return { bestFeatures: [], improvements: [], overallScore: 0 };

    const scores = currentScan.scores;

    // Get all scores except overallSymmetry for sorting
    const entries = Object.entries(scores)
      .filter(([key]) => key !== 'overallSymmetry')
      .map(([key, value]) => {
        const val = value as number;
        // For facial puffiness, lower is better, so we invert it for sorting/ranking
        const sortingValue = key === 'facialPuffiness' ? 100 - val : val;
        return {
          key,
          value: val,
          sortingValue,
          title: SCORE_DISPLAY_MAP[key] || key,
        };
      });

    // Sort by sortingValue (highest first)
    entries.sort((a, b) => b.sortingValue - a.sortingValue);

    return {
      bestFeatures: entries.slice(0, 3), // Top 3 sorting scores
      improvements: entries.slice(-3).reverse(), // Bottom 3 sorting scores (worst first)
      overallScore: scores.overallSymmetry || 0
    };
  }, [currentScan]);

  // Determine recommended routines based on scan scores using weighted priority
  const recommendedRoutines = React.useMemo(() => {
    if (!currentScan) return [];

    // Use centralized algorithm that calculates priority = distance × impact
    const routineIds = getRecommendedRoutines(
      currentScan.scores as Record<ScoreKey, number>,
      5
    );

    return routineIds.map((id) => ({ id }));
  }, [currentScan]);


  if (!currentScan) {
    return (
      <ScreenWrapper edges={['top']}>
        <Header showBackIcon={false} showContent={false} />
        <Calendar
          onSelect={setSelectedDate}
          selectedDate={selectedDate}
          availableDates={availableDates}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Typography size={20} font="bold" style={{ textAlign: 'center', marginBottom: 10 }}>No Scan Found</Typography>
          <Typography color="onSecondary" style={{ textAlign: 'center' }}>
            {availableDates.length > 0
              ? "Select a date with a scan to see your insights."
              : "Complete your first scan to see your insights breakdown."}
          </Typography>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper edges={['top']}>
      {/* <View style={styles.header}>
        <Typography size={24} font="semiBold" color="onBackground">
          {user?.displayName || 'Your Insights'}
        </Typography>
      </View> */}

      <Header showBackIcon={false} showContent={false} />

      <Calendar
        onSelect={setSelectedDate}
        selectedDate={selectedDate}
        availableDates={availableDates}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <Section>
          <View style={styles.contentHeader}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 4 }}>
              <Typography size={28} font="bold" color="onBackground">
                Your Facial Report
              </Typography>
              {reportDate && (
                <Typography size={14} color="onMuted" style={{ marginBottom: 4 }}>
                  {reportDate}
                </Typography>
              )}
            </View>
            <Typography color="onSecondary">
              A personalized facial balance summary, with areas to celebrate and
              recommendations to improve.
            </Typography>
          </View>

          <View style={[styles.card, { borderColor: getColorByScore(overallScore) }]}>
            <CircularProgress
              progress={overallScore}
              labelColor={getColorByScore(overallScore)}
              size={175}
              strokeWidth={16}
              outerCircleColor={Colors.border}
              progressCircleColor={getColorByScore(overallScore)}
            />

            <View style={styles.cardContentWrapper}>
              <Typography size={28} font="bold" color="onSecondary">
                Overall Symmetry
              </Typography>
              <Typography color="onTertiary" style={{ textAlign: 'center' }}>
                {overallScore > 80 ? "Your symmetry is excellent! Keep up the good work." :
                  overallScore > 50 ? "Good foundation. Specific exercises can help balance features." :
                    "Plenty of room for improvement. Follow your daily plan!"}
              </Typography>
            </View>
          </View>
        </Section>

        {bestFeatures.length > 0 && (
          <Section>
            <Typography size={32} font="bold" color="onBackground">
              Best Features
            </Typography>

            <ScrollView
              contentContainerStyle={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: scale(16),
                paddingVertical: verticalScale(16),
              }}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {bestFeatures.map((item) => (
                <View key={item.key} style={[styles.card, { borderColor: getColorByScore(item.value, item.key === 'facialPuffiness') }]}>
                  <CircularProgress
                    progress={Math.round(item.value)}
                    labelColor={getColorByScore(item.value, item.key === 'facialPuffiness')}
                    size={100}
                    strokeWidth={16}
                    outerCircleColor={Colors.border}
                    progressCircleColor={getColorByScore(item.value, item.key === 'facialPuffiness')}
                  />

                  <View style={styles.cardContentWrapper}>
                    <Typography size={24} font="medium" color="onSecondary">
                      {item.title}
                    </Typography>
                  </View>
                </View>
              ))}
            </ScrollView>
          </Section>
        )}

        {improvements.length > 0 && (
          <Section>
            <Typography size={32} font="bold" color="onBackground">
              Needs Improvement
            </Typography>

            <ScrollView
              contentContainerStyle={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: scale(16),
                paddingVertical: verticalScale(16),
              }}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {improvements.map((item) => (
                <View key={item.key} style={[styles.card, { borderColor: getColorByScore(item.value, item.key === 'facialPuffiness') }]}>
                  <CircularProgress
                    progress={Math.round(item.value)}
                    labelColor={getColorByScore(item.value, item.key === 'facialPuffiness')}
                    size={100}
                    strokeWidth={16}
                    outerCircleColor={Colors.border}
                    progressCircleColor={getColorByScore(item.value, item.key === 'facialPuffiness')}
                  />

                  <View style={styles.cardContentWrapper}>
                    <Typography size={24} font="medium" color="onSecondary">
                      {item.title}
                    </Typography>
                  </View>
                </View>
              ))}
            </ScrollView>
          </Section>
        )}

        <Section>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Typography size={28} font="bold">
              How can you improve?
            </Typography>
            <Typography style={{ textAlign: 'center' }}>
              Based on your report, here&apos;s the top routines picked to help
              you improve your overall symmetry.
            </Typography>
          </View>

          {recommendedRoutines.length > 0 ? (
            <View
              style={{
                width: '100%',
                alignItems: 'center',
              }}
            >
              <PagerView
                style={{ height: 425, width: '100%' }}
                initialPage={0}
                onPageSelected={(e) => setPage(e.nativeEvent.position)}
                offscreenPageLimit={1}
              >
                {recommendedRoutines.map((r, i) => (
                  <View
                    key={r.id + i} // Adding index to key to ensure uniqueness if logic accidentally duplicates
                    style={{
                      width: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <RoutineCardLarge routineId={r.id} />
                  </View>
                ))}
              </PagerView>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: scale(8),
                }}
              >
                {recommendedRoutines.map((_, i) => (
                  <View
                    key={i}
                    style={{
                      height: 10,
                      width: 10,
                      borderRadius: 5,
                      backgroundColor:
                        i === page ? Colors.primary : Colors.border,
                      opacity: i === page ? 1 : 0.5,
                    }}
                  />
                ))}
              </View>
            </View>
          ) : (
            <View style={{ padding: 20 }}>
              <Typography color="onSecondary">No specific recommendations yet.</Typography>
            </View>
          )}
        </Section>

        <Section>
          <Typography
            size={32}
            font="bold"
            color="onBackground"
            style={{ alignSelf: 'center' }}
          >
            Facial Factors
          </Typography>

          <View style={{ gap: 16, marginTop: 16 }}>
            {Array.from({ length: Math.ceil(Features.length / 2) }).map(
              (_, rowIndex) => {
                const startIndex = rowIndex * 2;
                const rowFeatures = Features.slice(startIndex, startIndex + 2);
                return (
                  <View
                    key={rowIndex}
                    style={{ flexDirection: 'row', width: '100%', gap: 16 }}
                  >
                    {rowFeatures.map((feat) => (
                      <Pressable
                        key={feat.id}
                        onPress={() =>
                          router.push({
                            pathname: '/(app)/(tabs)/insights/[factor]',
                            params: { factor: feat.id },
                          })
                        }
                        style={{ flex: 1 }}
                      >
                        <View
                          style={[
                            {
                              height: 150,
                              justifyContent: 'center',
                              alignItems: 'center',
                              gap: 8,
                            },
                            styles.card,
                          ]}
                        >
                          <Typography style={{ fontSize: 32 }}>
                            {feat.emoji}
                          </Typography>
                          <Typography
                            style={{
                              fontSize: 16,
                              fontFamily: Fonts.medium,
                              color: Colors.onBackground,
                              textAlign: 'center',
                            }}
                          >
                            {feat.title}
                          </Typography>
                        </View>
                      </Pressable>
                    ))}
                  </View>
                );
              }
            )}
          </View>
        </Section>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default Insights;

const styles = StyleSheet.create({
  container: {
    gap: verticalScale(16),
    paddingBottom: verticalScale(24),
  },

  header: {
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.card,
  },

  contentHeader: {
    gap: verticalScale(4),
    paddingVertical: verticalScale(16),
  },

  card: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    gap: verticalScale(8),
  },

  cardContentWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
