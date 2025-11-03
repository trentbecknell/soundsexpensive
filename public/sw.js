// Basic cache-first service worker (no build step required)
const CACHE_NAME = 'artist-roadmap-cache-v1';
const ASSET_PATTERNS = [/\/assets\//, /\/data\//];

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : Promise.resolve()))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle GET
  if (req.method !== 'GET') return;

  // Cache assets and data JSON with stale-while-revalidate
  if (ASSET_PATTERNS.some(re => re.test(url.pathname))) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(req);
      const fetchPromise = fetch(req).then((res) => {
        if (res && res.status === 200) cache.put(req, res.clone());
        return res;
      }).catch(() => cached);
      return cached || fetchPromise;
    })());
    return;
  }

  // Default: network first, fallback to cache
  event.respondWith((async () => {
    try {
      const res = await fetch(req);
      return res;
    } catch (err) {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(req);
      return cached || Promise.reject(err);
    }
  })());
});
