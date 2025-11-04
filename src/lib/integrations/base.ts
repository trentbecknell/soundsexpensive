import { TalentSourceResult, TalentSearchParams, ExternalTalentSourceId } from '../../types/integrations';

const CACHE_PREFIX = 'ar-int-src-cache-v1';

function cacheKey(source: ExternalTalentSourceId, params: TalentSearchParams): string {
  return `${CACHE_PREFIX}:${source}:${JSON.stringify(params)}`;
}

export async function getCached(source: ExternalTalentSourceId, params: TalentSearchParams): Promise<TalentSourceResult | undefined> {
  try {
    const raw = localStorage.getItem(cacheKey(source, params));
    if (!raw) return undefined;
    return JSON.parse(raw) as TalentSourceResult;
  } catch {
    return undefined;
  }
}

export async function setCached(result: TalentSourceResult, params: TalentSearchParams): Promise<void> {
  try {
    localStorage.setItem(cacheKey(result.source, params), JSON.stringify(result));
  } catch {
    // ignore
  }
}
