import React from 'react';
import { Pressable, View } from 'react-native';
import { Text, Button, ShieldIcon } from '../../../../shared/components';
import { colors, radius, spacing } from '../../../../shared/theme/tokens';
import { daysUntil, getWarrantyStatus, warrantyProgress } from '../../domain/Warranty';
import { useWarrantyQuery } from '../useWarranty';

type Props = {
  assetId: string;
  onPress: () => void;
};

const STATUS_COPY = {
  active: { label: 'Warranty active', color: colors.accentText },
  expiringSoon: { label: 'Warranty expiring soon', color: colors.warning },
  expired: { label: 'Warranty expired', color: colors.danger },
} as const;

export function WarrantyCard({ assetId, onPress }: Props) {
  const { data: warranty, isLoading } = useWarrantyQuery(assetId);

  if (isLoading) return null;

  if (!warranty) {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.line,
          borderRadius: radius.md,
          padding: spacing.md,
        }}>
        <Text variant="body" color={colors.textMuted}>
          No warranty on file
        </Text>
        <Button label="Add warranty" variant="secondary" onPress={onPress} />
      </View>
    );
  }

  const status = getWarrantyStatus(warranty.endDate);
  const days = daysUntil(warranty.endDate);
  const progress = warrantyProgress(warranty.startDate, warranty.endDate);
  const { label, color } = STATUS_COPY[status];
  const sub = status === 'expired' ? `Expired ${Math.abs(days)} day(s) ago` : `Expires in ${days} day(s)`;

  return (
    <Pressable
      onPress={onPress}
      style={{ backgroundColor: colors.surfaceDark, borderRadius: radius.lg, padding: spacing.lg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <ShieldIcon color={color} size={16} />
          <Text variant="label" color={colors.onDark}>
            {label}
          </Text>
        </View>
        <Text variant="caption" color="rgba(246,245,240,0.6)">
          {warranty.provider}
        </Text>
      </View>
      <View style={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(246,245,240,0.15)', overflow: 'hidden', marginBottom: spacing.xs }}>
        <View style={{ width: `${progress * 100}%`, height: '100%', backgroundColor: color }} />
      </View>
      <Text variant="caption" color="rgba(246,245,240,0.65)">
        {sub} · {warranty.endDate}
      </Text>
    </Pressable>
  );
}
