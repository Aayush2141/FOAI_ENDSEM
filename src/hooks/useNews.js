import { useState, useEffect, useCallback } from 'react';
import { fetchNewsByCategory } from '../api/newsApi';
import { setWithExpiry, getWithExpiry } from '../utils/localStorage';

const CATEGORIES = ['technology', 'science', 'business', 'health', 'sports'];
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour — GNews free tier is 100 req/day

export function useNews() {
  const [articlesByCategory, setArticlesByCategory] = useState({});
  const [activeCategory, setActiveCategory] = useState('technology');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date' | 'source'

  const fetchCategory = useCallback(async (category, forceRefresh = false) => {
    const cacheKey = `news_cache_${category}`;

    // Check cache first
    if (!forceRefresh) {
      const cached = getWithExpiry(cacheKey);
      if (cached) {
        setArticlesByCategory((prev) => ({ ...prev, [category]: cached }));
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      const articles = await fetchNewsByCategory(category, 10);
      setWithExpiry(cacheKey, articles, CACHE_TTL_MS);
      setArticlesByCategory((prev) => ({ ...prev, [category]: articles }));
    } catch (err) {
      setError(err.message || `Failed to load ${category} news`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load initial category
  useEffect(() => {
    fetchCategory(activeCategory);
  }, [activeCategory, fetchCategory]);

  // Staggered background pre-fetch — loads remaining categories one at a time,
  // 5 seconds apart, so GNews rate limits are never hit. Checks cache first so
  // this is effectively a no-op after the first page load (1-hour TTL).
  useEffect(() => {
    const timers = [];
    CATEGORIES.forEach((cat, idx) => {
      if (cat === 'technology') return; // already loaded as initial category
      const delay = idx * 5000; // 0s, 5s, 10s, 15s, 20s staggered
      timers.push(
        setTimeout(() => fetchCategory(cat), delay)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const articles = articlesByCategory[activeCategory] || [];

  // Filter by search query
  const filtered = articles.filter((a) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.title?.toLowerCase().includes(q) ||
      a.description?.toLowerCase().includes(q) ||
      a.source?.toLowerCase().includes(q)
    );
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'source') {
      return (a.source || '').localeCompare(b.source || '');
    }
    // default: by date
    return new Date(b.publishedAt) - new Date(a.publishedAt);
  });

  const refresh = useCallback(() => {
    fetchCategory(activeCategory, true);
  }, [activeCategory, fetchCategory]);

  return {
    articles: sorted,
    allArticlesByCategory: articlesByCategory,
    activeCategory,
    setActiveCategory,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    refresh,
    categories: CATEGORIES,
  };
}
