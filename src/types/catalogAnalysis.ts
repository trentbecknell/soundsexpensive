// TypeScript interfaces for artist catalog/playlist analysis

import type { MixAnalysisResult, AudioFeatures } from './mixAnalysis';

export interface CatalogTrack {
  id: string;
  file?: File; // Optional for Spotify/streaming imports
  name: string;
  artist?: string; // Artist name for streaming imports
  analysis?: MixAnalysisResult;
  audio_features?: AudioFeatures; // For streaming imports (Spotify, etc.)
  upload_order: number;
}

export interface CatalogTrend {
  metric: string;
  direction: 'improving' | 'declining' | 'stable';
  change_percentage: number;
  description: string;
}

export interface CatalogInsight {
  type: 'strength' | 'weakness' | 'opportunity' | 'trend';
  title: string;
  description: string;
  tracks_affected?: string[];
}

export interface GenreConsistency {
  primary_genre: string;
  consistency_score: number; // 0-100
  genre_distribution: Record<string, number>;
  recommendation: string;
}

export interface QualityProgression {
  trend: 'improving' | 'declining' | 'inconsistent';
  average_score: number;
  score_range: [number, number];
  best_track: string;
  weakest_track: string;
  improvement_rate?: number; // percentage per track
}

export interface SonicIdentity {
  signature_sound: {
    tempo_range: [number, number];
    energy_range: [number, number];
    common_traits: string[];
  };
  consistency_score: number; // 0-100, how recognizable is the sound
  outlier_tracks: string[]; // Tracks that don't fit the pattern
  recommendation: string;
}

export interface CatalogAnalysisResult {
  total_tracks: number;
  analysis_date: string;
  
  // Overall metrics
  average_score: number;
  score_trend: 'improving' | 'declining' | 'stable';
  
  // Track analyses
  tracks: CatalogTrack[];
  
  // Insights
  quality_progression: QualityProgression;
  genre_consistency: GenreConsistency;
  sonic_identity: SonicIdentity;
  trends: CatalogTrend[];
  insights: CatalogInsight[];
  
  // Comparisons
  best_performing_track: {
    name: string;
    score: number;
    strengths: string[];
  };
  
  needs_improvement: {
    name: string;
    score: number;
    issues: string[];
  }[];
  
  // Recommendations
  overall_recommendations: string[];
  next_release_guidance: string[];
}

export interface TimelineDataPoint {
  track_name: string;
  track_number: number;
  overall_score: number;
  loudness: number;
  dynamics: number;
  frequency_balance: number;
  stereo_imaging: number;
  genre_alignment: number;
  commercial_readiness: number;
}
