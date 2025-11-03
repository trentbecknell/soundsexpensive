# Live Performance Planning Module

## Overview
Complete tour planning system helping artists book appropriate venues, budget accurately, and pay their team fairly based on industry standards.

## Features

### 1. Venue Database & Matching
- **14+ Real Venues** across all capacity tiers:
  - Dive Bars/Small Clubs (50-200 capacity): The Basement (Nashville), Hotel Cafe (LA)
  - Clubs (200-500): Bowery Ballroom (NYC), Exit/In (Nashville), The Independent (SF)
  - Mid-Size (500-1500): The Fonda (LA), The Fillmore (SF), Brooklyn Steel (NY)
  - Theaters (1500-3500): The Wiltern (LA), House of Blues (Chicago)
  - Arenas (3500+): Red Rocks (CO), The Forum (LA)
  - Festivals: Bonnaroo, Coachella

- **Smart Venue Matching**: Recommends venues based on:
  - Artist's current stage (Emerging → Developing → Established → Breakout)
  - Estimated draw (audience size artist can pull)
  - Genre compatibility
  - Target cities/markets

- **Real Deal Structures**:
  - Door splits (artist gets 80-85% after venue costs)
  - Guaranteed minimums
  - Guarantee-plus (guarantee OR door split, whichever is higher)
  - Flat fees (festivals, private events)

### 2. Fair Musician Rates (AFM Union Scale + Industry Standards)

**Session Musicians (per show):**
- Lead Guitar/Keys/Bass: $100-500 (local to national tours)
- Drummer: $125-600 (premium for gear requirements)
- Background Vocals: $75-400
- Horn Section: $150-500 per musician

**Production & Crew:**
- Front of House Engineer: $150-800
- Monitor Engineer: $125-600
- Lighting Designer: $100-500
- Tour Manager: $800-3000/week
- Backline Tech: $100-400

**Rates adjust based on:**
- Venue tier (dive bar → arena multipliers)
- Tour length (volume discounts for 10+ shows)
- Core members vs. session musicians
- Geographic region

### 3. Tour Budget Calculator

**Revenue Projections:**
- Per-show ticket revenue based on capacity & expected attendance
- Deal structure calculations (door split, guarantee, etc.)
- Total tour revenue across all shows

**Comprehensive Expense Tracking:**
- **Transportation**: Van/trailer rental, gas ($0.25/mile), tour bus ($1200/day)
- **Lodging**: Budget ($80/night), Mid ($120), Comfort ($200), Premium ($300)
- **Per Diems**: $25-75/person/day (local to international)
- **Production**: Backline rental ($200/show), lighting, sound
- **Merch table fees**: $50/show typical
- **Distance-based calculations**: Estimates fuel & hotel needs based on routing

**Show-by-Show Breakdown:**
- Revenue vs. expenses for each venue
- Profit/loss per show
- Cumulative tour financials
- Fill rate projections (attendance/capacity)

### 4. Fair Pay Recommendations

**Core Band Members:**
- Leader/Artist: 40% of net revenue (default)
- Core members: Equal split of remaining net
- Profit-sharing model (not per-show rates)

**Session Musicians:**
- Guaranteed per-show rates based on venue tier
- 10% premium over core member equivalent rates
- Rates scale with tour scope

**Warnings & Guidance:**
- Alerts when tour is unprofitable
- Suggestions to reduce costs (share hotels, negotiate rates)
- Recommendations to build draw before booking larger venues

## User Experience

### Three-Step Process:
1. **Venues Tab**: Browse and select recommended venues for your tour
2. **Band & Crew Tab**: Build your team with core members and session musicians
3. **Budget Tab**: Review complete financial projections and profitability

### Smart Defaults:
- Venue capacity matches artist's estimated draw
- Deal structures appropriate for venue tier (door splits for small clubs, guarantees for larger rooms)
- Expense estimates based on realistic tour logistics
- 75% fill rate projections (conservative but achievable)

## Data Sources & Accuracy

- Venue capacities, locations, and typical deals based on publicly available booking data
- AFM (American Federation of Musicians) union scale rates (2025)
- Regional market rates from booking agents and tour managers
- Industry standard per diems and expense multipliers
- Real-world deal structures from promoters and venue contracts

## Navigation

Access via **🎸 Live** tab in main navigation. Feature integrated with artist profile:
- Uses artist's stage level for venue recommendations
- Pulls genres for venue matching
- Stores estimated draw persistently
- Works seamlessly with multi-artist portfolio management

## Technical Implementation

**Files:**
- `src/types/livePerformance.ts` - Type definitions
- `src/data/venues.ts` - Venue database & rate standards
- `src/lib/tourPlanning.ts` - Business logic & calculations
- `src/components/TourPlanner.tsx` - Interactive UI component

**Key Functions:**
- `matchVenuesToArtist()` - Intelligent venue recommendations
- `calculateShowRevenue()` - Deal structure calculations
- `calculateMusicianPay()` - Fair rate computation
- `generateTourBudget()` - Complete tour financial projections
- `recommendBandPay()` - Profit-sharing distribution

## Example Use Case

**Scenario**: Developing indie rock artist with 300-person draw planning 10-show regional tour

**System Recommends:**
- Club tier venues (400-600 capacity)
- Guarantee-plus deals ($1500 minimum or 85% door)
- 5-piece band (artist + 4 core members)
- FOH engineer + backline tech
- Budget hotels (2 per room)
- $35/person per diems

**Projected Outcome:**
- Total Revenue: $18,500
- Tour Expenses: $7,200
- Musician Pay: $8,500 (artist takes 40% = $3,400, others split $5,100)
- Net Profit: $2,800 (15% margin)

Artist can see this is viable, sustainable, and pays everyone fairly.

## Future Enhancements
- Routing optimization (minimize drive time & gas)
- Historical venue data (previous artist performances)
- Merch revenue projections
- Sponsorship/grant integration
- Multi-leg tour support (US, EU, Asia)
- Opening act budget splits
