// Audio Mix Analysis Library
// Provides diagnostic feedback on uploaded mixes based on genre, artist, and industry benchmarks

import { INDUSTRY_BENCHMARKS } from './industryBenchmarks';
import type {
  AudioFeatures,
  MixBenchmarks,
  MixAnalysisResult,
  DiagnosticIssue,
  MixScore,
  ComparisonResult,
  FrequencyBalance,
  MixingStage,
} from '../types/mixAnalysis';

// Genre-specific mix benchmarks (extends industry benchmarks with technical specs)
export const MIX_BENCHMARKS: Record<string, MixBenchmarks> = {
  'R&B': {
    genre: 'R&B',
    tempo_bpm: [70, 110],
    danceability: [0.4, 0.8],
    energy: [0.3, 0.7],
    valence: [0.2, 0.7],
    loudness_db: [-8, -5],
    dynamic_range_db: [6, 10],
    stereo_width: [0.6, 0.9],
    frequency_targets: {
      bass_prominence: [-3, 0],
      mid_clarity: [-2, 1],
      high_presence: [-4, -1],
    },
    typical_intro_seconds: [5, 15],
    typical_duration_seconds: [180, 240],
    reference_tracks: ['SZA - Good Days', 'H.E.R. - Focus', 'Summer Walker - Playing Games'],
  },
  'Pop': {
    genre: 'Pop',
    tempo_bpm: [90, 130],
    danceability: [0.5, 0.9],
    energy: [0.5, 0.9],
    valence: [0.4, 0.8],
    loudness_db: [-6, -4],
    dynamic_range_db: [5, 9],
    stereo_width: [0.7, 0.95],
    frequency_targets: {
      bass_prominence: [-2, 1],
      mid_clarity: [-1, 2],
      high_presence: [-2, 0],
    },
    typical_intro_seconds: [3, 10],
    typical_duration_seconds: [165, 210],
    reference_tracks: ['Dua Lipa - Levitating', 'The Weeknd - Blinding Lights', 'Doja Cat - Kiss Me More'],
  },
  'Hip Hop': {
    genre: 'Hip Hop',
    tempo_bpm: [70, 140],
    danceability: [0.6, 0.9],
    energy: [0.6, 0.9],
    valence: [0.3, 0.8],
    loudness_db: [-7, -4],
    dynamic_range_db: [4, 8],
    stereo_width: [0.5, 0.8],
    frequency_targets: {
      bass_prominence: [0, 3],
      mid_clarity: [-1, 1],
      high_presence: [-3, -1],
    },
    typical_intro_seconds: [0, 8],
    typical_duration_seconds: [150, 210],
    reference_tracks: ['Drake - God\'s Plan', 'Kendrick Lamar - HUMBLE.', 'Travis Scott - SICKO MODE'],
  },
  'Electronic': {
    genre: 'Electronic',
    tempo_bpm: [100, 150],
    danceability: [0.7, 0.95],
    energy: [0.7, 0.95],
    valence: [0.4, 0.9],
    loudness_db: [-6, -3],
    dynamic_range_db: [4, 8],
    stereo_width: [0.8, 1.0],
    frequency_targets: {
      bass_prominence: [-1, 2],
      mid_clarity: [0, 2],
      high_presence: [-1, 1],
    },
    typical_intro_seconds: [8, 30],
    typical_duration_seconds: [180, 300],
    reference_tracks: ['Disclosure - Latch', 'ODESZA - Say My Name', 'Flume - Never Be Like You'],
  },
  'Alternative': {
    genre: 'Alternative',
    tempo_bpm: [80, 120],
    danceability: [0.3, 0.7],
    energy: [0.4, 0.8],
    valence: [0.2, 0.7],
    loudness_db: [-9, -6],
    dynamic_range_db: [7, 12],
    stereo_width: [0.6, 0.9],
    frequency_targets: {
      bass_prominence: [-2, 1],
      mid_clarity: [-1, 2],
      high_presence: [-2, 1],
    },
    typical_intro_seconds: [5, 20],
    typical_duration_seconds: [180, 270],
    reference_tracks: ['Phoebe Bridgers - Kyoto', 'Tame Impala - The Less I Know The Better', 'Glass Animals - Heat Waves'],
  },
};

