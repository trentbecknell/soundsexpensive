import { TalentSource, TalentSearchParams, TalentSourceResult } from '../../types/integrations';
import { TalentProfile } from '../../types/talent';
import { getCached, setCached } from './base';
import sample from '../../data/integrations/bandsintown.json';
import { getLiveSourcesFlag } from '../featureFlags';

type BITEvent = {
  artist: string;
  city: string;
  venue?: string;
  date?: string;
  url?: string;
  genres?: string[];
};

function eventToLiveTalent(e: BITEvent): TalentProfile {
  return {
    id: `bit-${e.artist}-${e.city}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 32),
    name: `${e.artist} — Live Musician`,
    roles: ['Live Musician'],
    genres: e.genres && e.genres.length ? e.genres : ['Live'],
    location: e.city,
    remote: false,
    blurb: `Active in ${e.city}${e.venue ? ` • ${e.venue}` : ''}${e.date ? ` • ${e.date}` : ''}`,
    portfolio: e.url ? [{ platform: 'Other', url: e.url }] : [],
  };
}

async function searchBIT(params: TalentSearchParams): Promise<TalentSourceResult> {
  if (getLiveSourcesFlag()) {
    try {
      const url = new URL('/api/bandsintown/events', window.location.origin);
      if (params.city) url.searchParams.set('city', params.city);
      if (params.referenceArtist) url.searchParams.set('artist', params.referenceArtist);
      const res = await fetch(url.toString());
      if (res.ok) {
        const events = await res.json() as BITEvent[];
        const items = events.map(eventToLiveTalent);
        return { source: 'bandsintown', items };
      }
    } catch {
      // fallback
    }
  }
  const cached = await getCached('bandsintown', params);
  if (cached) return { ...cached, cached: true };
  const cityQ = (params.city || '').toLowerCase();
  const items = (sample as BITEvent[])
    .filter(e => !cityQ || e.city.toLowerCase().includes(cityQ))
    .map(eventToLiveTalent);
  const result: TalentSourceResult = { source: 'bandsintown', items };
  await setCached(result, params);
  return result;
}

const bandsintownSource: TalentSource = {
  id: 'bandsintown',
  label: 'Bandsintown (events)',
  search: searchBIT,
};

export default bandsintownSource;
