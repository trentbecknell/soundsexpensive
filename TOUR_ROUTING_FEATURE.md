# Tour Routing Intelligence Feature

## Overview
Added intelligent tour routing analysis to help artists plan efficient regional tours with realistic drive logistics and route optimization.

## New Capabilities

### Regional Corridor Detection
- **8 Regional Corridors Defined**:
  - Midwest (Cincinnati, Columbus, Indianapolis, Louisville, Cleveland, Pittsburgh, Milwaukee, Minneapolis, Chicago, St. Louis, Kansas City)
  - Southeast (Nashville, Atlanta, Asheville, Carrboro, Raleigh, Charlotte, Richmond)
  - Northeast (NYC, Brooklyn, Pittsburgh, Philadelphia, Boston, Washington)
  - Texas (Austin, Dallas, Houston, San Antonio)
  - Pacific Northwest (Seattle, Portland)
  - Southwest (Denver, Phoenix, Albuquerque, Salt Lake City)
  - West Coast (LA, SF, Oakland, San Diego, Portland, Seattle)
  - Deep South (New Orleans, Birmingham, Memphis, Little Rock, Jackson)

### Routing Analysis
- **Total Mileage Calculation**: Estimates driving distance between consecutive tour stops
- **Regional Cohesion Detection**: Identifies when all shows are in one corridor vs multi-region tours
- **Efficiency Warnings**: Flags tours exceeding 3,000 total miles
- **Long Drive Alerts**: Warns about individual drives over 500 miles that need day-offs or fly dates
- **Tour Leg Recommendations**: Suggests splitting multi-region tours into separate legs

### Distance Estimation
Currently using simplified distance matrix for common routes:
- Cincinnati ↔ Columbus: 110 miles
- Cincinnati ↔ Indianapolis: 110 miles
- Cincinnati ↔ Louisville: 100 miles
- Cincinnati ↔ Cleveland: 250 miles
- Cincinnati ↔ Pittsburgh: 290 miles
- Cincinnati ↔ Nashville: 280 miles
- Columbus ↔ Cleveland: 145 miles
- Columbus ↔ Pittsburgh: 185 miles
- Indianapolis ↔ Louisville: 115 miles
- Indianapolis ↔ Chicago: 185 miles
- And more...

Default fallback: 250 miles for unknown routes

## UI Integration

### Budget Tab Enhancements
New "Tour Routing" section displays when 2+ shows are selected:
- **Total Distance**: Miles across entire tour
- **Regional Analysis**: Corridor groupings and efficiency metrics
- **Routing Recommendations**: Actionable insights for optimization

### Example Output
```
Tour Routing
Total Distance: 1,240 miles

• ✓ All shows in Midwest corridor - efficient regional tour
• ✓ Low mileage (1,240 miles) - efficient routing
```

Or for inefficient tours:
```
Tour Routing
Total Distance: 4,580 miles

• ⚠ Shows span 3 regions: Midwest, Southeast, West Coast
• Consider splitting into separate tour legs to minimize drive time
• ⚠ High total mileage (4,580 miles) - consider fly dates or split legs
• ⚠ Long drive: Nashville → Los Angeles (~2,100 mi) - consider day off or fly
```

## Example Use Cases

### Efficient Midwest Run
Cincinnati → Columbus → Cleveland → Pittsburgh → Indianapolis → Louisville
- **Total**: ~900 miles
- **Feedback**: "All shows in Midwest corridor - efficient regional tour"
- **Result**: Manageable drives, low gas costs, logical routing

### Inefficient Multi-Region Tour
Cincinnati → Austin → Seattle → New York → Miami
- **Total**: ~5,200 miles
- **Feedback**: "Shows span 5 regions" + "High total mileage" + multiple long drive warnings
- **Suggestion**: Split into Midwest leg, Texas leg, East Coast leg

### Cincinnati Regional Tour Example
Perfect example of mid-market corridor routing:
1. **Cincinnati** (MOTR Pub) - Start hometown
2. **Columbus** (Rumba Cafe) - 110 mi, 1.5hr drive
3. **Cleveland** (Grog Shop) - 145 mi from Columbus
4. **Pittsburgh** (Mr. Small's) - 130 mi from Cleveland
5. **Indianapolis** (Hi-Fi) - 290 mi from Pittsburgh
6. **Louisville** (Zanzabar) - 115 mi from Indy
7. Back to **Cincinnati** - 100 mi from Louisville

**Total**: ~890 miles over 7 shows = ideal weekend run

## Technical Implementation

### New Functions (`src/lib/tourPlanning.ts`)

#### `getRegionalCorridor(city: string): string | null`
Returns the regional corridor name for a given city.

#### `estimateDrivingDistance(city1, state1, city2, state2): number`
Returns approximate driving miles between two cities using distance matrix lookup.

#### `suggestTourRouting(venues: Venue[])`
Analyzes tour routing and returns:
```typescript
{
  optimizedOrder: Venue[];      // Same order for now (optimization coming)
  totalMiles: number;            // Sum of all drives
  recommendations: string[];     // Actionable routing insights
}
```

### Integration Points
- **TourPlanner Component**: Added `routingSuggestions` computed property
- **Budget Tab UI**: New routing section renders when `recommendations.length > 0`
- **Styling**: Uses primary-700 border and primary-900/10 background for routing card

## Future Enhancements

### Phase 2: Actual Route Optimization
- Implement traveling salesman algorithm for optimal show ordering
- Return genuinely optimized sequence rather than preserving user order
- Calculate savings from optimized vs current routing

### Phase 3: Real Routing Data
- Integrate Google Maps Distance Matrix API or similar
- Use actual driving times instead of mileage estimates
- Account for traffic, road conditions, mountain passes

### Phase 4: Advanced Logistics
- Suggest optimal day-off placement for long drives
- Recommend hotel locations between shows
- Calculate gas costs based on vehicle type
- Factor in toll roads and border crossings

### Phase 5: Multi-Leg Tour Planning
- Automatic tour leg segmentation by region
- Fly date recommendations with cost estimates
- Festival anchor points (build regional runs around festival dates)

## Testing Scenarios

### Test 1: Midwest Corridor
Select venues: Cincinnati (Bogart's), Columbus (Newport), Indianapolis (Egyptian Room), Louisville (Mercury Ballroom)
- **Expected**: "All shows in Midwest corridor"
- **Expected**: Total < 600 miles
- **Expected**: No warnings

### Test 2: Cross-Country Disaster
Select: Seattle (Crocodile), Denver (Bluebird), Nashville (Exit/In), New York (Bowery)
- **Expected**: "Shows span 4 regions"
- **Expected**: Total > 4,000 miles
- **Expected**: Multiple long drive warnings
- **Expected**: Suggestion to split into legs

### Test 3: Southeast Swing
Select: Nashville (Basement), Atlanta (Terminal West), Asheville (Grey Eagle), Charlotte (Neighborhood)
- **Expected**: "All shows in Southeast corridor"
- **Expected**: Total 500-800 miles
- **Expected**: Efficient routing confirmation

## Data Requirements
The routing intelligence relies on the expanded venue database which now includes:
- 72+ venues across 25+ cities
- Geographic diversity (major metros + mid-markets)
- Regional corridor representation in all 8 zones

## Documentation Updates
- Added routing examples to README
- Updated LIVE_PERFORMANCE_MODULE.md with routing section
- This document serves as feature specification

## Release Version
- **Feature**: Tour Routing Intelligence
- **Version**: 1.3.3+
- **Status**: ✅ Live in production
- **Commit**: `feat(live): add intelligent tour routing with regional corridor analysis`
