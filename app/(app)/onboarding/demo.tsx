import Button from '@/components/Button';
import ScanIcon from '@/components/icons/ScanIcon';
import ScreenView from '@/components/ScreenView';
import ThemedText from '@/components/ThemedText';
import { COLOR, RADIUS, SHADOW } from '@/constants/theme';
import { usePlanStore } from '@/hooks/usePlanStore';
import { useScanStore } from '@/hooks/useScanStore';
import { NoFaceDetectedError } from '@/utils/error.util';
import { calculateScores, getLandmarks } from '@/utils/mediapipe.util';
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
  ImageIcon,
  UserCircleIcon,
} from 'phosphor-react-native';
import React, { useCallback, useState } from 'react';
import { Alert, Image, StyleSheet, View } from 'react-native';

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

/**
 * Runs MediaPipe face detection → score calculation on a given image.
 * Persists the result to the scan store.
 */
async function analyzeImage(imageUri: string): Promise<void> {
  const landmarks = await getLandmarks(imageUri);
  const scores = calculateScores(landmarks);
  useScanStore.getState().saveScan(imageUri, scores);
}

const DemoScanScreen = () => {
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
      router.replace('/onboarding/result');
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

  return (
    <ScreenView style={styles.container}>
      <View style={styles.header}>
        <ScanIcon color={COLOR.primaryLight} size={48} />

        <View style={styles.content}>
          <ThemedText variant="h1">Try a Free Scan</ThemedText>
          <ThemedText color="onSecondary" style={styles.description}>
            See how our AI analyzes your face. Capture or upload a clear,
            front-facing photo.
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

export default DemoScanScreen;

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
});
