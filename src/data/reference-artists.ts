import { ArtistProfile } from '../lib/artistProfiling';

export const REFERENCE_ARTISTS: ArtistProfile[] = [
  {
    id: 'the-weeknd',
    name: 'The Weeknd',
    personality: {
      experimentalness: 0.8,
      genreFluidity: 0.9,
      productionStyle: 0.9,
      workflowPreference: 0.7,
      performanceEnergy: 0.8,
      collaborationStyle: 0.6,
      commercialAppeal: 0.9,
      audienceConnection: 0.8,
      emotionalDepth: 0.9,
      artisticIntensity: 0.9
    },
    maturity: {
      creative: "Innovating",
      technical: "Established",
      business: "Transforming",
      audience: "Transforming",
      brand: "Transforming"
    },
    sonics: {
      danceability: 0.8,
      energy: 0.7,
      valence: 0.4,
      instrumentalness: 0.1,
      acousticness: 0.2,
      speechiness: 0.1,
      tempo: 0.6,
      complexity: 0.8,
      dynamics: 0.7,
      textureDepth: 0.9
    },
    primaryGenres: ['R&B', 'Pop'],
    secondaryGenres: ['New Wave', 'Dance', 'Alternative'],
    keyInfluences: ['Michael Jackson', 'Prince', 'Depeche Mode'],
    targetAudience: {
      demographics: ['18-34', 'Urban', 'Global'],
      psychographics: ['Trend-conscious', 'Night life', 'Fashion-forward'],
      platforms: ['Spotify', 'TikTok', 'Instagram', 'YouTube']
    }
  },
  {
    id: 'taylor-swift',
    name: 'Taylor Swift',
    personality: {
      experimentalness: 0.7,
      genreFluidity: 0.8,
      productionStyle: 0.9,
      workflowPreference: 0.9,
      performanceEnergy: 0.8,
      collaborationStyle: 0.7,
      commercialAppeal: 1.0,
      audienceConnection: 1.0,
      emotionalDepth: 0.9,
      artisticIntensity: 0.8
    },
    maturity: {
      creative: "Transforming",
      technical: "Established",
      business: "Transforming",
      audience: "Transforming",
      brand: "Transforming"
    },
    sonics: {
      danceability: 0.7,
      energy: 0.6,
      valence: 0.6,
      instrumentalness: 0.1,
      acousticness: 0.4,
      speechiness: 0.2,
      tempo: 0.6,
      complexity: 0.7,
      dynamics: 0.8,
      textureDepth: 0.8
    },
    primaryGenres: ['Pop', 'Country Pop'],
    secondaryGenres: ['Folk', 'Alternative', 'Rock'],
    keyInfluences: ['Shania Twain', 'Stevie Nicks', 'Paul McCartney'],
    targetAudience: {
      demographics: ['13-34', 'Female-leaning', 'Global'],
      psychographics: ['Story-focused', 'Relationship-oriented', 'Personal growth'],
      platforms: ['Spotify', 'Instagram', 'TikTok', 'YouTube']
    }
  },
  {
    id: 'kendrick-lamar',
    name: 'Kendrick Lamar',
    personality: {
      experimentalness: 0.9,
      genreFluidity: 0.8,
      productionStyle: 0.9,
      workflowPreference: 0.8,
      performanceEnergy: 0.9,
      collaborationStyle: 0.7,
      commercialAppeal: 0.8,
      audienceConnection: 0.9,
      emotionalDepth: 1.0,
      artisticIntensity: 1.0
    },
    maturity: {
      creative: "Transforming",
      technical: "Innovating",
      business: "Established",
      audience: "Transforming",
      brand: "Transforming"
    },
    sonics: {
      danceability: 0.6,
      energy: 0.8,
      valence: 0.4,
      instrumentalness: 0.2,
      acousticness: 0.3,
      speechiness: 0.9,
      tempo: 0.7,
      complexity: 1.0,
      dynamics: 0.9,
      textureDepth: 0.9
    },
    primaryGenres: ['Hip Hop', 'Conscious Rap'],
    secondaryGenres: ['Jazz Rap', 'West Coast Hip Hop', 'Soul'],
    keyInfluences: ['Tupac', 'Eminem', 'Andre 3000'],
    targetAudience: {
      demographics: ['16-35', 'Urban', 'Global'],
      psychographics: ['Socially conscious', 'Lyric-focused', 'Cultural'],
      platforms: ['Spotify', 'YouTube', 'Twitter']
    }
  }
  // Add more reference artists...
];