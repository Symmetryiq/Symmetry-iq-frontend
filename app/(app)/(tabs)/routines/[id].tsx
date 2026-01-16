import { Colors, Fonts } from '@/constants/theme';
import { Routine, RoutineId, RoutineImages } from '@/data/routines';
import { getRoutineById } from '@/helpers/routine';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Params = { id?: RoutineId };

const RoutineScreen = () => {
  const { id } = useLocalSearchParams<Params>();
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!id) {
      setError('Missing routine ID');
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const fetchedRoutine = getRoutineById(id);

      setRoutine(fetchedRoutine);
      const initial: Record<string, boolean> = {};
      fetchedRoutine.instructions?.forEach((s) => {
        initial[s] = false;
      });
      setCompletedMap(initial);
      setError(null);
    } catch (error) {
      setError((error as Error).message ?? 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const allDone = useMemo(() => {
    if (!routine?.instructions || routine.instructions.length === 0)
      return false;
    return routine.instructions.every((s) => !!completedMap[s]);
  }, [routine, completedMap]);

  const completedCount = useMemo(() => {
    return Object.values(completedMap).filter(Boolean).length;
  }, [completedMap]);

  const progressPercentage = useMemo(() => {
    if (!routine?.instructions || routine.instructions.length === 0) return 0;
    return Math.round((completedCount / routine.instructions.length) * 100);
  }, [completedCount, routine]);

  const handleToggle = useCallback((stepId: string, done: boolean) => {
    setCompletedMap((prev) => ({ ...prev, [stepId]: done }));
  }, []);

  const markAllDone = useCallback(() => {
    if (!routine?.instructions) return;
    const next: Record<string, boolean> = {};
    routine.instructions.forEach((s) => (next[s] = true));
    setCompletedMap(next);
  }, [routine]);

  const resetAll = useCallback(() => {
    if (!routine?.instructions) return;
    const next: Record<string, boolean> = {};
    routine.instructions.forEach((s) => (next[s] = false));
    setCompletedMap(next);
  }, [routine]);

  useEffect(() => {
    if (allDone) {
      console.log(`Routine ${routine?.id} completed`);
    }
  }, [allDone, routine?.id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading routine…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !routine) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Feather name="alert-circle" size={48} color={Colors.onTertiary} />
          <Text style={styles.errorText}>{error ?? 'Routine not found'}</Text>
          <Pressable onPress={() => router.back()} style={styles.errorButton}>
            <Text style={styles.errorButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <View style={styles.imageWrapper}>
          <Image
            source={RoutineImages[routine.id]}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{routine.title}</Text>
          <View style={styles.durationBadge}>
            <Feather name="clock" size={14} color={Colors.primary} />
            <Text style={styles.durationText}>{routine.duration}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.description}>{routine.description}</Text>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressLabel}>Progress</Text>
              <Text style={styles.progressStats}>
                {completedCount} of {routine.instructions.length} steps
              </Text>
            </View>
            <View style={styles.progressCircle}>
              <Text style={styles.progressPercent}>{progressPercentage}%</Text>
            </View>
          </View>
          <View style={styles.progressBarWrapper}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${progressPercentage}%` },
                ]}
              />
            </View>
          </View>
          <View style={styles.progressActions}>
            <Pressable onPress={markAllDone} style={styles.actionButton}>
              <Feather name="check" size={16} color={Colors.onPrimary} />
              <Text style={styles.actionButtonText}>Mark All</Text>
            </Pressable>
            <Pressable onPress={resetAll} style={styles.actionButtonSecondary}>
              <Feather name="rotate-ccw" size={16} color={Colors.onSecondary} />
              <Text style={styles.actionButtonTextSecondary}>Reset</Text>
            </Pressable>
          </View>
        </View>

        {/* Products Section */}
        {routine.products && routine.products.length > 0 && (
          <View style={styles.productsSection}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionIcon}>
                <Feather name="shopping-bag" size={18} color="#F59E0B" />
              </View>
              <Text style={styles.sectionTitle}>Products Needed</Text>
            </View>
            <View style={styles.productsList}>
              {routine.products.map((product, index) => (
                <View key={index} style={styles.productRow}>
                  <View style={styles.productDot} />
                  <Text style={styles.productText}>{product}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Instructions Section */}
        <View style={styles.instructionsSection}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionIcon}>
              <Feather name="list" size={18} color={Colors.onPrimary} />
            </View>
            <Text style={styles.sectionTitle}>Step-by-Step Instructions</Text>
          </View>

          <View style={styles.instructionsList}>
            {routine.instructions.map((instruction, index) => {
              const isCompleted = completedMap[instruction];
              return (
                <Pressable
                  key={index}
                  onPress={() => handleToggle(instruction, !isCompleted)}
                  style={[
                    styles.instructionCard,
                    isCompleted && styles.instructionCardCompleted,
                  ]}
                >
                  <View style={styles.instructionContent}>
                    <View
                      style={[
                        styles.stepIndicator,
                        isCompleted && styles.stepIndicatorCompleted,
                      ]}
                    >
                      {isCompleted ? (
                        <Ionicons name="checkmark" size={20} color="#fff" />
                      ) : (
                        <Text style={styles.stepNumber}>{index + 1}</Text>
                      )}
                    </View>
                    <View style={styles.instructionTextWrapper}>
                      <Text
                        style={[
                          styles.instructionText,
                          isCompleted && styles.instructionTextCompleted,
                        ]}
                      >
                        {instruction}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Completion Banner */}
        {allDone && (
          <View style={styles.completionBanner}>
            <View style={styles.completionIconWrapper}>
              <Feather name="award" size={28} color="#FCD34D" />
            </View>
            <View style={styles.completionTextWrapper}>
              <Text style={styles.completionTitle}>Routine Complete!</Text>
              <Text style={styles.completionSubtitle}>
                Excellent work! Keep practicing for best results.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default RoutineScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.onSecondary,
    marginTop: 12,
  },
  errorText: {
    fontSize: 18,
    fontFamily: Fonts.regular,
    color: Colors.onSecondary,
    textAlign: 'center',
  },
  errorButton: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  errorButtonText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  imageWrapper: {
    width: '100%',
    height: 240,
    marginBottom: 20,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  titleSection: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.bold,
    color: Colors.onBackground,
    marginBottom: 8,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  durationText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.onBackground,
  },
  descriptionSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.onSecondary,
    lineHeight: 24,
  },
  progressSection: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressInfo: {
    flex: 1,
  },
  progressLabel: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.onBackground,
    marginBottom: 4,
  },
  progressStats: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.onTertiary,
  },
  progressCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPercent: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.onPrimary,
  },
  progressBarWrapper: {
    marginBottom: 16,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  progressActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  actionButtonSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.onPrimary,
  },
  actionButtonTextSecondary: {
    color: Colors.onSecondary,
  },
  productsSection: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.onBackground,
  },
  productsList: {
    gap: 12,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  productDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F59E0B',
    marginTop: 8,
  },
  productText: {
    flex: 1,
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: Colors.onSecondary,
    lineHeight: 22,
  },
  instructionsSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  instructionsList: {
    gap: 12,
  },
  instructionCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  instructionCardCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.5)',
  },
  instructionContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  stepIndicator: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepIndicatorCompleted: {
    backgroundColor: '#34D399',
  },
  stepNumber: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: Colors.onPrimary,
  },
  instructionTextWrapper: {
    flex: 1,
    paddingTop: 2,
  },
  instructionText: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: Colors.onBackground,
    lineHeight: 22,
  },
  instructionTextCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.onTertiary,
  },
  completionBanner: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: 'rgba(251, 191, 36, 0.18)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#FCD34D',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  completionIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(251, 191, 36, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  completionTextWrapper: {
    flex: 1,
  },
  completionTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: Colors.onBackground,
    marginBottom: 4,
  },
  completionSubtitle: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.onSecondary,
    lineHeight: 20,
  },
});
