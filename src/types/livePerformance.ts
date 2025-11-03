/**
 * Live Performance & Tour Planning Types
 * 
 * Data structures for venue booking, tour budgeting, and musician compensation
 */

export type VenueTier = 'dive-bar' | 'club' | 'mid-size' | 'theater' | 'arena' | 'festival';
export type DealStructure = 'door-split' | 'guarantee' | 'guarantee-plus' | 'flat-fee';

export interface Venue {
  id: string;
  name: string;
  city: string;
  state: string;
  tier: VenueTier;
  capacity: number;
  typical_guarantee_min: number;
  typical_guarantee_max: number;
  door_split_percentage?: number; // After venue takes their cut
  avg_ticket_price: number;
  notes?: string;
  genres?: string[];
  requires_draw?: number; // Minimum expected attendance
}

export interface MusicianRole {
  role: string;
  rate_type: 'per_show' | 'weekly' | 'monthly';
  rate_min: number;
  rate_max: number;
  description: string;
}

export interface TourExpense {
  id: string;
  category: 'transport' | 'lodging' | 'food' | 'gear' | 'crew' | 'marketing' | 'misc';
  description: string;
  cost_per_show?: number;
  cost_per_day?: number;
  cost_total?: number;
  notes?: string;
}

export interface TourShow {
  id: string;
  venue_id?: string;
  venue_name: string;
  city: string;
  state: string;
  date?: string;
  capacity: number;
  expected_attendance: number;
  ticket_price: number;
  deal_structure: DealStructure;
  guarantee?: number;
  door_split?: number; // percentage
  projected_revenue: number;
  expenses: TourExpense[];
  total_expenses: number;
  net_profit: number;
}

export interface BandMember {
  id: string;
  name: string;
  role: string;
  rate_per_show: number;
  is_core_member: boolean; // vs. session/hired gun
  total_shows: number;
  total_pay: number;
}

export interface TourBudget {
  tour_name: string;
  num_shows: number;
  num_band_members: number;
  shows: TourShow[];
  band_members: BandMember[];
  total_revenue: number;
  total_expenses: number;
  total_musician_pay: number;
  net_profit: number;
  profit_margin: number;
}
