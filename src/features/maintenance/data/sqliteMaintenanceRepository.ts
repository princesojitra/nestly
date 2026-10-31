import { db } from '../../../core/database/db';
import { addDays } from '../domain/Maintenance';
import type { MaintenanceCompletion, MaintenanceTask, NewMaintenanceTask } from '../domain/Maintenance';
import type { MaintenanceRepository } from '../domain/MaintenanceRepository';

export async function ensureMaintenanceTables() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS maintenance_tasks (
      id TEXT PRIMARY KEY,
      asset_id TEXT REFERENCES assets(id) ON DELETE SET NULL,
      title TEXT NOT NULL,
      recurring INTEGER NOT NULL,
      interval_days INTEGER,
      due_date TEXT NOT NULL,
      cost REAL,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS maintenance_completions (
      id TEXT PRIMARY KEY,
      task_id TEXT NOT NULL REFERENCES maintenance_tasks(id) ON DELETE CASCADE,
      completed_at TEXT NOT NULL,
      cost REAL,
      notes TEXT
    );
  `);
}

// shortcut: see sqliteAssetRepository's generateId for why this isn't a real UUID.
function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function toTask(row: Record<string, unknown>): MaintenanceTask {
  return {
    id: row.id as string,
    assetId: (row.asset_id as string | null) ?? null,
    title: row.title as string,
    recurring: Boolean(row.recurring),
    intervalDays: (row.interval_days as number | null) ?? null,
    dueDate: row.due_date as string,
    cost: (row.cost as number | null) ?? null,
    notes: (row.notes as string | null) ?? null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function toCompletion(row: Record<string, unknown>): MaintenanceCompletion {
  return {
    id: row.id as string,
    taskId: row.task_id as string,
    completedAt: row.completed_at as string,
    cost: (row.cost as number | null) ?? null,
    notes: (row.notes as string | null) ?? null,
  };
}

export const sqliteMaintenanceRepository: MaintenanceRepository = {
  async list() {
    const { rows } = await db.execute('SELECT * FROM maintenance_tasks ORDER BY due_date ASC;');
    return rows.map(toTask);
  },

  async get(id) {
    const { rows } = await db.execute('SELECT * FROM maintenance_tasks WHERE id = ?;', [id]);
    return rows[0] ? toTask(rows[0]) : null;
  },

  async create(task: NewMaintenanceTask) {
    const id = generateId();
    const now = new Date().toISOString();
    await db.execute(
      `INSERT INTO maintenance_tasks (id, asset_id, title, recurring, interval_days, due_date, cost, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [id, task.assetId, task.title, task.recurring ? 1 : 0, task.intervalDays, task.dueDate, task.cost, task.notes, now, now],
    );
    return { id, createdAt: now, updatedAt: now, ...task };
  },

  async update(id, task: NewMaintenanceTask) {
    const now = new Date().toISOString();
    await db.execute(
      `UPDATE maintenance_tasks SET asset_id = ?, title = ?, recurring = ?, interval_days = ?, due_date = ?, cost = ?, notes = ?, updated_at = ?
       WHERE id = ?;`,
      [task.assetId, task.title, task.recurring ? 1 : 0, task.intervalDays, task.dueDate, task.cost, task.notes, now, id],
    );
    const updated = await sqliteMaintenanceRepository.get(id);
    if (!updated) throw new Error('Maintenance task not found after update');
    return updated;
  },

  async remove(id) {
    await db.execute('DELETE FROM maintenance_tasks WHERE id = ?;', [id]);
  },

  async listCompletions(taskId) {
    const { rows } = await db.execute('SELECT * FROM maintenance_completions WHERE task_id = ? ORDER BY completed_at DESC;', [taskId]);
    return rows.map(toCompletion);
  },

  async listAllCompletions() {
    const { rows } = await db.execute('SELECT * FROM maintenance_completions ORDER BY completed_at DESC;');
    return rows.map(toCompletion);
  },

  async complete(task, completedAt, cost, notes) {
    await db.execute('INSERT INTO maintenance_completions (id, task_id, completed_at, cost, notes) VALUES (?, ?, ?, ?, ?);', [
      generateId(),
      task.id,
      completedAt,
      cost,
      notes,
    ]);
    if (task.recurring && task.intervalDays) {
      const nextDueDate = addDays(completedAt, task.intervalDays);
      await db.execute('UPDATE maintenance_tasks SET due_date = ?, updated_at = ? WHERE id = ?;', [nextDueDate, new Date().toISOString(), task.id]);
    }
  },
};
