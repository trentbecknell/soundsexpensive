// Sub-Regional Analysis Library
// Provides city/state-level targeting within major markets

import type { AudioFeatures } from '../types/mixAnalysis';

export interface SubRegion {
  name: string;
  state_province?: string;
  population_millions: number;
  
  // Music scene characteristics
  music_scene_strength: number; // 0-1
  music_industry_presence: 'major' | 'strong' | 'emerging' | 'developing';
  
  // Genre preferences (weighted 0-1)
  genre_preferences: {
    pop: number;
    rnb: number;
    hip_hop: number;
    electronic: number;
    alternative: number;
    latin: number;
    country: number;
    rock: number;
  };
  
  // Sonic preferences
  sonic_profile: {
    preferred_tempo_range: [number, number];
    preferred_energy: [number, number];
    bass_culture: 'heavy' | 'moderate' | 'light';
    production_preference: 'polished' | 'experimental' | 'raw' | 'balanced';
  };
  
  // Scene characteristics
  key_venues: string[];
  influential_radio_stations: string[];
  local_tastemakers: string[];
  music_festivals: string[];
  
  // Market insights
  scene_description: string;
  target_demographics: string[];
  best_strategies: string[];
}

export interface SubRegionalMatchScore {
  region: string;
  match_score: number; // 0-100
  strengths: string[];
  key_venues: string[];
  recommended_actions: string[];
}

export interface SubRegionalAnalysis {
  country: string;
  top_subregions: SubRegionalMatchScore[];
  market_overview: string;
}

