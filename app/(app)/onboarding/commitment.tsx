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

type Option = {
  label: string;
  icon: any;
};

const options: Option[] = [
  {
    label: 'Yes, I’m done being uneven',
    icon: <Typography size={20}>✅</Typography>,
  },
  {
    label: 'No, I’ll just pay for surgery',
    icon: <Typography size={20}>💸</Typography>,
  },
  {
    label: 'No, I’ll stay asymmetrical forever',
    icon: <Typography size={20}>☠️</Typography>,
  },
];

const Commitment = () => {
  const router = useRouter();
  const { commitmentLevel, setCommitmentLevel } = useOnboardingStore();

  const handleBack = async () => {
    router.back();
  };

  const handleContinue = async () => {
    if (commitmentLevel) {
      router.push('/onboarding/rating');
    }
  };

  const commitmentOptionsMap: Record<
    number,
    'yes-committed' | 'no-surgery' | 'no-stay-uneven'
  > = {
    0: 'yes-committed',
    1: 'no-surgery',
    2: 'no-stay-uneven',
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
              Are you commited to following our routines?
            </Typography>
            <Typography color="onSecondary">
              If we made you a daily routine to fix asymmetry, will you follow
              it?
            </Typography>
          </View>

          <View style={styles.selectableWrapper}>
            {options.map((option, idx) => {
              const level = commitmentOptionsMap[idx];
              return (
                <Selectable
                  label={option.label}
                  key={idx}
                  icon={option.icon}
                  selected={commitmentLevel === level}
                  onPress={() => setCommitmentLevel(level)}
                />
              );
            })}
          </View>
        </View>

        <Button onPress={handleContinue} disabled={!commitmentLevel}>
          <Typography color="onSecondary" font="bold">
            Continue
          </Typography>
        </Button>
      </View>
    </ScreenWrapper>
  );
};

export default Commitment;

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
