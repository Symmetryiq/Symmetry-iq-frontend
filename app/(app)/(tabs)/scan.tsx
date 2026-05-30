import Button from '@/components/Button';
import ScanIcon from '@/components/icons/ScanIcon';
import ScreenView from '@/components/ScreenView';
import ThemedText from '@/components/ThemedText';
import { COLOR, FONT, RADIUS, SHADOW, SPACE } from '@/constants/theme';
import { usePlanStore } from '@/hooks/usePlanStore';
import {
  getTodaysScan,
  hasScannedToday,
  useScanStore,
} from '@/hooks/useScanStore';
import { NoFaceDetectedError } from '@/utils/error.util';
import { calculateScores, getLandmarks } from '@/utils/mediapipe.util';
import { Image } from 'expo-image';
import {
  launchCameraAsync,
  launchImageLibraryAsync,
  MediaType,
  requestCameraPermissionsAsync,
  requestMediaLibraryPermissionsAsync,
} from 'expo-image-picker';
import { router } from 'expo-router';
import {
  CameraPlusIcon,
  CheckCircleIcon,
  ClockCountdownIcon,
  ImageIcon,
  UserCircleIcon,
} from 'phosphor-react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Linking, StyleSheet, View } from 'react-native';

type ScanSource = 'camera' | 'gallery';
type ScanStatus = 'idle' | 'analyzing' | 'done' | 'error';

async function ensureCameraPermission(): Promise<boolean> {
  const { status } = await requestCameraPermissionsAsync();
  return status === 'granted';
}

async function ensureLibraryPermission(): Promise<boolean> {
  const { status } = await requestMediaLibraryPermissionsAsync();
  return status === 'granted';
}

async function analyzeImage(imageUri: string): Promise<void> {
  const landmarks = await getLandmarks(imageUri);
  const scores = calculateScores(landmarks);
  useScanStore.getState().saveScan(imageUri, scores);
}

/* ── Countdown hook ── */

function useCountdownToMidnight() {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    function update() {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();

      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      setTimeLeft(`${h}h ${m}m`);
    }

    update();
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, []);

  return timeLeft;
}

