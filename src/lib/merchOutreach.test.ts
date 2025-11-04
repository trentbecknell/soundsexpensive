import { describe, it, expect } from 'vitest';
import { generateMerchQuoteRequest } from './merchOutreach';
import type { ArtistProfile, ProjectConfig } from '../App';

const artist: ArtistProfile = {
  artistName: 'Tester',
  genres: 'Pop',
  city: 'NYC',
  elevatorPitch: '',
  stage: 'Emerging',
  stageScores: { craft: 2, catalog: 2, brand: 2, team: 1, audience: 1, ops: 1 },
};

const project: ProjectConfig = {
  projectType: 'Album',
  units: 10,
  startWeeks: 0,
  targetWeeks: 24,
  hasGrant: false,
  grantAmount: 0,
  targetMarkets: ['Live']
};

describe('generateMerchQuoteRequest', () => {
  it('creates a detailed request with contact footer', () => {
    const item = {
      id: 'x', category: 'T-Shirt' as const, method: 'Screen Print' as const, quantity: 100, colorways: 2, targetUnitCostUSD: 8.5
    };
    const { subject, message } = generateMerchQuoteRequest(artist, project, item, 'Vendor', {
      name: 'QA', email: 'qa@example.com', instagram: '@qa', website: 'site.com'
    });
    expect(subject).toContain('Quote request for T-Shirt');
    expect(message).toContain('Quantity: 100');
    expect(message).toContain('Colorways: 2');
    expect(message).toContain('https://instagram.com/qa');
    expect(message).toContain('https://site.com');
  });
});
