import { COLOR, RADIUS, SHADOW, TEXT } from '@/constants/theme';
import { moderateVerticalScale, verticalScale } from '@/utils/scaling.util';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const tabWidth = width / state.routes.length;
  const insets = useSafeAreaInsets();

  function renderRoute(route: (typeof state.routes)[0], index: number) {
    const { options } = descriptors[route.key];

    const isFocused = state.index === index;
    const tabBarLabel = options.tabBarLabel ?? options.title ?? route.name;
    const TabIcon = options.tabBarIcon as React.ElementType | undefined;
    const isCenterTab =
      options.tabBarButton === undefined &&
      index === Math.floor(state.routes.length / 2);

    function onPress() {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented)
        navigation.navigate(route.name);
    }

    function onLongPress() {
      navigation.emit({
        type: 'tabLongPress',
        target: route.key,
      });
    }

    if (isCenterTab) {
      return (
        <Pressable
          key={route.key}
          accessibilityRole="button"
          accessibilityState={isFocused ? { selected: true } : {}}
          accessibilityLabel={options.tabBarAccessibilityLabel}
          testID={options.tabBarButtonTestID ?? undefined}
          onPress={onPress}
          onLongPress={onLongPress}
          style={[styles.tab, { width: tabWidth }]}
        >
          <View style={styles.centerTab}>
            {TabIcon ? (
              <TabIcon size={28} color={COLOR.onPrimary} strokeWidth={2} />
            ) : null}
          </View>
        </Pressable>
      );
    }

    return (
      <Pressable
        key={route.key}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        testID={options.tabBarButtonTestID ?? undefined}
        onPress={onPress}
        onLongPress={onLongPress}
        style={[styles.tab, { width: tabWidth }]}
      >
        <View
          style={[
            styles.icon,
            {
              backgroundColor: isFocused
                ? 'hsla(250, 50%, 50%, 0.3)'
                : undefined,
              borderWidth: isFocused ? 1 : 0,
              borderColor: isFocused ? 'hsla(250, 50%, 50%, 0.2)' : undefined,
              boxShadow: isFocused ? SHADOW.md : undefined,
            },
          ]}
        >
          {TabIcon ? (
            <TabIcon
              size={24}
              color={
                isFocused
                  ? options.tabBarActiveTintColor
                  : options.tabBarInactiveTintColor
              }
            />
          ) : null}
        </View>

        <Text
          style={[
            TEXT.caption,
            {
              color: isFocused
                ? options.tabBarActiveTintColor
                : options.tabBarInactiveTintColor,
            },
          ]}
        >
          {typeof tabBarLabel === 'string' ? tabBarLabel : route.name}
        </Text>
      </Pressable>
    );
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {state.routes.map((route, index) => renderRoute(route, index))}
    </View>
  );
};

export default TabBar;

const styles = StyleSheet.create({
  container: {
    height: verticalScale(80),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.card,
    borderWidth: 1,
    borderColor: COLOR.border,
    paddingTop: 8,
    borderTopLeftRadius: RADIUS['3xl'],
    borderTopRightRadius: RADIUS['3xl'],
    boxShadow: '0px -2px 4px rgba(0, 0, 0, 0.1)',
  },

  tab: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: moderateVerticalScale(4),
  },

  centerTab: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.primary,
    boxShadow: SHADOW.primary,
  },

  icon: {
    width: 48,
    height: 36,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
