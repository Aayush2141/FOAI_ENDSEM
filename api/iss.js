/**
 * Vercel Serverless Function: /api/iss
 *
 * Proxies ISS requests so the browser never calls HTTP directly
 * (Vercel is HTTPS; browsers block HTTP fetch from HTTPS pages).
 *
 * Query params:
 *   endpoint — "position" | "astronauts"
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { endpoint = 'position' } = req.query;

  // open-notify is HTTP-only but that's fine server-side (Node has no mixed-content rules)
  const urls = {
    position:   'http://api.open-notify.org/iss-now.json',
    astronauts: 'http://api.open-notify.org/astros.json',
  };

  const targetUrl = urls[endpoint];
  if (!targetUrl) {
    return res.status(400).json({ error: `Unknown endpoint: ${endpoint}` });
  }

  try {
    const upstream = await fetch(targetUrl, { signal: AbortSignal.timeout(8000) });
    if (!upstream.ok) {
      return res.status(502).json({ error: `Upstream error: ${upstream.status}` });
    }
    const data = await upstream.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-store');
    return res.json(data);
  } catch (err) {
    console.error('[api/iss] error:', err.message);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
