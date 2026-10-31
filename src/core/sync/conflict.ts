// Pure so it's testable without a real Supabase project (none exists yet — see docs/supabase-schema.sql).
// A conflict is "the remote row moved since we last synced it, and it isn't just an
// echo of the push we're about to make" — anything else is safe to overwrite.
export function detectConflict(args: { localUpdatedAt: string; remoteUpdatedAt: string | null; lastSyncedUpdatedAt: string | null }): boolean {
  const { localUpdatedAt, remoteUpdatedAt, lastSyncedUpdatedAt } = args;
  if (remoteUpdatedAt === null) return false;
  if (remoteUpdatedAt === localUpdatedAt) return false;
  return remoteUpdatedAt !== lastSyncedUpdatedAt;
}

const BASE_DELAY_MS = 5_000;
const MAX_DELAY_MS = 5 * 60_000;

export function backoffDelayMs(attempts: number): number {
  return Math.min(BASE_DELAY_MS * 2 ** attempts, MAX_DELAY_MS);
}