/**
 * Mock audio analysis using Web Audio API
 * In production, this would analyze actual audio data
 */
export async function analyzeAudioFile(file: File): Promise<AudioFeatures> {
  // For demo purposes, generate realistic-looking audio features
  // In production, use Web Audio API or send to backend for analysis
  
  const fileName = file.name.toLowerCase();
  const duration = await getAudioDuration(file);
  
  // Generate features with some intelligence based on filename hints
  const isMix = fileName.includes('mix') || fileName.includes('master');
  const isDemo = fileName.includes('demo') || fileName.includes('rough');
  
  return {
    // Core metrics
    tempo_bpm: 80 + Math.random() * 60,
    danceability: 0.4 + Math.random() * 0.5,
    energy: isDemo ? 0.5 + Math.random() * 0.3 : 0.6 + Math.random() * 0.35,
    valence: 0.3 + Math.random() * 0.5,
    acousticness: Math.random() * 0.4,
    instrumentalness: Math.random() * 0.3,
    speechiness: 0.05 + Math.random() * 0.15,
    loudness_db: isDemo ? -12 - Math.random() * 4 : -8 - Math.random() * 4,
    
    // Advanced metrics
    dynamic_range_db: isDemo ? 8 + Math.random() * 4 : 6 + Math.random() * 4,
    stereo_width: isMix ? 0.7 + Math.random() * 0.25 : 0.5 + Math.random() * 0.3,
    peak_db: -0.1 - Math.random() * 0.5,
    rms_db: -12 - Math.random() * 6,
    crest_factor: 10 + Math.random() * 8,
    
    // Frequency balance (simulated)
    frequency_balance: {
      sub_bass: 0.6 + Math.random() * 0.3,
      bass: 0.7 + Math.random() * 0.25,
      low_mid: 0.65 + Math.random() * 0.25,
      mid: 0.75 + Math.random() * 0.2,
      high_mid: 0.7 + Math.random() * 0.25,
      presence: 0.65 + Math.random() * 0.3,
      brilliance: 0.6 + Math.random() * 0.35,
    },
    
    // Time-based
    duration_seconds: duration,
    intro_length_seconds: 5 + Math.random() * 10,
    outro_length_seconds: 10 + Math.random() * 15,
    
    // Tonal
    key: Math.floor(Math.random() * 12),
    mode: Math.random() > 0.5 ? 'major' : 'minor',
    key_confidence: 0.7 + Math.random() * 0.3,
  };
}

/**
 * Get audio duration from file
 */
async function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.onloadedmetadata = () => {
      resolve(audio.duration);
    };
    audio.onerror = () => {
      // Default duration if can't read
      resolve(180 + Math.random() * 60);
    };
    audio.src = URL.createObjectURL(file);
  });
}

/**
 * Get benchmarks for a specific genre
 */
export function getBenchmarksForGenre(genre: string): MixBenchmarks {
  return MIX_BENCHMARKS[genre] || MIX_BENCHMARKS['Pop'];
}

/**
 * Calculate mix score based on comparison to benchmarks
 */
export function calculateMixScore(
  features: AudioFeatures,
  benchmarks: MixBenchmarks
): MixScore {
  const scores = {
    loudness: scoreLoudness(features, benchmarks),
    dynamics: scoreDynamics(features, benchmarks),
    frequency_balance: scoreFrequencyBalance(features, benchmarks),
    stereo_imaging: scoreStereoImaging(features, benchmarks),
    genre_alignment: scoreGenreAlignment(features, benchmarks),
    commercial_readiness: scoreCommercialReadiness(features, benchmarks),
  };
  
  const overall = Math.round(
    (scores.loudness * 0.2 +
      scores.dynamics * 0.15 +
      scores.frequency_balance * 0.25 +
      scores.stereo_imaging * 0.15 +
      scores.genre_alignment * 0.15 +
      scores.commercial_readiness * 0.1) *
      100
  );
  
  return {
    overall,
    breakdown: scores,
  };
}

