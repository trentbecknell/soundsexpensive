# User Personas and Minimal Journeys

Date: 2025-11-04
Status: Phase 1 shipped (mode switch + tab pruning). Phases 2–3 proposed.

## Personas

- Artist
  - Jobs: get a realistic plan fast, understand costs, select merch, know next steps
  - Constraints: limited time, low appetite for jargon/tools
  - Success: leaves with a prioritized plan and rough budget they trust

- Manager / Team
  - Jobs: review portfolio/artist at a glance, see totals, margins, key milestones/risks
  - Constraints: needs clarity over detail; exportable summaries for stakeholders
  - Success: leaves with an executive summary and clear go/no-go signals

## Minimal Journeys

- Artist Journey: "Plan in 10 minutes"
  1) Persona = Artist (default if single-artist)
  2) Quick Assessment (lite 3 inputs): goal/timeline, budget range, release type
  3) Instant Plan (Master Plan): top 5 tasks, dates, budget roll-up
  4) Merch Recommendations: preselected bundle + margin preview; edit or accept
  5) Finalize: add merch to budget, confirm timeline, save/share

- Manager Journey: "Executive overview in 3 minutes"
  1) Persona = Manager (default if portfolio > 1)
  2) Overview page (composed): Year 1 revenue breakdown incl. merch margin, budget totals, milestones/critical path, risks/assumptions
  3) Export/share summary (PDF/CSV/share link)

## Navigation and Modes

- New top-level mode: Artist | Manager
- Persistence: URL `?persona=artist|manager` (works with HashRouter), and localStorage `artist-roadmap-persona-v1`
- Defaulting: URL > saved > portfolio heuristic (>1 artists => manager) > artist
- Tabs per mode
  - Artist: Catalog Analyzer, Roadmap, Master Plan, Grants, Applications, Merch, Live, Mix Analyzer, Talent
  - Manager: Master Plan (default), Roadmap, Grants, Applications, Merch, Portfolio, Live
- If a hidden tab is active when switching modes, redirect to the mode’s default

## Phased Rollout

- Phase 1 (Shipped): Mode flag + header switch + URL/localStorage + tab pruning
  - Acceptance: switch persists; deep links work; hidden tabs don’t appear
- Phase 2 (Proposed): Quick Assessment (lite 3-question path) + preselected merch bundle CTA
  - Acceptance: time-to-first-plan median < 3 min; add-to-budget works in 1 click
- Phase 3 (Proposed): Manager Overview page (composed from existing data)
  - Acceptance: renders w/o input; totals correct; one-click export
- Phase 4 (Optional): Print-friendly/PDF export for executive brief

## KPIs

- Artist
  - Time-to-first-plan: median < 3 min
  - Completion rate (Assessment → Master Plan): > 70%
  - Merch bundle adoption: > 40%

- Manager
  - Overview time-on-page: 60–120s
  - Export rate (PDF/CSV/share): > 30%
  - Bounce from Overview: < 20%

## Deep Links (examples)

- Artist roadmap: `#/roadmap?persona=artist`
- Manager master plan: `#/master-plan?persona=manager`
- Catalog analyzer (artist): `#/catalog-analyzer?persona=artist`

## Next Work Items

- Phase 2: Implement Quick Assessment (lite) path in `AssessmentWizard` and hook to Master Plan defaults; auto-preselect a merch bundle with an "Add to Plan" CTA.
- Phase 3: Implement `ManagerOverview` container that composes existing summaries (no new data model).
