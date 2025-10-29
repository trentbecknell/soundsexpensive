// Artist Catalog Analysis Library
// Analyzes multiple tracks to identify trends, consistency, and growth over time

import { analyzeMix } from './mixAnalysis';
import type { MixAnalysisResult } from '../types/mixAnalysis';
import type {
  CatalogTrack,
  CatalogAnalysisResult,
  CatalogTrend,
  CatalogInsight,
  QualityProgression,
  GenreConsistency,
  SonicIdentity,
  TimelineDataPoint,
} from '../types/catalogAnalysis';

/**
 * Analyze multiple tracks to identify patterns and trends
 */
export async function analyzeCatalog(
  tracks: CatalogTrack[],
  targetGenre: string = 'Pop'
): Promise<CatalogAnalysisResult> {
  // Analyze all tracks
  const analyzedTracks: CatalogTrack[] = [];
  
  for (const track of tracks) {
    if (!track.analysis) {
      // If track has pre-fetched audio_features (from Spotify), create analysis directly
      if (track.audio_features) {
        const analysis: MixAnalysisResult = {
          file_info: {
            name: track.name,
            size_bytes: 0,
            format: 'streaming',
          },
          mixing_stage: 'mastered',
          audio_features: track.audio_features,
          benchmarks_used: {
            genre: targetGenre,
            tempo_bpm: [80, 140],
            danceability: [0.4, 0.9],
            energy: [0.4, 0.9],
            valence: [0.3, 0.8],
            loudness_db: [-10, -4],
            dynamic_range_db: [6, 14],
            stereo_width: [0.5, 0.9],
            typical_intro_seconds: [0, 30],
            typical_duration_seconds: [150, 300],
          },
          score: {
            overall: calculateOverallScore(track.audio_features, targetGenre),
            breakdown: {
              loudness: 70,
              dynamics: 70,
              frequency_balance: 70,
              stereo_imaging: 70,
              genre_alignment: calculateGenreAlignment(track.audio_features, targetGenre),
              commercial_readiness: calculateCommercialReadiness(track.audio_features),
            },
          },
          issues: [],
          strengths: [`High energy track (${Math.round(track.audio_features.energy * 100)}%)`, `Good danceability (${Math.round(track.audio_features.danceability * 100)}%)`],
          overall_assessment: `This track from ${track.artist || 'streaming service'} scores ${calculateOverallScore(track.audio_features, targetGenre)}/100 for ${targetGenre}.`,
          next_steps: [],
          stage_appropriate_tips: [],
          analysis_timestamp: new Date().toISOString(),
        };
        
        analyzedTracks.push({
          ...track,
          analysis,
        });
      } else if (track.file) {
        // Traditional file-based analysis
        const analysis = await analyzeMix(track.file, targetGenre, 'not-sure');
        analyzedTracks.push({
          ...track,
          analysis,
        });
      } else {
        throw new Error(`Track ${track.name} has no file or audio features`);
      }
    } else {
      analyzedTracks.push(track);
    }
  }
  
  // Calculate overall metrics
  const scores = analyzedTracks.map(t => t.analysis!.score.overall);
  const averageScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  
  // Analyze quality progression
  const qualityProgression = analyzeQualityProgression(analyzedTracks);
  
  // Analyze genre consistency
  const genreConsistency = analyzeGenreConsistency(analyzedTracks);
  
  // Analyze sonic identity
  const sonicIdentity = analyzeSonicIdentity(analyzedTracks);
  
  // Identify trends
  const trends = identifyTrends(analyzedTracks);
  
  // Generate insights
  const insights = generateInsights(analyzedTracks, qualityProgression, genreConsistency, sonicIdentity);
  
  // Find best and worst tracks
  const sortedByScore = [...analyzedTracks].sort((a, b) => 
    b.analysis!.score.overall - a.analysis!.score.overall
  );
  
  const bestTrack = sortedByScore[0];
  const worstTracks = sortedByScore.slice(-2);
  
  // Generate recommendations
  const overallRecommendations = generateOverallRecommendations(
    qualityProgression,
    genreConsistency,
    sonicIdentity,
    trends
  );
  
  const nextReleaseGuidance = generateNextReleaseGuidance(
    bestTrack,
    qualityProgression,
    sonicIdentity
  );
  
  return {
    total_tracks: analyzedTracks.length,
    analysis_date: new Date().toISOString(),
    average_score: Math.round(averageScore),
    score_trend: qualityProgression.trend === 'inconsistent' ? 'stable' : qualityProgression.trend,
    tracks: analyzedTracks,
    quality_progression: qualityProgression,
    genre_consistency: genreConsistency,
    sonic_identity: sonicIdentity,
    trends,
    insights,
    best_performing_track: {
      name: bestTrack.name,
      score: bestTrack.analysis!.score.overall,
      strengths: bestTrack.analysis!.strengths,
    },
    needs_improvement: worstTracks.map(track => ({
      name: track.name,
      score: track.analysis!.score.overall,
      issues: track.analysis!.issues.slice(0, 3).map(i => i.title),
    })),
    overall_recommendations: overallRecommendations,
    next_release_guidance: nextReleaseGuidance,
  };
}

