import { z } from 'zod';
import type { NewMaintenanceTask } from '../domain/Maintenance';

export const maintenanceFormSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required'),
    assetId: z.string(),
    recurring: z.boolean(),
    intervalDays: z
      .string()
      .trim()
      .refine((v) => v === '' || (!Number.isNaN(Number(v)) && Number(v) > 0), 'Enter a number of days'),
    dueDate: z
      .string()
      .trim()
      .refine((v) => /^\d{4}-\d{2}-\d{2}$/.test(v), 'Use YYYY-MM-DD'),
    cost: z
      .string()
      .trim()
      .refine((v) => v === '' || !Number.isNaN(Number(v)), 'Enter a number'),
    notes: z.string().trim(),
  })
  .refine((data) => !data.recurring || data.intervalDays !== '', {
    message: 'Recurring tasks need a repeat interval',
    path: ['intervalDays'],
  });

export type MaintenanceFormValues = z.infer<typeof maintenanceFormSchema>;

export function toNewMaintenanceTask(values: MaintenanceFormValues): NewMaintenanceTask {
  return {
    assetId: values.assetId || null,
    title: values.title,
    recurring: values.recurring,
    intervalDays: values.recurring && values.intervalDays ? Number(values.intervalDays) : null,
    dueDate: values.dueDate,
    cost: values.cost ? Number(values.cost) : null,
    notes: values.notes || null,
  };
}
