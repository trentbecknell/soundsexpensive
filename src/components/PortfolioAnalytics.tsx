import React, { useMemo } from 'react';
import { Portfolio } from '../types/portfolio';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PortfolioAnalyticsProps {
  portfolio: Portfolio;
  onClose: () => void;
}

export default function PortfolioAnalytics({ portfolio, onClose }: PortfolioAnalyticsProps) {
  
  // Calculate quality distribution
  const qualityDistribution = useMemo(() => {
    const ranges = [
      { range: '0-20', min: 0, max: 20, count: 0, color: '#ef4444' },
      { range: '21-40', min: 21, max: 40, count: 0, color: '#f97316' },
      { range: '41-60', min: 41, max: 60, count: 0, color: '#eab308' },
      { range: '61-80', min: 61, max: 80, count: 0, color: '#22c55e' },
      { range: '81-100', min: 81, max: 100, count: 0, color: '#10b981' }
    ];

    portfolio.artists.forEach(artist => {
      const quality = artist.state?.catalogAnalysisData?.average_score;
      if (quality) {
        const range = ranges.find(r => quality >= r.min && quality <= r.max);
        if (range) range.count++;
      }
    });

    return ranges;
  }, [portfolio.artists]);

  // Calculate genre breakdown
  const genreBreakdown = useMemo(() => {
    const genreMap = new Map<string, number>();
    
    portfolio.artists.forEach(artist => {
      const genres = artist.profile.genres || artist.state?.profile?.genres || '';
      genres.split(',').forEach((genre: string) => {
        const trimmed = genre.trim();
        if (trimmed) {
          genreMap.set(trimmed, (genreMap.get(trimmed) || 0) + 1);
        }
      });
    });

    return Array.from(genreMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Top 8 genres
  }, [portfolio.artists]);

  // Calculate stage distribution
  const stageDistribution = useMemo(() => {
    const stages = ['Hobbyist', 'Emerging', 'Developing', 'Established', 'Professional'];
    const stageMap = new Map(stages.map(s => [s, 0]));

    portfolio.artists.forEach(artist => {
      const stage = artist.state?.profile?.stage || 'Unknown';
      if (stages.includes(stage)) {
        stageMap.set(stage, (stageMap.get(stage) || 0) + 1);
      } else {
        stageMap.set('Hobbyist', (stageMap.get('Hobbyist') || 0) + 1);
      }
    });

    return stages.map(stage => ({
      stage,
      count: stageMap.get(stage) || 0
    }));
  }, [portfolio.artists]);

  // Calculate top performers
  const topPerformers = useMemo(() => {
    return portfolio.artists
      .filter(artist => artist.state?.catalogAnalysisData?.average_score)
      .map(artist => ({
        id: artist.id,
        name: artist.profile.artistName || 'Unnamed Artist',
        quality: artist.state?.catalogAnalysisData?.average_score || 0,
        tracks: artist.state?.catalogAnalysisData?.total_tracks || 0,
        consistency: artist.state?.catalogAnalysisData?.sonic_identity?.consistency_score || 0,
        stage: artist.state?.profile?.stage || 'Unknown',
        hasRoadmap: artist.state?.roadmapGenerated || false
      }))
      .sort((a, b) => b.quality - a.quality)
      .slice(0, 10);
  }, [portfolio.artists]);

  // Calculate aggregate stats
  const aggregateStats = useMemo(() => {
    const analyzed = portfolio.artists.filter(a => a.state?.catalogAnalysisComplete);
    const totalQuality = analyzed.reduce((sum, a) => sum + (a.state?.catalogAnalysisData?.average_score || 0), 0);
    const totalTracks = analyzed.reduce((sum, a) => sum + (a.state?.catalogAnalysisData?.total_tracks || 0), 0);
    const totalConsistency = analyzed.reduce((sum, a) => sum + (a.state?.catalogAnalysisData?.sonic_identity?.consistency_score || 0), 0);
    const roadmaps = portfolio.artists.filter(a => a.state?.roadmapGenerated).length;
    
    return {
      totalArtists: portfolio.artists.length,
      analyzed: analyzed.length,
      avgQuality: analyzed.length > 0 ? (totalQuality / analyzed.length).toFixed(1) : '0',
      totalTracks,
      avgConsistency: analyzed.length > 0 ? (totalConsistency / analyzed.length).toFixed(1) : '0',
      roadmaps,
      readyForRelease: analyzed.filter(a => (a.state?.catalogAnalysisData?.average_score || 0) >= 70).length
    };
  }, [portfolio.artists]);

  // Pie chart colors
  const GENRE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

  return (
    <div className="min-h-screen bg-surface-900 pb-12">
      {/* Background */}
      <div aria-hidden className="fixed inset-0 -z-10 bg-studio"></div>

      {/* Header */}
      <div className="sticky top-0 z-40 bg-surface-900/95 backdrop-blur border-b border-surface-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-surface-50">Portfolio Analytics</h1>
              <p className="text-sm text-surface-300">Aggregate insights across your roster</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-surface-800 text-surface-400 hover:text-surface-200 transition-colors"
              title="Close analytics view"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Aggregate Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div className="bg-surface-800/50 rounded-xl p-4 border border-surface-700">
            <div className="text-3xl font-bold text-surface-50">{aggregateStats.totalArtists}</div>
            <div className="text-xs text-surface-400 mt-1">Total Artists</div>
          </div>
          <div className="bg-surface-800/50 rounded-xl p-4 border border-surface-700">
            <div className="text-3xl font-bold text-primary-400">{aggregateStats.analyzed}</div>
            <div className="text-xs text-surface-400 mt-1">Analyzed</div>
          </div>
          <div className="bg-surface-800/50 rounded-xl p-4 border border-surface-700">
            <div className="text-3xl font-bold text-green-400">{aggregateStats.avgQuality}</div>
            <div className="text-xs text-surface-400 mt-1">Avg Quality</div>
          </div>
          <div className="bg-surface-800/50 rounded-xl p-4 border border-surface-700">
            <div className="text-3xl font-bold text-blue-400">{aggregateStats.totalTracks}</div>
            <div className="text-xs text-surface-400 mt-1">Total Tracks</div>
          </div>
          <div className="bg-surface-800/50 rounded-xl p-4 border border-surface-700">
            <div className="text-3xl font-bold text-purple-400">{aggregateStats.avgConsistency}%</div>
            <div className="text-xs text-surface-400 mt-1">Avg Identity</div>
          </div>
          <div className="bg-surface-800/50 rounded-xl p-4 border border-surface-700">
            <div className="text-3xl font-bold text-accent-400">{aggregateStats.roadmaps}</div>
            <div className="text-xs text-surface-400 mt-1">Roadmaps</div>
          </div>
          <div className="bg-surface-800/50 rounded-xl p-4 border border-surface-700">
            <div className="text-3xl font-bold text-green-400">{aggregateStats.readyForRelease}</div>
            <div className="text-xs text-surface-400 mt-1">Release Ready</div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quality Distribution */}
          <div className="rounded-2xl border border-surface-700 bg-surface-800/50 p-6">
            <h3 className="text-lg font-semibold text-surface-50 mb-4">Quality Distribution</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={qualityDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis 
                    dataKey="range" 
                    tick={{ fill: '#cbd5e1', fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    label={{ value: 'Artists', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #475569',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: '#f1f5f9' }}
                  />
                  <Bar dataKey="count" fill="#3b82f6">
                    {qualityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-surface-400 mt-2 text-center">
              Catalog quality scores (only analyzed artists)
            </p>
          </div>

          {/* Genre Breakdown */}
          <div className="rounded-2xl border border-surface-700 bg-surface-800/50 p-6">
            <h3 className="text-lg font-semibold text-surface-50 mb-4">Genre Breakdown</h3>
            {genreBreakdown.length > 0 ? (
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genreBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {genreBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={GENRE_COLORS[index % GENRE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #475569',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-surface-400">
                No genre data available
              </div>
            )}
            <p className="text-xs text-surface-400 mt-2 text-center">
              Distribution of genres across portfolio
            </p>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stage Distribution */}
          <div className="rounded-2xl border border-surface-700 bg-surface-800/50 p-6">
            <h3 className="text-lg font-semibold text-surface-50 mb-4">Career Stage Distribution</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stageDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis 
                    type="number" 
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="stage" 
                    tick={{ fill: '#cbd5e1', fontSize: 12 }}
                    width={100}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #475569',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: '#f1f5f9' }}
                  />
                  <Bar dataKey="count" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-surface-400 mt-2 text-center">
              Artists by career maturity level
            </p>
          </div>

          {/* Top Performers Leaderboard */}
          <div className="rounded-2xl border border-surface-700 bg-surface-800/50 p-6">
            <h3 className="text-lg font-semibold text-surface-50 mb-4">Top Performers</h3>
            {topPerformers.length > 0 ? (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {topPerformers.map((artist, index) => (
                  <div
                    key={artist.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-surface-700/50 hover:bg-surface-700 transition-colors"
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-yellow-600/20 text-yellow-400' :
                      index === 1 ? 'bg-gray-600/20 text-gray-400' :
                      index === 2 ? 'bg-orange-600/20 text-orange-400' :
                      'bg-surface-600 text-surface-400'
                    }`}>
                      #{index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-surface-100 truncate">{artist.name}</div>
                      <div className="text-xs text-surface-400">
                        {artist.tracks} tracks • {artist.stage}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary-400">{artist.quality}</div>
                      <div className="text-xs text-surface-400">Quality</div>
                    </div>
                    {artist.hasRoadmap && (
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center gap-1 text-xs text-accent-400">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-surface-400">
                No analyzed artists yet
              </div>
            )}
            <p className="text-xs text-surface-400 mt-4 text-center">
              Ranked by catalog quality score
            </p>
          </div>
        </div>

        {/* Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-green-700/30 bg-green-900/10 p-5">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-600/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-green-100 mb-1">Release Ready</h4>
                <p className="text-sm text-green-300/80">
                  {aggregateStats.readyForRelease} {aggregateStats.readyForRelease === 1 ? 'artist has' : 'artists have'} catalog quality ≥70 and {aggregateStats.readyForRelease === 1 ? 'is' : 'are'} ready for strategic releases
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-blue-700/30 bg-blue-900/10 p-5">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-blue-100 mb-1">Portfolio Health</h4>
                <p className="text-sm text-blue-300/80">
                  {((aggregateStats.analyzed / aggregateStats.totalArtists) * 100).toFixed(0)}% analyzed • Avg quality {aggregateStats.avgQuality}/100 • {aggregateStats.totalTracks} total tracks
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-purple-700/30 bg-purple-900/10 p-5">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-purple-100 mb-1">Planning Status</h4>
                <p className="text-sm text-purple-300/80">
                  {aggregateStats.roadmaps}/{aggregateStats.totalArtists} artists have complete roadmaps ({((aggregateStats.roadmaps / aggregateStats.totalArtists) * 100).toFixed(0)}%)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Recommendations */}
        {aggregateStats.analyzed < aggregateStats.totalArtists && (
          <div className="rounded-2xl border border-accent-700 bg-accent-900/20 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent-600/20 flex items-center justify-center">
                <span className="text-2xl">💡</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-accent-100 mb-2">Recommendation</h3>
                <p className="text-surface-300 text-sm">
                  You have {aggregateStats.totalArtists - aggregateStats.analyzed} unanalyzed {aggregateStats.totalArtists - aggregateStats.analyzed === 1 ? 'artist' : 'artists'}. 
                  Complete catalog analysis for all artists to unlock full portfolio insights and make data-driven investment decisions.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
