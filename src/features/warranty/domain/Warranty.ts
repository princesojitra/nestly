export type Warranty = {
  assetId: string;
  provider: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
};

export type NewWarranty = {
  assetId: string;
  provider: string;
  startDate: string;
  endDate: string;
};

export type WarrantyStatus = 'active' | 'expiringSoon' | 'expired';

const EXPIRING_SOON_WINDOW_DAYS = 30;

export function getWarrantyStatus(endDate: string, now: Date = new Date()): WarrantyStatus {
  const daysLeft = (new Date(endDate).getTime() - now.getTime()) / 86_400_000;
  if (daysLeft < 0) return 'expired';
  if (daysLeft <= EXPIRING_SOON_WINDOW_DAYS) return 'expiringSoon';
  return 'active';
}

export function daysUntil(endDate: string, now: Date = new Date()): number {
  return Math.ceil((new Date(endDate).getTime() - now.getTime()) / 86_400_000);
}

export function warrantyProgress(startDate: string, endDate: string, now: Date = new Date()): number {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  if (end <= start) return 1;
  const fraction = (now.getTime() - start) / (end - start);
  return Math.min(1, Math.max(0, fraction));
}
