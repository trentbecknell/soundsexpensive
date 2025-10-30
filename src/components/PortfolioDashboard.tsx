import React, { useState, useMemo } from 'react';
import { Portfolio, ArtistRecord } from '../types/portfolio';
import { sortArtists, searchArtists } from '../lib/portfolioStorage';

interface PortfolioDashboardProps {
  portfolio: Portfolio;
  onSelectArtist: (artistId: string) => void;
  onNewArtist: () => void;
  onDeleteArtist: (artistId: string) => void;
  onClose: () => void;
  onCompareArtists?: (artistIds: string[]) => void;
  onShowAnalytics?: () => void;
}

export default function PortfolioDashboard({
  portfolio,
  onSelectArtist,
  onNewArtist,
  onDeleteArtist,
  onClose,
  onCompareArtists,
  onShowAnalytics
}: PortfolioDashboardProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(portfolio.settings.defaultView);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'lastModified' | 'stage' | 'genre'>(portfolio.settings.sortBy);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(portfolio.settings.sortOrder);
  const [genreFilter, setGenreFilter] = useState<string>('all');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [compareMode, setCompareMode] = useState(false);
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkSelected, setBulkSelected] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Get all unique genres and stages for filters
  const { genres, stages } = useMemo(() => {
    const genreSet = new Set<string>();
    const stageSet = new Set<string>();
    
    portfolio.artists.forEach(artist => {
      const artistGenres = artist.profile.genres || artist.state?.profile?.genres || '';
      artistGenres.split(',').forEach((g: string) => {
        const trimmed = g.trim();
        if (trimmed) genreSet.add(trimmed);
      });
      
      const stage = artist.state?.profile?.stage;
      if (stage) stageSet.add(stage);
    });
    
    return {
      genres: Array.from(genreSet).sort(),
      stages: Array.from(stageSet).sort()
    };
  }, [portfolio.artists]);

  // Filter and sort artists
  const filteredArtists = useMemo(() => {
    let filtered = portfolio.artists;

    // Search filter
    if (searchQuery) {
      filtered = searchArtists(portfolio, searchQuery);
    }

    // Genre filter
    if (genreFilter !== 'all') {
      filtered = filtered.filter(artist => {
        const artistGenres = artist.profile.genres || artist.state?.profile?.genres || '';
        return artistGenres.toLowerCase().includes(genreFilter.toLowerCase());
      });
    }

    // Stage filter
    if (stageFilter !== 'all') {
      filtered = filtered.filter(artist => {
        const stage = artist.state?.profile?.stage;
        return stage === stageFilter;
      });
    }

    // Sort
    return sortArtists(filtered, sortBy, sortOrder);
  }, [portfolio, searchQuery, genreFilter, stageFilter, sortBy, sortOrder]);

  // Portfolio statistics
  const stats = useMemo(() => {
    const total = portfolio.artists.length;
    const analyzed = portfolio.artists.filter(a => a.state?.catalogAnalysisComplete).length;
    const roadmaps = portfolio.artists.filter(a => a.state?.roadmapGenerated).length;
    const avgQuality = portfolio.artists
      .filter(a => a.state?.catalogAnalysisData?.average_score)
      .reduce((sum, a) => sum + (a.state?.catalogAnalysisData?.average_score || 0), 0) / 
      (portfolio.artists.filter(a => a.state?.catalogAnalysisData?.average_score).length || 1);

    return { total, analyzed, roadmaps, avgQuality };
  }, [portfolio.artists]);

  const getArtistStage = (artist: ArtistRecord) => {
    return artist.state?.profile?.stage || 'Unknown';
  };

  const getArtistQualityScore = (artist: ArtistRecord) => {
    return artist.state?.catalogAnalysisData?.average_score;
  };

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      'Hobbyist': 'bg-surface-600 text-surface-200',
      'Emerging': 'bg-blue-600/20 text-blue-300 border-blue-600/30',
      'Developing': 'bg-purple-600/20 text-purple-300 border-purple-600/30',
      'Established': 'bg-green-600/20 text-green-300 border-green-600/30',
      'Professional': 'bg-yellow-600/20 text-yellow-300 border-yellow-600/30',
      'Unknown': 'bg-surface-600 text-surface-400'
    };
    return colors[stage] || colors['Unknown'];
  };

  const handleSelectArtist = (artistId: string) => {
    if (compareMode) {
      // Toggle selection in compare mode
      setSelectedArtists(prev => 
        prev.includes(artistId) 
          ? prev.filter(id => id !== artistId)
          : prev.length < 3 
            ? [...prev, artistId]
            : prev
      );
    } else {
      // Normal mode: activate artist
      onSelectArtist(artistId);
      onClose();
    }
  };

  const handleStartComparison = () => {
    if (onCompareArtists && selectedArtists.length >= 2) {
      onCompareArtists(selectedArtists);
    }
  };

  const handleToggleCompareMode = () => {
    setCompareMode(!compareMode);
    setSelectedArtists([]);
  };

  const handleToggleBulkMode = () => {
    setBulkMode(!bulkMode);
    setBulkSelected([]);
  };

  const handleToggleBulkSelect = (artistId: string) => {
    setBulkSelected(prev =>
      prev.includes(artistId)
        ? prev.filter(id => id !== artistId)
        : [...prev, artistId]
    );
  };

  const handleSelectAll = () => {
    setBulkSelected(filteredArtists.map(a => a.id));
  };

  const handleDeselectAll = () => {
    setBulkSelected([]);
  };

  const handleBulkDelete = () => {
    if (bulkSelected.length === 0) return;
    setShowDeleteConfirm(true);
  };

  const confirmBulkDelete = () => {
    bulkSelected.forEach(artistId => {
      onDeleteArtist(artistId);
    });
    setBulkSelected([]);
    setBulkMode(false);
    setShowDeleteConfirm(false);
  };

  const handleBulkExport = () => {
    const selectedArtistRecords = portfolio.artists.filter(a => bulkSelected.includes(a.id));
    const exportData = {
      exported: new Date().toISOString(),
      artists: selectedArtistRecords
    };
    
    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-export-${bulkSelected.length}-artists-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-surface-900 relative">
      {/* Background */}
      <div aria-hidden className="fixed inset-0 -z-10 bg-studio"></div>

      {/* Header */}
      <div className="sticky top-0 z-40 bg-surface-900/95 backdrop-blur border-b border-surface-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-surface-50">Artist Portfolio</h1>
              <p className="text-sm text-surface-300">
                {compareMode 
                  ? `Select 2-3 artists to compare (${selectedArtists.length} selected)`
                  : bulkMode
                  ? `Bulk selection mode (${bulkSelected.length} selected)`
                  : 'Manage your roster of artists'
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              {compareMode && selectedArtists.length >= 2 && (
                <button
                  onClick={handleStartComparison}
                  className="px-4 py-2 rounded-lg bg-accent-600 hover:bg-accent-700 text-white font-medium transition-colors"
                >
                  Compare {selectedArtists.length} Artists
                </button>
              )}
              {bulkMode && bulkSelected.length > 0 && (
                <>
                  <button
                    onClick={handleBulkExport}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                  >
                    📥 Export {bulkSelected.length}
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
                  >
                    🗑️ Delete {bulkSelected.length}
                  </button>
                </>
              )}
              {!compareMode && !bulkMode && onShowAnalytics && portfolio.artists.length >= 2 && (
                <button
                  onClick={onShowAnalytics}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                  title="View portfolio analytics"
                >
                  📊 Analytics
                </button>
              )}
              {!compareMode && !bulkMode && onCompareArtists && portfolio.artists.length >= 2 && (
                <button
                  onClick={handleToggleCompareMode}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors"
                >
                  ⚖️ Compare
                </button>
              )}
              {!compareMode && portfolio.artists.length >= 2 && (
                <button
                  onClick={handleToggleBulkMode}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    bulkMode
                      ? 'bg-surface-700 text-surface-200 hover:bg-surface-600'
                      : 'bg-orange-600 hover:bg-orange-700 text-white'
                  }`}
                >
                  {bulkMode ? 'Cancel' : '📦 Bulk'}
                </button>
              )}
              {compareMode && (
                <button
                  onClick={handleToggleCompareMode}
                  className="px-4 py-2 rounded-lg bg-surface-700 text-surface-200 hover:bg-surface-600 font-medium transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-surface-800 text-surface-400 hover:text-surface-200 transition-colors"
                title="Close portfolio view"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-surface-800/50 rounded-lg p-3 border border-surface-700">
              <div className="text-2xl font-bold text-surface-50">{stats.total}</div>
              <div className="text-xs text-surface-400">Total Artists</div>
            </div>
            <div className="bg-surface-800/50 rounded-lg p-3 border border-surface-700">
              <div className="text-2xl font-bold text-primary-400">{stats.analyzed}</div>
              <div className="text-xs text-surface-400">Analyzed</div>
            </div>
            <div className="bg-surface-800/50 rounded-lg p-3 border border-surface-700">
              <div className="text-2xl font-bold text-accent-400">{stats.roadmaps}</div>
              <div className="text-xs text-surface-400">Roadmaps</div>
            </div>
            <div className="bg-surface-800/50 rounded-lg p-3 border border-surface-700">
              <div className="text-2xl font-bold text-green-400">
                {stats.avgQuality ? stats.avgQuality.toFixed(0) : '—'}
              </div>
              <div className="text-xs text-surface-400">Avg Quality</div>
            </div>
          </div>

          {/* Filters and Controls */}
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search artists by name, genre, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-800 border border-surface-700 text-surface-100 placeholder-surface-500 focus:bg-surface-700 focus:ring-2 focus:ring-primary-500 transition-colors"
              />
            </div>

            {/* Genre Filter */}
            <select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-surface-800 border border-surface-700 text-surface-100 focus:bg-surface-700 focus:ring-2 focus:ring-primary-500 transition-colors"
            >
              <option value="all">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>

            {/* Stage Filter */}
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-surface-800 border border-surface-700 text-surface-100 focus:bg-surface-700 focus:ring-2 focus:ring-primary-500 transition-colors"
            >
              <option value="all">All Stages</option>
              {stages.map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'lastModified' | 'stage' | 'genre')}
              className="px-3 py-2 rounded-lg bg-surface-800 border border-surface-700 text-surface-100 focus:bg-surface-700 focus:ring-2 focus:ring-primary-500 transition-colors"
            >
              <option value="name">Sort by Name</option>
              <option value="lastModified">Sort by Modified</option>
              <option value="stage">Sort by Stage</option>
              <option value="genre">Sort by Genre</option>
            </select>

            {/* Sort Order */}
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 rounded-lg bg-surface-800 border border-surface-700 text-surface-300 hover:bg-surface-700 transition-colors"
              title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              <svg className={`w-5 h-5 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
            </button>

            {/* View Mode Toggle */}
            <div className="flex gap-1 bg-surface-800 rounded-lg p-1 border border-surface-700">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-surface-400 hover:text-surface-200'}`}
                title="Grid view"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-surface-400 hover:text-surface-200'}`}
                title="List view"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* New Artist Button */}
            <button
              onClick={onNewArtist}
              className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors whitespace-nowrap flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Artist
            </button>

            {/* Bulk Selection Controls */}
            {bulkMode && (
              <div className="flex gap-2">
                <button
                  onClick={handleSelectAll}
                  className="px-3 py-2 rounded-lg bg-surface-700 hover:bg-surface-600 text-surface-200 text-sm font-medium transition-colors"
                >
                  Select All ({filteredArtists.length})
                </button>
                {bulkSelected.length > 0 && (
                  <button
                    onClick={handleDeselectAll}
                    className="px-3 py-2 rounded-lg bg-surface-700 hover:bg-surface-600 text-surface-200 text-sm font-medium transition-colors"
                  >
                    Deselect All
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Artist List/Grid */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {filteredArtists.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎤</div>
            <h3 className="text-xl font-semibold text-surface-200 mb-2">No artists found</h3>
            <p className="text-surface-400 mb-6">
              {searchQuery || genreFilter !== 'all' || stageFilter !== 'all' 
                ? 'Try adjusting your filters'
                : 'Get started by creating your first artist'}
            </p>
            {!searchQuery && genreFilter === 'all' && stageFilter === 'all' && (
              <button
                onClick={onNewArtist}
                className="px-6 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors"
              >
                Create First Artist
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArtists.map(artist => {
              const isActive = artist.id === portfolio.activeArtistId;
              const qualityScore = getArtistQualityScore(artist);
              const stage = getArtistStage(artist);

              return (
                <div
                  key={artist.id}
                  className={`group relative rounded-xl border transition-all ${
                    isActive 
                      ? 'border-primary-500 bg-primary-600/10 shadow-lg shadow-primary-600/20' 
                      : compareMode && selectedArtists.includes(artist.id)
                      ? 'border-accent-500 bg-accent-600/10 shadow-lg shadow-accent-600/20'
                        : bulkMode && bulkSelected.includes(artist.id)
                        ? 'border-orange-500 bg-orange-600/10 shadow-lg shadow-orange-600/20'
                        : 'border-surface-700 bg-surface-800/50 hover:border-surface-600 hover:shadow-lg'
                  }`}
                >
                  {/* Checkbox for compare mode */}
                  {compareMode && (
                    <div className="absolute top-3 left-3 z-10">
                      <input
                        type="checkbox"
                        checked={selectedArtists.includes(artist.id)}
                        onChange={() => handleSelectArtist(artist.id)}
                        disabled={!selectedArtists.includes(artist.id) && selectedArtists.length >= 3}
                        className="w-5 h-5 rounded border-surface-600 bg-surface-800 checked:bg-accent-600 focus:ring-2 focus:ring-accent-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  )}

                    {/* Checkbox for bulk mode */}
                    {bulkMode && (
                      <div className="absolute top-3 left-3 z-10">
                        <input
                          type="checkbox"
                          checked={bulkSelected.includes(artist.id)}
                          onChange={() => handleToggleBulkSelect(artist.id)}
                          className="w-5 h-5 rounded border-surface-600 bg-surface-800 checked:bg-orange-600 focus:ring-2 focus:ring-orange-500 cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    )}

                  <button
                      onClick={() => bulkMode ? handleToggleBulkSelect(artist.id) : handleSelectArtist(artist.id)}
                      className={`w-full p-5 text-left ${(compareMode || bulkMode) ? 'pl-12' : ''}`}
                      disabled={compareMode && !selectedArtists.includes(artist.id) && selectedArtists.length >= 3}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-surface-50 truncate group-hover:text-primary-300 transition-colors">
                          {artist.profile.artistName || 'Unnamed Artist'}
                        </h3>
                        <p className="text-sm text-surface-400 truncate">
                          {artist.profile.genres || 'No genre'}
                        </p>
                      </div>
                      {isActive && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-primary-600 text-white font-medium">
                          Active
                        </span>
                      )}
                    </div>

                    {/* Stage Badge */}
                    <div className="mb-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs border ${getStageColor(stage)}`}>
                        {stage}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <div className="text-xs text-surface-500">Quality Score</div>
                        <div className="text-lg font-bold text-surface-100">
                          {qualityScore ? qualityScore.toFixed(0) : '—'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-surface-500">City</div>
                        <div className="text-sm font-medium text-surface-200 truncate">
                          {artist.profile.city || 'Unknown'}
                        </div>
                      </div>
                    </div>

                    {/* Status Indicators */}
                    <div className="flex gap-2 text-xs">
                      {artist.state?.catalogAnalysisComplete && (
                        <span className="inline-flex items-center gap-1 text-green-400">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Analyzed
                        </span>
                      )}
                      {artist.state?.roadmapGenerated && (
                        <span className="inline-flex items-center gap-1 text-accent-400">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Roadmap
                        </span>
                      )}
                    </div>

                    {/* Last Modified */}
                    <div className="mt-3 pt-3 border-t border-surface-700 text-xs text-surface-500">
                      Modified: {new Date(artist.lastModified).toLocaleDateString()}
                    </div>
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteArtist(artist.id);
                    }}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 rounded bg-surface-900/80 text-surface-500 hover:text-red-400 hover:bg-red-900/20 transition-all"
                    title="Delete artist"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          // List View
          <div className="space-y-2">
            {filteredArtists.map(artist => {
              const isActive = artist.id === portfolio.activeArtistId;
              const qualityScore = getArtistQualityScore(artist);
              const stage = getArtistStage(artist);

              return (
                <div
                  key={artist.id}
                  className={`group relative rounded-lg border transition-all ${
                    isActive 
                      ? 'border-primary-500 bg-primary-600/10' 
                      : 'border-surface-700 bg-surface-800/50 hover:border-surface-600'
                  }`}
                >
                  <button
                    onClick={() => handleSelectArtist(artist.id)}
                    className="w-full p-4 text-left"
                  >
                    <div className="flex items-center gap-4">
                      {/* Name */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-surface-50 truncate group-hover:text-primary-300 transition-colors">
                          {artist.profile.artistName || 'Unnamed Artist'}
                        </h3>
                        <p className="text-sm text-surface-400 truncate">
                          {artist.profile.genres || 'No genre'} • {artist.profile.city || 'Unknown'}
                        </p>
                      </div>

                      {/* Stage */}
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs border ${getStageColor(stage)} whitespace-nowrap`}>
                        {stage}
                      </span>

                      {/* Quality */}
                      <div className="text-center min-w-[60px]">
                        <div className="text-xs text-surface-500">Quality</div>
                        <div className="text-base font-bold text-surface-100">
                          {qualityScore ? qualityScore.toFixed(0) : '—'}
                        </div>
                      </div>

                      {/* Status */}
                      <div className="flex gap-2">
                        {artist.state?.catalogAnalysisComplete && (
                          <span className="w-6 h-6 rounded-full bg-green-600/20 flex items-center justify-center" title="Analyzed">
                            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                        {artist.state?.roadmapGenerated && (
                          <span className="w-6 h-6 rounded-full bg-accent-600/20 flex items-center justify-center" title="Roadmap">
                            <svg className="w-4 h-4 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </div>

                      {/* Active Badge */}
                      {isActive && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-primary-600 text-white font-medium">
                          Active
                        </span>
                      )}

                      {/* Last Modified */}
                      <div className="text-xs text-surface-500 min-w-[100px] text-right">
                        {new Date(artist.lastModified).toLocaleDateString()}
                      </div>
                    </div>
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteArtist(artist.id);
                    }}
                    className="absolute top-1/2 -translate-y-1/2 right-4 opacity-0 group-hover:opacity-100 p-1.5 rounded bg-surface-900/80 text-surface-500 hover:text-red-400 hover:bg-red-900/20 transition-all"
                    title="Delete artist"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

        {/* Bulk Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-surface-800 rounded-2xl border border-surface-700 p-6 max-w-md w-full shadow-2xl">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-surface-50 mb-2">
                    Delete {bulkSelected.length} {bulkSelected.length === 1 ? 'Artist' : 'Artists'}?
                  </h3>
                  <p className="text-sm text-surface-300">
                    This will permanently delete {bulkSelected.length} {bulkSelected.length === 1 ? 'artist' : 'artists'} and all their data. This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 rounded-lg bg-surface-700 hover:bg-surface-600 text-surface-200 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBulkDelete}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
                >
                  Delete {bulkSelected.length}
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
