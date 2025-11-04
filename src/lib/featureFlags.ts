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
