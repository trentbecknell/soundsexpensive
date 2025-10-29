import React, { useState, useCallback, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { analyzeCatalog, getTimelineData } from '../lib/catalogAnalysis';
import type { CatalogTrack, CatalogAnalysisResult } from '../types/catalogAnalysis';
import { getSpotifyAuthUrl, getAccessToken, fetchPlaylist, fetchAudioFeatures, convertSpotifyFeatures } from '../lib/spotifyApi';
import { fetchSamplyPlaylist, estimateSamplyAudioFeatures } from '../lib/samplyApi';

export default function CatalogAnalyzer() {
  const [tracks, setTracks] = useState<CatalogTrack[]>([]);
  const [targetGenre, setTargetGenre] = useState<string>('Pop');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<CatalogAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [playlistUrl, setPlaylistUrl] = useState<string>('');
  const [importMethod, setImportMethod] = useState<'upload' | 'url'>('upload');
  const [spotifyConnected, setSpotifyConnected] = useState<boolean>(false);
  const [connectingSpotify, setConnectingSpotify] = useState<boolean>(false);

  const availableGenres = ['Pop', 'R&B', 'Hip Hop', 'Electronic', 'Alternative'];

  // Check Spotify connection status on mount
  useEffect(() => {
    const checkSpotifyAuth = async () => {
      try {
        const token = await getAccessToken();
        setSpotifyConnected(!!token);
      } catch (err) {
        setSpotifyConnected(false);
      }
    };
    checkSpotifyAuth();
  }, []);

  const handleConnectSpotify = async () => {
    setConnectingSpotify(true);
    try {
      const authUrl = await getSpotifyAuthUrl();
      window.location.href = authUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to Spotify');
      setConnectingSpotify(false);
    }
  };

  const handleDisconnectSpotify = () => {
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_token_expiry');
    setSpotifyConnected(false);
  };

  const handleFilesSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;
    
    if (files.length > 20) {
      setError('Maximum 20 tracks allowed');
      return;
    }

    const newTracks: CatalogTrack[] = files.map((file, index) => ({
      id: `track-${Date.now()}-${index}`,
      file,
      name: file.name.replace(/\.[^/.]+$/, ''),
      upload_order: tracks.length + index + 1,
    }));

    setTracks(prev => [...prev, ...newTracks]);
    setError(null);
  }, [tracks.length]);

  const removeTrack = useCallback((trackId: string) => {
    setTracks(prev => prev.filter(t => t.id !== trackId));
  }, []);

  const clearAll = useCallback(() => {
    setTracks([]);
    setResult(null);
    setError(null);
    setPlaylistUrl('');
  }, []);

  const handlePlaylistImport = useCallback(async () => {
    if (!playlistUrl.trim()) {
      setError('Please enter a playlist URL');
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      // Detect platform
      const url = playlistUrl.toLowerCase();
      
      if (url.includes('spotify.com')) {
        // Extract playlist ID from URL
        const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
        if (!match) {
          throw new Error('Invalid Spotify playlist URL. Please use a link like: https://open.spotify.com/playlist/...');
        }
        
        const playlistId = match[1];
        
        // Fetch playlist data
        const playlistData = await fetchPlaylist(playlistId);
        
        if (playlistData.tracks.length === 0) {
          throw new Error('Playlist is empty or could not be accessed');
        }
        
        if (playlistData.tracks.length > 20) {
          throw new Error(`Playlist has ${playlistData.tracks.length} tracks. Maximum 20 tracks allowed. Please use a smaller playlist.`);
        }
        
        // Fetch audio features for all tracks
        const trackIds = playlistData.tracks.map(t => t.id);
        const audioFeaturesArray = await fetchAudioFeatures(trackIds);
        
        // Create a map of track ID to audio features
        const audioFeatures: Record<string, any> = {};
        audioFeaturesArray.forEach(f => {
          if (f && (f as any).id) {
            audioFeatures[(f as any).id] = f;
          }
        });
        
        // Convert to CatalogTrack format
        const catalogTracks: CatalogTrack[] = playlistData.tracks.map((track, index) => {
          const features = audioFeatures[track.id];
          if (!features) {
            throw new Error(`Could not fetch audio features for track: ${track.name}`);
          }
          
          return {
            id: track.id,
            name: track.name,
            artist: track.artists.join(', '),
            upload_order: index + 1,
            audio_features: convertSpotifyFeatures(features),
          };
        });
        
        setTracks(catalogTracks);
        setPlaylistUrl('');
        setAnalyzing(false);
        return;
      } else if (url.includes('samply.app')) {
        // Samply.app integration
        const playlistData = await fetchSamplyPlaylist(url);
        
        if (playlistData.tracks.length === 0) {
          throw new Error('Samply playlist is empty or could not be accessed');
        }
        
        if (playlistData.tracks.length > 20) {
          throw new Error(`Playlist has ${playlistData.tracks.length} tracks. Maximum 20 tracks allowed. Please create a smaller playlist or select specific tracks.`);
        }
        
        // Convert to CatalogTrack format with estimated audio features
        const catalogTracks: CatalogTrack[] = playlistData.tracks.map((track, index) => {
          return {
            id: track.id,
            name: track.name,
            artist: track.artist,
            upload_order: index + 1,
            audio_features: estimateSamplyAudioFeatures(track),
          };
        });
        
        setTracks(catalogTracks);
        setPlaylistUrl('');
        setAnalyzing(false);
        return;
      } else if (url.includes('bandcamp.com')) {
        setError('🎸 Bandcamp Integration Coming Soon! Please download your tracks from Bandcamp and upload them manually for now. Direct Bandcamp album/playlist analysis is in development.');
        setAnalyzing(false);
        return;
      } else if (url.includes('soundcloud.com')) {
        setError('☁️ SoundCloud Integration Coming Soon! Please download your tracks and upload them manually for now.');
        setAnalyzing(false);
        return;
      } else if (url.includes('apple.com') || url.includes('music.apple')) {
        setError('🍎 Apple Music Integration Coming Soon! Please download your tracks and upload them manually for now.');
        setAnalyzing(false);
        return;
      } else {
        setError('Unsupported URL. Currently supported: Spotify (connected), Bandcamp, SoundCloud, Apple Music (coming soon). For now, please upload files directly for non-Spotify playlists.');
        setAnalyzing(false);
        return;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import playlist');
      console.error('Playlist import error:', err);
    } finally {
      setAnalyzing(false);
    }
  }, [playlistUrl]);

  const handleAnalyze = useCallback(async () => {
    if (tracks.length < 2) {
      setError('Please upload at least 2 tracks for catalog analysis');
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      const analysis = await analyzeCatalog(tracks, targetGenre);
      setResult(analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      console.error('Catalog analysis error:', err);
    } finally {
      setAnalyzing(false);
    }
  }, [tracks, targetGenre]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-900 via-surface-800 to-surface-900 p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary-100 mb-2">📊 Catalog Analyzer</h1>
        <p className="text-surface-300 text-sm max-w-2xl mx-auto">
          Upload tracks or import from Spotify/Bandcamp to analyze your artistic growth, consistency, and sonic identity over time
        </p>
      </div>

      {/* Upload Section */}
      <section className="rounded-2xl border border-surface-700 bg-surface-800/80 p-6 backdrop-blur">
        <h2 className="text-lg font-semibold text-primary-100 mb-4">Import Your Catalog</h2>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-surface-300 mb-2">Target Genre</label>
            <select
              value={targetGenre}
              onChange={(e) => setTargetGenre(e.target.value)}
              className="w-full rounded-lg bg-surface-700/50 px-3 py-2 text-surface-100"
            >
              {availableGenres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-surface-300 mb-2">Import Method</label>
            <div className="flex gap-2">
              <button
                onClick={() => setImportMethod('upload')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  importMethod === 'upload'
                    ? 'bg-primary-600 text-white'
                    : 'bg-surface-700/50 text-surface-300 hover:bg-surface-700'
                }`}
              >
                📁 Upload Files
              </button>
              <button
                onClick={() => setImportMethod('url')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  importMethod === 'url'
                    ? 'bg-primary-600 text-white'
                    : 'bg-surface-700/50 text-surface-300 hover:bg-surface-700'
                }`}
              >
                🔗 Playlist URL
              </button>
            </div>
          </div>
        </div>

        {importMethod === 'upload' ? (
          <div>
            <label
              htmlFor="catalog-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-surface-600 rounded-2xl cursor-pointer hover:border-primary-500 transition-colors"
            >
              <div className="flex flex-col items-center justify-center">
                <svg className="w-10 h-10 mb-2 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm text-surface-300">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-surface-400">Multiple files (2-20 tracks, Max 500MB each)</p>
              </div>
              <input
                id="catalog-upload"
                type="file"
                className="hidden"
                accept="audio/*"
                multiple
                onChange={handleFilesSelect}
              />
            </label>
          </div>
        ) : (
          <div>
            {/* Spotify Connection Status */}
            <div className={`mb-4 p-4 rounded-lg border ${
              spotifyConnected
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-yellow-500/10 border-yellow-500/30'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {spotifyConnected ? (
                    <>
                      <span className="text-green-400 text-lg">✓</span>
                      <span className="text-sm font-medium text-green-300">Spotify Connected</span>
                    </>
                  ) : (
                    <>
                      <span className="text-yellow-400 text-lg">⚠</span>
                      <span className="text-sm font-medium text-yellow-300">Spotify Not Connected</span>
                    </>
                  )}
                </div>
                {spotifyConnected ? (
                  <button
                    onClick={handleDisconnectSpotify}
                    className="text-xs text-red-300 hover:text-red-200 underline"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={handleConnectSpotify}
                    disabled={connectingSpotify}
                    className="px-4 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white text-xs font-medium rounded transition-colors"
                  >
                    {connectingSpotify ? 'Connecting...' : 'Connect Spotify'}
                  </button>
                )}
              </div>
              {!spotifyConnected && (
                <p className="text-xs text-yellow-200 mt-2">
                  Connect your Spotify account to import playlists directly
                </p>
              )}
            </div>

            <div className="mb-3">
              <label className="block text-sm text-surface-300 mb-2">Playlist/Album URL</label>
              <input
                type="text"
                value={playlistUrl}
                onChange={(e) => setPlaylistUrl(e.target.value)}
                placeholder="https://samply.app/p/... or spotify.com/playlist/... or bandcamp.com/album/..."
                className="w-full rounded-lg bg-surface-700/50 px-4 py-3 text-surface-100 placeholder-surface-500 focus:ring-2 focus:ring-primary-500 transition-colors"
              />
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-3">
              <div className="text-xs font-medium text-blue-300 mb-2">✨ Supported Platforms</div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs text-blue-200">
                <div className="flex items-center gap-1">
                  <span>🎵</span> Spotify {spotifyConnected && <span className="text-green-400">✓</span>}
                </div>
                <div className="flex items-center gap-1">
                  <span>🎹</span> Samply <span className="text-yellow-300">(Beta)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>🎸</span> Bandcamp <span className="text-yellow-300">(Soon)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>☁️</span> SoundCloud <span className="text-yellow-300">(Soon)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>🍎</span> Apple Music <span className="text-yellow-300">(Soon)</span>
                </div>
              </div>
              {spotifyConnected ? (
                <p className="text-xs text-green-300 mt-2">
                  ✓ Spotify connected! Samply support is in beta - if import fails, download tracks and use "Upload Files" instead.
                </p>
              ) : (
                <p className="text-xs text-blue-300 mt-2">
                  Samply support is in beta. If URL import fails due to browser restrictions, download your tracks and use "Upload Files" method. Connect Spotify for additional streaming imports.
                </p>
              )}
            </div>

            <button
              onClick={handlePlaylistImport}
              disabled={analyzing || !playlistUrl.trim() || (!spotifyConnected && playlistUrl.toLowerCase().includes('spotify'))}
              className="w-full py-3 px-4 bg-primary-500 hover:bg-primary-600 disabled:bg-surface-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {analyzing ? '🔄 Importing...' : '🔗 Import from URL'}
            </button>
          </div>
        )}

        {/* Track List */}
        {tracks.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-surface-300">{tracks.length} track{tracks.length > 1 ? 's' : ''} uploaded</span>
              <button onClick={clearAll} className="text-xs text-red-400 hover:text-red-300">Clear all</button>
            </div>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {tracks.map((track, idx) => (
                <div key={track.id} className="flex items-center justify-between bg-surface-700/30 rounded px-3 py-2">
                  <span className="text-xs text-surface-200 flex items-center gap-2">
                    <span className="text-surface-500">#{idx + 1}</span>
                    {track.name}
                  </span>
                  <button
                    onClick={() => removeTrack(track.id)}
                    className="text-surface-400 hover:text-red-400"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        {importMethod === 'upload' && (
          <button
            onClick={handleAnalyze}
            disabled={analyzing || tracks.length < 2}
            className="mt-4 w-full py-3 px-4 bg-primary-500 hover:bg-primary-600 disabled:bg-surface-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {analyzing ? '🔄 Analyzing Catalog...' : `📊 Analyze ${tracks.length} Track${tracks.length > 1 ? 's' : ''}`}
          </button>
        )}
      </section>

      {/* Results */}
      {result && (
        <>
          {/* Overview */}
          <section className="rounded-2xl border border-surface-700 bg-surface-800/80 p-6 backdrop-blur">
            <h3 className="text-lg font-semibold text-primary-100 mb-4">Catalog Overview</h3>
            
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-surface-700/30 rounded-lg p-4">
                <div className="text-xs text-surface-400 mb-1">Average Score</div>
                <div className={`text-3xl font-bold ${getScoreColor(result.average_score)}`}>
                  {result.average_score}
                </div>
              </div>
              
              <div className="bg-surface-700/30 rounded-lg p-4">
                <div className="text-xs text-surface-400 mb-1">Quality Trend</div>
                <div className={`text-lg font-semibold ${
                  result.score_trend === 'improving' ? 'text-green-400' :
                  result.score_trend === 'declining' ? 'text-red-400' :
                  'text-yellow-400'
                }`}>
                  {result.score_trend === 'improving' ? '📈 Improving' :
                   result.score_trend === 'declining' ? '📉 Declining' :
                   '→ Stable'}
                </div>
              </div>
              
              <div className="bg-surface-700/30 rounded-lg p-4">
                <div className="text-xs text-surface-400 mb-1">Genre Consistency</div>
                <div className="text-lg font-semibold text-surface-200">
                  {result.genre_consistency.consistency_score}%
                </div>
                <div className="text-xs text-surface-400 mt-1">{result.genre_consistency.primary_genre}</div>
              </div>
              
              <div className="bg-surface-700/30 rounded-lg p-4">
                <div className="text-xs text-surface-400 mb-1">Sonic Identity</div>
                <div className="text-lg font-semibold text-surface-200">
                  {result.sonic_identity.consistency_score}%
                </div>
                <div className="text-xs text-surface-400 mt-1">Consistency</div>
              </div>
            </div>
          </section>

          {/* Timeline Chart */}
          <section className="rounded-2xl border border-surface-700 bg-surface-800/80 p-6 backdrop-blur">
            <h3 className="text-lg font-semibold text-primary-100 mb-4">Quality Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getTimelineData(result.tracks)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="track_name" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9CA3AF" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#E5E7EB' }}
                />
                <Legend />
                <Line type="monotone" dataKey="overall_score" stroke="#8B5CF6" strokeWidth={2} name="Overall Score" />
                <Line type="monotone" dataKey="loudness" stroke="#10B981" strokeWidth={1.5} name="Loudness" />
                <Line type="monotone" dataKey="dynamics" stroke="#F59E0B" strokeWidth={1.5} name="Dynamics" />
                <Line type="monotone" dataKey="frequency_balance" stroke="#3B82F6" strokeWidth={1.5} name="Frequency" />
              </LineChart>
            </ResponsiveContainer>
          </section>

          {/* Insights */}
          {result.insights.length > 0 && (
            <section className="rounded-2xl border border-blue-700/50 bg-blue-900/20 p-6 backdrop-blur">
              <h3 className="text-lg font-semibold text-blue-100 mb-4">💡 Key Insights</h3>
              <div className="space-y-3">
                {result.insights.map((insight, idx) => (
                  <div key={idx} className="bg-surface-800/50 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <span className="text-lg">
                        {insight.type === 'strength' ? '✅' :
                         insight.type === 'weakness' ? '⚠️' :
                         insight.type === 'opportunity' ? '💡' : '📊'}
                      </span>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-surface-100 mb-1">{insight.title}</h4>
                        <p className="text-sm text-surface-300">{insight.description}</p>
                        {insight.tracks_affected && insight.tracks_affected.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {insight.tracks_affected.map(track => (
                              <span key={track} className="text-xs bg-surface-700/50 text-surface-400 px-2 py-1 rounded">
                                {track}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Best & Needs Improvement */}
          <div className="grid md:grid-cols-2 gap-6">
            <section className="rounded-2xl border border-green-700/50 bg-green-900/20 p-6 backdrop-blur">
              <h3 className="text-lg font-semibold text-green-100 mb-4">🏆 Best Performing Track</h3>
              <div className="bg-surface-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-md font-semibold text-surface-100">{result.best_performing_track.name}</h4>
                  <span className={`text-2xl font-bold ${getScoreColor(result.best_performing_track.score)}`}>
                    {result.best_performing_track.score}
                  </span>
                </div>
                <div className="space-y-1">
                  {result.best_performing_track.strengths.slice(0, 3).map((strength, idx) => (
                    <div key={idx} className="text-sm text-green-200">✓ {strength}</div>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-orange-700/50 bg-orange-900/20 p-6 backdrop-blur">
              <h3 className="text-lg font-semibold text-orange-100 mb-4">📝 Needs Improvement</h3>
              <div className="space-y-2">
                {result.needs_improvement.map((track, idx) => (
                  <div key={idx} className="bg-surface-800/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-surface-200">{track.name}</span>
                      <span className={`text-lg font-bold ${getScoreColor(track.score)}`}>{track.score}</span>
                    </div>
                    <div className="text-xs text-surface-400">
                      {track.issues.slice(0, 2).join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Recommendations */}
          <section className="rounded-2xl border border-purple-700/50 bg-purple-900/20 p-6 backdrop-blur">
            <h3 className="text-lg font-semibold text-purple-100 mb-4">🎯 Recommendations</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-purple-200 mb-2">Overall Strategy</h4>
                <div className="space-y-2">
                  {result.overall_recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-surface-300">
                      <span className="text-purple-400 mt-0.5">→</span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-surface-700 pt-4">
                <h4 className="text-sm font-semibold text-purple-200 mb-2">Next Release Guidance</h4>
                <div className="space-y-2">
                  {result.next_release_guidance.map((guidance, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-surface-300">
                      <span className="text-blue-400 mt-0.5">💡</span>
                      <span>{guidance}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
