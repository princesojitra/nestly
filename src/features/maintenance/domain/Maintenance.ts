export type MaintenanceTask = {
  id: string;
  assetId: string | null;
  title: string;
  recurring: boolean;
  intervalDays: number | null;
  dueDate: string;
  cost: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type NewMaintenanceTask = {
  assetId: string | null;
  title: string;
  recurring: boolean;
  intervalDays: number | null;
  dueDate: string;
  cost: number | null;
  notes: string | null;
};

export type MaintenanceCompletion = {
  id: string;
  taskId: string;
  completedAt: string;
  cost: number | null;
  notes: string | null;
};

export function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function isOverdue(dueDate: string, now: Date = new Date()): boolean {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  return new Date(dueDate).getTime() < today.getTime();
}
