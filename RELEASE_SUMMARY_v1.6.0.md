# Release Summary — v1.6.0

- Talent Finder: role-based recommendations, filters, shortlist, outreach briefs.
- Contact in briefs: optional local contact footer (email/IG/website/phone/city).
- External Sources (beta): Discogs, MusicBrainz, Bandsintown adapters with sample data + cache.
- Live API scaffold: toggle in UI, configurable API base, Vite dev proxy, minimal Node /api server.
- Page Tips: per-tab guidance with Next/Dismiss/Hide All; stored in localStorage.

Upgrade notes:
- No breaking changes; features are additive.
- External sources use sample data by default. Enable live mode in Talent → External Sources and set API base to your proxy to test against real APIs.
- Tests: 46/46 passing; production build verified.