function scoreLoudness(features: AudioFeatures, benchmarks: MixBenchmarks): number {
  const [min, max] = benchmarks.loudness_db;
  const ideal = (min + max) / 2;
  const tolerance = (max - min) / 2;
  
  const deviation = Math.abs(features.loudness_db - ideal);
  const score = Math.max(0, 1 - deviation / (tolerance * 2));
  
  return score;
}

function scoreDynamics(features: AudioFeatures, benchmarks: MixBenchmarks): number {
  if (!features.dynamic_range_db) return 0.7;
  
  const [min, max] = benchmarks.dynamic_range_db;
  const dr = features.dynamic_range_db;
  
  if (dr >= min && dr <= max) return 1.0;
  if (dr < min) return Math.max(0, dr / min);
  return Math.max(0, 1 - (dr - max) / max);
}

function scoreFrequencyBalance(features: AudioFeatures, benchmarks: MixBenchmarks): number {
  if (!features.frequency_balance) return 0.7;
  
  const fb = features.frequency_balance;
  const values = Object.values(fb);
  
  // Check for reasonable balance (no frequency range too dominant or weak)
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
  
  // Lower variance = better balance
  const balanceScore = Math.max(0, 1 - variance * 2);
  
  // Check for adequate bass and highs
  const bassScore = fb.bass > 0.5 ? 1 : fb.bass * 2;
  const highScore = fb.presence > 0.5 ? 1 : fb.presence * 2;
  
  return (balanceScore * 0.5 + bassScore * 0.25 + highScore * 0.25);
}

function scoreStereoImaging(features: AudioFeatures, benchmarks: MixBenchmarks): number {
  if (!features.stereo_width) return 0.7;
  
  const [min, max] = benchmarks.stereo_width;
  const width = features.stereo_width;
  
  if (width >= min && width <= max) return 1.0;
  if (width < min) return width / min;
  return Math.max(0, 1 - (width - max) / (1 - max));
}

function scoreGenreAlignment(features: AudioFeatures, benchmarks: MixBenchmarks): number {
  let score = 0;
  let factors = 0;
  
  // Tempo alignment
  const [minTempo, maxTempo] = benchmarks.tempo_bpm;
  if (features.tempo_bpm >= minTempo && features.tempo_bpm <= maxTempo) {
    score += 1;
  } else {
    const deviation = Math.min(
      Math.abs(features.tempo_bpm - minTempo),
      Math.abs(features.tempo_bpm - maxTempo)
    );
    score += Math.max(0, 1 - deviation / 30);
  }
  factors++;
  
  // Energy alignment
  const [minEnergy, maxEnergy] = benchmarks.energy;
  if (features.energy >= minEnergy && features.energy <= maxEnergy) {
    score += 1;
  } else {
    score += 0.5;
  }
  factors++;
  
  // Danceability alignment
  const [minDance, maxDance] = benchmarks.danceability;
  if (features.danceability >= minDance && features.danceability <= maxDance) {
    score += 1;
  } else {
    score += 0.5;
  }
  factors++;
  
  return score / factors;
}

function scoreCommercialReadiness(features: AudioFeatures, benchmarks: MixBenchmarks): number {
  let score = 0;
  
  // Good loudness (competitive but not over-compressed)
  if (features.loudness_db >= -9 && features.loudness_db <= -4) score += 0.3;
  else if (features.loudness_db >= -12 && features.loudness_db <= -3) score += 0.15;
  
  // Good dynamic range (punchy but not lifeless)
  if (features.dynamic_range_db && features.dynamic_range_db >= 5 && features.dynamic_range_db <= 10) {
    score += 0.3;
  } else if (features.dynamic_range_db && features.dynamic_range_db >= 4) {
    score += 0.15;
  }
  
  // Good stereo width
  if (features.stereo_width && features.stereo_width >= 0.6 && features.stereo_width <= 0.9) {
    score += 0.2;
  } else if (features.stereo_width && features.stereo_width >= 0.5) {
    score += 0.1;
  }
  
  // Appropriate duration
  const [minDur, maxDur] = benchmarks.typical_duration_seconds;
  if (features.duration_seconds >= minDur && features.duration_seconds <= maxDur) {
    score += 0.2;
  } else if (features.duration_seconds >= minDur - 30 && features.duration_seconds <= maxDur + 30) {
    score += 0.1;
  }
  
  return Math.min(1, score);
}

