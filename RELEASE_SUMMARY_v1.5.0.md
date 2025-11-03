# Release Summary — v1.5.0

Date: 2025-11-03

## What’s New (Tester-Facing)
- First-time onboarding overlay explains the app in under 2 sentences
- Clear prompts on how to use it (Assessment → Budget → Timeline)
- Dismiss with a tap; only shows the first 1–2 times
- Anonymous tester identity remembers your sessions over multiple days (no PII)

## How to Verify (2 minutes)
1) localStorage.clear(); refresh → overlay appears
2) Dismiss overlay → refresh → overlay appears once more
3) Dismiss overlay again → refresh → overlay no longer appears
4) Open console → check `window.__TESTER__` for anonymous ID and session info

## Developer Notes
- Files: OnboardingOverlay.tsx, testerIdentity.ts, TesterWelcome.tsx
- Tests: 39 total passing (13 new)
- Build: Vite+TS production build verified

## Links
- Full notes: RELEASE_NOTES_v1.5.0.md
- Testing guide: ONBOARDING_TESTING_GUIDE.md
