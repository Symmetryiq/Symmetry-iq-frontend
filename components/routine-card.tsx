import { Colors } from '@/constants/theme';
import { RoutineId, RoutineImages } from '@/data/routines';
import { getRoutineById } from '@/helpers/routine';
import { scale, verticalScale } from '@/helpers/scale';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { LockIcon, PlayIcon } from 'phosphor-react-native';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Typography from './common/typography';

type RoutineCardProps = {
  routineId: RoutineId;
  locked?: boolean;
};

const RoutineCardLarge = ({ routineId, locked }: RoutineCardProps) => {
  const routine = getRoutineById(routineId);

  return (
    <View style={styles.cardWrapper}>
      <View style={styles.cardContainer}>
        {/* Image */}
        <View style={styles.cardImageWrapper}>
          <Image source={RoutineImages[routine.id]} style={styles.cardImage} />
        </View>

        {/* Content */}
        <View style={{ gap: verticalScale(8), width: '100%' }}>
          <Typography size={24} font="semiBold" color="onCard">
            {routine.title}
          </Typography>
          <Typography color="onSecondary">
            {routine.description}
          </Typography>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Typography size={14} color="onSecondary">
            {routine.duration}
          </Typography>

          <Pressable
            style={styles.cardButton}
            onPress={() =>
              router.push({
                pathname: '/routines/[id]',
                params: { id: routine.id },
              })
            }
            disabled={locked}
          >
            <View style={styles.iconWrapper}>
              <PlayIcon weight="fill" color={Colors.onBackground} />
            </View>
            <Typography font="semiBold">Start</Typography>
          </Pressable>
        </View>
      </View>

      {/* 🔒 Locked Overlay */}
      {locked && (
        <View style={styles.lockedOverlay}>
          <BlurView intensity={1} tint="dark" experimentalBlurMethod='dimezisBlurView' style={StyleSheet.absoluteFill} />
          <View style={styles.lockedContent}>
            <LockIcon weight="regular" size={scale(42)} color={Colors.onBackground} />

            <Typography size={28} font="regular" color="onPrimary">
              Available Soon!
            </Typography>
          </View>
        </View>
      )}
    </View>
  );
};

export default RoutineCardLarge;

const styles = StyleSheet.create({
  cardWrapper: {
    position: 'relative',
  },

  cardContainer: {
    padding: scale(16),
    gap: verticalScale(12),
    borderRadius: verticalScale(28),
    backgroundColor: Colors.card,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cardImageWrapper: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: verticalScale(28),
    overflow: 'hidden',
  },

  cardImage: {
    height: '100%',
    width: '100%',
  },

  cardContentWrapper: {
    gap: verticalScale(16),
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },

  cardButton: {
    gap: scale(8),
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconWrapper: {
    padding: scale(8),
    backgroundColor: Colors.primary,
    borderRadius: 200,
  },

  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: verticalScale(28),
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },

  lockedContent: {
    padding: scale(16),
    gap: verticalScale(8),
    alignItems: 'center',
  },
});
