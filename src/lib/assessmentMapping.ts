import { ArtistSelfAssessment, PartialAssessment, Genre, SuccessKPI } from '../types/artistAssessment';
import { ArtistAnalysis } from './chatAnalysis';

// Convert chat analysis to schema-compliant assessment data
export function mapChatAnalysisToAssessment(
  analysis: ArtistAnalysis,
  chatMessages: any[],
  existingProfile?: any
): PartialAssessment {
  const userMessages = chatMessages.filter(m => m.type === 'user').map(m => m.content);
  const allText = userMessages.join(' ').toLowerCase();

  // Extract audio profile from sonic analysis
  const audio_profile = {
    tempo_bpm: estimateTempo(analysis.sonics),
    danceability: analysis.sonics.danceability || 0.5,
    energy: analysis.sonics.energy || 0.5,
    valence: analysis.sonics.valence || 0.5,
    acousticness: analysis.sonics.acousticness,
    instrumentalness: analysis.sonics.instrumentalness,
    speechiness: analysis.sonics.speechiness,
    vocal_prominence: estimateVocalProminence(allText)
  };

  // Extract brand narrative from personality analysis
  const brand_narrative = {
    positioning: generatePositioning(analysis, allText),
    themes: extractThemes(allText),
    audience_problem_solved: extractAudienceProblem(allText)
  };

  // Extract identity information
  const identity = {
    artist_name: existingProfile?.artistName || '',
    primary_genres: extractGenres(allText),
    home_market: existingProfile?.city || '',
    subgenres_tags: extractSubgenres(allText)
  };

  // Extract goals and influences
  const goals = {
    vision_statement: extractVisionStatement(allText),
    time_horizon_months: 12, // Default
    success_kpis: extractSuccessKPIs(allText)
  };

  const influences = {
    reference_artists: extractReferenceArtists(allText),
    adjacency_focus: extractAdjacencyFocus(analysis)
  };

  return {
    identity,
    goals,
    influences,
    audio_profile,
    brand_narrative,
    // Set reasonable defaults for required fields
    catalog_plan: {
      planned_releases: 4,
      collaboration_ratio: 0.3
    },
    release_strategy: {
      cadence_weeks: 8,
      pre_save_push_days: 14
    }
  };
}

// Helper functions for extraction
function estimateTempo(sonics: any): number {
  if (sonics.tempo) return sonics.tempo * 200; // Normalize to BPM
  if (sonics.energy > 0.7) return 120;
  if (sonics.energy < 0.3) return 80;
  return 100;
}

function estimateVocalProminence(text: string): number {
  const vocalKeywords = ['vocals', 'singing', 'voice', 'lyrics', 'storytelling'];
  const instrumentalKeywords = ['instrumental', 'beat', 'production', 'synth'];
  
  const vocalCount = vocalKeywords.filter(word => text.includes(word)).length;
  const instrumentalCount = instrumentalKeywords.filter(word => text.includes(word)).length;
  
  return Math.min(1, Math.max(0, (vocalCount - instrumentalCount + 3) / 6));
}

function generatePositioning(analysis: any, text: string): string {
  const personalityTraits = Object.keys(analysis.personality);
  const sonicFeatures = Object.keys(analysis.sonics);
  
  let positioning = '';
  
  if (personalityTraits.includes('emotionalDepth')) positioning += 'emotional ';
  if (sonicFeatures.includes('danceability') && analysis.sonics.danceability > 0.6) positioning += 'danceable ';
  if (sonicFeatures.includes('energy') && analysis.sonics.energy > 0.7) positioning += 'energetic ';
  if (text.includes('atmospheric') || text.includes('dreamy')) positioning += 'atmospheric ';
  
  return positioning.trim() + ' artist with authentic storytelling';
}

function extractThemes(text: string): string[] {
  const themes: string[] = [];
  
  if (text.includes('love') || text.includes('relationship')) themes.push('Love & Relationships');
  if (text.includes('empowerment') || text.includes('strength')) themes.push('Empowerment');
  if (text.includes('story') || text.includes('personal')) themes.push('Personal Storytelling');
  if (text.includes('social') || text.includes('change')) themes.push('Social Commentary');
  if (text.includes('healing') || text.includes('uplift')) themes.push('Healing & Wellness');
  if (text.includes('fun') || text.includes('party')) themes.push('Celebration & Joy');
  
  return themes.length > 0 ? themes : ['Authentic Expression'];
}

function extractAudienceProblem(text: string): string {
  if (text.includes('healing') || text.includes('comfort')) return 'Seeking emotional healing and comfort';
  if (text.includes('empowerment') || text.includes('strength')) return 'Need for empowerment and self-confidence';
  if (text.includes('dance') || text.includes('energy')) return 'Desire for uplifting, energetic experiences';
  if (text.includes('story') || text.includes('connection')) return 'Craving authentic connection and relatability';
  
  return 'Seeking authentic artistic expression and emotional connection';
}

