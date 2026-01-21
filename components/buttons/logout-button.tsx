import { Colors } from '@/constants/theme'
import { useClerk } from '@clerk/clerk-expo'
import { SignOutIcon } from 'phosphor-react-native'
import React from 'react'
import { StyleSheet } from 'react-native'
import Button from '../common/button'
import Typography from '../common/typography'

const LogoutButton = () => {
  const { signOut } = useClerk()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <Button style={styles.button} onPress={handleSignOut}>
      <Typography color='danger' font='semiBold'>Logout</Typography>
      <SignOutIcon size={24} color={Colors.danger} />
    </Button>
  )
}

export default LogoutButton

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.danger,
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 28,
  }
})