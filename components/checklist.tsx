import { Colors } from '@/constants/theme';
import { scale, verticalScale } from '@/helpers/scale';
import { useChecklistStore } from '@/stores/checklist-store';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, CircleNotch, Drop, List, MoonStars, Scan, Tooth } from 'phosphor-react-native';
import React, { useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming
} from 'react-native-reanimated';
import Typography from './common/typography';

const AnimatedTypography = Animated.createAnimatedComponent(Typography);

type ChecklistProps = {
  date?: Date;
};

const Checklist = ({ date }: ChecklistProps) => {
  const { tasks, fetchChecklist, updateTask } = useChecklistStore();

  useEffect(() => {
    const targetDate = date ? date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    fetchChecklist(targetDate);
  }, [date]);

  const progress = useMemo(() => {
    if (tasks.length === 0) return 0;
    const completedCount = tasks.filter((t) => t.completed).length;
    return completedCount / tasks.length;
  }, [tasks]);

  const animatedProgress = useDerivedValue(() => {
    return withTiming(progress, {
      duration: 600,
      easing: Easing.bezier(0.33, 1, 0.68, 1)
    });
  });

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${animatedProgress.value * 100}%`,
    };
  });

  return (
    <View style={styles.checklistContainer}>
      <View style={styles.progressHeader}>
        <View style={styles.progressInfo}>
          <Typography size={16} font="semiBold" color="onCard">
            Daily Progress
          </Typography>
          <Typography size={14} color="onSecondary">
            {Math.round(progress * 100)}% Complete
          </Typography>
        </View>
        <View style={styles.progressBarBackground}>
          <Animated.View style={[styles.progressBarFill, progressStyle]}>
            <LinearGradient
              colors={[Colors.primary, Colors.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[StyleSheet.absoluteFill, { borderRadius: 200 }]}
            />
          </Animated.View>
        </View>
      </View>

      <View style={styles.tasksList}>
        {tasks.map((item, index) => (
          <React.Fragment key={index}>
            <ChecklistItem
              title={item.title}
              description={item.description}
              completed={item.completed}
              onToggle={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                updateTask(index, !item.completed);
              }}
            />

            {index < tasks.length - 1 ? (
              <View style={styles.divider} />
            ) : null}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

type ChecklistItemProps = {
  title: string;
  description: string;
  completed: boolean;
  onToggle: () => void;
};

const getIconForTask = (title: string, color: string) => {
  const t = title.toLowerCase();
  if (t.includes('tongue')) return <Drop color={color} size={20} weight="duotone" />;
  if (t.includes('chewing')) return <Tooth color={color} size={20} weight="duotone" />;
  if (t.includes('symmetry')) return <List color={color} size={20} weight="duotone" />;
  if (t.includes('scan')) return <Scan color={color} size={20} weight="duotone" />;
  if (t.includes('sleep')) return <MoonStars color={color} size={20} weight="duotone" />;
  return <CircleNotch color={color} size={20} weight="duotone" />;
};

const ChecklistItem = ({ title, description, completed, onToggle }: ChecklistItemProps) => {
  const animatedValue = useDerivedValue(() => {
    return withTiming(completed ? 1 : 0, {
      duration: 300,
      easing: Easing.bezier(0.4, 0, 0.2, 1)
    });
  });

  const rowStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(animatedValue.value, [0, 1], [1, 0.6]),
      transform: [{ scale: interpolate(animatedValue.value, [0, 1], [1, 0.99]) }],
    };
  });

  const iconBackgroundStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        animatedValue.value,
        [0, 1],
        [Colors.secondary, Colors.primaryLight]
      ),
      transform: [{ scale: interpolate(animatedValue.value, [0, 1], [1, 1.1]) }],
    };
  });

  const checkboxStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        animatedValue.value,
        [0, 1],
        ['transparent', Colors.primary]
      ),
      borderColor: interpolateColor(
        animatedValue.value,
        [0, 1],
        [Colors.border, Colors.primary]
      ),
    };
  });

  const checkIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: interpolate(animatedValue.value, [0, 1], [0, 1]) }],
      opacity: animatedValue.value,
    };
  });

  const iconColor = completed ? Colors.primary : Colors.onSecondary;

  return (
    <Pressable onPress={onToggle}>
      <Animated.View style={[styles.checklistItemContainer, rowStyle]}>
        <Animated.View style={[styles.iconContainer, iconBackgroundStyle]}>
          {getIconForTask(title, iconColor)}
        </Animated.View>

        <View style={{ flex: 1, alignItems: 'flex-start' }}>
          <Typography
            size={18}
            font="medium"
            color={completed ? "onMuted" : "onCard"}
            style={completed ? { textDecorationLine: 'line-through' } : null}
          >
            {title}
          </Typography>
          <Typography size={14} color="onMuted">{description}</Typography>
        </View>

        <Animated.View style={[styles.checklistItemCheckbox, checkboxStyle]}>
          <Animated.View style={checkIconStyle}>
            <Check color={Colors.onPrimary} size={16} weight="bold" />
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

export default Checklist;

const styles = StyleSheet.create({
  checklistContainer: {
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(20),
    borderRadius: verticalScale(28),
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    gap: verticalScale(16),
  },

  progressHeader: {
    gap: verticalScale(10),
    marginBottom: verticalScale(4),
  },

  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },

  progressBarBackground: {
    height: verticalScale(10),
    backgroundColor: Colors.muted,
    borderRadius: verticalScale(5),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },

  progressBarFill: {
    height: '100%',
    borderRadius: 200,
  },

  tasksList: {
    gap: verticalScale(8),
  },

  checklistItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: scale(16),
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(8),
    borderRadius: verticalScale(16),
  },

  iconContainer: {
    width: verticalScale(44),
    height: verticalScale(44),
    borderRadius: verticalScale(22),
    alignItems: 'center',
    justifyContent: 'center',
  },

  checklistItemCheckbox: {
    height: verticalScale(28),
    width: verticalScale(28),
    borderRadius: verticalScale(14),
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  divider: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.border,
    opacity: 0.3,
  },
});


