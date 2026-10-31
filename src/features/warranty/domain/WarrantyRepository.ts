import type { NewWarranty, Warranty } from './Warranty';

export type WarrantyRepository = {
  getForAsset: (assetId: string) => Promise<Warranty | null>;
  upsert: (warranty: NewWarranty) => Promise<Warranty>;
  remove: (assetId: string) => Promise<void>;
};
