import React from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, Button, BoxIcon } from '../../../../shared/components';
import { colors, radius, spacing } from '../../../../shared/theme/tokens';
import { useAssetQuery, useDeleteAssetMutation } from '../useAssets';
import { WarrantyCard } from '../../../warranty/presentation/components/WarrantyCard';
import type { InventoryStackParamList } from '../../../../app/navigation/InventoryStack';

type Props = NativeStackScreenProps<InventoryStackParamList, 'AssetDetail'>;

export function AssetDetailScreen({ navigation, route }: Props) {
  const { assetId } = route.params;
  const insets = useSafeAreaInsets();
  const { data: asset, isLoading } = useAssetQuery(assetId);
  const deleteMutation = useDeleteAssetMutation();

  const onDelete = () => {
    Alert.alert('Delete asset?', "This can't be undone.", [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteMutation.mutateAsync(assetId);
          navigation.goBack();
        },
      },
    ]);
  };

  if (isLoading || !asset) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <Text variant="body" color={colors.textMuted}>
          {isLoading ? 'Loading…' : 'Asset not found.'}
        </Text>
      </View>
    );
  }

  return (
    // shortcut: Edit/Delete live inside the scrollable content (like
    // AddAssetScreen's submit button) rather than a fixed footer sibling —
    // a fixed footer after a flex:1 region silently ate touches on this
    // screen (RN 0.88 + react-native-screens native-stack, nested in a tab).
    // Revisit a pinned footer once that's fixed upstream.
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ height: 220, backgroundColor: colors.surfaceSoft, alignItems: 'center', justifyContent: 'center' }}>
        <BoxIcon color={colors.accentText} size={48} />
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Back"
          style={{
            position: 'absolute',
            top: insets.top + spacing.sm,
            left: spacing.lg,
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: 'rgba(255,255,255,0.9)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="m15 18-6-6 6-6" />
          </Svg>
        </Pressable>
      </View>

      <View style={{ padding: spacing.xxl, gap: spacing.md }}>
        <Text
          variant="label"
          color={colors.accentText}
          style={{ backgroundColor: colors.accentTint, alignSelf: 'flex-start', paddingVertical: 4, paddingHorizontal: 10, borderRadius: radius.pill }}>
          {asset.category}
        </Text>
        <Text variant="display">{asset.name}</Text>

        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <View style={{ flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.md }}>
            <Text variant="caption" color={colors.textMutedStrong}>
              Purchased
            </Text>
            <Text variant="label">{asset.purchaseDate ?? '—'}</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.md }}>
            <Text variant="caption" color={colors.textMutedStrong}>
              Price paid
            </Text>
            <Text variant="label">{asset.price != null ? `$${asset.price}` : '—'}</Text>
          </View>
        </View>

        {asset.description ? (
          <Text variant="body" color={colors.textMuted}>
            {asset.description}
          </Text>
        ) : null}

        <WarrantyCard assetId={assetId} onPress={() => navigation.navigate('AddWarranty', { assetId })} />

        {/* Maintenance history shows here once that feature exists — no
            data model for it yet. */}

        <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg }}>
          <View style={{ flex: 1 }}>
            <Button label="Delete" variant="secondary" onPress={onDelete} />
          </View>
          <View style={{ flex: 1 }}>
            <Button label="Edit" onPress={() => navigation.navigate('AddAsset', { assetId })} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
