# AI Agent Instructions for Artist Roadmap

This is a React + TypeScript application for planning music projects, budgeting, and timeline generation. Here's what you need to know to work effectively in this codebase:

## Project Architecture

- **Frontend Stack**: Vite + React + TypeScript + Tailwind CSS
- **Key Dependencies**: 
  - `recharts` for visualizations
  - `tailwindcss` for styling
- **State Management**: Local state with React hooks + localStorage persistence
- **Data Model**: See `App.tsx` for core types:
  - `ArtistProfile` - Artist/project metadata and maturity assessment
  - `ProjectConfig` - Project scope and timeline settings 
  - `BudgetItem` - Individual budget line items
  - `RoadTask` - Timeline tasks by phase
  
## Core Patterns

- **State Updates**: Always use immutable state updates via spread operators
- **Computed Values**: Use `useMemo` for derived state calculations
- **Phase Structure**: All project phases follow `PHASE_ORDER`: Discovery → Pre-Production → Production → Post-Production → Release → Growth
- **URL State**: Project data can be shared via URL hash using base64 encoding
- **Persistence**: Full app state saves to localStorage under `artist-roadmap-vite-v1` key

## Key Files

- `src/App.tsx` - Main application component and business logic
- `tailwind.config.js` - Tailwind configuration and theme
- `vite.config.ts` - Build and dev server settings

## Developer Workflows

```bash
# Development
npm install
npm run dev

# Production build
npm run build
npm run preview
```

## Project Conventions

- Use Tailwind classes for styling - no CSS files
- Follow existing patterns for form inputs and data validation
- Maintain strict typing - no `any` types
- Keep computations in `useMemo` hooks when dependent on state
- Use utility functions (`uid()`, `sum()`, `clamp()`) for common operations
- Follow existing patterns for budget/task item IDs (random 7-char strings)

## Common Tasks

- Adding new budget/task items: Use the `uid()` helper for IDs
- Updating state: Always create new object/array references
- Chart updates: Ensure data is properly formatted for Recharts components
- Phase changes: Reference `PHASE_ORDER` constant for valid values

## Integration Points

- URL hash for state sharing
- localStorage for persistence
- File system for JSON/CSV exports

Need help? The codebase is self-contained and includes detailed type definitions.