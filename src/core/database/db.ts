import { open } from '@op-engineering/op-sqlite';

// SQLite is the source of truth for reads/writes (offline-first — docs/ARCHITECTURE.md).
// Feature tables are created by each feature's own migration as it's built;
// this file only owns the connection and the migration bookkeeping table.
export const db = open({ name: 'nestly.db' });

export async function runMigrations() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}