/**
 * Generate diagnostic issues based on feature analysis
 */
export function generateDiagnostics(
  features: AudioFeatures,
  benchmarks: MixBenchmarks
): DiagnosticIssue[] {
  const issues: DiagnosticIssue[] = [];
  
  // Check loudness
  const [minLoudness, maxLoudness] = benchmarks.loudness_db;
  if (features.loudness_db < minLoudness - 3) {
    issues.push({
      category: 'loudness',
      severity: 'critical',
      title: 'Mix is Too Quiet',
      description: 'Your mix is significantly quieter than commercial standards for this genre.',
      current_value: `${features.loudness_db.toFixed(1)} LUFS`,
      target_value: `${minLoudness} to ${maxLoudness} LUFS`,
      recommendations: [
        'Increase overall gain during mastering',
        'Use a limiter to increase perceived loudness',
        'Check if individual tracks are sitting too low in the mix',
        'Consider parallel compression to add density',
      ],
      technical_details: 'LUFS (Loudness Units Full Scale) is the standard for measuring perceived loudness. Streaming platforms normalize to around -14 LUFS, but your mix should be competitive before normalization.',
    });
  } else if (features.loudness_db > maxLoudness + 2) {
    issues.push({
      category: 'loudness',
      severity: 'warning',
      title: 'Mix May Be Over-Compressed',
      description: 'Your mix is very loud, which might indicate over-compression and loss of dynamics.',
      current_value: `${features.loudness_db.toFixed(1)} LUFS`,
      target_value: `${minLoudness} to ${maxLoudness} LUFS`,
      recommendations: [
        'Reduce limiter threshold/gain',
        'Allow more dynamic range in the mix',
        'Check for excessive compression on the master bus',
        'Trust streaming platform normalization - you don\'t need to be the loudest',
      ],
      technical_details: 'Excessive loudness often comes at the cost of punch and dynamics. Modern streaming normalizes loudness anyway.',
    });
  }
  
  // Check dynamic range
  if (features.dynamic_range_db && features.dynamic_range_db < benchmarks.dynamic_range_db[0] - 2) {
    issues.push({
      category: 'dynamics',
      severity: features.dynamic_range_db < 4 ? 'critical' : 'warning',
      title: 'Limited Dynamic Range',
      description: 'Your mix lacks dynamic contrast, which can make it sound flat and fatiguing.',
      current_value: `${features.dynamic_range_db.toFixed(1)} dB`,
      target_value: `${benchmarks.dynamic_range_db[0]} to ${benchmarks.dynamic_range_db[1]} dB`,
      recommendations: [
        'Reduce compression on individual tracks',
        'Use less aggressive mastering limiting',
        'Preserve transients by using transient shapers carefully',
        'Allow choruses to be louder than verses for impact',
      ],
      technical_details: 'Dynamic range is the difference between the quietest and loudest parts. Too little makes mixes sound lifeless.',
    });
  }
  
  // Check frequency balance
  if (features.frequency_balance) {
    const fb = features.frequency_balance;
    
    if (fb.bass < 0.5) {
      issues.push({
        category: 'frequency_balance',
        severity: 'warning',
        title: 'Weak Low End',
        description: 'Bass frequencies are under-represented, which can make the mix sound thin.',
        current_value: 'Below target',
        recommendations: [
          'Boost bass and sub-bass frequencies (60-250 Hz)',
          'Check if bass instruments are sitting properly in the mix',
          'Use EQ to add weight to kick and bass',
          'Consider layering bass elements for more presence',
        ],
      });
    }
    
    if (fb.bass > 0.9) {
      issues.push({
        category: 'frequency_balance',
        severity: 'warning',
        title: 'Excessive Low End',
        description: 'Too much bass can make the mix sound muddy and translate poorly on small speakers.',
        current_value: 'Above target',
        recommendations: [
          'Use high-pass filters on non-bass elements',
          'Reduce low-mid buildup (200-400 Hz)',
          'Check bass and kick relationship - might be clashing',
          'Reference on multiple speaker systems',
        ],
      });
    }
    
    if (fb.brilliance < 0.5) {
      issues.push({
        category: 'frequency_balance',
        severity: 'suggestion',
        title: 'Lacking High-End Sparkle',
        description: 'High frequencies could use more presence for clarity and air.',
        current_value: 'Below target',
        recommendations: [
          'Add subtle high-shelf boost (8-12 kHz)',
          'Use saturation or harmonic exciters for highs',
          'Check if cymbals and vocals have enough top-end',
          'Consider de-essing before adding highs',
        ],
      });
    }
  }
  
  // Check stereo width
  if (features.stereo_width) {
    if (features.stereo_width < 0.4) {
      issues.push({
        category: 'stereo_imaging',
        severity: 'warning',
        title: 'Narrow Stereo Image',
        description: 'The mix sounds too centered and lacks width.',
        current_value: `${(features.stereo_width * 100).toFixed(0)}%`,
        target_value: `${(benchmarks.stereo_width[0] * 100).toFixed(0)}-${(benchmarks.stereo_width[1] * 100).toFixed(0)}%`,
        recommendations: [
          'Pan instruments across the stereo field',
          'Use stereo widening on appropriate tracks',
          'Double-track guitars/vocals and pan them',
          'Use stereo reverb and delay effects',
        ],
      });
    } else if (features.stereo_width > 0.95) {
      issues.push({
        category: 'stereo_imaging',
        severity: 'suggestion',
        title: 'Possibly Over-Widened',
        description: 'Extreme width can cause phase issues and weak center.',
        current_value: `${(features.stereo_width * 100).toFixed(0)}%`,
        target_value: `${(benchmarks.stereo_width[0] * 100).toFixed(0)}-${(benchmarks.stereo_width[1] * 100).toFixed(0)}%`,
        recommendations: [
          'Keep bass and kick centered (mono below 150 Hz)',
          'Check mono compatibility',
          'Avoid excessive stereo widening plugins',
          'Ensure lead vocals are centered',
        ],
      });
    }
  }
  
  // Check tempo for genre
  const [minTempo, maxTempo] = benchmarks.tempo_bpm;
  if (features.tempo_bpm < minTempo - 10 || features.tempo_bpm > maxTempo + 10) {
    issues.push({
      category: 'tempo',
      severity: 'suggestion',
      title: 'Tempo Outside Genre Norm',
      description: `This tempo is unusual for ${benchmarks.genre}. This could be intentional, but be aware it may affect playlisting.`,
      current_value: `${Math.round(features.tempo_bpm)} BPM`,
      target_value: `${minTempo}-${maxTempo} BPM typical`,
      recommendations: [
        'Consider if tempo serves the song or hinders it',
        'If intentional, embrace it as a unique characteristic',
        'Test with target audience for feedback',
        'Pitch to curators who appreciate tempo experimentation',
      ],
    });
  }
  
  // Check structure/duration
  const [minDur, maxDur] = benchmarks.typical_duration_seconds;
  if (features.duration_seconds > maxDur + 30) {
    issues.push({
      category: 'structure',
      severity: 'suggestion',
      title: 'Song is Quite Long',
      description: 'Longer songs can have lower completion rates on streaming platforms.',
      current_value: `${Math.floor(features.duration_seconds / 60)}:${String(Math.floor(features.duration_seconds % 60)).padStart(2, '0')}`,
      target_value: `${Math.floor(minDur / 60)}:${String(Math.floor(minDur % 60)).padStart(2, '0')} - ${Math.floor(maxDur / 60)}:${String(Math.floor(maxDur % 60)).padStart(2, '0')}`,
      recommendations: [
        'Consider editing for a tighter arrangement',
        'Ensure every section serves the song',
        'Check if intro/outro can be shortened',
        'Long songs work if they maintain engagement throughout',
      ],
    });
  } else if (features.duration_seconds < minDur - 30) {
    issues.push({
      category: 'structure',
      severity: 'suggestion',
      title: 'Song is Quite Short',
      description: 'Very short songs might not allow enough time for listener engagement.',
      current_value: `${Math.floor(features.duration_seconds / 60)}:${String(Math.floor(features.duration_seconds % 60)).padStart(2, '0')}`,
      target_value: `${Math.floor(minDur / 60)}:${String(Math.floor(minDur % 60)).padStart(2, '0')} - ${Math.floor(maxDur / 60)}:${String(Math.floor(maxDur % 60)).padStart(2, '0')}`,
      recommendations: [
        'Consider if the song feels complete',
        'Short songs can work great if intentional',
        'Ensure you have enough material for a satisfying listen',
        'TikTok-friendly short format can be strategic',
      ],
    });
  }
  
  return issues;
}

