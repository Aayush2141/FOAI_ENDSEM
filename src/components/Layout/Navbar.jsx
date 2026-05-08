import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ issPosition, issSpeed }) {
  return (
    <motion.nav
      initial={{ y: -56, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ background: '#0d1117', borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0, zIndex: 100 }}
    >
      <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <motion.span
            className="text-xl"
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >🛸</motion.span>
          <div>
            <span className="font-bold text-sm text-white tracking-tight">ISS Dashboard</span>
            <p className="text-xs hidden sm:block" style={{ color: '#8b949e' }}>Real-Time Tracker & News</p>
          </div>
        </div>

        {/* Live ISS data strip */}
        <AnimatePresence>
          {issPosition && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hidden md:flex items-center gap-4"
            >
              {/* Live badge */}
              <span className="flex items-center gap-1.5 bg-green-500/20 text-green-400 text-xs font-semibold px-3 py-1 rounded-full border border-green-500/30">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
                </span>
                LIVE
              </span>
              {/* Coordinates */}
              <span className="font-mono text-cyan-400 text-sm">
                {Number(issPosition.latitude).toFixed(2)}°&nbsp;
                {Number(issPosition.longitude).toFixed(2)}°
              </span>
              {/* Speed */}
              {issSpeed && (
                <span className="font-mono text-cyan-400 text-sm font-semibold">
                  {Math.round(issSpeed).toLocaleString()} km/h
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right links */}
        <div className="flex items-center gap-2 shrink-0">
          {[['#iss-section', '🛰 ISS'], ['#news-section', '📰 News']].map(([href, label]) => (
            <a key={href} href={href}
              className="hidden sm:block text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-200 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10"
              style={{ textDecoration: 'none' }}>
              {label}
            </a>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
