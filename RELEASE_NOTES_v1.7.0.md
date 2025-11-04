# Release Notes — v1.7.0 (2025-11-04)

## 🛒 Merch Planner (mature) + Master Plan Integration

Plan a real merch lineup end-to-end and see the economics flow into your Master Plan. This release also optimizes bundle size for a faster first load.

### Highlights
- Merch Planner: quantities, methods, colorways, unit costs, sell prices
- Vendor intelligence: MOQs, lead times, dropship/eco flags, per-item vendor lock
- Size editor: default distribution, rebalance to new totals, and reset
- Pricing helpers: suggest prices by category, target margin application
- CSV export and quote outreach: generic + vendor-specific messages
- Persistence: load/save merch plans per artist/project (localStorage)
- Master Plan: Merch Summary (items, total cost, projected revenue, gross margin)
- Master Plan: Year 1 revenue includes merch gross margin and shows share in breakdown
- Performance: vendor chunking reduces main bundle from ~665 KB → ~160 KB

### What’s New
#### Merch Planner
- Adjust per-item quantity, print method, colorways, unit cost, and sell price
- Lock a preferred vendor to respect method and MOQ/lead constraints
- Edit sizes (XS–XXL); rebalance when totals change or reset to defaults
- Apply target margin or use suggested prices by category
- Export as CSV; copy quote requests (generic or prefilled with vendor)

#### Master Plan
- New Merch Summary card with:
  - Item count, total cost, projected revenue
  - Gross margin and quick link to open Merch Planner
- Year 1 revenue now includes merch gross margin; breakdown shows merch share

#### Performance
- Rollup manualChunks splits heavy vendor libraries (react, recharts, auth) into dedicated chunks
- Main bundle reduced to ~160 KB; feature chunks loaded on demand

### Quality
- 52 tests passing (Vitest); production build verified
- CSV export and persistence manually validated

### How to Try
1. Open Merch tab → plan your lineup (quantities, sizes, prices, vendor)
2. Export CSV or copy quote outreach to contact vendors
3. Open Master Plan → view Merch Summary and revenue inclusion

### Tech Notes
- Key files: `src/components/MerchPlanner.tsx`, `src/components/MasterPlan.tsx`, `src/lib/merch*.ts`, `src/lib/pricing.ts`, `vite.config.ts`
- Local persistence key: `artist-roadmap-vite-v1` (scoped by artist/project)
