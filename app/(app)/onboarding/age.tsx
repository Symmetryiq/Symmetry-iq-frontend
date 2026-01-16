import Button from '@/components/common/button';
import Input from '@/components/common/input';
import ScreenWrapper from '@/components/common/screen-wrapper';
import Typography from '@/components/common/typography';
import { Colors } from '@/constants/theme';
import { scale, verticalScale } from '@/helpers/scale';
import { useOnboardingStore } from '@/stores/onboarding';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

const Age = () => {
  const router = useRouter();
  const { age, setAge: setStoreAge } = useOnboardingStore();

  const handleBack = async () => {
    router.back();
  };

  const handleContinue = async () => {
    if (age.trim()) {
      router.push('/onboarding/gender');
    }
  };

  const handleAgeChange = (value: string) => {
    setStoreAge(value);
  };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
      }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScreenWrapper>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: scale(16),
            marginVertical: verticalScale(16),
          }}
        >
          <Pressable onPress={handleBack}>
            <Feather
              name="chevron-left"
              size={28}
              color={Colors.onBackground}
            />
          </Pressable>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.contentWrapper}>
            <View>
              <Typography color="onBackground" font="semiBold" size={32}>
                What&apos;s your age?
              </Typography>
              <Typography color="onSecondary">
                Your age affects your facial symmetry.
              </Typography>
            </View>

            <Input
              placeholder="Enter your age"
              keyboardType="number-pad"
              onChangeText={handleAgeChange}
              value={age}
            />
          </View>

          <Button onPress={handleContinue} disabled={!age}>
            <Typography color="onSecondary" font="bold">
              Continue
            </Typography>
          </Button>
        </View>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
};

export default Age;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.card,
    borderTopLeftRadius: verticalScale(50),
    borderTopRightRadius: verticalScale(50),
    marginTop: 16,
    borderCurve: 'continuous',
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(32),
    paddingBottom: verticalScale(16),
  },

  contentWrapper: {
    flex: 1,
    gap: verticalScale(16),
  },
});
