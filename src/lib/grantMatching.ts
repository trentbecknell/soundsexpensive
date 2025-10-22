import { GrantOpportunity, GrantMatch, GrantSearchFilters } from '../types/grants';
import { ArtistSelfAssessment, PartialAssessment } from '../types/artistAssessment';

// Grant recommendation engine for matching artists with funding opportunities
export class GrantRecommendationEngine {
  
  /**
   * Analyze artist profile and return ranked grant matches
   */
  static analyzeArtistProfile(
    profile: any, 
    assessment: PartialAssessment, 
    grants: GrantOpportunity[]
  ): GrantMatch[] {
    const matches: GrantMatch[] = [];
    
    for (const grant of grants) {
      const compatibilityScore = this.calculateCompatibilityScore(grant, profile, assessment);
      const matchingFactors = this.identifyMatchingFactors(grant, profile, assessment);
      const recommendations = this.generateRecommendations(grant, profile, assessment);
      const potentialIssues = this.identifyPotentialIssues(grant, profile, assessment);
      
      matches.push({
        grant,
        compatibility_score: compatibilityScore,
        matching_factors: matchingFactors,
        recommendations,
        potential_issues: potentialIssues
      });
    }
    
    // Sort by compatibility score (highest first)
    return matches.sort((a, b) => b.compatibility_score - a.compatibility_score);
  }
  
  /**
   * Filter grants by basic eligibility criteria
   */
  static filterByEligibility(
    grants: GrantOpportunity[], 
    profile: any, 
    assessment: PartialAssessment
  ): GrantOpportunity[] {
    return grants.filter(grant => {
      // Check career stage eligibility
      if (grant.eligibility.career_stage && grant.eligibility.career_stage.length > 0) {
        const artistStage = profile.stage?.toLowerCase();
        if (!grant.eligibility.career_stage.includes(artistStage) && 
            !grant.eligibility.career_stage.includes('any')) {
          return false;
        }
      }
      
      // Check genre eligibility
      if (grant.eligibility.genres && grant.eligibility.genres.length > 0) {
        const artistGenres = assessment.identity?.primary_genres || [];
        const hasGenreMatch = artistGenres.some(genre => 
          grant.eligibility.genres!.some(eligibleGenre => 
            genre.toLowerCase().includes(eligibleGenre.toLowerCase()) ||
            eligibleGenre.toLowerCase().includes(genre.toLowerCase())
          )
        );
        if (!hasGenreMatch) {
          return false;
        }
      }
      
      // Check geographic restrictions
      if (grant.eligibility.geographic_restrictions && grant.eligibility.geographic_restrictions.length > 0) {
        const artistLocation = profile.city?.toLowerCase() || '';
        const hasLocationMatch = grant.eligibility.geographic_restrictions.some(location => 
          artistLocation.includes(location.toLowerCase()) ||
          location.toLowerCase() === 'united states' ||
          location.toLowerCase() === 'usa' ||
          location.toLowerCase() === 'north america'
        );
        if (!hasLocationMatch) {
          return false;
        }
      }
      
      return true;
    });
  }
  
  /**
   * Calculate compatibility score between grant and artist (0-100)
   */
  static calculateCompatibilityScore(
    grant: GrantOpportunity, 
    profile: any, 
    assessment: PartialAssessment
  ): number {
    let score = 0;
    let maxScore = 0;
    
    // Genre alignment (20 points)
    maxScore += 20;
    if (grant.eligibility.genres && assessment.identity?.primary_genres) {
      const genreOverlap = this.calculateGenreOverlap(
        grant.eligibility.genres, 
        assessment.identity.primary_genres
      );
      score += genreOverlap * 20;
    }
    
    // Career stage alignment (15 points)
    maxScore += 15;
    if (grant.eligibility.career_stage) {
      const stageMatch = this.calculateStageMatch(grant.eligibility.career_stage, profile.stage);
      score += stageMatch * 15;
    }
    
    // Project type alignment (15 points)
    maxScore += 15;
    if (grant.eligibility.project_type) {
      const projectMatch = this.calculateProjectTypeMatch(grant, profile);
      score += projectMatch * 15;
    }
    
    // Award amount appropriateness (10 points)
    maxScore += 10;
    const amountScore = this.calculateAmountAppropriateScore(grant, profile, assessment);
    score += amountScore * 10;
    
    // Application feasibility (15 points)
    maxScore += 15;
    const feasibilityScore = this.calculateApplicationFeasibility(grant, profile, assessment);
    score += feasibilityScore * 15;
    
    // Timeline compatibility (10 points)
    maxScore += 10;
    const timelineScore = this.calculateTimelineCompatibility(grant);
    score += timelineScore * 10;
    
    // Success probability (15 points)
    maxScore += 15;
    const successScore = this.calculateSuccessProbability(grant, profile, assessment);
    score += successScore * 15;
    
    return Math.round((score / maxScore) * 100);
  }
  
