import { COLOR, RADIUS, SHADOW } from '@/constants/theme';
import { useOnboardingStore } from '@/hooks/useOnboardingStore';
import { navigateTo } from '@/utils/router.util';
import { scale, verticalScale } from '@/utils/scaling.util';
import { useUser } from '@clerk/expo';
import { Image } from 'expo-image';
import { BellIcon } from 'phosphor-react-native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Button from './Button';
import ThemedText from './ThemedText';

const LOGO = require('@/assets/images/logo.png');

function timeBasedGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}

const Header = () => {
  const { user } = useUser();
  const onboardingNameAnswer = useOnboardingStore((s) => s.answers['name']);
  const onboardingName =
    typeof onboardingNameAnswer === 'string'
      ? onboardingNameAnswer.trim()
      : '';

  const displayName = user
    ? user.firstName || user.fullName || onboardingName || 'there'
    : onboardingName || 'there';

  const avatarSource = user?.imageUrl ? { uri: user.imageUrl } : LOGO;
  const avatarContentFit = user?.imageUrl ? 'cover' : 'contain';

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => navigateTo('/(app)/(tabs)/settings')}
        style={styles.profileImageContainer}
        hitSlop={8}
      >
        <Image
          source={avatarSource}
          style={styles.profileImage}
          contentFit={avatarContentFit}
        />
      </Pressable>

      <View style={styles.greetingContainer}>
        <ThemedText variant="bodySmall" color="onSecondary">
          {timeBasedGreeting()},
        </ThemedText>
        <ThemedText variant="h3" numberOfLines={1}>
          {displayName}
        </ThemedText>
      </View>

      <Button
        iconOnly
        icon={BellIcon}
        variant="icon"
        size="sm"
        onPress={() => navigateTo('/notifications')}
      />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: scale(16),
    paddingVertical: verticalScale(16),
  },
  profileImageContainer: {
    width: scale(44),
    height: scale(44),
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    backgroundColor: COLOR.muted,
    boxShadow: SHADOW.sm,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  greetingContainer: {
    flex: 1,
  },
});