// United States Sub-Regions
export const US_SUBREGIONS: Record<string, SubRegion> = {
  'Atlanta, GA': {
    name: 'Atlanta',
    state_province: 'Georgia',
    population_millions: 6.1,
    music_scene_strength: 0.95,
    music_industry_presence: 'major',
    genre_preferences: {
      pop: 0.75,
      rnb: 0.95,
      hip_hop: 0.98,
      electronic: 0.65,
      alternative: 0.55,
      latin: 0.7,
      country: 0.6,
      rock: 0.5,
    },
    sonic_profile: {
      preferred_tempo_range: [70, 140],
      preferred_energy: [0.6, 0.95],
      bass_culture: 'heavy',
      production_preference: 'polished',
    },
    key_venues: ['The Tabernacle', 'Center Stage', 'Terminal West', 'Mercedes-Benz Stadium'],
    influential_radio_stations: ['Hot 107.9', 'V-103', 'Streetz 94.5'],
    local_tastemakers: ['DJ Drama', 'DJ Holiday', 'DJ Scream'],
    music_festivals: ['ONE Musicfest', 'Shaky Knees', 'Music Midtown'],
    scene_description: 'Hip-hop and R&B capital. Home to trap music. Massive influence on modern hip-hop sound.',
    target_demographics: ['18-34 hip-hop heads', 'Urban music fans', 'Club scene'],
    best_strategies: [
      'Connect with Quality Control, 1017, or other ATL labels',
      'Get spins on Hot 107.9 or Streetz 94.5',
      'Perform at underground venues in Little Five Points',
      'Collaborate with Atlanta producers or artists',
    ],
  },
  
  'Los Angeles, CA': {
    name: 'Los Angeles',
    state_province: 'California',
    population_millions: 13.2,
    music_scene_strength: 0.98,
    music_industry_presence: 'major',
    genre_preferences: {
      pop: 0.95,
      rnb: 0.85,
      hip_hop: 0.9,
      electronic: 0.85,
      alternative: 0.85,
      latin: 0.95,
      country: 0.4,
      rock: 0.75,
    },
    sonic_profile: {
      preferred_tempo_range: [80, 135],
      preferred_energy: [0.5, 0.9],
      bass_culture: 'moderate',
      production_preference: 'polished',
    },
    key_venues: ['The Troubadour', 'El Rey Theatre', 'The Roxy', 'The Greek Theatre', 'Crypto.com Arena'],
    influential_radio_stations: ['Power 106', 'KROQ', 'KCRW', 'Real 92.3'],
    local_tastemakers: ['DJ Mustard', 'YG', 'Kendrick Lamar camp'],
    music_festivals: ['Rolling Loud LA', 'Camp Flog Gnaw', 'FYF Fest'],
    scene_description: 'Entertainment capital. Diverse scene from West Coast hip-hop to indie. Major industry hub.',
    target_demographics: ['Entertainment industry', 'Beach/surf culture', 'Latin community', 'Indie scene'],
    best_strategies: [
      'Showcase at industry venues like The Troubadour',
      'Connect with A&Rs and managers in WeHo/Beverly Hills',
      'Get featured on KCRW or KROQ for indie/alternative',
      'Target Latin market (huge demographic)',
    ],
  },
  
  'New York City, NY': {
    name: 'New York City',
    state_province: 'New York',
    population_millions: 19.8,
    music_scene_strength: 0.98,
    music_industry_presence: 'major',
    genre_preferences: {
      pop: 0.9,
      rnb: 0.9,
      hip_hop: 0.95,
      electronic: 0.9,
      alternative: 0.9,
      latin: 0.95,
      country: 0.3,
      rock: 0.85,
    },
    sonic_profile: {
      preferred_tempo_range: [85, 140],
      preferred_energy: [0.6, 0.95],
      bass_culture: 'heavy',
      production_preference: 'experimental',
    },
    key_venues: ['Bowery Ballroom', 'Brooklyn Steel', 'Webster Hall', 'SOB\'s', 'Madison Square Garden'],
    influential_radio_stations: ['Hot 97', 'Power 105.1', 'Z100', 'The Beat'],
    local_tastemakers: ['Funkmaster Flex', 'Ebro', 'Angie Martinez'],
    music_festivals: ['Governors Ball', 'Panorama', 'Rolling Loud NYC'],
    scene_description: 'Birthplace of hip-hop. Diverse boroughs with distinct scenes. Highly competitive but influential.',
    target_demographics: ['Hip-hop purists', 'Brooklyn indie scene', 'Bronx/Harlem culture', 'Manhattan nightlife'],
    best_strategies: [
      'Build buzz in specific boroughs (Brooklyn indie, Bronx hip-hop)',
      'Get Hot 97 or Power 105 support',
      'Perform at Brooklyn venues for indie cred',
      'Connect with A&Rs at major labels (most are NYC-based)',
    ],
  },
  
  'Miami, FL': {
    name: 'Miami',
    state_province: 'Florida',
    population_millions: 6.2,
    music_scene_strength: 0.85,
    music_industry_presence: 'strong',
    genre_preferences: {
      pop: 0.85,
      rnb: 0.8,
      hip_hop: 0.9,
      electronic: 0.95,
      alternative: 0.6,
      latin: 0.98,
      country: 0.3,
      rock: 0.55,
    },
    sonic_profile: {
      preferred_tempo_range: [95, 145],
      preferred_energy: [0.7, 0.98],
      bass_culture: 'heavy',
      production_preference: 'polished',
    },
    key_venues: ['LIV', 'E11EVEN', 'Story', 'Ball & Chain', 'The Fillmore Miami Beach'],
    influential_radio_stations: ['99 Jamz', 'Power 96', 'Mega 94.9'],
    local_tastemakers: ['DJ Khaled', 'Pitbull camp', 'Rick Ross'],
    music_festivals: ['Ultra Music Festival', 'Rolling Loud Miami', 'III Points'],
    scene_description: 'Latin music hub and electronic music capital (Ultra). Club culture dominates. Caribbean influence.',
    target_demographics: ['Latin community', 'EDM fans', 'Nightclub scene', 'Caribbean diaspora'],
    best_strategies: [
      'Target Latin market - Spanish language/features highly effective',
      'Focus on club-ready production',
      'Connect with reggaeton and Latin trap producers',
      'Ultra Music Festival showcase opportunities',
    ],
  },
  
  'Nashville, TN': {
    name: 'Nashville',
    state_province: 'Tennessee',
    population_millions: 1.9,
    music_scene_strength: 0.92,
    music_industry_presence: 'major',
    genre_preferences: {
      pop: 0.8,
      rnb: 0.7,
      hip_hop: 0.7,
      electronic: 0.6,
      alternative: 0.75,
      latin: 0.5,
      country: 0.98,
      rock: 0.8,
    },
    sonic_profile: {
      preferred_tempo_range: [80, 120],
      preferred_energy: [0.5, 0.8],
      bass_culture: 'moderate',
      production_preference: 'balanced',
    },
    key_venues: ['The Bluebird Cafe', 'Ryman Auditorium', 'Exit/In', 'The Basement', 'Grand Ole Opry'],
    influential_radio_stations: ['WSM', 'Nash FM', 'Lightning 100'],
    local_tastemakers: ['Country music publishers', 'Songwriter community'],
    music_festivals: ['CMA Fest', 'Bonnaroo', 'Americanafest'],
    scene_description: 'Country music capital and major songwriting hub. Growing pop and rock scenes.',
    target_demographics: ['Country fans', 'Songwriters', 'Americana enthusiasts', 'Live music tourists'],
    best_strategies: [
      'Showcase songwriting at The Bluebird Cafe',
      'Connect with Nashville publishers and co-writers',
      'Consider country crossover if pop/rock artist',
      'Play on Broadway for tourist exposure',
    ],
  },
  
  'Chicago, IL': {
    name: 'Chicago',
    state_province: 'Illinois',
    population_millions: 9.5,
    music_scene_strength: 0.88,
    music_industry_presence: 'strong',
    genre_preferences: {
      pop: 0.8,
      rnb: 0.85,
      hip_hop: 0.92,
      electronic: 0.85,
      alternative: 0.8,
      latin: 0.75,
      country: 0.4,
      rock: 0.75,
    },
    sonic_profile: {
      preferred_tempo_range: [75, 135],
      preferred_energy: [0.6, 0.9],
      bass_culture: 'heavy',
      production_preference: 'raw',
    },
    key_venues: ['Metro', 'Empty Bottle', 'House of Blues Chicago', 'United Center'],
    influential_radio_stations: ['Power 92', 'WGCI', 'Q87.7'],
    local_tastemakers: ['Chance The Rapper camp', 'Vic Mensa', 'G Herbo'],
    music_festivals: ['Lollapalooza', 'Pitchfork Music Festival', 'North Coast'],
    scene_description: 'Drill music birthplace. Strong house music history. Gritty, authentic hip-hop scene.',
    target_demographics: ['Drill/hip-hop fans', 'House music heads', 'South Side culture', 'College students'],
    best_strategies: [
      'Connect with drill scene if hip-hop artist',
      'Target college demographic (large student population)',
      'House music crossover opportunities',
      'Authentic, raw production valued over polish',
    ],
  },
  
  'Houston, TX': {
    name: 'Houston',
    state_province: 'Texas',
    population_millions: 7.1,
    music_scene_strength: 0.85,
    music_industry_presence: 'strong',
    genre_preferences: {
      pop: 0.75,
      rnb: 0.85,
      hip_hop: 0.95,
      electronic: 0.7,
      alternative: 0.65,
      latin: 0.9,
      country: 0.7,
      rock: 0.6,
    },
    sonic_profile: {
      preferred_tempo_range: [65, 125],
      preferred_energy: [0.5, 0.85],
      bass_culture: 'heavy',
      production_preference: 'balanced',
    },
    key_venues: ['House of Blues Houston', 'White Oak Music Hall', 'NRG Stadium'],
    influential_radio_stations: ['97.9 The Box', 'Mix 96.5', '104.9 The Beat'],
    local_tastemakers: ['DJ Screw legacy', 'Travis Scott camp', 'Bun B'],
    music_festivals: ['Day For Night', 'Free Press Summer Fest', 'Astroworld Festival'],
    scene_description: 'Chopped and screwed originators. Slow, heavy bass culture. Strong Latin influence.',
    target_demographics: ['Hip-hop fans', 'Car culture enthusiasts', 'Latin community', 'Southern rap heads'],
    best_strategies: [
      'Embrace slow, heavy bass sound',
      'Connect with Houston hip-hop legacy (Screw, UGK influence)',
      'Target Latin demographic',
      'Car audio culture - bass-heavy mixes essential',
    ],
  },
  
  'Seattle, WA': {
    name: 'Seattle',
    state_province: 'Washington',
    population_millions: 4.0,
    music_scene_strength: 0.82,
    music_industry_presence: 'emerging',
    genre_preferences: {
      pop: 0.75,
      rnb: 0.7,
      hip_hop: 0.75,
      electronic: 0.85,
      alternative: 0.95,
      latin: 0.6,
      country: 0.5,
      rock: 0.9,
    },
    sonic_profile: {
      preferred_tempo_range: [80, 125],
      preferred_energy: [0.5, 0.8],
      bass_culture: 'moderate',
      production_preference: 'raw',
    },
    key_venues: ['The Crocodile', 'Neumos', 'The Showbox', 'Paramount Theatre'],
    influential_radio_stations: ['KEXP', 'C89.5', '107.7 The End'],
    local_tastemakers: ['KEXP DJs', 'Sub Pop Records'],
    music_festivals: ['Bumbershoot', 'Capitol Hill Block Party', 'Sasquatch!'],
    scene_description: 'Grunge birthplace. Strong indie/alternative scene. Values authenticity over polish.',
    target_demographics: ['Alternative/indie fans', 'Tech workers', 'Coffee shop culture', 'Grunge nostalgia'],
    best_strategies: [
      'Get airplay on KEXP (highly influential)',
      'Connect with Sub Pop or other Seattle indie labels',
      'Authentic, raw sound preferred',
      'Capitol Hill neighborhood shows build credibility',
    ],
  },
  
  'Phoenix, AZ': {
    name: 'Phoenix',
    state_province: 'Arizona',
    population_millions: 4.9,
    music_scene_strength: 0.65,
    music_industry_presence: 'developing',
    genre_preferences: {
      pop: 0.8,
      rnb: 0.75,
      hip_hop: 0.85,
      electronic: 0.8,
      alternative: 0.75,
      latin: 0.9,
      country: 0.75,
      rock: 0.8,
    },
    sonic_profile: {
      preferred_tempo_range: [85, 130],
      preferred_energy: [0.6, 0.9],
      bass_culture: 'moderate',
      production_preference: 'balanced',
    },
    key_venues: ['Crescent Ballroom', 'The Van Buren', 'Talking Stick Resort Arena'],
    influential_radio_stations: ['Power 98.3', 'Alt AZ 93.3', 'La Buena'],
    local_tastemakers: ['Dbacks/Suns halftime shows', 'Arizona hip-hop scene'],
    music_festivals: ['McDowell Mountain Music Festival', 'M3F', 'Phoenix Lights'],
    scene_description: 'Growing market. Strong Latin influence. Desert aesthetic in alternative/electronic scenes.',
    target_demographics: ['Latin community', 'College students (ASU)', 'Transplants from CA/Midwest'],
    best_strategies: [
      'Target large Latin demographic',
      'ASU campus shows (huge college population)',
      'Growing EDM scene (Phoenix Lights fest)',
      'Desert vibes resonate in branding',
    ],
  },
  
  'Portland, OR': {
    name: 'Portland',
    state_province: 'Oregon',
    population_millions: 2.5,
    music_scene_strength: 0.78,
    music_industry_presence: 'emerging',
    genre_preferences: {
      pop: 0.7,
      rnb: 0.65,
      hip_hop: 0.7,
      electronic: 0.85,
      alternative: 0.95,
      latin: 0.55,
      country: 0.5,
      rock: 0.9,
    },
    sonic_profile: {
      preferred_tempo_range: [80, 120],
      preferred_energy: [0.4, 0.75],
      bass_culture: 'light',
      production_preference: 'experimental',
    },
    key_venues: ['Crystal Ballroom', 'Doug Fir Lounge', 'Mississippi Studios', 'Wonder Ballroom'],
    influential_radio_stations: ['KEXP Seattle reach', '94/7 Alternative Portland', 'XRAY.FM'],
    local_tastemakers: ['Portland indie scene', 'DIY venue operators'],
    music_festivals: ['Project PABST', 'MusicfestNW', 'Pickathon'],
    scene_description: 'Quirky indie scene. Values experimental and DIY. Anti-commercial aesthetic.',
    target_demographics: ['Indie purists', 'DIY scene', 'Hipster culture', 'Environmentalists'],
    best_strategies: [
      'Embrace DIY and anti-commercial aesthetic',
      'House shows and small venues build credibility',
      'Experimental production valued',
      'Sustainability and social consciousness matter',
    ],
  },
};