  /**
   * Identify specific factors that make this grant a good match
   */
  static identifyMatchingFactors(
    grant: GrantOpportunity, 
    profile: any, 
    assessment: PartialAssessment
  ): string[] {
    const factors: string[] = [];
    
    // Genre matches
    if (grant.eligibility.genres && assessment.identity?.primary_genres) {
      const matchingGenres = assessment.identity.primary_genres.filter(genre =>
        grant.eligibility.genres!.some(eligibleGenre =>
          genre.toLowerCase().includes(eligibleGenre.toLowerCase())
        )
      );
      if (matchingGenres.length > 0) {
        factors.push(`Accepts ${matchingGenres.join(', ')} artists`);
      }
    }
    
    // Career stage match
    if (grant.eligibility.career_stage?.includes(profile.stage?.toLowerCase())) {
      factors.push(`Targets ${profile.stage} artists`);
    }
    
    // Award amount appropriateness
    if (grant.award_amount.min <= 10000 && profile.stage === 'Emerging') {
      factors.push('Appropriate funding level for emerging artists');
    } else if (grant.award_amount.max >= 25000 && ['Established', 'Breakout'].includes(profile.stage)) {
      factors.push('Substantial funding available for established artists');
    }
    
    // Category alignment
    if (grant.category === 'recording' && profile.project?.projectType) {
      factors.push('Supports recording projects');
    }
    
    // Timeline considerations
    const deadline = new Date(grant.timeline.application_deadline);
    const now = new Date();
    const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDeadline > 30) {
      factors.push('Ample time to prepare application');
    }
    
    // Success rate
    if (grant.success_rate && grant.success_rate > 0.2) {
      factors.push(`Good success rate (${Math.round(grant.success_rate * 100)}%)`);
    }
    
