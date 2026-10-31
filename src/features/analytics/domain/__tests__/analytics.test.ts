import { categoryBreakdown, monthlyTrend, purchaseVsMaintenanceSplit, totalForMonth } from '../analytics';
import type { Asset } from '../../../inventory/domain/Asset';
import type { MaintenanceCompletion } from '../../../maintenance/domain/Maintenance';

function asset(overrides: Partial<Asset>): Asset {
  return {
    id: 'a',
    name: 'Asset',
    category: 'Appliances',
    purchaseDate: null,
    price: null,
    description: null,
    createdAt: '',
    updatedAt: '',
    ...overrides,
  };
}

function completion(overrides: Partial<MaintenanceCompletion>): MaintenanceCompletion {
  return { id: 'c', taskId: 't', completedAt: '2026-06-01', cost: null, notes: null, ...overrides };
}

test('totalForMonth sums purchases and maintenance in that month only', () => {
  const assets = [asset({ purchaseDate: '2026-06-14', price: 2400 }), asset({ purchaseDate: '2026-05-01', price: 100 })];
  const completions = [completion({ completedAt: '2026-06-20', cost: 42 }), completion({ completedAt: '2026-05-20', cost: 10 })];

  expect(totalForMonth(assets, completions, '2026-06')).toBe(2442);
});

test('categoryBreakdown groups and sorts by total descending', () => {
  const assets = [
    asset({ category: 'Appliances', price: 100 }),
    asset({ category: 'Furniture', price: 500 }),
    asset({ category: 'Appliances', price: 300 }),
  ];

  expect(categoryBreakdown(assets)).toEqual([
    { category: 'Appliances', total: 400 },
    { category: 'Furniture', total: 500 },
  ].sort((a, b) => b.total - a.total));
});

test('categoryBreakdown ignores assets with no price', () => {
  const assets = [asset({ category: 'Appliances', price: null })];
  expect(categoryBreakdown(assets)).toEqual([]);
});

test('purchaseVsMaintenanceSplit sums both buckets independently', () => {
  const assets = [asset({ price: 100 }), asset({ price: 50 })];
  const completions = [completion({ cost: 20 })];

  expect(purchaseVsMaintenanceSplit(assets, completions)).toEqual({ purchases: 150, maintenance: 20 });
});

test('monthlyTrend returns the requested number of points ending at the current month', () => {
  const now = new Date('2026-06-15');
  const trend = monthlyTrend([], [], 3, now);

  expect(trend.map((p) => p.month)).toEqual(['2026-04', '2026-05', '2026-06']);
});
