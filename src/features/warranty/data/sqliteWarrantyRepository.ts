import { db } from '../../../core/database/db';
import { enqueueSync } from '../../../core/sync/SyncQueue';
import type { NewWarranty, Warranty } from '../domain/Warranty';
import type { WarrantyRepository } from '../domain/WarrantyRepository';

export async function ensureWarrantiesTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS warranties (
      asset_id TEXT PRIMARY KEY REFERENCES assets(id) ON DELETE CASCADE,
      provider TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
}

function toSyncPayload(warranty: Warranty): Record<string, unknown> {
  return {
    asset_id: warranty.assetId,
    provider: warranty.provider,
    start_date: warranty.startDate,
    end_date: warranty.endDate,
    created_at: warranty.createdAt,
    updated_at: warranty.updatedAt,
  };
}

function toWarranty(row: Record<string, unknown>): Warranty {
  return {
    assetId: row.asset_id as string,
    provider: row.provider as string,
    startDate: row.start_date as string,
    endDate: row.end_date as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export const sqliteWarrantyRepository: WarrantyRepository = {
  async getForAsset(assetId) {
    const { rows } = await db.execute('SELECT * FROM warranties WHERE asset_id = ?;', [assetId]);
    return rows[0] ? toWarranty(rows[0]) : null;
  },

  async upsert(warranty: NewWarranty) {
    const existing = await sqliteWarrantyRepository.getForAsset(warranty.assetId);
    const now = new Date().toISOString();
    const createdAt = existing?.createdAt ?? now;
    await db.execute(
      `INSERT INTO warranties (asset_id, provider, start_date, end_date, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(asset_id) DO UPDATE SET
         provider = excluded.provider,
         start_date = excluded.start_date,
         end_date = excluded.end_date,
         updated_at = excluded.updated_at;`,
      [warranty.assetId, warranty.provider, warranty.startDate, warranty.endDate, createdAt, now],
    );
    const saved = { ...warranty, createdAt, updatedAt: now };
    await enqueueSync('warranty', warranty.assetId, 'upsert', toSyncPayload(saved));
    return saved;
  },

  async remove(assetId) {
    await db.execute('DELETE FROM warranties WHERE asset_id = ?;', [assetId]);
    await enqueueSync('warranty', assetId, 'delete', null);
  },
};
