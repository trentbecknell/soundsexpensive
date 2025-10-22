// Grant opportunity types and interfaces for integration with funding platforms

export type GrantType = 
  | 'individual' 
  | 'organization' 
  | 'project' 
  | 'research' 
  | 'education' 
  | 'community' 
  | 'emergency';

export type GrantCategory = 
  | 'recording' 
  | 'touring' 
  | 'marketing' 
  | 'education' 
  | 'equipment' 
  | 'general_operating' 
  | 'research' 
  | 'international' 
  | 'community_outreach' 
  | 'artist_development'
  | 'emergency';

export type ApplicationStatus = 
  | 'not_started' 
  | 'in_progress' 
  | 'submitted' 
  | 'under_review' 
  | 'approved' 
  | 'denied' 
  | 'funded';

export type FundingSource = 
  | 'federal' 
  | 'state' 
  | 'local' 
  | 'private_foundation' 
  | 'corporate' 
  | 'nonprofit' 
  | 'international';

export interface GrantEligibility {
  geographic_restrictions?: string[];
  age_restrictions?: {
    min_age?: number;
    max_age?: number;
  };
  career_stage?: ('emerging' | 'developing' | 'established' | 'any')[];
  organization_type?: string[];
  genres?: string[];
  project_type?: string[];
  citizenship_requirements?: string[];
  income_limitations?: {
    max_annual_income?: number;
    currency?: string;
  };
  previous_grant_restrictions?: boolean;
  matching_funds_required?: boolean;
  nonprofit_status_required?: boolean;
}

export interface GrantRequirements {
  application_materials: string[];
  supporting_documents: string[];
  references_required?: number;
  work_samples?: {
    type: string;
    quantity: number;
    format: string[];
  };
  project_proposal?: boolean;
  budget_required?: boolean;
  timeline_required?: boolean;
  evaluation_criteria: string[];
}

export interface GrantTimeline {
  application_deadline: string;
  notification_date?: string;
  funding_start_date?: string;
  project_completion_date?: string;
  reporting_deadlines?: string[];
  application_period_start?: string;
}

export interface GrantOpportunity {
  id: string;
  title: string;
  description: string;
  summary: string;
  funder_name: string;
  funder_website?: string;
  funding_source: FundingSource;
  grant_type: GrantType;
  category: GrantCategory;
  
  // Financial details
  award_amount: {
    min: number;
    max: number;
    currency: string;
    typical_amount?: number;
  };
  total_funding_available?: number;
  number_of_awards?: number;
  
  // Eligibility and requirements
  eligibility: GrantEligibility;
  requirements: GrantRequirements;
  
  // Timeline
  timeline: GrantTimeline;
  
  // Additional details
  renewable?: boolean;
  multi_year?: boolean;
  overhead_allowed?: boolean;
  indirect_costs_allowed?: boolean;
  
  // Metadata
  created_at: string;
  updated_at: string;
  tags: string[];
  external_id?: string;
  source_platform?: string;
  
  // Success metrics
  success_rate?: number;
  average_award_amount?: number;
  previous_recipients?: string[];
}

export interface GrantApplication {
  id: string;
  grant_id: string;
  artist_id: string;
  status: ApplicationStatus;
  
  // Application details
  project_title: string;
  project_description: string;
  requested_amount: number;
  project_timeline: {
    start_date: string;
    end_date: string;
  };
  
  // Progress tracking
  completed_materials: string[];
  remaining_materials: string[];
  submission_date?: string;
  last_updated: string;
  
  // Notes and reminders
  notes: string;
  reminders: {
    date: string;
    message: string;
    completed: boolean;
  }[];
  
  // Results
  notification_received?: boolean;
  result?: 'approved' | 'denied' | 'waitlisted';
  award_amount?: number;
  feedback?: string;
}

export interface GrantMatch {
  grant: GrantOpportunity;
  compatibility_score: number;
  matching_factors: string[];
  recommendations: string[];
  potential_issues: string[];
}

export interface GrantSearchFilters {
  grant_types?: GrantType[];
  categories?: GrantCategory[];
  funding_sources?: FundingSource[];
  award_amount_range?: {
    min: number;
    max: number;
  };
  deadline_range?: {
    start: string;
    end: string;
  };
  geographic_location?: string;
  career_stage?: string;
  genres?: string[];
  keywords?: string;
}

export interface GrantSearchResult {
  grants: GrantOpportunity[];
  total_count: number;
  page: number;
  per_page: number;
  filters_applied: GrantSearchFilters;
}

// Integration interfaces for external platforms
export interface GrantPlatformIntegration {
  platform_name: string;
  base_url: string;
  api_key?: string;
  last_sync?: string;
  sync_frequency?: 'daily' | 'weekly' | 'monthly';
  enabled: boolean;
}

export interface ExternalGrantData {
  external_id: string;
  platform: string;
  raw_data: Record<string, any>;
  mapped_data: Partial<GrantOpportunity>;
  sync_status: 'pending' | 'success' | 'failed';
  last_synced: string;
}

// Utility types for grant recommendations
export interface GrantRecommendationEngine {
  analyze_artist_profile(profile: any): GrantMatch[];
  filter_by_eligibility(grants: GrantOpportunity[], profile: any): GrantOpportunity[];
  calculate_compatibility_score(grant: GrantOpportunity, profile: any): number;
  generate_application_strategy(matches: GrantMatch[]): string[];
}