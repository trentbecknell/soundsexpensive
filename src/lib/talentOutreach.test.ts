import { describe, it, expect } from 'vitest';
import { generateOutreachBrief } from './talentOutreach';
import { ArtistProfile, ProjectConfig } from '../App';
import { TalentProfile } from '../types/talent';
import type { TesterContact } from '../types/tester';

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

  it('includes tester contact when provided', () => {
    const contact: TesterContact = { name: 'Tester', email: 'tester@example.com', instagram: '@testmusic', website: 'testmusic.com', city: 'LA' };
    const brief = generateOutreachBrief(artist, project, 'Producer', undefined, contact);
    expect(brief.message).toContain('Contact me:');
    expect(brief.message).toContain('tester@example.com');
    expect(brief.message).toContain('instagram.com/testmusic');
    expect(brief.message.toLowerCase()).toContain('testmusic.com');
  });
});
