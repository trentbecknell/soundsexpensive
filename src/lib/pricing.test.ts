import { describe, it, expect } from 'vitest';
import { priceForMargin } from './pricing';

describe('pricing', () => {
  it('computes price for desired margin', () => {
    const c = 10;
    const p50 = priceForMargin(c, 0.5);
    expect(p50).toBeGreaterThanOrEqual(20);
    const p20 = priceForMargin(c, 0.2);
    expect(p20).toBeGreaterThanOrEqual(13); // 12.5 rounded and 5% guard
  });
});
