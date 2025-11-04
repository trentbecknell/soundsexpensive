import { describe, it, expect } from 'vitest';
import { defaultSizeBreakdown, rebalanceBreakdown } from './merchSizing';

describe('merchSizing', () => {
  it('default breakdown sums to total', () => {
    const b = defaultSizeBreakdown(137);
    expect(Object.values(b).reduce((a,b)=>a+b,0)).toBe(137);
  });
  it('rebalance scales arbitrary mix to total', () => {
    const b = rebalanceBreakdown({ XS: 1, S: 2, M: 3, L: 4, XL: 1, XXL: 0 }, 99);
    expect(Object.values(b).reduce((a,b)=>a+b,0)).toBe(99);
  });
});
