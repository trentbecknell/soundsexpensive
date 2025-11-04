export function getLiveSourcesFlag(): boolean {
  try {
    // URL param override
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    if (params.has('liveSources')) {
      const v = params.get('liveSources') || '';
      return v === '1' || v.toLowerCase() === 'true';
    }
    const v = localStorage.getItem('ar-live-sources');
    return v === '1' || v === 'true';
  } catch {
    return false;
  }
}

export function setLiveSourcesFlag(val: boolean) {
  try {
    localStorage.setItem('ar-live-sources', val ? '1' : '0');
  } catch {
    // ignore
  }
}

export function getApiBase(): string {
  try {
    // URL hash override: #apiBase=https://api.example.com
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    if (params.has('apiBase')) {
      const v = params.get('apiBase') || '';
      if (v) return v;
    }
    const stored = localStorage.getItem('ar-api-base');
    if (stored) return stored;
  } catch {
    // ignore
  }
  // default to relative /api (works with dev proxy)
  return '/api';
}

export function setApiBase(url: string) {
  try {
    localStorage.setItem('ar-api-base', url || '');
  } catch {
    // ignore
  }
}
