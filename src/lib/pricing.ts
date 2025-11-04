export function priceForMargin(unitCost: number, marginPct: number): number {
  // marginPct as 0..1; ensure < 1
  const m = Math.max(0, Math.min(0.95, marginPct));
  if (unitCost <= 0) return 0;
  // p = c / (1 - m)
  const p = unitCost / (1 - m);
  // Round to nearest dollar for clarity
  return Math.max(unitCost * 1.05, Math.round(p));
}

export const DEFAULT_SELL_PRICE_BY_CATEGORY: Record<string, number> = {
  'T-Shirt': 30,
  'Hoodie': 55,
  'Hat': 25,
  'Sticker Pack': 5,
  'Tote': 15,
  'Poster': 20,
  'Vinyl': 30,
  'CD': 10,
};
