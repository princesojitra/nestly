import { useSyncStatusStore } from '../useSyncStatusStore';

test('setOnline and setPendingCount update state', () => {
  useSyncStatusStore.getState().setOnline(false);
  useSyncStatusStore.getState().setPendingCount(3);

  expect(useSyncStatusStore.getState().isOnline).toBe(false);
  expect(useSyncStatusStore.getState().pendingCount).toBe(3);
});
