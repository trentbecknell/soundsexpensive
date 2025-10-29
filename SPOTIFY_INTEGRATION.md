# Spotify Integration Setup Guide

This guide explains how to set up Spotify playlist imports for the Catalog Analyzer feature.

## Features

- **Import Spotify Playlists**: Paste a Spotify playlist URL to automatically import up to 20 tracks
- **Audio Features Analysis**: Uses Spotify's Audio Features API (tempo, energy, danceability, etc.)
- **No Downloads Required**: Analyzes tracks without downloading audio files
- **Secure OAuth 2.0**: Uses PKCE flow for enhanced security

## Setup Instructions

### 1. Create a Spotify App

1. Visit [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click **"Create app"**
4. Fill in the required fields:
   - **App name**: `Sounds Expensive Mix Analyzer` (or any name)
   - **App description**: `Audio analysis tool for music production`
   - **Redirect URIs**: 
     - Production: `https://trentbecknell.github.io/soundsexpensive/`
     - Development: `http://localhost:5173/`
   - **APIs used**: Select "Web API"
5. Accept the **Terms of Service**
6. Click **"Save"**

### 2. Get Your Client ID

1. Click on your newly created app
2. Click **"Settings"** button
3. Copy the **Client ID**

### 3. Configure Environment Variables

#### For Local Development:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your Client ID:
   ```
   VITE_SPOTIFY_CLIENT_ID=your_actual_client_id_here
   ```

3. Restart the dev server:
   ```bash
   npm run dev
   ```

#### For Production (GitHub Pages):

You'll need to set up environment variables in your build process. Since this is a static site on GitHub Pages, the recommended approach is:

**Option 1: Build-time environment variables** (Recommended)
1. In your repository, go to **Settings → Secrets and variables → Actions**
2. Add a new secret: `VITE_SPOTIFY_CLIENT_ID` with your Client ID
3. Update your GitHub Actions workflow to include the secret in the build step:
   ```yaml
   - name: Build
     run: npm run build
     env:
       VITE_SPOTIFY_CLIENT_ID: ${{ secrets.VITE_SPOTIFY_CLIENT_ID }}
   ```

**Option 2: Hardcode in production build**
- For public repositories, you can hardcode the Client ID directly in `src/lib/spotifyApi.ts`
- Client IDs are not sensitive (they're meant to be public)
- Client Secrets should NEVER be included (we use PKCE which doesn't need them)

### 4. Test the Integration

1. Navigate to the **Catalog Analyzer** tab
2. Switch to **"Playlist URL"** import method
3. Click **"Connect Spotify"**
4. Authorize the application
5. Paste a Spotify playlist URL (e.g., `https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M`)
6. Click **"Import from URL"**

## How It Works

### OAuth 2.0 PKCE Flow

1. User clicks "Connect Spotify"
2. App generates a code verifier and code challenge
3. User is redirected to Spotify's authorization page
4. User grants permission
5. Spotify redirects back with an authorization code
6. App exchanges code for access token
7. Access token is stored in localStorage
8. Token automatically refreshes when expired

### API Calls

1. **Fetch Playlist**: `/v1/playlists/{id}` - Gets playlist metadata and track list
2. **Fetch Audio Features**: `/v1/audio-features?ids=...` - Gets audio analysis for up to 100 tracks
3. **Token Refresh**: `/api/token` - Refreshes expired access tokens

### Data Mapping

Spotify's audio features are mapped to the internal format:

| Spotify Feature | Internal Feature | Notes |
|----------------|------------------|-------|
| `tempo` | `tempo_bpm` | Beats per minute |
| `energy` | `energy` | 0-1 scale |
| `danceability` | `danceability` | 0-1 scale |
| `valence` | `valence` | Positivity/happiness |
| `loudness` | `loudness_db` | dB scale |
| `duration_ms` | `duration_seconds` | Converted from ms |
| `key` | `key` | 0-11 (C=0) |
| `mode` | `mode` | Major/minor |

## API Limitations

- **Rate Limits**: ~180 requests per minute
- **Batch Size**: Max 100 tracks per audio features request
- **Track Limit**: Catalog Analyzer supports max 20 tracks
- **Scope**: `playlist-read-private` and `playlist-read-collaborative`

## Troubleshooting

### "Not authenticated" error
- Click "Disconnect" and reconnect
- Check that your Client ID is correct
- Verify redirect URI matches exactly (trailing slash matters!)

### "Invalid playlist URL" error
- Use format: `https://open.spotify.com/playlist/{id}`
- Ensure playlist is public or you're connected with an account that has access

### Authorization fails
- Check redirect URI in Spotify Dashboard matches exactly
- Clear browser cache and try again
- Ensure app is not in "Development Mode" for production use

### TypeScript errors in development
- Ensure `.env` file exists with `VITE_SPOTIFY_CLIENT_ID`
- Restart the Vite dev server after creating `.env`

## Security Notes

- **Client ID is public**: It's safe to expose in client-side code
- **PKCE flow**: More secure than implicit grant (no client secret needed)
- **Token storage**: Access tokens stored in localStorage (consider sessionStorage for higher security)
- **Scopes**: Only requests read access to playlists (no write permissions)

## Next Steps

Future enhancements could include:

- [ ] Bandcamp integration
- [ ] SoundCloud integration
- [ ] Apple Music integration
- [ ] Save analyzed catalogs to Spotify playlists
- [ ] Compare your catalog against Spotify charts
- [ ] Genre-based playlist recommendations

## Support

For issues related to:
- **Spotify API**: https://developer.spotify.com/documentation/web-api
- **OAuth Flow**: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
- **This Integration**: Open an issue on the repository
