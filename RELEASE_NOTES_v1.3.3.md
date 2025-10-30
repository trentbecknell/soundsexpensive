# Release Notes v1.3.3 — Multi-Artist Portfolio Management

Release Date: October 30, 2025
Version: 1.3.3
Type: Major Feature Release

## Highlights
- New Portfolio system to manage 20+ artists
- Artist Comparison View with radar charts and investment readiness scoring
- Portfolio Analytics Dashboard with quality distribution, genre and stage breakdowns, and top performers
- Bulk Operations: select all, export selected to JSON, and delete with confirmation
- Backward compatible: automatic migration from single-artist data

## What’s New

### Portfolio Dashboard
- Grid and list views with quick stats
- Search by name/genre/city
- Filter by genre and stage (AND logic)
- Sort by name/date/stage/genre (asc/desc)
- Portfolio stats bar (total artists, analyzed, roadmaps, avg quality)

### Artist Comparison View
- Select 2–3 artists for side-by-side comparison
- Radar chart across six stage dimensions (Craft, Catalog, Brand, Team, Audience, Ops)
- Investment readiness algorithm (0–100): 60% stage, 20% quality, 20% completion bonuses
- Smart recommendations and quick insights

### Portfolio Analytics
- 7 aggregate stats (total artists, analyzed, avg quality, total tracks, avg identity consistency, roadmaps, release-ready)
- Quality distribution histogram
- Genre breakdown pie chart
- Stage distribution bar chart
- Top performers leaderboard

### Bulk Operations
- Toggle Bulk mode (orange)
- Checkbox selection per artist; Select All / Deselect All controls
- Bulk export to JSON (timestamped filename)
- Bulk delete with confirmation modal

## Improvements
- Portfolio tab shows only when there are 2+ artists (keeps single-artist UX simple)
- Artist Switcher in header for instant context switching
- useMemo optimizations for fast search/filter/sort
- Clear empty states and responsive mobile layouts

## Breaking Changes
None. Existing single-artist users are automatically migrated into a one-artist portfolio. No data loss.

## Migration Notes
- Data auto-migrates from legacy key into the new portfolio structure on first load
- A backup of the legacy state is preserved for safety
- No action required from users

## How to Access
- Create a new artist using the Artist Switcher (header)
- When you have 2+ artists, a new "Portfolio" tab appears
- Use Dashboard to search, filter, sort, compare, and bulk manage
- Open Analytics for portfolio-wide insights

## Known Limitations (Deferred to v1.4.0)
- Portfolio sharing/collaboration (team access, shareable URLs)
- PDF report generation
- Custom tags/labels and advanced filtering presets
- Keyboard shortcuts (e.g., Cmd+K)

## Technical Notes
- React + TypeScript + Tailwind CSS
- Recharts for data visualization
- LocalStorage persistence with seamless migration
- Size impact: ~+72 KB (657 KB total bundle)
- Build time: ~5.9s, 0 TypeScript errors

## Links
- Technical summary: DAY_3_COMPLETE.md
- Journey update: USER_JOURNEYS.md
- Previous releases: v1.3.2 (Mobile UX & Light Theme), v1.3.1 (Samply), v1.3.0 (Spotify)
