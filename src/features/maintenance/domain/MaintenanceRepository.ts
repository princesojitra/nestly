import type { MaintenanceCompletion, MaintenanceTask, NewMaintenanceTask } from './Maintenance';

export type MaintenanceRepository = {
  list: () => Promise<MaintenanceTask[]>;
  get: (id: string) => Promise<MaintenanceTask | null>;
  create: (task: NewMaintenanceTask) => Promise<MaintenanceTask>;
  update: (id: string, task: NewMaintenanceTask) => Promise<MaintenanceTask>;
  remove: (id: string) => Promise<void>;
  listCompletions: (taskId: string) => Promise<MaintenanceCompletion[]>;
  // Logs a completion and, for recurring tasks, advances the task's due date.
  complete: (task: MaintenanceTask, completedAt: string, cost: number | null, notes: string | null) => Promise<void>;
};
