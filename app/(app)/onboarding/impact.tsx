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
    label: 'I avoid photos/selfies',
    icon: <Typography size={20}>📸</Typography>,
  },
  {
    label: 'I feel less confident in social settings',
    icon: <Typography size={20}>😔</Typography>,
  },
  {
    label: 'I think about it multiple times a day',
    icon: <Typography size={20}>🤔</Typography>,
  },
  {
    label: 'I’ve tried fixing it before',
    icon: <Typography size={20}>🪄</Typography>,
  },
  {
    label: 'I’ve never understood why my face looks uneven',
    icon: <Typography size={20}>😶</Typography>,
  },
];

const Impact = () => {
  const router = useRouter();
  const { impactFactors, setImpactFactors } = useOnboardingStore();

  const handleBack = async () => {
    router.back();
  };

  const handleContinue = async () => {
    if (impactFactors.length > 0) {
      router.push('/onboarding/commitment');
    }
  };

  const toggleOption = (idx: number) => {
    setImpactFactors(
      impactFactors.includes(idx)
        ? impactFactors.filter((factorIdx) => factorIdx !== idx)
        : [...impactFactors, idx]
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
              How does facial symmetry affect you?
            </Typography>
            <Typography color="onSecondary">Select all that apply.</Typography>
          </View>

          <View style={styles.selectableWrapper}>
            {options.map((goal, idx) => {
              return (
                <Selectable
                  label={goal.label}
                  key={idx}
                  icon={goal.icon}
                  selected={impactFactors.includes(idx)}
                  onPress={() => toggleOption(idx)}
                />
              );
            })}
          </View>
        </View>

        <Button onPress={handleContinue} disabled={impactFactors.length === 0}>
          <Typography color="onSecondary" font="bold">
            Continue
          </Typography>
        </Button>
      </View>
    </ScreenWrapper>
  );
};

export default Impact;

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
