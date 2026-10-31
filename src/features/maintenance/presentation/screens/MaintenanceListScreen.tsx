import React, { useMemo } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, Button, WrenchIcon } from '../../../../shared/components';
import { colors, radius, spacing } from '../../../../shared/theme/tokens';
import { isOverdue } from '../../domain/Maintenance';
import type { MaintenanceTask } from '../../domain/Maintenance';
import { useMaintenanceTasksQuery } from '../useMaintenance';
import { useAssetsQuery } from '../../../inventory/presentation/useAssets';
import type { MaintenanceStackParamList } from '../../../../app/navigation/MaintenanceStack';

type Props = NativeStackScreenProps<MaintenanceStackParamList, 'MaintenanceList'>;

export function MaintenanceListScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { data: tasks, isLoading, isError, refetch } = useMaintenanceTasksQuery();
  const { data: assets } = useAssetsQuery();

  const assetNameById = useMemo(() => {
    const map = new Map<string, string>();
    assets?.forEach((a) => map.set(a.id, a.name));
    return map;
  }, [assets]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top + spacing.lg }}>
      <View
        style={{
          paddingHorizontal: spacing.xxl,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: spacing.md,
        }}>
        <Text variant="display">Maintenance</Text>
        <Button label="＋" onPress={() => navigation.navigate('AddMaintenance')} />
      </View>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text variant="body" color={colors.textMuted}>
            Loading…
          </Text>
        </View>
      ) : isError ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.xxl }}>
          <Text variant="body" color={colors.danger}>
            Couldn't load your maintenance tasks.
          </Text>
          <Button label="Retry" variant="secondary" onPress={() => refetch()} />
        </View>
      ) : !tasks || tasks.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.xxl }}>
          <WrenchIcon color={colors.accentText} size={32} />
          <Text variant="title" style={{ textAlign: 'center' }}>
            No maintenance tasks yet
          </Text>
          <Text variant="body" color={colors.textMuted} style={{ textAlign: 'center' }}>
            Schedule upkeep so nothing slips through the cracks.
          </Text>
          <Button label="Add a task" onPress={() => navigation.navigate('AddMaintenance')} />
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: spacing.xxl, paddingBottom: spacing.xxl, gap: spacing.sm }}
          renderItem={({ item }: { item: MaintenanceTask }) => {
            const overdue = isOverdue(item.dueDate);
            return (
              <Pressable
                onPress={() => navigation.navigate('MaintenanceDetail', { taskId: item.id })}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing.md,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.line,
                  borderRadius: radius.lg,
                  padding: spacing.md,
                }}>
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.accentTint, alignItems: 'center', justifyContent: 'center' }}>
                  <WrenchIcon color={colors.accentText} size={16} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="label" numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text variant="caption" color={colors.textMutedStrong}>
                    {item.assetId ? `${assetNameById.get(item.assetId) ?? 'Unknown asset'} · ` : ''}
                    {item.recurring ? `Every ${item.intervalDays} days` : 'One-time'}
                  </Text>
                </View>
                <Text variant="label" color={overdue ? colors.danger : colors.textMutedStrong}>
                  {item.dueDate}
                </Text>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}
