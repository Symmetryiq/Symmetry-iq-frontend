import Button from '@/components/common/button';
import ScreenWrapper from '@/components/common/screen-wrapper';
import Selectable from '@/components/common/selectable';
import Typography from '@/components/common/typography';
import { Colors } from '@/constants/theme';
import { scale, verticalScale } from '@/helpers/scale';
import { useOnboardingStore } from '@/stores/onboarding';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

type TOption = {
  label: string;
  icon: any;
};

const dietOptions: TOption[] = [
  {
    label: 'Mostly Junky',
    icon: <Typography size={20}>🍕</Typography>,
  },
  {
    label: 'Mixed',
    icon: <Typography size={20}>🥪</Typography>,
  },
  {
    label: 'Clean',
    icon: <Typography size={20}>🥗</Typography>,
  },
];

const Diet = () => {
  const router = useRouter();
  const { dietType, setDietType } = useOnboardingStore();

  const handleBack = async () => {
    router.back();
  };

  const handleContinue = async () => {
    if (dietType) {
      router.push('/onboarding/chewing');
    }
  };

  const dietOptionsMap: Record<number, 'mostly-junky' | 'mixed' | 'clean'> = {
    0: 'mostly-junky',
    1: 'mixed',
    2: 'clean',
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
              How clean is your diet?
            </Typography>
            <Typography color="onSecondary">
              Having a bad diet can impact various facial factors.
            </Typography>
          </View>

          <View style={styles.selectableWrapper}>
            {dietOptions.map((option, idx) => {
              const diet = dietOptionsMap[idx];
              return (
                <Selectable
                  label={option.label}
                  key={idx}
                  icon={option.icon}
                  selected={dietType === diet}
                  onPress={() => setDietType(diet)}
                />
              );
            })}
          </View>
        </View>

        <Button onPress={handleContinue} disabled={!dietType}>
          <Typography color="onSecondary" font="bold">
            Continue
          </Typography>
        </Button>
      </View>
    </ScreenWrapper>
  );
};

export default Diet;

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