/**
 * Identify strengths in the mix
 */
export function identifyStrengths(
  features: AudioFeatures,
  benchmarks: MixBenchmarks,
  score: MixScore
): string[] {
  const strengths: string[] = [];
  
  if (score.breakdown.loudness >= 0.8) {
    strengths.push('✨ Excellent loudness levels - competitive and professional');
  }
  
  if (score.breakdown.dynamics >= 0.8) {
    strengths.push('🎵 Great dynamic range - punchy and engaging without over-compression');
  }
  
  if (score.breakdown.frequency_balance >= 0.8) {
    strengths.push('🎚️ Well-balanced frequency spectrum - clear and full-bodied');
  }
  
  if (score.breakdown.stereo_imaging >= 0.8) {
    strengths.push('🎧 Excellent stereo image - wide but focused with good center');
  }
  
  if (score.breakdown.genre_alignment >= 0.8) {
    strengths.push(`🎯 Strong ${benchmarks.genre} characteristics - fits the genre well`);
  }
  
  if (score.breakdown.commercial_readiness >= 0.8) {
    strengths.push('💎 Commercial-ready production quality');
  }
  
  // Check for standout individual metrics
  if (features.stereo_width && features.stereo_width >= 0.75 && features.stereo_width <= 0.85) {
    strengths.push('🌟 Perfect stereo width - immersive yet mono-compatible');
  }
  
  if (features.frequency_balance) {
    const fb = features.frequency_balance;
    if (fb.mid >= 0.7 && fb.presence >= 0.7) {
      strengths.push('🎤 Excellent midrange clarity - vocals and instruments will cut through');
    }
  }
  
  return strengths;
}

