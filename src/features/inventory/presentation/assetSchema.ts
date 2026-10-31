import { z } from 'zod';
import type { NewAsset, AssetCategory } from '../domain/Asset';

export const assetFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  category: z.string().min(1, 'Pick a category'),
  purchaseDate: z
    .string()
    .trim()
    .refine((v) => v === '' || /^\d{4}-\d{2}-\d{2}$/.test(v), 'Use YYYY-MM-DD'),
  price: z
    .string()
    .trim()
    .refine((v) => v === '' || !Number.isNaN(Number(v)), 'Enter a number'),
  description: z.string().trim(),
});

export type AssetFormValues = z.infer<typeof assetFormSchema>;

export function toNewAsset(values: AssetFormValues): NewAsset {
  return {
    name: values.name,
    category: values.category as AssetCategory,
    purchaseDate: values.purchaseDate || null,
    price: values.price ? Number(values.price) : null,
    description: values.description || null,
  };
}
