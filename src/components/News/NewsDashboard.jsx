import { motion, AnimatePresence } from 'framer-motion';
import NewsCard from './NewsCard';
import NewsSearch from './NewsSearch';

const TABS = [
  { key: 'technology', label: 'Technology', icon: '💻', color: '#06b6d4' },
  { key: 'science',    label: 'Science',    icon: '🔬', color: '#8b5cf6' },
  { key: 'business',   label: 'Business',   icon: '📈', color: '#f59e0b' },
  { key: 'health',     label: 'Health',     icon: '🏥', color: '#10b981' },
  { key: 'sports',     label: 'Sports',     icon: '⚽', color: '#ec4899' },
];

function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#161b22', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="skeleton" style={{ height: 192 }} />
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-5/6 rounded" />
        <div className="skeleton h-8 w-full rounded-lg mt-2" />
      </div>
    </div>
  );
}

export default function NewsDashboard({
  articles, isLoading, error, searchQuery, setSearchQuery,
  sortBy, setSortBy, activeCategory, setActiveCategory, refresh,
}) {
  const activeTab = TABS.find((t) => t.key === activeCategory);

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {TABS.map((tab) => {
          const isActive = tab.key === activeCategory;
          return (
            <button key={tab.key} id={`tab-${tab.key}`}
              onClick={() => setActiveCategory(tab.key)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                background: isActive ? `${tab.color}20` : 'transparent',
                color:      isActive ? tab.color : '#8b949e',
                border:     isActive ? `1px solid ${tab.color}44` : '1px solid rgba(255,255,255,0.08)',
              }}>
              <span className="text-sm">{tab.icon}</span>{tab.label}
            </button>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#6b7280' }}>🔍</span>
          <input type="text" id="news-search" value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles..."
            className="input-field" style={{ paddingLeft: '2.2rem' }} />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
              style={{ color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <select id="news-sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            className="input-field" style={{ width: 'auto' }}>
            <option value="date">Sort: By Date</option>
            <option value="source">Sort: By Source</option>
          </select>
          <button id="news-refresh" onClick={refresh} disabled={isLoading}
            className="px-3 py-2 rounded-lg text-sm transition-all duration-200 text-gray-400 hover:text-white border border-white/10 hover:border-white/20"
            style={{ background: '#161b22', opacity: isLoading ? 0.6 : 1 }}>
            {isLoading ? '⏳' : '🔄'}
          </button>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center justify-between">
        <p className="text-xs" style={{ color: '#6b7280' }}>
          {activeTab?.icon} {activeTab?.label}
          {searchQuery && ` · "${searchQuery}"`}
          {articles.length > 0 && ` · ${articles.length} articles`}
        </p>
        {isLoading && (
          <span className="text-xs" style={{ color: activeTab?.color || '#06b6d4' }}>⏳ Loading…</span>
        )}
      </div>

      {/* Error */}
      {error && !isLoading && (
        <div className="rounded-xl p-8 text-center"
          style={{ background: '#161b22', border: '1px solid rgba(239,68,68,0.2)' }}>
          <div className="text-3xl mb-3">⚠️</div>
          <p className="text-sm text-red-400 mb-1">Failed to load news</p>
          <p className="text-xs mb-4" style={{ color: '#6b7280' }}>{error}</p>
          <button onClick={refresh}
            className="px-4 py-1.5 rounded-lg text-xs text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/10 transition-all duration-200">
            🔄 Retry
          </button>
        </div>
      )}

      {/* Skeleton */}
      {isLoading && articles.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && articles.length === 0 && (
        <div className="rounded-xl p-12 text-center"
          style={{ background: '#161b22', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="text-5xl mb-4">📭</div>
          <p className="font-semibold text-white mb-1">No articles found</p>
          <p className="text-sm" style={{ color: '#6b7280' }}>
            {searchQuery ? `No results for "${searchQuery}"` : 'Try refreshing or checking your API key.'}
          </p>
          {searchQuery && (
            <button onClick={() => setSearchQuery('')}
              className="mt-4 px-4 py-1.5 rounded-lg text-xs text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/10 transition-all duration-200">
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* Articles Grid */}
      <AnimatePresence mode="wait">
        {articles.length > 0 && (
          <motion.div key={activeCategory}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}>
            {articles.slice(0, 9).map((article, idx) => (
              <NewsCard key={article.id || idx} article={article} index={idx} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
