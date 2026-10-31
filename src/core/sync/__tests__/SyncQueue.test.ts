jest.mock('../../database/db', () => ({ db: { execute: jest.fn() } }));

import { db } from '../../database/db';
import { useSyncStatusStore } from '../../../shared/state/useSyncStatusStore';
import { enqueueSync, getLastSyncedUpdatedAt, listDue, markConflict, markFailed, markSynced, setLastSyncedUpdatedAt } from '../SyncQueue';

const execute = db.execute as jest.Mock;

beforeEach(() => {
  execute.mockReset();
  execute.mockResolvedValue({ rows: [], rowsAffected: 0 });
  useSyncStatusStore.setState({ isOnline: true, pendingCount: 0, conflictCount: 0 });
});

test('enqueueSync collapses any existing queued item for the same entity before inserting', async () => {
  await enqueueSync('asset', 'a1', 'upsert', { id: 'a1', name: 'Fridge' });

  expect(execute).toHaveBeenNthCalledWith(1, expect.stringContaining('DELETE FROM sync_queue WHERE entity_type = ? AND entity_id = ?'), [
    'asset',
    'a1',
  ]);
  expect(execute).toHaveBeenNthCalledWith(
    2,
    expect.stringContaining('INSERT INTO sync_queue'),
    expect.arrayContaining(['asset', 'a1', 'upsert', JSON.stringify({ id: 'a1', name: 'Fridge' })]),
  );
});

test('enqueueSync refreshes the pending count in the sync status store', async () => {
  execute.mockImplementation((sql: string) => {
    if (sql.includes("status = 'pending'")) return Promise.resolve({ rows: [{ count: 2 }], rowsAffected: 0 });
    if (sql.includes("status = 'conflict'")) return Promise.resolve({ rows: [{ count: 1 }], rowsAffected: 0 });
    return Promise.resolve({ rows: [], rowsAffected: 0 });
  });

  await enqueueSync('asset', 'a1', 'delete', null);

  expect(useSyncStatusStore.getState().pendingCount).toBe(2);
  expect(useSyncStatusStore.getState().conflictCount).toBe(1);
});

test('listDue only returns pending rows whose next_attempt_at has arrived', async () => {
  execute.mockResolvedValueOnce({
    rows: [{ id: 'q1', entity_type: 'asset', entity_id: 'a1', operation: 'upsert', payload: '{"id":"a1"}', attempts: 0, last_error: null, status: 'pending', next_attempt_at: '2026-01-01' }],
    rowsAffected: 0,
  });

  const due = await listDue('2026-01-02');

  expect(due).toEqual([
    { id: 'q1', entityType: 'asset', entityId: 'a1', operation: 'upsert', payload: { id: 'a1' }, attempts: 0, lastError: null, status: 'pending', nextAttemptAt: '2026-01-01' },
  ]);
});

test('markSynced deletes the queue row and refreshes counts', async () => {
  await markSynced('q1');
  expect(execute).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM sync_queue WHERE id = ?'), ['q1']);
});

test('markFailed increments attempts and records the backoff time without removing the row', async () => {
  await markFailed('q1', 'network error', '2026-01-01T00:05:00.000Z');
  expect(execute).toHaveBeenCalledWith(expect.stringContaining('attempts = attempts + 1'), ['network error', '2026-01-01T00:05:00.000Z', 'q1']);
});

test('markConflict flips status and refreshes counts', async () => {
  await markConflict('q1');
  expect(execute).toHaveBeenCalledWith(expect.stringContaining("status = 'conflict'"), ['q1']);
});

test('sync_meta round-trips the last synced updated_at per entity', async () => {
  execute.mockImplementation((sql: string) =>
    sql.startsWith('SELECT')
      ? Promise.resolve({ rows: [{ last_synced_updated_at: '2026-01-01T00:00:00.000Z' }], rowsAffected: 0 })
      : Promise.resolve({ rows: [], rowsAffected: 0 }),
  );

  await setLastSyncedUpdatedAt('asset', 'a1', '2026-01-01T00:00:00.000Z');
  const result = await getLastSyncedUpdatedAt('asset', 'a1');

  expect(execute).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO sync_meta'), ['asset', 'a1', '2026-01-01T00:00:00.000Z']);
  expect(result).toBe('2026-01-01T00:00:00.000Z');
});
