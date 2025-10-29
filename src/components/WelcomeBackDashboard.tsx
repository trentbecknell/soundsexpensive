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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-surface-50 mb-3">
            {getGreeting()}! 👋
          </h1>
          <p className="text-lg text-surface-300">
            Welcome back to your Artist Roadmap
          </p>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Catalog Status */}
          <div className="rounded-2xl border border-surface-700 bg-surface-800/50 p-6 backdrop-blur">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm text-surface-400 mb-1">Catalog Analysis</div>
                <div className="text-2xl font-bold text-surface-50">
                  {catalogAnalysisData ? (
                    <span className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      {catalogAnalysisData.total_tracks} tracks
                    </span>
                  ) : (
                    <span className="text-surface-500">Not yet</span>
                  )}
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary-600/20 flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
            {catalogAnalysisData && (
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-surface-400">Avg Score:</span>
                  <span className="text-surface-200 font-medium">{catalogAnalysisData.average_score.toFixed(0)}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-400">Consistency:</span>
                  <span className="text-surface-200 font-medium">{catalogAnalysisData.sonic_identity.consistency_score.toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-400">Trend:</span>
                  <span className={`font-medium ${
                    catalogAnalysisData.score_trend === 'improving' ? 'text-green-400' :
                    catalogAnalysisData.score_trend === 'declining' ? 'text-orange-400' :
                    'text-surface-300'
                  }`}>
                    {catalogAnalysisData.score_trend === 'improving' ? '📈 Improving' :
                     catalogAnalysisData.score_trend === 'declining' ? '📉 Declining' :
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
                <div className="text-sm text-surface-400 mb-1">Project Roadmap</div>
                <div className="text-2xl font-bold text-surface-50">
                  {roadmapGenerated ? (
                    <span className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      {projectType}
                    </span>
                  ) : (
                    <span className="text-surface-500">Not set</span>
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
                  <span className="text-surface-400">Tracks:</span>
                  <span className="text-surface-200 font-medium">{projectUnits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-400">Status:</span>
                  <span className="text-accent-300 font-medium">In Progress</span>
                </div>
              </div>
            )}
          </div>

          {/* Grants Status */}
          <div className="rounded-2xl border border-surface-700 bg-surface-800/50 p-6 backdrop-blur">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm text-surface-400 mb-1">Grant Opportunities</div>
                <div className="text-2xl font-bold text-surface-50">
                  {savedGrantsCount > 0 ? (
                    <span className="flex items-center gap-2">
                      {savedGrantsCount} saved
                    </span>
                  ) : (
                    <span className="text-surface-500">Explore</span>
                  )}
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-600/20 flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-surface-400">Applications:</span>
                <span className="text-surface-200 font-medium">{applicationsCount}</span>
              </div>
              {savedGrantsCount > 0 && (
                <div className="flex justify-between">
                  <span className="text-surface-400">Status:</span>
                  <span className="text-green-300 font-medium">Active</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-surface-700 bg-surface-800/50 p-8 backdrop-blur mb-6">
          <h2 className="text-xl font-semibold text-surface-100 mb-6 flex items-center gap-2">
            <span>⚡</span> Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Continue where you left off */}
            <button
              onClick={onContinue}
              className="group p-6 rounded-xl border-2 border-primary-600 bg-primary-600/10 hover:bg-primary-600/20 transition-all text-left"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">🚀</div>
                <div className="text-xs px-2 py-1 rounded bg-primary-600/30 text-primary-200">
                  Recommended
                </div>
              </div>
              <h3 className="text-lg font-semibold text-surface-100 mb-2 group-hover:text-primary-200 transition-colors">
                Continue Where You Left Off
              </h3>
              <p className="text-sm text-surface-400">
                Jump back to your last active section and keep building
              </p>
            </button>

            {/* View/Edit Roadmap */}
            <button
              onClick={onViewRoadmap}
              className="group p-6 rounded-xl border border-surface-600 hover:border-accent-600 bg-surface-800/30 hover:bg-accent-600/10 transition-all text-left"
            >
              <div className="text-3xl mb-3">📋</div>
              <h3 className="text-lg font-semibold text-surface-100 mb-2 group-hover:text-accent-200 transition-colors">
                {roadmapGenerated ? 'View & Edit Roadmap' : 'Create Your Roadmap'}
              </h3>
              <p className="text-sm text-surface-400">
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
              <p className="text-sm text-surface-400">
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
              <div className="text-3xl mb-3">💰</div>
              <h3 className="text-lg font-semibold text-surface-100 mb-2 group-hover:text-green-200 transition-colors">
                Explore Grant Opportunities
              </h3>
              <p className="text-sm text-surface-400">
                {savedGrantsCount > 0
                  ? `View your ${savedGrantsCount} saved grants`
                  : 'Find funding for your music projects'}
              </p>
            </button>
          </div>
        </div>

        {/* Helpful Tip */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-800/50 border border-surface-700 text-sm text-surface-400">
            <span>💡</span>
            <span>Your progress is automatically saved. Pick up exactly where you left off!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
