import { db } from '../database/db';
import { useSyncStatusStore } from '../../shared/state/useSyncStatusStore';

export type SyncEntityType = 'asset' | 'warranty' | 'maintenance_task' | 'maintenance_completion';
export type SyncOperation = 'upsert' | 'delete';
export type SyncQueueStatus = 'pending' | 'conflict';

export type SyncQueueItem = {
  id: string;
  entityType: SyncEntityType;
  entityId: string;
  operation: SyncOperation;
  payload: Record<string, unknown> | null;
  attempts: number;
  lastError: string | null;
  status: SyncQueueStatus;
  nextAttemptAt: string;
};

export async function ensureSyncTables() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS sync_queue (
      id TEXT PRIMARY KEY,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      operation TEXT NOT NULL,
      payload TEXT,
      attempts INTEGER NOT NULL DEFAULT 0,
      last_error TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      next_attempt_at TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
  // Baseline of what each entity's updated_at was the last time it was successfully
  // pushed — detectConflict compares a fresh remote read against this, not against
  // "now", so a remote change made by something else since then is caught instead
  // of silently overwritten.
  await db.execute(`
    CREATE TABLE IF NOT EXISTS sync_meta (
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      last_synced_updated_at TEXT NOT NULL,
      PRIMARY KEY (entity_type, entity_id)
    );
  `);
}

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function toItem(row: Record<string, unknown>): SyncQueueItem {
  return {
    id: row.id as string,
    entityType: row.entity_type as SyncEntityType,
    entityId: row.entity_id as string,
    operation: row.operation as SyncOperation,
    payload: row.payload ? (JSON.parse(row.payload as string) as Record<string, unknown>) : null,
    attempts: row.attempts as number,
    lastError: (row.last_error as string | null) ?? null,
    status: row.status as SyncQueueStatus,
    nextAttemptAt: row.next_attempt_at as string,
  };
}

// A later write for the same entity makes any earlier queued one (pending or
// conflicted) obsolete, so it's collapsed away first rather than left to pile up.
export async function enqueueSync(entityType: SyncEntityType, entityId: string, operation: SyncOperation, payload: Record<string, unknown> | null) {
  await db.execute('DELETE FROM sync_queue WHERE entity_type = ? AND entity_id = ?;', [entityType, entityId]);
  const now = new Date().toISOString();
  await db.execute(
    `INSERT INTO sync_queue (id, entity_type, entity_id, operation, payload, attempts, last_error, status, next_attempt_at, created_at)
     VALUES (?, ?, ?, ?, ?, 0, NULL, 'pending', ?, ?);`,
    [generateId(), entityType, entityId, operation, payload ? JSON.stringify(payload) : null, now, now],
  );
  await refreshSyncCounts();
}

export async function listDue(now: string = new Date().toISOString()): Promise<SyncQueueItem[]> {
  const { rows } = await db.execute("SELECT * FROM sync_queue WHERE status = 'pending' AND next_attempt_at <= ? ORDER BY created_at ASC;", [now]);
  return rows.map(toItem);
}

export async function listConflicts(): Promise<SyncQueueItem[]> {
  const { rows } = await db.execute("SELECT * FROM sync_queue WHERE status = 'conflict' ORDER BY created_at ASC;");
  return rows.map(toItem);
}

export async function markSynced(id: string) {
  await db.execute('DELETE FROM sync_queue WHERE id = ?;', [id]);
  await refreshSyncCounts();
}

export async function markFailed(id: string, error: string, nextAttemptAt: string) {
  await db.execute('UPDATE sync_queue SET attempts = attempts + 1, last_error = ?, next_attempt_at = ? WHERE id = ?;', [error, nextAttemptAt, id]);
}

export async function markConflict(id: string) {
  await db.execute("UPDATE sync_queue SET status = 'conflict' WHERE id = ?;", [id]);
  await refreshSyncCounts();
}

export async function getLastSyncedUpdatedAt(entityType: SyncEntityType, entityId: string): Promise<string | null> {
  const { rows } = await db.execute('SELECT last_synced_updated_at FROM sync_meta WHERE entity_type = ? AND entity_id = ?;', [entityType, entityId]);
  return rows[0] ? (rows[0].last_synced_updated_at as string) : null;
}

export async function setLastSyncedUpdatedAt(entityType: SyncEntityType, entityId: string, updatedAt: string) {
  await db.execute(
    `INSERT INTO sync_meta (entity_type, entity_id, last_synced_updated_at) VALUES (?, ?, ?)
     ON CONFLICT(entity_type, entity_id) DO UPDATE SET last_synced_updated_at = excluded.last_synced_updated_at;`,
    [entityType, entityId, updatedAt],
  );
}

export async function refreshSyncCounts() {
  const [{ rows: pendingRows }, { rows: conflictRows }] = await Promise.all([
    db.execute("SELECT COUNT(*) as count FROM sync_queue WHERE status = 'pending';"),
    db.execute("SELECT COUNT(*) as count FROM sync_queue WHERE status = 'conflict';"),
  ]);
  useSyncStatusStore.getState().setPendingCount(pendingRows[0]?.count as number);
  useSyncStatusStore.getState().setConflictCount(conflictRows[0]?.count as number);
}
