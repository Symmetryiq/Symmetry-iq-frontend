import { Colors } from '@/constants/theme'
import React from 'react'
import { StyleSheet } from 'react-native'
import Button from '../common/button'
import Typography from '../common/typography'
import AppleIcon from '../icons/apple-icon'

const AppleButton = () => {
  return (
    <Button style={styles.button}>
      <AppleIcon size={24} color='#ffffff' />
      <Typography color='onSecondary' font='semiBold'>Continue with Apple</Typography>
    </Button>
  )
}

export default AppleButton

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