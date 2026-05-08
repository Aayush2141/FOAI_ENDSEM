/**
 * Vercel Serverless Function: /api/iss
 * Proxies ISS-related requests from open-notify.org to avoid CORS / HTTP issues.
 *
 * Query params:
 *   endpoint — "position" | "astronauts"
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { endpoint = 'position' } = req.query;

  const urls = {
    // wheretheiss.at: HTTPS, CORS-enabled, returns lat/lon/velocity/altitude
    position: 'https://api.wheretheiss.at/v1/satellites/25544',
    // open-notify: astronaut list (HTTP only — HTTPS returns empty)
    astronauts: 'http://api.open-notify.org/astros.json',
  };

  const targetUrl = urls[endpoint];
  if (!targetUrl) {
    return res.status(400).json({ error: `Unknown endpoint: ${endpoint}` });
  }

  try {
    const upstream = await fetch(targetUrl);
    if (!upstream.ok) {
      return res.status(502).json({ error: `Upstream error: ${upstream.status}` });
    }
    const data = await upstream.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-store'); // ISS data must always be fresh
    return res.json(data);
  } catch (err) {
    console.error('ISS handler error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
