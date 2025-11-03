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

  // CINCINNATI, OH - Key Midwest Market
  {
    id: 'v015',
    name: 'MOTR Pub',
    city: 'Cincinnati',
    state: 'OH',
    tier: 'dive-bar',
    capacity: 150,
    typical_guarantee_min: 0,
    typical_guarantee_max: 300,
    door_split_percentage: 80,
    avg_ticket_price: 10,
    requires_draw: 40,
    genres: ['indie', 'rock', 'punk', 'folk', 'americana'],
    notes: 'OTR (Over-the-Rhine) venue. Great local scene. Door deal + free beer.'
  },
  {
    id: 'v016',
    name: 'The Southgate House Revival',
    city: 'Newport',
    state: 'KY',
    tier: 'club',
    capacity: 400,
    typical_guarantee_min: 500,
    typical_guarantee_max: 1500,
    avg_ticket_price: 18,
    requires_draw: 200,
    genres: ['indie', 'rock', 'metal', 'punk'],
    notes: 'Just across river from Cincy. Three rooms. Solid regional room.'
  },
  {
    id: 'v017',
    name: 'Bogart\'s',
    city: 'Cincinnati',
    state: 'OH',
    tier: 'mid-size',
    capacity: 1500,
    typical_guarantee_min: 3000,
    typical_guarantee_max: 7500,
    avg_ticket_price: 30,
    requires_draw: 800,
    genres: ['rock', 'indie', 'metal', 'hip-hop'],
    notes: 'Premier Cincy club. Step-up from Southgate. Strong local support.'
  },
  {
    id: 'v018',
    name: 'The Andrew J Brady Music Center',
    city: 'Cincinnati',
    state: 'OH',
    tier: 'theater',
    capacity: 2500,
    typical_guarantee_min: 8000,
    typical_guarantee_max: 20000,
    avg_ticket_price: 45,
    requires_draw: 1500,
    genres: ['rock', 'indie', 'country', 'R&B'],
    notes: 'Outdoor amphitheater. Summer season. Great for established acts.'
  },

  // COLUMBUS, OH - College town, strong indie scene
  {
    id: 'v019',
    name: 'Rumba Cafe',
    city: 'Columbus',
    state: 'OH',
    tier: 'dive-bar',
    capacity: 200,
    typical_guarantee_min: 0,
    typical_guarantee_max: 400,
    door_split_percentage: 85,
    avg_ticket_price: 12,
    requires_draw: 50,
    genres: ['indie', 'rock', 'electronic', 'hip-hop'],
    notes: 'Legendary dive. OSU student crowd. Great sound for size.'
  },
  {
    id: 'v020',
    name: 'A&R Music Bar',
    city: 'Columbus',
    state: 'OH',
    tier: 'club',
    capacity: 400,
    typical_guarantee_min: 600,
    typical_guarantee_max: 1800,
    avg_ticket_price: 20,
    requires_draw: 200,
    genres: ['indie', 'rock', 'punk', 'electronic'],
    notes: 'Short North district. Young professional crowd. Good bar sales.'
  },
  {
    id: 'v021',
    name: 'Newport Music Hall',
    city: 'Columbus',
    state: 'OH',
    tier: 'mid-size',
    capacity: 1700,
    typical_guarantee_min: 4000,
    typical_guarantee_max: 9000,
    avg_ticket_price: 32,
    requires_draw: 900,
    genres: ['rock', 'indie', 'metal', 'country'],
    notes: 'Historic venue. America\'s longest continually running rock club. Must-play Ohio room.'
  },

  // INDIANAPOLIS, IN - Crossroads of America
  {
    id: 'v022',
    name: 'Hi-Fi',
    city: 'Indianapolis',
    state: 'IN',
    tier: 'club',
    capacity: 450,
    typical_guarantee_min: 700,
    typical_guarantee_max: 2000,
    avg_ticket_price: 22,
    requires_draw: 225,
    genres: ['indie', 'rock', 'electronic', 'R&B'],
    notes: 'Fountain Square. Best sound in Indy. Newer room with strong booking.'
  },
  {
    id: 'v023',
    name: 'The Vogue',
    city: 'Indianapolis',
    state: 'IN',
    tier: 'mid-size',
    capacity: 900,
    typical_guarantee_min: 2500,
    typical_guarantee_max: 6000,
    avg_ticket_price: 28,
    requires_draw: 550,
    genres: ['indie', 'rock', 'electronic', 'hip-hop'],
    notes: 'Broad Ripple. Theater-style. Step-up room for growing regional acts.'
  },
  {
    id: 'v024',
    name: 'Egyptian Room at Old National Centre',
    city: 'Indianapolis',
    state: 'IN',
    tier: 'theater',
    capacity: 2500,
    typical_guarantee_min: 7500,
    typical_guarantee_max: 18000,
    avg_ticket_price: 42,
    requires_draw: 1500,
    genres: ['rock', 'indie', 'country', 'hip-hop'],
    notes: 'Historic theater downtown. Premium Indy room. Great acoustics.'
  },

  // LOUISVILLE, KY - Bourbon & Music
  {
    id: 'v025',
    name: 'Zanzabar',
    city: 'Louisville',
    state: 'KY',
    tier: 'dive-bar',
    capacity: 180,
    typical_guarantee_min: 0,
    typical_guarantee_max: 350,
    door_split_percentage: 80,
    avg_ticket_price: 12,
    requires_draw: 50,
    genres: ['indie', 'rock', 'punk', 'metal'],
    notes: 'Pinball + music. Highland area. Strong local support.'
  },
  {
    id: 'v026',
    name: 'Headliners Music Hall',
    city: 'Louisville',
    state: 'KY',
    tier: 'club',
    capacity: 600,
    typical_guarantee_min: 1000,
    typical_guarantee_max: 2500,
    avg_ticket_price: 20,
    requires_draw: 300,
    genres: ['rock', 'indie', 'country', 'bluegrass'],
    notes: 'Louisville staple. Good for regional and national acts. Solid draws.'
  },
  {
    id: 'v027',
    name: 'Mercury Ballroom',
    city: 'Louisville',
    state: 'KY',
    tier: 'mid-size',
    capacity: 1200,
    typical_guarantee_min: 3000,
    typical_guarantee_max: 7000,
    avg_ticket_price: 30,
    requires_draw: 700,
    genres: ['rock', 'indie', 'electronic', 'hip-hop'],
    notes: 'Downtown. Beautiful room. Premier Louisville venue.'
  },

  // PITTSBURGH, PA - Steel City
  {
    id: 'v028',
    name: 'Club Cafe',
    city: 'Pittsburgh',
    state: 'PA',
    tier: 'dive-bar',
    capacity: 200,
    typical_guarantee_min: 200,
    typical_guarantee_max: 500,
    door_split_percentage: 80,
    avg_ticket_price: 15,
    requires_draw: 60,
    genres: ['singer-songwriter', 'folk', 'indie', 'jazz'],
    notes: 'South Side. Listening room vibe. Seated shows work well.'
  },
  {
    id: 'v029',
    name: 'Mr. Smalls Theatre',
    city: 'Millvale',
    state: 'PA',
    tier: 'mid-size',
    capacity: 1000,
    typical_guarantee_min: 2500,
    typical_guarantee_max: 6500,
    avg_ticket_price: 28,
    requires_draw: 600,
    genres: ['rock', 'indie', 'punk', 'metal'],
    notes: 'Converted church. Unique space. Strong Pittsburgh following.'
  },
  {
    id: 'v030',
    name: 'Stage AE',
    city: 'Pittsburgh',
    state: 'PA',
    tier: 'theater',
    capacity: 2400,
    typical_guarantee_min: 7000,
    typical_guarantee_max: 17000,
    avg_ticket_price: 40,
    requires_draw: 1400,
    genres: ['rock', 'indie', 'country', 'electronic'],
    notes: 'Indoor/outdoor venue. North Shore. Premium Pittsburgh room.'
  },

  // CLEVELAND, OH - Rock Hall City
  {
    id: 'v031',
    name: 'Grog Shop',
    city: 'Cleveland Heights',
    state: 'OH',
    tier: 'dive-bar',
    capacity: 250,
    typical_guarantee_min: 0,
    typical_guarantee_max: 500,
    door_split_percentage: 80,
    avg_ticket_price: 15,
    requires_draw: 75,
    genres: ['indie', 'rock', 'punk', 'electronic'],
    notes: 'Coventry neighborhood. Cleveland indie staple since 1992.'
  },
  {
    id: 'v032',
    name: 'Beachland Ballroom',
    city: 'Cleveland',
    state: 'OH',
    tier: 'club',
    capacity: 500,
    typical_guarantee_min: 800,
    typical_guarantee_max: 2200,
    avg_ticket_price: 20,
    requires_draw: 250,
    genres: ['indie', 'rock', 'punk', 'americana'],
    notes: 'Two rooms (Ballroom + Tavern). Beloved local venue. Great vibe.'
  },
  {
    id: 'v033',
    name: 'House of Blues Cleveland',
    city: 'Cleveland',
    state: 'OH',
    tier: 'mid-size',
    capacity: 1200,
    typical_guarantee_min: 3000,
    typical_guarantee_max: 7500,
    avg_ticket_price: 35,
    requires_draw: 700,
    genres: ['rock', 'blues', 'R&B', 'hip-hop'],
    notes: 'Downtown. Corporate support. Good for established touring acts.'
  },

  // MILWAUKEE, WI - Brew City
  {
    id: 'v034',
    name: 'Cactus Club',
    city: 'Milwaukee',
    state: 'WI',
    tier: 'dive-bar',
    capacity: 250,
    typical_guarantee_min: 0,
    typical_guarantee_max: 400,
    door_split_percentage: 85,
    avg_ticket_price: 12,
    requires_draw: 70,
    genres: ['indie', 'punk', 'rock', 'electronic'],
    notes: 'Bay View. Milwaukee staple. Strong local scene.'
  },
  {
    id: 'v035',
    name: 'Turner Hall Ballroom',
    city: 'Milwaukee',
    state: 'WI',
    tier: 'mid-size',
    capacity: 1100,
    typical_guarantee_min: 2800,
    typical_guarantee_max: 6500,
    avg_ticket_price: 28,
    requires_draw: 650,
    genres: ['indie', 'rock', 'folk', 'electronic'],
    notes: 'Historic ballroom. Downtown. Beautiful space with great acoustics.'
  },
  {
    id: 'v036',
    name: 'The Rave / Eagles Club',
    city: 'Milwaukee',
    state: 'WI',
    tier: 'theater',
    capacity: 2500,
    typical_guarantee_min: 7000,
    typical_guarantee_max: 16000,
    avg_ticket_price: 38,
    requires_draw: 1500,
    genres: ['rock', 'metal', 'punk', 'hip-hop'],
    notes: 'Multi-room complex. Eagles Ballroom is main. Milwaukee institution.'
  },

  // MINNEAPOLIS, MN - Twin Cities powerhouse
  {
    id: 'v037',
    name: '7th St Entry',
    city: 'Minneapolis',
    state: 'MN',
    tier: 'dive-bar',
    capacity: 250,
    typical_guarantee_min: 0,
    typical_guarantee_max: 500,
    door_split_percentage: 80,
    avg_ticket_price: 15,
    requires_draw: 80,
    genres: ['indie', 'punk', 'rock', 'electronic'],
    notes: 'Attached to First Avenue. Launch pad for local acts.'
  },
  {
    id: 'v038',
    name: 'Turf Club',
    city: 'St. Paul',
    state: 'MN',
    tier: 'club',
    capacity: 350,
    typical_guarantee_min: 600,
    typical_guarantee_max: 1600,
    avg_ticket_price: 18,
    requires_draw: 180,
    genres: ['indie', 'rock', 'americana', 'punk'],
    notes: 'St. Paul institution. Great sound. Strong Twin Cities following.'
  },
  {
    id: 'v039',
    name: 'First Avenue',
    city: 'Minneapolis',
    state: 'MN',
    tier: 'mid-size',
    capacity: 1550,
    typical_guarantee_min: 4000,
    typical_guarantee_max: 9000,
    avg_ticket_price: 32,
    requires_draw: 900,
    genres: ['rock', 'indie', 'hip-hop', 'electronic'],
    notes: 'Prince\'s club. Iconic. Must-play Midwest room. Strong local support.'
  },

  // AUSTIN, TX - Live Music Capital
  {
    id: 'v040',
    name: 'Barracuda',
    city: 'Austin',
    state: 'TX',
    tier: 'dive-bar',
    capacity: 200,
    typical_guarantee_min: 0,
    typical_guarantee_max: 400,
    door_split_percentage: 80,
    avg_ticket_price: 12,
    requires_draw: 60,
    genres: ['punk', 'metal', 'indie', 'rock'],
    notes: 'Red River. Dive bar energy. Strong local punk/metal scene.'
  },
  {
    id: 'v041',
    name: 'Mohawk',
    city: 'Austin',
    state: 'TX',
    tier: 'club',
    capacity: 400,
    typical_guarantee_min: 700,
    typical_guarantee_max: 2000,
    avg_ticket_price: 20,
    requires_draw: 200,
    genres: ['indie', 'rock', 'punk', 'electronic'],
    notes: 'Red River. Indoor/outdoor. SXSW hub. Great for touring bands.'
  },
  {
    id: 'v042',
    name: 'Emo\'s',
    city: 'Austin',
    state: 'TX',
    tier: 'mid-size',
    capacity: 1100,
    typical_guarantee_min: 3000,
    typical_guarantee_max: 7000,
    avg_ticket_price: 28,
    requires_draw: 650,
    genres: ['indie', 'rock', 'punk', 'hip-hop'],
    notes: 'East Side. Outdoor courtyard. Austin staple. Strong draws.'
  },
  {
    id: 'v043',
    name: 'Stubb\'s BBQ',
    city: 'Austin',
    state: 'TX',
    tier: 'theater',
    capacity: 2200,
    typical_guarantee_min: 6500,
    typical_guarantee_max: 15000,
    avg_ticket_price: 40,
    requires_draw: 1300,
    genres: ['rock', 'indie', 'country', 'blues'],
    notes: 'Outdoor amphitheater. BBQ + music. Premier Austin venue.'
  },

  // PORTLAND, OR - Pacific Northwest
  {
    id: 'v044',
    name: 'Mississippi Studios',
    city: 'Portland',
    state: 'OR',
    tier: 'dive-bar',
    capacity: 200,
    typical_guarantee_min: 200,
    typical_guarantee_max: 600,
    door_split_percentage: 80,
    avg_ticket_price: 15,
    requires_draw: 70,
    genres: ['singer-songwriter', 'folk', 'indie', 'americana'],
    notes: 'N Mississippi. Listening room. Great sound. Seated/standing mix.'
  },
  {
    id: 'v045',
    name: 'Doug Fir Lounge',
    city: 'Portland',
    state: 'OR',
    tier: 'club',
    capacity: 375,
    typical_guarantee_min: 800,
    typical_guarantee_max: 2200,
    avg_ticket_price: 22,
    requires_draw: 200,
    genres: ['indie', 'rock', 'electronic', 'folk'],
    notes: 'Jupiter Hotel. Unique log cabin vibe. Portland institution.'
  },
  {
    id: 'v046',
    name: 'Wonder Ballroom',
    city: 'Portland',
    state: 'OR',
    tier: 'mid-size',
    capacity: 900,
    typical_guarantee_min: 2800,
    typical_guarantee_max: 6500,
    avg_ticket_price: 30,
    requires_draw: 550,
    genres: ['indie', 'rock', 'folk', 'electronic'],
    notes: 'Alberta Arts. Beautiful ballroom. Best mid-size Portland room.'
  },
  {
    id: 'v047',
    name: 'Crystal Ballroom',
    city: 'Portland',
    state: 'OR',
    tier: 'theater',
    capacity: 1500,
    typical_guarantee_min: 4500,
    typical_guarantee_max: 10000,
    avg_ticket_price: 35,
    requires_draw: 900,
    genres: ['rock', 'indie', 'electronic', 'jam'],
    notes: 'Famous floating dance floor. Historic. Portland landmark.'
  },

  // SEATTLE, WA - Grunge City
  {
    id: 'v050',
    name: 'The Crocodile',
    city: 'Seattle',
    state: 'WA',
    tier: 'club',
    capacity: 550,
    typical_guarantee_min: 1000,
    typical_guarantee_max: 2500,
    avg_ticket_price: 22,
    requires_draw: 280,
    genres: ['indie', 'rock', 'punk', 'grunge'],
    notes: 'Belltown. Nirvana played here. Seattle institution.'
  },
  {
    id: 'v051',
    name: 'Neumos',
    city: 'Seattle',
    state: 'WA',
    tier: 'mid-size',
    capacity: 650,
    typical_guarantee_min: 1500,
    typical_guarantee_max: 3500,
    avg_ticket_price: 25,
    requires_draw: 400,
    genres: ['indie', 'rock', 'electronic', 'hip-hop'],
    notes: 'Capitol Hill. Solid regional room. Step-up from Crocodile.'
  },
  {
    id: 'v052',
    name: 'The Showbox',
    city: 'Seattle',
    state: 'WA',
    tier: 'theater',
    capacity: 1150,
    typical_guarantee_min: 3500,
    typical_guarantee_max: 8000,
    avg_ticket_price: 35,
    requires_draw: 700,
    genres: ['rock', 'indie', 'hip-hop', 'R&B'],
    notes: 'Downtown. Historic theater. Premier Seattle venue.'
  },

  // DENVER, CO - Mile High
  {
    id: 'v053',
    name: 'Lost Lake Lounge',
    city: 'Denver',
    state: 'CO',
    tier: 'dive-bar',
    capacity: 200,
    typical_guarantee_min: 0,
    typical_guarantee_max: 400,
    door_split_percentage: 80,
    avg_ticket_price: 12,
    requires_draw: 60,
    genres: ['indie', 'punk', 'rock', 'metal'],
    notes: 'Colfax. Dive bar. Strong local scene. Good starting point.'
  },
  {
    id: 'v054',
    name: 'Larimer Lounge',
    city: 'Denver',
    state: 'CO',
    tier: 'club',
    capacity: 250,
    typical_guarantee_min: 400,
    typical_guarantee_max: 1200,
    avg_ticket_price: 15,
    requires_draw: 125,
    genres: ['indie', 'rock', 'punk', 'electronic'],
    notes: 'RiNo. Small but mighty. Launch pad for Denver bands.'
  },
  {
    id: 'v055',
    name: 'Bluebird Theater',
    city: 'Denver',
    state: 'CO',
    tier: 'mid-size',
    capacity: 550,
    typical_guarantee_min: 1200,
    typical_guarantee_max: 3000,
    avg_ticket_price: 25,
    requires_draw: 350,
    genres: ['indie', 'rock', 'folk', 'electronic'],
    notes: 'Colfax. Beautiful old theater. Denver favorite.'
  },
  {
    id: 'v056',
    name: 'Ogden Theatre',
    city: 'Denver',
    state: 'CO',
    tier: 'theater',
    capacity: 1600,
    typical_guarantee_min: 4500,
    typical_guarantee_max: 10000,
    avg_ticket_price: 38,
    requires_draw: 1000,
    genres: ['rock', 'indie', 'electronic', 'jam'],
    notes: 'Colfax. Historic. Step-up from Bluebird. Solid Denver room.'
  },

  // ATLANTA, GA - Southeast Hub
  {
    id: 'v057',
    name: 'The Earl',
    city: 'Atlanta',
    state: 'GA',
    tier: 'dive-bar',
    capacity: 250,
    typical_guarantee_min: 0,
    typical_guarantee_max: 500,
    door_split_percentage: 80,
    avg_ticket_price: 12,
    requires_draw: 80,
    genres: ['indie', 'punk', 'rock', 'garage'],
    notes: 'East Atlanta. Dive bar + restaurant. Strong local scene.'
  },
  {
    id: 'v058',
    name: 'Terminal West',
    city: 'Atlanta',
    state: 'GA',
    tier: 'mid-size',
    capacity: 850,
    typical_guarantee_min: 2200,
    typical_guarantee_max: 5500,
    avg_ticket_price: 28,
    requires_draw: 500,
    genres: ['indie', 'rock', 'electronic', 'R&B'],
    notes: 'West Midtown. Great sound. Premier Atlanta indie room.'
  },
  {
    id: 'v059',
    name: 'The Tabernacle',
    city: 'Atlanta',
    state: 'GA',
    tier: 'theater',
    capacity: 2600,
    typical_guarantee_min: 8000,
    typical_guarantee_max: 18000,
    avg_ticket_price: 45,
    requires_draw: 1600,
    genres: ['rock', 'indie', 'hip-hop', 'R&B'],
    notes: 'Downtown. Converted church. Atlanta landmark venue.'
  },

  // ASHEVILLE, NC - Mountain Music Town
  {
    id: 'v060',
    name: 'The Grey Eagle',
    city: 'Asheville',
    state: 'NC',
    tier: 'club',
    capacity: 320,
    typical_guarantee_min: 600,
    typical_guarantee_max: 1600,
    avg_ticket_price: 18,
    requires_draw: 180,
    genres: ['americana', 'folk', 'bluegrass', 'indie'],
    notes: 'West Asheville. Listening room. Great touring stop. Strong draws.'
  },
  {
    id: 'v061',
    name: 'The Orange Peel',
    city: 'Asheville',
    state: 'NC',
    tier: 'mid-size',
    capacity: 1050,
    typical_guarantee_min: 3000,
    typical_guarantee_max: 7000,
    avg_ticket_price: 30,
    requires_draw: 650,
    genres: ['rock', 'indie', 'jam', 'bluegrass'],
    notes: 'Downtown. Rolling Stone Best Club. Must-play Southeast venue.'
  },

  // RALEIGH/DURHAM, NC - Research Triangle
  {
    id: 'v062',
    name: 'Cat\'s Cradle',
    city: 'Carrboro',
    state: 'NC',
    tier: 'club',
    capacity: 750,
    typical_guarantee_min: 1500,
    typical_guarantee_max: 3500,
    avg_ticket_price: 22,
    requires_draw: 400,
    genres: ['indie', 'rock', 'punk', 'electronic'],
    notes: 'Chapel Hill area. Legendary indie room. Strong college crowd.'
  },
  {
    id: 'v063',
    name: 'Lincoln Theatre',
    city: 'Raleigh',
    state: 'NC',
    tier: 'mid-size',
    capacity: 1200,
    typical_guarantee_min: 3200,
    typical_guarantee_max: 7500,
    avg_ticket_price: 30,
    requires_draw: 700,
    genres: ['indie', 'rock', 'electronic', 'hip-hop'],
    notes: 'Downtown Raleigh. Renovated theater. Growing Triangle market.'
  },

  // RICHMOND, VA - East Coast Corridor
  {
    id: 'v064',
    name: 'Strange Matter',
    city: 'Richmond',
    state: 'VA',
    tier: 'dive-bar',
    capacity: 200,
    typical_guarantee_min: 0,
    typical_guarantee_max: 400,
    door_split_percentage: 80,
    avg_ticket_price: 10,
    requires_draw: 60,
    genres: ['punk', 'indie', 'rock', 'metal'],
    notes: 'VCU area. Dive bar. Strong local punk/indie scene.'
  },
  {
    id: 'v065',
    name: 'The National',
    city: 'Richmond',
    state: 'VA',
    tier: 'theater',
    capacity: 1500,
    typical_guarantee_min: 4000,
    typical_guarantee_max: 9000,
    avg_ticket_price: 32,
    requires_draw: 900,
    genres: ['indie', 'rock', 'electronic', 'hip-hop'],
    notes: 'Downtown. Historic theater. Premier Richmond room.'
  },

  // CHARLOTTE, NC - Queen City
  {
    id: 'v066',
    name: 'Snug Harbor',
    city: 'Charlotte',
    state: 'NC',
    tier: 'dive-bar',
    capacity: 200,
    typical_guarantee_min: 0,
    typical_guarantee_max: 350,
    door_split_percentage: 80,
    avg_ticket_price: 12,
    requires_draw: 60,
    genres: ['indie', 'punk', 'rock', 'metal'],
    notes: 'NoDa. Dive bar. Charlotte indie staple.'
  },
  {
    id: 'v067',
    name: 'The Fillmore Charlotte',
    city: 'Charlotte',
    state: 'NC',
    tier: 'theater',
    capacity: 2000,
    typical_guarantee_min: 6000,
    typical_guarantee_max: 14000,
    avg_ticket_price: 40,
    requires_draw: 1200,
    genres: ['rock', 'indie', 'country', 'R&B'],
    notes: 'Corporate venue. Good production. Growing Charlotte market.'
  },

  // KANSAS CITY, MO - BBQ & Jazz
  {
    id: 'v068',
    name: 'RecordBar',
    city: 'Kansas City',
    state: 'MO',
    tier: 'club',
    capacity: 350,
    typical_guarantee_min: 600,
    typical_guarantee_max: 1600,
    avg_ticket_price: 18,
    requires_draw: 180,
    genres: ['indie', 'rock', 'electronic', 'hip-hop'],
    notes: 'Crossroads. Great local support. KC indie room.'
  },
  {
    id: 'v069',
    name: 'The Truman',
    city: 'Kansas City',
    state: 'MO',
    tier: 'mid-size',
    capacity: 800,
    typical_guarantee_min: 2000,
    typical_guarantee_max: 5000,
    avg_ticket_price: 28,
    requires_draw: 500,
    genres: ['indie', 'rock', 'electronic', 'country'],
    notes: 'Grand Blvd. Beautifully renovated. Premier KC room.'
  },

  // ST. LOUIS, MO - Gateway City
  {
    id: 'v070',
    name: 'Off Broadway',
    city: 'St. Louis',
    state: 'MO',
    tier: 'club',
    capacity: 400,
    typical_guarantee_min: 700,
    typical_guarantee_max: 1800,
    avg_ticket_price: 20,
    requires_draw: 200,
    genres: ['indie', 'rock', 'punk', 'metal'],
    notes: 'South Grand. STL staple. Good touring room.'
  },
  {
    id: 'v071',
    name: 'The Pageant',
    city: 'St. Louis',
    state: 'MO',
    tier: 'theater',
    capacity: 2300,
    typical_guarantee_min: 6500,
    typical_guarantee_max: 15000,
    avg_ticket_price: 38,
    requires_draw: 1400,
    genres: ['rock', 'indie', 'country', 'jam'],
    notes: 'Delmar Loop. Historic. Premier St. Louis venue.'
  },

  // FESTIVALS
  {
    id: 'v048',
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
    id: 'v049',
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
