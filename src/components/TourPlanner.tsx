/**
 * Tour Planning & Live Performance Component
 * 
 * Helps artists plan tours, book appropriate venues, budget accurately,
 * and pay musicians fairly based on industry standards.
 */

import React, { useState, useMemo } from 'react';
import { Stage } from '../lib/computeStage';
import { Venue, VenueTier, BandMember, TourShow, DealStructure } from '../types/livePerformance';
import { VENUE_DATABASE, MUSICIAN_RATES, TOUR_EXPENSE_STANDARDS } from '../data/venues';
import {
  matchVenuesToArtist,
  calculateShowRevenue,
  calculateMusicianPay,
  generateTourBudget,
  recommendBandPay,
  suggestTourRouting
} from '../lib/tourPlanning';

interface TourPlannerProps {
  artistStage: Stage;
  genres: string[];
  estimatedDraw: number;
  onEstimatedDrawChange: (draw: number) => void;
}

const uid = () => Math.random().toString(36).slice(2, 9);
const currency = (n: number) => n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export default function TourPlanner({ 
  artistStage, 
  genres,
  estimatedDraw,
  onEstimatedDrawChange
}: TourPlannerProps) {
  const [selectedVenues, setSelectedVenues] = useState<Venue[]>([]);
  const [bandMembers, setBandMembers] = useState<BandMember[]>([
    {
      id: uid(),
      name: 'Artist (You)',
      role: 'Leader',
      rate_per_show: 0,
      is_core_member: true,
      total_shows: 0,
      total_pay: 0
    }
  ]);
  const [activeTab, setActiveTab] = useState<'venues' | 'band' | 'budget'>('venues');

  // Match recommended venues based on artist profile
  const recommendedVenues = useMemo(() => {
    const genreList = genres
      .map(g => g.trim().toLowerCase())
      .filter(Boolean);
    
    return matchVenuesToArtist(
      artistStage,
      estimatedDraw || 100,
      genreList
    );
  }, [artistStage, estimatedDraw, genres]);

  // Get routing suggestions
  const routingSuggestions = useMemo(() => {
    if (selectedVenues.length < 2) {
      return { optimizedOrder: selectedVenues, totalMiles: 0, recommendations: [] };
    }
    return suggestTourRouting(selectedVenues);
  }, [selectedVenues]);

  // Calculate tour budget
  const tourBudget = useMemo(() => {
    if (selectedVenues.length === 0) {
      return {
        shows: [],
        totalRevenue: 0,
        totalExpenses: 0,
        totalMusicianPay: 0,
        netProfit: 0,
        profitMargin: 0
      };
    }

    // Calculate pay for each band member
    const membersWithPay = bandMembers.map(member => {
      const payPerShow = member.is_core_member ? 0 : calculateMusicianPay(
        selectedVenues[0]?.tier || 'club',
        selectedVenues.length,
        member.role,
        member.is_core_member
      );

      return {
        ...member,
        rate_per_show: payPerShow,
        total_shows: selectedVenues.length,
        total_pay: payPerShow * selectedVenues.length
      };
    });

    // Generate budget
    const expectedAttendances = selectedVenues.map(v => Math.floor(v.capacity * 0.75));
    const ticketPrices = selectedVenues.map(v => v.avg_ticket_price);
    const dealStructures: DealStructure[] = selectedVenues.map(v => 
      v.tier === 'dive-bar' ? 'door-split' : 'guarantee-plus'
    );
    const guarantees = selectedVenues.map(v => v.typical_guarantee_min + 
      ((v.typical_guarantee_max - v.typical_guarantee_min) * 0.6)
    );

    const budget = generateTourBudget(
      selectedVenues,
      membersWithPay,
      expectedAttendances,
      ticketPrices,
      dealStructures,
      guarantees
    );

    // Recommend fair pay split for core members
    const finalMembers = recommendBandPay(
      budget.totalRevenue,
      budget.totalExpenses,
      membersWithPay,
      40 // Leader gets 40%
    );

    setBandMembers(finalMembers);

    return {
      ...budget,
      totalMusicianPay: finalMembers.reduce((sum, m) => sum + m.total_pay, 0)
    };
  }, [selectedVenues, bandMembers.length]);

  const addVenue = (venue: Venue) => {
    if (!selectedVenues.find(v => v.id === venue.id)) {
      setSelectedVenues([...selectedVenues, venue]);
    }
  };

  const removeVenue = (venueId: string) => {
    setSelectedVenues(selectedVenues.filter(v => v.id !== venueId));
  };

  const addBandMember = (role: string, isCore: boolean = false) => {
    setBandMembers([
      ...bandMembers,
      {
        id: uid(),
        name: '',
        role,
        rate_per_show: 0,
        is_core_member: isCore,
        total_shows: selectedVenues.length,
        total_pay: 0
      }
    ]);
  };

  const removeBandMember = (id: string) => {
    setBandMembers(bandMembers.filter(m => m.id !== id));
  };

  const updateBandMember = (id: string, updates: Partial<BandMember>) => {
    setBandMembers(bandMembers.map(m => 
      m.id === id ? { ...m, ...updates } : m
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-primary-700 bg-primary-900/20 p-6 backdrop-blur">
        <h2 className="text-xl font-semibold text-primary-100 mb-2">🎸 Live Performance Planning</h2>
        <p className="text-surface-300 text-sm mb-4">
          Book the right venues, budget accurately, and pay your team fairly based on industry standards.
        </p>

        {/* Estimated Draw Input */}
        <div className="bg-surface-800/50 rounded-lg p-4">
          <label className="block text-sm font-medium text-surface-200 mb-2">
            Your Estimated Draw (average attendance you can pull)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="20"
              max="5000"
              step="10"
              value={estimatedDraw}
              onChange={(e) => onEstimatedDrawChange(parseInt(e.target.value))}
              className="flex-1"
            />
            <input
              type="number"
              min="20"
              max="10000"
              value={estimatedDraw}
              onChange={(e) => onEstimatedDrawChange(parseInt(e.target.value) || 100)}
              className="w-24 rounded-lg bg-surface-700 px-3 py-2 text-surface-100"
            />
            <span className="text-surface-300 text-sm">people</span>
          </div>
          <p className="text-xs text-surface-400 mt-2">
            Your current stage ({artistStage}) suggests venues with {recommendedVenues[0]?.capacity || 100} - {recommendedVenues[4]?.capacity || 500} capacity.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-surface-800/50 rounded-xl border border-surface-700">
        <button
          onClick={() => setActiveTab('venues')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'venues'
              ? 'bg-primary-600 text-primary-50'
              : 'text-surface-300 hover:text-surface-200 hover:bg-surface-700'
          }`}
        >
          1. Venues {selectedVenues.length > 0 && `(${selectedVenues.length})`}
        </button>
        <button
          onClick={() => setActiveTab('band')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'band'
              ? 'bg-primary-600 text-primary-50'
              : 'text-surface-300 hover:text-surface-200 hover:bg-surface-700'
          }`}
        >
          2. Band & Crew {bandMembers.length > 1 && `(${bandMembers.length})`}
        </button>
        <button
          onClick={() => setActiveTab('budget')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'budget'
              ? 'bg-primary-600 text-primary-50'
              : 'text-surface-300 hover:text-surface-200 hover:bg-surface-700'
          }`}
        >
          3. Budget {selectedVenues.length > 0 && `(${currency(tourBudget.netProfit)} net)`}
        </button>
      </div>

      {/* Venue Selection Tab */}
      {activeTab === 'venues' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-surface-700 bg-surface-800/80 p-6">
            <h3 className="text-lg font-semibold text-surface-100 mb-4">Recommended Venues for Your Stage</h3>
            
            {recommendedVenues.length === 0 && (
              <div className="text-center py-8 text-surface-400">
                <p>Update your estimated draw above to see venue recommendations.</p>
                <p className="text-sm mt-2">We'll match you with venues appropriate for your audience size.</p>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              {recommendedVenues.slice(0, 12).map(venue => {
                const isSelected = selectedVenues.find(v => v.id === venue.id);
                const fillRate = ((estimatedDraw / venue.capacity) * 100).toFixed(0);
                
                return (
                  <div
                    key={venue.id}
                    className={`rounded-lg border p-4 transition-all ${
                      isSelected
                        ? 'border-primary-500 bg-primary-900/20'
                        : 'border-surface-700 bg-surface-800/50 hover:border-surface-600'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-surface-100">{venue.name}</h4>
                        <p className="text-sm text-surface-300">{venue.city}, {venue.state}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        venue.tier === 'arena' || venue.tier === 'theater' ? 'bg-purple-500/20 text-purple-300' :
                        venue.tier === 'mid-size' ? 'bg-blue-500/20 text-blue-300' :
                        venue.tier === 'club' ? 'bg-green-500/20 text-green-300' :
                        'bg-surface-600 text-surface-300'
                      }`}>
                        {venue.tier}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-surface-300 mb-3">
                      <div>
                        <span className="text-surface-400">Capacity:</span> {venue.capacity}
                      </div>
                      <div>
                        <span className="text-surface-400">Fill Rate:</span> {fillRate}%
                      </div>
                      <div>
                        <span className="text-surface-400">Guarantee:</span> {currency(venue.typical_guarantee_min)} - {currency(venue.typical_guarantee_max)}
                      </div>
                      <div>
                        <span className="text-surface-400">Avg Ticket:</span> {currency(venue.avg_ticket_price)}
                      </div>
                    </div>

                    {venue.notes && (
                      <p className="text-xs text-surface-400 mb-3 italic">{venue.notes}</p>
                    )}

                    <button
                      onClick={() => isSelected ? removeVenue(venue.id) : addVenue(venue)}
                      className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isSelected
                          ? 'bg-red-600/20 text-red-300 hover:bg-red-600/30 border border-red-600/50'
                          : 'bg-primary-600 text-white hover:bg-primary-700'
                      }`}
                    >
                      {isSelected ? 'Remove from Tour' : 'Add to Tour'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Band & Crew Tab */}
      {activeTab === 'band' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-surface-700 bg-surface-800/80 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-surface-100">Band & Crew</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => addBandMember('Guitarist', false)}
                  className="px-3 py-2 rounded-lg bg-surface-700 text-surface-200 hover:bg-surface-600 text-sm"
                >
                  + Session Musician
                </button>
                <button
                  onClick={() => addBandMember('Band Member', true)}
                  className="px-3 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 text-sm"
                >
                  + Core Member
                </button>
              </div>
            </div>

            {/* Rate Standards Reference */}
            <div className="mb-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <h4 className="text-sm font-medium text-blue-300 mb-2">💡 Fair Rate Standards (AFM Union Scale)</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-surface-300">
                {MUSICIAN_RATES.slice(0, 6).map(rate => (
                  <div key={rate.role}>
                    <span className="text-surface-400">{rate.role}:</span> {currency(rate.rate_min)} - {currency(rate.rate_max)}
                  </div>
                ))}
              </div>
              <p className="text-xs text-surface-400 mt-2">
                Rates vary by venue tier, tour length, and region. Core members share profit instead of per-show rates.
              </p>
            </div>

            {/* Band Members List */}
            <div className="space-y-3">
              {bandMembers.map(member => (
                <div key={member.id} className="rounded-lg border border-surface-700 bg-surface-800/50 p-4">
                  <div className="grid grid-cols-12 gap-3 items-center">
                    <input
                      type="text"
                      placeholder="Name"
                      value={member.name}
                      onChange={(e) => updateBandMember(member.id, { name: e.target.value })}
                      className="col-span-3 rounded-lg bg-surface-700 px-3 py-2 text-surface-100 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Role"
                      value={member.role}
                      onChange={(e) => updateBandMember(member.id, { role: e.target.value })}
                      className="col-span-3 rounded-lg bg-surface-700 px-3 py-2 text-surface-100 text-sm"
                      disabled={member.role === 'Leader'}
                    />
                    <div className="col-span-2 flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={member.is_core_member}
                        onChange={(e) => updateBandMember(member.id, { is_core_member: e.target.checked })}
                        disabled={member.role === 'Leader'}
                      />
                      <span className="text-xs text-surface-300">Core</span>
                    </div>
                    <div className="col-span-2 text-sm text-surface-200">
                      {member.is_core_member ? (
                        <span className="text-green-400">Profit Share</span>
                      ) : (
                        <span>{currency(member.rate_per_show)}/show</span>
                      )}
                    </div>
                    <div className="col-span-1 text-sm font-medium text-surface-100">
                      {currency(member.total_pay)}
                    </div>
                    <div className="col-span-1 flex justify-end">
                      {member.role !== 'Leader' && (
                        <button
                          onClick={() => removeBandMember(member.id)}
                          className="px-2 py-1 rounded bg-red-600/20 text-red-300 hover:bg-red-600/30 text-xs"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedVenues.length > 0 && (
              <div className="mt-4 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                <div className="text-sm text-green-300">
                  <strong>Total Musician Pay:</strong> {currency(tourBudget.totalMusicianPay)} across {selectedVenues.length} shows
                </div>
                <p className="text-xs text-surface-400 mt-1">
                  Core members split {((tourBudget.totalRevenue - tourBudget.totalExpenses - tourBudget.totalMusicianPay) / tourBudget.totalRevenue * 100).toFixed(1)}% of net revenue. Session musicians get guaranteed rates.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Budget Tab */}
      {activeTab === 'budget' && (
        <div className="space-y-4">
          {selectedVenues.length === 0 ? (
            <div className="rounded-2xl border border-surface-700 bg-surface-800/80 p-12 text-center">
              <div className="text-surface-400 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-lg">No shows selected yet</p>
                <p className="text-sm mt-2">Go to the Venues tab to build your tour</p>
              </div>
            </div>
          ) : (
            <>
              {/* Budget Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="rounded-lg border border-surface-700 bg-surface-800/80 p-4">
                  <div className="text-sm text-surface-400 mb-1">Total Revenue</div>
                  <div className="text-2xl font-semibold text-green-400">{currency(tourBudget.totalRevenue)}</div>
                  <div className="text-xs text-surface-500 mt-1">{selectedVenues.length} shows</div>
                </div>
                <div className="rounded-lg border border-surface-700 bg-surface-800/80 p-4">
                  <div className="text-sm text-surface-400 mb-1">Tour Expenses</div>
                  <div className="text-2xl font-semibold text-orange-400">{currency(tourBudget.totalExpenses)}</div>
                  <div className="text-xs text-surface-500 mt-1">Travel, hotels, gear</div>
                </div>
                <div className="rounded-lg border border-surface-700 bg-surface-800/80 p-4">
                  <div className="text-sm text-surface-400 mb-1">Musician Pay</div>
                  <div className="text-2xl font-semibold text-blue-400">{currency(tourBudget.totalMusicianPay)}</div>
                  <div className="text-xs text-surface-500 mt-1">{bandMembers.length} people</div>
                </div>
                <div className="rounded-lg border border-surface-700 bg-surface-800/80 p-4">
                  <div className="text-sm text-surface-400 mb-1">Net Profit</div>
                  <div className={`text-2xl font-semibold ${tourBudget.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {currency(tourBudget.netProfit)}
                  </div>
                  <div className="text-xs text-surface-500 mt-1">{tourBudget.profitMargin.toFixed(1)}% margin</div>
                </div>
              </div>

              {/* Routing Recommendations */}
              {routingSuggestions.recommendations.length > 0 && (
                <div className="rounded-lg border border-primary-700/50 bg-primary-900/10 p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-primary-200 mb-2">Tour Routing</h3>
                      <div className="text-sm text-surface-300 mb-2">
                        Total Distance: <span className="font-medium text-white">{routingSuggestions.totalMiles.toLocaleString()} miles</span>
                      </div>
                      <div className="space-y-1.5">
                        {routingSuggestions.recommendations.map((rec, idx) => (
                          <div key={idx} className="text-sm text-surface-400 flex items-start gap-2">
                            <span className="text-surface-600">•</span>
                            <span>{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Show-by-Show Breakdown */}
              <div className="rounded-2xl border border-surface-700 bg-surface-800/80 p-6">
                <h3 className="text-lg font-semibold text-surface-100 mb-4">Show-by-Show Breakdown</h3>
                <div className="space-y-3">
                  {tourBudget.shows.map((show, idx) => (
                    <div key={show.id} className="rounded-lg border border-surface-700 bg-surface-800/50 p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-surface-100">
                            {idx + 1}. {show.venue_name}
                          </h4>
                          <p className="text-sm text-surface-300">{show.city}, {show.state}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-surface-100">
                            {currency(show.projected_revenue)}
                          </div>
                          <div className="text-xs text-surface-400">
                            {show.expected_attendance} / {show.capacity} ({((show.expected_attendance / show.capacity) * 100).toFixed(0)}%)
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-surface-400 text-xs mb-1">Deal Structure</div>
                          <div className="text-surface-200">{show.deal_structure}</div>
                        </div>
                        <div>
                          <div className="text-surface-400 text-xs mb-1">Show Expenses</div>
                          <div className="text-orange-400">{currency(show.total_expenses)}</div>
                        </div>
                        <div>
                          <div className="text-surface-400 text-xs mb-1">Show Profit</div>
                          <div className={show.net_profit >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {currency(show.net_profit)}
                          </div>
                        </div>
                      </div>

                      {/* Expense breakdown (collapsible) */}
                      <details className="mt-3">
                        <summary className="text-xs text-surface-400 cursor-pointer hover:text-surface-300">
                          View expense details
                        </summary>
                        <div className="mt-2 space-y-1 pl-4 border-l-2 border-surface-700">
                          {show.expenses.map(exp => (
                            <div key={exp.id} className="flex justify-between text-xs text-surface-300">
                              <span>{exp.description}</span>
                              <span>{currency(exp.cost_per_show || 0)}</span>
                            </div>
                          ))}
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warnings & Recommendations */}
              {tourBudget.netProfit < 0 && (
                <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div className="flex-1">
                      <div className="font-medium text-red-300 mb-1">Tour is Unprofitable</div>
                      <div className="text-sm text-surface-300">
                        This tour will lose {currency(Math.abs(tourBudget.netProfit))}. Consider:
                        <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
                          <li>Reducing band size or negotiating lower session rates</li>
                          <li>Targeting venues with better guarantees</li>
                          <li>Sharing hotels (2+ per room) to cut lodging costs</li>
                          <li>Building local fanbase to increase draw and ticket sales</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
