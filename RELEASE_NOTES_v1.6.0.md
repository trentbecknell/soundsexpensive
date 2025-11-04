# Release Notes — v1.6.0 (2025-11-04)

## Highlights
- Talent Finder end-to-end: recommendations by role, filters, shortlist, and copyable outreach briefs.
- "Your contact info" (optional): store email/IG/website locally and append a "Contact me" footer to all copied briefs.
- External Sources (beta): Discogs, MusicBrainz, Bandsintown adapters using sample data + local cache.
- Live API scaffold: UI toggle, configurable API base, dev proxy, and a minimal Node /api server.
- Page Tips: short, contextual guidance per tab with Next/Dismiss/Hide All and local persistence.

## Features

### Talent Finder
- Role-targeted sections (Producer, Mixer, Mastering, Engineers, Session Musicians, Live MD/Musicians).
- Filters for role, genre, rate, remote-only, and location substring.
- Recommendations by role, plus an “All Talent” view.
- Shortlist management (localStorage) and portfolio links.
- Outreach brief generator tailored to role deliverables.

### Your contact info in briefs
- Save name, email, Instagram, website, phone, city locally (no server).
- Toggle to include your contact details in all copied briefs.
- Normalizes IG/Website to full URLs for clarity.

### External Sources (beta)
- Adapters for Discogs (credits), MusicBrainz (relations), Bandsintown (events → live talent).
- Uses sample JSON and a small cache for deterministic testing.
- New External Sources panel: toggles, query inputs, and integrated results.

### Live API ready
- UI toggle: “Use live API (via /api) instead of sample data.”
- Configurable base: set API base URL in the panel (persisted); defaults to /api.
- Dev proxy in Vite forwards /api → http://localhost:8787.
- Minimal Node server at `server/server.mjs` with endpoints:
  - GET /api/discogs/credits?artist&release
  - GET /api/musicbrainz/credits?artist&release
  - GET /api/bandsintown/events?city&artist
- TODO hooks in server to integrate real upstream APIs and env keys.

### Page Tips
- Tiny banner above tab content with 1–2 key tips per section.
- Controls: Next, Don’t show for this page, Hide all (with “Show tips” button to re-enable).
- Stored in localStorage (ar-page-tips-v1).

## How to try it

### Local (dev)
1. Terminal A: `npm run server` (starts /api on http://localhost:8787)
2. Terminal B: `npm run dev` (Vite proxy routes /api → server)
3. In Talent → External Sources:
   - Check “Use live API”
   - Leave API base as `/api`
   - Enter a reference artist/release or city, then “Search sources”

### Production test
1. Deploy `server/server.mjs` or equivalent proxy (Node or serverless) and note base URL, e.g., `https://your-proxy.example.com/api`.
2. In the deployed app (Talent → External Sources):
   - Check “Use live API”
   - Set API base to your proxy endpoint
   - Run a search
3. URL override works too: add `#liveSources=1&apiBase=https://your-proxy.example.com/api` to the app URL.

## QA Checklist
- Talent Finder renders recommendations and All Talent; shortlist toggles; Copy outreach adds contact footer when enabled.
- External Sources panel: toggles respected; search returns items (sample data) and marks cached results.
- Live API toggle ON: network calls go to configured base; OFF: uses sample/cache.
- Page Tips show per tab; Next/Dismiss/Hide All persist across navigations.
- Test suite: 46/46 passing; production build succeeds.

## Technical notes
- New modules: `src/lib/integrations/*`, `src/types/integrations.ts`, `src/components/PageTips.tsx`, `src/components/TesterContact.tsx`, `src/lib/testerContact.ts`, `src/lib/featureFlags.ts`, `server/server.mjs`.
- No data leaves the browser unless you configure and point the API base at your own proxy.
