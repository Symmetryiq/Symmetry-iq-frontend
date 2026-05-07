import TabBar from '@/components/TabBar';
import HomeIcon from '@/components/icons/HomeIcon';
import InsightsIcon from '@/components/icons/InsightIcon';
import RoutinesIcon from '@/components/icons/RoutineIcon';
import ScanIcon from '@/components/icons/ScanIcon';
import SettingsIcon from '@/components/icons/SettingIcon';
import { COLOR } from '@/constants/theme';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { alignItems: 'center' },
        sceneStyle: { backgroundColor: COLOR.background },
        headerShown: false,
        tabBarActiveTintColor: COLOR.primaryLight,
        tabBarInactiveTintColor: COLOR.onCard,
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: (props) => (
            <HomeIcon size={props.size} color={props.color} />
          ),
        }}
      />
      <Tabs.Screen
        name="routines"
        options={{
          title: 'Routines',
          tabBarIcon: (props) => (
            <RoutinesIcon size={props.size} color={props.color} />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: (props) => (
            <ScanIcon size={props.size} color={props.color} />
          ),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarIcon: (props) => (
            <InsightsIcon size={props.size} color={props.color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: (props) => (
            <SettingsIcon size={props.size} color={props.color} />
          ),
        }}
      />
    </Tabs>
  );
}
