import Button from '@/components/Button';
import CodeInput from '@/components/CodeInput';
import AppleIcon from '@/components/icons/AppleIcon';
import GoogleIcon from '@/components/icons/GoogleIcon';
import LockIcon from '@/components/icons/LockIcon';
import MailIcon from '@/components/icons/MailIcon';
import Input from '@/components/Input';
import ScreenView from '@/components/ScreenView';
import ThemedText from '@/components/ThemedText';
import { COLOR, FONT, TEXT } from '@/constants/theme';
import { useOnboardingStore } from '@/hooks/useOnboardingStore';
import { navigateTo } from '@/utils/router.util';
import { verticalScale } from '@/utils/scaling.util';
import { useSignUp } from '@clerk/expo';
import { useSignInWithApple } from '@clerk/expo/apple';
import { useSignInWithGoogle } from '@clerk/expo/google';
import React, { useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, View } from 'react-native';

const Register = () => {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { answers } = useOnboardingStore();

  const { startAppleAuthenticationFlow } = useSignInWithApple();
  const { startGoogleAuthenticationFlow } = useSignInWithGoogle();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);

  const [activeAction, setActiveAction] = useState<
    'google' | 'apple' | 'email' | null
  >(null);

  const isFetching = fetchStatus === 'fetching';

  async function signUpWithGoogle() {
    try {
      setActiveAction('google');
      const { createdSessionId, setActive } =
        await startGoogleAuthenticationFlow();

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (err: any) {
      if (err.code === 'SIGN_IN_CANCELLED' || err.code === '-5') {
        return;
      }

      Alert.alert(
        'Error',
        err.message || 'An error occurred during Google sign-in',
      );
    } finally {
      setActiveAction(null);
    }
  }

  async function signUpWithApple() {
    try {
      setActiveAction('apple');
      const { createdSessionId, setActive } =
        await startAppleAuthenticationFlow();

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (err: any) {
      if (err.code === 'ERR_REQUEST_CANCELED') return;

      Alert.alert(
        'Error',
        err.message || 'An error occurred during Apple sign-in',
      );
    } finally {
      setActiveAction(null);
    }
  }

  async function onSubmit() {
    const name = answers['name'] as string;

    const { error } = await signUp.password({
      emailAddress,
      password,
      firstName: name.split(' ')[0],
      lastName: name.split(' ')[1],
    });

    if (!error) await signUp.verifications.sendEmailCode();
  }

  async function verifyCode() {
    await signUp.verifications.verifyEmailCode({ code: code.join('') });

    if (signUp.status === 'complete') {
      await signUp.finalize();
    }
  }

  async function resendCode() {
    await signUp.verifications.sendEmailCode();
  }

  if (
    signUp.status === 'missing_requirements' &&
    signUp.unverifiedFields.includes('email_address') &&
    signUp.missingFields.length === 0
  ) {
    return (
      <ScreenView style={styles.container}>
        <View style={styles.header}>
          <ThemedText variant="h1">Verify Code</ThemedText>
          <ThemedText color="onSecondary" style={styles.subtitle}>
            Enter the verification code sent to your email
          </ThemedText>
        </View>

        <View style={{ gap: verticalScale(12) }}>
          {errors.fields.code?.longMessage && (
            <ThemedText
              color="red"
              variant="bodySmall"
              style={{ textAlign: 'center' }}
            >
              {errors.fields.code.longMessage}
            </ThemedText>
          )}

          <CodeInput
            value={code}
            onChange={(values) => setCode(values)}
            disabled={isFetching}
            length={6}
            onResendOTP={resendCode}
          />

          <Button
            title="Verify Code"
            onPress={verifyCode}
            disabled={isFetching}
          />
        </View>
      </ScreenView>
    );
  }

  return (
    <ScreenView style={styles.container}>
      <View style={styles.header}>
        <ThemedText variant="h1">Get Started</ThemedText>
        <ThemedText color="onSecondary" style={styles.subtitle}>
          Join thousands improving their facial symmetry
        </ThemedText>
      </View>

      <View style={styles.socialRow}>
        <Button
          title="Google"
          variant="secondary"
          icon={GoogleIcon}
          fullWidth
          onPress={() => signUpWithGoogle()}
          loading={activeAction === 'google'}
          disabled={isFetching}
        />

        {Platform.OS === 'ios' && (
          <Button
            title="Apple"
            variant="secondary"
            icon={AppleIcon}
            fullWidth
            onPress={() => signUpWithApple()}
            loading={activeAction === 'apple'}
            disabled={isFetching}
          />
        )}
      </View>

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <ThemedText color="onMuted" variant="caption">
          or continue with
        </ThemedText>
        <View style={styles.dividerLine} />
      </View>

      <Input
        label="Email"
        placeholder="you@example.com"
        icon={MailIcon}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        value={emailAddress}
        onChangeText={setEmailAddress}
        disabled={isFetching}
        error={errors.fields.emailAddress?.message}
      />

      <Input
        label="Password"
        placeholder="••••••••"
        icon={LockIcon}
        secureToggle
        autoCapitalize="none"
        autoComplete="password"
        value={password}
        onChangeText={setPassword}
        disabled={isFetching}
        error={errors.fields.password?.message}
      />

      <Button
        title="Create Account"
        variant="primary"
        onPress={onSubmit}
        loading={activeAction === 'email'}
        disabled={isFetching || !emailAddress || !password}
      />

      <View style={styles.footer}>
        <ThemedText color="onSecondary" variant="caption">
          Already have an account?
        </ThemedText>
        <Pressable onPress={() => navigateTo('/login')} hitSlop={6}>
          <ThemedText style={styles.linkText}>Sign In</ThemedText>
        </Pressable>
      </View>
    </ScreenView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    gap: verticalScale(24),
  },

  header: {
    alignItems: 'center',
    gap: 4,
  },

  subtitle: {
    maxWidth: 300,
    textAlign: 'center',
  },

  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLOR.border,
  },

  forgotText: {
    ...TEXT.caption,
    color: COLOR.primaryLight,
    fontFamily: FONT.medium,
    textAlign: 'right',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },

  linkText: {
    ...TEXT.caption,
    color: COLOR.primaryLight,
    fontFamily: FONT.semiBold,
  },
});
