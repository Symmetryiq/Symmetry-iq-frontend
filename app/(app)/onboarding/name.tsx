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

const Name = () => {
  const router = useRouter();
  const { name, setName: setStoreName } = useOnboardingStore();

  const handleBack = async () => {
    router.back();
  };

  const handleContinue = async () => {
    if (name.trim()) {
      router.push('/onboarding/age');
    }
  };

  const handleNameChange = (value: string) => {
    setStoreName(value);
  };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
      }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={1}
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
                What&apos;s your name?
              </Typography>
              <Typography color="onSecondary">
                We&apos;ll personalize your report.
              </Typography>
            </View>

            <Input
              placeholder="Enter your name"
              keyboardType="default"
              onChangeText={handleNameChange}
              value={name}
              inputStyle={{
                color: Colors.onCard,
              }}
            />
          </View>

          <Button onPress={handleContinue} disabled={!name}>
            <Typography color="onSecondary" font="bold">
              Continue
            </Typography>
          </Button>
        </View>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
};

export default Name;

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
