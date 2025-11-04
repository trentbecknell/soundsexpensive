import { describe, it, expect } from 'vitest';
import { inferMerchPlan } from './merchRecommender';
import type { ArtistProfile, ProjectConfig } from '../App';

const profile: ArtistProfile = {
  artistName: 'Test Artist',
  genres: 'Indie Rock',
  city: 'Toronto, ON',
  elevatorPitch: 'Test',
  stage: 'Emerging',
  stageScores: { craft: 2, catalog: 2, brand: 2, team: 1, audience: 1, ops: 1 }
};

const project: ProjectConfig = {
  projectType: 'EP',
  units: 4,
  startWeeks: 0,
  targetWeeks: 16,
  hasGrant: false,
  grantAmount: 0,
  targetMarkets: ['DSP','Live']
};

describe('inferMerchPlan', () => {
  it('proposes a reasonable set with totals', () => {
    const plan = inferMerchPlan(profile, project, 150);
    expect(plan.items.length).toBeGreaterThanOrEqual(3);
    // Contains T-Shirt and Sticker Pack at minimum
    const cats = plan.items.map(i => i.category);
    expect(cats).toContain('T-Shirt');
    expect(cats).toContain('Sticker Pack');
    // Totals computed
    expect(plan.estBudgetUSD).toBeGreaterThan(0);
    for (const it of plan.items) {
      if (it.targetUnitCostUSD) {
        expect(it.estTotalCostUSD).toBe(Math.round(it.targetUnitCostUSD * it.quantity));
      }
    }
  });
});
