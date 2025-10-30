import React, { useMemo } from 'react';
import { ArtistRecord } from '../types/portfolio';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ArtistComparisonViewProps {
  artists: ArtistRecord[];
  onClose: () => void;
  onRemoveArtist: (artistId: string) => void;
}

export default function ArtistComparisonView({
  artists,
  onClose,
  onRemoveArtist
}: ArtistComparisonViewProps) {
  
  // Calculate investment readiness score (0-100)
  const calculateReadinessScore = (artist: ArtistRecord): number => {
    const stageScores = artist.state?.profile?.stageScores || {};
    const catalogQuality = artist.state?.catalogAnalysisData?.average_score || 0;
    const hasRoadmap = artist.state?.roadmapGenerated ? 10 : 0;
    const hasAnalysis = artist.state?.catalogAnalysisComplete ? 10 : 0;
    
    // Average stage scores (0-5 scale) converted to percentage
    const values = Object.values(stageScores);
    const avgStageScore = values.reduce((sum: number, val) => sum + (val as number), 0) / 
                          (values.length || 1);
    const stagePercentage = (avgStageScore / 5) * 60; // 60% weight
    
    // Catalog quality (0-100 scale) with 20% weight
    const qualityPercentage = (catalogQuality / 100) * 20;
    
    // Completion bonuses
    const completionBonus = hasRoadmap + hasAnalysis;
    
    return Math.min(100, Math.round(stagePercentage + qualityPercentage + completionBonus));
  };

  // Prepare radar chart data
  const radarData = useMemo(() => {
    const categories = ['Craft', 'Catalog', 'Brand', 'Team', 'Audience', 'Ops'];
    const keys = ['craft', 'catalog', 'brand', 'team', 'audience', 'ops'];
    
    return categories.map((category, index) => {
      const dataPoint: any = { category, fullMark: 5 };
      
      artists.forEach((artist, artistIndex) => {
        const stageScores = artist.state?.profile?.stageScores || {};
        const key = keys[index];
        dataPoint[`artist${artistIndex}`] = stageScores[key] || 0;
        dataPoint[`artistName${artistIndex}`] = artist.profile.artistName || `Artist ${artistIndex + 1}`;
      });
      
      return dataPoint;
    });
  }, [artists]);

  // Calculate comparison metrics
  const comparisonMetrics = useMemo(() => {
    return artists.map(artist => {
      const catalogData = artist.state?.catalogAnalysisData;
      const stageScores = artist.state?.profile?.stageScores || {};
      const values = Object.values(stageScores);
      const avgStageScore = values.reduce((sum: number, val) => sum + (val as number), 0) / 
                           (values.length || 1);
      
      return {
        id: artist.id,
        name: artist.profile.artistName || 'Unnamed Artist',
        genre: artist.profile.genres || 'Unknown',
        stage: artist.state?.profile?.stage || 'Unknown',
        qualityScore: catalogData?.average_score || 0,
        trackCount: catalogData?.total_tracks || 0,
        consistency: catalogData?.sonic_identity?.consistency_score || 0,
        trend: catalogData?.score_trend || 'stable',
        avgStageScore: avgStageScore.toFixed(1),
        readinessScore: calculateReadinessScore(artist),
        hasRoadmap: artist.state?.roadmapGenerated || false,
        hasAnalysis: artist.state?.catalogAnalysisComplete || false,
        lastModified: new Date(artist.lastModified).toLocaleDateString()
      };
    });
  }, [artists]);

  // Generate recommendation
  const recommendation = useMemo(() => {
    if (artists.length < 2) return null;
    
    const sorted = [...comparisonMetrics].sort((a, b) => b.readinessScore - a.readinessScore);
    const top = sorted[0];
    const reasons = [];
    
    if (top.qualityScore >= 70) reasons.push(`highest catalog quality (${top.qualityScore}/100)`);
    if (top.hasRoadmap) reasons.push('has complete roadmap');
    if (top.trend === 'improving') reasons.push('quality trend is improving');
    if (top.consistency >= 80) reasons.push(`strong sonic identity (${top.consistency}% consistency)`);
    if (parseFloat(top.avgStageScore) >= 3.5) reasons.push('advanced stage development');
    
    const action = top.qualityScore >= 75 ? 'ready for album or major release' : 
                   top.qualityScore >= 60 ? 'ready for EP or strategic singles' :
                   'needs catalog development before major release';
    
    return {
      artist: top.name,
      score: top.readinessScore,
      reasons: reasons.slice(0, 3),
      action
    };
  }, [comparisonMetrics]);

  // Chart colors for up to 3 artists
  const chartColors = ['#3b82f6', '#10b981', '#f59e0b'];

  return (
    <div className="min-h-screen bg-surface-900 pb-12">
      {/* Background */}
      <div aria-hidden className="fixed inset-0 -z-10 bg-studio"></div>

      {/* Header */}
      <div className="sticky top-0 z-40 bg-surface-900/95 backdrop-blur border-b border-surface-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-surface-50">Artist Comparison</h1>
              <p className="text-sm text-surface-300">
                Comparing {artists.length} {artists.length === 1 ? 'artist' : 'artists'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-surface-800 text-surface-400 hover:text-surface-200 transition-colors"
              title="Close comparison view"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Selected Artists Pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {artists.map((artist, index) => (
              <div
                key={artist.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm"
                style={{ 
                  borderColor: chartColors[index], 
                  backgroundColor: `${chartColors[index]}20` 
                }}
              >
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: chartColors[index] }}
                ></div>
                <span className="font-medium text-surface-100">
                  {artist.profile.artistName || `Artist ${index + 1}`}
                </span>
                <button
                  onClick={() => onRemoveArtist(artist.id)}
                  className="ml-1 p-0.5 hover:bg-surface-700 rounded"
                  title="Remove from comparison"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Recommendation Card */}
        {recommendation && (
          <div className="rounded-2xl border border-accent-700 bg-accent-900/20 p-6 backdrop-blur">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent-600/20 flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-accent-100 mb-2">
                  Recommendation: Prioritize {recommendation.artist}
                </h2>
                <p className="text-surface-300 text-sm mb-3">
                  Investment readiness score: <span className="font-bold text-accent-400">{recommendation.score}/100</span>
                </p>
                {recommendation.reasons.length > 0 && (
                  <ul className="space-y-1 mb-3">
                    {recommendation.reasons.map((reason, i) => (
                      <li key={i} className="text-sm text-surface-300 flex items-center gap-2">
                        <svg className="w-4 h-4 text-accent-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {reason}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="px-3 py-2 rounded-lg bg-accent-600/10 border border-accent-600/30">
                  <span className="text-sm font-medium text-accent-200">
                    Next Action: {recommendation.action}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Radar Chart - Stage Scores Comparison */}
        <div className="rounded-2xl border border-surface-700 bg-surface-800/50 p-6">
          <h3 className="text-lg font-semibold text-surface-50 mb-4">Stage Development Comparison</h3>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#475569" />
                <PolarAngleAxis 
                  dataKey="category" 
                  tick={{ fill: '#cbd5e1', fontSize: 12 }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 5]} 
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                />
                {artists.map((artist, index) => (
                  <Radar
                    key={artist.id}
                    name={artist.profile.artistName || `Artist ${index + 1}`}
                    dataKey={`artist${index}`}
                    stroke={chartColors[index]}
                    fill={chartColors[index]}
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                ))}
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #475569',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-surface-400 mt-4 text-center">
            Scale: 1 = Emerging, 3 = Developing, 5 = Professional
          </p>
        </div>

        {/* Metrics Comparison Table */}
        <div className="rounded-2xl border border-surface-700 bg-surface-800/50 overflow-hidden">
          <div className="p-6 border-b border-surface-700">
            <h3 className="text-lg font-semibold text-surface-50">Key Metrics Comparison</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-300 uppercase tracking-wider">
                    Metric
                  </th>
                  {comparisonMetrics.map((artist, index) => (
                    <th key={artist.id} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: chartColors[index] }}>
                      {artist.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-700">
                {/* Investment Readiness */}
                <tr className="hover:bg-surface-700/30">
                  <td className="px-6 py-4 text-sm font-medium text-surface-200">
                    Investment Readiness
                  </td>
                  {comparisonMetrics.map((artist, index) => (
                    <td key={artist.id} className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-bold" style={{ color: chartColors[index] }}>
                          {artist.readinessScore}/100
                        </div>
                        {artist.readinessScore >= 75 && (
                          <span className="text-xs px-2 py-0.5 bg-green-600/20 text-green-400 rounded">High</span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Stage */}
                <tr className="hover:bg-surface-700/30">
                  <td className="px-6 py-4 text-sm font-medium text-surface-200">
                    Career Stage
                  </td>
                  {comparisonMetrics.map(artist => (
                    <td key={artist.id} className="px-6 py-4 text-sm text-surface-300">
                      {artist.stage}
                    </td>
                  ))}
                </tr>

                {/* Genre */}
                <tr className="hover:bg-surface-700/30">
                  <td className="px-6 py-4 text-sm font-medium text-surface-200">
                    Genre
                  </td>
                  {comparisonMetrics.map(artist => (
                    <td key={artist.id} className="px-6 py-4 text-sm text-surface-300">
                      {artist.genre}
                    </td>
                  ))}
                </tr>

                {/* Catalog Quality */}
                <tr className="hover:bg-surface-700/30">
                  <td className="px-6 py-4 text-sm font-medium text-surface-200">
                    Catalog Quality
                  </td>
                  {comparisonMetrics.map((artist, index) => (
                    <td key={artist.id} className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="text-base font-semibold" style={{ color: chartColors[index] }}>
                          {artist.qualityScore > 0 ? `${artist.qualityScore}/100` : '—'}
                        </div>
                        {artist.trend !== 'stable' && (
                          <span className={`text-xs ${artist.trend === 'improving' ? 'text-green-400' : 'text-orange-400'}`}>
                            {artist.trend === 'improving' ? '↗' : '↘'}
                          </span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Track Count */}
                <tr className="hover:bg-surface-700/30">
                  <td className="px-6 py-4 text-sm font-medium text-surface-200">
                    Catalog Size
                  </td>
                  {comparisonMetrics.map(artist => (
                    <td key={artist.id} className="px-6 py-4 text-sm text-surface-300">
                      {artist.trackCount > 0 ? `${artist.trackCount} tracks` : '—'}
                    </td>
                  ))}
                </tr>

                {/* Sonic Consistency */}
                <tr className="hover:bg-surface-700/30">
                  <td className="px-6 py-4 text-sm font-medium text-surface-200">
                    Sonic Identity
                  </td>
                  {comparisonMetrics.map((artist, index) => (
                    <td key={artist.id} className="px-6 py-4">
                      <div className="text-sm" style={{ color: chartColors[index] }}>
                        {artist.consistency > 0 ? `${artist.consistency}%` : '—'}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Avg Stage Score */}
                <tr className="hover:bg-surface-700/30">
                  <td className="px-6 py-4 text-sm font-medium text-surface-200">
                    Avg Stage Score
                  </td>
                  {comparisonMetrics.map((artist, index) => (
                    <td key={artist.id} className="px-6 py-4">
                      <div className="text-sm" style={{ color: chartColors[index] }}>
                        {artist.avgStageScore}/5.0
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Completion Status */}
                <tr className="hover:bg-surface-700/30">
                  <td className="px-6 py-4 text-sm font-medium text-surface-200">
                    Status
                  </td>
                  {comparisonMetrics.map(artist => (
                    <td key={artist.id} className="px-6 py-4">
                      <div className="flex gap-2">
                        {artist.hasAnalysis && (
                          <span className="inline-flex items-center gap-1 text-xs text-green-400">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Analyzed
                          </span>
                        )}
                        {artist.hasRoadmap && (
                          <span className="inline-flex items-center gap-1 text-xs text-accent-400">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Roadmap
                          </span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Last Modified */}
                <tr className="hover:bg-surface-700/30">
                  <td className="px-6 py-4 text-sm font-medium text-surface-200">
                    Last Modified
                  </td>
                  {comparisonMetrics.map(artist => (
                    <td key={artist.id} className="px-6 py-4 text-sm text-surface-400">
                      {artist.lastModified}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-surface-700 bg-surface-800/50 p-4">
            <div className="text-xs text-surface-400 mb-1">Highest Quality</div>
            <div className="text-lg font-bold text-primary-400">
              {comparisonMetrics.reduce((max, artist) => 
                artist.qualityScore > max.qualityScore ? artist : max
              ).name}
            </div>
            <div className="text-sm text-surface-300">
              {comparisonMetrics.reduce((max, artist) => 
                artist.qualityScore > max.qualityScore ? artist : max
              ).qualityScore}/100
            </div>
          </div>

          <div className="rounded-xl border border-surface-700 bg-surface-800/50 p-4">
            <div className="text-xs text-surface-400 mb-1">Largest Catalog</div>
            <div className="text-lg font-bold text-green-400">
              {comparisonMetrics.reduce((max, artist) => 
                artist.trackCount > max.trackCount ? artist : max
              ).name}
            </div>
            <div className="text-sm text-surface-300">
              {comparisonMetrics.reduce((max, artist) => 
                artist.trackCount > max.trackCount ? artist : max
              ).trackCount} tracks
            </div>
          </div>

          <div className="rounded-xl border border-surface-700 bg-surface-800/50 p-4">
            <div className="text-xs text-surface-400 mb-1">Most Consistent</div>
            <div className="text-lg font-bold text-accent-400">
              {comparisonMetrics.reduce((max, artist) => 
                artist.consistency > max.consistency ? artist : max
              ).name}
            </div>
            <div className="text-sm text-surface-300">
              {comparisonMetrics.reduce((max, artist) => 
                artist.consistency > max.consistency ? artist : max
              ).consistency}% identity
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
