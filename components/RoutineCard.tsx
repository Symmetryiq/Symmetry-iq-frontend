import { COLOR, FONT, RADIUS, SHADOW, SPACE, THEME } from '@/constants/theme';
import { RoutineID } from '@/types/routine.types';
import { getFeatureByID } from '@/utils/feature.util';
import { getRoutineByID } from '@/utils/routine.util';
import { BlurView } from 'expo-blur';
import { ImageBackground } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  CheckCircleIcon,
  ClockCountdownIcon,
  PlayIcon,
  TargetIcon,
} from 'phosphor-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import ThemedText from './ThemedText';
import LockIcon from './icons/LockIcon';

type RoutineCardProps = {
  routineId: RoutineID;
  locked?: boolean;
  completed?: boolean;
  unlockDate?: string;
};

/* ─── Countdown Hook ───────────────────────────────────── */

function useCountdown(targetDate?: string) {
  const [remaining, setRemaining] = useState('');

  useEffect(() => {
    if (!targetDate) return;

    function update() {
      const target = new Date(targetDate!);
      target.setHours(0, 0, 0, 0);
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setRemaining('Available Now');
        return;
      }

      const hours = Math.floor(diff / 3_600_000);
      const minutes = Math.floor((diff % 3_600_000) / 60_000);
      const seconds = Math.floor((diff % 60_000) / 1_000);
      setRemaining(`${hours}h ${minutes}m ${seconds}s`);
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return remaining;
}

/* ─── Component ────────────────────────────────────────── */

const RoutineCard = ({
  routineId,
  locked = false,
  completed = false,
  unlockDate,
}: RoutineCardProps) => {
  const routine = getRoutineByID(routineId);
  const countdown = useCountdown(locked ? unlockDate : undefined);

  // Surface up to 3 targets for the user to understand the "why"
  const allTargets = [...routine.primaryTargets, ...routine.secondaryTargets]
    .slice(0, 3)
    .map((id) => getFeatureByID(id).title);

  const lockLabel = useMemo(() => {
    if (countdown) return countdown;
    return 'Available in 24 Hours';
  }, [countdown]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={routine.image}
        style={styles.imageBackground}
        contentFit="cover"
      >
        <LinearGradient
          colors={[
            'transparent',
            'hsla(250, 20%, 15%, 0.3)',
            'hsla(250, 20%, 15%, 0.85)',
            COLOR.card,
          ]}
          locations={[0, 0.4, 0.75, 1]}
          style={styles.gradient}
        >
          <View style={styles.content}>
            {/* Meta Row: Targets & Duration */}
            <View style={styles.metaRow}>
              <View style={styles.targetsBadge}>
                <TargetIcon
                  color={COLOR.primaryLight}
                  size={14}
                  weight="fill"
                />
                <ThemedText
                  variant="badge"
                  color="primaryLight"
                  numberOfLines={1}
                  style={styles.targetsText}
                >
                  {allTargets.join(' • ')}
                </ThemedText>
              </View>

              <View style={styles.durationBadge}>
                <ClockCountdownIcon
                  color={COLOR.onPrimary}
                  size={14}
                  weight="bold"
                />
                <ThemedText variant="badge" color="onPrimary">
                  {routine.duration} min
                </ThemedText>
              </View>
            </View>

            {/* Title & Summary */}
            <View style={styles.textGroup}>
              <ThemedText variant="h2" color="onCard">
                {routine.name}
              </ThemedText>
              <ThemedText variant="bodySmall" color="onMuted" numberOfLines={2}>
                {routine.summary}
              </ThemedText>
            </View>

            {/* Actions Row: Products & Play Button */}
            <View style={styles.actionRow}>
              <View style={styles.products}>
                {routine.products.map((product, index) => (
                  <View key={index} style={styles.productBadgeWrapper}>
                    <BlurView
                      intensity={20}
                      tint="light"
                      style={styles.productBadgeFallback}
                      experimentalBlurMethod="dimezisBlurView"
                    >
                      <ThemedText variant="badge" color="onSecondary">
                        {product.name}
                      </ThemedText>
                    </BlurView>
                  </View>
                ))}
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.playButtonWrapper,
                  pressed && { opacity: 0.7 },
                ]}
                onPress={() =>
                  !locked &&
                  !completed &&
                  router.push({
                    pathname: '/routine/[id]',
                    params: { id: routineId },
                  })
                }
              >
                <BlurView
                  intensity={40}
                  tint="light"
                  style={styles.playButtonBlur}
                  experimentalBlurMethod="dimezisBlurView"
                >
                  <PlayIcon color={COLOR.onPrimary} size={20} weight="fill" />
                </BlurView>
              </Pressable>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>

      {/* Locked overlay */}
      {locked && !completed && (
        <BlurView
          intensity={40}
          tint="dark"
          style={[StyleSheet.absoluteFill, styles.overlay]}
          experimentalBlurMethod="dimezisBlurView"
        >
          <LockIcon color={COLOR.onSecondary} size={48} />

          <ThemedText
            variant="bodyLarge"
            color="onSecondary"
            style={styles.countdownText}
          >
            {lockLabel}
          </ThemedText>
        </BlurView>
      )}

      {/* Completed overlay */}
      {completed && (
        <BlurView
          intensity={30}
          tint="dark"
          style={[StyleSheet.absoluteFill, styles.overlay]}
          experimentalBlurMethod="dimezisBlurView"
        >
          <View style={styles.completedIcon}>
            <CheckCircleIcon
              color={COLOR.green}
              size={48}
              weight="fill"
            />
          </View>

          <ThemedText variant="bodyLarge" style={styles.completedText}>
            Completed
          </ThemedText>
        </BlurView>
      )}
    </View>
  );
};

