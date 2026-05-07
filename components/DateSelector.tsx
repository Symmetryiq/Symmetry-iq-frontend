import { COLOR, FONT, RADIUS, SHADOW } from '@/constants/theme';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import ThemedText from './ThemedText';

const DAYS_OFFSET = 7;
const PILL_SIZE = 64;
const PILL_GAP = 10;
const SNAP_INTERVAL = PILL_SIZE + PILL_GAP;

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

interface DateItem {
  key: string;
  date: Date;
  day: number;
  weekday: string;
  isToday: boolean;
}

function generateDates(): DateItem[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: DAYS_OFFSET * 2 + 1 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + (i - DAYS_OFFSET));

    return {
      key: d.toISOString(),
      date: d,
      day: d.getDate(),
      weekday: WEEKDAYS[d.getDay()],
      isToday: i === DAYS_OFFSET,
    };
  });
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

interface PillProps {
  item: DateItem;
  selected: boolean;
  disabled: boolean;
  onPress: (date: Date) => void;
}

const DatePill = React.memo(({ item, selected, disabled, onPress }: PillProps) => {
  const handlePress = useCallback(() => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(item.date);
  }, [item.date, onPress, disabled]);

  const textColor = disabled
    ? 'onMuted'
    : selected
      ? 'onPrimary'
      : item.isToday
        ? 'primaryLight'
        : 'onCard';

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={[
        styles.pill,
        selected && styles.pillSelected,
        item.isToday && !disabled && { borderColor: COLOR.primaryLight },
        disabled && styles.pillDisabled,
      ]}
    >
      <ThemedText variant="bodySmall" color={textColor}>
        {item.weekday}
      </ThemedText>
      <ThemedText variant="h4" color={textColor}>
        {item.day}
      </ThemedText>
    </Pressable>
  );
});

DatePill.displayName = 'DatePill';

interface DateSelectorProps {
  onDateChange?: (date: Date) => void;
  availableDates?: Set<string>;
}

const DateSelector = ({ onDateChange, availableDates }: DateSelectorProps) => {
  const dates = useRef(generateDates()).current;
  const listRef = useRef<FlatList>(null);
  const [selected, setSelected] = useState<Date>(
    () => dates.find((d) => d.isToday)!.date,
  );

  useEffect(() => {
    const index = dates.findIndex((d) => d.isToday);
    if (index === -1) return;

    const timeout = setTimeout(() => {
      listRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5,
      });
    }, 100);

    return () => clearTimeout(timeout);
  }, [dates]);

  const isDateDisabled = useCallback(
    (date: Date) => {
      if (!availableDates) return false;
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return !availableDates.has(`${y}-${m}-${d}`);
    },
    [availableDates],
  );

  const handlePress = useCallback(
    (date: Date) => {
      setSelected(date);
      onDateChange?.(date);
    },
    [onDateChange],
  );

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: SNAP_INTERVAL,
      offset: SNAP_INTERVAL * index,
      index,
    }),
    [],
  );

  const renderItem = useCallback(
    ({ item }: { item: DateItem }) => (
      <DatePill
        item={item}
        selected={isSameDay(item.date, selected)}
        disabled={isDateDisabled(item.date)}
        onPress={handlePress}
      />
    ),
    [selected, handlePress, isDateDisabled],
  );

  return (
    <View>
      <FlatList
        ref={listRef}
        data={dates}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        getItemLayout={getItemLayout}
        snapToInterval={SNAP_INTERVAL}
        decelerationRate="fast"
      />
    </View>
  );
};

export default DateSelector;

const styles = StyleSheet.create({
  list: {
    gap: PILL_GAP,
  },

  pill: {
    width: PILL_SIZE,
    height: PILL_SIZE,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.card,
    borderWidth: 1,
    borderColor: COLOR.borderInput,
    boxShadow: SHADOW.sm,
  },

  pillSelected: {
    backgroundColor: COLOR.primary,
    boxShadow: SHADOW.primary,
  },

  pillDisabled: {
    opacity: 0.3,
  },

  weekday: {
    fontFamily: FONT.medium,
    fontSize: 12,
    color: COLOR.onMuted,
  },

  dayNumber: {
    fontFamily: FONT.semiBold,
    fontSize: 18,
    color: COLOR.onCard,
  },

  textSelected: {
    color: COLOR.onPrimary,
  },
});
