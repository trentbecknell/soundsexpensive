// Regional Market Analysis Library
// Analyzes music characteristics to recommend target markets and regions

import type { AudioFeatures } from '../types/mixAnalysis';
import { analyzeUSSubRegions, type SubRegionalAnalysis } from './subRegionalAnalysis';

export interface RegionalMarket {
  region: string;
  countries: string[];
  key_cities: string[];
  
  // Market characteristics
  market_size_rank: number; // 1 = largest
  streaming_penetration: number; // 0-1
  average_revenue_per_user: number; // USD monthly
  
  // Genre preferences (weighted 0-1)
  genre_preferences: {
    pop: number;
    rnb: number;
    hip_hop: number;
    electronic: number;
    alternative: number;
    latin: number;
    afrobeats: number;
    k_pop: number;
    rock: number;
    country: number;
  };
  
  // Sonic preferences
  sonic_profile: {
    preferred_tempo_range: [number, number];
    preferred_energy: [number, number];
    preferred_valence: [number, number];
    bass_preference: 'light' | 'moderate' | 'heavy';
    production_style: 'polished' | 'raw' | 'experimental' | 'balanced';
  };
  
  // Platform distribution
  dominant_platforms: string[];
  
  // Cultural insights
  language_openness: number; // 0-1, acceptance of non-local languages
  trend_adoption_speed: 'early' | 'mid' | 'late'; // How fast they adopt global trends
  local_artist_preference: number; // 0-1, preference for local vs international
  
  // Release strategy
  best_release_days: string[];
  playlist_culture: 'strong' | 'moderate' | 'emerging';
  
  // Key insights
  market_insights: string[];
}

export interface RegionalMatchScore {
  region: string;
  match_score: number; // 0-100
  match_factors: {
    genre_fit: number;
    sonic_fit: number;
    market_opportunity: number;
    cultural_fit: number;
  };
  strengths: string[];
  considerations: string[];
  recommended_strategy: string[];
}

export interface RegionalAnalysisResult {
  primary_markets: RegionalMatchScore[]; // Top 3 matches
  secondary_markets: RegionalMatchScore[]; // Next 3 matches
  global_appeal_score: number; // 0-100
  recommended_territories: string[];
  market_strategy_insights: string[];
  playlist_targeting: {
    region: string;
    playlist_types: string[];
  }[];
  subregional_analysis?: SubRegionalAnalysis[]; // City-level analysis for major markets
}

