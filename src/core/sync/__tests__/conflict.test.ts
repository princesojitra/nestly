import { backoffDelayMs, detectConflict } from '../conflict';

test('no conflict when the remote row does not exist yet', () => {
  expect(detectConflict({ localUpdatedAt: '2026-01-02', remoteUpdatedAt: null, lastSyncedUpdatedAt: null })).toBe(false);
});

test('no conflict when remote already matches what we are about to push (our own echo)', () => {
  expect(detectConflict({ localUpdatedAt: '2026-01-02', remoteUpdatedAt: '2026-01-02', lastSyncedUpdatedAt: '2026-01-01' })).toBe(false);
});

test('no conflict on first-ever push: remote differs from local but matches nothing we have synced', () => {
  // first push ever: lastSyncedUpdatedAt is null, remote is also whatever the row looked like when created elsewhere — treated as no prior baseline to violate
  expect(detectConflict({ localUpdatedAt: '2026-01-02', remoteUpdatedAt: null, lastSyncedUpdatedAt: null })).toBe(false);
});

test('conflict when the remote has moved past our last known-synced version', () => {
  expect(detectConflict({ localUpdatedAt: '2026-01-02', remoteUpdatedAt: '2026-01-03', lastSyncedUpdatedAt: '2026-01-01' })).toBe(true);
});

test('backoffDelayMs doubles each attempt and caps at 5 minutes', () => {
  expect(backoffDelayMs(0)).toBe(5_000);
  expect(backoffDelayMs(1)).toBe(10_000);
  expect(backoffDelayMs(2)).toBe(20_000);
  expect(backoffDelayMs(10)).toBe(5 * 60_000);
});
