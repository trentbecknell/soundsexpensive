/**
 * Live Performance Planning Library
 * 
 * Logic for venue matching, tour budgeting, and fair compensation calculations
 */

import { Stage } from './computeStage';
import { Venue, VenueTier, TourShow, BandMember, TourExpense, DealStructure } from '../types/livePerformance';
import { VENUE_DATABASE, MUSICIAN_RATES, TOUR_EXPENSE_STANDARDS } from '../data/venues';

/**
 * Match venues to artist's current stage and audience size
 */
export function matchVenuesToArtist(
  stage: Stage,
  estimatedDraw: number,
  preferredGenres: string[],
  targetCities?: string[]
): Venue[] {
  // Map artist stage to venue tier recommendations
  const stageToTiers: Record<Stage, VenueTier[]> = {
    'Emerging': ['dive-bar', 'club'],
    'Developing': ['club', 'mid-size', 'festival'],
    'Established': ['mid-size', 'theater', 'festival'],
    'Breakout': ['theater', 'arena', 'festival']
  };

  const recommendedTiers = stageToTiers[stage];

  // Filter and score venues
  const scoredVenues = VENUE_DATABASE
    .filter(venue => {
      // Must be in recommended tier
      if (!recommendedTiers.includes(venue.tier)) return false;

      // Must be within reasonable draw range (50% to 120% of capacity)
      const minDraw = venue.capacity * 0.5;
      const maxDraw = venue.capacity * 1.2;
      if (estimatedDraw < minDraw || estimatedDraw > maxDraw) return false;

      // Filter by target cities if specified
      if (targetCities && targetCities.length > 0) {
        return targetCities.includes(venue.city);
      }

      return true;
    })
    .map(venue => {
      let score = 0;

      // Prefer venues that match genre
      if (venue.genres && preferredGenres.some(g => 
        venue.genres?.some(vg => vg.toLowerCase().includes(g.toLowerCase()))
      )) {
        score += 10;
      }

      // Prefer venues where draw matches capacity well (80-100%)
      const fillRate = estimatedDraw / venue.capacity;
      if (fillRate >= 0.8 && fillRate <= 1.0) {
        score += 15;
      } else if (fillRate >= 0.6 && fillRate < 0.8) {
        score += 10;
      } else if (fillRate > 1.0 && fillRate <= 1.2) {
        score += 5; // Slight bonus for sellout potential
      }

      // Prefer higher capacity within tier (shows growth trajectory)
      score += (venue.capacity / 10000) * 5;

      return { venue, score };
    })
    .sort((a, b) => b.score - a.score)
    .map(({ venue }) => venue);

  return scoredVenues;
}

/**
 * Calculate expected revenue for a show based on deal structure
 */
export function calculateShowRevenue(
  venue: Venue,
  expectedAttendance: number,
  ticketPrice: number,
  dealStructure: DealStructure,
  guarantee?: number,
  doorSplit?: number
): number {
  const grossRevenue = expectedAttendance * ticketPrice;

  switch (dealStructure) {
    case 'guarantee':
      // Artist gets guaranteed amount regardless of sales
      return guarantee || 0;

    case 'door-split':
      // Artist gets percentage of door after venue costs
      const split = doorSplit || venue.door_split_percentage || 80;
      return grossRevenue * (split / 100);

    case 'guarantee-plus':
      // Artist gets guarantee OR door split, whichever is higher
      const splitRevenue = grossRevenue * ((doorSplit || venue.door_split_percentage || 85) / 100);
      return Math.max(guarantee || 0, splitRevenue);

    case 'flat-fee':
      // Fixed payment (common for festivals, private events)
      return guarantee || 0;

    default:
      return 0;
  }
}

/**
 * Calculate fair musician rates based on venue tier and tour scope
 */
export function calculateMusicianPay(
  venueTier: VenueTier,
  tourLength: number, // number of shows
  role: string,
  isCoreMember: boolean = false
): number {
  // Find the role in our database
  const roleData = MUSICIAN_RATES.find(r => 
    r.role.toLowerCase().includes(role.toLowerCase())
  );

  if (!roleData) {
    // Default fallback
    return 150;
  }

  // Calculate base rate based on venue tier
  const tierMultipliers: Record<VenueTier, number> = {
    'dive-bar': 0.5,
    'club': 0.7,
    'mid-size': 0.85,
    'theater': 1.0,
    'arena': 1.3,
    'festival': 0.9 // Festivals often pay flat fees
  };

  const multiplier = tierMultipliers[venueTier];
  const range = roleData.rate_max - roleData.rate_min;
  let baseRate = roleData.rate_min + (range * multiplier);

  // Adjust for tour length (longer tours = slight discount per show but more total pay)
  if (tourLength >= 20) {
    baseRate *= 0.95; // 5% discount for long tours
  } else if (tourLength >= 10) {
    baseRate *= 0.98; // 2% discount for medium tours
  }

  // Core members (band) get profit sharing, hired guns get higher guarantees
  if (!isCoreMember) {
    baseRate *= 1.1; // 10% premium for session musicians
  }

  return Math.round(baseRate);
}

/**
 * Calculate tour expenses for a show
 */
