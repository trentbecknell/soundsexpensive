# Release Notes — v1.5.0 (2025-11-03)

Focus: First-time onboarding and multi-day tester continuity

## Highlights

- New onboarding overlay with clear purpose and guidance
- Anonymous tester identity so testers can return over multiple days
- Dismissible, non-intrusive UX that appears only on the first 1–2 visits
- 39 total tests passing; build verified for production

## Features

### Onboarding Overlay (First-Time Guidance)
- Purpose: “Plan your music project from idea to release with AI-powered budgeting, timeline planning, and industry insights.” (under 2 sentences)
- Interactive guidance prompts:
  1) Start with Assessment — Personalized recommendations
  2) Build Your Budget — Add items, explore grants, analyze catalog
  3) Create Your Timeline — Phase-by-phase tasks and milestones
- Dismissal: Tap anywhere or click “Get Started”
- Frequency: Appears on first visit and once more on second visit; hidden permanently after that
- Accessibility: role="dialog", aria-labelledby/aria-describedby

Files:
- `src/components/OnboardingOverlay.tsx`
- `src/components/OnboardingOverlay.test.tsx`

### Anonymous Tester Identity (No PII)
- Generates unique anonymous IDs on first visit (e.g., `tester-<timestamp>-<random>`)
- Persists to localStorage with session metadata (first/last visit timestamps, sessionCount)
- Welcome toast appears for new/early sessions
- Exposed in console via `window.__TESTER__` for diagnostics only

Files:
- `src/lib/testerIdentity.ts`
- `src/lib/testerIdentity.test.ts`
- `src/components/TesterWelcome.tsx`

## How to Test

Prereq: Start dev server.

1) First Visit
- Open app
- Expect onboarding overlay with title, short description, and three guidance steps
- Tap anywhere or click “Get Started” to dismiss

2) Second Visit
- Refresh without clearing storage
- Overlay appears once more
- Dismiss again

3) Third Visit
- Refresh again
- Overlay should not appear anymore

4) Tester Identity
- Open console, check `window.__TESTER__`
- Verify fields: `id`, `sessionCount`, `firstVisitISO`, `lastVisitISO`, `daysSinceFirst`

5) Reset for Testing
- In console: `localStorage.removeItem('artist-roadmap-onboarding-dismissed');`
- In console (optional): `localStorage.removeItem('artist-roadmap-tester');`

See also: `ONBOARDING_TESTING_GUIDE.md`

## Quality Checks

- Tests: 39 passing (13 new for onboarding)
- Build: Successful (Vite + TypeScript)
- Accessibility: ARIA roles and labels verified in tests

## Notes

- Onboarding overlay and tester identity are independent of auth and work in anonymous mode
- No personal information is stored; all data is device-local via localStorage

## Contributors

- Engineering and UX improvements by the team
