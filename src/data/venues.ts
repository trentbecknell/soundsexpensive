/**
 * Venue Database & Fair Rate Standards
 * 
 * Real-world venue data, typical guarantees, and AFM union rate guidance
 */

import { Venue, MusicianRole } from '../types/livePerformance';

/**
 * Venue Database - Representative venues across tiers
 * Based on real industry data from booking agents and venue calendars
 */
export const VENUE_DATABASE: Venue[] = [
  // DIVE BARS & SMALL CLUBS (50-200 capacity)
  {
    id: 'v001',
    name: 'The Basement',
    city: 'Nashville',
    state: 'TN',
    tier: 'dive-bar',
    capacity: 100,
    typical_guarantee_min: 0,
    typical_guarantee_max: 300,
    door_split_percentage: 80, // Artist gets 80% after sound guy
    avg_ticket_price: 10,
    requires_draw: 30,
    genres: ['rock', 'indie', 'punk', 'folk'],
    notes: 'Door deal, artist keeps merch. Good for building local following.'
  },
  {
    id: 'v002',
    name: 'Hotel Cafe',
    city: 'Los Angeles',
    state: 'CA',
    tier: 'dive-bar',
    capacity: 165,
    typical_guarantee_min: 0,
    typical_guarantee_max: 500,
    door_split_percentage: 85,
    avg_ticket_price: 15,
    requires_draw: 50,
    genres: ['singer-songwriter', 'indie', 'folk'],
    notes: 'Industry room. Great for showcases.'
  },
  
  // CLUBS (200-500 capacity)
  {
    id: 'v003',
    name: 'Bowery Ballroom',
    city: 'New York',
    state: 'NY',
    tier: 'club',
    capacity: 575,
    typical_guarantee_min: 1500,
    typical_guarantee_max: 3500,
    door_split_percentage: 85,
    avg_ticket_price: 25,
    requires_draw: 350,
    genres: ['indie', 'rock', 'electronic', 'hip-hop'],
    notes: 'Prestigious NYC room. Strong guarantee vs. 85/15 split.'
  },
  {
    id: 'v004',
    name: 'Exit/In',
    city: 'Nashville',
    state: 'TN',
    tier: 'club',
    capacity: 500,
    typical_guarantee_min: 1000,
    typical_guarantee_max: 2500,
    avg_ticket_price: 20,
    requires_draw: 300,
    genres: ['rock', 'indie', 'country', 'americana'],
    notes: 'Historic Nashville venue. Good for regional touring acts.'
  },
  {
    id: 'v005',
    name: 'The Independent',
    city: 'San Francisco',
    state: 'CA',
    tier: 'club',
    capacity: 500,
    typical_guarantee_min: 1200,
    typical_guarantee_max: 3000,
    avg_ticket_price: 25,
    requires_draw: 300,
    genres: ['indie', 'rock', 'electronic'],
    notes: 'Premier SF club. Good sound and professional staff.'
  },

  // MID-SIZE VENUES (500-1500 capacity)
  {
    id: 'v006',
    name: 'The Fonda Theatre',
    city: 'Los Angeles',
    state: 'CA',
    tier: 'mid-size',
    capacity: 1200,
    typical_guarantee_min: 3500,
    typical_guarantee_max: 8000,
    avg_ticket_price: 35,
    requires_draw: 700,
    genres: ['rock', 'indie', 'hip-hop', 'electronic'],
    notes: 'Step-up room for growing acts. Good production.'
  },
  {
    id: 'v007',
    name: 'The Fillmore',
    city: 'San Francisco',
    state: 'CA',
    tier: 'mid-size',
    capacity: 1315,
    typical_guarantee_min: 4000,
    typical_guarantee_max: 10000,
    avg_ticket_price: 40,
    requires_draw: 800,
    genres: ['rock', 'indie', 'jam', 'soul'],
    notes: 'Legendary venue. Great for established touring acts.'
  },
  {
    id: 'v008',
    name: 'Brooklyn Steel',
    city: 'Brooklyn',
    state: 'NY',
    tier: 'mid-size',
    capacity: 1800,
    typical_guarantee_min: 5000,
    typical_guarantee_max: 12000,
    avg_ticket_price: 35,
    requires_draw: 1000,
    genres: ['indie', 'electronic', 'hip-hop'],
    notes: 'Modern venue with excellent production capabilities.'
  },

  // THEATERS (1500-3500 capacity)
  {
    id: 'v009',
    name: 'The Wiltern',
    city: 'Los Angeles',
    state: 'CA',
    tier: 'theater',
    capacity: 2300,
    typical_guarantee_min: 10000,
    typical_guarantee_max: 25000,
    avg_ticket_price: 50,
    requires_draw: 1500,
    genres: ['rock', 'indie', 'R&B', 'hip-hop'],
    notes: 'Historic theater. Reserved seating available.'
  },
  {
    id: 'v010',
    name: 'House of Blues',
    city: 'Chicago',
    state: 'IL',
    tier: 'theater',
    capacity: 1800,
    typical_guarantee_min: 7500,
    typical_guarantee_max: 15000,
    avg_ticket_price: 45,
    requires_draw: 1200,
    genres: ['rock', 'blues', 'R&B', 'country'],
    notes: 'Corporate venue with strong marketing support.'
  },

  // ARENAS (3500+ capacity)
  {
    id: 'v011',
    name: 'Red Rocks Amphitheatre',
    city: 'Morrison',
    state: 'CO',
    tier: 'arena',
    capacity: 9525,
    typical_guarantee_min: 50000,
    typical_guarantee_max: 150000,
    avg_ticket_price: 75,
    requires_draw: 6000,
    genres: ['rock', 'electronic', 'jam', 'indie'],
    notes: 'Iconic outdoor venue. Major bucket list room for artists.'
  },
  {
    id: 'v012',
    name: 'The Forum',
    city: 'Inglewood',
    state: 'CA',
    tier: 'arena',
    capacity: 17500,
    typical_guarantee_min: 100000,
    typical_guarantee_max: 300000,
    avg_ticket_price: 85,
    requires_draw: 12000,
    genres: ['hip-hop', 'R&B', 'pop', 'rock'],
    notes: 'Premium LA arena. Requires strong ticket sales history.'
  },

  // FESTIVALS
  {
    id: 'v013',
    name: 'Bonnaroo (Club Stage)',
    city: 'Manchester',
    state: 'TN',
    tier: 'festival',
    capacity: 2500,
    typical_guarantee_min: 5000,
    typical_guarantee_max: 15000,
    avg_ticket_price: 0, // Festival pass
    requires_draw: 0, // Curated lineup
    genres: ['indie', 'rock', 'electronic', 'hip-hop'],
    notes: 'Emerging artist stage. Great exposure, moderate pay.'
  },
  {
    id: 'v014',
    name: 'Coachella (Gobi Tent)',
    city: 'Indio',
    state: 'CA',
    tier: 'festival',
    capacity: 4500,
    typical_guarantee_min: 15000,
    typical_guarantee_max: 50000,
    avg_ticket_price: 0,
    requires_draw: 0,
    genres: ['indie', 'electronic', 'hip-hop', 'rock'],
    notes: 'Premier festival slot. Strong career boost.'
  }
];

