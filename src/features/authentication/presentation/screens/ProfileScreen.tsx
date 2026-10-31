import React, { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Button } from '../../../../shared/components';
import { colors, radius, spacing } from '../../../../shared/theme/tokens';
import { supabaseAuthRepository } from '../../data/supabaseAuthRepository';
import { useAuthStore } from '../useAuthStore';

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const email = useAuthStore((s) => s.user?.email);
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
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top + spacing.lg, paddingHorizontal: spacing.xxl, gap: spacing.lg }}>
      <Text variant="display">Profile</Text>

      <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.md }}>
        <Text variant="caption" color={colors.textMutedStrong}>
          Signed in as
        </Text>
        <Text variant="label">{email ?? 'Unknown'}</Text>
      </View>

      <Text variant="body" color={colors.textMuted}>
        Notification preferences, data export, sync status, and a dark theme land in later milestones — each needs infrastructure
        (push notifications, Supabase sync) this app doesn't have yet.
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
