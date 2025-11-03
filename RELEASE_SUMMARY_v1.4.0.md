# v1.4.0 Release Summary - Performance & Scalability

## TL;DR
Performance-focused release optimizing for 25 concurrent testers with Web Workers, code splitting, and service worker caching.

## Key Features

### 🚀 Performance
- **Web Workers**: Heavy analysis runs off main thread (opt-in with `?flags=perf-slice`)
- **Code Splitting**: Route-level lazy loading reduces initial bundle size
- **Service Worker**: Offline support and asset caching

### ♿ Accessibility
- Chat interface improvements (ARIA labels, clickable suggestions)
- Assessment wizard backdrop interaction fixes
- Better keyboard navigation

### 🧪 Testing
- Fast single-run tests by default (`npm test`)
- All 18 tests passing
- Better CI/CD integration

## Quick Start for Testers

**Try Performance Mode:**
```
# Add to URL
?flags=perf-slice

# Example
https://soundsexpensive.app?flags=perf-slice
```

**What You'll Notice:**
- Mix/Catalog analysis feels more responsive
- Faster navigation between heavy views
- Works offline after first visit

## No Breaking Changes
All enhancements are backward compatible. Standard mode unchanged.

## Metrics
- 25 user capacity target ✅
- Build time: ~7s
- Test suite: ~6s (18/18 passing)
- Main bundle: 656KB (split into feature chunks)

---

**Full details**: See [RELEASE_NOTES_v1.4.0.md](./RELEASE_NOTES_v1.4.0.md)
