import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '../../../../shared/components';
import { colors, radius, spacing } from '../../../../shared/theme/tokens';
import { categoryBreakdown, monthlyTrend, purchaseVsMaintenanceSplit } from '../../domain/analytics';
import { useAssetsQuery } from '../../../inventory/presentation/useAssets';
import { useAllMaintenanceCompletionsQuery } from '../../../maintenance/presentation/useMaintenance';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const { data: assets } = useAssetsQuery();
  const { data: completions } = useAllMaintenanceCompletionsQuery();

  const trend = useMemo(() => monthlyTrend(assets ?? [], completions ?? [], 6), [assets, completions]);
  const categories = useMemo(() => categoryBreakdown(assets ?? []), [assets]);
  const split = useMemo(() => purchaseVsMaintenanceSplit(assets ?? [], completions ?? []), [assets, completions]);

  const thisMonth = trend[trend.length - 1]?.total ?? 0;
  const maxTrend = Math.max(1, ...trend.map((t) => t.total));
  const maxCategory = Math.max(1, ...categories.map((c) => c.total));
  const hasData = (assets && assets.length > 0) || (completions && completions.length > 0);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ paddingTop: insets.top + spacing.lg }}>
      <View style={{ paddingHorizontal: spacing.xxl, marginBottom: spacing.md }}>
        <Text variant="display">Analytics</Text>
      </View>

      {!hasData ? (
        <View style={{ padding: spacing.xxl, alignItems: 'center' }}>
          <Text variant="body" color={colors.textMuted} style={{ textAlign: 'center' }}>
            Add assets and log maintenance to see spending trends here.
          </Text>
        </View>
      ) : (
        <View style={{ paddingHorizontal: spacing.xxl, gap: spacing.xl, paddingBottom: spacing.xxl }}>
          <View style={{ backgroundColor: colors.surfaceDark, borderRadius: radius.lg, padding: spacing.lg }}>
            <Text variant="caption" color="rgba(246,245,240,0.6)">
              This month
            </Text>
            <Text variant="display" color={colors.onDark} style={{ marginBottom: spacing.md }}>
              ${thisMonth.toFixed(0)}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm, height: 48 }}>
              {trend.map((point, i) => (
                <View key={point.month} style={{ flex: 1, alignItems: 'center', gap: 6 }}>
                  <View
                    style={{
                      width: '100%',
                      maxWidth: 20,
                      borderRadius: 5,
                      backgroundColor: i === trend.length - 1 ? colors.accent : 'rgba(246,245,240,0.35)',
                      height: `${Math.max(4, (point.total / maxTrend) * 100)}%`,
                    }}
                  />
                  <Text variant="micro" color="rgba(246,245,240,0.5)">
                    {MONTH_LABELS[Number(point.month.slice(5, 7)) - 1]}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <View style={{ flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.md }}>
              <Text variant="caption" color={colors.textMutedStrong}>
                Purchases
              </Text>
              <Text variant="title">${split.purchases.toFixed(0)}</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.md }}>
              <Text variant="caption" color={colors.textMutedStrong}>
                Maintenance
              </Text>
              <Text variant="title">${split.maintenance.toFixed(0)}</Text>
            </View>
          </View>

          {categories.length > 0 ? (
            <View style={{ gap: spacing.sm }}>
              <Text variant="label" color={colors.textMutedStrong}>
                By category
              </Text>
              {categories.map((c) => (
                <View key={c.category} style={{ gap: 4 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text variant="body">{c.category}</Text>
                    <Text variant="body" color={colors.textMuted}>
                      ${c.total.toFixed(0)}
                    </Text>
                  </View>
                  <View style={{ height: 6, borderRadius: 3, backgroundColor: colors.surfaceSoft, overflow: 'hidden' }}>
                    <View style={{ width: `${(c.total / maxCategory) * 100}%`, height: '100%', backgroundColor: colors.accent }} />
                  </View>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      )}
    </ScrollView>
  );
}
