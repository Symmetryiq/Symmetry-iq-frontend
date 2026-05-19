import Button from '@/components/Button';
import CodeInput from '@/components/CodeInput';
import LockIcon from '@/components/icons/LockIcon';
import MailIcon from '@/components/icons/MailIcon';
import Input from '@/components/Input';
import ScreenView from '@/components/ScreenView';
import ThemedText from '@/components/ThemedText';
import { COLOR, FONT, TEXT } from '@/constants/theme';
import { navigateTo } from '@/utils/router.util';
import { verticalScale } from '@/utils/scaling.util';
import { useSignIn } from '@clerk/expo';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

const ResetPassword = () => {
  const { signIn, errors, fetchStatus } = useSignIn();

  const [emailAddress, setEmailAddress] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [codeSent, setCodeSent] = useState(false);

  const isFetching = fetchStatus === 'fetching';

  async function sendCode() {
    await signIn.create({
      identifier: emailAddress,
    });

    await signIn.resetPasswordEmailCode.sendCode();
    setCodeSent(true);
  }

  async function verifyCode() {
    await signIn.resetPasswordEmailCode.verifyCode({
      code: code.join(''),
    });
  }

  async function resendCode() {
    setCode(['', '', '', '', '', '']);
    await signIn.resetPasswordEmailCode.sendCode();
  }

  async function submitNewPassword() {
    await signIn.resetPasswordEmailCode.submitPassword({
      password,
    });

    if (signIn.status === 'complete') {
      await signIn.finalize();
    }
  }

  if (signIn.status === 'needs_new_password') {
    return (
      <ScreenView style={styles.container}>
        <View style={styles.header}>
          <ThemedText variant="h1">Set New Password</ThemedText>
          <ThemedText color="onSecondary" style={styles.subtitle}>
            Enter your new password below
          </ThemedText>
        </View>

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
          title="Set New Password"
          onPress={submitNewPassword}
          disabled={!password || isFetching}
          loading={isFetching}
        />
      </ScreenView>
    );
  }

  if (codeSent) {
    return (
      <ScreenView style={styles.container}>
        <View style={styles.header}>
          <ThemedText variant="h1">Verify Code</ThemedText>
          <ThemedText color="onSecondary" style={styles.subtitle}>
            Enter the password reset code sent to your email
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

          <Button
            title="Verify Code"
            onPress={verifyCode}
            disabled={isFetching}
            loading={isFetching}
          />
        </View>
      </ScreenView>
    );
  }

  return (
    <ScreenView style={styles.container}>
      <View style={styles.header}>
        <ThemedText variant="h1">Forgot Password?</ThemedText>
        <ThemedText color="onSecondary" style={styles.subtitle}>
          Enter your email address and we'll send you a code to reset your
          password.
        </ThemedText>
      </View>

      <View style={{ gap: verticalScale(16) }}>
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

        <Button
          title="Send Code"
          onPress={sendCode}
          disabled={!emailAddress || isFetching}
          loading={isFetching}
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

export default ResetPassword;

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
