import { assetFormSchema, toNewAsset } from '../assetSchema';

test('requires a name and a category', () => {
  const result = assetFormSchema.safeParse({ name: '', category: '', purchaseDate: '', price: '', description: '' });
  expect(result.success).toBe(false);
});

test('rejects a malformed purchase date', () => {
  const result = assetFormSchema.safeParse({
    name: 'Fridge',
    category: 'Appliances',
    purchaseDate: '14/06/2024',
    price: '',
    description: '',
  });
  expect(result.success).toBe(false);
});

test('rejects a non-numeric price', () => {
  const result = assetFormSchema.safeParse({
    name: 'Fridge',
    category: 'Appliances',
    purchaseDate: '',
    price: 'free',
    description: '',
  });
  expect(result.success).toBe(false);
});

test('accepts the minimum required fields, leaving optional fields null', () => {
  const result = assetFormSchema.safeParse({
    name: 'Fridge',
    category: 'Appliances',
    purchaseDate: '',
    price: '',
    description: '',
  });
  expect(result.success).toBe(true);
  if (result.success) {
    expect(toNewAsset(result.data)).toEqual({
      name: 'Fridge',
      category: 'Appliances',
      purchaseDate: null,
      price: null,
      description: null,
    });
  }
});

test('converts a fully filled form into a NewAsset', () => {
  const result = assetFormSchema.safeParse({
    name: 'Fridge',
    category: 'Appliances',
    purchaseDate: '2024-06-14',
    price: '2400',
    description: 'French door',
  });
  expect(result.success).toBe(true);
  if (result.success) {
    expect(toNewAsset(result.data)).toEqual({
      name: 'Fridge',
      category: 'Appliances',
      purchaseDate: '2024-06-14',
      price: 2400,
      description: 'French door',
    });
  }
});
