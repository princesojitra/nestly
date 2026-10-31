import React, { useEffect, useState, type ReactNode } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { runMigrations } from '../../core/database/db';
import { ensureAssetsTable } from '../../features/inventory/data/sqliteAssetRepository';
import { colors } from '../../shared/theme/tokens';

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    runMigrations()
      .then(ensureAssetsTable)
      .then(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.text} />
      </View>
    );
  }

  return <>{children}</>;
}
