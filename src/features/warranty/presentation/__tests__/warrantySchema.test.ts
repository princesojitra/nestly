import { warrantyFormSchema } from '../warrantySchema';

test('requires a provider', () => {
  const result = warrantyFormSchema.safeParse({ provider: '', startDate: '2024-06-14', endDate: '2027-06-14' });
  expect(result.success).toBe(false);
});

test('rejects a malformed date', () => {
  const result = warrantyFormSchema.safeParse({ provider: 'Samsung', startDate: '14/06/2024', endDate: '2027-06-14' });
  expect(result.success).toBe(false);
});

test('rejects an end date before the start date', () => {
  const result = warrantyFormSchema.safeParse({ provider: 'Samsung', startDate: '2027-06-14', endDate: '2024-06-14' });
  expect(result.success).toBe(false);
});

test('accepts a valid warranty', () => {
  const result = warrantyFormSchema.safeParse({ provider: 'Samsung', startDate: '2024-06-14', endDate: '2027-06-14' });
  expect(result.success).toBe(true);
});