/**
 * Generate overall assessment summary
 */
export function generateOverallAssessment(
  score: MixScore,
  issues: DiagnosticIssue[]
): string {
  const criticalCount = issues.filter((i) => i.severity === 'critical').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;
  
  if (score.overall >= 90) {
    return 'Outstanding! This mix is release-ready and competitive with commercial standards. Minor refinements could take it to the next level, but you\'re in excellent shape.';
  } else if (score.overall >= 80) {
    return 'Great work! This mix is very close to professional standards. Address the key issues identified and you\'ll have a polished, competitive track.';
  } else if (score.overall >= 70) {
    return 'Good foundation! The core elements are there, but several improvements will help this mix compete with commercial releases. Focus on the critical and warning issues first.';
  } else if (score.overall >= 60) {
    return 'Solid start! This mix has potential but needs significant work in several areas. Prioritize the critical issues, then work through the warnings systematically.';
  } else {
    return 'This mix needs substantial work to reach professional standards. Focus on fundamentals: loudness, frequency balance, and dynamics. Consider working with an experienced mix engineer or taking time to study reference tracks.';
  }
}

/**
 * Generate actionable next steps
 */
export function generateNextSteps(
  issues: DiagnosticIssue[],
  score: MixScore
): string[] {
  const steps: string[] = [];
  const criticalIssues = issues.filter((i) => i.severity === 'critical');
  const warnings = issues.filter((i) => i.severity === 'warning');
  
  if (criticalIssues.length > 0) {
    steps.push(`🔴 Address ${criticalIssues.length} critical issue${criticalIssues.length > 1 ? 's' : ''} first: ${criticalIssues.map((i) => i.category).join(', ')}`);
  }
  
  if (warnings.length > 0) {
    steps.push(`⚠️ Fix ${warnings.length} warning${warnings.length > 1 ? 's' : ''}: ${warnings.slice(0, 3).map((i) => i.category).join(', ')}`);
  }
  
  if (score.breakdown.frequency_balance < 0.7) {
    steps.push('📊 Analyze frequency spectrum with a visual EQ to identify problem areas');
  }
  
  if (score.breakdown.loudness < 0.7) {
    steps.push('🔊 Study mastering techniques or consider hiring a mastering engineer');
  }
  
  steps.push('🎵 A/B reference your mix against 3-5 commercial tracks in your genre');
  steps.push('👂 Take breaks and return with fresh ears before making final decisions');
  
  if (score.overall < 80) {
    steps.push('🎓 Consider getting feedback from experienced mixing engineers or producers');
  }
  
  return steps;
}

