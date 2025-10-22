import React, { useState, useMemo, useEffect } from 'react';
import { 
  GrantOpportunity, 
  GrantMatch, 
  GrantSearchFilters, 
  GrantApplication, 
  ApplicationStatus 
} from '../types/grants';
import { PartialAssessment } from '../types/artistAssessment';
import { GrantRecommendationEngine, filterGrants, sortGrants } from '../lib/grantMatching';
import { GRANT_OPPORTUNITIES, getUpcomingDeadlines, getEmergingArtistGrants } from '../data/grants';

interface GrantDiscoveryProps {
  profile: any;
  assessment?: PartialAssessment;
  onSaveGrant?: (grant: GrantOpportunity) => void;
  onStartApplication?: (grant: GrantOpportunity) => void;
  savedGrants?: string[];
  applications?: GrantApplication[];
}

const GrantDiscovery: React.FC<GrantDiscoveryProps> = ({
  profile,
  assessment,
  onSaveGrant,
  onStartApplication,
  savedGrants = [],
  applications = []
}) => {
  const [searchFilters, setSearchFilters] = useState<GrantSearchFilters>({});
  const [sortBy, setSortBy] = useState<'deadline' | 'amount' | 'compatibility' | 'success_rate'>('compatibility');
  const [viewMode, setViewMode] = useState<'recommended' | 'all' | 'saved' | 'deadlines'>('recommended');
  const [expandedGrant, setExpandedGrant] = useState<string | null>(null);

  // Filter eligible grants
  const eligibleGrants = useMemo(() => {
    if (!assessment) return GRANT_OPPORTUNITIES;
    return GrantRecommendationEngine.filterByEligibility(GRANT_OPPORTUNITIES, profile, assessment);
  }, [profile, assessment]);

  // Get grant matches with scores
  const grantMatches = useMemo(() => {
    if (!assessment) return [];
    return GrantRecommendationEngine.analyzeArtistProfile(profile, assessment, eligibleGrants);
  }, [profile, assessment, eligibleGrants]);

  // Apply search filters
  const filteredGrants = useMemo(() => {
    let grants: GrantOpportunity[] = [];
    
    switch (viewMode) {
      case 'recommended':
        grants = grantMatches.slice(0, 20).map(match => match.grant);
        break;
      case 'all':
        grants = filterGrants(eligibleGrants, searchFilters);
        break;
      case 'saved':
        grants = GRANT_OPPORTUNITIES.filter(grant => savedGrants.includes(grant.id));
        break;
      case 'deadlines':
        grants = getUpcomingDeadlines(60);
        break;
      default:
        grants = eligibleGrants;
    }
    
    return sortGrants(grants, sortBy);
  }, [viewMode, grantMatches, eligibleGrants, searchFilters, savedGrants, sortBy]);

  // Get match data for display
  const getMatchData = (grantId: string): GrantMatch | undefined => {
    return grantMatches.find(match => match.grant.id === grantId);
  };

  // Get application status for a grant
  const getApplicationStatus = (grantId: string): ApplicationStatus | undefined => {
    const application = applications.find(app => app.grant_id === grantId);
    return application?.status;
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format deadline
  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const daysUntil = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntil < 0) return 'Past deadline';
    if (daysUntil === 0) return 'Due today';
    if (daysUntil === 1) return 'Due tomorrow';
    if (daysUntil <= 7) return `Due in ${daysUntil} days`;
    if (daysUntil <= 30) return `Due in ${Math.ceil(daysUntil / 7)} weeks`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Get urgency color for deadlines
  const getDeadlineColor = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const daysUntil = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntil < 0) return 'text-red-400';
    if (daysUntil <= 7) return 'text-red-400';
    if (daysUntil <= 14) return 'text-yellow-400';
    if (daysUntil <= 30) return 'text-orange-400';
    return 'text-surface-300';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-surface-50">Grant Opportunities</h2>
          <p className="text-sm text-surface-400">
            {viewMode === 'recommended' && assessment 
              ? `${grantMatches.length} grants matched to your profile`
              : `${filteredGrants.length} grants available`
            }
          </p>
        </div>

        {/* View Mode Toggles */}
        <div className="flex flex-wrap gap-2">
          {['recommended', 'all', 'deadlines', 'saved'].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode as any)}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                viewMode === mode
                  ? 'bg-primary-600 text-primary-50'
                  : 'bg-surface-700 text-surface-300 hover:bg-surface-600'
              }`}
            >
              {mode === 'recommended' && '🎯 Recommended'}
              {mode === 'all' && '📋 All Grants'}
              {mode === 'deadlines' && '⏰ Upcoming Deadlines'}
              {mode === 'saved' && `💾 Saved (${savedGrants.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      {viewMode === 'all' && (
        <div className="bg-surface-800/50 rounded-xl p-4 border border-surface-700">
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            {/* Award Amount Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-surface-300">Award Amount</label>
              <select 
                className="w-full bg-surface-700 rounded-lg px-3 py-2 text-surface-100"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === 'all') {
                    setSearchFilters(prev => ({ ...prev, award_amount_range: undefined }));
                  } else {
                    const [min, max] = value.split('-').map(Number);
                    setSearchFilters(prev => ({ ...prev, award_amount_range: { min, max } }));
                  }
                }}
              >
                <option value="all">All amounts</option>
                <option value="0-5000">Under $5K</option>
                <option value="5000-15000">$5K - $15K</option>
                <option value="15000-50000">$15K - $50K</option>
                <option value="50000-999999">$50K+</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-surface-300">Category</label>
              <select 
                className="w-full bg-surface-700 rounded-lg px-3 py-2 text-surface-100"
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchFilters(prev => ({ 
                    ...prev, 
                    categories: value === 'all' ? undefined : [value as any]
                  }));
                }}
              >
                <option value="all">All categories</option>
                <option value="recording">Recording</option>
                <option value="artist_development">Artist Development</option>
                <option value="education">Education</option>
                <option value="community_outreach">Community</option>
                <option value="emergency">Emergency</option>
                <option value="touring">Touring</option>
              </select>
            </div>

            {/* Funding Source Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-surface-300">Funding Source</label>
              <select 
                className="w-full bg-surface-700 rounded-lg px-3 py-2 text-surface-100"
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchFilters(prev => ({ 
                    ...prev, 
                    funding_sources: value === 'all' ? undefined : [value as any]
                  }));
                }}
              >
                <option value="all">All sources</option>
                <option value="federal">Federal</option>
                <option value="state">State</option>
                <option value="private_foundation">Private Foundation</option>
                <option value="nonprofit">Nonprofit</option>
                <option value="corporate">Corporate</option>
                <option value="local">Local</option>
              </select>
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-surface-300">Sort By</label>
              <select 
                className="w-full bg-surface-700 rounded-lg px-3 py-2 text-surface-100"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="compatibility">Best Match</option>
                <option value="deadline">Deadline</option>
                <option value="amount">Award Amount</option>
                <option value="success_rate">Success Rate</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-surface-300">&nbsp;</label>
              <button
                onClick={() => setSearchFilters({})}
                className="w-full bg-surface-600 hover:bg-surface-500 rounded-lg px-3 py-2 text-surface-100 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grant List */}
      <div className="space-y-4">
        {filteredGrants.length === 0 ? (
          <div className="text-center py-12 bg-surface-800/30 rounded-xl border border-surface-700">
            <div className="text-surface-400 mb-2">No grants found</div>
            <div className="text-sm text-surface-500">
              Try adjusting your filters or view mode
            </div>
          </div>
        ) : (
          filteredGrants.map((grant) => {
            const matchData = getMatchData(grant.id);
            const applicationStatus = getApplicationStatus(grant.id);
            const isExpanded = expandedGrant === grant.id;
            const isSaved = savedGrants.includes(grant.id);

            return (
              <div 
                key={grant.id} 
                className="bg-surface-800/50 rounded-xl border border-surface-700 overflow-hidden"
              >
                {/* Grant Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-surface-50 truncate">
                          {grant.title}
                        </h3>
                        
                        {/* Compatibility Score */}
                        {matchData && (
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            matchData.compatibility_score >= 80 ? 'bg-green-500/20 text-green-400' :
                            matchData.compatibility_score >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {matchData.compatibility_score}% match
                          </div>
                        )}

                        {/* Application Status */}
                        {applicationStatus && (
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            applicationStatus === 'submitted' ? 'bg-blue-500/20 text-blue-400' :
                            applicationStatus === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' :
                            applicationStatus === 'approved' ? 'bg-green-500/20 text-green-400' :
                            applicationStatus === 'denied' ? 'bg-red-500/20 text-red-400' :
                            'bg-surface-600/50 text-surface-400'
                          }`}>
                            {applicationStatus.replace('_', ' ')}
                          </div>
                        )}
                      </div>

                      <p className="text-surface-400 text-sm mb-3 line-clamp-2">
                        {grant.summary}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-surface-500">Award Amount</div>
                          <div className="text-surface-200 font-medium">
                            {formatCurrency(grant.award_amount.min)} - {formatCurrency(grant.award_amount.max)}
                          </div>
                        </div>
                        <div>
                          <div className="text-surface-500">Deadline</div>
                          <div className={`font-medium ${getDeadlineColor(grant.timeline.application_deadline)}`}>
                            {formatDeadline(grant.timeline.application_deadline)}
                          </div>
                        </div>
                        <div>
                          <div className="text-surface-500">Funder</div>
                          <div className="text-surface-200 truncate">{grant.funder_name}</div>
                        </div>
                        <div>
                          <div className="text-surface-500">Success Rate</div>
                          <div className="text-surface-200">
                            {grant.success_rate ? `${Math.round(grant.success_rate * 100)}%` : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setExpandedGrant(isExpanded ? null : grant.id)}
                        className="px-3 py-2 bg-primary-600 hover:bg-primary-700 text-primary-50 rounded-lg text-sm transition-colors"
                      >
                        {isExpanded ? 'Less Info' : 'View Details'}
                      </button>
                      
                      {onSaveGrant && (
                        <button
                          onClick={() => onSaveGrant(grant)}
                          className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                            isSaved 
                              ? 'bg-green-600/20 text-green-400 border border-green-600/30' 
                              : 'bg-surface-700 hover:bg-surface-600 text-surface-300'
                          }`}
                        >
                          {isSaved ? '✓ Saved' : 'Save'}
                        </button>
                      )}
                      
                      {onStartApplication && !applicationStatus && (
                        <button
                          onClick={() => onStartApplication(grant)}
                          className="px-3 py-2 bg-accent-600 hover:bg-accent-700 text-accent-50 rounded-lg text-sm transition-colors"
                        >
                          Apply
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Matching Factors (for recommended view) */}
                  {matchData && matchData.matching_factors.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {matchData.matching_factors.slice(0, 3).map((factor, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-primary-500/20 text-primary-300 rounded text-xs"
                        >
                          ✓ {factor}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-surface-700 p-6 bg-surface-900/30">
                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Description */}
                      <div>
                        <h4 className="text-sm font-semibold text-surface-200 mb-2">Description</h4>
                        <p className="text-surface-400 text-sm leading-relaxed">
                          {grant.description}
                        </p>

                        {/* Eligibility */}
                        <h4 className="text-sm font-semibold text-surface-200 mb-2 mt-4">Eligibility</h4>
                        <div className="space-y-1 text-sm text-surface-400">
                          {grant.eligibility.career_stage && (
                            <div>Career Stage: {grant.eligibility.career_stage.join(', ')}</div>
                          )}
                          {grant.eligibility.genres && (
                            <div>Genres: {grant.eligibility.genres.join(', ')}</div>
                          )}
                          {grant.eligibility.geographic_restrictions && (
                            <div>Location: {grant.eligibility.geographic_restrictions.join(', ')}</div>
                          )}
                        </div>
                      </div>

                      {/* Requirements & Recommendations */}
                      <div>
                        {/* Requirements */}
                        <h4 className="text-sm font-semibold text-surface-200 mb-2">Required Materials</h4>
                        <ul className="text-sm text-surface-400 space-y-1 mb-4">
                          {grant.requirements.application_materials.slice(0, 5).map((material, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-surface-500 rounded-full"></div>
                              {material}
                            </li>
                          ))}
                          {grant.requirements.application_materials.length > 5 && (
                            <li className="text-surface-500 text-xs">
                              +{grant.requirements.application_materials.length - 5} more materials
                            </li>
                          )}
                        </ul>

                        {/* Recommendations */}
                        {matchData && matchData.recommendations.length > 0 && (
                          <>
                            <h4 className="text-sm font-semibold text-surface-200 mb-2">Recommendations</h4>
                            <ul className="text-sm text-green-400 space-y-1">
                              {matchData.recommendations.slice(0, 3).map((rec, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <div className="w-1 h-1 bg-green-400 rounded-full mt-2"></div>
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </>
                        )}

                        {/* Potential Issues */}
                        {matchData && matchData.potential_issues.length > 0 && (
                          <>
                            <h4 className="text-sm font-semibold text-surface-200 mb-2 mt-4">Consider</h4>
                            <ul className="text-sm text-yellow-400 space-y-1">
                              {matchData.potential_issues.map((issue, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <div className="w-1 h-1 bg-yellow-400 rounded-full mt-2"></div>
                                  {issue}
                                </li>
                              ))}
                            </ul>
                          </>
                        )}

                        {/* External Link */}
                        {grant.funder_website && (
                          <div className="mt-4">
                            <a
                              href={grant.funder_website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm transition-colors"
                            >
                              Visit Funder Website
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Quick Stats */}
      {viewMode === 'recommended' && grantMatches.length > 0 && (
        <div className="bg-primary-900/20 border border-primary-700/30 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-primary-200 mb-3">Grant Opportunities Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-primary-400">High Match (80%+)</div>
              <div className="text-primary-100 font-medium">
                {grantMatches.filter(m => m.compatibility_score >= 80).length} grants
              </div>
            </div>
            <div>
              <div className="text-primary-400">Total Funding</div>
              <div className="text-primary-100 font-medium">
                {formatCurrency(grantMatches.slice(0, 10).reduce((sum, m) => sum + m.grant.award_amount.max, 0))}
              </div>
            </div>
            <div>
              <div className="text-primary-400">Upcoming Deadlines</div>
              <div className="text-primary-100 font-medium">
                {grantMatches.filter(m => {
                  const days = Math.ceil((new Date(m.grant.timeline.application_deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  return days <= 30 && days > 0;
                }).length} in 30 days
              </div>
            </div>
            <div>
              <div className="text-primary-400">Emergency Grants</div>
              <div className="text-primary-100 font-medium">
                {grantMatches.filter(m => m.grant.category === 'emergency').length} available
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrantDiscovery;