import React, { useState, useRef, useEffect } from 'react';
import { Portfolio, ArtistRecord } from '../types/portfolio';

interface ArtistSwitcherProps {
  portfolio: Portfolio;
  onSwitchArtist: (artistId: string) => void;
  onNewArtist: () => void;
  onDeleteArtist: (artistId: string) => void;
  currentArtistName: string;
}

export default function ArtistSwitcher({
  portfolio,
  onSwitchArtist,
  onNewArtist,
  onDeleteArtist,
  currentArtistName
}: ArtistSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const activeArtist = portfolio.artists.find(a => a.id === portfolio.activeArtistId);
  const otherArtists = portfolio.artists.filter(a => a.id !== portfolio.activeArtistId);

  const getArtistStage = (artist: ArtistRecord) => {
    return artist.state?.profile?.stage || 'Unknown';
  };

  const getArtistGenres = (artist: ArtistRecord) => {
    const genres = artist.profile.genres || artist.state?.profile?.genres;
    if (!genres) return 'No genre';
    return genres.length > 30 ? genres.substring(0, 30) + '...' : genres;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Current Artist Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-surface-700 bg-surface-800/50 hover:bg-surface-800 transition-colors text-left min-w-[200px]"
      >
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-surface-100 truncate">
            {currentArtistName}
          </div>
          <div className="text-xs text-surface-400">
            {portfolio.artists.length} artist{portfolio.artists.length !== 1 ? 's' : ''}
          </div>
        </div>
        <svg 
          className={`w-4 h-4 text-surface-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-lg border border-surface-700 bg-surface-900 shadow-2xl z-50">
          {/* Current Artist Section */}
          {activeArtist && (
            <div className="p-3 border-b border-surface-700 bg-primary-600/10">
              <div className="text-xs text-surface-400 mb-1">Current Artist</div>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-surface-50 truncate">
                    {activeArtist.profile.artistName || 'Unnamed Artist'}
                  </div>
                  <div className="text-xs text-surface-300 mt-0.5">
                    {getArtistGenres(activeArtist)} • {getArtistStage(activeArtist)}
                  </div>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-primary-600/20 text-primary-300 border border-primary-600/30">
                  Active
                </span>
              </div>
            </div>
          )}

          {/* Other Artists */}
          {otherArtists.length > 0 && (
            <div className="p-2">
              <div className="text-xs text-surface-400 px-2 py-1 mb-1">Switch to Artist</div>
              {otherArtists.map(artist => (
                <div
                  key={artist.id}
                  className="group flex items-center justify-between px-2 py-2 rounded-lg hover:bg-surface-800 transition-colors"
                >
                  <button
                    onClick={() => {
                      onSwitchArtist(artist.id);
                      setIsOpen(false);
                    }}
                    className="flex-1 text-left min-w-0 mr-2"
                  >
                    <div className="text-sm font-medium text-surface-200 group-hover:text-surface-50 truncate">
                      {artist.profile.artistName || 'Unnamed Artist'}
                    </div>
                    <div className="text-xs text-surface-400 mt-0.5">
                      {getArtistGenres(artist)} • {getArtistStage(artist)}
                    </div>
                    <div className="text-xs text-surface-500 mt-0.5">
                      Modified: {new Date(artist.lastModified).toLocaleDateString()}
                    </div>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteArtist(artist.id);
                      setIsOpen(false);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded text-surface-500 hover:text-red-400 hover:bg-red-900/20 transition-all"
                    title="Delete artist"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="p-2 border-t border-surface-700">
            <button
              onClick={() => {
                onNewArtist();
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Artist
            </button>
          </div>

          {/* Portfolio Stats */}
          <div className="p-3 border-t border-surface-700 bg-surface-800/30">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-lg font-bold text-surface-100">{portfolio.artists.length}</div>
                <div className="text-xs text-surface-400">Artists</div>
              </div>
              <div>
                <div className="text-lg font-bold text-surface-100">
                  {portfolio.artists.filter(a => a.state?.catalogAnalysisComplete).length}
                </div>
                <div className="text-xs text-surface-400">Analyzed</div>
              </div>
              <div>
                <div className="text-lg font-bold text-surface-100">
                  {portfolio.artists.filter(a => a.state?.roadmapGenerated).length}
                </div>
                <div className="text-xs text-surface-400">Roadmaps</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
