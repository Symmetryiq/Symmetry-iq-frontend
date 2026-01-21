import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { Slot } from 'expo-router'

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey='pk_test_ZXBpYy1nYXItODYuY2xlcmsuYWNjb3VudHMuZGV2JA' tokenCache={tokenCache}>
      <Slot />
    </ClerkProvider>
  )
}