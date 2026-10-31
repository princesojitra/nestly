import { z } from 'zod';

const dateField = z
  .string()
  .trim()
  .refine((v) => /^\d{4}-\d{2}-\d{2}$/.test(v), 'Use YYYY-MM-DD');

export const warrantyFormSchema = z
  .object({
    provider: z.string().trim().min(1, 'Provider is required'),
    startDate: dateField,
    endDate: dateField,
  })
  .refine((data) => new Date(data.endDate).getTime() > new Date(data.startDate).getTime(), {
    message: 'Expiry must be after the start date',
    path: ['endDate'],
  });

export type WarrantyFormValues = z.infer<typeof warrantyFormSchema>;
