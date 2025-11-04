import { TalentProfile } from './talent';

export type ExternalTalentSourceId = 'discogs' | 'musicbrainz' | 'bandsintown';

export interface TalentSearchParams {
  referenceArtist?: string;
  referenceRelease?: string;
  genre?: string;
  city?: string; // for live
}

export interface TalentSourceResult {
  source: ExternalTalentSourceId;
  items: TalentProfile[];
  cached?: boolean;
}

export interface TalentSource {
  id: ExternalTalentSourceId;
  label: string;
  search: (params: TalentSearchParams) => Promise<TalentSourceResult>;
}