function extractGenres(text: string): Genre[] {
  const genres: Genre[] = [];
  
  if (text.includes('r&b') || text.includes('soul')) genres.push('R&B', 'Soul');
  if (text.includes('pop')) genres.push('Pop');
  if (text.includes('hip hop') || text.includes('rap')) genres.push('Hip Hop');
  if (text.includes('electronic') || text.includes('synth')) genres.push('Electronic');
  if (text.includes('dance')) genres.push('Dance');
  if (text.includes('indie') || text.includes('alternative')) genres.push('Indie', 'Alternative');
  if (text.includes('folk')) genres.push('Other'); // Folk maps to Other
  if (text.includes('jazz')) genres.push('Jazz');
  if (text.includes('gospel')) genres.push('Gospel');
  
  return genres.length > 0 ? [...new Set(genres)] : ['Pop'];
}

function extractSubgenres(text: string): string[] {
  const subgenres: string[] = [];
  
  if (text.includes('neo-soul')) subgenres.push('Neo-Soul');
  if (text.includes('alternative r&b')) subgenres.push('Alternative R&B');
  if (text.includes('bedroom pop')) subgenres.push('Bedroom Pop');
  if (text.includes('indie pop')) subgenres.push('Indie Pop');
  if (text.includes('dream pop')) subgenres.push('Dream Pop');
  if (text.includes('afrobeats')) subgenres.push('Afrobeats');
  if (text.includes('contemporary')) subgenres.push('Contemporary');
  
  return subgenres;
}

function extractVisionStatement(text: string): string {
  // Look for vision-like statements in user responses
  const visionKeywords = ['want to', 'hope to', 'dream', 'vision', 'goal', 'aspire'];
  const sentences = text.split(/[.!?]+/);
  
  for (const sentence of sentences) {
    if (visionKeywords.some(keyword => sentence.includes(keyword))) {
      return sentence.trim();
    }
  }
  
  return 'Create authentic music that resonates with listeners and builds meaningful connections';
}

function extractSuccessKPIs(text: string): SuccessKPI[] {
  const kpis: SuccessKPI[] = [];
  
  if (text.includes('stream') || text.includes('spotify')) kpis.push('MonthlyListeners', 'StreamsPerRelease');
  if (text.includes('live') || text.includes('concert') || text.includes('show')) kpis.push('TicketSales');
  if (text.includes('playlist')) kpis.push('PlaylistAdds');
  if (text.includes('social') || text.includes('follow')) kpis.push('SocialFollowers');
  if (text.includes('sync') || text.includes('tv') || text.includes('film')) kpis.push('SyncPlacements');
  if (text.includes('chart')) kpis.push('ChartPosition');
  
  return kpis.length > 0 ? kpis : ['MonthlyListeners', 'StreamsPerRelease'];
}

function extractReferenceArtists(text: string): string[] {
  // Common artist name patterns and known references
  const knownArtists = [
    'Beyoncé', 'SZA', 'H.E.R.', 'The Weeknd', 'Frank Ocean', 'Solange',
    'Billie Eilish', 'Lorde', 'FKA twigs', 'Jhené Aiko', 'Summer Walker',
    'Kali Uchis', 'Daniel Caesar', 'Tyler Cole', 'Blood Orange'
  ];
  
  const mentioned = knownArtists.filter(artist => 
    text.toLowerCase().includes(artist.toLowerCase())
  );
  
  return mentioned.length > 0 ? mentioned : ['SZA', 'H.E.R.']; // Default references
}

function extractAdjacencyFocus(analysis: any): string[] {
  const focus: string[] = [];
  
  if (analysis.personality.emotionalDepth > 0.6) focus.push('H.E.R.');
  if (analysis.sonics.danceability > 0.7) focus.push('Beyoncé');
  if (analysis.personality.experimentalness > 0.6) focus.push('FKA twigs');
  if (analysis.sonics.valence < 0.4) focus.push('SZA');
  
  return focus;
}

// Convert current app state to assessment schema
export function convertLegacyProfileToAssessment(app: any): PartialAssessment {
  return {
    identity: {
      artist_name: app.profile.artistName || '',
      primary_genres: app.profile.genres ? 
        app.profile.genres.split(',').map((g: string) => g.trim()).slice(0, 3) as Genre[] : 
        ['Pop'],
      home_market: app.profile.city || ''
    },
    goals: {
      vision_statement: app.profile.elevatorPitch || 'Create authentic music that connects with audiences',
      time_horizon_months: Math.round(app.project.targetWeeks / 4) || 12,
      target_markets: app.project.targetMarkets || []
    },
    influences: {
      reference_artists: ['SZA', 'H.E.R.'] // Default
    },
    audio_profile: {
      tempo_bpm: 100, // Default
      danceability: 0.5,
      energy: 0.5,
      valence: 0.5
    },
    catalog_plan: {
      planned_releases: app.project.units || 3,
      collaboration_ratio: 0.3
    },
    release_strategy: {
      cadence_weeks: Math.round(app.project.targetWeeks / app.project.units) || 8,
      pre_save_push_days: 14
    },
    brand_narrative: {
      positioning: app.profile.elevatorPitch || 'Authentic artist with unique voice',
      themes: ['Authentic Expression']
    },
    resources: {
      budget_total_usd: app.budget?.reduce((sum: number, item: any) => sum + (item.qty * item.unitCost), 0) || 0
    }
  };
}