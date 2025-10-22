import { Benchmarks, Genre } from '../types/artistAssessment';

// Industry benchmarks derived from top-performing artists (Beyoncé-adjacent modeling)
export const INDUSTRY_BENCHMARKS: Record<string, Benchmarks> = {
  'R&B': {
    audio_feature_targets: {
      tempo_bpm: [70, 110],
      danceability: [0.4, 0.8],
      energy: [0.3, 0.7],
      valence: [0.2, 0.7]
    },
    release_cadence_weeks: [6, 12],
    engagement_targets: {
      skip_rate_pct_max: 25,
      save_rate_pct_min: 15
    },
    adjacent_artist_clusters: ['SZA', 'H.E.R.', 'Summer Walker', 'Jhené Aiko']
  },
  
  'Pop': {
    audio_feature_targets: {
      tempo_bpm: [90, 130],
      danceability: [0.5, 0.9],
      energy: [0.5, 0.9],
      valence: [0.4, 0.8]
    },
    release_cadence_weeks: [4, 8],
    engagement_targets: {
      skip_rate_pct_max: 20,
      save_rate_pct_min: 20
    },
    adjacent_artist_clusters: ['Dua Lipa', 'The Weeknd', 'Billie Eilish', 'Ariana Grande']
  },
  
  'Soul': {
    audio_feature_targets: {
      tempo_bpm: [60, 100],
      danceability: [0.3, 0.7],
      energy: [0.2, 0.6],
      valence: [0.3, 0.8]
    },
    release_cadence_weeks: [8, 16],
    engagement_targets: {
      skip_rate_pct_max: 20,
      save_rate_pct_min: 25
    },
    adjacent_artist_clusters: ['Solange', 'Daniel Caesar', 'Blood Orange', 'Frank Ocean']
  },
  
  'Hip Hop': {
    audio_feature_targets: {
      tempo_bpm: [70, 140],
      danceability: [0.6, 0.9],
      energy: [0.6, 0.9],
      valence: [0.3, 0.8]
    },
    release_cadence_weeks: [2, 6],
    engagement_targets: {
      skip_rate_pct_max: 30,
      save_rate_pct_min: 12
    },
    adjacent_artist_clusters: ['Drake', 'Kendrick Lamar', 'J. Cole', 'Tyler, The Creator']
  },
  
  'Electronic': {
    audio_feature_targets: {
      tempo_bpm: [100, 150],
      danceability: [0.7, 0.95],
      energy: [0.7, 0.95],
      valence: [0.4, 0.9]
    },
    release_cadence_weeks: [3, 8],
    engagement_targets: {
      skip_rate_pct_max: 25,
      save_rate_pct_min: 18
    },
    adjacent_artist_clusters: ['FKA twigs', 'ODESZA', 'Disclosure', 'Flume']
  },
  
  'Alternative': {
    audio_feature_targets: {
      tempo_bpm: [80, 120],
      danceability: [0.3, 0.7],
      energy: [0.4, 0.8],
      valence: [0.2, 0.7]
    },
    release_cadence_weeks: [6, 12],
    engagement_targets: {
      skip_rate_pct_max: 22,
      save_rate_pct_min: 22
    },
    adjacent_artist_clusters: ['Lorde', 'Phoebe Bridgers', 'Tame Impala', 'Glass Animals']
  }
};

// Default benchmark for when genre isn't specified
export const DEFAULT_BENCHMARK: Benchmarks = INDUSTRY_BENCHMARKS['Pop'];

// Get benchmark for specific genre or combination of genres
export function getBenchmarkForGenres(genres: Genre[]): Benchmarks {
  if (genres.length === 0) return DEFAULT_BENCHMARK;
  
  // Use the first primary genre as the main benchmark
  const primaryGenre = genres[0];
  return INDUSTRY_BENCHMARKS[primaryGenre] || DEFAULT_BENCHMARK;
}

// Success probability calculation based on alignment with benchmarks
export function calculateSuccessProbability(
  assessment: any,
  benchmark: Benchmarks
): number {
  let score = 0;
  let factors = 0;
  
  // Audio feature alignment (30% weight)
  if (assessment.audio_profile && benchmark.audio_feature_targets) {
    const audioScore = calculateAudioAlignment(assessment.audio_profile, benchmark.audio_feature_targets);
    score += audioScore * 0.3;
    factors += 0.3;
  }
  
  // Release strategy alignment (20% weight)
  if (assessment.release_strategy && benchmark.release_cadence_weeks) {
    const cadenceScore = isWithinRange(
      assessment.release_strategy.cadence_weeks,
      benchmark.release_cadence_weeks
    ) ? 1 : 0.5;
    score += cadenceScore * 0.2;
    factors += 0.2;
  }
  
  // Brand narrative strength (25% weight)
  if (assessment.brand_narrative) {
    const brandScore = calculateBrandStrength(assessment.brand_narrative);
    score += brandScore * 0.25;
    factors += 0.25;
  }
  
  // Team and resources (15% weight)
  if (assessment.identity?.team || assessment.resources) {
    const resourceScore = calculateResourceScore(assessment.identity?.team, assessment.resources);
    score += resourceScore * 0.15;
    factors += 0.15;
  }
  
  // Current metrics boost (10% weight)
  if (assessment.current_metrics) {
    const metricsScore = calculateMetricsScore(assessment.current_metrics);
    score += metricsScore * 0.1;
    factors += 0.1;
  }
  
  return factors > 0 ? Math.min(1, score / factors) : 0.5;
}