export function calculateShowExpenses(
  venueTier: VenueTier,
  bandSize: number,
  hasCrew: boolean,
  distanceFromPreviousShow: number, // miles
  requiresHotel: boolean
): TourExpense[] {
  const expenses: TourExpense[] = [];
  const uid = () => Math.random().toString(36).slice(2, 9);

  // Transportation
  if (distanceFromPreviousShow > 0) {
    const gasCost = distanceFromPreviousShow * TOUR_EXPENSE_STANDARDS.transport.gas_per_mile;
    expenses.push({
      id: uid(),
      category: 'transport',
      description: `Gas (${distanceFromPreviousShow} miles)`,
      cost_per_show: gasCost,
      notes: `$${TOUR_EXPENSE_STANDARDS.transport.gas_per_mile}/mile`
    });

    // Van rental (amortized per show)
    expenses.push({
      id: uid(),
      category: 'transport',
      description: 'Van rental (daily)',
      cost_per_show: TOUR_EXPENSE_STANDARDS.transport.van_rental_per_day,
    });
  }

  // Lodging
  if (requiresHotel) {
    const hotelTier = venueTier === 'arena' || venueTier === 'theater' ? 'comfort' : 
                      venueTier === 'mid-size' ? 'mid' : 'budget';
    const roomsNeeded = Math.ceil(bandSize / 2); // 2 per room
    const hotelCost = roomsNeeded * TOUR_EXPENSE_STANDARDS.hotel[hotelTier];
    
    expenses.push({
      id: uid(),
      category: 'lodging',
      description: `Hotel (${roomsNeeded} rooms)`,
      cost_per_show: hotelCost,
      notes: `${hotelTier} tier, 2 per room`
    });
  }

  // Per diems
  const perDiemRate = requiresHotel ? 
    TOUR_EXPENSE_STANDARDS.per_diem.national : 
    TOUR_EXPENSE_STANDARDS.per_diem.regional;
  
  expenses.push({
    id: uid(),
    category: 'food',
    description: `Per diems (${bandSize} people)`,
    cost_per_show: perDiemRate * bandSize,
    notes: `$${perDiemRate} per person`
  });

  // Production/backline rental if needed
  if (venueTier === 'mid-size' || venueTier === 'theater' || venueTier === 'arena') {
    expenses.push({
      id: uid(),
      category: 'gear',
      description: 'Backline rental',
      cost_per_show: TOUR_EXPENSE_STANDARDS.production.backline_rental_per_show,
      notes: 'Amps, drums, keys'
    });
  }

  // Merch table fee
  expenses.push({
    id: uid(),
    category: 'misc',
    description: 'Merch table fee',
    cost_per_show: TOUR_EXPENSE_STANDARDS.production.merch_table_fee,
  });

  return expenses;
}

/**
 * Generate a complete tour budget projection
 */
export function generateTourBudget(
  venues: Venue[],
  bandMembers: BandMember[],
  expectedAttendances: number[],
  ticketPrices: number[],
  dealStructures: DealStructure[],
  guarantees?: number[],
  doorSplits?: number[]
): {
  shows: TourShow[];
  totalRevenue: number;
  totalExpenses: number;
  totalMusicianPay: number;
  netProfit: number;
  profitMargin: number;
} {
  const shows: TourShow[] = [];
  let totalRevenue = 0;
  let totalExpenses = 0;

  venues.forEach((venue, i) => {
    const attendance = expectedAttendances[i] || Math.floor(venue.capacity * 0.7);
    const ticketPrice = ticketPrices[i] || venue.avg_ticket_price;
    const dealStructure = dealStructures[i] || 'door-split';
    const guarantee = guarantees?.[i];
    const doorSplit = doorSplits?.[i];

    // Calculate revenue
    const revenue = calculateShowRevenue(
      venue,
      attendance,
      ticketPrice,
      dealStructure,
      guarantee,
      doorSplit
    );

    // Calculate expenses
    const distanceFromPrevious = i > 0 ? 250 : 0; // Simplified: assume 250 miles between shows
    const requiresHotel = i > 0; // First show is local, rest need hotels
    
    const expenses = calculateShowExpenses(
      venue.tier,
      bandMembers.length,
      true, // has crew
      distanceFromPrevious,
      requiresHotel
    );

    const showExpenses = expenses.reduce((sum, exp) => 
      sum + (exp.cost_per_show || 0), 0
    );

    shows.push({
      id: `show-${i + 1}`,
      venue_id: venue.id,
      venue_name: venue.name,
      city: venue.city,
      state: venue.state,
      capacity: venue.capacity,
      expected_attendance: attendance,
      ticket_price: ticketPrice,
      deal_structure: dealStructure,
      guarantee,
      door_split: doorSplit,
      projected_revenue: revenue,
      expenses,
      total_expenses: showExpenses,
      net_profit: revenue - showExpenses
    });

    totalRevenue += revenue;
    totalExpenses += showExpenses;
  });

  // Calculate total musician pay
  const totalMusicianPay = bandMembers.reduce((sum, member) => 
    sum + member.total_pay, 0
  );

  const netProfit = totalRevenue - totalExpenses - totalMusicianPay;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  return {
    shows,
    totalRevenue,
    totalExpenses,
    totalMusicianPay,
    netProfit,
    profitMargin
  };
}

/**
 * Recommend fair pay structure for band members
 */
export function recommendBandPay(
  totalRevenue: number,
  totalExpenses: number,
  bandMembers: BandMember[],
  leaderPercentage: number = 40 // Leader/artist gets 40% of net
): BandMember[] {
  const netRevenue = Math.max(0, totalRevenue - totalExpenses);
  
  // Profit-sharing model
  const leaderPay = netRevenue * (leaderPercentage / 100);
  const remainingForBand = netRevenue - leaderPay;
  
  // Core members split remaining (exclude leader who already got their cut)
  const coreMembers = bandMembers.filter(m => m.is_core_member && m.role !== 'Leader');
  const payPerCoreMember = coreMembers.length > 0 ? remainingForBand / coreMembers.length : 0;

  return bandMembers.map(member => {
    if (member.role === 'Leader') {
      return { ...member, total_pay: Math.round(leaderPay) };
    } else if (member.is_core_member) {
      return { ...member, total_pay: Math.round(payPerCoreMember) };
    } else {
      // Session musicians already have their rates calculated
      return member;
    }
  });
}
