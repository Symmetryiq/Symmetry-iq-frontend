import Button from "@/components/common/button";
import ScreenWrapper from "@/components/common/screen-wrapper";
import Typography from "@/components/common/typography";
import { Colors } from "@/constants/theme";
import { scale, verticalScale } from "@/helpers/scale";
import { getLandmarks, getScores } from "@/helpers/scan";
import { useOnboardingStore } from "@/stores/onboarding";
import { launchCameraAsync, launchImageLibraryAsync } from "expo-image-picker";
import { router } from "expo-router";
import { CameraIcon, UserIcon } from "phosphor-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

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

const DemoScan = () => {
  const [image, setImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const { setDemoScan } = useOnboardingStore();

  const handleUploadFromGallery = async () => {
    const result = await launchImageLibraryAsync({
      mediaTypes: "images",
      quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleImageCapture = async () => {
    const result = await launchCameraAsync({ quality: 1 });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleProcessImage = async () => {
    if (!image) return;
    setProcessing(true);

    try {
      const landmarks = await getLandmarks(image);
      const response = await getScores(landmarks);

      if (!response.data?.model) {
        throw new Error("Invalid response from scoring API");
      }

      const scores = normalizeScores(response.data.model);

      // Save demo scan data in local state temporarily
      setDemoScan(landmarks, scores, image);

      // Navigate to demo results — NO backend save
      router.push({
        pathname: "/onboarding/demo-results",
        params: {
          scores: JSON.stringify(scores),
          image: image,
        },
      });
    } catch (error: any) {
      let errorMessage = "Failed to process image. Please try again.";

      if (error?.message) {
        if (error.message.includes("No Face Detected")) {
          errorMessage =
            "No face detected in the image. Please ensure your face is clearly visible and try again.";
        } else if (
          error.message.includes("network") ||
          error.message.includes("Network")
        ) {
          errorMessage =
            "Network error. Please check your connection and try again.";
        } else if (error.message.includes("Invalid response")) {
          errorMessage = "Invalid response from server. Please try again.";
        } else {
          errorMessage = error.message;
        }
      }

      Alert.alert("Processing Error", errorMessage, [{ text: "OK" }]);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Header */}
        <Animated.View entering={FadeIn.duration(500)} style={styles.header}>
          <View style={styles.iconContainer}>
            <CameraIcon color={Colors.primary} size={32} />
          </View>
          <Typography size={26} font="bold" color="onBackground" center>
            Try a Free Scan
          </Typography>
          <Typography color="onSecondary" center>
            See how our AI analyzes your face.{"\n"}Capture or upload a clear,
            front-facing photo.
          </Typography>
        </Animated.View>

        {/* Image Preview */}
        <View style={styles.imagePreview}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={styles.placeholderContent}>
              <UserIcon size={96} color={Colors.onMuted} />
              <Typography color="onMuted" size={14}>
                Your photo will appear here
              </Typography>
            </View>
          )}
        </View>

        {/* Actions */}
        {!image ? (
          <View style={styles.actionsWrapper}>
            <Button onPress={handleImageCapture} style={{ width: "100%" }}>
              <Typography font="semiBold">Scan Face</Typography>
            </Button>
            <Button
              style={{
                backgroundColor: "transparent",
                paddingVertical: verticalScale(4),
              }}
              onPress={handleUploadFromGallery}
            >
              <Typography color="onMuted" font="medium">
                Upload Image
              </Typography>
            </Button>
          </View>
        ) : (
          <View style={styles.actionsWrapper}>
            <Button
              onPress={handleProcessImage}
              disabled={processing}
              style={{ opacity: processing ? 0.6 : 1, width: "100%" }}
            >
              {processing ? (
                <View style={styles.processingRow}>
                  <ActivityIndicator size="small" color={Colors.onPrimary} />
                  <Typography font="semiBold" color="onPrimary">
                    Analyzing...
                  </Typography>
                </View>
              ) : (
                <Typography font="semiBold">Analyze My Face</Typography>
              )}
            </Button>
            <Pressable
              onPress={() => {
                setImage(null);
                setProcessing(false);
              }}
              disabled={processing}
            >
              <Typography color="onMuted" font="medium" center>
                Choose Another Photo
              </Typography>
            </Pressable>
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default DemoScan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: scale(16),
    gap: verticalScale(20),
    justifyContent: "center",
    paddingVertical: verticalScale(24),
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    gap: verticalScale(8),
  },
  iconContainer: {
    width: scale(64),
    height: scale(64),
    borderRadius: 200,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(4),
  },
  imagePreview: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: Colors.muted,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  placeholderContent: {
    alignItems: "center",
    gap: verticalScale(12),
  },
  image: {
    width: "100%",
    height: "100%",
  },
  actionsWrapper: {
    gap: scale(12),
    alignItems: "center",
  },
  processingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
  },
});
