import React from 'react';

interface OnboardingWelcomeProps {
  onStart: () => void;
  onSkip: () => void;
  hasExistingData: boolean;
}

export default function OnboardingWelcome({ onStart, onSkip, hasExistingData }: OnboardingWelcomeProps) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        {/* Main Welcome Card - Studio banner styling */}
        <div className="relative overflow-hidden rounded-2xl border border-surface-700 banner-studio p-8 md:p-12 shadow-2xl">
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-surface-900/40 via-transparent to-surface-900/40"></div>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-surface-50 mb-4">
              Artist Roadmap PRO
            </h1>
            <p className="text-lg text-surface-300 max-w-2xl mx-auto">
              Professional A&R platform for data-driven artist development and strategic release planning
            </p>
          </div>

          {/* The Journey */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-primary-300 mb-6 text-center">
              Artist Development Workflow
            </h2>
            
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex gap-4 p-5 rounded-xl bg-surface-800/50 border border-surface-700 hover:border-primary-600/50 transition-colors">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary-600/20 border-2 border-primary-600 flex items-center justify-center">
                    <span className="text-xl font-bold text-primary-400">1</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-surface-100 mb-2">
                    Baseline Assessment
                  </h3>
                  <p className="text-surface-400 text-sm leading-relaxed">
                    Analyze artist catalog with objective metrics. Spotify integration or direct upload provides 
                    quality scores, consistency analysis, sonic identity, and trend detection. Establish data-driven baseline.
                  </p>
                  <div className="mt-3 flex gap-2 text-xs">
                    <span className="px-2 py-1 rounded bg-primary-600/20 text-primary-300">Quality Metrics</span>
                    <span className="px-2 py-1 rounded bg-primary-600/20 text-primary-300">Consistency Scoring</span>
                    <span className="px-2 py-1 rounded bg-primary-600/20 text-primary-300">Trend Analysis</span>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 p-5 rounded-xl bg-surface-800/50 border border-surface-700 hover:border-accent-600/50 transition-colors">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-accent-600/20 border-2 border-accent-600 flex items-center justify-center">
                    <span className="text-xl font-bold text-accent-400">2</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-surface-100 mb-2">
                    Strategic Planning
                  </h3>
                  <p className="text-surface-400 text-sm leading-relaxed">
                    Define release strategy based on catalog data. AI assistant guides format selection (EP/Album/Singles), 
                    timeline planning, budget allocation, and goal setting. Evidence-based recommendations.
                  </p>
                  <div className="mt-3 flex gap-2 text-xs">
                    <span className="px-2 py-1 rounded bg-accent-600/20 text-accent-300">Format Selection</span>
                    <span className="px-2 py-1 rounded bg-accent-600/20 text-accent-300">Timeline Planning</span>
                    <span className="px-2 py-1 rounded bg-accent-600/20 text-accent-300">Budget Modeling</span>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 p-5 rounded-xl bg-surface-800/50 border border-surface-700 hover:border-green-600/50 transition-colors">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-green-600/20 border-2 border-green-600 flex items-center justify-center">
                    <span className="text-xl font-bold text-green-400">3</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-surface-100 mb-2">
                    Roadmap Generation
                  </h3>
                  <p className="text-surface-400 text-sm leading-relaxed">
                    System generates comprehensive roadmap from catalog + planning data. Includes realistic timelines, 
                    budget estimates by phase, task management, and grant opportunities. Fully customizable post-generation.
                  </p>
                  <div className="mt-3 flex gap-2 text-xs">
                    <span className="px-2 py-1 rounded bg-green-600/20 text-green-300">Phase Planning</span>
                    <span className="px-2 py-1 rounded bg-green-600/20 text-green-300">Budget Breakdown</span>
                    <span className="px-2 py-1 rounded bg-green-600/20 text-green-300">Grant Matching</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Why This Matters */}
          <div className="mb-8 p-6 rounded-xl bg-primary-600/10 border border-primary-600/30">
            <h3 className="text-lg font-semibold text-primary-200 mb-3">
              Evidence-Based Artist Development
            </h3>
            <p className="text-surface-300 text-sm leading-relaxed">
              Traditional A&R relies on subjective assessment and generic templates. This platform provides 
              <strong> objective catalog metrics first</strong>, then builds custom strategies based on actual data. 
              Results: More accurate artist positioning, realistic timelines, better resource allocation, 
              and higher probability of successful launches.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <button
              onClick={onStart}
              className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-surface-50 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-primary-500/50 hover:scale-105"
            >
              <span className="flex items-center justify-center gap-2">
                Begin Artist Assessment
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
            
            {hasExistingData && (
              <button
                onClick={onSkip}
                className="w-full sm:w-auto px-6 py-4 border border-surface-600 hover:border-surface-500 text-surface-300 hover:text-surface-200 rounded-xl text-sm transition-colors"
              >
                Skip to Existing Data
              </button>
            )}
          </div>

          {/* Time Estimate */}
          <div className="mt-6 text-center">
            <p className="text-xs text-surface-500">
              <span className="inline-flex items-center gap-1">
                <span>⏱️</span> Takes about 5-10 minutes
              </span>
              {' • '}
              <span>Your data is saved automatically</span>
            </p>
          </div>
        </div>

        {/* Quick Features Highlight */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="relative overflow-hidden p-4 rounded-xl border border-surface-700/50 banner-studio">
            <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-surface-900/30 via-transparent to-surface-900/30"></div>
            <div className="relative flex flex-col items-center">
              <div className="w-10 h-10 rounded-lg bg-primary-600/20 flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
                </svg>
              </div>
              <div className="text-sm font-medium text-surface-200 mb-1">Data-Driven</div>
              <div className="text-xs text-surface-400">Decisions based on real analysis</div>
            </div>
          </div>
          <div className="relative overflow-hidden p-4 rounded-xl border border-surface-700/50 banner-studio">
            <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-surface-900/30 via-transparent to-surface-900/30"></div>
            <div className="relative flex flex-col items-center">
              <div className="w-10 h-10 rounded-lg bg-accent-600/20 flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-accent-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-4.197-2.42A1 1 0 009 9.618v4.764a1 1 0 001.555.832l4.197-2.42a1 1 0 000-1.726z" />
                </svg>
              </div>
              <div className="text-sm font-medium text-surface-200 mb-1">AI-Powered</div>
              <div className="text-xs text-surface-400">Smart recommendations for your stage</div>
            </div>
          </div>
          <div className="relative overflow-hidden p-4 rounded-xl border border-surface-700/50 banner-studio">
            <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-surface-900/30 via-transparent to-surface-900/30"></div>
            <div className="relative flex flex-col items-center">
              <div className="w-10 h-10 rounded-lg bg-green-600/20 flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-sm font-medium text-surface-200 mb-1">Auto-Saved</div>
              <div className="text-xs text-surface-400">Never lose your progress</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
