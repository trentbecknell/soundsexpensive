import type { ArtistPersonalityTraits, SonicProfile } from '../lib/artistProfiling';

export const PERSONALITY_TRAIT_PATTERNS: Record<keyof ArtistPersonalityTraits, {
  high: string[];
  low: string[];
}> = {
  experimentalness: {
    high: ['experiment', 'innovative', 'unique', 'different', 'new', 'boundary', 'push'],
    low: ['traditional', 'classic', 'proven', 'established', 'conventional']
  },
  genreFluidity: {
    high: ['blend', 'mix', 'fusion', 'cross-genre', 'diverse'],
    low: ['pure', 'authentic', 'traditional', 'classic']
  },
  productionStyle: {
    high: ['polished', 'pristine', 'clean', 'refined', 'detailed'],
    low: ['raw', 'rough', 'natural', 'organic', 'unfiltered']
  },
  workflowPreference: {
    high: ['structured', 'organized', 'planned', 'methodical'],
    low: ['spontaneous', 'freestyle', 'improvised', 'organic']
  },
  performanceEnergy: {
    high: ['energetic', 'powerful', 'intense', 'dynamic', 'explosive'],
    low: ['subtle', 'gentle', 'soft', 'delicate', 'understated']
  },
  collaborationStyle: {
    high: ['collaborative', 'team', 'together', 'collective', 'band'],
    low: ['solo', 'independent', 'alone', 'personal']
  },
  commercialAppeal: {
    high: ['mainstream', 'popular', 'accessible', 'universal', 'broad'],
    low: ['underground', 'alternative', 'niche', 'experimental']
  },
  audienceConnection: {
    high: ['interactive', 'engaging', 'connecting', 'community'],
    low: ['introspective', 'personal', 'private', 'intimate']
  },
  emotionalDepth: {
    high: ['deep', 'emotional', 'intense', 'passionate', 'raw'],
    low: ['light', 'fun', 'playful', 'casual', 'simple']
  },
  artisticIntensity: {
    high: ['focused', 'dedicated', 'serious', 'committed', 'driven'],
    low: ['relaxed', 'casual', 'easy-going', 'flexible']
  }
};

export const SONIC_FEATURE_PATTERNS: Record<keyof SonicProfile, {
  high: string[];
  low: string[];
}> = {
  danceability: {
    high: ['dance', 'groove', 'rhythm', 'beat', 'movement'],
    low: ['ambient', 'atmospheric', 'floating', 'abstract']
  },
  energy: {
    high: ['energetic', 'powerful', 'intense', 'driving', 'strong'],
    low: ['calm', 'gentle', 'soft', 'mellow', 'subtle']
  },
  valence: {
    high: ['happy', 'uplifting', 'positive', 'bright', 'joyful'],
    low: ['dark', 'moody', 'melancholic', 'sad', 'somber']
  },
  instrumentalness: {
    high: ['instrumental', 'orchestral', 'symphonic', 'acoustic'],
    low: ['vocal', 'lyrics', 'singing', 'voice']
  },
  acousticness: {
    high: ['acoustic', 'unplugged', 'organic', 'natural'],
    low: ['electronic', 'digital', 'synthetic', 'processed']
  },
  speechiness: {
    high: ['rap', 'spoken', 'words', 'lyrical', 'poetry'],
    low: ['melodic', 'singing', 'instrumental', 'humming']
  },
  tempo: {
    high: ['fast', 'quick', 'uptempo', 'rapid', 'energetic'],
    low: ['slow', 'downtempo', 'relaxed', 'steady']
  },
  complexity: {
    high: ['complex', 'intricate', 'layered', 'sophisticated'],
    low: ['simple', 'minimal', 'straightforward', 'basic']
  },
  dynamics: {
    high: ['dynamic', 'contrast', 'varied', 'range'],
    low: ['consistent', 'steady', 'even', 'stable']
  },
  textureDepth: {
    high: ['rich', 'dense', 'layered', 'textured', 'full'],
    low: ['minimal', 'sparse', 'simple', 'clean']
  }
};