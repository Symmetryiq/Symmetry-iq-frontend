import Button from '@/components/common/button';
import ScreenWrapper from '@/components/common/screen-wrapper';
import Typography from '@/components/common/typography';
import { POLICY_URL, TERMS_URL } from '@/constants';
import { Colors, Fonts } from '@/constants/theme';
import { verticalScale } from '@/helpers/scale';
import { useAuthStore } from '@/stores/auth-store';
import { useNotificationStore } from '@/stores/notification-store';
import { Gender, useOnboardingStore } from '@/stores/onboarding';
import { Feather, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Linking,
  Modal,
  Platform,
  Pressable,
  Share,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View
} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const AnimatedScrollView = Animated.ScrollView;
const AnimatedView = Animated.View;
const AnimatedText = Animated.Text;

const MAX_HEADER = 175;
const MIN_HEADER = 90;
const SCROLL_RANGE = 120;

const APP_STORE_URL = 'https://apps.apple.com/app/idYOUR_APP_ID';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.bergman.symmetryiq';

import { openBrowserLink } from '@/helpers/utils';
import { getUserProfile, updateUserProfile } from '@/services/api/user.api';
import { useFocusEffect } from 'expo-router';

// ... existing imports ...

const SettingsScreen = () => {
  const scrollY = useSharedValue(0);
  const { logout, loading, user, updateDisplayName } = useAuthStore();
  const { name, age, gender, setName, setAge, setGender } = useOnboardingStore();
  const { unreadCount, notificationsEnabled, toggleNotifications } = useNotificationStore();

  // Edit modal state
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editField, setEditField] = useState<'name' | 'age' | 'gender'>('name');
  const [editValue, setEditValue] = useState('');

  // Fetch latest profile settings on mount
  useFocusEffect(
    React.useCallback(() => {
      const loadProfile = async () => {
        try {
          const profile = await getUserProfile();
          if (profile) {
            if (profile.name) setName(profile.name);
            if (profile.age) setAge(profile.age.toString());
            if (profile.gender) setGender(profile.gender);

            // Sync notification setting if store is out of sync
            if (profile.notificationsEnabled !== notificationsEnabled) {
              toggleNotifications(profile.notificationsEnabled);
            }
          }
        } catch (error) {
          console.error('Failed to load profile:', error);
        }
      };
      loadProfile();
    }, [])
  );

  const saveEdit = async () => {
    try {
      if (editField === 'name') {
        setName(editValue);
        // Update local auth store and firebase profile
        await updateDisplayName(editValue);
        // Update backend database
        await updateUserProfile({ name: editValue });
      } else if (editField === 'age') {
        const ageNum = parseInt(editValue);
        if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
          Alert.alert('Invalid Age', 'Please enter a valid age.');
          return;
        }
        setAge(editValue);
        await updateUserProfile({ age: ageNum });
      } else if (editField === 'gender') {
        setGender(editValue as Gender);
        await updateUserProfile({ gender: editValue as 'male' | 'female' });
      }
      setEditModalVisible(false);
    } catch (error) {
      console.error('Failed to save profile update:', error);
      Alert.alert('Error', 'Failed to save changes. Please try again.');
    }
  };

  const onToggleNotifications = async (value: boolean) => {
    // Store handles the API call
    await toggleNotifications(value);
  };


  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const animatedHeaderStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, SCROLL_RANGE],
      [MAX_HEADER, MIN_HEADER],
      Extrapolate.CLAMP
    );
    return { height };
  });

  const animatedTitleStyle = useAnimatedStyle(() => {
    const fontSize = interpolate(
      scrollY.value,
      [0, SCROLL_RANGE],
      [36, 20],
      Extrapolate.CLAMP
    );
    const translateY = interpolate(
      scrollY.value,
      [0, SCROLL_RANGE],
      [0, -8],
      Extrapolate.CLAMP
    );
    return {
      fontSize,
      transform: [{ translateY }, { translateX: 0 }],
    };
  });

  const openEditModal = (field: 'name' | 'age' | 'gender') => {
    setEditField(field);
    if (field === 'name') setEditValue(name || user?.displayName || '');
    else if (field === 'age') setEditValue(age || '');
    else setEditValue(gender || '');
    setEditModalVisible(true);
  };

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


  // Display values
  const displayName = name || user?.displayName || 'Not set';
  const displayAge = age || 'Not set';
  const displayGender = gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : 'Not set';

  return (
    <ScreenWrapper edges={['top']}>
      <AnimatedView style={[styles.header, animatedHeaderStyle]}>
        <AnimatedText style={[styles.headerTitle, animatedTitleStyle]}>
          Settings
        </AnimatedText>
      </AnimatedView>

      <AnimatedScrollView
        showsVerticalScrollIndicator={false}
        style={styles.content}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: 0, paddingBottom: 40 }}
      >
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>

          <View style={styles.card}>
            <Pressable style={styles.settingItem} onPress={() => openEditModal('name')}>
              <View style={styles.settingItemHeader}>
                <Feather name="user" size={20} color={Colors.onBackground} />
                <Text style={styles.settingItemHeaderLabel}>Name</Text>
              </View>
              <View style={styles.settingItemRight}>
                <Text style={styles.settingItemHeaderValue}>{displayName}</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.onMuted} />
              </View>
            </Pressable>

            <View style={styles.seperator} />

            <Pressable style={styles.settingItem} onPress={() => openEditModal('age')}>
              <View style={styles.settingItemHeader}>
                <Feather name="calendar" size={20} color={Colors.onBackground} />
                <Text style={styles.settingItemHeaderLabel}>Age</Text>
              </View>
              <View style={styles.settingItemRight}>
                <Text style={styles.settingItemHeaderValue}>{displayAge}</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.onMuted} />
              </View>
            </Pressable>

            <View style={styles.seperator} />

            <Pressable style={styles.settingItem} onPress={() => openEditModal('gender')}>
              <View style={styles.settingItemHeader}>
                <Ionicons name="male" size={20} color={Colors.onBackground} />
                <Text style={styles.settingItemHeaderLabel}>Gender</Text>
              </View>
              <View style={styles.settingItemRight}>
                <Text style={styles.settingItemHeaderValue}>{displayGender}</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.onMuted} />
              </View>
            </Pressable>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.card}>
            <View style={styles.settingItem}>
              <View style={styles.settingItemHeader}>
                <Ionicons name="notifications" size={20} color={Colors.onBackground} />
                <Text style={styles.settingItemHeaderLabel}>Notifications</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={toggleNotifications}
                trackColor={{ false: Colors.muted, true: Colors.primary }}
                thumbColor={Colors.onPrimary}
              />
            </View>
          </View>
        </View>

        {/* App Section */}
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

        {/* Information Section */}
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

        {/* Sign Out Button */}
        <View style={{ marginVertical: verticalScale(16) }}>
          <Button onPress={logout} loading={loading} disabled={loading}>
            <Typography>Sign Out</Typography>
          </Button>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </AnimatedScrollView>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setEditModalVisible(false)}
        >
          <Pressable style={styles.modalContent} onPress={() => { }}>
            <Text style={styles.modalTitle}>
              Edit {editField.charAt(0).toUpperCase() + editField.slice(1)}
            </Text>

            {editField === 'gender' ? (
              <View style={styles.genderOptions}>
                <Pressable
                  style={[
                    styles.genderOption,
                    editValue === 'male' && styles.genderOptionActive,
                  ]}
                  onPress={() => setEditValue('male')}
                >
                  <Ionicons
                    name="male"
                    size={24}
                    color={editValue === 'male' ? Colors.onPrimary : Colors.onSecondary}
                  />
                  <Text
                    style={[
                      styles.genderOptionText,
                      editValue === 'male' && styles.genderOptionTextActive,
                    ]}
                  >
                    Male
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.genderOption,
                    editValue === 'female' && styles.genderOptionActive,
                  ]}
                  onPress={() => setEditValue('female')}
                >
                  <Ionicons
                    name="female"
                    size={24}
                    color={editValue === 'female' ? Colors.onPrimary : Colors.onSecondary}
                  />
                  <Text
                    style={[
                      styles.genderOptionText,
                      editValue === 'female' && styles.genderOptionTextActive,
                    ]}
                  >
                    Female
                  </Text>
                </Pressable>
              </View>
            ) : (
              <TextInput
                style={styles.modalInput}
                value={editValue}
                onChangeText={setEditValue}
                placeholder={`Enter your ${editField}`}
                placeholderTextColor={Colors.onMuted}
                keyboardType={editField === 'age' ? 'number-pad' : 'default'}
                autoFocus
              />
            )}

            <View style={styles.modalButtons}>
              <Pressable
                style={styles.modalButtonCancel}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalButtonCancelText}>Cancel</Text>
              </Pressable>

              <Pressable style={styles.modalButtonSave} onPress={saveEdit}>
                <Text style={styles.modalButtonSaveText}>Save</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
