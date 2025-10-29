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
        {/* Main Welcome Card */}
        <div className="rounded-2xl border border-surface-700 bg-gradient-to-br from-surface-800/90 to-surface-900/90 backdrop-blur p-8 md:p-12 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 mb-6 shadow-lg">
              <span className="text-4xl">🎵</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-surface-50 mb-4">
              Welcome to Artist Roadmap
            </h1>
            <p className="text-lg text-surface-300 max-w-2xl mx-auto">
              Your intelligent planning companion for building a successful music career
            </p>
          </div>

          {/* The Journey */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-primary-300 mb-6 text-center">
              Your Journey in 3 Simple Steps
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
                  <h3 className="text-lg font-semibold text-surface-100 mb-2 flex items-center gap-2">
                    📊 Analyze Your Current State
                  </h3>
                  <p className="text-surface-400 text-sm leading-relaxed">
                    Upload your tracks or connect Spotify to get objective data about your sound. 
                    Understand where you are today with consistency scores, audio analysis, and benchmarking.
                  </p>
                  <div className="mt-3 flex gap-2 text-xs">
                    <span className="px-2 py-1 rounded bg-primary-600/20 text-primary-300">Catalog Analysis</span>
                    <span className="px-2 py-1 rounded bg-primary-600/20 text-primary-300">Sound Profile</span>
                    <span className="px-2 py-1 rounded bg-primary-600/20 text-primary-300">Benchmarks</span>
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
                  <h3 className="text-lg font-semibold text-surface-100 mb-2 flex items-center gap-2">
                    💬 Plan Your Next Move
                  </h3>
                  <p className="text-surface-400 text-sm leading-relaxed">
                    Chat with our AI mentor to define your goals. Based on your catalog analysis, 
                    we'll help you decide: EP or Album? Timeline? Budget priorities? Let's make a plan that fits YOU.
                  </p>
                  <div className="mt-3 flex gap-2 text-xs">
                    <span className="px-2 py-1 rounded bg-accent-600/20 text-accent-300">Goal Setting</span>
                    <span className="px-2 py-1 rounded bg-accent-600/20 text-accent-300">Smart Recommendations</span>
                    <span className="px-2 py-1 rounded bg-accent-600/20 text-accent-300">Personalized</span>
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
                  <h3 className="text-lg font-semibold text-surface-100 mb-2 flex items-center gap-2">
                    📋 Build Your Roadmap
                  </h3>
                  <p className="text-surface-400 text-sm leading-relaxed">
                    Get an intelligent roadmap generated from your analysis and goals. 
                    See realistic timelines, smart budget estimates, and actionable tasks. Edit and refine as you go.
                  </p>
                  <div className="mt-3 flex gap-2 text-xs">
                    <span className="px-2 py-1 rounded bg-green-600/20 text-green-300">Timeline</span>
                    <span className="px-2 py-1 rounded bg-green-600/20 text-green-300">Budget</span>
                    <span className="px-2 py-1 rounded bg-green-600/20 text-green-300">Tasks & Grants</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Why This Matters */}
          <div className="mb-8 p-6 rounded-xl bg-primary-600/10 border border-primary-600/30">
            <h3 className="text-lg font-semibold text-primary-200 mb-3 flex items-center gap-2">
              <span>✨</span> Why This Flow Works
            </h3>
            <p className="text-surface-300 text-sm leading-relaxed">
              Most artists jump straight to planning without understanding where they are today. 
              That leads to unrealistic goals and wasted resources. By <strong>analyzing first</strong>, 
              you make decisions based on real data about your sound, consistency, and stage. 
              This means smarter plans and better outcomes.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <button
              onClick={onStart}
              className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-surface-50 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-primary-500/50 hover:scale-105"
            >
              <span className="flex items-center justify-center gap-2">
                Let's Get Started
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </button>
            
            {hasExistingData && (
              <button
                onClick={onSkip}
                className="w-full sm:w-auto px-6 py-4 border border-surface-600 hover:border-surface-500 text-surface-300 hover:text-surface-200 rounded-xl text-sm transition-colors"
              >
                Skip to Dashboard
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
          <div className="p-4 rounded-xl bg-surface-800/30 border border-surface-700/50">
            <div className="text-2xl mb-2">🎯</div>
            <div className="text-sm font-medium text-surface-200 mb-1">Data-Driven</div>
            <div className="text-xs text-surface-400">Decisions based on real analysis</div>
          </div>
          <div className="p-4 rounded-xl bg-surface-800/30 border border-surface-700/50">
            <div className="text-2xl mb-2">🤖</div>
            <div className="text-sm font-medium text-surface-200 mb-1">AI-Powered</div>
            <div className="text-xs text-surface-400">Smart recommendations for your stage</div>
          </div>
          <div className="p-4 rounded-xl bg-surface-800/30 border border-surface-700/50">
            <div className="text-2xl mb-2">💾</div>
            <div className="text-sm font-medium text-surface-200 mb-1">Auto-Saved</div>
            <div className="text-xs text-surface-400">Never lose your progress</div>
          </div>
        </div>
      </div>
    </div>
  );
}
