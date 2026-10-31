import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PlaceholderScreen } from './PlaceholderScreen';
import { InventoryStack } from './InventoryStack';
import { DashboardScreen } from '../../features/dashboard/presentation/screens/DashboardScreen';
import { ProfileScreen } from '../../features/authentication/presentation/screens/ProfileScreen';
import { BoxIcon, ChartIcon, HomeIcon, UserIcon, WrenchIcon } from '../../shared/components';
import { colors } from '../../shared/theme/tokens';

export type MainTabParamList = {
  Dashboard: undefined;
  Inventory: undefined;
  Maintenance: undefined;
  Analytics: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const screenOptions = {
  headerShown: false,
  tabBarActiveTintColor: colors.text,
  tabBarInactiveTintColor: colors.textMutedStrong,
  tabBarStyle: { backgroundColor: '#FBFAF7', borderTopColor: colors.lineStrong },
};

function MaintenanceScreen() {
  return <PlaceholderScreen title="Maintenance" />;
}
function AnalyticsScreen() {
  return <PlaceholderScreen title="Analytics" />;
}
export function MainTabs() {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Inventory"
        component={InventoryStack}
        options={{ tabBarIcon: ({ color, size }) => <BoxIcon color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Maintenance"
        component={MaintenanceScreen}
        options={{ tabBarIcon: ({ color, size }) => <WrenchIcon color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{ tabBarIcon: ({ color, size }) => <ChartIcon color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ color, size }) => <UserIcon color={color} size={size} /> }}
      />
    </Tab.Navigator>
  );
}
