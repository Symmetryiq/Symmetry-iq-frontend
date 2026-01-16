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
    label: 'Left',
    icon: <Feather name="arrow-left" size={24} color={Colors.onPrimary} />,
  },
  {
    label: 'Right',
    icon: <Feather name="arrow-right" size={24} color={Colors.onPrimary} />,
  },
  {
    label: 'Balanced',
    icon: <Feather name="arrow-up" size={24} color={Colors.onPrimary} />,
  },
];

const ChewingBalance = () => {
  const router = useRouter();
  const { chewingSide, setChewingSide } = useOnboardingStore();

  const handleBack = async () => {
    router.back();
  };

  const handleContinue = async () => {
    if (chewingSide) {
      router.push('/onboarding/confidence');
    }
  };

  const chewingOptionsMap: Record<number, 'left' | 'right' | 'balanced'> = {
    0: 'left',
    1: 'right',
    2: 'balanced',
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
              Do you chew mostly on one side?
            </Typography>
            <Typography color="onSecondary">
              Your chewing position can impact your mouth.
            </Typography>
          </View>

          <View style={styles.selectableWrapper}>
            {options.map((option, idx) => {
              const side = chewingOptionsMap[idx];
              return (
                <Selectable
                  label={option.label}
                  key={idx}
                  icon={option.icon}
                  selected={chewingSide === side}
                  onPress={() => setChewingSide(side)}
                />
              );
            })}
          </View>
        </View>

        <Button onPress={handleContinue} disabled={!chewingSide}>
          <Typography color="onSecondary" font="bold">
            Continue
          </Typography>
        </Button>
      </View>
    </ScreenWrapper>
  );
};

export default ChewingBalance;

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
