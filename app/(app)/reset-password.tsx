import BackButton from '@/components/common/back-button';
import Button from '@/components/common/button';
import Input from '@/components/common/input';
import { Label } from '@/components/common/label';
import ScreenWrapper from '@/components/common/screen-wrapper';
import Typography from '@/components/common/typography';
import { Colors } from '@/constants/theme';
import { scale, verticalScale } from '@/helpers/scale';
import { isValidEmail } from '@/helpers/validation';
import { useAuthStore } from '@/stores/auth-store';
import { Link, useRouter } from 'expo-router';
import { MailboxIcon, WarningIcon } from 'phosphor-react-native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

const ResetPassword = () => {
  const { resetPassword, loading, error, clearError } = useAuthStore();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!isValidEmail(email)) {
      setLocalError('Invalid email');
      return;
    }

    setLocalError(null);
    await resetPassword(email.trim());
    setSuccess(true);
  };

  return (
    <ScreenWrapper>
      {/* Header */}
      <View style={styles.header}>
        {router.canGoBack() && <BackButton />}

        <Typography color="onSecondary">Reset Password</Typography>
      </View>

      {/* Screen Wrapper */}
      <View style={styles.wrapper}>
        <View style={styles.contentHeader}>
          <Typography font="semiBold" size={28}>
            Forgot Password
          </Typography>
          <Typography color="onSecondary">
            Enter the email address registered with your account. We&apos;ll
            send you a link to reset your password.
          </Typography>
        </View>

        <KeyboardAvoidingView
          style={styles.form}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={{ gap: verticalScale(8) }}>
            <Label color="onMuted" font="medium">
              Email Address
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

          {(localError || error) && (
            <View style={styles.error}>
              <WarningIcon size={20} color={Colors.danger} />

              <Typography color="danger">{localError || error}</Typography>
            </View>
          )}

          {success && (
            <View style={styles.error}>
              <Typography color="danger">Password reset email sent.</Typography>
            </View>
          )}

          <Button onPress={handleSubmit} loading disabled={loading}>
            <Typography>
              {loading ? 'Sending...' : 'Send Reset Email'}
            </Typography>
          </Button>

          <View style={styles.redirect}>
            <Typography color="onSecondary">Remembered Password?</Typography>
            <Link href="/sign-in">
              <Typography color="onPrimary">Sign In</Typography>
            </Link>
          </View>
        </KeyboardAvoidingView>
      </View>
    </ScreenWrapper>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: verticalScale(8),
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: scale(16),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
  },

  wrapper: {
    flex: 1,
    backgroundColor: Colors.card,
    gap: verticalScale(8),
    borderTopLeftRadius: verticalScale(50),
    borderTopRightRadius: verticalScale(50),
    borderCurve: 'continuous',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
  },

  contentHeader: {
    gap: verticalScale(8),
    justifyContent: 'center',
    paddingVertical: verticalScale(16),
  },

  form: {
    flex: 1,
    gap: verticalScale(16),
  },

  error: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: verticalScale(8),
    borderRadius: verticalScale(8),
    gap: scale(8),
  },

  redirect: {
    flexDirection: 'row',
    gap: scale(8),
  },
});
