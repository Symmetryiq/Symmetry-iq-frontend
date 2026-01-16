import { Colors } from '@/constants/theme';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const BottomTab = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const tabWidth = width / state.routes.length;
  const insets = useSafeAreaInsets();

  const renderTab = (route: (typeof state.routes)[0], index: number) => {
    const { options } = descriptors[route.key];
    const isFocused = state.index === index;

    const label =
      options.tabBarLabel !== undefined
        ? options.tabBarLabel
        : options.title !== undefined
        ? options.title
        : route.name;
    const Icon = options.tabBarIcon as React.ElementType | undefined;
    const isCenterTabItem =
      options.tabBarButton === undefined &&
      index === Math.floor(state.routes.length / 2);
    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    const onLongPress = () => {
      navigation.emit({
        type: 'tabLongPress',
        target: route.key,
      });
    };

    if (isCenterTabItem) {
      return (
        <TouchableOpacity
          key={route.key}
          accessibilityRole="button"
          accessibilityState={isFocused ? { selected: true } : {}}
          accessibilityLabel={options.tabBarAccessibilityLabel}
          testID={options.tabBarButtonTestID ?? undefined}
          onPress={onPress}
          onLongPress={onLongPress}
          style={[styles.centerTab, { width: tabWidth }]}
          activeOpacity={0.8}
        >
          <View style={[styles.centerButton]}>
            {Icon && (
              <Icon size={28} color={Colors.onPrimary} strokeWidth={2} />
            )}
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        key={route.key}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        testID={options.tabBarButtonTestID ?? undefined}
        onPress={onPress}
        onLongPress={onLongPress}
        style={[styles.tab, { width: tabWidth }]}
        activeOpacity={0.9}
      >
        <View style={styles.tabContent}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: isFocused ? Colors.secondary : undefined,
                borderWidth: isFocused ? 1 : 0,
                borderColor: isFocused ? Colors.border : undefined,
              },
            ]}
          >
            {Icon && (
              <Icon
                size={24}
                color={isFocused ? Colors.onBackground : Colors.onTertiary}
                strokeWidth={2}
              />
            )}
          </View>
          <Text
            style={[
              styles.tabLabel,
              {
                color: isFocused ? Colors.onBackground : Colors.onTertiary,
              },
            ]}
            numberOfLines={1}
          >
            {typeof label === 'string' ? label : route.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => renderTab(route, index))}
      </View>
    </View>
  );
};

export default BottomTab;

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.card,
    paddingTop: 8,
  },

  tabBar: {
    flexDirection: 'row',
    height: 65,
    alignItems: 'center',
  },

  tab: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconContainer: {
    width: 48,
    height: 36,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },

  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },

  centerTab: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
});
