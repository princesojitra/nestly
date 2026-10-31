import type { Asset, NewAsset } from './Asset';

export type AssetRepository = {
  list: () => Promise<Asset[]>;
  get: (id: string) => Promise<Asset | null>;
  create: (asset: NewAsset) => Promise<Asset>;
  update: (id: string, asset: NewAsset) => Promise<Asset>;
  remove: (id: string) => Promise<void>;
};
