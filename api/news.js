/**
 * Vercel Serverless Function: /api/news
 * Proxies GNews API so the key stays server-side and CORS is avoided.
 *
 * Query params:
 *   category  — top-headlines category (technology | science | business | health | sports | general)
 *   q         — free-text search query (uses /search endpoint instead)
 *   max       — number of results (default 10)
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.VITE_NEWS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GNews API key not configured on server (VITE_NEWS_API_KEY)' });
  }

  const { category, q, max = 10 } = req.query;

  let gnewsUrl;

  if (q) {
    // Search endpoint
    gnewsUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&lang=en&max=${max}&apikey=${apiKey}`;
  } else {
    // Top headlines endpoint
    const cat = category || 'general';
    gnewsUrl = `https://gnews.io/api/v4/top-headlines?category=${encodeURIComponent(cat)}&lang=en&max=${max}&apikey=${apiKey}`;
  }

  try {
    const gnewsRes = await fetch(gnewsUrl);

    if (!gnewsRes.ok) {
      const errText = await gnewsRes.text();
      console.error('GNews error:', gnewsRes.status, errText);
      return res.status(502).json({ error: `GNews API error: ${gnewsRes.status}` });
    }

    const data = await gnewsRes.json();

    // Set CORS headers so the Vite dev server can call this via the proxy
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600'); // 5-min CDN cache

    return res.json(data);
  } catch (err) {
    console.error('News handler error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
