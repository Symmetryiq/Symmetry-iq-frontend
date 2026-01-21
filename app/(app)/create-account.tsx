import AppleButton from '@/components/buttons/apple-button';
import GoogleButton from '@/components/buttons/google-button';
import Button from '@/components/common/button';
import Input from '@/components/common/input';
import { Label } from '@/components/common/label';
import ScreenWrapper from '@/components/common/screen-wrapper';
import Typography from '@/components/common/typography';
import { Colors } from '@/constants/theme';
import { scale, verticalScale } from '@/helpers/scale';
import { isStrongPassword, isValidEmail } from '@/helpers/validation';
import { useOnboardingStore } from '@/stores/onboarding';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import {
  LockIcon,
  MailboxIcon
} from 'phosphor-react-native';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

const CreateAccount = () => {
  const { isLoaded, signUp, setActive } = useSignUp()
  const { name } = useOnboardingStore();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')

  const onSignUpPress = async () => {
    if (!isLoaded) return

    console.log(emailAddress, password)

    try {
      await signUp.create({
        emailAddress,
        password,
        firstName: name,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      setPendingVerification(true)
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if (pendingVerification) {
    return (
      <ScreenWrapper style={styles.container}>
        <View style={styles.content}>
          <View style={styles.contentHeader}>
            <Typography color="onBackground" font="semiBold" size={24}>
              Verify your Account
            </Typography>

            <Typography color="onSecondary" style={{ textAlign: 'center' }}>
              Verify your account to explore variety of exciting features
              powered by AI and fine-tuned by us.
            </Typography>
          </View>
          <View style={styles.form}>
            <View style={styles.input}>
              <Label color="onSecondary" font="medium">
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

            <Button onPress={onVerifyPress} disabled={!code || !isLoaded} loading={!isLoaded}>
              <Typography>
                Verify
              </Typography>
            </Button>
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
            Create your Account?
          </Typography>

          <Typography color="onSecondary" style={{ textAlign: 'center' }}>
            Create an account to explore variety of exciting features powered by
            AI and fine-tuned by us.
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

          <Button onPress={onSignUpPress} disabled={!isStrongPassword(password) || !isValidEmail(emailAddress) || pendingVerification || !isLoaded} loading={pendingVerification || !isLoaded}>
            <Typography>
              Create account
            </Typography>
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
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: scale(8),
          }}
        >
          <Typography color="onSecondary">Already have an account?</Typography>
          <Pressable onPress={() => router.push('/sign-in')}>
            <Typography color="onPrimary">Login</Typography>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default CreateAccount;

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