    return factors;
  }
  
  /**
   * Generate specific recommendations for applying to this grant
   */
  static generateRecommendations(
    grant: GrantOpportunity, 
    profile: any, 
    assessment: PartialAssessment
  ): string[] {
    const recommendations: string[] = [];
    
    // Based on artist stage
    if (profile.stage === 'Emerging') {
      recommendations.push('Focus on your artistic development and potential in your application');
      recommendations.push('Highlight any mentorship or educational components of your project');
    } else if (['Established', 'Breakout'].includes(profile.stage)) {
      recommendations.push('Emphasize your track record and community impact');
      recommendations.push('Include detailed project outcomes and measurable goals');
    }
    
    // Based on grant requirements
    if (grant.requirements.work_samples) {
      recommendations.push(`Prepare ${grant.requirements.work_samples.quantity} high-quality work samples`);
    }
    
    if (grant.requirements.budget_required) {
      recommendations.push('Create a detailed, realistic budget with line-item costs');
    }
    
    if (grant.requirements.references_required) {
      recommendations.push(`Secure ${grant.requirements.references_required} strong professional references`);
    }
    
    // Based on grant category
    if (grant.category === 'recording') {
      recommendations.push('Detail your recording plan, studio choices, and production team');
    } else if (grant.category === 'touring') {
      recommendations.push('Include confirmed venues, routing plans, and audience development strategy');
    }
    
    // Timeline recommendations
    const deadline = new Date(grant.timeline.application_deadline);
    const now = new Date();
    const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDeadline < 30) {
      recommendations.push('Priority application - deadline approaching soon');
    } else if (daysUntilDeadline > 90) {
      recommendations.push('Start gathering materials early for this competitive opportunity');
    }
    
    return recommendations;
  }
  
  /**
   * Identify potential issues or challenges with this grant
   */
  static identifyPotentialIssues(
    grant: GrantOpportunity, 
    profile: any, 
    assessment: PartialAssessment
  ): string[] {
    const issues: string[] = [];
    
    // Eligibility concerns
    if (grant.eligibility.nonprofit_status_required && !profile.hasNonprofitStatus) {
      issues.push('Requires nonprofit status or fiscal sponsorship');
    }
    
    if (grant.eligibility.matching_funds_required && profile.stage === 'Emerging') {
      issues.push('Requires matching funds which may be challenging for emerging artists');
    }
    
    // Competition level
    if (grant.success_rate && grant.success_rate < 0.1) {
      issues.push('Highly competitive - low success rate');
    }
    
    // Timeline challenges
    const deadline = new Date(grant.timeline.application_deadline);
    const now = new Date();
    const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDeadline < 14) {
      issues.push('Very tight deadline - may not allow for quality application');
    }
    
    // Requirements complexity
    if (grant.requirements.application_materials.length > 8) {
      issues.push('Complex application with many required materials');
    }
    
    // Award amount mismatch
    if (grant.award_amount.min > 50000 && profile.stage === 'Emerging') {
      issues.push('Large award amount may require significant experience/track record');
    }
    
    return issues;
  }
  
  // Helper methods for score calculations
  
  private static calculateGenreOverlap(grantGenres: string[], artistGenres: string[]): number {
    const matches = artistGenres.filter(artistGenre =>
      grantGenres.some(grantGenre =>
        artistGenre.toLowerCase().includes(grantGenre.toLowerCase()) ||
        grantGenre.toLowerCase().includes(artistGenre.toLowerCase())
      )
    );
    return matches.length / Math.max(artistGenres.length, 1);
  }
  
  private static calculateStageMatch(eligibleStages: string[], artistStage: string): number {
    if (eligibleStages.includes('any') || eligibleStages.includes(artistStage?.toLowerCase())) {
      return 1;
    }
    return 0;
  }
  
  private static calculateProjectTypeMatch(grant: GrantOpportunity, profile: any): number {
    if (!grant.eligibility.project_type || !profile.project) return 0.5;
    
    const projectTypeMap: Record<string, string[]> = {
      'EP': ['recording', 'album', 'music'],
      'Album': ['recording', 'album', 'music'],
      'Singles': ['recording', 'single', 'music']
    };
    
    const artistProjectTypes = projectTypeMap[profile.project.projectType] || [];
    const hasMatch = artistProjectTypes.some(type =>
      grant.eligibility.project_type!.includes(type)
    );
    
    return hasMatch ? 1 : 0.3;
  }
  
  private static calculateAmountAppropriateScore(
    grant: GrantOpportunity, 
    profile: any, 
    assessment: PartialAssessment
  ): number {
    const artistStage = profile.stage;
    const grantMin = grant.award_amount.min;
    const grantMax = grant.award_amount.max;
    
    // Stage-based appropriate ranges
    const appropriateRanges: Record<string, {min: number, max: number}> = {
      'Emerging': {min: 500, max: 15000},
      'Developing': {min: 2000, max: 35000},
      'Established': {min: 5000, max: 75000},
      'Breakout': {min: 10000, max: 150000}
    };
    
    const appropriate = appropriateRanges[artistStage] || appropriateRanges['Developing'];
    
    // Check if grant range overlaps with appropriate range
    if (grantMax >= appropriate.min && grantMin <= appropriate.max) {
      return 1;
    } else if (grantMin > appropriate.max) {
      return 0.3; // Too large
    } else {
      return 0.6; // Too small but still possible
    }
  }
  
  private static calculateApplicationFeasibility(
    grant: GrantOpportunity, 
    profile: any, 
    assessment: PartialAssessment
  ): number {
    let feasibilityScore = 1;
    
    // Check if artist has needed materials/capacity
    const requiredMaterials = grant.requirements.application_materials.length;
    if (requiredMaterials > 10) feasibilityScore -= 0.3;
    if (requiredMaterials > 15) feasibilityScore -= 0.3;
    
    // Check stage appropriateness for complex applications
    if (profile.stage === 'Emerging' && requiredMaterials > 8) {
      feasibilityScore -= 0.2;
    }
    
    // References requirement
    if (grant.requirements.references_required && grant.requirements.references_required > 3) {
      feasibilityScore -= 0.1;
    }
    
    return Math.max(0, feasibilityScore);
  }
  
  private static calculateTimelineCompatibility(grant: GrantOpportunity): number {
    const deadline = new Date(grant.timeline.application_deadline);
    const now = new Date();
    const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDeadline < 0) return 0; // Past deadline
    if (daysUntilDeadline < 7) return 0.2; // Too rushed
    if (daysUntilDeadline < 14) return 0.5; // Tight
    if (daysUntilDeadline < 30) return 0.8; // Manageable
    return 1; // Plenty of time
  }
  
  private static calculateSuccessProbability(
    grant: GrantOpportunity, 
    profile: any, 
    assessment: PartialAssessment
  ): number {
    let probability = grant.success_rate || 0.15; // Default 15% if not specified
    
    // Adjust based on artist profile alignment
    const artistStage = profile.stage;
    
    // Emerging artists may have better chances at emerging-focused grants
    if (grant.eligibility.career_stage?.includes('emerging') && artistStage === 'Emerging') {
      probability += 0.1;
    }
    
    // Established artists have better chances at larger grants
    if (grant.award_amount.min > 25000 && ['Established', 'Breakout'].includes(artistStage)) {
      probability += 0.05;
    }
    
    // Geographic alignment helps
    if (grant.eligibility.geographic_restrictions?.length === 1) {
      probability += 0.05; // Local/regional grants less competitive
    }
    
    return Math.min(1, probability);
  }
}