/**
 * Analyze quality progression over time
 */
function analyzeQualityProgression(tracks: CatalogTrack[]): QualityProgression {
  const scores = tracks.map(t => t.analysis!.score.overall);
  const averageScore = Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);
  
  // Calculate trend using linear regression
  let trend: 'improving' | 'declining' | 'inconsistent' = 'inconsistent';
  
  if (scores.length >= 3) {
    const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
    const secondHalf = scores.slice(Math.floor(scores.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, s) => sum + s, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, s) => sum + s, 0) / secondHalf.length;
    
    const improvement = secondAvg - firstAvg;
    
    if (improvement > 5) trend = 'improving';
    else if (improvement < -5) trend = 'declining';
    else trend = 'inconsistent';
  }
  
  const sortedScores = [...scores].sort((a, b) => a - b);
  const scoreRange: [number, number] = [sortedScores[0], sortedScores[sortedScores.length - 1]];
  
  const sortedTracks = [...tracks].sort((a, b) => 
    b.analysis!.score.overall - a.analysis!.score.overall
  );
  
  return {
    trend,
    average_score: averageScore,
    score_range: scoreRange,
    best_track: sortedTracks[0].name,
    weakest_track: sortedTracks[sortedTracks.length - 1].name,
    improvement_rate: trend === 'improving' ? Math.abs(scores[scores.length - 1] - scores[0]) / scores.length : undefined,
  };
}

/**
 * Analyze genre consistency across catalog
 */
function analyzeGenreConsistency(tracks: CatalogTrack[]): GenreConsistency {
  const genreCounts: Record<string, number> = {};
  
  tracks.forEach(track => {
    const genre = track.analysis!.benchmarks_used.genre;
    genreCounts[genre] = (genreCounts[genre] || 0) + 1;
  });
  
  const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);
  const primaryGenre = sortedGenres[0][0];
  const primaryCount = sortedGenres[0][1];
  
  const consistencyScore = Math.round((primaryCount / tracks.length) * 100);
  
  const genreDistribution = Object.fromEntries(
    Object.entries(genreCounts).map(([genre, count]) => [
      genre,
      Math.round((count / tracks.length) * 100),
    ])
  );
  
  let recommendation = '';
  if (consistencyScore >= 80) {
    recommendation = `Strong ${primaryGenre} identity. Fans know what to expect from your music.`;
  } else if (consistencyScore >= 60) {
    recommendation = `Mostly ${primaryGenre} but with some variety. Consider clarifying your sound or embracing genre-blending.`;
  } else {
    recommendation = 'Very diverse sound. Consider whether you want to be known for versatility or focus on one genre.';
  }
  
  return {
    primary_genre: primaryGenre,
    consistency_score: consistencyScore,
    genre_distribution: genreDistribution,
    recommendation,
  };
}

