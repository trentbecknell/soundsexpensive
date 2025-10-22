import { ArtistProfile, ArtistMatch, SonicProfile } from './artistProfiling';

// Simplified example of how Spotify calculates audio feature similarity
function calculateSonicSimilarity(profile1: SonicProfile, profile2: SonicProfile): number {
  const features = [
    'danceability',
    'energy',
    'valence',
    'instrumentalness',
    'acousticness',
    'speechiness',
    'tempo',
    'complexity',
    'dynamics',
    'textureDepth'
  ] as const;

  // Euclidean distance calculation
  const sumSquaredDiff = features.reduce((sum, feature) => {
    const diff = profile1[feature] - profile2[feature];
    return sum + diff * diff;
  }, 0);

  // Convert to similarity score (0-1)
  return 1 / (1 + Math.sqrt(sumSquaredDiff));
}

// Calculate personality trait similarity
function calculatePersonalitySimilarity(profile1: ArtistProfile, profile2: ArtistProfile): number {
  const traits = [
    'experimentalness',
    'genreFluidity',
    'productionStyle',
    'workflowPreference',
    'performanceEnergy',
    'collaborationStyle',
    'commercialAppeal',
    'audienceConnection',
    'emotionalDepth',
    'artisticIntensity'
  ] as const;

  const sumSquaredDiff = traits.reduce((sum, trait) => {
    const diff = profile1.personality[trait] - profile2.personality[trait];
    return sum + diff * diff;
  }, 0);

  return 1 / (1 + Math.sqrt(sumSquaredDiff));
}

// Calculate audience overlap
function calculateAudienceOverlap(profile1: ArtistProfile, profile2: ArtistProfile): number {
  const demographicsOverlap = profile1.targetAudience.demographics.filter(
    d => profile2.targetAudience.demographics.includes(d)
  ).length / Math.max(profile1.targetAudience.demographics.length, profile2.targetAudience.demographics.length);

  const platformsOverlap = profile1.targetAudience.platforms.filter(
    p => profile2.targetAudience.platforms.includes(p)
  ).length / Math.max(profile1.targetAudience.platforms.length, profile2.targetAudience.platforms.length);

  return (demographicsOverlap + platformsOverlap) / 2;
}

// Genre similarity using a weighted approach
function calculateGenreSimilarity(profile1: ArtistProfile, profile2: ArtistProfile): number {
  const primaryWeight = 0.7;
  const secondaryWeight = 0.3;

  const primaryOverlap = profile1.primaryGenres.filter(
    g => profile2.primaryGenres.includes(g)
  ).length / Math.max(profile1.primaryGenres.length, profile2.primaryGenres.length);

  const secondaryOverlap = profile1.secondaryGenres.filter(
    g => profile2.secondaryGenres.includes(g)
  ).length / Math.max(profile1.secondaryGenres.length, profile2.secondaryGenres.length);

  return primaryWeight * primaryOverlap + secondaryWeight * secondaryOverlap;
}

// Main matching function
export function findArtistMatches(
  profile: ArtistProfile,
  database: ArtistProfile[],
  minSimilarity = 0.5
): ArtistMatch[] {
  const matches: ArtistMatch[] = [];

  for (const dbProfile of database) {
    const sonicSimilarity = calculateSonicSimilarity(profile.sonics, dbProfile.sonics);
    const personalitySimilarity = calculatePersonalitySimilarity(profile, dbProfile);
    const audienceOverlap = calculateAudienceOverlap(profile, dbProfile);
    const genreSimilarity = calculateGenreSimilarity(profile, dbProfile);

    // Weighted overall match score
    const weights = {
      sonic: 0.3,
      personality: 0.3,
      audience: 0.2,
      genre: 0.2
    };

    const overallScore = 
      sonicSimilarity * weights.sonic +
      personalitySimilarity * weights.personality +
      audienceOverlap * weights.audience +
      genreSimilarity * weights.genre;

    if (overallScore >= minSimilarity) {
      matches.push({
        artistId: dbProfile.id || 'unknown',
        name: dbProfile.name || 'Unknown Artist',
        matchScore: overallScore,
        matchDimensions: {
          personality: personalitySimilarity,
          sonics: sonicSimilarity,
          audience: audienceOverlap,
          career: genreSimilarity
        },
        suggestedStrategies: generateStrategies(profile, dbProfile)
      });
    }
  }

  return matches.sort((a, b) => b.matchScore - a.matchScore);
}

// Generate strategic recommendations based on successful artist matches
function generateStrategies(profile: ArtistProfile, match: ArtistProfile): string[] {
  const strategies: string[] = [];

  // Production strategy
  if (match.sonics.energy > profile.sonics.energy) {
    strategies.push("Consider increasing energy levels in production");
  }

  // Genre strategy
  if (match.personality.genreFluidity > profile.personality.genreFluidity) {
    strategies.push("Experiment with genre blending for broader appeal");
  }

  // Audience development
  const matchPlatforms = new Set(match.targetAudience.platforms);
  const missingPlatforms = [...matchPlatforms].filter(
    p => !profile.targetAudience.platforms.includes(p)
  );
  if (missingPlatforms.length) {
    strategies.push(`Expand presence to ${missingPlatforms.join(", ")}`);
  }

  // Collaboration potential
  if (match.personality.collaborationStyle > profile.personality.collaborationStyle) {
    strategies.push("Increase collaborative projects for network growth");
  }

  return strategies;
}