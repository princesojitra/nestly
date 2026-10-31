import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, Button, BoxIcon } from '../../../../shared/components';
import { colors, radius, spacing } from '../../../../shared/theme/tokens';
import { ASSET_CATEGORIES } from '../../domain/Asset';
import type { Asset } from '../../domain/Asset';
import { useAssetsQuery } from '../useAssets';
import type { InventoryStackParamList } from '../../../../app/navigation/InventoryStack';

type Props = NativeStackScreenProps<InventoryStackParamList, 'InventoryList'>;

const FILTERS = ['All', ...ASSET_CATEGORIES] as const;

export function InventoryListScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { data: assets, isLoading, isError, refetch } = useAssetsQuery();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');

  const filtered = useMemo(() => {
    if (!assets) return [];
    return assets.filter((a) => {
      const matchesFilter = filter === 'All' || a.category === filter;
      const matchesSearch = a.name.toLowerCase().includes(search.trim().toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [assets, filter, search]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top + spacing.lg }}>
      <View style={{ paddingHorizontal: spacing.xxl, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md }}>
        <Text variant="display">Inventory</Text>
        <Button label="＋" onPress={() => navigation.navigate('AddAsset')} />
      </View>

      <View style={{ paddingHorizontal: spacing.xxl, marginBottom: spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 2 }}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search your home"
            placeholderTextColor={colors.textMutedStrong}
            style={{ flex: 1, fontSize: 13.5, color: colors.text }}
          />
        </View>
      </View>

      <FlatList
        data={FILTERS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        style={{ flexGrow: 0, marginBottom: spacing.md }}
        contentContainerStyle={{ paddingHorizontal: spacing.xxl, gap: spacing.sm }}
        renderItem={({ item }) => {
          const active = item === filter;
          return (
            <Pressable
              onPress={() => setFilter(item)}
              style={{
                paddingVertical: 7,
                paddingHorizontal: 14,
                borderRadius: radius.pill,
                backgroundColor: active ? colors.surfaceDark : colors.surface,
                borderWidth: active ? 0 : 1,
                borderColor: colors.line,
              }}>
              <Text variant="label" color={active ? colors.onDark : colors.textMuted}>
                {item}
              </Text>
            </Pressable>
          );
        }}
      />

      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text variant="body" color={colors.textMuted}>
            Loading…
          </Text>
        </View>
      ) : isError ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.xxl }}>
          <Text variant="body" color={colors.danger}>
            Couldn't load your inventory.
          </Text>
          <Button label="Retry" variant="secondary" onPress={() => refetch()} />
        </View>
      ) : !assets || assets.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.xxl }}>
          <BoxIcon color={colors.accentText} size={32} />
          <Text variant="title" style={{ textAlign: 'center' }}>
            No assets yet
          </Text>
          <Text variant="body" color={colors.textMuted} style={{ textAlign: 'center' }}>
            Add the things in your home to start tracking warranties and maintenance.
          </Text>
          <Button label="Add your first asset" onPress={() => navigation.navigate('AddAsset')} />
        </View>
      ) : filtered.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl }}>
          <Text variant="body" color={colors.textMuted} style={{ textAlign: 'center' }}>
            {search ? `No results for "${search}"` : `No ${filter.toLowerCase()} yet`}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ gap: spacing.md }}
          contentContainerStyle={{ paddingHorizontal: spacing.xxl, paddingBottom: spacing.xxl, gap: spacing.md }}
          renderItem={({ item }: { item: Asset }) => (
            <Pressable
              onPress={() => navigation.navigate('AssetDetail', { assetId: item.id })}
              style={{ flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, overflow: 'hidden' }}>
              <View style={{ height: 92, backgroundColor: colors.accentTint, alignItems: 'center', justifyContent: 'center' }}>
                <BoxIcon color={colors.accentText} size={30} />
              </View>
              <View style={{ padding: spacing.md }}>
                <Text variant="label" numberOfLines={1}>
                  {item.name}
                </Text>
                <Text variant="caption" color={colors.textMutedStrong} style={{ marginVertical: 2 }}>
                  {item.category}
                </Text>
                {item.price != null ? (
                  <Text variant="label" color={colors.accentText}>
                    ${item.price}
                  </Text>
                ) : null}
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}