// Regional market data
export const REGIONAL_MARKETS: Record<string, RegionalMarket> = {
  'North America': {
    region: 'North America',
    countries: ['United States', 'Canada'],
    key_cities: ['New York', 'Los Angeles', 'Toronto', 'Atlanta', 'Nashville', 'Miami'],
    market_size_rank: 1,
    streaming_penetration: 0.85,
    average_revenue_per_user: 12.50,
    genre_preferences: {
      pop: 0.9,
      rnb: 0.85,
      hip_hop: 0.95,
      electronic: 0.7,
      alternative: 0.75,
      latin: 0.75,
      afrobeats: 0.6,
      k_pop: 0.6,
      rock: 0.7,
      country: 0.85,
    },
    sonic_profile: {
      preferred_tempo_range: [80, 140],
      preferred_energy: [0.5, 0.9],
      preferred_valence: [0.4, 0.8],
      bass_preference: 'heavy',
      production_style: 'polished',
    },
    dominant_platforms: ['Spotify', 'Apple Music', 'YouTube Music', 'Amazon Music'],
    language_openness: 0.6,
    trend_adoption_speed: 'early',
    local_artist_preference: 0.7,
    best_release_days: ['Friday', 'Thursday'],
    playlist_culture: 'strong',
    market_insights: [
      'Highly competitive but largest market opportunity',
      'Strong playlist culture - editorial playlist placement crucial',
      'Hip-hop and R&B dominate streaming charts',
      'TikTok integration essential for discovery',
      'Regional differences: South prefers trap/R&B, coasts more diverse',
    ],
  },
  
  'UK & Ireland': {
    region: 'UK & Ireland',
    countries: ['United Kingdom', 'Ireland'],
    key_cities: ['London', 'Manchester', 'Birmingham', 'Dublin', 'Glasgow'],
    market_size_rank: 3,
    streaming_penetration: 0.88,
    average_revenue_per_user: 11.20,
    genre_preferences: {
      pop: 0.9,
      rnb: 0.8,
      hip_hop: 0.85,
      electronic: 0.9,
      alternative: 0.85,
      latin: 0.5,
      afrobeats: 0.85,
      k_pop: 0.55,
      rock: 0.75,
      country: 0.3,
    },
    sonic_profile: {
      preferred_tempo_range: [90, 140],
      preferred_energy: [0.5, 0.9],
      preferred_valence: [0.3, 0.7],
      bass_preference: 'heavy',
      production_style: 'balanced',
    },
    dominant_platforms: ['Spotify', 'Apple Music', 'YouTube Music', 'Deezer'],
    language_openness: 0.8,
    trend_adoption_speed: 'early',
    local_artist_preference: 0.65,
    best_release_days: ['Friday'],
    playlist_culture: 'strong',
    market_insights: [
      'Strong culture of breaking new artists',
      'BBC Radio 1 and Radio 6 still influential for discovery',
      'Grime, UK drill, and Afrobeats have strong presence',
      'Festival culture impacts summer releases',
      'London-centric but regional scenes emerging (Manchester, Birmingham)',
    ],
  },
  
  'Latin America': {
    region: 'Latin America',
    countries: ['Mexico', 'Brazil', 'Colombia', 'Argentina', 'Chile'],
    key_cities: ['Mexico City', 'São Paulo', 'Buenos Aires', 'Bogotá', 'Santiago'],
    market_size_rank: 4,
    streaming_penetration: 0.75,
    average_revenue_per_user: 4.20,
    genre_preferences: {
      pop: 0.85,
      rnb: 0.65,
      hip_hop: 0.75,
      electronic: 0.8,
      alternative: 0.7,
      latin: 0.98,
      afrobeats: 0.5,
      k_pop: 0.6,
      rock: 0.7,
      country: 0.4,
    },
    sonic_profile: {
      preferred_tempo_range: [90, 130],
      preferred_energy: [0.6, 0.95],
      preferred_valence: [0.5, 0.9],
      bass_preference: 'heavy',
      production_style: 'polished',
    },
    dominant_platforms: ['Spotify', 'YouTube Music', 'Deezer', 'Apple Music'],
    language_openness: 0.5, // Strong preference for Spanish/Portuguese
    trend_adoption_speed: 'mid',
    local_artist_preference: 0.8,
    best_release_days: ['Friday', 'Thursday'],
    playlist_culture: 'strong',
    market_insights: [
      'Fastest growing streaming market globally',
      'Reggaeton, urbano, and regional Mexican dominate',
      'YouTube extremely important - videos essential',
      'Collaborations with local artists highly effective',
      'WhatsApp sharing culture impacts virality',
    ],
  },
  
  'Western Europe': {
    region: 'Western Europe',
    countries: ['France', 'Germany', 'Netherlands', 'Spain', 'Italy'],
    key_cities: ['Paris', 'Berlin', 'Amsterdam', 'Madrid', 'Milan'],
    market_size_rank: 2,
    streaming_penetration: 0.80,
    average_revenue_per_user: 9.80,
    genre_preferences: {
      pop: 0.85,
      rnb: 0.7,
      hip_hop: 0.8,
      electronic: 0.95,
      alternative: 0.8,
      latin: 0.65,
      afrobeats: 0.7,
      k_pop: 0.5,
      rock: 0.75,
      country: 0.2,
    },
    sonic_profile: {
      preferred_tempo_range: [95, 135],
      preferred_energy: [0.5, 0.85],
      preferred_valence: [0.4, 0.8],
      bass_preference: 'moderate',
      production_style: 'experimental',
    },
    dominant_platforms: ['Spotify', 'Deezer', 'Apple Music', 'YouTube Music'],
    language_openness: 0.65, // Varies by country
    trend_adoption_speed: 'mid',
    local_artist_preference: 0.75,
    best_release_days: ['Friday'],
    playlist_culture: 'strong',
    market_insights: [
      'Strong electronic music culture, especially Berlin',
      'France has quota system favoring French-language content',
      'Festival season (summer) crucial for visibility',
      'Each country has distinct preferences - localization important',
      'Radio still important in France and Germany',
    ],
  },
  
  'Asia-Pacific': {
    region: 'Asia-Pacific',
    countries: ['South Korea', 'Japan', 'Australia', 'Indonesia', 'Philippines'],
    key_cities: ['Seoul', 'Tokyo', 'Sydney', 'Jakarta', 'Manila'],
    market_size_rank: 5,
    streaming_penetration: 0.70,
    average_revenue_per_user: 6.50,
    genre_preferences: {
      pop: 0.95,
      rnb: 0.75,
      hip_hop: 0.7,
      electronic: 0.85,
      alternative: 0.65,
      latin: 0.4,
      afrobeats: 0.45,
      k_pop: 0.98,
      rock: 0.7,
      country: 0.3,
    },
    sonic_profile: {
      preferred_tempo_range: [90, 145],
      preferred_energy: [0.6, 0.95],
      preferred_valence: [0.5, 0.9],
      bass_preference: 'moderate',
      production_style: 'polished',
    },
    dominant_platforms: ['Spotify', 'Apple Music', 'YouTube Music', 'Melon', 'Line Music'],
    language_openness: 0.55,
    trend_adoption_speed: 'early',
    local_artist_preference: 0.85,
    best_release_days: ['Friday', 'Monday'],
    playlist_culture: 'emerging',
    market_insights: [
      'K-pop production standards influence preferences',
      'Visual content (MVs) absolutely essential',
      'Fan culture extremely engaged and organized',
      'Japan prefers high-quality physical releases',
      'SEA markets growing rapidly, youth-driven',
    ],
  },
  
  'Africa & Middle East': {
    region: 'Africa & Middle East',
    countries: ['Nigeria', 'South Africa', 'Kenya', 'Ghana', 'UAE'],
    key_cities: ['Lagos', 'Johannesburg', 'Nairobi', 'Accra', 'Dubai'],
    market_size_rank: 7,
    streaming_penetration: 0.45,
    average_revenue_per_user: 2.80,
    genre_preferences: {
      pop: 0.75,
      rnb: 0.8,
      hip_hop: 0.85,
      electronic: 0.65,
      alternative: 0.5,
      latin: 0.4,
      afrobeats: 0.98,
      k_pop: 0.4,
      rock: 0.4,
      country: 0.2,
    },
    sonic_profile: {
      preferred_tempo_range: [95, 130],
      preferred_energy: [0.6, 0.95],
      preferred_valence: [0.6, 0.95],
      bass_preference: 'heavy',
      production_style: 'raw',
    },
    dominant_platforms: ['Spotify', 'Apple Music', 'YouTube Music', 'Boomplay', 'Audiomack'],
    language_openness: 0.7,
    trend_adoption_speed: 'mid',
    local_artist_preference: 0.85,
    best_release_days: ['Friday', 'Saturday'],
    playlist_culture: 'emerging',
    market_insights: [
      'Fastest growing youth population globally',
      'Afrobeats and Amapiano dominating globally from this region',
      'WhatsApp and social sharing extremely important',
      'Lower streaming revenue but high engagement',
      'Cross-pollination with diaspora communities crucial',
    ],
  },
  
  'Scandinavia': {
    region: 'Scandinavia',
    countries: ['Sweden', 'Norway', 'Denmark', 'Finland'],
    key_cities: ['Stockholm', 'Oslo', 'Copenhagen', 'Helsinki'],
    market_size_rank: 8,
    streaming_penetration: 0.92,
    average_revenue_per_user: 11.80,
    genre_preferences: {
      pop: 0.95,
      rnb: 0.7,
      hip_hop: 0.75,
      electronic: 0.9,
      alternative: 0.85,
      latin: 0.5,
      afrobeats: 0.6,
      k_pop: 0.5,
      rock: 0.8,
      country: 0.3,
    },
    sonic_profile: {
      preferred_tempo_range: [85, 125],
      preferred_energy: [0.5, 0.85],
      preferred_valence: [0.3, 0.7],
      bass_preference: 'moderate',
      production_style: 'polished',
    },
    dominant_platforms: ['Spotify', 'Apple Music', 'YouTube Music', 'Tidal'],
    language_openness: 0.9,
    trend_adoption_speed: 'early',
    local_artist_preference: 0.6,
    best_release_days: ['Friday'],
    playlist_culture: 'strong',
    market_insights: [
      'Highest streaming penetration globally',
      'Birthplace of many pop producers and songwriters',
      'Early adopters of new music trends',
      'Strong indie/alternative scene',
      'English-language music widely accepted',
    ],
  },
};

