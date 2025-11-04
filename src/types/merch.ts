export type MerchCategory = 'T-Shirt' | 'Hoodie' | 'Hat' | 'Sticker Pack' | 'Tote' | 'Poster' | 'Vinyl' | 'CD';

export type PrintMethod = 'Screen Print' | 'DTG' | 'Embroidery' | 'Sublimation' | 'Sticker Die-Cut' | 'Vinyl Pressing' | 'CD Duplication';

export interface MerchVendor {
  id: string;
  name: string;
  methods: PrintMethod[];
  categories: MerchCategory[];
  location?: string;
  minOrder?: number;
  avgLeadDays?: number;
  dropship?: boolean;
  ecoOptions?: boolean;
  url: string;
}

export interface MerchCatalogItem {
  category: MerchCategory;
  defaultMethod: PrintMethod;
  baseCostRangeUSD: [number, number]; // per unit for apparel; per piece for printables
  notes?: string;
}

export interface MerchItemPlan {
  id: string;
  category: MerchCategory;
  method: PrintMethod;
  quantity: number;
  sizeBreakdown?: Record<'XS'|'S'|'M'|'L'|'XL'|'XXL', number>; // apparel only
  colorways?: number; // apparel variants
  targetUnitCostUSD?: number;
  estTotalCostUSD?: number;
  sellPriceUSD?: number; // expected sell price per unit
  preferredVendorId?: string; // lock a vendor to reflect MOQ/lead/methods
}

export interface MerchPlan {
  items: MerchItemPlan[];
  estBudgetUSD: number;
}
