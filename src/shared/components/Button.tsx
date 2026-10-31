import React from 'react';
import { Pressable, type PressableProps } from 'react-native';
import { Text } from './Text';
import { colors, radius, spacing } from '../theme/tokens';

type Props = PressableProps & {
  label: string;
  variant?: 'primary' | 'secondary';
};

export function Button({ label, variant = 'primary', disabled, style, ...rest }: Props) {
  const isPrimary = variant === 'primary';
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={(state) => [
        {
          paddingVertical: spacing.md + 1,
          paddingHorizontal: spacing.lg,
          borderRadius: radius.md,
          alignItems: 'center',
          backgroundColor: isPrimary ? colors.surfaceDark : colors.surface,
          borderWidth: isPrimary ? 0 : 1,
          borderColor: colors.lineStrong,
          opacity: disabled ? 0.5 : state.pressed ? 0.85 : 1,
        },
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}>
      <Text variant="label" color={isPrimary ? colors.onDark : colors.text}>
        {label}
      </Text>
    </Pressable>
  );
}