// Calculate genre from audio features
function estimateGenre(features: AudioFeatures, targetGenre?: string): string {
  if (targetGenre) return targetGenre;
  
  // Simple genre estimation based on features
  if (features.energy > 0.7 && features.tempo_bpm > 120) return 'electronic';
  if (features.speechiness > 0.3) return 'hip_hop';
  if (features.danceability > 0.7 && features.energy > 0.6) return 'pop';
  if (features.energy < 0.6 && features.valence < 0.5) return 'alternative';
  if (features.danceability > 0.5 && features.energy < 0.7) return 'rnb';
  
  return 'pop'; // default
}

// Calculate match score for a region
function calculateRegionalMatch(
  features: AudioFeatures,
  genre: string,
  market: RegionalMarket
): RegionalMatchScore {
  const genreKey = genre.toLowerCase().replace(/\s+/g, '_').replace('&', '') as keyof typeof market.genre_preferences;
  
  // Genre fit (40% weight)
  const genreFit = (market.genre_preferences[genreKey] || 0.5) * 100;
  
  // Sonic fit (30% weight) - tempo, energy, valence
  const tempoFit = features.tempo_bpm >= market.sonic_profile.preferred_tempo_range[0] &&
                   features.tempo_bpm <= market.sonic_profile.preferred_tempo_range[1] ? 100 : 70;
  const energyFit = features.energy >= market.sonic_profile.preferred_energy[0] &&
                    features.energy <= market.sonic_profile.preferred_energy[1] ? 100 : 70;
  const valenceFit = features.valence >= market.sonic_profile.preferred_valence[0] &&
                     features.valence <= market.sonic_profile.preferred_valence[1] ? 100 : 75;
  const sonicFit = (tempoFit + energyFit + valenceFit) / 3;
  
  // Market opportunity (20% weight) - based on size, penetration, early adoption
  const marketOpportunity = (
    (10 - market.market_size_rank) * 10 + // Rank (higher = better)
    market.streaming_penetration * 30 + // Penetration
    market.average_revenue_per_user * 3 + // ARPU
    (market.trend_adoption_speed === 'early' ? 20 : market.trend_adoption_speed === 'mid' ? 10 : 5)
  );
  
  // Cultural fit (10% weight) - playlist culture, language openness
  const culturalFit = (
    market.language_openness * 50 +
    (market.playlist_culture === 'strong' ? 50 : market.playlist_culture === 'moderate' ? 30 : 20)
  );
  
  // Weighted total
  const matchScore = (
    genreFit * 0.4 +
    sonicFit * 0.3 +
    marketOpportunity * 0.2 +
    culturalFit * 0.1
  );
  
  // Generate insights
  const strengths: string[] = [];
  const considerations: string[] = [];
  const strategy: string[] = [];
  
  if (genreFit > 80) {
    strengths.push(`Strong ${genre} market presence`);
  }
  if (market.streaming_penetration > 0.8) {
    strengths.push('High streaming adoption');
  }
  if (market.trend_adoption_speed === 'early') {
    strengths.push('Early trend adopters - good for breaking new sounds');
  }
  if (market.playlist_culture === 'strong') {
    strengths.push('Strong playlist culture');
    strategy.push('Focus on playlist pitching and curator relationships');
  }
  
  if (market.language_openness < 0.6) {
    considerations.push('Consider local language versions or features');
  }
  if (market.local_artist_preference > 0.75) {
    considerations.push('High preference for local artists - collaboration recommended');
    strategy.push('Partner with local artists or producers');
  }
  if (market.average_revenue_per_user < 5) {
    considerations.push('Lower ARPU - focus on volume and engagement over revenue');
  }
  
  // Platform strategy
  strategy.push(`Primary platforms: ${market.dominant_platforms.slice(0, 2).join(', ')}`);
  strategy.push(`Best release day: ${market.best_release_days[0]}`);
  
  return {
    region: market.region,
    match_score: Math.round(matchScore),
    match_factors: {
      genre_fit: Math.round(genreFit),
      sonic_fit: Math.round(sonicFit),
      market_opportunity: Math.round(marketOpportunity),
      cultural_fit: Math.round(culturalFit),
    },
    strengths,
    considerations,
    recommended_strategy: strategy,
  };
}

