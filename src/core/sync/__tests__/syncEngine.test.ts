jest.mock('../../network/supabaseClient', () => ({
  supabase: { from: jest.fn(), auth: { getSession: jest.fn() } },
}));
jest.mock('../SyncQueue', () => ({
  getLastSyncedUpdatedAt: jest.fn(),
  setLastSyncedUpdatedAt: jest.fn(),
  markSynced: jest.fn(),
  markFailed: jest.fn(),
  markConflict: jest.fn(),
  listDue: jest.fn(),
}));

import { supabase } from '../../network/supabaseClient';
import * as SyncQueue from '../SyncQueue';
import { processItem, processQueue } from '../syncEngine';
import type { SyncQueueItem } from '../SyncQueue';

const from = supabase.from as jest.Mock;
const getSession = supabase.auth.getSession as jest.Mock;

function item(overrides: Partial<SyncQueueItem>): SyncQueueItem {
  return { id: 'q1', entityType: 'asset', entityId: 'a1', operation: 'upsert', payload: null, attempts: 0, lastError: null, status: 'pending', nextAttemptAt: '', ...overrides };
}

beforeEach(() => {
  jest.resetAllMocks();
  getSession.mockResolvedValue({ data: { session: { user: { id: 'u1' } } } });
});

test('processItem pushes a delete and marks the queue item synced', async () => {
  const eq = jest.fn().mockResolvedValue({ error: null });
  from.mockReturnValue({ delete: () => ({ eq }) });

  await processItem(item({ operation: 'delete' }));

  expect(eq).toHaveBeenCalledWith('id', 'a1');
  expect(SyncQueue.markSynced).toHaveBeenCalledWith('q1');
});

test('processItem throws on a delete error so the caller can schedule a retry', async () => {
  from.mockReturnValue({ delete: () => ({ eq: jest.fn().mockResolvedValue({ error: { message: 'offline' } }) }) });

  await expect(processItem(item({ operation: 'delete' }))).rejects.toThrow('offline');
});

test('processItem pushes an upsert when the remote side has not moved', async () => {
  const maybeSingle = jest.fn().mockResolvedValue({ data: { updated_at: '2026-01-01' }, error: null });
  const upsert = jest.fn().mockResolvedValue({ error: null });
  from.mockReturnValue({ select: () => ({ eq: () => ({ maybeSingle }) }), upsert });
  (SyncQueue.getLastSyncedUpdatedAt as jest.Mock).mockResolvedValue('2026-01-01');

  const payload = { id: 'a1', updated_at: '2026-01-02' };
  await processItem(item({ payload }));

  expect(upsert).toHaveBeenCalledWith({ ...payload, user_id: 'u1' });
  expect(SyncQueue.setLastSyncedUpdatedAt).toHaveBeenCalledWith('asset', 'a1', '2026-01-02');
  expect(SyncQueue.markSynced).toHaveBeenCalledWith('q1');
});

test('processItem marks a conflict instead of overwriting a remote change it has not seen', async () => {
  const maybeSingle = jest.fn().mockResolvedValue({ data: { updated_at: '2026-01-03' }, error: null });
  const upsert = jest.fn();
  from.mockReturnValue({ select: () => ({ eq: () => ({ maybeSingle }) }), upsert });
  (SyncQueue.getLastSyncedUpdatedAt as jest.Mock).mockResolvedValue('2026-01-01');

  await processItem(item({ payload: { id: 'a1', updated_at: '2026-01-02' } }));

  expect(upsert).not.toHaveBeenCalled();
  expect(SyncQueue.markConflict).toHaveBeenCalledWith('q1');
});

test('processItem skips the conflict check for append-only completions', async () => {
  const upsert = jest.fn().mockResolvedValue({ error: null });
  from.mockReturnValue({ upsert });

  await processItem(item({ entityType: 'maintenance_completion', payload: { id: 'c1' } }));

  expect(SyncQueue.getLastSyncedUpdatedAt).not.toHaveBeenCalled();
  expect(SyncQueue.setLastSyncedUpdatedAt).not.toHaveBeenCalled();
  expect(SyncQueue.markSynced).toHaveBeenCalledWith('q1');
});

test('processItem refuses to push an upsert with no payload', async () => {
  await expect(processItem(item({ payload: null }))).rejects.toThrow('no payload');
});

test('processQueue schedules a backoff retry when a push fails, without throwing', async () => {
  (SyncQueue.listDue as jest.Mock).mockResolvedValue([item({ entityType: 'maintenance_completion', payload: { id: 'c1' } })]);
  from.mockReturnValue({ upsert: jest.fn().mockResolvedValue({ error: { message: 'offline' } }) });

  await processQueue();

  expect(SyncQueue.markFailed).toHaveBeenCalledWith('q1', 'offline', expect.any(String));
});
