# v1.7.0 Summary (2025-11-04)

## TL;DR
- Merch Planner now production-ready (vendors, pricing, sizes, CSV, persistence)
- Master Plan shows Merch Summary and includes merch margin in Year 1 revenue
- Faster loads: vendor chunking reduces main bundle ~665 KB → ~160 KB

## Quick Demos
- Plan merch → CSV export → copy vendor quote
- Open Master Plan → see cost, revenue, gross margin, and merch share

## Notable Files
- `src/components/MerchPlanner.tsx` — Plan lineup and pricing
- `src/components/MasterPlan.tsx` — Merch economics in Master Plan
- `src/lib/merch*.ts`, `src/lib/pricing.ts` — Helpers and pricing
- `vite.config.ts` — Vendor chunking