// Utility functions for grant search and filtering
export function filterGrants(
  grants: GrantOpportunity[],
  filters: GrantSearchFilters
): GrantOpportunity[] {
  return grants.filter(grant => {
    // Filter by grant types
    if (filters.grant_types && !filters.grant_types.includes(grant.grant_type)) {
      return false;
    }
    
    // Filter by categories
    if (filters.categories && !filters.categories.includes(grant.category)) {
      return false;
    }
    
    // Filter by funding sources
    if (filters.funding_sources && !filters.funding_sources.includes(grant.funding_source)) {
      return false;
    }
    
    // Filter by award amount range
    if (filters.award_amount_range) {
      const { min, max } = filters.award_amount_range;
      if (grant.award_amount.max < min || grant.award_amount.min > max) {
        return false;
      }
    }
    
    // Filter by deadline range
    if (filters.deadline_range) {
      const deadline = new Date(grant.timeline.application_deadline);
      const start = new Date(filters.deadline_range.start);
      const end = new Date(filters.deadline_range.end);
      if (deadline < start || deadline > end) {
        return false;
      }
    }
    
    // Filter by genres
    if (filters.genres && grant.eligibility.genres) {
      const hasGenreMatch = filters.genres.some(filterGenre =>
        grant.eligibility.genres!.some(grantGenre =>
          filterGenre.toLowerCase().includes(grantGenre.toLowerCase()) ||
          grantGenre.toLowerCase().includes(filterGenre.toLowerCase())
        )
      );
      if (!hasGenreMatch) {
        return false;
      }
    }
    
    // Filter by keywords
    if (filters.keywords) {
      const searchText = `${grant.title} ${grant.description} ${grant.funder_name}`.toLowerCase();
      const keywords = filters.keywords.toLowerCase().split(' ');
      const hasKeywordMatch = keywords.some(keyword => searchText.includes(keyword));
      if (!hasKeywordMatch) {
        return false;
      }
    }
    
    return true;
  });
}

export function sortGrants(
  grants: GrantOpportunity[],
  sortBy: 'deadline' | 'amount' | 'compatibility' | 'success_rate',
  sortOrder: 'asc' | 'desc' = 'desc'
): GrantOpportunity[] {
  return [...grants].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'deadline':
        comparison = new Date(a.timeline.application_deadline).getTime() - 
                    new Date(b.timeline.application_deadline).getTime();
        break;
      case 'amount':
        comparison = a.award_amount.max - b.award_amount.max;
        break;
      case 'success_rate':
        comparison = (a.success_rate || 0) - (b.success_rate || 0);
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
}