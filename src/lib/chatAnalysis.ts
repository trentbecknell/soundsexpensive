import { ChatMessage } from '../components/Chat';
import { 
  ArtistPersonalityTraits, 
  SonicProfile, 
  ArtistProfile 
} from './artistProfiling';
import { REFERENCE_ARTISTS } from '../data/reference-artists';
import { 
  PERSONALITY_TRAIT_PATTERNS, 
  SONIC_FEATURE_PATTERNS 
} from '../data/personality-patterns';

// Analysis result type
export interface ArtistAnalysis {
  personality: Partial<ArtistPersonalityTraits>;
  sonics: Partial<SonicProfile>;
}

// Type-safe index signatures
type PersonalityKey = keyof ArtistPersonalityTraits;
type SonicKey = keyof SonicProfile;

// Analyze a chat message for personality and sonic traits
export function analyzeChatMessage(message: string): ArtistAnalysis {
  const analysis: ArtistAnalysis = {
    personality: {},
    sonics: {}
  };

  message = message.toLowerCase();

  // Analyze personality traits
  Object.entries(PERSONALITY_TRAIT_PATTERNS).forEach(([trait, patterns]) => {
    const key = trait as PersonalityKey;
    const highScore = patterns.high.filter((p: string) => message.includes(p)).length;
    const lowScore = patterns.low.filter((p: string) => message.includes(p)).length;
    if (highScore > 0 || lowScore > 0) {
      const score = (highScore - lowScore + patterns.high.length) / (patterns.high.length * 2);
      analysis.personality[key] = score;
    }
  });

  // Analyze sonic characteristics
  Object.entries(SONIC_FEATURE_PATTERNS).forEach(([feature, patterns]) => {
    const key = feature as SonicKey;
    const highScore = patterns.high.filter((p: string) => message.includes(p)).length;
    const lowScore = patterns.low.filter((p: string) => message.includes(p)).length;
    if (highScore > 0 || lowScore > 0) {
      const score = (highScore - lowScore + patterns.high.length) / (patterns.high.length * 2);
      analysis.sonics[key] = score;
    }
  });

  return analysis;
}

// Find best matching artists by personality and sonic traits 
export function findMatchingArtists(analysis: ArtistAnalysis): ArtistProfile[] {
  const results = REFERENCE_ARTISTS.map(artist => {
    let score = 0;
    let count = 0;

    // Compare personality traits
    Object.entries(analysis.personality).forEach(([trait, value]) => {
      const key = trait as PersonalityKey;
      if (artist.personality[key]) {
        score += 1 - Math.abs(artist.personality[key] - value);
        count++;
      }
    });

    // Compare sonic characteristics
    Object.entries(analysis.sonics).forEach(([feature, value]) => {
      const key = feature as SonicKey;
      if (artist.sonics[key]) {
        score += 1 - Math.abs(artist.sonics[key] - value);
        count++;
      }
    });

    // Calculate weighted average score
    const avgScore = count > 0 ? score / count : 0;

    return {
      artist,
      score: avgScore
    };
  });

  // Sort by score descending and return top matches
  return results
    .sort((a, b) => b.score - a.score)
    .map(r => r.artist)
    .slice(0, 3);
}

// Suggest follow-up questions to complete the artist profile
export function suggestFollowupQuestions(analysis: ArtistAnalysis): string[] {
  const missingTraits = Object.entries(PERSONALITY_TRAIT_PATTERNS)
    .filter(([trait]) => !analysis.personality[trait as PersonalityKey])
    .map(([trait]) => `Tell me more about your ${trait}...`);

  const missingSonics = Object.entries(SONIC_FEATURE_PATTERNS)
    .filter(([feature]) => !analysis.sonics[feature as SonicKey])
    .map(([feature]) => `How ${feature} is your music?`);

  return [...missingTraits, ...missingSonics];
}

