import Button from '@/components/common/button';
import Input from '@/components/common/input';
import { Label } from '@/components/common/label';
import ScreenWrapper from '@/components/common/screen-wrapper';
import Typography from '@/components/common/typography';
import { Colors } from '@/constants/theme';
import { scale, verticalScale } from '@/helpers/scale';
import { isStrongPassword, isValidEmail } from '@/helpers/validation';
import { useAuthStore } from '@/stores/auth-store';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  AppleLogoIcon,
  GoogleLogoIcon,
  LockIcon,
  MailboxIcon,
  UserIcon,
  WarningIcon,
} from 'phosphor-react-native';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

const CreateAccount = () => {
  const { signUp, loading, error, clearError } = useAuthStore();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const canGoBack = router.canGoBack();

  const handleSubmit = async () => {
    if (!name.trim()) {
      setLocalError('Name required');
      return;
    }

    if (!isValidEmail(email)) {
      setLocalError('Invalid email');
      return;
    }

    if (!isStrongPassword(password)) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    if (!name.trim() || !email.trim() || !password.trim()) {
      return;
    }

    setLocalError(null);

    await signUp(name.trim(), email.trim(), password);
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
          Create a new account.
        </Typography>
      </View>

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
              Display Name
            </Label>

            <Input
              placeholder="Enter your name"
              value={name}
              onChangeText={(text) => {
                setName(text);
                clearError();
              }}
              icon={<UserIcon weight="fill" size={24} color={Colors.onMuted} />}
            />
          </View>

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

          <Button onPress={handleSubmit} disabled={loading} loading={loading}>
            <Typography>
              {loading ? 'Creating...' : 'Create Account'}
            </Typography>
          </Button>
        </View>

        <View style={styles.divider}>
          <View style={styles.seperator} />
          <Typography color="onMuted">Or continue with</Typography>
          <View style={styles.seperator} />
        </View>

        <View style={styles.socialAuthWrapper}>
          <Button
            onPress={handleSubmit}
            style={styles.socialButton}
            disabled={loading}
          >
            <GoogleLogoIcon
              weight="bold"
              size={24}
              color={Colors.onSecondary}
            />

            <Typography>Signup with Google</Typography>
          </Button>

          <Button
            onPress={handleSubmit}
            style={styles.socialButton}
            disabled={loading}
          >
            <AppleLogoIcon weight="fill" size={24} color={Colors.onSecondary} />

            <Typography>Signup with Apple</Typography>
          </Button>
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