// Main regional analysis function
export function analyzeRegionalMarkets(
  features: AudioFeatures,
  targetGenre?: string
): RegionalAnalysisResult {
  const genre = estimateGenre(features, targetGenre);
  
  // Calculate match scores for all regions
  const allMatches = Object.values(REGIONAL_MARKETS).map(market =>
    calculateRegionalMatch(features, genre, market)
  );
  
  // Sort by match score
  allMatches.sort((a, b) => b.match_score - a.match_score);
  
  const primaryMarkets = allMatches.slice(0, 3);
  const secondaryMarkets = allMatches.slice(3, 6);
  
  // Calculate global appeal score
  const avgScore = allMatches.reduce((sum, m) => sum + m.match_score, 0) / allMatches.length;
  const globalAppealScore = Math.round(avgScore);
  
  // Extract recommended territories
  const recommendedTerritories = primaryMarkets.flatMap(m => {
    const market = REGIONAL_MARKETS[m.region];
    return market.countries.slice(0, 2); // Top 2 countries per region
  });
  
  // Generate market strategy insights
  const marketStrategyInsights: string[] = [];
  
  if (primaryMarkets[0].match_score > 85) {
    marketStrategyInsights.push(`🎯 Excellent fit for ${primaryMarkets[0].region} - prioritize this market`);
  }
  
  if (globalAppealScore > 75) {
    marketStrategyInsights.push('🌍 High global appeal - consider simultaneous multi-region release');
  } else if (globalAppealScore < 55) {
    marketStrategyInsights.push('🎯 Niche appeal - focus on 1-2 key markets initially');
  }
  
  // Check for emerging markets
  const emergingMatch = allMatches.find(m => 
    ['Latin America', 'Africa & Middle East', 'Asia-Pacific'].includes(m.region) && 
    m.match_score > 70
  );
  if (emergingMatch) {
    marketStrategyInsights.push(`📈 Strong potential in ${emergingMatch.region} - fast-growing market`);
  }
  
  // Playlist targeting recommendations
  const playlistTargeting = primaryMarkets.map(market => {
    const playlistTypes: string[] = [];
    const regionalData = REGIONAL_MARKETS[market.region];
    
    if (regionalData.playlist_culture === 'strong') {
      playlistTypes.push('Editorial playlists', 'Algorithmic playlists');
    }
    if (features.danceability > 0.7) {
      playlistTypes.push('Workout & party playlists');
    }
    if (features.valence < 0.5) {
      playlistTypes.push('Mood & chill playlists');
    }
    if (features.energy > 0.7) {
      playlistTypes.push('High-energy & hype playlists');
    }
    
    return {
      region: market.region,
      playlist_types: playlistTypes,
    };
  });
  
  // Generate sub-regional analysis for major markets
  const subregionalAnalysis: SubRegionalAnalysis[] = [];
  
  // If North America is a top market, add US city-level analysis
  const northAmericaMatch = primaryMarkets.find(m => m.region === 'North America');
  if (northAmericaMatch && northAmericaMatch.match_score > 60) {
    subregionalAnalysis.push(analyzeUSSubRegions(features, genre));
  }
  
  // Future: Add UK, Canada, Brazil sub-regional analysis
  
  return {
    primary_markets: primaryMarkets,
    secondary_markets: secondaryMarkets,
    global_appeal_score: globalAppealScore,
    recommended_territories: recommendedTerritories,
    market_strategy_insights: marketStrategyInsights,
    playlist_targeting: playlistTargeting,
    subregional_analysis: subregionalAnalysis.length > 0 ? subregionalAnalysis : undefined,
  };
}
