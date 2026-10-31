import React from 'react';
import { View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, Button } from '../../../../shared/components';
import { colors, spacing } from '../../../../shared/theme/tokens';
import type { AuthStackParamList } from '../../../../app/navigation/AuthStack';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export function WelcomeScreen({ navigation }: Props) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'flex-end',
        padding: spacing.xxl,
        gap: spacing.md,
      }}>
      <Text variant="display">Nestly</Text>
      <Text variant="body" color={colors.textMuted} style={{ marginBottom: spacing.xl }}>
        Organize your home — assets, warranties, maintenance, and expenses, all in one calm place.
      </Text>
      <Button label="Create account" onPress={() => navigation.navigate('SignUp')} />
      <Button label="Log in" variant="secondary" onPress={() => navigation.navigate('SignIn')} />
    </View>
  );
}
