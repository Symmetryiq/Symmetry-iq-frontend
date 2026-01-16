import Button from '@/components/common/button';
import ScreenWrapper from '@/components/common/screen-wrapper';
import Typography from '@/components/common/typography';
import { Colors, Fonts } from '@/constants/theme';
import { getColorByScore, getLabelByScore } from '@/helpers/analyze';
import { usePlanStore } from '@/stores/plan-store';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import PagerView from 'react-native-pager-view';

const DESCRIPTIONS: Record<string, string> = {
  overallSymmetry:
    'Measures how balanced your facial features are across the vertical axis.',
  eyeAlignment: 'Evaluates eye level, spacing, and horizontal alignment.',
  noseCentering:
    'Checks how centrally aligned the nose is relative to facial midline.',
  facialThirds:
    'Assesses vertical facial proportions between forehead, midface, and jaw.',
  cheekboneBalance: 'Measures balance and prominence of cheekbones.',
  jawlineSymmetry: 'Evaluates jaw shape and bilateral symmetry.',
  skinClarity: 'Estimates visible skin smoothness and clarity.',
  facialPuffiness: 'Detects facial bloating or swelling indicators.',
  chinAlignment: 'Measures chin centering and lower-face balance.',
  eyebrowSymmetry: 'Checks height and shape symmetry of eyebrows.',
};

export default function ScanResultScreen() {
  const { scores, image, result } = useLocalSearchParams();
  const data = JSON.parse(scores as string);
  const scanId = result as string;

  const [infoKey, setInfoKey] = useState<string | null>(null);
  const { generateNewPlan } = usePlanStore();
  const [generating, setGenerating] = useState(false);

  const handleGeneratePlan = async () => {
    try {
      setGenerating(true);
      await generateNewPlan(scanId);
      setGenerating(false);

      // Navigate to routines tab
      router.replace('/(app)/(tabs)/routines');
    } catch (error: any) {
      setGenerating(false);
      Alert.alert('Error', error.message || 'Failed to generate plan');
    }
  };

  const renderCard = (key: string, label: string, value: number) => {
    const isReversed = key === 'facialPuffiness';
    const color = getColorByScore(value, isReversed);

    return (
      <View style={[styles.card, { borderColor: color }]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{label}</Text>
          <Pressable onPress={() => setInfoKey(key)}>
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={Colors.onSecondary}
            />
          </Pressable>
        </View>

        <Text style={styles.cardValue}>{Math.round(value)}%</Text>

        <View style={styles.track}>
          <View
            style={[
              styles.fill,
              { width: `${value}%`, backgroundColor: color },
            ]}
          />
        </View>

        <Text style={[styles.cardLabel, { color }]}>
          {getLabelByScore(value, isReversed)}
        </Text>
      </View>
    );
  };

  return (
    <ScreenWrapper>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={Colors.onBackground} />
        </Pressable>
        <Text style={styles.headerTitle}>Your Facial Report</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* IMAGE */}
      <View style={styles.avatarWrap}>
        <Image source={{ uri: image as string }} style={styles.avatar} />
      </View>

      {/* PAGER */}
      <PagerView style={{ flex: 1 }} initialPage={0}>
        {/* PAGE 1 */}
        <View key="1" style={styles.page}>
          {renderCard(
            'overallSymmetry',
            'Overall Symmetry',
            data.overallSymmetry
          )}
          {renderCard('facialThirds', 'Facial Thirds', data.facialThirds)}
          {renderCard('eyeAlignment', 'Eye Alignment', data.eyeAlignment)}
          {renderCard(
            'eyebrowSymmetry',
            'Eyebrow Symmetry',
            data.eyebrowSymmetry
          )}
          {renderCard('noseCentering', 'Nose Centering', data.noseCentering)}
          {renderCard(
            'jawlineSymmetry',
            'Jawline Symmetry',
            data.jawlineSymmetry
          )}
        </View>

        {/* PAGE 2 */}
        <View key="2" style={styles.page}>
          {renderCard(
            'cheekboneBalance',
            'Cheekbone Balance',
            data.cheekboneBalance
          )}
          {renderCard('chinAlignment', 'Chin Alignment', data.chinAlignment)}
          {renderCard('skinClarity', 'Skin Clarity', data.skinClarity)}
          {renderCard(
            'facialPuffiness',
            'Facial Puffiness',
            data.facialPuffiness
          )}
        </View>
      </PagerView>

      {/* ACTIONS */}
      <View style={styles.footer}>
        <Button onPress={handleGeneratePlan} disabled={generating}>
          {generating ? (
            <ActivityIndicator color={Colors.onPrimary} />
          ) : (
            <Typography font="semiBold">Generate Routine</Typography>
          )}
        </Button>
      </View>

      {/* INFO MODAL */}
      <Modal transparent visible={!!infoKey} animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setInfoKey(null)}>
          <View style={styles.infoModal}>
            <Text style={styles.infoTitle}>About this score</Text>
            <Text style={styles.infoText}>
              {infoKey ? DESCRIPTIONS[infoKey] : ''}
            </Text>
          </View>
        </Pressable>
      </Modal>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center',
  },

  headerTitle: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    color: Colors.onBackground,
  },

  avatarWrap: {
    alignItems: 'center',
    marginBottom: 12,
  },

  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },

  page: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },

  card: {
    width: '48%',
    borderRadius: 28,
    borderWidth: 1,
    padding: 16,
    backgroundColor: Colors.card,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  cardTitle: {
    fontSize: 16,
    color: Colors.onSecondary,
    fontFamily: Fonts.medium,
  },

  cardValue: {
    fontSize: 42,
    fontFamily: Fonts.bold,
    color: Colors.onPrimary,
    marginVertical: 8,
  },

  track: {
    height: 12,
    backgroundColor: Colors.border,
    borderRadius: 28,
    overflow: 'hidden',
  },

  fill: {
    height: '100%',
    borderRadius: 28,
  },

  cardLabel: {
    fontSize: 14,
    marginTop: 8,
    fontFamily: Fonts.semiBold,
  },

  close: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    borderColor: Colors.border,
    borderWidth: 1,
    alignItems: 'center',
  },

  closeText: {
    color: Colors.onPrimary,
    fontFamily: Fonts.bold,
    fontSize: 16,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },

  infoModal: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 20,
  },

  infoTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    marginBottom: 8,
    color: Colors.onCard,
  },

  infoText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.onSecondary,
  },

  footer: {
    padding: 16,
    paddingBottom: 24,
    backgroundColor: Colors.background,
  },
});
