import type { Asset } from '../../inventory/domain/Asset';
import type { MaintenanceCompletion } from '../../maintenance/domain/Maintenance';

export type CategoryTotal = { category: string; total: number };
export type MonthlyPoint = { month: string; total: number };

function monthKey(dateStr: string): string {
  return dateStr.slice(0, 7); // 'YYYY-MM'
}

export function totalForMonth(assets: Asset[], completions: MaintenanceCompletion[], month: string): number {
  const purchases = assets.filter((a) => a.purchaseDate && monthKey(a.purchaseDate) === month).reduce((sum, a) => sum + (a.price ?? 0), 0);
  const maintenance = completions.filter((c) => monthKey(c.completedAt) === month).reduce((sum, c) => sum + (c.cost ?? 0), 0);
  return purchases + maintenance;
}

export function categoryBreakdown(assets: Asset[]): CategoryTotal[] {
  const totals = new Map<string, number>();
  assets.forEach((a) => {
    if (a.price == null) return;
    totals.set(a.category, (totals.get(a.category) ?? 0) + a.price);
  });
  return [...totals.entries()].map(([category, total]) => ({ category, total })).sort((a, b) => b.total - a.total);
}

export function purchaseVsMaintenanceSplit(assets: Asset[], completions: MaintenanceCompletion[]): { purchases: number; maintenance: number } {
  const purchases = assets.reduce((sum, a) => sum + (a.price ?? 0), 0);
  const maintenance = completions.reduce((sum, c) => sum + (c.cost ?? 0), 0);
  return { purchases, maintenance };
}

// Trailing `months` months, oldest first, ending with the current month.
export function monthlyTrend(assets: Asset[], completions: MaintenanceCompletion[], months: number, now: Date = new Date()): MonthlyPoint[] {
  const points: MonthlyPoint[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    points.push({ month, total: totalForMonth(assets, completions, month) });
  }
  return points;
}
