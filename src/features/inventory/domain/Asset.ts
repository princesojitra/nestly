export const ASSET_CATEGORIES = ['Appliances', 'Electronics', 'Furniture', 'HVAC', 'Outdoor', 'Other'] as const;
export type AssetCategory = (typeof ASSET_CATEGORIES)[number];

export type Asset = {
  id: string;
  name: string;
  category: AssetCategory;
  purchaseDate: string | null;
  price: number | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type NewAsset = {
  name: string;
  category: AssetCategory;
  purchaseDate: string | null;
  price: number | null;
  description: string | null;
};
