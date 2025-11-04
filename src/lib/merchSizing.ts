export type SizeKey = 'XS'|'S'|'M'|'L'|'XL'|'XXL';

const DEFAULT_PROPORTIONS: Record<SizeKey, number> = {
  XS: 0.05,
  S: 0.18,
  M: 0.30,
  L: 0.28,
  XL: 0.14,
  XXL: 0.05,
};

export function defaultSizeBreakdown(total: number): Record<SizeKey, number> {
  const base: Record<SizeKey, number> = { XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0 };
  const entries = Object.entries(DEFAULT_PROPORTIONS) as [SizeKey, number][];
  let assigned = 0;
  for (let i = 0; i < entries.length; i++) {
    const [k, p] = entries[i];
    // Use floor for all except the last; remainder to last
    if (i < entries.length - 1) {
      const v = Math.max(0, Math.floor(total * p));
      base[k] = v; assigned += v;
    } else {
      base[k] = Math.max(0, total - assigned);
    }
  }
  return base;
}

export function rebalanceBreakdown(breakdown: Partial<Record<SizeKey, number>>, total: number): Record<SizeKey, number> {
  // Convert to positive numbers and compute proportions
  const keys: SizeKey[] = ['XS','S','M','L','XL','XXL'];
  const values = keys.map(k => Math.max(0, Math.floor(breakdown[k] ?? 0)));
  const sum = values.reduce((a,b)=>a+b,0);
  if (sum <= 0) return defaultSizeBreakdown(total);
  // Scale to total and distribute rounding remainder
  const scaled = values.map(v => Math.floor((v / sum) * total));
  let assigned = scaled.reduce((a,b)=>a+b,0);
  let idx = 0;
  while (assigned < total) {
    scaled[idx % scaled.length] += 1;
    assigned += 1; idx += 1;
  }
  const out: Record<SizeKey, number> = { XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0 };
  keys.forEach((k, i) => { out[k] = scaled[i]; });
  return out;
}
