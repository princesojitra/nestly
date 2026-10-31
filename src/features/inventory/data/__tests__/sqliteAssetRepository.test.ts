jest.mock('../../../../core/database/db', () => ({ db: { execute: jest.fn() } }));

import { db } from '../../../../core/database/db';
import { ensureAssetsTable, sqliteAssetRepository } from '../sqliteAssetRepository';

const execute = db.execute as jest.Mock;

beforeEach(() => {
  execute.mockReset();
});

test('ensureAssetsTable creates the table if missing', async () => {
  execute.mockResolvedValueOnce({ rows: [], rowsAffected: 0 });

  await ensureAssetsTable();

  expect(execute).toHaveBeenCalledWith(expect.stringContaining('CREATE TABLE IF NOT EXISTS assets'));
});

test('list maps snake_case rows to Asset objects', async () => {
  execute.mockResolvedValueOnce({
    rowsAffected: 0,
    rows: [
      {
        id: 'a1',
        name: 'Fridge',
        category: 'Appliances',
        purchase_date: '2024-06-14',
        price: 2400,
        description: null,
        created_at: '2026-01-01T00:00:00.000Z',
        updated_at: '2026-01-01T00:00:00.000Z',
      },
    ],
  });

  const assets = await sqliteAssetRepository.list();

  expect(assets).toEqual([
    {
      id: 'a1',
      name: 'Fridge',
      category: 'Appliances',
      purchaseDate: '2024-06-14',
      price: 2400,
      description: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ]);
});

test('create inserts a row and returns the new asset', async () => {
  execute.mockResolvedValueOnce({ rows: [], rowsAffected: 1 });

  const created = await sqliteAssetRepository.create({
    name: 'Grill',
    category: 'Outdoor',
    purchaseDate: null,
    price: 650,
    description: null,
  });

  expect(created.name).toBe('Grill');
  expect(created.id).toEqual(expect.any(String));
  expect(execute).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO assets'), [
    created.id,
    'Grill',
    'Outdoor',
    null,
    650,
    null,
    created.createdAt,
    created.updatedAt,
  ]);
});

test('update writes the row then returns the refetched asset', async () => {
  execute
    .mockResolvedValueOnce({ rows: [], rowsAffected: 1 }) // UPDATE
    .mockResolvedValueOnce({
      rowsAffected: 0,
      rows: [
        {
          id: 'a1',
          name: 'Fridge (updated)',
          category: 'Appliances',
          purchase_date: null,
          price: null,
          description: null,
          created_at: '2026-01-01T00:00:00.000Z',
          updated_at: '2026-01-02T00:00:00.000Z',
        },
      ],
    }); // SELECT from get()

  const updated = await sqliteAssetRepository.update('a1', {
    name: 'Fridge (updated)',
    category: 'Appliances',
    purchaseDate: null,
    price: null,
    description: null,
  });

  expect(updated.name).toBe('Fridge (updated)');
});

test('update throws if the row is gone after writing', async () => {
  execute.mockResolvedValueOnce({ rows: [], rowsAffected: 0 }).mockResolvedValueOnce({ rows: [], rowsAffected: 0 });

  await expect(
    sqliteAssetRepository.update('missing', { name: 'x', category: 'Other', purchaseDate: null, price: null, description: null }),
  ).rejects.toThrow('Asset not found after update');
});

test('remove deletes by id', async () => {
  execute.mockResolvedValueOnce({ rows: [], rowsAffected: 1 });

  await sqliteAssetRepository.remove('a1');

  expect(execute).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM assets'), ['a1']);
});
