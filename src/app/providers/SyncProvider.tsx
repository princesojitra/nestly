import React, { useEffect, type ReactNode } from 'react';
import { processQueue } from '../../core/sync/syncEngine';

// Mounted once DB tables exist (inside DatabaseProvider). Drains whatever was queued
// while the app was closed.
//
// shortcut: no live reconnect trigger — @react-native-community/netinfo is
// TurboModule-only (no legacy RCTBridgeModule fallback), and this project's codegen
// ("[CP-User] Generate Specs" / combine-js-to-schema) emits an empty moduleMapping in
// RCTModuleProviders.mm, so no third-party TurboModule gets registered at runtime
// ("NativeModule.RNCNetInfo is null", verified on-device; confirmed not a linking
// issue — nm on Nestly.debug.dylib shows RNCNetInfo's symbols are present, just never
// wired into the module registry). Root-cause the codegen gap before re-adding it.
// Until then the queue still drains on every app start and whenever a local write
// enqueues onto an empty queue; a change made while offline waits for the next app
// open to sync instead of pushing the moment connectivity returns.
export function SyncProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    void processQueue();
  }, []);

  return <>{children}</>;
}
