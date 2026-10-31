jest.mock('../../../../core/database/db', () => ({ db: { execute: jest.fn() } }));

import { db } from '../../../../core/database/db';
import { ensureMaintenanceTables, sqliteMaintenanceRepository } from '../sqliteMaintenanceRepository';

const execute = db.execute as jest.Mock;

beforeEach(() => {
  execute.mockReset();
});

test('ensureMaintenanceTables creates both tables', async () => {
  execute.mockResolvedValue({ rows: [], rowsAffected: 0 });

  await ensureMaintenanceTables();

  expect(execute).toHaveBeenCalledWith(expect.stringContaining('CREATE TABLE IF NOT EXISTS maintenance_tasks'));
  expect(execute).toHaveBeenCalledWith(expect.stringContaining('CREATE TABLE IF NOT EXISTS maintenance_completions'));
});

test('list maps recurring from 0/1 to a boolean', async () => {
  execute.mockResolvedValueOnce({
    rowsAffected: 0,
    rows: [
      {
        id: 't1',
        asset_id: null,
        title: 'Clean gutters',
        recurring: 1,
        interval_days: 180,
        due_date: '2026-11-08',
        cost: null,
        notes: null,
        created_at: '2026-01-01T00:00:00.000Z',
        updated_at: '2026-01-01T00:00:00.000Z',
      },
    ],
  });

  const tasks = await sqliteMaintenanceRepository.list();

  expect(tasks[0].recurring).toBe(true);
  expect(tasks[0].intervalDays).toBe(180);
});

test('create inserts a row and returns the new task', async () => {
  execute.mockResolvedValueOnce({ rows: [], rowsAffected: 1 });

  const created = await sqliteMaintenanceRepository.create({
    assetId: null,
    title: 'Clean gutters',
    recurring: false,
    intervalDays: null,
    dueDate: '2026-11-08',
    cost: null,
    notes: null,
  });

  expect(created.title).toBe('Clean gutters');
  expect(execute).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO maintenance_tasks'), [
    created.id,
    null,
    'Clean gutters',
    0,
    null,
    '2026-11-08',
    null,
    null,
    created.createdAt,
    created.updatedAt,
  ]);
});

test('complete logs a completion and does not change a one-time task', async () => {
  execute.mockResolvedValueOnce({ rows: [], rowsAffected: 1 }); // INSERT completion

  await sqliteMaintenanceRepository.complete(
    {
      id: 't1',
      assetId: null,
      title: 'Replace filter',
      recurring: false,
      intervalDays: null,
      dueDate: '2026-11-08',
      cost: 20,
      notes: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    '2026-11-08',
    20,
    null,
  );

  expect(execute).toHaveBeenCalledTimes(1);
  expect(execute).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO maintenance_completions'), expect.any(Array));
});

test('complete on a recurring task also advances the due date', async () => {
  execute.mockResolvedValueOnce({ rows: [], rowsAffected: 1 }); // INSERT completion
  execute.mockResolvedValueOnce({ rows: [], rowsAffected: 1 }); // UPDATE due_date

  await sqliteMaintenanceRepository.complete(
    {
      id: 't1',
      assetId: null,
      title: 'Clean gutters',
      recurring: true,
      intervalDays: 180,
      dueDate: '2026-11-08',
      cost: null,
      notes: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    '2026-11-08',
    null,
    null,
  );

  expect(execute).toHaveBeenCalledTimes(2);
  expect(execute).toHaveBeenLastCalledWith(expect.stringContaining('UPDATE maintenance_tasks SET due_date'), ['2027-05-07', expect.any(String), 't1']);
});
