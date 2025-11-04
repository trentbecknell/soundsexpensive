import { describe, it, expect } from 'vitest';
import discogs from './discogs';
import musicbrainz from './musicbrainz';
import bandsintown from './bandsintown';

describe('integrations mapping', () => {
  it('maps discogs credits to talent profiles', async () => {
    const res = await discogs.search({ referenceArtist: 'Neon' });
    expect(res.items.length).toBeGreaterThan(0);
    const first = res.items[0];
    expect(Array.isArray(first.roles)).toBe(true);
  });

  it('maps musicbrainz relations to roles', async () => {
    const res = await musicbrainz.search({ referenceRelease: 'Echoes' });
    expect(res.items.some(i => i.roles.includes('Mixer'))).toBe(true);
  });

  it('maps bandsintown events to live musicians', async () => {
    const res = await bandsintown.search({ city: 'Los Angeles' });
    expect(res.items.every(i => i.roles.includes('Live Musician'))).toBe(true);
  });
});