const ScanScreen = () => {
  const history = useScanStore((s) => s.history);
  const scannedToday = useMemo(() => hasScannedToday(history), [history]);
  const todaysScan = useMemo(() => getTodaysScan(history), [history]);
  const countdown = useCountdownToMidnight();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [activeSource, setActiveSource] = useState<ScanSource | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleTakePhoto = useCallback(async () => {
    const granted = await ensureCameraPermission();
    if (!granted) {
      Alert.alert(
        'Permission Required',
        'Camera access is needed to take a photo.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Open Settings',
            onPress: () => {
              Linking.openSettings();
            },
          },
        ],
        {
          userInterfaceStyle: 'dark',
        },
      );
      return;
    }

    const result = await launchCameraAsync({
      mediaTypes: ['images'] as MediaType[],
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.length) return;

    const uri = result.assets[0].uri;
    setImageUri(uri);
    await runAnalysis(uri, 'camera');
  }, []);

  const handleUploadPhoto = useCallback(async () => {
    const granted = await ensureLibraryPermission();
    if (!granted) {
      Alert.alert(
        'Permission Required',
        'Photo library access is needed to select an image.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Open Settings',
            onPress: () => {
              Linking.openSettings();
            },
          },
        ],
        {
          userInterfaceStyle: 'dark',
        },
      );
      return;
    }

    const result = await launchImageLibraryAsync({
      mediaTypes: ['images'] as MediaType[],
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.length) return;

    const uri = result.assets[0].uri;
    setImageUri(uri);
    await runAnalysis(uri, 'gallery');
  }, []);

  const runAnalysis = useCallback(async (uri: string, source: ScanSource) => {
    setActiveSource(source);
    setStatus('analyzing');
    setErrorMessage(null);

    try {
      await analyzeImage(uri);
      const scan = useScanStore.getState().currentScan!;
      usePlanStore.getState().regenerate(scan.scores, scan.id);
      setStatus('done');
      router.push({
        pathname: '/score/[id]',
        params: {
          id: 'current',
        },
      });
    } catch (error) {
      setStatus('error');
      setActiveSource(null);

      if (error instanceof NoFaceDetectedError) {
        setErrorMessage(
          'No face detected. Please try a clear, front‑facing photo.',
        );
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
    }
  }, []);

  const isAnalyzing = status === 'analyzing';
  const hasImage = imageUri !== null;

  /* ── Already scanned today ── */
  if (scannedToday && todaysScan) {
    return (
      <ScreenView edges={['top', 'left', 'right']} style={styles.container}>
        <View style={styles.header}>
          <ScanIcon color={COLOR.primaryLight} size={48} />

          <View style={styles.content}>
            <ThemedText variant="h1">Face Scan</ThemedText>
            <ThemedText color="onSecondary" style={styles.description}>
              AI-powered symmetry analysis in seconds
            </ThemedText>
          </View>
        </View>

        {/* Today's scan preview */}
        <View style={styles.preview}>
          <Image
            source={{ uri: todaysScan.imageUri }}
            style={styles.image}
          />
          <View style={styles.scannedBadge}>
            <CheckCircleIcon color={COLOR.onPrimary} size={16} weight="fill" />
            <ThemedText variant="badge" color="onPrimary">
              Scanned Today
            </ThemedText>
          </View>
        </View>

        {/* Next scan countdown */}
        <View style={styles.countdownRow}>
          <ClockCountdownIcon
            color={COLOR.onMuted}
            size={16}
            weight="bold"
          />
          <ThemedText variant="bodySmall" color="onMuted">
            Next scan available in{' '}
            <ThemedText
              variant="bodySmall"
              color="primaryLight"
              style={{ fontFamily: FONT.semiBold }}
            >
              {countdown}
            </ThemedText>
          </ThemedText>
        </View>

        <Button
          title="View Results"
          variant="primary"
          onPress={() =>
            router.push({
              pathname: '/score/[id]',
              params: { id: todaysScan.id },
            })
          }
        />
      </ScreenView>
    );
  }

  /* ── Normal scan flow ── */
  return (
    <ScreenView edges={['top', 'left', 'right']} style={styles.container}>
      <View style={styles.header}>
        <ScanIcon color={COLOR.primaryLight} size={48} />

        <View style={styles.content}>
          <ThemedText variant="h1">Face Scan</ThemedText>
          <ThemedText color="onSecondary" style={styles.description}>
            AI-powered symmetry analysis in seconds
          </ThemedText>
        </View>
      </View>

      <View style={styles.preview}>
        {hasImage ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <>
            <UserCircleIcon color={COLOR.onSecondary} size={48} />
            <ThemedText color="onSecondary">
              Take a photo to get started
            </ThemedText>
          </>
        )}
      </View>

      {status === 'analyzing' && (
        <ThemedText color="onSecondary" style={styles.statusText}>
          Analyzing your face…
        </ThemedText>
      )}

      {status === 'error' && errorMessage && (
        <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>
      )}

      <View style={styles.actions}>
        <Button
          variant="primary"
          title="Take Photo"
          fullWidth
          icon={CameraPlusIcon}
          onPress={handleTakePhoto}
          loading={activeSource === 'camera' && isAnalyzing}
          disabled={isAnalyzing}
        />
        <Button
          variant="secondary"
          title="Upload Photo"
          fullWidth
          icon={ImageIcon}
          onPress={handleUploadPhoto}
          loading={activeSource === 'gallery' && isAnalyzing}
          disabled={isAnalyzing}
        />
      </View>
    </ScreenView>
  );
};

export default ScanScreen;

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },

  header: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  content: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },

  description: {
    textAlign: 'center',
    maxWidth: 300,
  },

  preview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'hsla(250, 50%, 70%, 0.25)',
    backgroundColor: 'hsla(250, 50%, 70%, 0.15)',
    borderRadius: RADIUS['2xl'],
    overflow: 'hidden',
    boxShadow: SHADOW.primary,
  },

  image: {
    width: '100%',
    height: '100%',
  },

  statusText: {
    textAlign: 'center',
  },

  errorText: {
    textAlign: 'center',
    color: COLOR.red,
  },

  actions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },

  /* ── Already scanned state ── */

  scannedBadge: {
    position: 'absolute',
    top: SPACE.md,
    right: SPACE.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACE.xs,
    backgroundColor: 'hsla(120, 50%, 40%, 0.85)',
    paddingHorizontal: SPACE.sm,
    paddingVertical: SPACE.xs,
    borderRadius: RADIUS.full,
  },

  countdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACE.xs,
  },
});