/**
 * Generate stage-appropriate tips based on where user is in mixing process
 */
function generateStageAppropriateTips(
  stage: MixingStage,
  issues: DiagnosticIssue[],
  score: MixScore
): string[] {
  const tips: string[] = [];
  
  switch (stage) {
    case 'rough-mix':
      tips.push('🎚️ Focus on getting a balanced level for all tracks first');
      tips.push('🎯 Set rough panning positions to create space');
      tips.push('✂️ Use high-pass filters to clean up low-end mud');
      tips.push('⏸️ Don\'t worry about perfection yet - rough balance is the goal');
      if (issues.some(i => i.category === 'loudness')) {
        tips.push('💡 Loudness will be addressed in mastering - focus on balance and clarity for now');
      }
      break;
      
    case 'mixing':
      tips.push('🎛️ Now is the time for EQ, compression, and creative effects');
      tips.push('🔊 Check your mix at different volumes to ensure translation');
      tips.push('📐 Use automation to bring out important elements');
      tips.push('🎨 Add depth with reverb and delay, but don\'t overdo it');
      if (issues.some(i => i.category === 'frequency_balance')) {
        tips.push('🎚️ Address frequency issues now - they\'ll be harder to fix in mastering');
      }
      break;
      
    case 'mix-review':
      tips.push('👂 Listen on multiple systems: headphones, car, phone, studio monitors');
      tips.push('⏰ Take a 24-hour break and return with fresh ears');
      tips.push('📊 Compare against reference tracks at matched volumes');
      tips.push('✅ Make final tweaks but avoid over-analyzing');
      tips.push('💾 Save multiple versions before moving to mastering');
      break;
      
    case 'pre-master':
      tips.push('🎯 Ensure your mix has appropriate headroom (-6 to -3 dBFS peak)');
      tips.push('🔍 Check for any clicks, pops, or digital artifacts');
      tips.push('✂️ Verify fade-ins/fade-outs are clean');
      tips.push('📝 Document any specific mastering requests');
      if (score.breakdown.dynamics < 0.7) {
        tips.push('⚠️ Your mix may be over-compressed - consider backing off before mastering');
      }
      break;
      
    case 'mastered':
      tips.push('🎧 Verify the master translates well across all playback systems');
      tips.push('📊 Check loudness against streaming platform targets (-14 LUFS for most)');
      tips.push('✅ Ensure no clipping or distortion was introduced');
      tips.push('💾 Keep your pre-master mix file in case revisions are needed');
      break;
      
    case 'not-sure':
      tips.push('📍 Identify your current stage to get more specific recommendations');
      tips.push('🎯 If you\'re still adjusting levels and EQ, you\'re likely in mixing stage');
      tips.push('🔊 If you\'re happy with the mix and want it louder, you\'re ready for mastering');
      break;
  }
  
  return tips;
}

