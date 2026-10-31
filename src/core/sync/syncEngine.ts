import { supabase } from '../network/supabaseClient';
import { backoffDelayMs, detectConflict } from './conflict';
import { getLastSyncedUpdatedAt, listDue, markConflict, markFailed, markSynced, setLastSyncedUpdatedAt } from './SyncQueue';
import type { SyncEntityType, SyncQueueItem } from './SyncQueue';

const TABLE_BY_ENTITY: Record<SyncEntityType, string> = {
  asset: 'assets',
  warranty: 'warranties',
  maintenance_task: 'maintenance_tasks',
  maintenance_completion: 'maintenance_completions',
};

// Append-only log rows have no updated_at to compare, so there's nothing to conflict with.
const CONFLICT_CHECKED: ReadonlySet<SyncEntityType> = new Set(['asset', 'warranty', 'maintenance_task']);

let isProcessing = false;

// Exported for tests; production code should call processQueue().
export async function processItem(item: SyncQueueItem): Promise<void> {
  const table = TABLE_BY_ENTITY[item.entityType];

  if (item.operation === 'delete') {
    const { error } = await supabase.from(table).delete().eq('id', item.entityId);
    if (error) throw new Error(error.message);
    await markSynced(item.id);
    return;
  }

  if (!item.payload) throw new Error(`Upsert queued with no payload: ${item.id}`);

  if (CONFLICT_CHECKED.has(item.entityType)) {
    const [{ data: remote, error: readError }, lastSyncedUpdatedAt] = await Promise.all([
      supabase.from(table).select('updated_at').eq('id', item.entityId).maybeSingle(),
      getLastSyncedUpdatedAt(item.entityType, item.entityId),
    ]);
    if (readError) throw new Error(readError.message);

    const localUpdatedAt = item.payload.updated_at as string;
    if (detectConflict({ localUpdatedAt, remoteUpdatedAt: remote?.updated_at ?? null, lastSyncedUpdatedAt })) {
      await markConflict(item.id);
      return;
    }
  }

  const { data: session } = await supabase.auth.getSession();
  const userId = session.session?.user.id;
  if (!userId) throw new Error('No signed-in user to attribute this row to.');

  const { error } = await supabase.from(table).upsert({ ...item.payload, user_id: userId });
  if (error) throw new Error(error.message);

  if (CONFLICT_CHECKED.has(item.entityType)) {
    await setLastSyncedUpdatedAt(item.entityType, item.entityId, item.payload.updated_at as string);
  }
  await markSynced(item.id);
}

// Safe to call repeatedly (on reconnect, on app start, after every local write) —
// re-entrant calls are no-ops while one is already draining the queue.
export async function processQueue(): Promise<void> {
  if (isProcessing) return;
  isProcessing = true;
  try {
    for (const item of await listDue()) {
      try {
        await processItem(item);
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        const nextAttemptAt = new Date(Date.now() + backoffDelayMs(item.attempts)).toISOString();
        await markFailed(item.id, message, nextAttemptAt);
      }
    }
  } finally {
    isProcessing = false;
  }
}
