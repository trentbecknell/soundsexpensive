import { describe, it, expect } from 'vitest';
import { inferTalentNeeds, recommendTalent } from './talentRecommender';
import { TALENT_DIRECTORY } from '../data/talent';
import { ArtistProfile, ProjectConfig, BudgetItem } from '../App';

const profile: ArtistProfile = {
  artistName: 'Test Artist',
  genres: 'Pop, R&B',
  city: 'LA',
  elevatorPitch: '',
  stage: 'Emerging',
  stageScores: { craft: 3, catalog: 3, brand: 2, team: 1, audience: 2, ops: 2 }
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

const budget: BudgetItem[] = [
  { id: '1', category: 'Mixing', description: '', qty: 4, unitCost: 300, phase: 'Post‑Production', required: true },
  { id: '2', category: 'Mastering', description: '', qty: 4, unitCost: 100, phase: 'Post‑Production', required: true },
];

describe('talentRecommender', () => {
  it('infers sensible talent needs', () => {
    const needs = inferTalentNeeds(profile, project, budget);
    const roles = needs.map(n => n.role);
    expect(roles).toContain('Producer');
    expect(roles).toContain('Mixer');
    expect(roles).toContain('Mastering Engineer');
    expect(roles).toContain('Recording Engineer');
    expect(needs.find(n => n.role === 'Mixer')?.count).toBe(4);
  });

  it('recommends top candidates by role', () => {
    const needs = inferTalentNeeds(profile, project, budget);
    const rec = recommendTalent(TALENT_DIRECTORY, needs, profile, project, 500);
    expect(Object.keys(rec).length).toBeGreaterThan(0);
    // Ensure each role has candidates
    for (const role of Object.keys(rec)) {
      expect(rec[role as keyof typeof rec].length).toBeGreaterThan(0);
    }
  });
});
