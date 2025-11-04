import http from 'node:http';
import url from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const PORT = process.env.PORT || 8787;

function sendJson(res, obj, status = 200) {
  const data = JSON.stringify(obj);
  res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  res.end(data);
}

function readSample(file) {
  const p = path.resolve(process.cwd(), 'src', 'data', 'integrations', file);
  const raw = fs.readFileSync(p, 'utf-8');
  return JSON.parse(raw);
}

const server = http.createServer(async (req, res) => {
  try {
    const parsed = url.parse(req.url, true);
    const { pathname, query } = parsed;
    if (!pathname || !pathname.startsWith('/api/')) {
      res.writeHead(404);
      return res.end('Not found');
    }

    if (pathname === '/api/discogs/credits') {
      // TODO: add live Discogs fetch using DISCOGS_TOKEN and basic rate limiting.
      const sample = readSample('discogs.json');
      return sendJson(res, sample);
    }
    if (pathname === '/api/musicbrainz/credits') {
      // TODO: add live MB fetch with polite User-Agent and throttling.
      const sample = readSample('musicbrainz.json');
      return sendJson(res, sample);
    }
    if (pathname === '/api/bandsintown/events') {
      // TODO: add live Bandsintown fetch using BANDSINTOWN_APP_ID.
      const sample = readSample('bandsintown.json');
      // Optional city filter for dev convenience
      const city = (query.city || '').toString().toLowerCase();
      const filtered = city ? sample.filter(e => (e.city || '').toLowerCase().includes(city)) : sample;
      return sendJson(res, filtered);
    }

    res.writeHead(404);
    res.end('Unknown endpoint');
  } catch (e) {
    console.error(e);
    sendJson(res, { error: 'Server error' }, 500);
  }
});

server.listen(PORT, () => {
  console.log(`[dev-api] listening on http://localhost:${PORT}`);
});
