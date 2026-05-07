import Button from '@/components/Button';
import ScreenView from '@/components/ScreenView';
import ThemedText from '@/components/ThemedText';
import { COLOR, FONT, RADIUS, SHADOW, SPACE, TEXT } from '@/constants/theme';
import { goBack } from '@/utils/router.util';
import { useUser } from '@clerk/expo';
import { Image } from 'expo-image';
import {
  launchImageLibraryAsync,
  MediaType,
  requestMediaLibraryPermissionsAsync,
} from 'expo-image-picker';
import {
  ArrowLeftIcon,
  CameraIcon,
  CheckIcon,
  UserCircleIcon,
} from 'phosphor-react-native';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

type EditableFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  editable?: boolean;
  placeholder?: string;
};

function EditableField({
  label,
  value,
  onChangeText,
  editable = true,
  placeholder,
}: EditableFieldProps) {
  return (
    <View style={styles.fieldContainer}>
      <ThemedText variant="label" color="onMuted" style={styles.fieldLabel}>
        {label}
      </ThemedText>
      <TextInput
        style={[styles.fieldInput, !editable && styles.fieldInputDisabled]}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        placeholder={placeholder}
        placeholderTextColor={COLOR.onMuted}
      />
    </View>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fieldContainer}>
      <ThemedText variant="label" color="onMuted" style={styles.fieldLabel}>
        {label}
      </ThemedText>
      <View style={[styles.fieldInput, styles.fieldInputDisabled]}>
        <ThemedText variant="body" color="onMuted">
          {value}
        </ThemedText>
      </View>
    </View>
  );
}

const ProfileScreen = () => {
  const { user } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const hasChanges =
    firstName !== (user?.firstName || '') ||
    lastName !== (user?.lastName || '');

  const handleSave = useCallback(async () => {
    if (!user || !hasChanges) return;

    setSaving(true);
    try {
      await user.update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      Alert.alert('Success', 'Your profile has been updated.');
    } catch {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  }, [user, firstName, lastName, hasChanges]);

  const handleChangePhoto = useCallback(async () => {
    if (!user) return;

    const { status } = await requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Photo library access is needed to change your profile photo.',
      );
      return;
    }

    const result = await launchImageLibraryAsync({
      mediaTypes: ['images'] as MediaType[],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.length) return;

    setUploadingImage(true);
    try {
      const uri = result.assets[0].uri;
      const response = await fetch(uri);
      const blob = await response.blob();

      const file = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
      await user.setProfileImage({ file });
    } catch {
      Alert.alert('Error', 'Failed to update profile photo. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  }, [user]);

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <ScreenView style={styles.screen}>
      <View style={styles.topBar}>
        <Pressable style={styles.backButton} onPress={goBack} hitSlop={8}>
          <ArrowLeftIcon color={COLOR.onBackground} size={22} />
        </Pressable>
        <ThemedText variant="h4">Profile</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            {user?.imageUrl ? (
              <Image
                source={user.imageUrl}
                style={styles.avatarImage}
                contentFit="cover"
              />
            ) : (
              <UserCircleIcon size={64} color={COLOR.onMuted} />
            )}

            <Pressable
              style={({ pressed }) => [
                styles.cameraButton,
                pressed && { opacity: 0.7 },
              ]}
              onPress={handleChangePhoto}
              disabled={uploadingImage}
            >
              <CameraIcon color={COLOR.onPrimary} size={16} weight="bold" />
            </Pressable>
          </View>

          <ThemedText variant="h2">{user?.fullName || 'User'}</ThemedText>
          {memberSince ? (
            <ThemedText variant="caption" color="onMuted">
              Member since {memberSince}
            </ThemedText>
          ) : null}
        </View>

        <View style={styles.formCard}>
          <EditableField
            label="First Name"
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter first name"
          />

          <View style={styles.fieldDivider} />

          <EditableField
            label="Last Name"
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter last name"
          />

          <View style={styles.fieldDivider} />

          <ReadOnlyField
            label="Email"
            value={user?.primaryEmailAddress?.emailAddress || '—'}
          />
        </View>

        {hasChanges && (
          <Button
            title="Save Changes"
            variant="primary"
            icon={CheckIcon}
            iconPosition="right"
            onPress={handleSave}
            loading={saving}
            size="lg"
          />
        )}
      </ScrollView>
    </ScreenView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: SPACE.md,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLOR.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    gap: SPACE.xl,
    paddingBottom: SPACE['3xl'],
  },

  avatarSection: {
    alignItems: 'center',
    gap: SPACE.sm,
    paddingTop: SPACE.lg,
  },

  avatarWrapper: {
    width: 104,
    height: 104,
    borderRadius: RADIUS.full,
    overflow: 'visible',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.muted,
    borderWidth: 3,
    borderColor: COLOR.primaryLight,
    boxShadow: SHADOW.primary,
    marginBottom: SPACE.xs,
  },

  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: RADIUS.full,
  },

  cameraButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: COLOR.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLOR.background,
  },

  formCard: {
    backgroundColor: COLOR.card,
    borderWidth: 1,
    borderColor: COLOR.border,
    borderRadius: RADIUS['2xl'],
    overflow: 'hidden',
    boxShadow: SHADOW.sm,
  },

  fieldContainer: {
    paddingHorizontal: SPACE.lg,
    paddingVertical: SPACE.md,
    gap: SPACE.xs,
  },

  fieldLabel: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 12,
  },

  fieldInput: {
    ...TEXT.body,
    fontFamily: FONT.regular,
    color: COLOR.onBackground,
    paddingVertical: SPACE.xs,
  },

  fieldInputDisabled: {
    backgroundColor: COLOR.onMuted,
  },

  fieldDivider: {
    height: 1,
    backgroundColor: COLOR.border,
    marginLeft: SPACE.lg,
  },
});
