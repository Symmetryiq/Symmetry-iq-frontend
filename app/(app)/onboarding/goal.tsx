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

type TGoal = {
  label: string;
  icon: any;
};

const goalOptions: TGoal[] = [
  {
    label: 'Improve overall facial symmetry',
    icon: <Typography size={20}>🪞</Typography>,
  },
  {
    label: 'Reduce puffiness and bloating',
    icon: <Typography size={20}>😴</Typography>,
  },
  {
    label: 'Define jawline and muscles',
    icon: <Typography size={20}>💪</Typography>,
  },
  {
    label: 'Track progress and visual changes',
    icon: <Typography size={20}>📈</Typography>,
  },
];

const Goal = () => {
  const router = useRouter();
  const { goals: selectedGoals, setGoals } = useOnboardingStore();

  const handleBack = async () => {
    router.back();
  };

  const handleContinue = async () => {
    if (selectedGoals.length > 0) {
      router.push('/onboarding/sleep');
    }
  };

  const toggleGoal = (idx: number) => {
    setGoals(
      selectedGoals.includes(idx)
        ? selectedGoals.filter((goalIdx) => goalIdx !== idx)
        : [...selectedGoals, idx]
    );
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
              What are your goals?
            </Typography>
            <Typography color="onSecondary">
              Select one or more reasons you&apos;d like to improve your face.
            </Typography>
          </View>

          <View style={styles.selectableWrapper}>
            {goalOptions.map((goal, idx) => {
              return (
                <Selectable
                  label={goal.label}
                  key={idx}
                  icon={goal.icon}
                  selected={selectedGoals.includes(idx)}
                  onPress={() => toggleGoal(idx)}
                />
              );
            })}
          </View>
        </View>

        <Button onPress={handleContinue} disabled={selectedGoals.length === 0}>
          <Typography color="onSecondary" font="bold">
            Continue
          </Typography>
        </Button>
      </View>
    </ScreenWrapper>
  );
};

export default Goal;

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
