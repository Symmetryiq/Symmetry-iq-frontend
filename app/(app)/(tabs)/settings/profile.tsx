import Button from '@/components/common/button';
import Input from '@/components/common/input';
import ScreenWrapper from '@/components/common/screen-wrapper';
import Selectable from '@/components/common/selectable';
import Typography from '@/components/common/typography';
import { Colors, Fonts } from '@/constants/theme';
import { updateUserProfile } from '@/services/api/user.api'; // Added import for updateUserProfile
import { useOnboardingStore } from '@/stores/onboarding';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

const ProfileScreen = () => {
  const { user } = useUser();
  const router = useRouter();
  const { age, gender, setAge, setGender } = useOnboardingStore();

  const [name, setName] = useState(user?.fullName || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    if (!age.trim() || isNaN(Number(age)) || Number(age) < 1 || Number(age) > 120) {
      Alert.alert('Error', 'Please enter a valid age (1-120)');
      return;
    }

    setLoading(true);
    try {
      // Update name via Clerk
      const [firstName, ...lastNameParts] = name.trim().split(' ');
      const lastName = lastNameParts.join(' ') || '';

      await user?.update({
        firstName: firstName,
        lastName: lastName,
      });

      // Update age and gender via backend API
      await updateUserProfile({
        age: age,
        gender: gender,
        notifications: (user?.publicMetadata?.preferences as any)?.notifications ?? true,
      });

      // Reload user to get updated metadata
      await user?.reload();

      router.back()
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
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
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <Text style={styles.sectionDescription}>
            Update your profile information below
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <Input
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              autoCapitalize="words"
              containerStyle={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Age</Text>
            <Input
              value={age}
              onChangeText={setAge}
              placeholder="Enter your age"
              keyboardType="numeric"
              maxLength={3}
              containerStyle={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderOptions}>
              <Selectable
                label="Male"
                selected={gender === 'male'}
                onPress={() => setGender('male')}
                icon={<Ionicons name="male" size={24} color={gender === 'male' ? Colors.onPrimary : Colors.onSecondary} />}
                style={styles.genderSelectable}
              />
              <Selectable
                label="Female"
                selected={gender === 'female'}
                onPress={() => setGender('female')}
                icon={<Ionicons name="female" size={24} color={gender === 'female' ? Colors.onPrimary : Colors.onSecondary} />}
                style={styles.genderSelectable}
              />
            </View>
          </View>
        </View>

        <Button onPress={handleSave} disabled={loading} style={styles.saveButton}>
          <Typography color="onPrimary" font="semiBold" size={18}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Typography>
        </Button>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default ProfileScreen;

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
    marginBottom: 8,
  },

  sectionDescription: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.onSecondary,
    marginBottom: 24,
  },

  inputGroup: {
    marginBottom: 20,
  },

  label: {
    fontSize: 18,
    fontFamily: Fonts.medium,
    color: Colors.onBackground,
    marginBottom: 12,
  },

  input: {
    width: '100%',
  },

  genderOptions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },

  genderSelectable: {
    flex: 1,
  },

  saveButton: {
    marginTop: 16,
  },
});
