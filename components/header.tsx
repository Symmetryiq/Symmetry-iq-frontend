import { RADIUS, SHADOW } from '@/constants/theme';
import { navigateTo } from '@/utils/router.util';
import { scale, verticalScale } from '@/utils/scaling.util';
import { Image } from 'expo-image';
import { BellIcon } from 'phosphor-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Button from './Button';
import ThemedText from './ThemedText';

type HeaderProps = {
  name: string;
  profileImage: string;
};

const Header = ({ name, profileImage }: HeaderProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.profileImageContainer}>
        <Image
          source={profileImage}
          style={styles.profileImage}
          contentFit="cover"
        />
      </View>

      <View style={styles.greetingContainer}>
        <ThemedText variant="bodySmall" color="onSecondary">
          Good Morning,
        </ThemedText>
        <ThemedText variant="h3">{name}</ThemedText>
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
