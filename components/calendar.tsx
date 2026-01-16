import { Colors } from '@/constants/theme';
import { scale, verticalScale } from '@/helpers/scale';
import React from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import Typography from './common/typography';

type CalendarProps = {
  days?: number;
  startDate?: Date;
  selectedDate?: Date;
  onSelect?: (date: Date) => void;
  /** Optional: Only show these specific dates instead of a range */
  availableDates?: Date[];
};

const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

const buildDates = (start: Date, days: number) => {
  const res: Date[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate() + i
    );
    res.push(d);
  }
  return res;
};

const Calendar = ({
  days = 7,
  startDate = new Date(),
  selectedDate,
  onSelect,
  availableDates,
}: CalendarProps) => {
  // Use availableDates if provided, otherwise build a range
  const dates = React.useMemo(
    () => availableDates ?? buildDates(startDate, days),
    [availableDates, startDate, days]
  );
  const [internalSelected, setInternalSelected] = React.useState<Date>(
    () => selectedDate ?? dates[0]
  );
  const flatRef = React.useRef<FlatList<Date> | null>(null);

  // keep internal state in sync if controlled
  React.useEffect(() => {
    if (selectedDate && !sameDay(selectedDate, internalSelected)) {
      setInternalSelected(selectedDate);
      const idx = dates.findIndex((d) => sameDay(d, selectedDate));
      if (idx >= 0)
        flatRef.current?.scrollToIndex({
          index: idx,
          animated: true,
          viewPosition: 0.5,
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const handleSelect = (date: Date) => {
    setInternalSelected(date);
    onSelect?.(date);
    const idx = dates.findIndex((d) => sameDay(d, date));
    if (idx >= 0)
      flatRef.current?.scrollToIndex({
        index: idx,
        animated: true,
        viewPosition: 0.5,
      });
  };

  const renderItem = ({ item }: ListRenderItemInfo<Date>) => {
    const active = sameDay(item, internalSelected);
    return (
      <CalendarItem
        date={item}
        isActive={active}
        onPress={() => handleSelect(item)}
      />
    );
  };

  return (
    <FlatList
      ref={flatRef}
      data={dates}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(d) => d.getTime().toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
      ItemSeparatorComponent={() => <View style={{ width: scale(12) }} />}
    />
  );
};

export default Calendar;

type CalendarItemProps = {
  date: Date;
  isActive?: boolean;
  onPress?: () => void;
};

const CalendarItem = React.memo(
  ({ date, isActive = false, onPress }: CalendarItemProps) => {
    const day = date.getDay();
    const dateNum = date.getDate();
    const isToday = sameDay(date, new Date());

    return (
      <Pressable
        onPress={onPress}
        style={[
          styles.calendarItemWrapper,
          isActive && styles.calendarItemWrapperActive,
          isToday && !isActive && styles.calendarItemWrapperToday,
        ]}
      >
        <View
          style={[styles.calendarItem, isActive && styles.calendarItemActive]}
        >
          <Typography
            font="semiBold"
            size={16}
            color={isActive ? 'onPrimary' : 'onCard'}
          >
            {dateNum.toString().padStart(2, '0')}
          </Typography>

          <Typography
            font="medium"
            size={14}
            color={isActive ? 'onPrimary' : 'onCard'}
          >
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]}
          </Typography>
        </View>
      </Pressable>
    );
  }
);

CalendarItem.displayName = 'CalendarItem';

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
    alignItems: 'center',
  },

  calendarItemWrapper: {
    height: verticalScale(64),
    width: scale(64),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 200,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  calendarItemWrapperActive: {
    borderColor: Colors.primary,
  },

  calendarItemWrapperToday: {
    borderColor: Colors.primary,
    borderWidth: 2,
    borderStyle: 'dashed',
  },

  calendarItem: {
    height: verticalScale(56),
    width: scale(56),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 200,
    backgroundColor: Colors.card,
  },

  calendarItemActive: {
    backgroundColor: Colors.primaryLight,
  },
});
