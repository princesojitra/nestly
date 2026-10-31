import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Text, Button, BoxIcon } from '../../../../shared/components';
import { colors, spacing } from '../../../../shared/theme/tokens';
import { useAuthStore } from '../../../authentication/presentation/useAuthStore';
import type { MainTabParamList } from '../../../../app/navigation/MainTabs';

type Props = BottomTabScreenProps<MainTabParamList, 'Dashboard'>;

export function DashboardScreen({ navigation }: Props) {
  const email = useAuthStore((s) => s.user?.email);
  const name = email?.split('@')[0] ?? 'there';
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: insets.top + spacing.lg,
        paddingHorizontal: spacing.xxl,
        paddingBottom: spacing.xxl,
      }}>
      <Text variant="caption" color={colors.textMutedStrong} style={{ marginTop: spacing.sm }}>
        Welcome back
      </Text>
      <Text variant="display" style={{ marginBottom: spacing.xxl }}>
        {name}
      </Text>

      {/* No assets yet — Inventory doesn't exist as a feature yet either, so
          this is the real (not mocked) state of a fresh account. */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md }}>
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: colors.accentTint,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: spacing.sm,
          }}>
          <BoxIcon color={colors.accentText} size={26} />
        </View>
        <Text variant="title" style={{ textAlign: 'center' }}>
          Your home, organized
        </Text>
        <Text variant="body" color={colors.textMuted} style={{ textAlign: 'center', marginBottom: spacing.md }}>
          Track assets, warranties, maintenance, and expenses — all in one place.
        </Text>
        <Button label="Add your first asset" onPress={() => navigation.navigate('Inventory')} />
      </View>
    </View>
  );
}