/**
 * Fair Musician Rates
 * Based on AFM (American Federation of Musicians) union scale + regional market data
 * Updated 2025
 */
export const MUSICIAN_RATES: MusicianRole[] = [
  // BAND MEMBERS (per show rates)
  {
    role: 'Lead Guitar / Keys / Bass',
    rate_type: 'per_show',
    rate_min: 100,
    rate_max: 500,
    description: 'Session/hired musicians for club-level shows. $100-150 for local, $200-300 regional, $400-500 national tours.'
  },
  {
    role: 'Drummer',
    rate_type: 'per_show',
    rate_min: 125,
    rate_max: 600,
    description: 'Drummers typically get 10-20% more due to gear. Higher rates for complex setups or national tours.'
  },
  {
    role: 'Background Vocals',
    rate_type: 'per_show',
    rate_min: 75,
    rate_max: 400,
    description: 'BGVs for live performance. Lower end for local shows, higher for touring with harmonies/featured parts.'
  },
  {
    role: 'Horn Section (per musician)',
    rate_type: 'per_show',
    rate_min: 150,
    rate_max: 500,
    description: 'Trumpet, sax, trombone. Premium rates for skilled players and charts/arrangements.'
  },

  // PRODUCTION & CREW (per show or weekly)
  {
    role: 'Front of House Engineer',
    rate_type: 'per_show',
    rate_min: 150,
    rate_max: 800,
    description: 'Sound engineer. $150-250 for clubs, $400-800 for theaters/arenas with complex productions.'
  },
  {
    role: 'Monitor Engineer',
    rate_type: 'per_show',
    rate_min: 125,
    rate_max: 600,
    description: 'In-ear/wedge monitoring. Needed for mid-size venues and up.'
  },
  {
    role: 'Lighting Designer',
    rate_type: 'per_show',
    rate_min: 100,
    rate_max: 500,
    description: 'LD for programmed shows. Higher rates for creative design and operation.'
  },
  {
    role: 'Tour Manager',
    rate_type: 'weekly',
    rate_min: 800,
    rate_max: 3000,
    description: 'Handles logistics, settlements, travel. Essential for tours 10+ shows. $800-1200 club level, $1500-3000 theater+.'
  },
  {
    role: 'Backline Tech',
    rate_type: 'per_show',
    rate_min: 100,
    rate_max: 400,
    description: 'Guitar/bass/drum tech. Maintains and sets up gear. Critical for reliability on tour.'
  },

  // OPENING ACT RATES
  {
    role: 'Opening Act (Local)',
    rate_type: 'per_show',
    rate_min: 0,
    rate_max: 300,
    description: 'Local openers often play for exposure or a small fee. $100-300 is fair for established local acts.'
  },
  {
    role: 'Opening Act (Regional Touring)',
    rate_type: 'per_show',
    rate_min: 300,
    rate_max: 1500,
    description: 'Touring support acts. Should cover basic expenses. Higher for co-headlining tours.'
  }
];

/**
 * Tour Expense Standards
 * Industry averages for budgeting
 */
export const TOUR_EXPENSE_STANDARDS = {
  // Per person per day
  per_diem: {
    local: 25,      // Day shows, no hotel
    regional: 35,   // 2-4 hour drives
    national: 50,   // Full touring
    international: 75
  },

  // Lodging per night
  hotel: {
    budget: 80,     // Motel 6, shared rooms
    mid: 120,       // Holiday Inn, 2 per room
    comfort: 200,   // Individual rooms, nicer hotels
    premium: 300    // Major markets, quality rest
  },

  // Transportation
  transport: {
    van_rental_per_day: 100,
    trailer_rental_per_day: 50,
    gas_per_mile: 0.25,
    tour_bus_per_day: 1200,  // Sleeper bus for larger tours
    flights_avg: 300          // Per person for fly dates
  },

  // Gear & Production
  production: {
    backline_rental_per_show: 200,  // Amps, drums, keys if not bringing own
    lighting_rental_per_show: 300,
    sound_rental_per_show: 400,
    merch_table_fee: 50             // Venue fee for selling merch
  }
};
