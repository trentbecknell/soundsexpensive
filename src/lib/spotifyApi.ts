// Spotify Web API Integration
// Handles authentication and data fetching from Spotify

const SPOTIFY_CLIENT_ID = (import.meta as any).env?.VITE_SPOTIFY_CLIENT_ID || '';
const SPOTIFY_REDIRECT_URI = (import.meta as any).env?.VITE_SPOTIFY_REDIRECT_URI || window.location.origin + '/callback';
const SPOTIFY_SCOPES = [
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-library-read',
  'user-read-email',
].join(' ');

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: string[];
  album: string;
  duration_ms: number;
  preview_url: string | null;
}

export interface SpotifyAudioFeatures {
  id: string;
  tempo: number;
  energy: number;
  danceability: number;
  valence: number;
  loudness: number;
  acousticness: number;
  instrumentalness: number;
  speechiness: number;
  key: number;
  mode: number;
  time_signature: number;
  duration_ms: number;
}

export interface SpotifyPlaylistData {
  id: string;
  name: string;
  description: string;
  tracks: SpotifyTrack[];
  total_tracks: number;
}

/**
 * Generate Spotify authorization URL
 */
export async function getSpotifyAuthUrl(): Promise<string> {
  const state = generateRandomString(16);
  const codeVerifier = generateRandomString(128);
  
  // Store for PKCE flow
  localStorage.setItem('spotify_auth_state', state);
  localStorage.setItem('spotify_code_verifier', codeVerifier);
  
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  
  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: SPOTIFY_REDIRECT_URI,
    state: state,
    scope: SPOTIFY_SCOPES,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
  });
  
  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

/**
 * Handle OAuth callback and exchange code for token
 */
export async function handleSpotifyCallback(code: string, state: string): Promise<string> {
  const storedState = localStorage.getItem('spotify_auth_state');
  const codeVerifier = localStorage.getItem('spotify_code_verifier');
  
  if (!storedState || state !== storedState) {
    throw new Error('State mismatch - possible CSRF attack');
  }
  
  if (!codeVerifier) {
    throw new Error('Code verifier not found');
  }
  
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: SPOTIFY_REDIRECT_URI,
      client_id: SPOTIFY_CLIENT_ID,
      code_verifier: codeVerifier,
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to exchange code for token');
  }
  
  const data = await response.json();
  
  // Store tokens
  localStorage.setItem('spotify_access_token', data.access_token);
  localStorage.setItem('spotify_refresh_token', data.refresh_token);
  localStorage.setItem('spotify_token_expiry', String(Date.now() + data.expires_in * 1000));
  
  // Clean up
  localStorage.removeItem('spotify_auth_state');
  localStorage.removeItem('spotify_code_verifier');
  
  return data.access_token;
}

/**
 * Get valid access token (refresh if needed)
 */
export async function getAccessToken(): Promise<string | null> {
  const accessToken = localStorage.getItem('spotify_access_token');
  const refreshToken = localStorage.getItem('spotify_refresh_token');
  const expiry = localStorage.getItem('spotify_token_expiry');
  
  if (!accessToken) return null;
  
  // Check if token is expired
  if (expiry && Date.now() >= parseInt(expiry)) {
    if (!refreshToken) return null;
    
    // Refresh token
    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: SPOTIFY_CLIENT_ID,
        }),
      });
      
      if (!response.ok) {
        localStorage.removeItem('spotify_access_token');
        localStorage.removeItem('spotify_refresh_token');
        localStorage.removeItem('spotify_token_expiry');
        return null;
      }
      
      const data = await response.json();
      localStorage.setItem('spotify_access_token', data.access_token);
      localStorage.setItem('spotify_token_expiry', String(Date.now() + data.expires_in * 1000));
      
      return data.access_token;
    } catch (err) {
      console.error('Failed to refresh token:', err);
      return null;
    }
  }
  
  return accessToken;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!localStorage.getItem('spotify_access_token');
}

/**
 * Logout and clear tokens
 */
export function logout(): void {
  localStorage.removeItem('spotify_access_token');
  localStorage.removeItem('spotify_refresh_token');
  localStorage.removeItem('spotify_token_expiry');
}

/**
 * Extract playlist ID from Spotify URL
 */
export function extractPlaylistId(url: string): string | null {
  const patterns = [
    /spotify\.com\/playlist\/([a-zA-Z0-9]+)/,
    /spotify:playlist:([a-zA-Z0-9]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

/**
 * Fetch playlist data from Spotify
 */
export async function fetchPlaylist(playlistId: string): Promise<SpotifyPlaylistData> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');
  
  const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch playlist: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  const tracks: SpotifyTrack[] = data.tracks.items
    .filter((item: any) => item.track !== null)
    .map((item: any) => ({
      id: item.track.id,
      name: item.track.name,
      artists: item.track.artists.map((a: any) => a.name),
      album: item.track.album.name,
      duration_ms: item.track.duration_ms,
      preview_url: item.track.preview_url,
    }));
  
  return {
    id: data.id,
    name: data.name,
    description: data.description || '',
    tracks,
    total_tracks: tracks.length,
  };
}

/**
 * Fetch audio features for multiple tracks
 */
export async function fetchAudioFeatures(trackIds: string[]): Promise<SpotifyAudioFeatures[]> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');
  
  // Spotify API allows up to 100 tracks per request
  const chunks = [];
  for (let i = 0; i < trackIds.length; i += 100) {
    chunks.push(trackIds.slice(i, i + 100));
  }
  
  const allFeatures: SpotifyAudioFeatures[] = [];
  
  for (const chunk of chunks) {
    const response = await fetch(
      `https://api.spotify.com/v1/audio-features?ids=${chunk.join(',')}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch audio features: ${response.statusText}`);
    }
    
    const data = await response.json();
    allFeatures.push(...data.audio_features.filter((f: any) => f !== null));
  }
  
  return allFeatures;
}

/**
 * Convert Spotify audio features to our AudioFeatures format
 */
export function convertSpotifyFeatures(spotifyFeatures: SpotifyAudioFeatures): any {
  return {
    tempo_bpm: spotifyFeatures.tempo,
    danceability: spotifyFeatures.danceability,
    energy: spotifyFeatures.energy,
    valence: spotifyFeatures.valence,
    acousticness: spotifyFeatures.acousticness,
    instrumentalness: spotifyFeatures.instrumentalness,
    speechiness: spotifyFeatures.speechiness,
    loudness_db: spotifyFeatures.loudness,
    duration_seconds: spotifyFeatures.duration_ms / 1000,
    key: spotifyFeatures.key,
    mode: spotifyFeatures.mode === 1 ? 'major' : 'minor',
    key_confidence: 1.0, // Spotify doesn't provide this
    
    // Estimated values (Spotify doesn't provide these)
    dynamic_range_db: 8, // Average estimate
    stereo_width: 0.7, // Average estimate
    peak_db: -1, // Estimate
    rms_db: spotifyFeatures.loudness + 3, // Rough estimate
    crest_factor: 8, // Average estimate
  };
}

// PKCE helpers
function generateRandomString(length: number): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], '');
}

async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return base64urlencode(digest);
}

function base64urlencode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let str = '';
  for (const byte of bytes) {
    str += String.fromCharCode(byte);
  }
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
