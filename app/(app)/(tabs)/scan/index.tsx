import Button from '@/components/common/button';
import ScreenWrapper from '@/components/common/screen-wrapper';
import Typography from '@/components/common/typography';
import { Colors } from '@/constants/theme';
import { scale, verticalScale } from '@/helpers/scale';
import { getLandmarks, getScores } from '@/helpers/scan';
import { useScanStore } from '@/stores/scan-store';
import { Feather } from '@expo/vector-icons';
import { launchCameraAsync, launchImageLibraryAsync } from 'expo-image-picker';
import { router } from 'expo-router';
import { ClockIcon, UserIcon } from 'phosphor-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  View,
} from 'react-native';

const Scan = () => {
  const [image, setImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const { saveScanData, latestScan, hasScannedToday } = useScanStore();

  const handlePressViewResults = () => {
    if (!latestScan) return;

    router.push({
      pathname: '/insights',
      params: {
        scanId: latestScan._id,
      },
    });
  };

  const handleUploadFromGallery = async () => {
    const result = await launchImageLibraryAsync({
      mediaTypes: 'images',
      quality: 1,
    });

    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleImageCapture = async () => {
    const result = await launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled) setImage(result.assets[0].uri);
  };

  function normalizeScores(scores: Record<string, number>) {
    return {
      overallSymmetry: scores.overall,
      eyeAlignment: scores.eye,
      noseCentering: scores.nose,
      facialPuffiness: scores.puff,
      skinClarity: scores.clar,
      chinAlignment: scores.chin,
      facialThirds: scores.thirds,
      jawlineSymmetry: scores.jaw,
      cheekboneBalance: scores.mid,
      eyebrowSymmetry: scores.brow,
    };
  }

  const handleProcessImage = async () => {
    if (!image) return;

    setProcessing(true);

    try {
      // Step 1: Extract landmarks from the image
      const landmarks = await getLandmarks(image);

      // Step 2: Get scores from the landmarks
      const response = await getScores(landmarks);

      if (!response.data?.model) {
        throw new Error('Invalid response from scoring API');
      }

      const scores = normalizeScores(response.data.model);

      // Step 3: Save scan to backend
      const savedScan = await saveScanData(landmarks, scores);

      if (!savedScan) {
        console.error('❌ Scan save returned null');
        throw new Error('Failed to save scan to database');
      }

      // Step 4: Navigate to results page with option to generate plan
      router.push({
        pathname: '/(app)/(tabs)/scan/[result]',
        params: {
          result: savedScan.id,
          scores: JSON.stringify(scores),
          image: image,
        },
      });

      setImage(null);
    } catch (error: any) {
      console.error('❌ Error processing image:', error);

      let errorMessage = 'Failed to process image. Please try again.';

      if (error?.message) {
        if (error.message.includes('No Face Detected')) {
          errorMessage =
            'No face detected in the image. Please ensure your face is clearly visible and try again.';
        } else if (
          error.message.includes('network') ||
          error.message.includes('Network')
        ) {
          errorMessage =
            'Network error. Please check your connection and try again.';
        } else if (error.message.includes('Invalid response')) {
          errorMessage = 'Invalid response from server. Please try again.';
        } else {
          errorMessage = error.message;
        }
      }

      Alert.alert('Processing Error', errorMessage, [
        {
          text: 'OK',
          style: 'default',
        },
      ]);
    } finally {
      setProcessing(false);
    }
  };

  if (hasScannedToday()) {
    return (
      <ScreenWrapper edges={['top']}>
        <View style={styles.container}>
          <View style={{ alignItems: 'center' }}>
            <Typography color="onBackground" size={scale(36)} font='bold' style={{ textAlign: 'center' }}>
              Scan Completed
            </Typography>
            <Typography color="onSecondary" size={scale(16)} style={{ textAlign: 'center' }}>
              You have already scanned today. Please try again tomorrow.
            </Typography>
          </View>

          <View style={{
            alignSelf: 'center',
            height: verticalScale(375),
            flex: 1,
            aspectRatio: 1,
            overflow: 'hidden'
          }}>
            <Image source={require('@/assets/images/tick.webp')} style={{ width: '100%', height: '100%' }} />
          </View>

          <View style={{ gap: scale(8), }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: scale(8) }}>
              <ClockIcon size={scale(24)} color={Colors.onMuted} />

              <Typography color="onSecondary" size={scale(16)} style={{ textAlign: 'center' }}>
                Time: {new Date(latestScan?.scanDate!).toLocaleTimeString().toUpperCase()}
              </Typography>
            </View>

            <Button onPress={handlePressViewResults}>
              <Typography font="semiBold">View Results</Typography>
            </Button>

            <Typography
              color="onMuted"
              size={scale(14)}
              style={{ textAlign: 'center' }}
            >
              You can scan again tomorrow.
            </Typography>
          </View>
        </View>
      </ScreenWrapper>
    )
  }

  return (
    <ScreenWrapper edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Feather name="camera" color={Colors.onBackground} size={56} />

          <View style={{ alignItems: 'center' }}>
            <Typography size={28} font="bold" color="onBackground">
              Face Scan
            </Typography>
            <Typography color="onSecondary" style={{ textAlign: 'center' }}>
              Capture or upload a clear, front-facing photo.
            </Typography>
          </View>
        </View>

        {/* Image Preview */}
        <View style={styles.imagePreview}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <UserIcon size={128} color={Colors.onMuted} />
          )}
        </View>

        {/* Actionable Buttons */}

        {!image ? (
          <View
            style={{
              gap: scale(8),
            }}
          >
            <Button onPress={handleImageCapture}>
              <Typography font="semiBold">Scan Face</Typography>
            </Button>

            <Button
              style={{
                backgroundColor: 'transparent',
              }}
              onPress={handleUploadFromGallery}
            >
              <Typography color="onMuted" font="medium">
                Upload Image
              </Typography>
            </Button>
          </View>
        ) : (
          <View
            style={{
              gap: scale(8),
            }}
          >
            <Button
              onPress={handleProcessImage}
              disabled={processing}
              style={{
                opacity: processing ? 0.6 : 1,
              }}
            >
              {processing ? (
                <ActivityIndicator size="small" color={Colors.onPrimary} />
              ) : (
                <Typography font="semiBold">Continue</Typography>
              )}
            </Button>

            <Button
              style={{
                backgroundColor: 'transparent',
              }}
              onPress={() => {
                setImage(null);
                setProcessing(false);
              }}
              disabled={processing}
            >
              <Typography color="onMuted" font="medium">
                Choose Another Photo
              </Typography>
            </Button>
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default Scan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: scale(16),
    gap: verticalScale(20),
    justifyContent: 'center',
    paddingVertical: verticalScale(40),
  },

  header: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: verticalScale(12),
  },

  imagePreview: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: Colors.muted,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: '100%',
  },
});
