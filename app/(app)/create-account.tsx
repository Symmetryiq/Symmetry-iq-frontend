import AppleButton from '@/components/buttons/apple-button';
import GoogleButton from '@/components/buttons/google-button';
import Button from '@/components/common/button';
import Input from '@/components/common/input';
import KeyboardWrapper from '@/components/common/keyboard-wrapper';
import { Label } from '@/components/common/label';
import ScreenWrapper from '@/components/common/screen-wrapper';
import Typography from '@/components/common/typography';
import { Colors } from '@/constants/theme';
import { scale, verticalScale } from '@/helpers/scale';
import { useOnboardingStore } from '@/stores/onboarding';
import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import {
  LockIcon,
  MailboxIcon
} from 'phosphor-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const CreateAccount = () => {
  const { signUp, setActive, isLoaded } = useSignUp();
  const { name } = useOnboardingStore();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')

  const onSignUpPress = async () => {
    if (!isLoaded) return
    if (!emailAddress || !password) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await signUp.create({
        emailAddress,
        password,
        firstName: name,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      setPendingVerification(true)
    } catch (err: any) {
      const message =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        'Sign up failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  const onVerifyPress = async () => {
    if (!isLoaded) return
    if (!code) {
      setError('Verification code is required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
      } else {
        setError('Verification failed. Please try again.');
      }
    } catch (err: any) {
      const message =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        'Verification failed. Please try again.';

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (pendingVerification) {
    return (
      <ScreenWrapper>
        <KeyboardWrapper style={styles.container}>
          <View>
            <Typography color="onBackground" center font="semiBold" size={28}>
              Verify your Account
            </Typography>

            <Typography color="onSecondary" center style={{ marginBottom: 24 }}>
              Verify your account to explore variety of exciting features
              powered by AI and fine-tuned by us.
            </Typography>
          </View>

          <View>
            {error && (
              <Typography color="danger" center style={{ marginBottom: 16 }}>
                {error}
              </Typography>
            )}

            <View style={{ marginBottom: 16 }}>
              <Label color="onSecondary" font="medium" style={{ marginBottom: 6 }}>
                Verification Code
              </Label>

              <Input
                placeholder="Enter your verification code"
                value={code}
                onChangeText={(code) => setCode(code)}
                keyboardType="numeric"
                maxLength={6}
                icon={
                  <MailboxIcon weight="fill" size={24} color={Colors.onMuted} />
                }
              />
            </View>

            <Button onPress={onVerifyPress} disabled={!code || !isLoaded} loading={loading}>
              {loading ? (
                <ActivityIndicator color={Colors.onPrimary} />
              ) : (
                <Typography>
                  Verify
                </Typography>
              )}
            </Button>
          </View>
        </KeyboardWrapper>
      </ScreenWrapper>
    )
  }

  return (
    <ScreenWrapper>
      <KeyboardWrapper style={styles.container}>
        <View style={{ flex: 1 }}>
          <View>
            {/* Header */}
            <Typography color="onBackground" center font="semiBold" size={28}>
              Create Account
            </Typography>

            <Typography color="onSecondary" center style={{ marginBottom: 16 }}>
              Create your account to explore variety of exciting features
              powered by AI and fine-tuned by us.
            </Typography>
          </View>

          <View>
            {error && (
              <Typography color="danger" center style={{ marginBottom: 16 }}>
                {error}
              </Typography>
            )}

            {/* Form */}
            <View style={{ marginBottom: 16 }}>
              <Label color="onSecondary" font="medium" style={{ marginBottom: 6 }}>
                Email Address
              </Label>

              <Input
                placeholder="Enter your email address"
                value={emailAddress}
                onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                keyboardType="email-address"
                autoCapitalize="none"
                icon={
                  <MailboxIcon weight="fill" size={24} color={Colors.onMuted} />
                }
              />
            </View>

            <View style={{ marginBottom: 24 }}>
              <Label color="onSecondary" font="medium" style={{ marginBottom: 6 }}>
                Password
              </Label>

              <Input
                placeholder="Enter your password"
                value={password}
                onChangeText={(password) => setPassword(password)}
                secureTextEntry
                icon={
                  <LockIcon weight="fill" size={24} color={Colors.onMuted} />
                }
              />
            </View>

            <Button onPress={onSignUpPress} disabled={!emailAddress || !password} loading={loading}>
              {loading ? (
                <ActivityIndicator color={Colors.onPrimary} />
              ) : (
                <Typography>
                  Sign Up
                </Typography>
              )}
            </Button>
          </View>

          <View>
            <Seperator />

            <View style={{ gap: 16 }}>
              <GoogleButton />
              <AppleButton />
            </View>
          </View>
        </View>

        <View style={styles.redirect}>
          <Typography color="onMuted" font="medium" size={14}>Already have an account?{' '}</Typography>
          <Link href="/sign-in">
            <Typography color="onSecondary" font="medium" size={14} style={{ textDecorationLine: 'underline' }}>Sign In</Typography>
          </Link>
        </View>
      </KeyboardWrapper>
    </ScreenWrapper>
  );
};

export default CreateAccount;

function Seperator() {
  return (
    <View style={styles.dividerContainer}>
      <View style={styles.divider} />
      <Typography color="onMuted">OR</Typography>
      <View style={styles.divider} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderCurve: 'continuous',
    paddingHorizontal: scale(24),
    paddingVertical: 24,
  },

  error: {
    alignSelf: 'center'
  },

  dividerContainer: {
    flexDirection: 'row',
    gap: scale(16),
    alignItems: 'center',
    marginVertical: verticalScale(12),
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },

  redirect: {
    flexDirection: 'row',
    alignSelf: 'center'
  }
});
