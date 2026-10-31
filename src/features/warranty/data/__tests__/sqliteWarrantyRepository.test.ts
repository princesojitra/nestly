jest.mock('../../../../core/database/db', () => ({ db: { execute: jest.fn() } }));
jest.mock('../../../../core/sync/SyncQueue', () => ({ enqueueSync: jest.fn() }));

import { db } from '../../../../core/database/db';
import { ensureWarrantiesTable, sqliteWarrantyRepository } from '../sqliteWarrantyRepository';

const execute = db.execute as jest.Mock;

beforeEach(() => {
  execute.mockReset();
});

test('ensureWarrantiesTable creates the table if missing', async () => {
  execute.mockResolvedValueOnce({ rows: [], rowsAffected: 0 });

  await ensureWarrantiesTable();

  expect(execute).toHaveBeenCalledWith(expect.stringContaining('CREATE TABLE IF NOT EXISTS warranties'));
});

test('getForAsset returns null when there is no row', async () => {
  execute.mockResolvedValueOnce({ rows: [], rowsAffected: 0 });

  const result = await sqliteWarrantyRepository.getForAsset('a1');

  expect(result).toBeNull();
});

test('getForAsset maps a row to a Warranty', async () => {
  execute.mockResolvedValueOnce({
    rowsAffected: 0,
    rows: [
      {
        asset_id: 'a1',
        provider: 'Samsung',
        start_date: '2024-06-14',
        end_date: '2027-06-14',
        created_at: '2026-01-01T00:00:00.000Z',
        updated_at: '2026-01-01T00:00:00.000Z',
      },
    ],
  });

  const result = await sqliteWarrantyRepository.getForAsset('a1');

  expect(result).toEqual({
    assetId: 'a1',
    provider: 'Samsung',
    startDate: '2024-06-14',
    endDate: '2027-06-14',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  });
});

test('upsert inserts a new warranty, keeping its own createdAt', async () => {
  execute
    .mockResolvedValueOnce({ rows: [], rowsAffected: 0 }) // getForAsset (existing lookup)
    .mockResolvedValueOnce({ rows: [], rowsAffected: 1 }); // INSERT ... ON CONFLICT

  const result = await sqliteWarrantyRepository.upsert({
    assetId: 'a1',
    provider: 'Samsung',
    startDate: '2024-06-14',
    endDate: '2027-06-14',
  });

  expect(result.assetId).toBe('a1');
  expect(result.createdAt).toBe(result.updatedAt);
  expect(execute).toHaveBeenLastCalledWith(expect.stringContaining('ON CONFLICT(asset_id)'), [
    'a1',
    'Samsung',
    '2024-06-14',
    '2027-06-14',
    result.createdAt,
    result.updatedAt,
  ]);
});

test('remove deletes by asset id', async () => {
  execute.mockResolvedValueOnce({ rows: [], rowsAffected: 1 });

  await sqliteWarrantyRepository.remove('a1');

  expect(execute).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM warranties'), ['a1']);
});