export default RoutineCard;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 4 / 5,
    borderRadius: RADIUS['3xl'],
    backgroundColor: COLOR.card,
    boxShadow: SHADOW.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLOR.borderInput,
  },

  imageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },

  gradient: {
    width: '100%',
    height: '75%',
    justifyContent: 'flex-end',
  },

  content: {
    padding: THEME.PADDING.card,
    gap: SPACE.md,
  },

  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SPACE.sm,
  },

  targetsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACE.xs,
    flex: 1,
  },

  targetsText: {
    flexShrink: 1,
  },

  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACE.xs,
    backgroundColor: 'hsla(250, 50%, 50%, 0.8)',
    paddingHorizontal: SPACE.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },

  textGroup: {
    gap: 2,
  },

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: SPACE.md,
  },

  products: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACE.xs,
    flex: 1,
  },

  productBadgeWrapper: {
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    backgroundColor: 'hsla(250, 15%, 50%, 0.2)', // fallback if blur isn't enough
  },

  productBadgeFallback: {
    paddingHorizontal: SPACE.sm,
    paddingVertical: 4,
  },

  playButtonWrapper: {
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    backgroundColor: COLOR.primary,
    boxShadow: SHADOW.primary,
  },

  playButtonBlur: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },

  overlay: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACE.md,
  },

  countdownText: {
    fontFamily: FONT.semiBold,
    fontVariant: ['tabular-nums'],
  },

  completedIcon: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.full,
    backgroundColor: 'hsla(125, 50%, 50%, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  completedText: {
    fontFamily: FONT.semiBold,
    color: COLOR.green,
  },
});


// import { COLOR, RADIUS, SHADOW, SPACE, THEME } from '@/constants/theme';
// import { RoutineID } from '@/types/routine.types';
// import { getRoutineByID } from '@/utils/routine.util';
// import { BlurView } from 'expo-blur';
// import { ImageBackground } from 'expo-image';
// import { ClockCountdownIcon, PlayIcon } from 'phosphor-react-native';
// import React from 'react';
// import { StyleSheet, View } from 'react-native';
// import Button from './Button';
// import ThemedText from './ThemedText';
// import LockIcon from './icons/LockIcon';

// type RoutineCardProps = {
//   routineId: RoutineID;
//   locked?: boolean;
// };

// const RoutineCard = ({ routineId, locked = false }: RoutineCardProps) => {
//   const routine = getRoutineByID(routineId);

//   return (
//     <View style={styles.container}>
//       <View style={styles.imageWrapper}>
//         <ImageBackground
//           source={routine.image}
//           style={styles.image}
//         ></ImageBackground>
//       </View>

//       <View style={styles.content}>
//         <View>
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//             }}
//           >
//             <ThemedText variant="h3" color="onCard">
//               {routine.name}
//             </ThemedText>

//             <View
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 gap: SPACE.xs,
//               }}
//             >
//               <ClockCountdownIcon color={COLOR.onSecondary} size={16} />

//               <ThemedText variant="bodySmall" color="onSecondary">
//                 {routine.duration} mins
//               </ThemedText>
//             </View>
//           </View>

//           <ThemedText variant="bodySmall" color="onMuted">
//             {routine.summary}
//           </ThemedText>
//         </View>

//         {routine.products.length > 0 && (
//           <View style={styles.field}>
//             <ThemedText variant="h5" color="onSecondary">
//               Products
//             </ThemedText>

//             <View style={styles.products}>
//               {routine.products.map((product, index) => (
//                 <View
//                   key={index}
//                   style={[
//                     styles.product,
//                     {
//                       backgroundColor: product.optional
//                         ? 'hsla(45, 50%, 50%, 0.5)'
//                         : 'hsla(225, 50%, 50%, 0.5)',
//                     },
//                   ]}
//                 >
//                   <ThemedText variant="badge" color="onSecondary">
//                     {product.name}
//                   </ThemedText>
//                 </View>
//               ))}
//             </View>
//           </View>
//         )}

//         <Button title="Start" iconPosition="right" icon={PlayIcon} />
//       </View>

//       {locked && (
//         <BlurView
//           intensity={40}
//           tint="dark"
//           style={[StyleSheet.absoluteFill, styles.overlay]}
//           experimentalBlurMethod="dimezisBlurView"
//         >
//           <LockIcon color={COLOR.onSecondary} size={48} />

//           <ThemedText variant="bodyLarge" color="onSecondary">
//             Available in 24 Hours
//           </ThemedText>
//         </BlurView>
//       )}
//     </View>
//   );
// };

// export default RoutineCard;

// const styles = StyleSheet.create({
//   container: {
//     borderWidth: 1,
//     borderColor: COLOR.borderInput,
//     borderRadius: RADIUS['3xl'],
//     backgroundColor: COLOR.card,
//     boxShadow: SHADOW.md,
//     overflow: 'hidden',
//   },

//   imageWrapper: {
//     width: '100%',
//     aspectRatio: 16 / 9,
//     borderRadius: RADIUS['3xl'],
//     overflow: 'hidden',
//   },

//   image: {
//     width: '100%',
//     height: '100%',
//   },

//   content: {
//     padding: THEME.PADDING.card,
//     gap: SPACE.md,
//   },

//   field: {
//     gap: SPACE.xs,
//   },

//   products: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: SPACE.xs,
//   },

//   product: {
//     paddingHorizontal: SPACE.sm,
//     paddingVertical: SPACE.xs,
//     borderRadius: RADIUS.sm,
//   },

//   overlay: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: SPACE.md,
//   },
// });
