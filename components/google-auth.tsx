import { Colors } from '@/constants/theme';
import { scale } from '@/helpers/scale';
import { useAuthStore } from '@/stores/auth-store';
import { GoogleLogoIcon } from 'phosphor-react-native';
import React from 'react';
import { StyleSheet } from 'react-native';
import Button from './common/button';
import Typography from './common/typography';

const GoogleAuthButton = () => {
  const { signInWithGoogle, loading } = useAuthStore();

  return (
    <Button style={styles.button} loading={loading} onPress={signInWithGoogle}>
      <GoogleLogoIcon
        weight="bold"
        size={24}
        color={Colors.onSecondary}
      />

      <Typography>Login with Google</Typography>
    </Button>
  )
}

export default GoogleAuthButton

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    gap: scale(8),
    backgroundColor: Colors.secondary
  }
})