import { Colors } from '@/constants/theme'
import React from 'react'
import { StyleSheet } from 'react-native'
import Button from '../common/button'
import Typography from '../common/typography'
import GoogleIcon from '../icons/google-icon'

const GoogleButton = () => {
  return (
    <Button style={styles.button}>
      <GoogleIcon size={24} />
      <Typography color='onSecondary' font='semiBold'>Continue with Google</Typography>
    </Button>
  )
}

export default GoogleButton

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.secondary,
    padding: 16,
    borderRadius: 28,
  }
})