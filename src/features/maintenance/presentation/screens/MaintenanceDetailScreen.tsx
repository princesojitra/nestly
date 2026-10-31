import React from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, Button, WrenchIcon } from '../../../../shared/components';
import { colors, radius, spacing } from '../../../../shared/theme/tokens';
import { isOverdue } from '../../domain/Maintenance';
import {
  useCompleteMaintenanceTaskMutation,
  useDeleteMaintenanceTaskMutation,
  useMaintenanceCompletionsQuery,
  useMaintenanceTaskQuery,
} from '../useMaintenance';
import { useAssetQuery } from '../../../inventory/presentation/useAssets';
import type { MaintenanceStackParamList } from '../../../../app/navigation/MaintenanceStack';

type Props = NativeStackScreenProps<MaintenanceStackParamList, 'MaintenanceDetail'>;

export function MaintenanceDetailScreen({ navigation, route }: Props) {
  const { taskId } = route.params;
  const insets = useSafeAreaInsets();
  const { data: task, isLoading } = useMaintenanceTaskQuery(taskId);
  const { data: asset } = useAssetQuery(task?.assetId ?? undefined);
  const { data: completions } = useMaintenanceCompletionsQuery(taskId);
  const completeMutation = useCompleteMaintenanceTaskMutation();
  const deleteMutation = useDeleteMaintenanceTaskMutation();

  const onComplete = () => {
    if (!task) return;
    Alert.alert('Mark complete?', task.recurring ? 'This will schedule the next occurrence.' : undefined, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Complete',
        onPress: () => completeMutation.mutate({ task, completedAt: new Date().toISOString().slice(0, 10), cost: task.cost, notes: null }),
      },
    ]);
  };

  const onDelete = () => {
    Alert.alert('Delete task?', "This can't be undone.", [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteMutation.mutateAsync(taskId);
          navigation.goBack();
        },
      },
    ]);
  };

  if (isLoading || !task) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <Text variant="body" color={colors.textMuted}>
          {isLoading ? 'Loading…' : 'Task not found.'}
        </Text>
      </View>
    );
  }

  const overdue = isOverdue(task.dueDate);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{
          paddingTop: insets.top + spacing.md,
          paddingHorizontal: spacing.xxl,
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.md,
          marginBottom: spacing.sm,
        }}>
        <Pressable onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Back">
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={colors.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="m15 18-6-6 6-6" />
          </Svg>
        </Pressable>
      </View>

      <View style={{ padding: spacing.xxl, paddingTop: spacing.sm, gap: spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.accentTint, alignItems: 'center', justifyContent: 'center' }}>
            <WrenchIcon color={colors.accentText} size={16} />
          </View>
          <Text variant="display">{task.title}</Text>
        </View>

        {asset ? (
          <Text variant="body" color={colors.textMuted}>
            Linked to {asset.name}
          </Text>
        ) : null}

        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <View style={{ flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.md }}>
            <Text variant="caption" color={colors.textMutedStrong}>
              Due
            </Text>
            <Text variant="label" color={overdue ? colors.danger : colors.text}>
              {task.dueDate}
            </Text>
          </View>
          <View style={{ flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.md }}>
            <Text variant="caption" color={colors.textMutedStrong}>
              Schedule
            </Text>
            <Text variant="label">{task.recurring ? `Every ${task.intervalDays}d` : 'One-time'}</Text>
          </View>
        </View>

        {task.cost != null ? (
          <Text variant="body" color={colors.textMuted}>
            Estimated cost: ${task.cost}
          </Text>
        ) : null}

        {task.notes ? (
          <Text variant="body" color={colors.textMuted}>
            {task.notes}
          </Text>
        ) : null}

        <Button label="Mark complete" onPress={onComplete} />

        {completions && completions.length > 0 ? (
          <View style={{ gap: spacing.sm, marginTop: spacing.sm }}>
            <Text variant="label" color={colors.textMutedStrong}>
              History
            </Text>
            {completions.map((c) => (
              <View key={c.id} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text variant="body">{c.completedAt}</Text>
                {c.cost != null ? <Text variant="body" color={colors.textMuted}>${c.cost}</Text> : null}
              </View>
            ))}
          </View>
        ) : null}

        <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg }}>
          <View style={{ flex: 1 }}>
            <Button label="Delete" variant="secondary" onPress={onDelete} />
          </View>
          <View style={{ flex: 1 }}>
            <Button label="Edit" onPress={() => navigation.navigate('AddMaintenance', { taskId })} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
