import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, Button, Input } from '../../../../shared/components';
import { colors, radius, spacing } from '../../../../shared/theme/tokens';
import { maintenanceFormSchema, toNewMaintenanceTask, type MaintenanceFormValues } from '../maintenanceSchema';
import { useCreateMaintenanceTaskMutation, useMaintenanceTaskQuery, useUpdateMaintenanceTaskMutation } from '../useMaintenance';
import { useAssetsQuery } from '../../../inventory/presentation/useAssets';
import type { MaintenanceStackParamList } from '../../../../app/navigation/MaintenanceStack';

type Props = NativeStackScreenProps<MaintenanceStackParamList, 'AddMaintenance'>;

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: radius.pill,
        backgroundColor: active ? colors.surfaceDark : colors.surface,
        borderWidth: active ? 0 : 1,
        borderColor: colors.line,
      }}>
      <Text variant="label" color={active ? colors.onDark : colors.textMuted}>
        {label}
      </Text>
    </Pressable>
  );
}

export function AddMaintenanceScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const taskId = route.params?.taskId;
  const isEdit = !!taskId;
  const { data: existing } = useMaintenanceTaskQuery(taskId);
  const { data: assets } = useAssetsQuery();
  const createMutation = useCreateMaintenanceTaskMutation();
  const updateMutation = useUpdateMaintenanceTaskMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceFormSchema),
    defaultValues: { title: '', assetId: '', recurring: false, intervalDays: '', dueDate: '', cost: '', notes: '' },
  });

  useEffect(() => {
    if (existing) {
      reset({
        title: existing.title,
        assetId: existing.assetId ?? '',
        recurring: existing.recurring,
        intervalDays: existing.intervalDays != null ? String(existing.intervalDays) : '',
        dueDate: existing.dueDate,
        cost: existing.cost != null ? String(existing.cost) : '',
        notes: existing.notes ?? '',
      });
    }
  }, [existing, reset]);

  const recurring = watch('recurring');

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      const task = toNewMaintenanceTask(values);
      if (isEdit && taskId) {
        await updateMutation.mutateAsync({ id: taskId, task });
      } else {
        await createMutation.mutateAsync(task);
      }
      navigation.goBack();
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Something went wrong');
    }
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
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
        <Text variant="title">{isEdit ? 'Edit task' : 'Add task'}</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.xxl, gap: spacing.md }} keyboardShouldPersistTaps="handled">
        <Controller
          control={control}
          name="title"
          render={({ field }) => <Input label="Title" value={field.value} onChangeText={field.onChange} error={errors.title?.message} />}
        />

        {assets && assets.length > 0 ? (
          <View style={{ gap: spacing.xs }}>
            <Text variant="label" color={colors.textMutedStrong}>
              Asset (optional)
            </Text>
            <Controller
              control={control}
              name="assetId"
              render={({ field }) => (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
                  <Chip label="None" active={field.value === ''} onPress={() => field.onChange('')} />
                  {assets.map((a) => (
                    <Chip key={a.id} label={a.name} active={field.value === a.id} onPress={() => field.onChange(a.id)} />
                  ))}
                </View>
              )}
            />
          </View>
        ) : null}

        <View style={{ gap: spacing.xs }}>
          <Text variant="label" color={colors.textMutedStrong}>
            Schedule
          </Text>
          <Controller
            control={control}
            name="recurring"
            render={({ field }) => (
              <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                <Chip label="One-time" active={!field.value} onPress={() => field.onChange(false)} />
                <Chip label="Recurring" active={field.value} onPress={() => field.onChange(true)} />
              </View>
            )}
          />
        </View>

        {recurring ? (
          <Controller
            control={control}
            name="intervalDays"
            render={({ field }) => (
              <Input
                label="Repeat every (days)"
                keyboardType="number-pad"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.intervalDays?.message}
              />
            )}
          />
        ) : null}

        <Controller
          control={control}
          name="dueDate"
          render={({ field }) => (
            <Input label="Due date" placeholder="YYYY-MM-DD" value={field.value} onChangeText={field.onChange} error={errors.dueDate?.message} />
          )}
        />

        <Controller
          control={control}
          name="cost"
          render={({ field }) => (
            <Input label="Estimated cost (optional)" keyboardType="decimal-pad" value={field.value} onChangeText={field.onChange} error={errors.cost?.message} />
          )}
        />

        <Controller
          control={control}
          name="notes"
          render={({ field }) => (
            <Input label="Notes (optional)" value={field.value} onChangeText={field.onChange} multiline style={{ minHeight: 80, textAlignVertical: 'top' }} />
          )}
        />

        {submitError ? (
          <Text variant="caption" color={colors.danger}>
            {submitError}
          </Text>
        ) : null}

        <Button label={isSubmitting ? 'Saving…' : isEdit ? 'Save changes' : 'Add task'} onPress={() => onSubmit()} disabled={isSubmitting} />
      </ScrollView>
    </View>
  );
}
