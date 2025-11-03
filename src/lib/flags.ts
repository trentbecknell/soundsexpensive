/**
 * Simple feature flags helper.
 * - URL support: ?flags=a,b,c (comma-separated)
 * - Persist to localStorage under 'artist-flags'
 */
export type Flag = 'perf-slice';

const LS_KEY = 'artist-flags';

export function getFlags(): Set<Flag> {
  const s = new Set<Flag>();
  try {
    const search = window.location.search || '';
    const hash = window.location.hash || '';
    const hashQuery = hash.includes('?') ? hash.substring(hash.indexOf('?')) : '';
    const m = /[?&]flags=([^&#]+)/.exec(search) || /[?&]flags=([^&#]+)/.exec(hashQuery);
    if (m) {
      const arr = decodeURIComponent(m[1]).split(',').map(v => v.trim()).filter(Boolean) as Flag[];
      arr.forEach(f => s.add(f));
      localStorage.setItem(LS_KEY, JSON.stringify(Array.from(s)));
    } else {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) JSON.parse(raw).forEach((f: Flag) => s.add(f));
    }
  } catch {}
  return s;
}

export function hasFlag(flag: Flag): boolean {
  return getFlags().has(flag);
}
