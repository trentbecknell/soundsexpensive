import React, { useEffect, useState } from 'react';
import { handleSpotifyCallback } from '../lib/spotifyApi';

/**
 * Component to handle Spotify OAuth callback
 * Should be rendered at the /callback route
 */
export default function SpotifyCallback() {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Get URL parameters
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const state = params.get('state');
        const errorParam = params.get('error');

        if (errorParam) {
          throw new Error(`Spotify authorization failed: ${errorParam}`);
        }

        if (!code || !state) {
          throw new Error('Missing authorization code or state');
        }

        // Verify state matches
        const storedState = localStorage.getItem('spotify_auth_state');
        if (state !== storedState) {
          throw new Error('State mismatch - possible CSRF attack');
        }

        // Exchange code for access token
        await handleSpotifyCallback(code, state);
        
        setStatus('success');
        
        // Redirect back to catalog analyzer after short delay
        setTimeout(() => {
          window.location.href = '/soundsexpensive/#catalog-analyzer';
        }, 2000);
      } catch (err) {
        console.error('Spotify callback error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setStatus('error');
      }
    };

    processCallback();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 max-w-md w-full">
        {status === 'processing' && (
          <>
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
            </div>
            <h2 className="text-2xl font-bold text-white text-center mb-2">
              Connecting to Spotify...
            </h2>
            <p className="text-gray-300 text-center">
              Please wait while we complete the authentication.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-500/20 p-3">
                <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white text-center mb-2">
              Successfully Connected!
            </h2>
            <p className="text-gray-300 text-center">
              Redirecting you back to the Catalog Analyzer...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-red-500/20 p-3">
                <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white text-center mb-2">
              Connection Failed
            </h2>
            <p className="text-red-300 text-center mb-4">{error}</p>
            <button
              onClick={() => window.location.href = '/soundsexpensive/#catalog-analyzer'}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition"
            >
              Return to Catalog Analyzer
            </button>
          </>
        )}
      </div>
    </div>
  );
}
