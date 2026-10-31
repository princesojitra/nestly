import { create } from 'zustand';

// Cross-cutting sync status (docs/ARCHITECTURE.md's offline-first flow) — the
// sync queue (core/database) updates this; any screen can read it.
type SyncStatusState = {
  isOnline: boolean;
  pendingCount: number;
  conflictCount: number;
  setOnline: (isOnline: boolean) => void;
  setPendingCount: (pendingCount: number) => void;
  setConflictCount: (conflictCount: number) => void;
};

export const useSyncStatusStore = create<SyncStatusState>((set) => ({
  isOnline: true,
  pendingCount: 0,
  conflictCount: 0,
  setOnline: (isOnline) => set({ isOnline }),
  setPendingCount: (pendingCount) => set({ pendingCount }),
  setConflictCount: (conflictCount) => set({ conflictCount }),
}));
