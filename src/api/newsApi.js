/**
 * News API module — calls our own /api/news Vercel serverless proxy,
 * which in turn hits GNews. The GNews API key stays server-side.
 *
 * GNews article shape:
 *   { title, description, content, url, image, publishedAt, source: { name, url } }
 */

const PROXY_BASE = '/api/news';

/** Map a raw GNews article object into our internal shape. */
function mapArticle(a, category) {
  return {
    id: a.url || `${category}-${Math.random().toString(36).slice(2)}`,
    title: a.title || 'Untitled',
    description: a.description || a.content?.slice(0, 300) || '',
    url: a.url || '#',
    image: a.image || null,
    source: a.source?.name || 'Unknown',
    author: null,          // GNews free tier doesn't include author
    publishedAt: a.publishedAt || new Date().toISOString(),
    category,
  };
}

/**
 * Fetch top headlines for a given category via /api/news proxy.
 * Supported categories: technology | science | business | health | sports | general
 */
export async function fetchNewsByCategory(category, count = 10) {
  const res = await fetch(
    `${PROXY_BASE}?category=${encodeURIComponent(category)}&max=${count}`
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `News fetch failed: ${res.status}`);
  }

  const data = await res.json();
  return (data.articles || []).map((a) => mapArticle(a, category));
}

/**
 * Search articles by keyword via /api/news proxy.
 */
export async function searchArticles(keyword, count = 10) {
  const res = await fetch(
    `${PROXY_BASE}?q=${encodeURIComponent(keyword)}&max=${count}`
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Search failed: ${res.status}`);
  }

  const data = await res.json();
  return (data.articles || []).map((a) => mapArticle(a, 'search'));
}
