import { describe, it, expect, beforeEach } from 'vitest';
import { loadMerchPlan, saveMerchPlan, clearMerchPlan } from './merchStorage';

const sample = [{ id: 'a', category: 'T-Shirt', method: 'Screen Print', quantity: 50, targetUnitCostUSD: 8, estTotalCostUSD: 400 }];

describe('merchStorage', () => {
  beforeEach(() => {
    clearMerchPlan('Tester','EP-3');
  });
  it('saves and loads by key parts', () => {
    expect(loadMerchPlan('Tester','EP-3')).toBeUndefined();
    saveMerchPlan(sample as any, 'Tester','EP-3');
    const loaded = loadMerchPlan('Tester','EP-3');
    expect(loaded?.[0]?.category).toBe('T-Shirt');
    clearMerchPlan('Tester','EP-3');
    expect(loadMerchPlan('Tester','EP-3')).toBeUndefined();
  });
});
