import { TASKS } from '@/constants/tasks';
import { COLOR, RADIUS, SHADOW, SPACE } from '@/constants/theme';
import { useTaskStore } from '@/hooks/useTaskStore';
import { Task } from '@/types/task.types';
import * as Haptics from 'expo-haptics';
import { CheckIcon } from 'phosphor-react-native';
import React, { useCallback, useMemo } from 'react';
import { LayoutAnimation, Pressable, StyleSheet, View } from 'react-native';
import ThemedText from './ThemedText';

/* ── Progress Bar ─────────────────────────────────────── */

interface ProgressBarProps {
  total: number;
  completed: number;
}

const SegmentedProgress = ({ total, completed }: ProgressBarProps) => (
  <View style={progressStyles.track}>
    {Array.from({ length: total }, (_, i) => (
      <View
        key={i}
        style={[
          progressStyles.segment,
          i < completed && progressStyles.segmentFilled,
        ]}
      />
    ))}
  </View>
);

const progressStyles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    gap: 4,
  },

  segment: {
    flex: 1,
    height: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLOR.muted,
  },

  segmentFilled: {
    backgroundColor: COLOR.green,
  },
});

/* ── Task Item ────────────────────────────────────────── */

interface TaskItemProps {
  task: Task;
  done: boolean;
  onToggle: (id: string) => void;
}

const TaskItem = React.memo(({ task, done, onToggle }: TaskItemProps) => {
  const handlePress = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle(task.id);
  }, [task.id, onToggle]);

  return (
    <Pressable
      onPress={handlePress}
      style={[
        itemStyles.card,
        { borderLeftColor: task.icon.color },
        done && itemStyles.cardDone,
      ]}
    >
      <View
        style={[itemStyles.iconWrapper, { backgroundColor: task.icon.color }]}
      >
        <ThemedText variant="h4">{task.icon.emoji}</ThemedText>
      </View>

      <View style={itemStyles.content}>
        <ThemedText
          variant="h5"
          color={done ? 'onMuted' : 'onCard'}
          style={done && itemStyles.strikethrough}
        >
          {task.title}
        </ThemedText>

        {!done && (
          <ThemedText variant="bodySmall" color="onMuted" numberOfLines={2}>
            {task.description}
          </ThemedText>
        )}
      </View>

      <View style={[itemStyles.checkbox, done && itemStyles.checkboxDone]}>
        {done && <CheckIcon size={14} color={COLOR.onPrimary} weight="bold" />}
      </View>
    </Pressable>
  );
});

TaskItem.displayName = 'TaskItem';

const itemStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACE.md,
    padding: SPACE.md,
    borderRadius: RADIUS.xl,
    backgroundColor: COLOR.card,
    borderWidth: 1,
    borderColor: COLOR.borderInput,
    borderLeftWidth: 3,
    boxShadow: SHADOW.sm,
  },

  cardDone: {
    backgroundColor: 'hsla(250, 20%, 15%, 0.6)',
    borderColor: 'transparent',
  },

  iconWrapper: {
    height: 40,
    width: 40,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    flex: 1,
    gap: 2,
  },

  strikethrough: {
    textDecorationLine: 'line-through',
    textDecorationColor: COLOR.onMuted,
  },

  checkbox: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    borderColor: COLOR.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxDone: {
    backgroundColor: COLOR.green,
    borderColor: COLOR.green,
  },
});

/* ── TaskList ─────────────────────────────────────────── */

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const TaskList = () => {
  // Select raw array (stable reference) instead of creating new Set in selector
  const completedArr = useTaskStore((s) => s.completions[todayKey()]);
  const completedIds = useMemo(() => new Set(completedArr ?? []), [completedArr]);
  const toggleTask = useTaskStore((s) => s.toggleTask);

  const handleToggle = useCallback(
    (id: string) => {
      toggleTask(id);
    },
    [toggleTask],
  );

  return (
    <View style={styles.container}>
      <SegmentedProgress total={TASKS.length} completed={completedIds.size} />

      {TASKS.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          done={completedIds.has(task.id)}
          onToggle={handleToggle}
        />
      ))}
    </View>
  );
};

export default TaskList;

const styles = StyleSheet.create({
  container: {
    gap: SPACE.lg,
  },
});

