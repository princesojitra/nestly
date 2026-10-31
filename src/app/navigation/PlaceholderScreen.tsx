import React from 'react';
import { View } from 'react-native';
import { Text } from '../../shared/components';
import { colors, spacing } from '../../shared/theme/tokens';

export function PlaceholderScreen({ title }: { title: string }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xxl,
      }}>
      <Text variant="title">{title}</Text>
      <Text variant="body" color={colors.textMuted} style={{ marginTop: spacing.sm, textAlign: 'center' }}>
        Coming in Milestone 4
      </Text>
    </View>
  );
}
