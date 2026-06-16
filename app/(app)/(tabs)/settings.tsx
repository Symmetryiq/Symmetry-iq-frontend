import ScreenView from '@/components/ScreenView';
import ThemedText from '@/components/ThemedText';
import {
  APP_NAME,
  APP_SLOGAN,
  APP_STORE_REVIEW_URL,
  APP_STORE_URL,
  APP_VERSION,
  PLAY_STORE_MARKET_URL,
  PLAY_STORE_URL,
  PRIVACY_POLICY_URL,
  STORE_LINKS_READY,
  TERMS_OF_SERVICE_URL,
  WEBSITE_URL,
} from '@/constants/app';
import { COLOR, RADIUS, SHADOW, SPACE } from '@/constants/theme';
import { useOnboardingStore } from '@/hooks/useOnboardingStore';
import { usePlanStore } from '@/hooks/usePlanStore';
import { usePurchasesStore } from '@/hooks/usePurchasesStore';
import { useRoutineStore } from '@/hooks/useRoutineStore';
import { useScanStore } from '@/hooks/useScanStore';
import { useTaskStore } from '@/hooks/useTaskStore';
import { isPremium } from '@/utils/purchases.util';
import { navigateTo, openURL } from '@/utils/router.util';
import { useAuth, useUser } from '@clerk/expo';
import * as Sentry from '@sentry/react-native';
import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import Purchases from 'react-native-purchases';
import {
  ArrowRightIcon,
  BellIcon,
  CrownIcon,
  EnvelopeIcon,
  GearIcon,
  Icon,
  InfoIcon,
  ShareNetworkIcon,
  ShieldCheckIcon,
  SignOutIcon,
  StarIcon,
  TrashIcon,
  UserCircleIcon,
} from 'phosphor-react-native';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  View,
} from 'react-native';

/* ─── Sub-components ───────────────────────────────────── */

type SettingsItemProps = {
  icon: Icon;
  label: string;
  sublabel?: string;
  onPress: () => void;
  danger?: boolean;
  showArrow?: boolean;
};

function SettingsItem({
  icon: Icon,
  label,
  sublabel,
  onPress,
  danger = false,
  showArrow = true,
}: SettingsItemProps) {
  const iconColor = danger ? COLOR.red : COLOR.onSecondary;
  const labelColor = danger ? COLOR.red : COLOR.onBackground;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.settingsItem,
        pressed && styles.settingsItemPressed,
      ]}
      onPress={onPress}
    >
      <View
        style={[
          styles.settingsIconCircle,
          danger && styles.settingsIconCircleDanger,
        ]}
      >
        <Icon size={20} color={iconColor} weight="bold" />
      </View>

      <View style={styles.settingsItemContent}>
        <ThemedText variant="body" style={{ color: labelColor }}>
          {label}
        </ThemedText>
        {sublabel && (
          <ThemedText variant="caption" color="onMuted">
            {sublabel}
          </ThemedText>
        )}
      </View>

      {showArrow && (
        <ArrowRightIcon size={18} color={COLOR.onMuted} weight="bold" />
      )}
    </Pressable>
  );
}

function SettingsGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.group}>
      <ThemedText variant="label" color="onMuted" style={styles.groupTitle}>
        {title}
      </ThemedText>
      <View style={styles.groupCard}>{children}</View>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

/* ─── Main ─────────────────────────────────────────────── */

const SUPPORT_EMAIL = 'symmetryiq@hotmail.com';

const SettingScreen = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const setCustomerInfo = usePurchasesStore((s) => s.setCustomerInfo);
  const onboardingNameAnswer = useOnboardingStore((s) => s.answers['name']);
  const onboardingName =
    typeof onboardingNameAnswer === 'string'
      ? onboardingNameAnswer.trim()
      : '';
  const [signingOut, setSigningOut] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const handleSignOut = useCallback(async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            setSigningOut(true);
            try {
              await signOut();
            } finally {
              setSigningOut(false);
            }
          },
        },
      ],
      { userInterfaceStyle: 'dark' },
    );
  }, [signOut]);

  const handleDeleteAccount = useCallback(async () => {
    Alert.alert(
      'Delete Account',
      'This action is permanent and cannot be undone. All your data, scan history, and routines will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Permanently',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              useScanStore.getState().reset();
              usePlanStore.getState().reset();
              useOnboardingStore.getState().reset();
              useRoutineStore.getState().reset();
              useTaskStore.getState().reset();
              await user?.delete();
              await signOut();
            } catch (e) {
              Sentry.captureException(e);
              Alert.alert(
                'Error',
                'Failed to delete account. Please try again.',
              );
            } finally {
              setDeleting(false);
            }
          },
        },
      ],
      { userInterfaceStyle: 'dark' },
    );
  }, [user, signOut]);

  const handleManageSubscription = useCallback(() => {
    if (Platform.OS === 'ios') {
      Linking.openURL('https://apps.apple.com/account/subscriptions');
    } else {
      Linking.openURL('https://play.google.com/store/account/subscriptions');
    }
  }, []);

  const handleRestorePurchases = useCallback(async () => {
    setRestoring(true);
    try {
      const customerInfo = await Purchases.restorePurchases();
      setCustomerInfo(customerInfo);
      if (isPremium(customerInfo)) {
        Alert.alert(
          'Restored',
          'Your premium subscription has been restored.',
          [{ text: 'OK' }],
          { userInterfaceStyle: 'dark' },
        );
      } else {
        Alert.alert(
          'Restore Purchases',
          'No active subscription found on this account.',
          [{ text: 'OK' }],
          { userInterfaceStyle: 'dark' },
        );
      }
    } catch (e) {
      Sentry.captureException(e);
      Alert.alert(
        'Restore failed',
        'Could not restore purchases. Please try again.',
        [{ text: 'OK' }],
        { userInterfaceStyle: 'dark' },
      );
    } finally {
      setRestoring(false);
    }
  }, [setCustomerInfo]);

  const handleContactSupport = useCallback(() => {
    Linking.openURL(
      `mailto:${SUPPORT_EMAIL}?subject=Symmetry IQ Support Request`,
    );
  }, []);

  const handleRateApp = useCallback(() => {
    // Until the real App Store ID is set, send users to the website rather than
    // a dead store page. See STORE_LINKS_READY in constants/app.ts.
    if (!STORE_LINKS_READY) {
      Linking.openURL(WEBSITE_URL);
      return;
    }
    if (Platform.OS === 'ios') {
      Linking.openURL(APP_STORE_REVIEW_URL);
    } else {
      Linking.openURL(PLAY_STORE_MARKET_URL);
    }
  }, []);

  const handleShareApp = useCallback(async () => {
    const url = !STORE_LINKS_READY
      ? WEBSITE_URL
      : Platform.OS === 'ios'
        ? APP_STORE_URL
        : PLAY_STORE_URL;
    try {
      await Share.share({
        message: `Check out ${APP_NAME} — ${APP_SLOGAN}\n${url}`,
        url,
      });
    } catch {
      // User dismissed the share sheet, or sharing is unavailable — ignore.
    }
  }, []);

  return (
    <ScreenView edges={['top', 'left', 'right']} padded={false}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Beautiful Header ── */}
        <View style={styles.header}>
          <View style={styles.headerIconCircle}>
            <GearIcon size={28} color={COLOR.primaryLight} weight="fill" />
          </View>
          <ThemedText variant="h1">Settings</ThemedText>
          <ThemedText variant="bodySmall" color="onMuted">
            Manage your preferences &amp; account
          </ThemedText>
        </View>

        {/* ── Profile / Sign-in Card ── */}
        {user ? (
          <Pressable
            style={({ pressed }) => [
              styles.profileCard,
              pressed && { opacity: 0.85 },
            ]}
            onPress={() => navigateTo('/profile')}
          >
            <View style={styles.profileImageWrapper}>
              {user.imageUrl ? (
                <Image
                  source={user.imageUrl}
                  style={styles.profileImage}
                  contentFit="cover"
                />
              ) : (
                <UserCircleIcon size={48} color={COLOR.onMuted} />
              )}
            </View>

            <View style={styles.profileInfo}>
              <ThemedText variant="h4">{user.fullName || 'User'}</ThemedText>
              <ThemedText variant="bodySmall" color="onMuted">
                {user.primaryEmailAddress?.emailAddress || ''}
              </ThemedText>
            </View>

            <ArrowRightIcon size={20} color={COLOR.onMuted} weight="bold" />
          </Pressable>
        ) : (
          <Pressable
            style={({ pressed }) => [
              styles.profileCard,
              pressed && { opacity: 0.85 },
            ]}
            onPress={() => navigateTo('/(auth)/login')}
          >
            <View style={styles.profileImageWrapper}>
              <Image
                source={require('@/assets/images/logo.png')}
                style={styles.profileImage}
                contentFit="contain"
              />
            </View>

            <View style={styles.profileInfo}>
              <ThemedText variant="h4">
                {onboardingName ? onboardingName : 'Welcome'}
              </ThemedText>
              <ThemedText variant="bodySmall" color="onMuted">
                Sign in to back up your account
              </ThemedText>
            </View>

            <ArrowRightIcon size={20} color={COLOR.onMuted} weight="bold" />
          </Pressable>
        )}

        {/* ── Subscription ── */}
        <SettingsGroup title="Subscription">
          <SettingsItem
            icon={CrownIcon}
            label="Manage Subscription"
            sublabel="View or cancel your plan"
            onPress={handleManageSubscription}
          />
          <Divider />
          <SettingsItem
            icon={StarIcon}
            label={restoring ? 'Restoring…' : 'Restore Purchases'}
            sublabel="Recover previous subscriptions"
            onPress={handleRestorePurchases}
            showArrow={false}
          />
        </SettingsGroup>

        {/* ── General ── */}
        <SettingsGroup title="General">
          <SettingsItem
            icon={BellIcon}
            label="Notifications"
            sublabel="Manage push notifications"
            onPress={() => navigateTo('/notifications')}
          />
        </SettingsGroup>

        {/* ── Support ── */}
        <SettingsGroup title="Support">
          <SettingsItem
            icon={EnvelopeIcon}
            label="Contact Support"
            sublabel={SUPPORT_EMAIL}
            onPress={handleContactSupport}
          />
          <Divider />
          <SettingsItem
            icon={StarIcon}
            label="Rate App"
            sublabel="Help us by leaving a review"
            onPress={handleRateApp}
          />
          <Divider />
          <SettingsItem
            icon={ShareNetworkIcon}
            label="Share App"
            sublabel="Tell a friend about Symmetry IQ"
            onPress={handleShareApp}
          />
        </SettingsGroup>

        {/* ── Privacy & Legal ── */}
        <SettingsGroup title="Privacy & Legal">
          <SettingsItem
            icon={ShieldCheckIcon}
            label="Privacy Policy"
            onPress={() => openURL(PRIVACY_POLICY_URL)}
          />
          <Divider />
          <SettingsItem
            icon={InfoIcon}
            label="Terms of Service"
            onPress={() => openURL(TERMS_OF_SERVICE_URL)}
          />
        </SettingsGroup>

        {/* ── Account (signed in only) ── */}
        {user && (
          <SettingsGroup title="Account">
            <SettingsItem
              icon={SignOutIcon}
              label="Sign Out"
              onPress={handleSignOut}
              showArrow={false}
            />
            <Divider />
            <SettingsItem
              icon={TrashIcon}
              label="Delete Account"
              sublabel="Permanently delete all your data"
              onPress={handleDeleteAccount}
              danger
              showArrow={false}
            />
          </SettingsGroup>
        )}

        <ThemedText variant="badge" color="onMuted" style={styles.versionText}>
          Symmetry IQ v{APP_VERSION}
        </ThemedText>
      </ScrollView>
    </ScreenView>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    padding: SPACE.xl,
    gap: SPACE.xl,
    paddingBottom: SPACE['3xl'],
  },

  /* ── Header ── */

  header: {
    alignItems: 'center',
    gap: SPACE.sm,
    paddingVertical: SPACE.lg,
  },

  headerIconCircle: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.full,
    backgroundColor: 'hsla(250, 50%, 50%, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACE.xs,
  },

  /* ── Profile ── */

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACE.lg,
    backgroundColor: COLOR.card,
    borderWidth: 1,
    borderColor: COLOR.border,
    borderRadius: RADIUS['2xl'],
    padding: SPACE.lg,
    boxShadow: SHADOW.sm,
  },

  profileImageWrapper: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    backgroundColor: COLOR.muted,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLOR.primaryLight,
  },

  profileImage: {
    width: '100%',
    height: '100%',
  },

  profileInfo: {
    flex: 1,
    gap: 2,
  },

  /* ── Groups ── */

  group: {
    gap: SPACE.sm,
  },

  groupTitle: {
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    paddingLeft: SPACE.xs,
  },

  groupCard: {
    backgroundColor: COLOR.card,
    borderWidth: 1,
    borderColor: COLOR.border,
    borderRadius: RADIUS['2xl'],
    overflow: 'hidden',
    boxShadow: SHADOW.sm,
  },

  /* ── Items ── */

  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACE.md,
    paddingVertical: SPACE.lg,
    paddingHorizontal: SPACE.lg,
  },

  settingsItemPressed: {
    backgroundColor: COLOR.muted,
  },

  settingsIconCircle: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLOR.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  settingsIconCircleDanger: {
    backgroundColor: 'hsla(0, 50%, 50%, 0.12)',
  },

  settingsItemContent: {
    flex: 1,
    gap: 1,
  },

  divider: {
    height: 1,
    backgroundColor: COLOR.border,
    marginLeft: 64,
  },

  versionText: {
    textAlign: 'center',
  },
});
