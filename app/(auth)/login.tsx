import Button from '@/components/Button';
import CodeInput from '@/components/CodeInput';
import AppleIcon from '@/components/icons/AppleIcon';
import GoogleIcon from '@/components/icons/GoogleIcon';
import LockIcon from '@/components/icons/LockIcon';
import MailIcon from '@/components/icons/MailIcon';
import Input from '@/components/Input';
import ScreenView from '@/components/ScreenView';
import ThemedText from '@/components/ThemedText';
import { COLOR, FONT, RADIUS, TEXT } from '@/constants/theme';
import { navigateTo } from '@/utils/router.util';
import { verticalScale } from '@/utils/scaling.util';
import { useSignIn } from '@clerk/expo';
import { useSignInWithApple } from '@clerk/expo/apple';
import { useSignInWithGoogle } from '@clerk/expo/google';
import React, { useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, View } from 'react-native';

const LoginScreen = () => {
  const { signIn, fetchStatus, errors } = useSignIn();
  const { startAppleAuthenticationFlow } = useSignInWithApple();
  const { startGoogleAuthenticationFlow } = useSignInWithGoogle();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [activeAction, setActiveAction] = useState<
    'google' | 'apple' | 'email' | null
  >(null);

  const isFetching = fetchStatus === 'fetching';

  async function loginWithEmail() {
    setActiveAction('email');
    await signIn.password({ emailAddress, password });

    if (signIn.status === 'complete') {
      await signIn.finalize();
    } else if (signIn.status === 'needs_client_trust') {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === 'email_code',
      );
      if (emailCodeFactor) await signIn.mfa.sendEmailCode();
    }
    setActiveAction(null);
  }

  async function loginWithGoogle() {
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

  async function loginWithApple() {
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

  async function verifyCode() {
    await signIn.mfa.verifyEmailCode({ code: code.join('') });

    if (signIn.status === 'complete') {
      await signIn.finalize();
    }
  }

  async function resendCode() {
    setCode(['', '', '', '', '', '']);
    await signIn.mfa.sendEmailCode();
  }

  if (signIn.status === 'needs_client_trust') {
    return (
      <ScreenView style={{ gap: verticalScale(32) }}>
        <View style={styles.header}>
          <ThemedText variant="h1">Verify your Account</ThemedText>
          <ThemedText color="onSecondary" style={styles.subtitle}>
            We sent a verification code to your email. Enter it below to
            continue.
          </ThemedText>
        </View>

        <View style={{ gap: verticalScale(12) }}>
          {errors.fields.code?.message && (
            <ThemedText
              color="red"
              variant="bodySmall"
              style={{ textAlign: 'center' }}
            >
              {errors.fields.code.message}
            </ThemedText>
          )}

          <CodeInput
            value={code}
            onChange={(values) => setCode(values)}
            disabled={isFetching}
            length={6}
            onResendOTP={resendCode}
          />
        </View>

        <Button title="Verify" onPress={verifyCode} disabled={isFetching} />
      </ScreenView>
    );
  }

  return (
    <ScreenView style={styles.container}>
      <View style={styles.header}>
        <ThemedText variant="h1">Welcome Back</ThemedText>
        <ThemedText color="onSecondary" style={styles.subtitle}>
          Sign in to unlock your full facial wellness report and personalized
          routines.
        </ThemedText>
      </View>

      <View style={styles.socialRow}>
        <Button
          title="Google"
          variant="secondary"
          icon={GoogleIcon}
          fullWidth
          onPress={() => loginWithGoogle()}
          loading={activeAction === 'google'}
          disabled={isFetching}
        />

        {Platform.OS === 'ios' && (
          <Button
            title="Apple"
            variant="secondary"
            icon={AppleIcon}
            fullWidth
            onPress={() => loginWithApple()}
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

      <View style={styles.form}>
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
          error={errors.fields.identifier?.message}
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

        <Pressable onPress={() => navigateTo('/reset-password')} hitSlop={6}>
          <ThemedText style={styles.forgotText}>Forgot password?</ThemedText>
        </Pressable>

        <Button
          title="Sign In"
          variant="primary"
          onPress={loginWithEmail}
          loading={activeAction === 'email'}
          disabled={isFetching || !emailAddress || !password}
        />
      </View>

      <View style={styles.footer}>
        <ThemedText color="onSecondary" variant="caption">
          Don't have an account?
        </ThemedText>
        <Pressable onPress={() => navigateTo('/register')} hitSlop={6}>
          <ThemedText style={styles.linkText}>Create Account</ThemedText>
        </Pressable>
      </View>
    </ScreenView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

  form: {
    gap: 16,
  },

  forgotText: {
    ...TEXT.caption,
    color: COLOR.primaryLight,
    fontFamily: FONT.medium,
    textAlign: 'right',
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

  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },

  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 52,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLOR.border,
    backgroundColor: COLOR.card,
  },

  socialPressed: {
    opacity: 0.75,
  },

  socialDisabled: {
    opacity: 0.5,
  },

  socialLabel: {
    ...TEXT.body,
    fontFamily: FONT.semiBold,
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
