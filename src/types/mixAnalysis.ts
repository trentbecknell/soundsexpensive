// TypeScript interfaces for audio mix analysis and diagnostics

export type MixingStage = 
  | 'rough-mix'      // Initial balance, basic processing
  | 'mixing'         // Active mixing, EQ, compression, effects
  | 'mix-review'     // Near-final mix, refinement stage
  | 'pre-master'     // Final mix, ready for mastering
  | 'mastered'       // After mastering, final product
  | 'not-sure';      // Let the system determine

export interface MixAnalysisRequest {
  file: File;
  targetGenre?: string;
  referenceArtist?: string;
  mixingStage?: MixingStage;
  customBenchmarks?: Partial<MixBenchmarks>;
}

export interface AudioFeatures {
  // Core audio metrics (0-1 normalized unless specified)
  tempo_bpm: number;
  danceability: number;
  energy: number;
  valence: number; // positivity/happiness
  acousticness: number;
  instrumentalness: number;
  speechiness: number;
  loudness_db: number;
  
  // Advanced metrics
  dynamic_range_db?: number;
  stereo_width?: number; // 0-1
  frequency_balance?: FrequencyBalance;
  peak_db?: number;
  rms_db?: number;
  crest_factor?: number;
  
  // Time-based analysis
  duration_seconds: number;
  intro_length_seconds?: number;
  outro_length_seconds?: number;
  
  // Tonal analysis
  key?: number; // 0=C, 1=C#, ... 11=B
  mode?: 'major' | 'minor';
  key_confidence?: number;
}

export interface FrequencyBalance {
  sub_bass: number; // 20-60 Hz
  bass: number; // 60-250 Hz
  low_mid: number; // 250-500 Hz
  mid: number; // 500-2000 Hz
  high_mid: number; // 2000-4000 Hz
  presence: number; // 4000-6000 Hz
  brilliance: number; // 6000-20000 Hz
}

export interface MixBenchmarks {
  genre: string;
  reference_artist?: string;
  
  // Target ranges
  tempo_bpm: [number, number];
  danceability: [number, number];
  energy: [number, number];
  valence: [number, number];
  loudness_db: [number, number];
  dynamic_range_db: [number, number];
  stereo_width: [number, number];
  
  // Frequency targets (dB relative to overall)
  frequency_targets?: {
    bass_prominence: [number, number]; // dB
    mid_clarity: [number, number]; // dB
    high_presence: [number, number]; // dB
  };
  
  // Structural expectations
  typical_intro_seconds: [number, number];
  typical_duration_seconds: [number, number];
  
  // Reference tracks for comparison
  reference_tracks?: string[];
}

export interface DiagnosticIssue {
  category: DiagnosticCategory;
  severity: 'critical' | 'warning' | 'suggestion';
  title: string;
  description: string;
  current_value: number | string;
  target_value?: number | string | [number, number];
  recommendations: string[];
  technical_details?: string;
}

export type DiagnosticCategory =
  | 'loudness'
  | 'dynamics'
  | 'frequency_balance'
  | 'stereo_imaging'
  | 'tempo'
  | 'energy'
  | 'structure'
  | 'genre_alignment'
  | 'mastering';

export interface MixScore {
  overall: number; // 0-100
  breakdown: {
    loudness: number;
    dynamics: number;
    frequency_balance: number;
    stereo_imaging: number;
    genre_alignment: number;
    commercial_readiness: number;
  };
}

export interface ChecklistItem {
  id: string;
  category: DiagnosticCategory;
  title: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  notes?: string;
}

export interface MixVersion {
  id: string;
  version_number: number;
  analysis: MixAnalysisResult;
  checklist: ChecklistItem[];
  uploaded_at: string;
}

export interface MixAnalysisResult {
  file_info: {
    name: string;
    size_bytes: number;
    format: string;
    sample_rate?: number;
    bit_depth?: number;
  };
  mixing_stage: MixingStage;
  audio_features: AudioFeatures;
  benchmarks_used: MixBenchmarks;
  score: MixScore;
  issues: DiagnosticIssue[];
  strengths: string[];
  overall_assessment: string;
  next_steps: string[];
  stage_appropriate_tips: string[]; // Context-aware tips for current stage
  similar_reference_tracks?: string[];
  regional_analysis?: any; // Will be populated from regionalAnalysis.ts
  analysis_timestamp: string;
}

export interface ComparisonResult {
  metric: string;
  your_value: number;
  benchmark_range: [number, number];
  deviation: number; // How far off from ideal (0 = perfect)
  status: 'excellent' | 'good' | 'fair' | 'needs_work';
}

// Simplified mock analysis for client-side (in real app, would use Web Audio API or backend)
export interface MockAnalysisConfig {
  simulate_issues: boolean;
  random_variation: number; // 0-1, how much to randomize
}
