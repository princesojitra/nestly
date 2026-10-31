import React from 'react';
import { View, type ViewProps } from 'react-native';
import { colors, radius, spacing } from '../theme/tokens';

export function Card({ style, ...rest }: ViewProps) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.line,
          borderRadius: radius.md,
          padding: spacing.lg,
        },
        style,
      ]}
      {...rest}
    />
  );
}