// Calculate sub-regional match
function calculateSubRegionalMatch(
  features: AudioFeatures,
  genre: string,
  subregion: SubRegion
): SubRegionalMatchScore {
  const genreKey = genre.toLowerCase().replace(/\s+/g, '_').replace('&', '') as keyof typeof subregion.genre_preferences;
  
  // Genre fit
  const genreFit = (subregion.genre_preferences[genreKey] || 0.5) * 100;
  
  // Sonic fit
  const tempoFit = features.tempo_bpm >= subregion.sonic_profile.preferred_tempo_range[0] &&
                   features.tempo_bpm <= subregion.sonic_profile.preferred_tempo_range[1] ? 100 : 70;
  const energyFit = features.energy >= subregion.sonic_profile.preferred_energy[0] &&
                    features.energy <= subregion.sonic_profile.preferred_energy[1] ? 100 : 70;
  const sonicFit = (tempoFit + energyFit) / 2;
  
  // Scene strength
  const sceneBonus = subregion.music_scene_strength * 20;
  
  // Calculate overall match
  const matchScore = Math.round((genreFit * 0.5 + sonicFit * 0.3 + sceneBonus * 1.0));
  
  // Generate insights
  const strengths: string[] = [];
  const recommendedActions: string[] = [];
  
  if (genreFit > 85) {
    strengths.push(`Strong ${genre} scene`);
  }
  if (subregion.music_industry_presence === 'major') {
    strengths.push('Major industry presence');
  }
  if (subregion.music_scene_strength > 0.85) {
    strengths.push('Vibrant music community');
  }
  
  strengths.push(subregion.scene_description);
  
  // Add top strategies
  recommendedActions.push(...subregion.best_strategies.slice(0, 3));
  
  return {
    region: `${subregion.name}, ${subregion.state_province}`,
    match_score: Math.min(matchScore, 100),
    strengths,
    key_venues: subregion.key_venues.slice(0, 4),
    recommended_actions: recommendedActions,
  };
}

// Main sub-regional analysis function
export function analyzeUSSubRegions(
  features: AudioFeatures,
  targetGenre?: string
): SubRegionalAnalysis {
  const genre = targetGenre || 'Pop';
  
  // Calculate matches for all US sub-regions
  const allMatches = Object.values(US_SUBREGIONS).map(subregion =>
    calculateSubRegionalMatch(features, genre, subregion)
  );
  
  // Sort by match score
  allMatches.sort((a, b) => b.match_score - a.match_score);
  
  return {
    country: 'United States',
    top_subregions: allMatches.slice(0, 5),
    market_overview: `Based on your ${genre} track's characteristics, here are the best US cities to target. Consider focusing marketing efforts on these markets first.`,
  };
}

// Export sub-regional data for other countries
export const UK_SUBREGIONS = {
  // Future: London, Manchester, Birmingham, Glasgow, Bristol
};

export const CANADA_SUBREGIONS = {
  // Future: Toronto, Vancouver, Montreal, Calgary
};

export const BRAZIL_SUBREGIONS = {
  // Future: São Paulo, Rio de Janeiro, Brasília
};
