import { maintenanceFormSchema, toNewMaintenanceTask } from '../maintenanceSchema';

const base = { title: 'Clean gutters', assetId: '', recurring: false, intervalDays: '', dueDate: '2026-11-08', cost: '', notes: '' };

test('requires a title', () => {
  const result = maintenanceFormSchema.safeParse({ ...base, title: '' });
  expect(result.success).toBe(false);
});

test('rejects a malformed due date', () => {
  const result = maintenanceFormSchema.safeParse({ ...base, dueDate: '08/11/2026' });
  expect(result.success).toBe(false);
});

test('recurring tasks require an interval', () => {
  const result = maintenanceFormSchema.safeParse({ ...base, recurring: true, intervalDays: '' });
  expect(result.success).toBe(false);
});

test('accepts a valid recurring task', () => {
  const result = maintenanceFormSchema.safeParse({ ...base, recurring: true, intervalDays: '180' });
  expect(result.success).toBe(true);
});

test('toNewMaintenanceTask converts a one-time task, nulling unused fields', () => {
  const result = maintenanceFormSchema.safeParse(base);
  expect(result.success).toBe(true);
  if (result.success) {
    expect(toNewMaintenanceTask(result.data)).toEqual({
      assetId: null,
      title: 'Clean gutters',
      recurring: false,
      intervalDays: null,
      dueDate: '2026-11-08',
      cost: null,
      notes: null,
    });
  }
});

test('toNewMaintenanceTask keeps intervalDays only when recurring', () => {
  const result = maintenanceFormSchema.safeParse({ ...base, recurring: true, intervalDays: '90', assetId: 'a1', cost: '42', notes: 'be careful' });
  expect(result.success).toBe(true);
  if (result.success) {
    expect(toNewMaintenanceTask(result.data)).toEqual({
      assetId: 'a1',
      title: 'Clean gutters',
      recurring: true,
      intervalDays: 90,
      dueDate: '2026-11-08',
      cost: 42,
      notes: 'be careful',
    });
  }
});
