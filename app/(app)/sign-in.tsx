import AppleButton from '@/components/buttons/apple-button';
import GoogleButton from '@/components/buttons/google-button';
import Button from '@/components/common/button';
import Input from '@/components/common/input';
import { Label } from '@/components/common/label';
import ScreenWrapper from '@/components/common/screen-wrapper';
import Typography from '@/components/common/typography';
import { Colors } from '@/constants/theme';
import { scale, verticalScale } from '@/helpers/scale';
import { isClerkAPIResponseError, useSignIn } from '@clerk/clerk-expo';
import { ClerkAPIError } from '@clerk/types';
import { useRouter } from 'expo-router';
import {
  LockIcon,
  MailboxIcon
} from 'phosphor-react-native';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

const Signin = () => {
  const { isLoaded, signIn, setActive } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [errors, setErrors] = useState<ClerkAPIError[]>();

  const onSignInPress = async () => {
    setErrors(undefined)
    if (!isLoaded) return

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
      } else if (signInAttempt.status === 'needs_second_factor') {
        setPendingVerification(true)
      } else if (signInAttempt.status === 'needs_first_factor') {
        console.log(signInAttempt.supportedFirstFactors)
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) setErrors(err.errors)
      console.error(JSON.stringify(err, null, 2))
    }
  }

  const onVerifyPress = async () => {
    setErrors(undefined)
    if (!isLoaded) return

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
      } else if (signInAttempt.status === 'needs_second_factor') {
        setPendingVerification(true)
      } else if (signInAttempt.status === 'needs_first_factor') {
        console.log(signInAttempt.supportedFirstFactors)
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) setErrors(err.errors)
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if (pendingVerification) {
    return (
      <ScreenWrapper style={styles.container}>
        <View style={styles.content}>
          <View style={styles.contentHeader}>
            <Typography color="onBackground" font="semiBold" size={24}>
              Verify
            </Typography>

            <Typography color="onSecondary" style={{ textAlign: 'center' }}>
              Verify your email to access smart, personalized reports using our
              best Artificial Intelligence Algorithms.
            </Typography>
          </View>
          <View style={styles.form}>
            <View style={styles.input}>
              <Label color="onSecondary" font="medium">
                Email
              </Label>

              <Input
                placeholder="Enter your email"
                value={emailAddress}
                onChangeText={(email) => setEmailAddress(email)}
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
                onChangeText={(password) => setPassword(password)}
                secureTextEntry
                icon={<LockIcon weight="fill" size={24} color={Colors.onMuted} />}
              />
            </View>

            {errors?.map((error) => (
              <View key={error.code} style={styles.errorContainer}>
                <Typography color="danger">{error.longMessage}</Typography>
              </View>
            ))}

            <Button onPress={onSignInPress} loading={!isLoaded} disabled={!isLoaded}>
              <Typography>{!isLoaded ? 'Signing in...' : 'Sign In'}</Typography>
            </Button>
          </View>

          <View style={styles.divider}>
            <View style={styles.seperator} />
            <Typography color="onMuted">Or continue with</Typography>
            <View style={styles.seperator} />
          </View>

          <View style={styles.socialAuthWrapper}>
            <GoogleButton />
            <AppleButton />
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
    )
  }

  return (
    <ScreenWrapper style={styles.container}>
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
              value={emailAddress}
              onChangeText={(email) => setEmailAddress(email)}
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
              onChangeText={(password) => setPassword(password)}
              secureTextEntry
              icon={<LockIcon weight="fill" size={24} color={Colors.onMuted} />}
            />
          </View>

          {errors?.map((error) => (
            <View key={error.code} style={styles.errorContainer}>
              <Typography color="danger">{error.longMessage}</Typography>
            </View>
          ))}

          <Button onPress={onSignInPress} loading={!isLoaded} disabled={!isLoaded}>
            <Typography>{!isLoaded ? 'Signing in...' : 'Sign In'}</Typography>
          </Button>
        </View>

        <View style={styles.divider}>
          <View style={styles.seperator} />
          <Typography color="onMuted">Or continue with</Typography>
          <View style={styles.seperator} />
        </View>

        <View style={styles.socialAuthWrapper}>
          <GoogleButton />
          <AppleButton />
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
