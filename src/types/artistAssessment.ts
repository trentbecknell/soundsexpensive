// TypeScript interfaces based on the Artist Self-Assessment Schema
// Beyoncé-adjacent modeling for professional artist development

export interface AssessmentMeta {
  assessment_id: string;
  created_at: string;
  version: string;
}

export interface ArtistIdentity {
  artist_name: string;
  stage_aliases?: string[];
  primary_genres: Genre[];
  subgenres_tags?: string[];
  home_market: string;
  label_status?: LabelStatus;
  team?: {
    manager?: string;
    producer_primary?: string;
    mix_engineer?: string;
    mastering_engineer?: string;
    booking_agent?: string;
  };
}

export type Genre = 
  | "Pop" | "R&B" | "Soul" | "Hip Hop" | "Afrobeats" | "Dance" 
  | "House" | "Alternative" | "Indie" | "Rock" | "Latin" 
  | "Gospel" | "Jazz" | "Country" | "Electronic" | "Other";

export type LabelStatus = "Unsigned" | "Indie Label" | "Major Label" | "Distribution Only";

export interface ArtistGoals {
  vision_statement: string;
  time_horizon_months: number;
  success_kpis?: SuccessKPI[];
  target_markets?: string[];
}

export type SuccessKPI = 
  | "MonthlyListeners" | "StreamsPerRelease" | "TicketSales" | "MerchRevenue"
  | "PlaylistAdds" | "SocialFollowers" | "EmailSubscribers" | "SyncPlacements"
  | "PressMentions" | "BrandDeals" | "ChartPosition";

export interface ArtistInfluences {
  reference_artists: string[];
  adjacency_focus?: string[];
}

export interface AudioProfile {
  tempo_bpm: number;
  danceability: number;
  energy: number;
  valence: number;
  acousticness?: number;
  instrumentalness?: number;
  speechiness?: number;
  loudness_db?: number;
  mode?: 0 | 1; // 0 minor, 1 major
  key?: number; // 0=C, 1=C#, ... 11=B
  vocal_register?: VocalRegister;
  vocal_prominence?: number;
}

export type VocalRegister = "Alto" | "Mezzo" | "Soprano" | "Tenor" | "Baritone" | "Bass" | "Mixed/Other";

export interface CatalogPlan {
  planned_releases: number;
  collaboration_ratio: number;
  formats?: ReleaseFormat[];
  video_ratio?: number;
}

export type ReleaseFormat = "Single" | "EP" | "Album" | "Deluxe" | "Live" | "Remix";

export interface ReleaseStrategy {
  cadence_weeks: number;
  pre_save_push_days: number;
  anchor_playlists?: string[];
  collab_targets?: string[];
  content_pillars?: string[];
}

export interface BrandNarrative {
  positioning: string;
  themes: string[];
  visual_style_tags?: string[];
  audience_problem_solved?: string;
}

export interface AudienceProfile {
  age_distribution?: Record<string, number>;
  gender_split?: {
    female?: number;
    male?: number;
    nonbinary?: number;
  };
  top_markets?: string[];
}

export interface Resources {
  budget_total_usd?: number;
  hours_available_per_week?: number;
  network_assets?: string[];
}

export interface CurrentMetrics {
  spotify_monthly_listeners?: number;
  avg_skip_rate_pct?: number;
  avg_save_rate_pct?: number;
  social_followers_total?: number;
  email_subscribers?: number;
  ticket_conversion_pct?: number;
}

export interface Benchmarks {
  audio_feature_targets?: {
    tempo_bpm?: [number, number];
    danceability?: [number, number];
    energy?: [number, number];
    valence?: [number, number];
  };
  release_cadence_weeks?: [number, number];
  engagement_targets?: {
    skip_rate_pct_max?: number;
    save_rate_pct_min?: number;
  };
  adjacent_artist_clusters?: string[];
}

export interface ComputedAnalysis {
  similarity_scores?: {
    reference_artist: string;
    audio_similarity_0_1?: number;
    brand_similarity_0_1?: number;
    overall_similarity_0_1: number;
  }[];
  risk_flags?: string[];
  top_recommendations?: string[];
  target_attribute_shifts?: {
    audio_profile?: Record<string, number>;
    release_strategy?: Record<string, any>;
    brand_narrative?: Record<string, any>;
  };
  success_probability_0_1?: number;
}

export interface ChatAgent {
  intro_prompt?: string;
  question_sequence?: string[];
  closing_prompt?: string;
}

// Main assessment interface
export interface ArtistSelfAssessment {
  meta?: AssessmentMeta;
  identity: ArtistIdentity;
  goals: ArtistGoals;
  influences: ArtistInfluences;
  audio_profile: AudioProfile;
  catalog_plan: CatalogPlan;
  release_strategy: ReleaseStrategy;
  brand_narrative: BrandNarrative;
  audience_profile?: AudienceProfile;
  resources?: Resources;
  current_metrics?: CurrentMetrics;
  benchmarks?: Benchmarks;
  computed?: ComputedAnalysis;
  chat_agent?: ChatAgent;
}

// Utility type for partial assessment during chat phase
export type PartialAssessment = Partial<ArtistSelfAssessment> & {
  identity: Partial<ArtistIdentity> & Pick<ArtistIdentity, 'artist_name'>;
};