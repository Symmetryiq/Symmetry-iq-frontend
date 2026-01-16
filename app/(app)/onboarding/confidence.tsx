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

const options: TOption[] = [
  {
    label: 'Love it',
    icon: <Typography size={20}>😍</Typography>,
  },
  {
    label: 'Like it',
    icon: <Typography size={20}>😀</Typography>,
  },
  {
    label: 'Dislike it',
    icon: <Typography size={20}>😔</Typography>,
  },
  {
    label: 'Avoid photos',
    icon: <Typography size={20}>😩</Typography>,
  },
];

const Confidence = () => {
  const router = useRouter();
  const { confidenceLevel, setConfidenceLevel } = useOnboardingStore();

  const handleBack = async () => {
    router.back();
  };

  const handleContinue = async () => {
    if (confidenceLevel) {
      router.push('/onboarding/impact');
    }
  };

  const confidenceOptionsMap: Record<
    number,
    'love-it' | 'like-it' | 'dislike-it' | 'avoid-photos'
  > = {
    0: 'love-it',
    1: 'like-it',
    2: 'dislike-it',
    3: 'avoid-photos',
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
              How do you feel about your face in photos?
            </Typography>
            <Typography color="onSecondary">
              Be honest, this helps us understand your confidence level
            </Typography>
          </View>

          <View style={styles.selectableWrapper}>
            {options.map((option, idx) => {
              const level = confidenceOptionsMap[idx];
              return (
                <Selectable
                  label={option.label}
                  key={idx}
                  icon={option.icon}
                  selected={confidenceLevel === level}
                  onPress={() => setConfidenceLevel(level)}
                />
              );
            })}
          </View>
        </View>

        <Button onPress={handleContinue} disabled={!confidenceLevel}>
          <Typography color="onSecondary" font="bold">
            Continue
          </Typography>
        </Button>
      </View>
    </ScreenWrapper>
  );
};

export default Confidence;

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