function calculateAudioAlignment(audioProfile: any, targets: any): number {
  let alignmentScore = 0;
  let count = 0;
  
  for (const [feature, range] of Object.entries(targets)) {
    if (audioProfile[feature] !== undefined && Array.isArray(range)) {
      const [min, max] = range;
      const value = audioProfile[feature];
      
      if (value >= min && value <= max) {
        alignmentScore += 1;
      } else {
        // Partial credit for being close
        const distance = Math.min(Math.abs(value - min), Math.abs(value - max));
        const tolerance = (max - min) * 0.2; // 20% tolerance
        alignmentScore += Math.max(0, 1 - (distance / tolerance));
      }
      count++;
    }
  }
  
  return count > 0 ? alignmentScore / count : 0.5;
}

function isWithinRange(value: number, range: [number, number]): boolean {
  return value >= range[0] && value <= range[1];
}

function calculateBrandStrength(brandNarrative: any): number {
  let score = 0;
  
  // Positioning clarity
  if (brandNarrative.positioning && brandNarrative.positioning.length >= 10) {
    score += 0.3;
  }
  
  // Theme diversity
  if (brandNarrative.themes && brandNarrative.themes.length >= 2) {
    score += 0.3;
  }
  
  // Audience problem definition
  if (brandNarrative.audience_problem_solved) {
    score += 0.2;
  }
  
  // Visual style definition
  if (brandNarrative.visual_style_tags && brandNarrative.visual_style_tags.length > 0) {
    score += 0.2;
  }
  
  return score;
}

function calculateResourceScore(team: any, resources: any): number {
  let score = 0;
  
  // Team completeness
  if (team) {
    const teamMembers = Object.values(team).filter(Boolean).length;
    score += Math.min(0.5, teamMembers * 0.1);
  }
  
  // Budget availability
  if (resources?.budget_total_usd) {
    if (resources.budget_total_usd >= 10000) score += 0.3;
    else if (resources.budget_total_usd >= 5000) score += 0.2;
    else if (resources.budget_total_usd >= 1000) score += 0.1;
  }
  
  // Time availability
  if (resources?.hours_available_per_week) {
    if (resources.hours_available_per_week >= 20) score += 0.2;
    else if (resources.hours_available_per_week >= 10) score += 0.1;
  }
  
  return score;
}

function calculateMetricsScore(metrics: any): number {
  let score = 0;
  
  if (metrics.spotify_monthly_listeners) {
    if (metrics.spotify_monthly_listeners >= 10000) score += 0.4;
    else if (metrics.spotify_monthly_listeners >= 1000) score += 0.2;
    else if (metrics.spotify_monthly_listeners >= 100) score += 0.1;
  }
  
  if (metrics.avg_save_rate_pct && metrics.avg_save_rate_pct >= 15) score += 0.3;
  if (metrics.avg_skip_rate_pct && metrics.avg_skip_rate_pct <= 25) score += 0.3;
  
  return score;
}

// Generate recommendations based on benchmark comparison
export function generateRecommendations(
  assessment: any,
  benchmark: Benchmarks
): string[] {
  const recommendations: string[] = [];
  
  // Audio feature recommendations
  if (assessment.audio_profile && benchmark.audio_feature_targets) {
    const { tempo_bpm, danceability, energy, valence } = assessment.audio_profile;
    const targets = benchmark.audio_feature_targets;
    
    if (targets.tempo_bpm && (tempo_bpm < targets.tempo_bpm[0] || tempo_bpm > targets.tempo_bpm[1])) {
      recommendations.push(`Consider adjusting tempo to ${targets.tempo_bpm[0]}-${targets.tempo_bpm[1]} BPM for better genre alignment`);
    }
    
    if (targets.danceability && danceability < targets.danceability[0]) {
      recommendations.push('Increase danceability with stronger rhythm and groove elements');
    }
    
    if (targets.energy && energy < targets.energy[0]) {
      recommendations.push('Boost energy with dynamic arrangements and compelling hooks');
    }
  }
  
  // Release strategy recommendations
  if (assessment.release_strategy && benchmark.release_cadence_weeks) {
    const cadence = assessment.release_strategy.cadence_weeks;
    const [minCadence, maxCadence] = benchmark.release_cadence_weeks;
    
    if (cadence > maxCadence) {
      recommendations.push(`Release more frequently - aim for every ${maxCadence} weeks to maintain momentum`);
    } else if (cadence < minCadence) {
      recommendations.push(`Allow more time between releases - ${minCadence} weeks minimum for quality and promotion`);
    }
  }
  
  // Brand narrative recommendations
  if (assessment.brand_narrative) {
    if (!assessment.brand_narrative.themes || assessment.brand_narrative.themes.length < 2) {
      recommendations.push('Develop 2-3 core themes to strengthen brand narrative and audience connection');
    }
    
    if (!assessment.brand_narrative.visual_style_tags || assessment.brand_narrative.visual_style_tags.length === 0) {
      recommendations.push('Define visual style elements for consistent brand presentation across platforms');
    }
  }
  
  // Team building recommendations
  if (!assessment.identity?.team || Object.values(assessment.identity.team).filter(Boolean).length < 3) {
    recommendations.push('Build core team: prioritize producer, mix engineer, and manager relationships');
  }
  
  return recommendations;
}