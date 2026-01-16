import Button from '@/components/common/button';
import ScreenWrapper from '@/components/common/screen-wrapper';
import Typography from '@/components/common/typography';
import { Colors } from '@/constants/theme';
import { scale, verticalScale } from '@/helpers/scale';
import { useOnboardingStore } from '@/stores/onboarding';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StarIcon } from 'phosphor-react-native';
import React from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';

const NUM_STARS = 5;

const RateUs = () => {
  const router = useRouter();
  const { rating, setRating: setStoreRating } = useOnboardingStore();

  const handleBack = async () => {
    router.back();
  };

  const handleRatingChange = (value: number) => {
    setStoreRating(value);
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
              Are you happy with our app?
            </Typography>
            <Typography color="onSecondary">
              Give us feedback by rating our app. This helps us improve!
            </Typography>
          </View>

          <View style={styles.ratingContainer}>
            {Array.from({ length: NUM_STARS }, (_, idx) => {
              const starValue = idx + 1;
              return (
                <TouchableOpacity
                  key={starValue}
                  onPress={() => handleRatingChange(starValue)}
                  accessibilityLabel={`Rate ${starValue} star${starValue > 1 ? 's' : ''
                    }`}
                  accessibilityState={{ selected: rating === starValue }}
                  activeOpacity={0.8}
                  style={[styles.starButton]}
                >
                  <StarIcon
                    weight={
                      rating !== null && rating >= starValue
                        ? 'fill'
                        : 'regular'
                    }
                    size={32}
                    color={
                      rating !== null && rating >= starValue
                        ? Colors.primary
                        : Colors.onMuted
                    }
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <Button onPress={() => router.push('/onboarding/purchase')} disabled={rating === null}>
          <Typography color="onSecondary" font="bold">
            Continue
          </Typography>
        </Button>
      </View>
    </ScreenWrapper>
  );
};

export default RateUs;

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

  ratingContainer: {
    flexDirection: 'row',
    gap: verticalScale(16),
    justifyContent: 'space-around',
    backgroundColor: Colors.muted,
    padding: verticalScale(16),
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: verticalScale(18),
    alignItems: 'center',
    marginTop: verticalScale(16),
    marginBottom: verticalScale(8),
  },

  starButton: {
    padding: verticalScale(4),
    borderRadius: verticalScale(8),
  },
});
