import React from 'react';
import { Text as RNText, type TextProps } from 'react-native';
import { colors, typography, type TypographyVariant } from '../theme/tokens';

type Props = TextProps & {
  variant?: TypographyVariant;
  color?: string;
};

export function Text({ variant = 'body', color = colors.text, style, ...rest }: Props) {
  return <RNText style={[typography[variant], { color }, style]} {...rest} />;
}