/**
 * Analyze sonic identity and consistency
 */
function analyzeSonicIdentity(tracks: CatalogTrack[]): SonicIdentity {
  const tempos = tracks.map(t => t.analysis!.audio_features.tempo_bpm);
  const energies = tracks.map(t => t.analysis!.audio_features.energy);
  
  const avgTempo = tempos.reduce((sum, t) => sum + t, 0) / tempos.length;
  const avgEnergy = energies.reduce((sum, e) => sum + e, 0) / energies.length;
  
  const tempoStdDev = Math.sqrt(
    tempos.reduce((sum, t) => sum + Math.pow(t - avgTempo, 2), 0) / tempos.length
  );
  const energyStdDev = Math.sqrt(
    energies.reduce((sum, e) => sum + Math.pow(e - avgEnergy, 2), 0) / energies.length
  );
  
  const tempoRange: [number, number] = [
    Math.round(avgTempo - tempoStdDev),
    Math.round(avgTempo + tempoStdDev),
  ];
  
  const energyRange: [number, number] = [
    Math.max(0, avgEnergy - energyStdDev),
    Math.min(1, avgEnergy + energyStdDev),
  ];
  
  // Identify common traits
  const commonTraits: string[] = [];
  
  if (avgTempo < 90) commonTraits.push('Slow, deliberate tempos');
  else if (avgTempo > 130) commonTraits.push('Upbeat, energetic tempos');
  else commonTraits.push('Mid-tempo grooves');
  
  if (avgEnergy > 0.7) commonTraits.push('High-energy production');
  else if (avgEnergy < 0.5) commonTraits.push('Laid-back, chill vibe');
  else commonTraits.push('Balanced energy');
  
  // Find outliers (tracks significantly different from average)
  const outliers: string[] = [];
  tracks.forEach(track => {
    const tempo = track.analysis!.audio_features.tempo_bpm;
    const energy = track.analysis!.audio_features.energy;
    
    if (Math.abs(tempo - avgTempo) > tempoStdDev * 2 || 
        Math.abs(energy - avgEnergy) > energyStdDev * 2) {
      outliers.push(track.name);
    }
  });
  
  // Calculate consistency score
  const tempoConsistency = Math.max(0, 100 - (tempoStdDev / avgTempo * 100));
  const energyConsistency = Math.max(0, 100 - (energyStdDev * 100));
  const consistencyScore = Math.round((tempoConsistency + energyConsistency) / 2);
  
  let recommendation = '';
  if (consistencyScore >= 75) {
    recommendation = 'Strong sonic signature. Your tracks have a recognizable sound.';
  } else if (consistencyScore >= 50) {
    recommendation = 'Moderate consistency. Consider developing a more distinct sonic identity.';
  } else {
    recommendation = 'Very diverse sonic palette. Decide if you want a signature sound or embrace variety.';
  }
  
  return {
    signature_sound: {
      tempo_range: tempoRange,
      energy_range: energyRange,
      common_traits: commonTraits,
    },
    consistency_score: consistencyScore,
    outlier_tracks: outliers,
    recommendation,
  };
}

/**
 * Identify trends across catalog metrics
 */
