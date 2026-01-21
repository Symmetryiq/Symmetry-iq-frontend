import ScreenWrapper from '@/components/common/screen-wrapper';
import { POLICY_URL, TERMS_URL } from '@/constants';
import { Colors, Fonts } from '@/constants/theme';
import { verticalScale } from '@/helpers/scale';
import { Feather, Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View
} from 'react-native';

const APP_STORE_URL = 'https://apps.apple.com/app/idYOUR_APP_ID';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.bergman.symmetryiq';

import LogoutButton from '@/components/buttons/logout-button';
import { openBrowserLink } from '@/helpers/utils';
import { useOnboardingStore } from '@/stores/onboarding';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

const SettingsScreen = () => {
  const { user } = useUser();
  const router = useRouter();
  const { age, gender } = useOnboardingStore();

  const handleShareApp = async () => {
    await Share.share({
      message: Platform.OS === 'ios'
        ? 'Check out Symmetry IQ - the app that helps you improve your facial symmetry! Download it here: ' + APP_STORE_URL
        : 'Check out Symmetry IQ - the app that helps you improve your facial symmetry! Download it here: ' + PLAY_STORE_URL,
    });
  };

  const handleRateApp = async () => {
    const url = Platform.OS === 'ios' ? APP_STORE_URL : PLAY_STORE_URL;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Unable to open store', 'Please rate us on the app store.');
    }
  };

  return (
    <ScreenWrapper edges={[]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.content}
        contentContainerStyle={{ paddingTop: 0, paddingBottom: 40 }}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>

          <View style={styles.card}>
            <Pressable style={styles.settingItem} onPress={() => router.push('/settings/profile')}>
              <View style={styles.settingItemHeader}>
                <Feather name="user" size={20} color={Colors.onBackground} />
                <Text style={styles.settingItemHeaderLabel}>Name</Text>
              </View>
              <View style={styles.settingItemRight}>
                <Text style={styles.settingItemHeaderValue}>{user?.fullName}</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.onMuted} />
              </View>
            </Pressable>

            <View style={styles.seperator} />

            <Pressable style={styles.settingItem} onPress={() => router.push('/settings/profile')}>
              <View style={styles.settingItemHeader}>
                <Feather name="calendar" size={20} color={Colors.onBackground} />
                <Text style={styles.settingItemHeaderLabel}>Age</Text>
              </View>
              <View style={styles.settingItemRight}>
                <Text style={styles.settingItemHeaderValue}>{age || 'Not set'}</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.onMuted} />
              </View>
            </Pressable>

            <View style={styles.seperator} />

            <Pressable style={styles.settingItem} onPress={() => router.push('/settings/profile')}>
              <View style={styles.settingItemHeader}>
                <Ionicons name="male" size={20} color={Colors.onBackground} />
                <Text style={styles.settingItemHeaderLabel}>Gender</Text>
              </View>
              <View style={styles.settingItemRight}>
                <Text style={styles.settingItemHeaderValue}>{gender ? (gender.charAt(0).toUpperCase() + gender.slice(1)) : 'Not set'}</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.onMuted} />
              </View>
            </Pressable>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.card}>
            <Pressable style={styles.settingItem} onPress={() => router.push('/settings/preferences')}>
              <View style={styles.settingItemHeader}>
                <Ionicons name="settings" size={20} color={Colors.onBackground} />
                <Text style={styles.settingItemHeaderLabel}>App Preferences</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.onBackground} />
            </Pressable>
          </View>
        </View>


        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App</Text>

          <View style={styles.card}>
            <Pressable style={styles.settingItem} onPress={handleShareApp}>
              <View style={styles.settingItemHeader}>
                <Ionicons name="share-social" size={20} color={Colors.onBackground} />
                <Text style={styles.settingItemHeaderLabel}>Share App</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.onBackground} />
            </Pressable>

            <View style={styles.seperator} />

            <Pressable style={styles.settingItem} onPress={handleRateApp}>
              <View style={styles.settingItemHeader}>
                <Feather name="star" size={20} color={Colors.onBackground} />
                <Text style={styles.settingItemHeaderLabel}>Leave a rating</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.onBackground} />
            </Pressable>
          </View>
        </View>

        <View style={[styles.section, { marginBottom: 24 }]}>
          <Text style={styles.sectionTitle}>Information</Text>

          <View style={styles.card}>
            <Pressable style={styles.settingItem} onPress={() => openBrowserLink(POLICY_URL)}>
              <View style={styles.settingItemHeader}>
                <Ionicons name="book" size={20} color={Colors.onBackground} />
                <Text style={styles.settingItemHeaderLabel}>Privacy Policy</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.onBackground} />
            </Pressable>

            <View style={styles.seperator} />

            <Pressable style={styles.settingItem} onPress={() => openBrowserLink(TERMS_URL)}>
              <View style={styles.settingItemHeader}>
                <Ionicons name="document-text" size={20} color={Colors.onBackground} />
                <Text style={styles.settingItemHeaderLabel}>Terms of Service</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.onBackground} />
            </Pressable>
          </View>
        </View>

        <View style={{ marginVertical: verticalScale(8) }}>
          <LogoutButton />
        </View>
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  header: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: Colors.card,
    borderColor: Colors.border,
    borderWidth: 1,
    padding: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  headerTitle: {
    fontSize: 36,
    fontFamily: Fonts.bold,
    color: Colors.onBackground,
  },

  content: {
    flex: 1,
    padding: 16,
    width: '100%',
  },

  section: {
    width: '100%',
    paddingVertical: 16,
  },

  sectionTitle: {
    fontSize: 28,
    fontFamily: Fonts.semiBold,
    color: Colors.onBackground,
  },

  card: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 28,
    padding: 16,
    width: '100%',
    marginTop: 16,
  },

  settingItem: {
    flexDirection: 'row',
    padding: 8,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  settingItemHeader: {
    flexDirection: 'row',
    flex: 1,
    gap: 16,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  settingItemHeaderLabel: {
    fontSize: 20,
    fontFamily: Fonts.regular,
    color: Colors.onSecondary,
  },

  settingItemHeaderValue: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.onTertiary,
  },

  seperator: {
    borderWidth: 1,
    borderColor: Colors.border,
    height: 1,
    marginVertical: 8,
  },

  versionContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },

  versionText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.onMuted,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  modalContent: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },

  modalTitle: {
    fontSize: 24,
    fontFamily: Fonts.semiBold,
    color: Colors.onBackground,
    marginBottom: 20,
    textAlign: 'center',
  },

  modalInput: {
    backgroundColor: Colors.muted,
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    fontFamily: Fonts.regular,
    color: Colors.onBackground,
    marginBottom: 20,
  },

  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },

  modalButtonCancel: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.muted,
    alignItems: 'center',
  },

  modalButtonCancelText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.onSecondary,
  },

  modalButtonSave: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },

  modalButtonSaveText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.onPrimary,
  },

  genderOptions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },

  genderOption: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    backgroundColor: Colors.muted,
    alignItems: 'center',
    gap: 8,
  },

  genderOptionActive: {
    backgroundColor: Colors.primary,
  },

  genderOptionText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.onSecondary,
  },

  genderOptionTextActive: {
    color: Colors.onPrimary,
  },
});
