import { TalentSource, TalentSearchParams, TalentSourceResult } from '../../types/integrations';
import { TalentProfile, TalentRole } from '../../types/talent';
import { getCached, setCached } from './base';
import sample from '../../data/integrations/musicbrainz.json';
import { getLiveSourcesFlag, getApiBase } from '../featureFlags';

type MBCredit = {
  release: string;
  year?: number;
  name: string;
  relation: string; // e.g., "mix engineer", "producer"
  url?: string;
  genres?: string[];
};

function mapRole(rel: string): TalentRole | undefined {
  const k = rel.trim().toLowerCase();
  if (k.includes('mix')) return 'Mixer';
  if (k.includes('master')) return 'Mastering Engineer';
  if (k.includes('producer')) return 'Producer';
  if (k.includes('engineer') || k.includes('record')) return 'Recording Engineer';
  return undefined;
}

function mapCredit(c: MBCredit): TalentProfile | undefined {
  const role = mapRole(c.relation);
  if (!role) return undefined;
  return {
    id: `mb-${c.name}-${c.release}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 32),
    name: c.name,
    roles: [role],
    genres: c.genres && c.genres.length ? c.genres : ['Various'],
    remote: true,
    blurb: `Credit: ${role} on ${c.release}${c.year ? ` (${c.year})` : ''}`,
    portfolio: c.url ? [{ platform: 'Other', url: c.url }] : [],
  };
}

async function searchMB(params: TalentSearchParams): Promise<TalentSourceResult> {
  if (getLiveSourcesFlag()) {
    try {
      const base = getApiBase();
      const url = new URL(`${base.replace(/\/$/, '')}/musicbrainz/credits`, base.startsWith('http') ? undefined : window.location.origin);
      if (params.referenceArtist) url.searchParams.set('artist', params.referenceArtist);
      if (params.referenceRelease) url.searchParams.set('release', params.referenceRelease);
      const res = await fetch(url.toString());
      if (res.ok) {
        const credits = await res.json() as MBCredit[];
        const items = credits.map(mapCredit).filter(Boolean) as TalentProfile[];
        return { source: 'musicbrainz', items };
      }
    } catch {
      // fallback
    }
  }
  const cached = await getCached('musicbrainz', params);
  if (cached) return { ...cached, cached: true };
  const q = (params.referenceArtist || params.referenceRelease || '').toLowerCase();
  const credits = (sample as MBCredit[]).filter(c => !q || c.release.toLowerCase().includes(q) || c.name.toLowerCase().includes(q));
  const items = credits.map(mapCredit).filter(Boolean) as TalentProfile[];
  const result: TalentSourceResult = { source: 'musicbrainz', items };
  await setCached(result, params);
  return result;
}

const musicbrainzSource: TalentSource = {
  id: 'musicbrainz',
  label: 'MusicBrainz (credits)',
  search: searchMB,
};

export default musicbrainzSource;
