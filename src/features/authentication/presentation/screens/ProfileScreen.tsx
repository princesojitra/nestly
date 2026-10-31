import React, { useState } from 'react';
import { View } from 'react-native';
import { Text, Button } from '../../../../shared/components';
import { colors, spacing } from '../../../../shared/theme/tokens';
import { supabaseAuthRepository } from '../../data/supabaseAuthRepository';

export function ProfileScreen() {
  const [error, setError] = useState<string | null>(null);

  const onSignOut = async () => {
    setError(null);
    try {
      await supabaseAuthRepository.signOut();
      // AuthProvider's listener flips the root navigator back to the Auth stack.
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not sign out');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', padding: spacing.xxl, gap: spacing.md }}>
      <Text variant="title">Profile</Text>
      <Text variant="body" color={colors.textMuted}>
        Settings, notifications, and data export are coming in a later milestone.
      </Text>
      {error ? (
        <Text variant="caption" color={colors.danger}>
          {error}
        </Text>
      ) : null}
      <Button label="Sign out" variant="secondary" onPress={onSignOut} />
    </View>
  );
}
