import { db } from '../../../core/database/db';
import { enqueueSync } from '../../../core/sync/SyncQueue';
import type { Asset, AssetCategory, NewAsset } from '../domain/Asset';
import type { AssetRepository } from '../domain/AssetRepository';

export async function ensureAssetsTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS assets (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      purchase_date TEXT,
      price REAL,
      description TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
}

// shortcut: not a cryptographically unique UUID (no crypto.randomUUID in
// Hermes without a polyfill) — fine for a local-only primary key; upgrade to
// a real UUID (e.g. react-native-uuid) once records need to be globally
// unique for multi-device Supabase sync (Milestone 5).
function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function toSyncPayload(asset: Asset): Record<string, unknown> {
  return {
    id: asset.id,
    name: asset.name,
    category: asset.category,
    purchase_date: asset.purchaseDate,
    price: asset.price,
    description: asset.description,
    created_at: asset.createdAt,
    updated_at: asset.updatedAt,
  };
}

function toAsset(row: Record<string, unknown>): Asset {
  return {
    id: row.id as string,
    name: row.name as string,
    category: row.category as AssetCategory,
    purchaseDate: (row.purchase_date as string | null) ?? null,
    price: (row.price as number | null) ?? null,
    description: (row.description as string | null) ?? null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export const sqliteAssetRepository: AssetRepository = {
  async list() {
    const { rows } = await db.execute('SELECT * FROM assets ORDER BY created_at DESC;');
    return rows.map(toAsset);
  },

  async get(id) {
    const { rows } = await db.execute('SELECT * FROM assets WHERE id = ?;', [id]);
    return rows[0] ? toAsset(rows[0]) : null;
  },

  async create(asset: NewAsset) {
    const id = generateId();
    const now = new Date().toISOString();
    await db.execute('INSERT INTO assets (id, name, category, purchase_date, price, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?);', [
      id,
      asset.name,
      asset.category,
      asset.purchaseDate,
      asset.price,
      asset.description,
      now,
      now,
    ]);
    const created = { id, createdAt: now, updatedAt: now, ...asset };
    await enqueueSync('asset', id, 'upsert', toSyncPayload(created));
    return created;
  },

  async update(id, asset: NewAsset) {
    const now = new Date().toISOString();
    await db.execute('UPDATE assets SET name = ?, category = ?, purchase_date = ?, price = ?, description = ?, updated_at = ? WHERE id = ?;', [
      asset.name,
      asset.category,
      asset.purchaseDate,
      asset.price,
      asset.description,
      now,
      id,
    ]);
    const updated = await sqliteAssetRepository.get(id);
    if (!updated) throw new Error('Asset not found after update');
    await enqueueSync('asset', id, 'upsert', toSyncPayload(updated));
    return updated;
  },

  async remove(id) {
    await db.execute('DELETE FROM assets WHERE id = ?;', [id]);
    await enqueueSync('asset', id, 'delete', null);
  },
};
