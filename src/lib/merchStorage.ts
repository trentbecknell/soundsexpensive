import type { MerchItemPlan } from '../types/merch';

const KEY_PREFIX = 'ar-merch-plan-v1';

function makeKey(artistName?: string, projectKey?: string) {
  const a = (artistName || 'Unnamed').trim() || 'Unnamed';
  const p = projectKey || 'default';
  return `${KEY_PREFIX}::${a}::${p}`;
}

export function loadMerchPlan(artistName?: string, projectKey?: string): MerchItemPlan[] | undefined {
  try {
    const raw = localStorage.getItem(makeKey(artistName, projectKey));
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return undefined;
    return parsed as MerchItemPlan[];
  } catch {
    return undefined;
  }
}

export function saveMerchPlan(items: MerchItemPlan[], artistName?: string, projectKey?: string): void {
  try {
    localStorage.setItem(makeKey(artistName, projectKey), JSON.stringify(items));
  } catch (e) {
    console.warn('Failed to save merch plan', e);
  }
}

export function clearMerchPlan(artistName?: string, projectKey?: string): void {
  try {
    localStorage.removeItem(makeKey(artistName, projectKey));
  } catch {}
}
