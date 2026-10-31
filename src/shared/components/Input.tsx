import React from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';
import { Text } from './Text';
import { colors, radius, spacing } from '../theme/tokens';

type Props = TextInputProps & {
  label: string;
  error?: string;
};

export function Input({ label, error, style, ...rest }: Props) {
  return (
    <View style={{ gap: spacing.xs }}>
      <Text variant="label" color={colors.textMutedStrong}>
        {label}
      </Text>
      <TextInput
        style={[
          {
            borderWidth: 1,
            borderColor: error ? colors.danger : colors.lineStrong,
            borderRadius: radius.md,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.md - 2,
            fontSize: 15,
            color: colors.text,
            backgroundColor: colors.surface,
          },
          style,
        ]}
        placeholderTextColor={colors.textMutedStrong}
        autoCapitalize="none"
        {...rest}
      />
      {error ? (
        <Text variant="caption" color={colors.danger}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
