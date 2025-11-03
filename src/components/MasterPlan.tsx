/**
 * Master Project Plan Component
 * 
 * Shows the complete journey: Finish Songs → Release → Tour
 * with total investment required and projected ROI
 */

import React, { useMemo } from 'react';
import { Stage } from '../lib/computeStage';
import { BudgetItem, ProjectConfig, ArtistProfile } from '../App';

interface MasterPlanProps {
  profile: ArtistProfile;
  projectConfig: ProjectConfig;
  budgetItems: BudgetItem[];
  artistStage: Stage;
  estimatedDraw: number;
  genres: string[];
  onNavigate: (tab: string) => void;
}

const currency = (n: number) => n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const pct = (n: number) => (n * 100).toFixed(1) + '%';

export default function MasterPlan({
  profile,
  projectConfig,
  budgetItems,
  artistStage,
  estimatedDraw,
  genres,
  onNavigate
}: MasterPlanProps) {
  
  // Calculate production budget (pre-production, production, post-production)
  const productionBudget = useMemo(() => {
    const productionPhases = ['Pre‑Production', 'Production', 'Post‑Production'];
    return budgetItems
      .filter(item => productionPhases.includes(item.phase))
      .reduce((sum, item) => sum + (item.qty * item.unitCost), 0);
  }, [budgetItems]);

  // Calculate release/marketing budget
  const releaseBudget = useMemo(() => {
    return budgetItems
      .filter(item => item.phase === 'Release')
      .reduce((sum, item) => sum + (item.qty * item.unitCost), 0);
  }, [budgetItems]);

  // Calculate growth/promo budget
  const growthBudget = useMemo(() => {
    return budgetItems
      .filter(item => item.phase === 'Growth')
      .reduce((sum, item) => sum + (item.qty * item.unitCost), 0);
  }, [budgetItems]);

  // Estimate tour revenue based on stage and draw
  const tourProjections = useMemo(() => {
    // Simplified tour calculation - can be enhanced with actual tour data
    let showCount = 5;
    let avgRevenue = 1500;
    let avgExpenses = 400;
    
    if (estimatedDraw < 50) {
      showCount = 3;
      avgRevenue = 800;
      avgExpenses = 200;
    } else if (estimatedDraw < 150) {
      showCount = 5;
      avgRevenue = 1500;
      avgExpenses = 400;
    } else if (estimatedDraw < 400) {
      showCount = 8;
      avgRevenue = 3200;
      avgExpenses = 650;
    } else if (estimatedDraw < 1000) {
      showCount = 12;
      avgRevenue = 6500;
      avgExpenses = 900;
    } else {
      showCount = 20;
      avgRevenue = 12000;
      avgExpenses = 1500;
    }

    const totalRevenue = showCount * avgRevenue;
    const totalExpenses = showCount * avgExpenses;
    const netProfit = totalRevenue - totalExpenses;

    return {
      showCount,
      totalRevenue,
      totalExpenses,
      netProfit,
      perShowProfit: netProfit / showCount
    };
  }, [estimatedDraw]);

  // Estimate streaming/digital revenue (conservative)
  const streamingProjections = useMemo(() => {
    const songsToRelease = projectConfig.units || 5;
    
    // Conservative estimates based on stage
    let monthlyStreams = 1000;
    if (artistStage === 'Developing') monthlyStreams = 5000;
    if (artistStage === 'Established') monthlyStreams = 25000;
    if (artistStage === 'Breakout') monthlyStreams = 100000;

    const avgPayPerStream = 0.003; // $0.003 conservative average
    const monthlyRevenue = monthlyStreams * avgPayPerStream;
    const yearOneRevenue = monthlyRevenue * 12;

    return {
      monthlyStreams,
      monthlyRevenue,
      yearOneRevenue,
      songsToRelease
    };
  }, [artistStage, projectConfig.units]);

  // Calculate total investment
  const totalInvestment = productionBudget + releaseBudget + growthBudget;

  // Calculate total year-one revenue
  const totalYearOneRevenue = tourProjections.netProfit + streamingProjections.yearOneRevenue;

  // Calculate ROI
  const roi = totalInvestment > 0 ? (totalYearOneRevenue - totalInvestment) / totalInvestment : 0;
  const breakEvenMonths = totalInvestment > 0 && streamingProjections.monthlyRevenue > 0
    ? Math.ceil(totalInvestment / streamingProjections.monthlyRevenue)
    : 999;

  // Determine project viability
  const isViable = totalYearOneRevenue >= totalInvestment * 0.7; // At least 70% payback
  const isHighlyViable = roi > 0.5; // 50%+ ROI

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="rounded-2xl border border-primary-700 bg-gradient-to-br from-primary-900/40 to-accent-900/20 p-8 backdrop-blur">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-primary-100 mb-2">
              🎯 Master Project Plan
            </h2>
            <p className="text-surface-300 text-sm max-w-2xl">
              Your complete journey from finishing songs to profitable touring. 
              Here's what it takes and what you'll earn back.
            </p>
          </div>
          <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
            isHighlyViable 
              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
              : isViable
              ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
              : 'bg-red-500/20 text-red-300 border border-red-500/30'
          }`}>
            {isHighlyViable ? '✓ Highly Viable' : isViable ? '⚠ Viable' : '⚠ High Risk'}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-surface-800/60 rounded-lg p-4 border border-surface-700">
            <div className="text-xs text-surface-400 mb-1">Total Investment</div>
            <div className="text-2xl font-bold text-white">{currency(totalInvestment)}</div>
            <div className="text-xs text-surface-500 mt-1">All-in project cost</div>
          </div>
          <div className="bg-surface-800/60 rounded-lg p-4 border border-surface-700">
            <div className="text-xs text-surface-400 mb-1">Year 1 Revenue</div>
            <div className="text-2xl font-bold text-green-400">{currency(totalYearOneRevenue)}</div>
            <div className="text-xs text-surface-500 mt-1">Tour + streaming</div>
          </div>
          <div className="bg-surface-800/60 rounded-lg p-4 border border-surface-700">
            <div className="text-xs text-surface-400 mb-1">Net Return (Year 1)</div>
            <div className={`text-2xl font-bold ${totalYearOneRevenue >= totalInvestment ? 'text-green-400' : 'text-orange-400'}`}>
              {currency(totalYearOneRevenue - totalInvestment)}
            </div>
            <div className="text-xs text-surface-500 mt-1">Profit/loss after investment</div>
          </div>
          <div className="bg-surface-800/60 rounded-lg p-4 border border-surface-700">
            <div className="text-xs text-surface-400 mb-1">ROI (Year 1)</div>
            <div className={`text-2xl font-bold ${roi > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {roi > 0 ? '+' : ''}{pct(roi)}
            </div>
            <div className="text-xs text-surface-500 mt-1">Return on investment</div>
          </div>
        </div>
      </div>

      {/* Project Phases Timeline */}
      <div className="rounded-2xl border border-surface-700 bg-surface-800/40 p-6">
        <h3 className="text-lg font-semibold text-surface-100 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Project Phases
        </h3>

        <div className="space-y-3">
          {/* Phase 1: Production */}
          <div 
            onClick={() => onNavigate('budget')}
            className="bg-surface-800/60 rounded-lg p-4 border border-surface-700 hover:border-primary-600 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-medium text-surface-100 mb-1">
                  1️⃣ Production Phase
                </h4>
                <p className="text-sm text-surface-400">
                  Record {projectConfig.units} songs - Pre-production, tracking, mixing, mastering
                </p>
              </div>
              <div className="text-right ml-4">
                <div className="text-lg font-semibold text-white">{currency(productionBudget)}</div>
                <div className="text-xs text-surface-500">Click to edit budget</div>
              </div>
            </div>
            <div className="flex gap-2 text-xs text-surface-500">
              <span>📅 Estimated: {Math.ceil((productionBudget / 500) || 8)} weeks</span>
            </div>
          </div>

          {/* Phase 2: Release */}
          <div 
            onClick={() => onNavigate('budget')}
            className="bg-surface-800/60 rounded-lg p-4 border border-surface-700 hover:border-primary-600 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-medium text-surface-100 mb-1">
                  2️⃣ Release Phase
                </h4>
                <p className="text-sm text-surface-400">
                  Distribution, press release, playlist pitching, cover art, social media campaign
                </p>
              </div>
              <div className="text-right ml-4">
                <div className="text-lg font-semibold text-white">{currency(releaseBudget)}</div>
                <div className="text-xs text-surface-500">Marketing costs</div>
              </div>
            </div>
            <div className="flex gap-2 text-xs text-surface-500">
              <span>📅 Launch week + 4 weeks promo</span>
            </div>
          </div>

          {/* Phase 3: Growth */}
          {growthBudget > 0 && (
            <div 
              onClick={() => onNavigate('budget')}
              className="bg-surface-800/60 rounded-lg p-4 border border-surface-700 hover:border-primary-600 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-medium text-surface-100 mb-1">
                    3️⃣ Growth Phase
                  </h4>
                  <p className="text-sm text-surface-400">
                    Ongoing promotion, content creation, audience building
                  </p>
                </div>
                <div className="text-right ml-4">
                  <div className="text-lg font-semibold text-white">{currency(growthBudget)}</div>
                  <div className="text-xs text-surface-500">Sustained marketing</div>
                </div>
              </div>
              <div className="flex gap-2 text-xs text-surface-500">
                <span>📅 Ongoing (months 2-6)</span>
              </div>
            </div>
          )}

          {/* Phase 4: Tour */}
          <div 
            onClick={() => onNavigate('live')}
            className="bg-surface-800/60 rounded-lg p-4 border border-primary-600 hover:border-primary-500 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-medium text-primary-200 mb-1">
                  4️⃣ Tour Phase 🎸
                </h4>
                <p className="text-sm text-surface-400">
                  {tourProjections.showCount}-show tour to support the release
                </p>
              </div>
              <div className="text-right ml-4">
                <div className="text-lg font-semibold text-green-400">+{currency(tourProjections.netProfit)}</div>
                <div className="text-xs text-green-500/70">Net profit from shows</div>
              </div>
            </div>
            <div className="flex gap-2 text-xs text-surface-500">
              <span>📅 Months 3-4 after release</span>
              <span>•</span>
              <span>{currency(tourProjections.perShowProfit)}/show average</span>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Projections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tour Revenue */}
        <div className="rounded-2xl border border-surface-700 bg-surface-800/40 p-6">
          <h3 className="text-lg font-semibold text-surface-100 mb-4">🎤 Tour Revenue</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-surface-400">Show Count</span>
              <span className="text-surface-100 font-medium">{tourProjections.showCount} shows</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-surface-400">Gross Revenue</span>
              <span className="text-surface-100 font-medium">{currency(tourProjections.totalRevenue)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-surface-400">Tour Expenses</span>
              <span className="text-orange-400 font-medium">-{currency(tourProjections.totalExpenses)}</span>
            </div>
            <div className="pt-2 border-t border-surface-700 flex justify-between">
              <span className="text-surface-300 font-medium">Net Tour Profit</span>
              <span className="text-green-400 font-semibold text-lg">{currency(tourProjections.netProfit)}</span>
            </div>
            <button
              onClick={() => onNavigate('live')}
              className="w-full mt-4 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium transition-colors"
            >
              Build Detailed Tour Plan →
            </button>
          </div>
        </div>

        {/* Streaming Revenue */}
        <div className="rounded-2xl border border-surface-700 bg-surface-800/40 p-6">
          <h3 className="text-lg font-semibold text-surface-100 mb-4">📱 Streaming Revenue</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-surface-400">Songs Released</span>
              <span className="text-surface-100 font-medium">{streamingProjections.songsToRelease} tracks</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-surface-400">Monthly Streams (Est.)</span>
              <span className="text-surface-100 font-medium">{streamingProjections.monthlyStreams.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-surface-400">Monthly Revenue</span>
              <span className="text-surface-100 font-medium">{currency(streamingProjections.monthlyRevenue)}</span>
            </div>
            <div className="pt-2 border-t border-surface-700 flex justify-between">
              <span className="text-surface-300 font-medium">Year 1 Streaming</span>
              <span className="text-green-400 font-semibold text-lg">{currency(streamingProjections.yearOneRevenue)}</span>
            </div>
            <div className="text-xs text-surface-500 mt-2">
              Conservative estimate • Based on {artistStage} stage
            </div>
          </div>
        </div>
      </div>

      {/* Financial Analysis */}
      <div className="rounded-2xl border border-surface-700 bg-surface-800/40 p-6">
        <h3 className="text-lg font-semibold text-surface-100 mb-4">💰 Financial Analysis</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="text-sm text-surface-400 mb-2">Investment Breakdown</div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-surface-300">Production</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-surface-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500"
                        style={{ width: `${(productionBudget / totalInvestment) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-white font-medium w-20 text-right">{currency(productionBudget)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-surface-300">Release/Marketing</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-surface-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500"
                        style={{ width: `${(releaseBudget / totalInvestment) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-white font-medium w-20 text-right">{currency(releaseBudget)}</span>
                  </div>
                </div>
                {growthBudget > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-surface-300">Growth/Promo</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-surface-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500"
                          style={{ width: `${(growthBudget / totalInvestment) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-white font-medium w-20 text-right">{currency(growthBudget)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="text-sm text-surface-400 mb-2">Revenue Sources (Year 1)</div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-surface-300">Tour Profit</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-surface-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500"
                        style={{ width: `${(tourProjections.netProfit / totalYearOneRevenue) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-green-400 font-medium w-20 text-right">{currency(tourProjections.netProfit)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-surface-300">Streaming</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-surface-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500"
                        style={{ width: `${(streamingProjections.yearOneRevenue / totalYearOneRevenue) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-green-400 font-medium w-20 text-right">{currency(streamingProjections.yearOneRevenue)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-surface-900/50 rounded-lg p-4 border border-surface-700">
              <div className="text-sm text-surface-400 mb-3">Break-Even Analysis</div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-surface-300">Payback from Tour</span>
                  <span className="text-white font-medium">
                    {pct(tourProjections.netProfit / totalInvestment)} of investment
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-surface-300">Streaming Break-Even</span>
                  <span className="text-white font-medium">
                    {breakEvenMonths < 999 ? `${breakEvenMonths} months` : 'Not viable'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-surface-300">Year 1 Recovery</span>
                  <span className={`font-medium ${totalYearOneRevenue >= totalInvestment ? 'text-green-400' : 'text-orange-400'}`}>
                    {pct(totalYearOneRevenue / totalInvestment)}
                  </span>
                </div>
              </div>
            </div>

            {!isViable && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <div className="flex gap-2 items-start">
                  <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="text-sm text-red-300">
                    <div className="font-medium mb-1">High Risk Project</div>
                    <div className="text-red-400/80">
                      Current projections show less than 70% payback in year one. Consider reducing production costs or increasing draw before proceeding.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isViable && !isHighlyViable && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex gap-2 items-start">
                  <svg className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-yellow-300">
                    <div className="font-medium mb-1">Viable but Tight</div>
                    <div className="text-yellow-400/80">
                      Project is viable but margins are tight. Consider building more audience before major investment or reducing scope.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isHighlyViable && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex gap-2 items-start">
                  <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-green-300">
                    <div className="font-medium mb-1">Highly Viable Project</div>
                    <div className="text-green-400/80">
                      Strong ROI potential with {pct(roi)} year-one return. This is a financially sound investment at your current level.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Items */}
      <div className="rounded-2xl border border-primary-700 bg-primary-900/10 p-6">
        <h3 className="text-lg font-semibold text-primary-100 mb-4">🎯 Next Steps</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate('budget')}
            className="p-4 rounded-lg bg-surface-800/60 border border-surface-700 hover:border-primary-600 transition-colors text-left"
          >
            <div className="text-sm font-medium text-primary-200 mb-1">1. Finalize Budget</div>
            <div className="text-xs text-surface-400">Review and adjust production/marketing costs</div>
          </button>
          <button
            onClick={() => onNavigate('live')}
            className="p-4 rounded-lg bg-surface-800/60 border border-surface-700 hover:border-primary-600 transition-colors text-left"
          >
            <div className="text-sm font-medium text-primary-200 mb-1">2. Plan Tour</div>
            <div className="text-xs text-surface-400">Build complete tour with venue selection</div>
          </button>
          <button
            onClick={() => onNavigate('timeline')}
            className="p-4 rounded-lg bg-surface-800/60 border border-surface-700 hover:border-primary-600 transition-colors text-left"
          >
            <div className="text-sm font-medium text-primary-200 mb-1">3. View Timeline</div>
            <div className="text-xs text-surface-400">See complete project schedule</div>
          </button>
        </div>
      </div>
    </div>
  );
}