function identifyTrends(tracks: CatalogTrack[]): CatalogTrend[] {
  const trends: CatalogTrend[] = [];
  
  if (tracks.length < 3) return trends;
  
  // Analyze loudness trend
  const loudnessValues = tracks.map(t => t.analysis!.audio_features.loudness_db);
  const loudnessTrend = calculateTrend(loudnessValues);
  if (Math.abs(loudnessTrend.change) > 1) {
    trends.push({
      metric: 'Loudness',
      direction: loudnessTrend.direction,
      change_percentage: Math.abs(loudnessTrend.change),
      description: loudnessTrend.direction === 'improving' 
        ? 'Your mixes are getting louder over time' 
        : 'Your mixes are getting quieter over time',
    });
  }
  
  // Analyze dynamic range trend
  const dynamicsValues = tracks.map(t => t.analysis!.score.breakdown.dynamics * 100);
  const dynamicsTrend = calculateTrend(dynamicsValues);
  if (Math.abs(dynamicsTrend.change) > 5) {
    trends.push({
      metric: 'Dynamics',
      direction: dynamicsTrend.direction,
      change_percentage: Math.abs(dynamicsTrend.change),
      description: dynamicsTrend.direction === 'improving'
        ? 'Your dynamic range control is improving'
        : 'Your dynamic range control is declining',
    });
  }
  
  // Analyze frequency balance trend
  const freqValues = tracks.map(t => t.analysis!.score.breakdown.frequency_balance * 100);
  const freqTrend = calculateTrend(freqValues);
  if (Math.abs(freqTrend.change) > 5) {
    trends.push({
      metric: 'Frequency Balance',
      direction: freqTrend.direction,
      change_percentage: Math.abs(freqTrend.change),
      description: freqTrend.direction === 'improving'
        ? 'Your frequency balance is improving'
        : 'Your frequency balance needs attention',
    });
  }
  
  return trends;
}

/**
 * Calculate trend direction and magnitude
 */
function calculateTrend(values: number[]): { direction: 'improving' | 'declining' | 'stable'; change: number } {
  const firstHalf = values.slice(0, Math.floor(values.length / 2));
  const secondHalf = values.slice(Math.floor(values.length / 2));
  
  const firstAvg = firstHalf.reduce((sum, v) => sum + v, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, v) => sum + v, 0) / secondHalf.length;
  
  const change = ((secondAvg - firstAvg) / firstAvg) * 100;
  
  let direction: 'improving' | 'declining' | 'stable';
  if (change > 3) direction = 'improving';
  else if (change < -3) direction = 'declining';
  else direction = 'stable';
  
  return { direction, change };
}

/**
 * Generate catalog insights
 */
function generateInsights(
  tracks: CatalogTrack[],
  quality: QualityProgression,
  genre: GenreConsistency,
  sonic: SonicIdentity
): CatalogInsight[] {
  const insights: CatalogInsight[] = [];
  
  // Quality insights
  if (quality.trend === 'improving') {
    insights.push({
      type: 'strength',
      title: 'Consistent Growth',
      description: `Your production quality has improved by an average of ${quality.improvement_rate?.toFixed(1)}% per release. Keep up the momentum!`,
    });
  } else if (quality.trend === 'declining') {
    insights.push({
      type: 'weakness',
      title: 'Quality Inconsistency',
      description: 'Recent releases score lower than earlier work. Review what made your best tracks successful.',
      tracks_affected: tracks.slice(-2).map(t => t.name),
    });
  }
  
  // Genre insights
  if (genre.consistency_score < 60) {
    insights.push({
      type: 'opportunity',
      title: 'Genre Exploration',
      description: `You're experimenting with multiple genres (${Object.keys(genre.genre_distribution).join(', ')}). Consider whether to specialize or embrace genre-blending as your brand.`,
    });
  }
  
  // Sonic identity insights
  if (sonic.consistency_score >= 75) {
    insights.push({
      type: 'strength',
      title: 'Strong Sonic Identity',
      description: `You have a recognizable sound (${sonic.signature_sound.common_traits.join(', ')}). This helps with fan retention.`,
    });
  }
  
  if (sonic.outlier_tracks.length > 0) {
    insights.push({
      type: 'trend',
      title: 'Sonic Experimentation',
      description: `Some tracks deviate from your typical sound. These could be creative risks or genre exploration.`,
      tracks_affected: sonic.outlier_tracks,
    });
  }
  
  return insights;
}

/**
 * Generate overall recommendations
 */
