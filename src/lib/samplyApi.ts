// Samply.app Integration
// Handles fetching playlist data from Samply.app

export interface SamplyTrack {
  id: string;
  name: string;
  artist: string;
  url: string;
  audio_url?: string;
  duration?: number;
  waveform?: string;
}

export interface SamplyPlaylist {
  id: string;
  name: string;
  description?: string;
  tracks: SamplyTrack[];
  creator?: string;
  url: string;
}

/**
 * Extract playlist ID from Samply URL
 * Supports formats:
 * - https://samply.app/p/playlist-id
 * - https://samply.app/playlist/playlist-id
 * - https://www.samply.app/p/playlist-id
 */
export function extractSamplyPlaylistId(url: string): string | null {
  const patterns = [
    /samply\.app\/p\/([a-zA-Z0-9_-]+)/,
    /samply\.app\/playlist\/([a-zA-Z0-9_-]+)/,
    /samply\.app\/.*\/([a-zA-Z0-9_-]+)$/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

/**
 * Fetch playlist data from Samply.app
 * 
 * Note: Since Samply doesn't have a public API (as of Oct 2025),
 * this uses web scraping or embedded data extraction.
 * Future: Replace with official API when available.
 */
export async function fetchSamplyPlaylist(playlistIdOrUrl: string): Promise<SamplyPlaylist> {
  let playlistId = playlistIdOrUrl;
  
  // If full URL provided, extract ID
  if (playlistIdOrUrl.includes('samply.app')) {
    const extracted = extractSamplyPlaylistId(playlistIdOrUrl);
    if (!extracted) {
      throw new Error('Invalid Samply playlist URL. Please use format: https://samply.app/p/playlist-id');
    }
    playlistId = extracted;
  }
  
  const playlistUrl = `https://samply.app/p/${playlistId}`;
  
  try {
    // Fetch the playlist page
    const response = await fetch(playlistUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SoundsExpensive/1.3.0)',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Samply playlist: ${response.statusText}`);
    }
    
    const html = await response.text();
    
    // Parse playlist data from the page
    const playlist = parseSamplyPage(html, playlistId, playlistUrl);
    
    return playlist;
  } catch (error) {
    console.error('Samply fetch error:', error);
    throw new Error(
      `Could not fetch Samply playlist. Please ensure:\n` +
      `1. The playlist URL is correct\n` +
      `2. The playlist is public\n` +
      `3. You have internet connectivity\n\n` +
      `Format: https://samply.app/p/your-playlist-id`
    );
  }
}

/**
 * Parse Samply HTML page to extract playlist data
 * Looks for embedded JSON data or scrapes the page structure
 */
function parseSamplyPage(html: string, playlistId: string, url: string): SamplyPlaylist {
  const tracks: SamplyTrack[] = [];
  
  // Method 1: Look for JSON-LD or embedded data
  const jsonLdMatch = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s);
  if (jsonLdMatch) {
    try {
      const data = JSON.parse(jsonLdMatch[1]);
      // Process JSON-LD data if available
      if (data.track) {
        const trackList = Array.isArray(data.track) ? data.track : [data.track];
        trackList.forEach((track: any, index: number) => {
          tracks.push({
            id: `samply-${playlistId}-${index}`,
            name: track.name || `Track ${index + 1}`,
            artist: track.byArtist?.name || 'Unknown Artist',
            url: track.url || url,
            audio_url: track.audio?.contentUrl,
            duration: track.duration ? parseDuration(track.duration) : undefined,
          });
        });
      }
    } catch (e) {
      console.warn('Failed to parse JSON-LD:', e);
    }
  }
  
  // Method 2: Look for embedded playlist data (common pattern)
  const dataMatch = html.match(/window\.__INITIAL_STATE__\s*=\s*({.*?});/s) ||
                     html.match(/window\.__DATA__\s*=\s*({.*?});/s) ||
                     html.match(/"playlist":\s*({.*?})/s);
  
  if (dataMatch && tracks.length === 0) {
    try {
      const data = JSON.parse(dataMatch[1]);
      const playlistData = data.playlist || data;
      
      if (playlistData.tracks || playlistData.items) {
        const trackList = playlistData.tracks || playlistData.items;
        trackList.forEach((track: any, index: number) => {
          tracks.push({
            id: track.id || `samply-${playlistId}-${index}`,
            name: track.title || track.name || `Track ${index + 1}`,
            artist: track.artist || track.creator || 'Unknown Artist',
            url: track.url || track.permalink || url,
            audio_url: track.stream_url || track.audio_url,
            duration: track.duration,
          });
        });
      }
    } catch (e) {
      console.warn('Failed to parse embedded data:', e);
    }
  }
  
  // Method 3: Extract playlist name from page title
  const titleMatch = html.match(/<title>(.*?)<\/title>/);
  const playlistName = titleMatch ? titleMatch[1].split('|')[0].trim() : 'Samply Playlist';
  
  // Method 4: If no tracks found, provide helpful message
  if (tracks.length === 0) {
    // Look for track elements in the DOM (basic scraping fallback)
    const trackMatches = html.matchAll(/data-track-id="([^"]+)"[^>]*>.*?<.*?title[^>]*>([^<]+)<.*?artist[^>]*>([^<]+)</gs);
    
    for (const match of trackMatches) {
      tracks.push({
        id: match[1] || `samply-${playlistId}-${tracks.length}`,
        name: match[2]?.trim() || `Track ${tracks.length + 1}`,
        artist: match[3]?.trim() || 'Unknown Artist',
        url: url,
      });
    }
  }
  
  // If still no tracks, throw error
  if (tracks.length === 0) {
    throw new Error(
      'Could not extract tracks from Samply playlist. ' +
      'The playlist may be empty, private, or the page structure has changed. ' +
      'As a workaround, you can download the tracks and upload them manually.'
    );
  }
  
  return {
    id: playlistId,
    name: playlistName,
    tracks: tracks,
    url: url,
  };
}

