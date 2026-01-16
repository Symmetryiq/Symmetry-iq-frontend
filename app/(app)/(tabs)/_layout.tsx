import BottomTab from '@/components/bottom-tab';
import { Colors } from '@/constants/theme';
import { Tabs } from 'expo-router';
import {
  CameraIcon,
  ChartLineIcon,
  GearSixIcon,
  HouseIcon,
  KanbanIcon,
} from 'phosphor-react-native';
import React from 'react';

const TabsLayout = () => {
  return (
    <Tabs
      tabBar={(props) => <BottomTab {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: Colors.background },
        animation: 'fade',
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <HouseIcon size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="routines"
        options={{
          title: 'Routines',
          tabBarIcon: ({ color, size }) => (
            <KanbanIcon size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color, size }) => (
            <CameraIcon size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarIcon: ({ color, size }) => (
            <ChartLineIcon size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <GearSixIcon size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
