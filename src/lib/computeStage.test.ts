import { describe, it, expect } from 'vitest';
import computeStageFromScores from './computeStage';

describe('computeStageFromScores', () => {
  it('returns Emerging for low averages', () => {
    const scores = { craft: 1, catalog: 1, brand: 1, team: 1, audience: 1, ops: 1 };
    expect(computeStageFromScores(scores)).toBe('Emerging');
  });

  it('returns Developing for averages between 2 and <3', () => {
    const scores = { craft: 2, catalog: 2, brand: 2, team: 2, audience: 2, ops: 2 };
    expect(computeStageFromScores(scores)).toBe('Developing');
  });

  it('returns Established for averages between 3 and <4', () => {
    const scores = { craft: 3, catalog: 3, brand: 3, team: 3, audience: 3, ops: 3 };
    expect(computeStageFromScores(scores)).toBe('Established');
  });

  it('returns Breakout for averages >=4', () => {
    const scores = { craft: 5, catalog: 4, brand: 4, team: 4, audience: 4, ops: 4 };
    expect(computeStageFromScores(scores)).toBe('Breakout');
  });

  it('handles mixed scores correctly', () => {
    const scores = { craft: 1, catalog: 3, brand: 4, team: 2, audience: 5, ops: 3 };
    // average = (1+3+4+2+5+3)/6 = 3
    expect(computeStageFromScores(scores)).toBe('Established');
  });
});
