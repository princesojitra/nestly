import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaintenanceListScreen } from '../../features/maintenance/presentation/screens/MaintenanceListScreen';
import { AddMaintenanceScreen } from '../../features/maintenance/presentation/screens/AddMaintenanceScreen';
import { MaintenanceDetailScreen } from '../../features/maintenance/presentation/screens/MaintenanceDetailScreen';

export type MaintenanceStackParamList = {
  MaintenanceList: undefined;
  AddMaintenance: { taskId?: string } | undefined;
  MaintenanceDetail: { taskId: string };
};

const Stack = createNativeStackNavigator<MaintenanceStackParamList>();

export function MaintenanceStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MaintenanceList" component={MaintenanceListScreen} />
      <Stack.Screen name="AddMaintenance" component={AddMaintenanceScreen} />
      <Stack.Screen name="MaintenanceDetail" component={MaintenanceDetailScreen} />
    </Stack.Navigator>
  );
}
