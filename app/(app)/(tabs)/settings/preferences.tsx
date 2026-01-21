import ScreenWrapper from '@/components/common/screen-wrapper';
import Typography from '@/components/common/typography';
import { Colors, Fonts } from '@/constants/theme';
import { verticalScale } from '@/helpers/scale';
import { updateUserProfile } from '@/services/api/user.api';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

const PreferencesScreen = () => {
  const { user } = useUser();

  const [notificationsEnabled, setNotificationsEnabled] = useState(
    ((user?.publicMetadata?.preferences as any)?.notifications ?? true) as boolean
  );

  const toggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);

    try {
      // Update via backend API
      await updateUserProfile({
        age: user?.publicMetadata?.age,
        gender: user?.publicMetadata?.gender,
        notifications: value,
      });

      // Reload user to get updated metadata
      await user?.reload();
    } catch (error) {
      console.error('Error updating preferences:', error);
      Alert.alert('Error', 'Failed to update preference. Please try again.');
      // Revert on error
      setNotificationsEnabled(!value);
    }
  };

  return (
    <ScreenWrapper edges={['bottom']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>

          <View style={styles.card}>
            <View style={styles.preferenceItem}>
              <View style={styles.preferenceItemLeft}>
                <Ionicons name="notifications" size={24} color={Colors.onBackground} />
                <View style={styles.preferenceTextContainer}>
                  <Typography font="medium" size={18} color="onBackground">
                    Push Notifications
                  </Typography>
                  <Typography size={14} color="onMuted" style={styles.preferenceDescription}>
                    Receive reminders and updates
                  </Typography>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={toggleNotifications}
                trackColor={{ false: Colors.muted, true: Colors.primary }}
                thumbColor={Colors.onPrimary}
                ios_backgroundColor={Colors.muted}
              />
            </View>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Ionicons name="information-circle" size={20} color={Colors.onMuted} />
          <Typography size={14} color="onMuted" style={styles.infoText}>
            More preference options coming soon
          </Typography>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default PreferencesScreen;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
  },

  contentContainer: {
    paddingBottom: 40,
  },

  section: {
    width: '100%',
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 28,
    fontFamily: Fonts.semiBold,
    color: Colors.onBackground,
    marginBottom: 16,
  },

  card: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 28,
    padding: 16,
    width: '100%',
  },

  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    minHeight: verticalScale(56),
  },

  preferenceItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
    paddingRight: 16,
  },

  preferenceTextContainer: {
    flex: 1,
    gap: 4,
  },

  preferenceDescription: {
    marginTop: 2,
  },

  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.muted,
    borderRadius: 16,
    marginTop: 8,
  },

  infoText: {
    flex: 1,
  },
});
