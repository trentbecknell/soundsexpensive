import React from 'react';
import { CatalogAnalysisResult } from '../types/catalogAnalysis';

interface WelcomeBackDashboardProps {
  catalogAnalysisData?: CatalogAnalysisResult;
  roadmapGenerated: boolean;
  projectType: string;
  projectUnits: number;
  savedGrantsCount: number;
  applicationsCount: number;
  onContinue: () => void;
  onReAnalyze: () => void;
  onViewRoadmap: () => void;
  onViewGrants: () => void;
}

export default function WelcomeBackDashboard({
  catalogAnalysisData,
  roadmapGenerated,
  projectType,
  projectUnits,
  savedGrantsCount,
  applicationsCount,
  onContinue,
  onReAnalyze,
  onViewRoadmap,
  onViewGrants
}: WelcomeBackDashboardProps) {
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="max-w-5xl w-full">
        {/* Header - Studio banner styling */}
        <div className="relative overflow-hidden rounded-2xl border border-surface-700 p-6 mb-8 banner-studio text-center">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-r from-surface-900/50 via-surface-900/30 to-transparent"></div>
          <div className="relative">
            <h1 className="text-4xl font-bold text-surface-50 mb-2">{getGreeting()}</h1>
            <p className="text-sm text-surface-300">Artist Development Session</p>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Catalog Status */}
          <div className="rounded-2xl border border-surface-700 bg-surface-800/50 p-6 backdrop-blur">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm text-surface-300 mb-1">Catalog Analysis</div>
                <div className="text-2xl font-bold text-surface-50">
                  {catalogAnalysisData ? (
                    <span className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      {catalogAnalysisData.total_tracks} tracks
                    </span>
                  ) : (
                    <span className="text-surface-300">Not yet</span>
                  )}
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary-600/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            {catalogAnalysisData && (
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-surface-300">Avg Score:</span>
                  <span className="text-surface-200 font-medium">{catalogAnalysisData.average_score.toFixed(0)}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-300">Consistency:</span>
                  <span className="text-surface-200 font-medium">{catalogAnalysisData.sonic_identity.consistency_score.toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-300">Trend:</span>
                  <span className={`font-medium ${
                    catalogAnalysisData.score_trend === 'improving' ? 'text-green-400' :
                    catalogAnalysisData.score_trend === 'declining' ? 'text-orange-400' :
                    'text-surface-300'
                  }`}>
                    {catalogAnalysisData.score_trend === 'improving' ? '↗ Improving' :
                     catalogAnalysisData.score_trend === 'declining' ? '↘ Declining' :
                     '→ Stable'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Roadmap Status */}
          <div className="rounded-2xl border border-surface-700 bg-surface-800/50 p-6 backdrop-blur">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm text-surface-300 mb-1">Project Roadmap</div>
                <div className="text-2xl font-bold text-surface-50">
                  {roadmapGenerated ? (
                    <span className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      {projectType}
                    </span>
                  ) : (
                    <span className="text-surface-300">Not set</span>
                  )}
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-accent-600/20 flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
            </div>
            {roadmapGenerated && (
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-surface-300">Tracks:</span>
                  <span className="text-surface-200 font-medium">{projectUnits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-300">Status:</span>
                  <span className="text-accent-300 font-medium">In Progress</span>
                </div>
              </div>
            )}
          </div>

          {/* Grants Status */}
          <div className="rounded-2xl border border-surface-700 bg-surface-800/50 p-6 backdrop-blur">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm text-surface-300 mb-1">Grant Opportunities</div>
                <div className="text-2xl font-bold text-surface-50">
                  {savedGrantsCount > 0 ? (
                    <span className="flex items-center gap-2">
                      {savedGrantsCount} saved
                    </span>
                  ) : (
                    <span className="text-surface-300">Explore</span>
                  )}
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-600/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-surface-300">Applications:</span>
                <span className="text-surface-200 font-medium">{applicationsCount}</span>
              </div>
              {savedGrantsCount > 0 && (
                <div className="flex justify-between">
                  <span className="text-surface-300">Status:</span>
                  <span className="text-green-300 font-medium">Active</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-surface-700 bg-surface-800/50 p-8 backdrop-blur mb-6">
          <h2 className="text-xl font-semibold text-surface-100 mb-6">
            Actions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Continue where you left off */}
            <button
              onClick={onContinue}
              className="group p-6 rounded-xl border-2 border-primary-600 bg-primary-600/10 hover:bg-primary-600/20 transition-all text-left"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-full bg-primary-600/30 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-xs px-2 py-1 rounded bg-primary-600/30 text-primary-200">
                  Resume
                </div>
              </div>
              <h3 className="text-lg font-semibold text-surface-100 mb-2 group-hover:text-primary-200 transition-colors">
                Continue Session
              </h3>
              <p className="text-sm text-surface-200">
                Resume artist development planning from last checkpoint
              </p>
            </button>

            {/* View/Edit Roadmap */}
            <button
              onClick={onViewRoadmap}
              className="group p-6 rounded-xl border border-surface-600 hover:border-accent-600 bg-surface-800/30 hover:bg-accent-600/10 transition-all text-left"
            >
              <div className="w-12 h-12 rounded-full bg-accent-600/20 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-surface-100 mb-2 group-hover:text-accent-200 transition-colors">
                {roadmapGenerated ? 'View Roadmap' : 'Generate Roadmap'}
              </h3>
              <p className="text-sm text-surface-200">
                {roadmapGenerated 
                  ? 'Review timeline, budget, and tasks'
                  : 'Start planning your next release'}
              </p>
            </button>

            {/* Re-analyze Catalog */}
            <button
              onClick={onReAnalyze}
              className="group p-6 rounded-xl border border-surface-600 hover:border-primary-600 bg-surface-800/30 hover:bg-primary-600/10 transition-all text-left"
            >
              <div className="text-3xl mb-3">🔄</div>
              <h3 className="text-lg font-semibold text-surface-100 mb-2 group-hover:text-primary-200 transition-colors">
                {catalogAnalysisData ? 'Update Catalog Analysis' : 'Analyze Your Catalog'}
              </h3>
              <p className="text-sm text-surface-200">
                {catalogAnalysisData
                  ? 'Add new tracks or refresh your analysis'
                  : 'Upload tracks to get data-driven insights'}
              </p>
            </button>

            {/* Explore Grants */}
            <button
              onClick={onViewGrants}
              className="group p-6 rounded-xl border border-surface-600 hover:border-green-600 bg-surface-800/30 hover:bg-green-600/10 transition-all text-left"
            >
              <div className="w-12 h-12 rounded-full bg-green-600/20 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-surface-100 mb-2 group-hover:text-green-200 transition-colors">
                Explore Grant Opportunities
              </h3>
              <p className="text-sm text-surface-200">
                {savedGrantsCount > 0
                  ? `${savedGrantsCount} saved funding opportunities`
                  : 'Identify funding opportunities for artist development'}
              </p>
            </button>
          </div>
        </div>

        {/* System Status */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-800/50 border border-surface-700 text-sm text-surface-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>All data is automatically saved. Resume artist development planning anytime.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
