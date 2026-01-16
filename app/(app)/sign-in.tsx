import AppleAuthButton from '@/components/apple-auth';
import Button from '@/components/common/button';
import Input from '@/components/common/input';
import { Label } from '@/components/common/label';
import ScreenWrapper from '@/components/common/screen-wrapper';
import Typography from '@/components/common/typography';
import GoogleAuthButton from '@/components/google-auth';
import { Colors } from '@/constants/theme';
import { scale, verticalScale } from '@/helpers/scale';
import { isValidEmail } from '@/helpers/validation';
import { useAuthStore } from '@/stores/auth-store';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  LockIcon,
  MailboxIcon,
  WarningIcon
} from 'phosphor-react-native';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

const Signin = () => {
  const router = useRouter();
  const canGoBack = router.canGoBack();
  const { signIn, signInWithGoogle, loading, error, clearError } =
    useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!isValidEmail(email)) {
      setLocalError('Invalid email');
      return;
    }

    if (!password) {
      setLocalError('Password required');
      return;
    }

    setLocalError(null);

    await signIn(email.trim(), password);
  };

  const handleBack = () => {
    canGoBack && router.back();
  };

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.header}>
        {canGoBack && (
          <Pressable onPress={handleBack}>
            <Feather
              name="chevron-left"
              size={24}
              color={Colors.onBackground}
            />
          </Pressable>
        )}

        <Typography color="onSecondary" font="regular" size={16}>
          Sign in to your account.
        </Typography>
      </View>

      <View style={styles.content}>
        <View style={styles.contentHeader}>
          <Typography color="onBackground" font="semiBold" size={24}>
            Welcome back,
          </Typography>

          <Typography color="onSecondary" style={{ textAlign: 'center' }}>
            Sign in to access smart, personalized reports using our best
            Artificial Intelligence Algorithms.
          </Typography>
        </View>
        <View style={styles.form}>
          <View style={styles.input}>
            <Label color="onSecondary" font="medium">
              Email
            </Label>

            <Input
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                clearError();
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              icon={
                <MailboxIcon weight="fill" size={24} color={Colors.onMuted} />
              }
            />
          </View>

          <View style={styles.input}>
            <Label color="onSecondary" font="medium">
              Password
            </Label>

            <Input
              placeholder="Enter your password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                clearError();
              }}
              secureTextEntry
              icon={<LockIcon weight="fill" size={24} color={Colors.onMuted} />}
            />
          </View>

          {(localError || error) && (
            <View style={styles.errorContainer}>
              <WarningIcon size={20} color={Colors.danger} />

              <Typography color="danger">{localError || error}</Typography>
            </View>
          )}

          <Button onPress={handleSubmit} loading={loading} disabled={loading}>
            <Typography>{loading ? 'Signing in...' : 'Sign In'}</Typography>
          </Button>
        </View>

        <View style={styles.divider}>
          <View style={styles.seperator} />
          <Typography color="onMuted">Or continue with</Typography>
          <View style={styles.seperator} />
        </View>

        <View style={styles.socialAuthWrapper}>
          {/* <Button
            onPress={signInWithGoogle}
            style={styles.socialButton}
            disabled={loading}
          >
            <GoogleLogoIcon
              weight="bold"
              size={24}
              color={Colors.onSecondary}
            />

            <Typography>Login with Google</Typography>
          </Button> */}
          <GoogleAuthButton />
          <AppleAuthButton />
        </View>

        <View
          style={{ alignSelf: 'center', flexDirection: 'row', gap: scale(8) }}
        >
          <Typography color="onSecondary">
            Don&apos;t have an account?
          </Typography>
          <Pressable onPress={() => router.push('/create-account')}>
            <Typography color="onPrimary">Create Account</Typography>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Signin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: verticalScale(8),
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: scale(16),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
  },

  content: {
    flex: 1,
    backgroundColor: Colors.card,
    gap: verticalScale(20),
    borderTopLeftRadius: verticalScale(50),
    borderTopRightRadius: verticalScale(50),
    borderCurve: 'continuous',
    padding: verticalScale(16),
  },

  contentHeader: {
    gap: verticalScale(8),
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(16),
  },

  form: {
    gap: verticalScale(16),
  },

  input: {
    gap: verticalScale(8),
  },

  errorContainer: {
    paddingVertical: verticalScale(8),
    // backgroundColor: Colors.muted,
    borderRadius: verticalScale(8),
    gap: scale(8),
    flexDirection: 'row',
    justifyContent: 'center',
  },

  divider: {
    flexDirection: 'row',
    gap: scale(16),
    alignItems: 'center',
  },

  seperator: {
    borderWidth: 1,
    borderColor: Colors.border,
    height: 1,
    width: '30%',
  },

  socialAuthWrapper: {
    gap: verticalScale(16),
  },

  socialButton: {
    backgroundColor: Colors.secondary,
    flexDirection: 'row',
    gap: scale(8),
  },
});
