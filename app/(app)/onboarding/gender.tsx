import Button from '@/components/common/button';
import ScreenWrapper from '@/components/common/screen-wrapper';
import Selectable from '@/components/common/selectable';
import Typography from '@/components/common/typography';
import { Colors } from '@/constants/theme';
import { scale, verticalScale } from '@/helpers/scale';
import { useOnboardingStore } from '@/stores/onboarding';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

const Gender = () => {
  const router = useRouter();
  const { gender, setGender: setStoreGender } = useOnboardingStore();

  const handleBack = async () => {
    router.back();
  };

  const handleContinue = async () => {
    if (gender) {
      router.push('/onboarding/goal');
    }
  };

  return (
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
          <Feather name="chevron-left" size={28} color={Colors.onBackground} />
        </Pressable>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.contentWrapper}>
          <View>
            <Typography color="onBackground" font="semiBold" size={32}>
              Select your gender
            </Typography>
            <Typography color="onSecondary">
              This helps us analyze your face more accurately
            </Typography>
          </View>

          <View style={styles.selectableWrapper}>
            <Selectable
              label="Male"
              icon={
                <Ionicons
                  name="male"
                  size={24}
                  color={
                    gender === 'male' ? Colors.onPrimary : Colors.onSecondary
                  }
                />
              }
              selected={gender === 'male'}
              onPress={() => setStoreGender('male')}
            />

            <Selectable
              label="Female"
              icon={
                <Ionicons
                  name="female"
                  size={24}
                  color={
                    gender === 'female' ? Colors.onPrimary : Colors.onSecondary
                  }
                />
              }
              selected={gender === 'female'}
              onPress={() => setStoreGender('female')}
            />
          </View>
        </View>

        <Button onPress={handleContinue} disabled={!gender}>
          <Typography color="onSecondary" font="bold">
            Continue
          </Typography>
        </Button>
      </View>
    </ScreenWrapper>
  );
};

export default Gender;

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
    justifyContent: 'center',
    gap: verticalScale(24),
  },

  selectableWrapper: {
    gap: verticalScale(16),
  },
});
