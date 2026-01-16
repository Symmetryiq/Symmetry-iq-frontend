import { Colors } from '@/constants/theme'
import { scale, verticalScale } from '@/helpers/scale'
import { useAuthStore } from '@/stores/auth-store'
import { useRouter } from 'expo-router'
import { BellIcon, CaretLeft } from 'phosphor-react-native'
import React from 'react'
import { Image, Pressable, StyleSheet, View } from 'react-native'
import Typography from './common/typography'

type HeaderProps = {
  showContent?: boolean;
  showIcon?: boolean;
  showBackIcon?: boolean;
}

const Header = ({ showContent = true, showIcon = true, showBackIcon = false }: HeaderProps) => {
  const router = useRouter();
  const { user } = useAuthStore();

  return (
    <View style={styles.header}>
      <View>
        {showBackIcon && <Pressable onPress={() => router.back()} style={styles.backIconWrapper}>
          <CaretLeft size={scale(24)} color={Colors.onMuted} />
        </Pressable>}

        {showContent && <View style={styles.contentWrapper}>
          <View style={{ height: verticalScale(50), aspectRatio: 1, borderRadius: scale(12), overflow: 'hidden' }}>
            <Image source={require('@/assets/images/icon.png')} style={{ height: '100%', width: '100%', resizeMode: 'contain' }} />
          </View>

          <View>
            <Typography>Welcome back,</Typography>
            <Typography font="semiBold" size={20} color="onBackground">
              {user?.displayName || 'User'}
            </Typography>
          </View>
        </View>}
      </View>

      {showIcon && <Pressable onPress={() => router.push('/notifications')} style={styles.iconWrapper}>
        <BellIcon size={scale(24)} color={Colors.onMuted} />
      </Pressable>}
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16)
  },

  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12)
  },

  backIconWrapper: {
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(8),
    backgroundColor: Colors.muted,
    borderRadius: 200,
  },

  iconWrapper: {
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(8),
    backgroundColor: Colors.muted,
    borderRadius: 200,
  }
})