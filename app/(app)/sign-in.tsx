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
import { isClerkAPIResponseError, useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import {
  LockIcon,
  MailboxIcon
} from 'phosphor-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const Signin = () => {
  const { signIn, isLoaded, setActive } = useSignIn();
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isLoaded) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <ActivityIndicator />
      </View>
    );
  }

  const onSignInPress = async () => {
    if (!emailAddress || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress.trim(),
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
      } else {
        setError("Additional verification required.")
      }
    } catch (err: any) {
      if (isClerkAPIResponseError(err)) setError(err.errors[0].longMessage || 'Invalid credentials.')
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenWrapper>
      <KeyboardWrapper style={styles.container}>
        <View style={{ flex: 1 }}>
          <View>
            <Typography color="onBackground" center font="semiBold" size={28}>
              Welcome back,
            </Typography>

            <Typography color="onSecondary" center style={{ marginBottom: 16 }}>
              Sign in to access smart, personalized reports using our best
              Artificial Intelligence Algorithms.
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

            <Button onPress={onSignInPress} disabled={!emailAddress || !password} loading={loading}>
              {loading ? (
                <ActivityIndicator color={Colors.onPrimary} />
              ) : (
                <Typography>
                  Sign In
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
          <Typography color="onMuted" font="medium" size={14}>Don&apos;t have an account?{' '}</Typography>
          <Link href="/create-account">
            <Typography color="onSecondary" font="medium" size={14} style={{ textDecorationLine: 'underline' }}>Create Account</Typography>
          </Link>
        </View>
      </KeyboardWrapper>
    </ScreenWrapper>
  );
};

export default Signin;

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