/**
 * Filter diagnostic issues based on mixing stage
 */
function filterIssuesForStage(
  issues: DiagnosticIssue[],
  stage: MixingStage
): DiagnosticIssue[] {
  // Don't show mastering-related issues if user hasn't mastered yet
  const masteringCategories = ['loudness', 'mastering'];
  const mixingCategories = ['frequency_balance', 'dynamics', 'stereo_imaging'];
  
  switch (stage) {
    case 'rough-mix':
    case 'mixing':
      // Filter out loudness warnings if not mastered yet
      return issues.map(issue => {
        if (issue.category === 'loudness' && issue.severity !== 'critical') {
          return {
            ...issue,
            severity: 'suggestion' as const,
            description: issue.description + ' (Note: Final loudness will be addressed in mastering)',
          };
        }
        return issue;
      });
      
    case 'mix-review':
    case 'pre-master':
      // Show all mixing issues but note that loudness is for mastering
      return issues.map(issue => {
        if (issue.category === 'loudness') {
          return {
            ...issue,
            description: issue.description + ' (Will be addressed in mastering stage)',
          };
        }
        return issue;
      });
      
    case 'mastered':
      // Show all issues as they should all be addressed by now
      return issues;
      
    case 'not-sure':
    default:
      // Show all issues but add context
      return issues.map(issue => {
        if (masteringCategories.includes(issue.category)) {
          return {
            ...issue,
            description: issue.description + ' (If not yet mastered, this will be addressed in that stage)',
          };
        }
        return issue;
      });
  }
}

/**
 * Main analysis function - combines all analyses
 */
export async function analyzeMix(
  file: File,
  targetGenre: string = 'Pop',
  mixingStage: MixingStage = 'not-sure',
  customBenchmarks?: Partial<MixBenchmarks>
): Promise<MixAnalysisResult> {
  // Extract audio features
  const features = await analyzeAudioFile(file);
  
  // Get benchmarks
  const baseBenchmarks = getBenchmarksForGenre(targetGenre);
  const benchmarks = customBenchmarks
    ? { ...baseBenchmarks, ...customBenchmarks }
    : baseBenchmarks;
  
  // Calculate score
  const score = calculateMixScore(features, benchmarks);
  
  // Generate diagnostics
  const allIssues = generateDiagnostics(features, benchmarks);
  
  // Filter issues based on mixing stage
  const issues = filterIssuesForStage(allIssues, mixingStage);
  
  // Identify strengths
  const strengths = identifyStrengths(features, benchmarks, score);
  
  // Generate overall assessment
  const overall_assessment = generateOverallAssessment(score, issues);
  
  // Generate next steps
  const next_steps = generateNextSteps(issues, score);
  
  // Generate stage-appropriate tips
  const stage_appropriate_tips = generateStageAppropriateTips(mixingStage, issues, score);
  
  return {
    file_info: {
      name: file.name,
      size_bytes: file.size,
      format: file.type,
    },
    mixing_stage: mixingStage,
    audio_features: features,
    benchmarks_used: benchmarks,
    score,
    issues,
    strengths,
    overall_assessment,
    next_steps,
    stage_appropriate_tips,
    similar_reference_tracks: benchmarks.reference_tracks,
    analysis_timestamp: new Date().toISOString(),
  };
}

/**
 * Compare specific metric against benchmark
 */
export function compareMetric(
  value: number,
  range: [number, number],
  metricName: string
): ComparisonResult {
  const [min, max] = range;
  const ideal = (min + max) / 2;
  const tolerance = (max - min) / 2;
  
  let status: ComparisonResult['status'];
  const deviation = Math.abs(value - ideal);
  
  if (value >= min && value <= max) {
    status = deviation < tolerance * 0.3 ? 'excellent' : 'good';
  } else if (deviation < tolerance * 1.5) {
    status = 'fair';
  } else {
    status = 'needs_work';
  }
  
  return {
    metric: metricName,
    your_value: value,
    benchmark_range: range,
    deviation: deviation / tolerance,
    status,
  };
}
