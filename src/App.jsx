import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';

import Navbar from './components/Layout/Navbar';
import ISSMap from './components/ISSTracker/ISSMap';
import ISSStats from './components/ISSTracker/ISSStats';
import PeopleInSpace from './components/ISSTracker/PeopleInSpace';
import ISSSpeedChart from './components/Charts/ISSSpeedChart';
import NewsDashboard from './components/News/NewsDashboard';
import NewsDistributionChart from './components/Charts/NewsDistributionChart';
import ChatBot from './components/Chatbot/ChatBot';

import { useISSTracker } from './hooks/useISSTracker';
import { useNews } from './hooks/useNews';
import { useTheme } from './hooks/useTheme';

export default function App() {
  useTheme();

  const issData = useISSTracker();
  const {
    position, positions, speed, speedHistory,
    nearestPlace, astronauts, isLoading: issLoading,
    error: issError, refresh: issRefresh,
  } = issData;

  const newsData = useNews();
  const {
    articles, allArticlesByCategory,
    activeCategory, setActiveCategory,
    isLoading: newsLoading, error: newsError,
    searchQuery, setSearchQuery,
    sortBy, setSortBy, refresh: newsRefresh,
  } = newsData;

  // Toast on ISS update
  const prevTs = useRef(null);
  useEffect(() => {
    if (position?.timestamp && position.timestamp !== prevTs.current && prevTs.current !== null) {
      toast.success('ISS position updated', {
        duration: 1800,
        style: { background: '#161b22', color: '#e6edf3', border: '1px solid rgba(6,182,212,0.3)', fontSize: '0.82rem', borderRadius: '10px' },
        icon: '🛸',
      });
    }
    prevTs.current = position?.timestamp;
  }, [position?.timestamp]);

  const handleChartFilter = (cat) => {
    setActiveCategory(cat);
    document.getElementById('news-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117' }}>
      <Toaster position="top-right" />
      <Navbar issPosition={position} issSpeed={speed} />

      {/* ── Page wrapper ── */}
      <main className="max-w-[1400px] mx-auto px-6 py-10 space-y-10">

        {/* ── Section: ISS Live Tracker ── */}
        <section id="iss-section">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-bold text-white">ISS Live Tracker</h2>
            <span className="flex items-center gap-1.5 bg-green-500/20 text-green-400 text-xs font-semibold px-3 py-1 rounded-full border border-green-500/30">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
              </span>
              LIVE · 15s
            </span>
          </div>

          {/* Row 1: Map (60%) + Speed Chart (40%) */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
            <div className="lg:col-span-3">
              <ISSMap position={position} positions={positions} speed={speed} nearestPlace={nearestPlace} />
            </div>
            <div className="lg:col-span-2">
              <ISSSpeedChart speedHistory={speedHistory} />
            </div>
          </div>

          {/* Row 2: 6 stat cards horizontal */}
          <ISSStats
            position={position} speed={speed} nearestPlace={nearestPlace}
            positions={positions} isLoading={issLoading} error={issError}
            refresh={issRefresh}
          />

          {/* Row 3: People in Space (right side, below chart) */}
          <div className="mt-6">
            <PeopleInSpace astronauts={astronauts} isLoading={issLoading} />
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-white/5" />

        {/* ── Section: News Dashboard ── */}
        <section id="news-section">
          <h2 className="text-xl font-bold text-white mb-6">News Dashboard</h2>
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3">
              <NewsDashboard
                articles={articles} isLoading={newsLoading} error={newsError}
                searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                sortBy={sortBy} setSortBy={setSortBy}
                activeCategory={activeCategory} setActiveCategory={setActiveCategory}
                refresh={newsRefresh}
              />
            </div>
            <div className="xl:col-span-1">
              <NewsDistributionChart
                allArticlesByCategory={allArticlesByCategory}
                activeCategory={activeCategory}
                onCategoryFilter={handleChartFilter}
              />
            </div>
          </div>
        </section>

        <div className="h-20" />
      </main>

      <ChatBot issData={issData} newsData={allArticlesByCategory} />
    </div>
  );
}
