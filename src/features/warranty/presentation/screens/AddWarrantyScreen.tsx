import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, Button, Input } from '../../../../shared/components';
import { colors, spacing } from '../../../../shared/theme/tokens';
import { warrantyFormSchema, type WarrantyFormValues } from '../warrantySchema';
import { useUpsertWarrantyMutation, useWarrantyQuery } from '../useWarranty';
import type { InventoryStackParamList } from '../../../../app/navigation/InventoryStack';

type Props = NativeStackScreenProps<InventoryStackParamList, 'AddWarranty'>;

export function AddWarrantyScreen({ navigation, route }: Props) {
  const { assetId } = route.params;
  const insets = useSafeAreaInsets();
  const { data: existing } = useWarrantyQuery(assetId);
  const upsertMutation = useUpsertWarrantyMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WarrantyFormValues>({
    resolver: zodResolver(warrantyFormSchema),
    defaultValues: { provider: '', startDate: '', endDate: '' },
  });

  useEffect(() => {
    if (existing) {
      reset({ provider: existing.provider, startDate: existing.startDate, endDate: existing.endDate });
    }
  }, [existing, reset]);

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await upsertMutation.mutateAsync({ assetId, ...values });
      navigation.goBack();
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Something went wrong');
    }
  });

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} keyboardShouldPersistTaps="handled">
      <View style={{ paddingTop: insets.top + spacing.md, paddingHorizontal: spacing.xxl, flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm }}>
        <Pressable onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Back">
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={colors.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="m15 18-6-6 6-6" />
          </Svg>
        </Pressable>
        <Text variant="title">{existing ? 'Edit warranty' : 'Add warranty'}</Text>
      </View>

      <View style={{ padding: spacing.xxl, gap: spacing.md }}>
        <Controller
          control={control}
          name="provider"
          render={({ field }) => (
            <Input label="Provider" value={field.value} onChangeText={field.onChange} error={errors.provider?.message} />
          )}
        />
        <Controller
          control={control}
          name="startDate"
          render={({ field }) => (
            <Input
              label="Start date"
              placeholder="YYYY-MM-DD"
              value={field.value}
              onChangeText={field.onChange}
              error={errors.startDate?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="endDate"
          render={({ field }) => (
            <Input
              label="Expiry date"
              placeholder="YYYY-MM-DD"
              value={field.value}
              onChangeText={field.onChange}
              error={errors.endDate?.message}
            />
          )}
        />

        {submitError ? (
          <Text variant="caption" color={colors.danger}>
            {submitError}
          </Text>
        ) : null}

        <Button label={isSubmitting ? 'Saving…' : 'Save warranty'} onPress={() => onSubmit()} disabled={isSubmitting} />
      </View>
    </ScrollView>
  );
}
