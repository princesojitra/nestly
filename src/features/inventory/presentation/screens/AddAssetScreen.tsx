import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, Button, Input } from '../../../../shared/components';
import { colors, radius, spacing } from '../../../../shared/theme/tokens';
import { ASSET_CATEGORIES } from '../../domain/Asset';
import { assetFormSchema, toNewAsset, type AssetFormValues } from '../assetSchema';
import { useAssetQuery, useCreateAssetMutation, useUpdateAssetMutation } from '../useAssets';
import type { InventoryStackParamList } from '../../../../app/navigation/InventoryStack';

type Props = NativeStackScreenProps<InventoryStackParamList, 'AddAsset'>;

export function AddAssetScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const assetId = route.params?.assetId;
  const isEdit = !!assetId;
  const { data: existing } = useAssetQuery(assetId);
  const createMutation = useCreateAssetMutation();
  const updateMutation = useUpdateAssetMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AssetFormValues>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: { name: '', category: '', purchaseDate: '', price: '', description: '' },
  });

  useEffect(() => {
    if (existing) {
      reset({
        name: existing.name,
        category: existing.category,
        purchaseDate: existing.purchaseDate ?? '',
        price: existing.price != null ? String(existing.price) : '',
        description: existing.description ?? '',
      });
    }
  }, [existing, reset]);

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      const asset = toNewAsset(values);
      if (isEdit && assetId) {
        await updateMutation.mutateAsync({ id: assetId, asset });
      } else {
        await createMutation.mutateAsync(asset);
      }
      navigation.goBack();
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Something went wrong');
    }
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingTop: insets.top + spacing.md, paddingHorizontal: spacing.xxl, flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm }}>
        <Pressable onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Back">
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={colors.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="m15 18-6-6 6-6" />
          </Svg>
        </Pressable>
        <Text variant="title">{isEdit ? 'Edit asset' : 'Add asset'}</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.xxl, gap: spacing.md }} keyboardShouldPersistTaps="handled">
        <Controller
          control={control}
          name="name"
          render={({ field }) => <Input label="Name" value={field.value} onChangeText={field.onChange} error={errors.name?.message} />}
        />

        <View style={{ gap: spacing.xs }}>
          <Text variant="label" color={colors.textMutedStrong}>
            Category
          </Text>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
                {ASSET_CATEGORIES.map((cat) => {
                  const active = field.value === cat;
                  return (
                    <Pressable
                      key={cat}
                      onPress={() => field.onChange(cat)}
                      style={{
                        paddingVertical: 8,
                        paddingHorizontal: 14,
                        borderRadius: radius.pill,
                        backgroundColor: active ? colors.surfaceDark : colors.surface,
                        borderWidth: active ? 0 : 1,
                        borderColor: colors.line,
                      }}>
                      <Text variant="label" color={active ? colors.onDark : colors.textMuted}>
                        {cat}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          />
          {errors.category ? (
            <Text variant="caption" color={colors.danger}>
              {errors.category.message}
            </Text>
          ) : null}
        </View>

        <Controller
          control={control}
          name="purchaseDate"
          render={({ field }) => (
            <Input
              label="Purchase date (optional)"
              placeholder="YYYY-MM-DD"
              value={field.value}
              onChangeText={field.onChange}
              error={errors.purchaseDate?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="price"
          render={({ field }) => (
            <Input
              label="Price (optional)"
              keyboardType="decimal-pad"
              value={field.value}
              onChangeText={field.onChange}
              error={errors.price?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <Input
              label="Description (optional)"
              value={field.value}
              onChangeText={field.onChange}
              multiline
              style={{ minHeight: 80, textAlignVertical: 'top' }}
            />
          )}
        />

        {submitError ? (
          <Text variant="caption" color={colors.danger}>
            {submitError}
          </Text>
        ) : null}

        <Button label={isSubmitting ? 'Saving…' : isEdit ? 'Save changes' : 'Add asset'} onPress={() => onSubmit()} disabled={isSubmitting} />
      </ScrollView>
    </View>
  );
}
