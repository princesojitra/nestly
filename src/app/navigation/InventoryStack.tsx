import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { InventoryListScreen } from '../../features/inventory/presentation/screens/InventoryListScreen';
import { AddAssetScreen } from '../../features/inventory/presentation/screens/AddAssetScreen';
import { AssetDetailScreen } from '../../features/inventory/presentation/screens/AssetDetailScreen';

export type InventoryStackParamList = {
  InventoryList: undefined;
  AddAsset: { assetId?: string } | undefined;
  AssetDetail: { assetId: string };
};

const Stack = createNativeStackNavigator<InventoryStackParamList>();

export function InventoryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="InventoryList" component={InventoryListScreen} />
      <Stack.Screen name="AddAsset" component={AddAssetScreen} />
      <Stack.Screen name="AssetDetail" component={AssetDetailScreen} />
    </Stack.Navigator>
  );
}
