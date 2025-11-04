import { TalentSource, TalentSearchParams, TalentSourceResult } from '../../types/integrations';
import { TalentProfile, TalentRole } from '../../types/talent';
import { getCached, setCached } from './base';
import sample from '../../data/integrations/discogs.json';
import { getLiveSourcesFlag, getApiBase } from '../featureFlags';

type DiscogsCredit = {
  release: string;
  year?: number;
  artist: string;
  name: string;
  role: string; // e.g., "Mixed By", "Producer"
  url?: string;
  genres?: string[];
};

const ROLE_MAP: Record<string, TalentRole | undefined> = {
  'producer': 'Producer',
  'mixed by': 'Mixer',
  'mastered by': 'Mastering Engineer',
  'recorded by': 'Recording Engineer',
  'engineer': 'Recording Engineer',
};

function mapCredit(c: DiscogsCredit): TalentProfile | undefined {
  const roleKey = c.role.trim().toLowerCase();
  const mapped = ROLE_MAP[roleKey];
  if (!mapped) return undefined;
  return {
    id: `discogs-${c.name}-${c.release}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 32),
    name: c.name,
    roles: [mapped],
    genres: c.genres && c.genres.length ? c.genres : ['Various'],
    remote: true,
    blurb: `Credited as ${mapped} on ${c.release}${c.year ? ` (${c.year})` : ''}`,
    portfolio: c.url ? [{ platform: 'Other', url: c.url }] : [],
  };
}

async function searchDiscogs(params: TalentSearchParams): Promise<TalentSourceResult> {
  if (getLiveSourcesFlag()) {
    try {
      const base = getApiBase();
      const url = new URL(`${base.replace(/\/$/, '')}/discogs/credits`, base.startsWith('http') ? undefined : window.location.origin);
      if (params.referenceArtist) url.searchParams.set('artist', params.referenceArtist);
      if (params.referenceRelease) url.searchParams.set('release', params.referenceRelease);
      const res = await fetch(url.toString());
      if (res.ok) {
        const credits = await res.json() as DiscogsCredit[];
        const items = credits.map(mapCredit).filter(Boolean) as TalentProfile[];
        return { source: 'discogs', items };
      }
    } catch {
      // fall back to cache/sample
    }
  }
  const cached = await getCached('discogs', params);
  if (cached) return { ...cached, cached: true };

  // For now, use sample data filtered by reference artist or release
  const credits = (sample as DiscogsCredit[]).filter(c => {
    const q = (params.referenceArtist || params.referenceRelease || '').toLowerCase();
    if (!q) return true;
    return c.artist.toLowerCase().includes(q) || c.release.toLowerCase().includes(q);
  });
  const items = credits.map(mapCredit).filter(Boolean) as TalentProfile[];
  const result: TalentSourceResult = { source: 'discogs', items };
  await setCached(result, params);
  return result;
}

const discogsSource: TalentSource = {
  id: 'discogs',
  label: 'Discogs (credits)',
  search: searchDiscogs,
};

export default discogsSource;