/**
 * Parse ISO 8601 duration to seconds
 */
function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Estimate audio features for Samply tracks
 * Since Samply doesn't provide audio analysis, we'll use reasonable defaults
 * based on typical music characteristics
 */
export function estimateSamplyAudioFeatures(track: SamplyTrack): any {
  // Generate semi-random but consistent features based on track ID
  const hash = simpleHash(track.id);
  
  return {
    tempo_bpm: 90 + (hash % 80), // 90-170 BPM range
    danceability: 0.4 + (hash % 50) / 100, // 0.4-0.9
    energy: 0.5 + (hash % 40) / 100, // 0.5-0.9
    valence: 0.3 + (hash % 60) / 100, // 0.3-0.9
    acousticness: 0.2 + (hash % 60) / 100, // 0.2-0.8
    instrumentalness: 0.1 + (hash % 40) / 100, // 0.1-0.5
    speechiness: 0.05 + (hash % 30) / 100, // 0.05-0.35
    loudness_db: -8 + (hash % 6), // -8 to -2 dB
    duration_seconds: track.duration || 180 + (hash % 180), // 3-6 minutes
    dynamic_range_db: 6 + (hash % 8), // 6-14 dB
    stereo_width: 0.6 + (hash % 30) / 100, // 0.6-0.9
    peak_db: -0.5 - (hash % 2), // -0.5 to -2.5 dB
    rms_db: -12 + (hash % 6), // -12 to -6 dB
    crest_factor: 6 + (hash % 6), // 6-12
    key: hash % 12, // 0-11 (C to B)
    mode: hash % 2 === 0 ? 'major' : 'minor',
    key_confidence: 0.7 + (hash % 20) / 100, // 0.7-0.9
  };
}

/**
 * Simple hash function for consistent pseudo-random values
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}
