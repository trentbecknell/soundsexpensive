import { describe, it, expect } from 'vitest';
import { generateOutreachBrief } from './talentOutreach';
import { ArtistProfile, ProjectConfig } from '../App';
import { TalentProfile } from '../types/talent';

const artist: ArtistProfile = {
  artistName: 'Nova',
  genres: 'Pop',
  city: 'NYC',
  elevatorPitch: '',
  stage: 'Emerging',
  stageScores: { craft: 3, catalog: 2, brand: 2, team: 1, audience: 1, ops: 1 }
};

const project: ProjectConfig = {
  projectType: 'EP',
  units: 4,
  startWeeks: 0,
  targetWeeks: 16,
  hasGrant: false,
  grantAmount: 0,
  targetMarkets: ['DSP']
};

describe('talentOutreach', () => {
  it('generates a clear outreach brief', () => {
    const brief = generateOutreachBrief(artist, project, 'Mixer');
    expect(brief.subject).toContain('Nova');
    expect(brief.subject.toLowerCase()).toContain('mixer');
    expect(brief.message).toContain('We\'re looking for a Mixer');
  });
});