function generateOverallRecommendations(
  quality: QualityProgression,
  genre: GenreConsistency,
  sonic: SonicIdentity,
  trends: CatalogTrend[]
): string[] {
  const recs: string[] = [];
  
  if (quality.trend === 'declining' || quality.score_range[1] - quality.score_range[0] > 20) {
    recs.push('Focus on consistency. Study your highest-scoring tracks and replicate their production approach.');
  }
  
  if (genre.consistency_score < 70) {
    recs.push(`Consider establishing yourself in ${genre.primary_genre} before branching out, or embrace genre-blending as your unique brand.`);
  }
  
  if (sonic.consistency_score < 60) {
    recs.push('Develop a signature sound. Consistent tempo ranges, production techniques, and sonic choices help fans recognize your music instantly.');
  }
  
  const decliningTrends = trends.filter(t => t.direction === 'declining');
  if (decliningTrends.length > 0) {
    recs.push(`Pay attention to ${decliningTrends.map(t => t.metric.toLowerCase()).join(' and ')} - these metrics are declining across recent releases.`);
  }
  
  if (quality.average_score < 70) {
    recs.push('Consider investing in better mixing/mastering or taking additional production courses to elevate overall quality.');
  }
  
  return recs;
}

/**
 * Generate guidance for next release
 */
function generateNextReleaseGuidance(
  bestTrack: CatalogTrack,
  quality: QualityProgression,
  sonic: SonicIdentity
): string[] {
  const guidance: string[] = [];
  
  guidance.push(`Model your next release after "${bestTrack.name}" - your highest-scoring track (${bestTrack.analysis!.score.overall}/100).`);
  
  const bestFeatures = bestTrack.analysis!.audio_features;
  guidance.push(`Target tempo: ${Math.round(bestFeatures.tempo_bpm)} BPM (±10), Energy: ${(bestFeatures.energy * 100).toFixed(0)}%`);
  
  if (sonic.consistency_score >= 70) {
    guidance.push(`Stay within your sonic signature: ${sonic.signature_sound.common_traits.join(', ')}`);
  }
  
  if (quality.trend === 'improving') {
    guidance.push('Continue your upward trajectory - you\'re on the right path!');
  } else {
    guidance.push('Focus on quality over quantity for your next release.');
  }
  
  return guidance;
}

/**
 * Get timeline data for visualization
 */
export function getTimelineData(tracks: CatalogTrack[]): TimelineDataPoint[] {
  return tracks.map((track, index) => ({
    track_name: track.name.length > 20 ? track.name.substring(0, 17) + '...' : track.name,
    track_number: index + 1,
    overall_score: track.analysis!.score.overall,
    loudness: Math.round(track.analysis!.score.breakdown.loudness * 100),
    dynamics: Math.round(track.analysis!.score.breakdown.dynamics * 100),
    frequency_balance: Math.round(track.analysis!.score.breakdown.frequency_balance * 100),
    stereo_imaging: Math.round(track.analysis!.score.breakdown.stereo_imaging * 100),
    genre_alignment: Math.round(track.analysis!.score.breakdown.genre_alignment * 100),
    commercial_readiness: Math.round(track.analysis!.score.breakdown.commercial_readiness * 100),
  }));
}

/**
 * Calculate overall score from audio features (for Spotify imports)
 */
function calculateOverallScore(features: import('../types/mixAnalysis').AudioFeatures, targetGenre: string): number {
  const genreScore = calculateGenreAlignment(features, targetGenre);
  const commercialScore = calculateCommercialReadiness(features);
  const technicalScore = calculateTechnicalScore(features);
  
  return Math.round((genreScore * 0.4 + commercialScore * 0.3 + technicalScore * 0.3));
}

/**
 * Calculate genre alignment score from audio features
 */
function calculateGenreAlignment(features: import('../types/mixAnalysis').AudioFeatures, targetGenre: string): number {
  // Simplified genre alignment based on energy, danceability, and tempo
  const genre = targetGenre.toLowerCase();
  
  let score = 50; // Base score
  
  if (genre.includes('pop')) {
    // Pop: medium-high energy, high danceability, 100-130 BPM
    if (features.energy >= 0.5 && features.energy <= 0.8) score += 15;
    if (features.danceability >= 0.6) score += 15;
    if (features.tempo_bpm >= 100 && features.tempo_bpm <= 130) score += 10;
    if (features.valence >= 0.4) score += 10; // Generally positive
  } else if (genre.includes('r&b') || genre.includes('r & b')) {
    // R&B: medium energy, moderate danceability, 70-110 BPM
    if (features.energy >= 0.4 && features.energy <= 0.7) score += 15;
    if (features.danceability >= 0.5 && features.danceability <= 0.8) score += 15;
    if (features.tempo_bpm >= 70 && features.tempo_bpm <= 110) score += 15;
    if (features.speechiness < 0.33) score += 5; // Not too much speaking
  } else if (genre.includes('hip')) {
    // Hip Hop: varied energy, high danceability, 70-110 BPM
    if (features.danceability >= 0.6) score += 15;
    if (features.tempo_bpm >= 70 && features.tempo_bpm <= 110) score += 15;
    if (features.speechiness >= 0.33) score += 15; // More vocals/rap
    if (features.energy >= 0.5) score += 5;
  } else if (genre.includes('electronic') || genre.includes('edm')) {
    // Electronic: high energy, high danceability, 120-140 BPM
    if (features.energy >= 0.7) score += 15;
    if (features.danceability >= 0.7) score += 15;
    if (features.tempo_bpm >= 120 && features.tempo_bpm <= 140) score += 15;
    if (features.instrumentalness >= 0.3) score += 5;
  } else if (genre.includes('alternative') || genre.includes('indie')) {
    // Alternative: varied energy, moderate danceability
    if (features.energy >= 0.4 && features.energy <= 0.8) score += 15;
    if (features.acousticness >= 0.2) score += 10;
    if (features.tempo_bpm >= 90 && features.tempo_bpm <= 140) score += 10;
    score += 15; // More flexible genre
  }
  
  return Math.min(100, Math.max(0, score));
}

/**
 * Calculate commercial readiness score
 */
function calculateCommercialReadiness(features: import('../types/mixAnalysis').AudioFeatures): number {
  let score = 50;
  
  // Duration check (3-4 minutes is ideal)
  const duration = features.duration_seconds;
  if (duration >= 180 && duration <= 240) {
    score += 15;
  } else if (duration >= 150 && duration <= 300) {
    score += 10;
  } else {
    score += 5;
  }
  
  // Energy level (not too low, not too high)
  if (features.energy >= 0.4 && features.energy <= 0.8) {
    score += 15;
  } else {
    score += 8;
  }
  
  // Danceability (generally important for commercial success)
  if (features.danceability >= 0.5) {
    score += 15;
  } else {
    score += 8;
  }
  
  // Loudness (radio-ready but not overly compressed)
  if (features.loudness_db >= -8 && features.loudness_db <= -4) {
    score += 10;
  } else if (features.loudness_db >= -10 && features.loudness_db <= -3) {
    score += 5;
  }
  
  return Math.min(100, Math.max(0, score));
}

/**
 * Calculate technical score from audio features
 */
function calculateTechnicalScore(features: import('../types/mixAnalysis').AudioFeatures): number {
  let score = 60; // Base score
  
  // Loudness in reasonable range
  if (features.loudness_db >= -10 && features.loudness_db <= -3) {
    score += 15;
  } else {
    score += 5;
  }
  
  // Stereo width if available
  if (features.stereo_width !== undefined) {
    if (features.stereo_width >= 0.5 && features.stereo_width <= 0.8) {
      score += 10;
    } else {
      score += 5;
    }
  } else {
    score += 7; // Average if not available
  }
  
  // Dynamic range if available
  if (features.dynamic_range_db !== undefined) {
    if (features.dynamic_range_db >= 6 && features.dynamic_range_db <= 12) {
      score += 15;
    } else if (features.dynamic_range_db >= 4) {
      score += 8;
    }
  } else {
    score += 10; // Average if not available
  }
  
  return Math.min(100, Math.max(0, score));
}
