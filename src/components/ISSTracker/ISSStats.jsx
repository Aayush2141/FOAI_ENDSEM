import { motion } from 'framer-motion';
import { toFixed, formatSpeed, relativeTime } from '../../utils/formatters';

const CARDS = [
  { key: 'lat',     label: 'Latitude',          icon: '🌐', color: '#06b6d4', topBorder: '#06b6d4' },
  { key: 'lon',     label: 'Longitude',          icon: '🗺️', color: '#3b82f6', topBorder: '#3b82f6' },
  { key: 'speed',   label: 'Speed',              icon: '⚡', color: '#f59e0b', topBorder: '#f59e0b' },
  { key: 'place',   label: 'Over',               icon: '📍', color: '#10b981', topBorder: '#10b981' },
  { key: 'count',   label: 'Positions Tracked',  icon: '🛤️', color: '#8b5cf6', topBorder: '#8b5cf6' },
  { key: 'updated', label: 'Last Updated',        icon: '🕐', color: '#6b7280', topBorder: '#6b7280' },
];

export default function ISSStats({ position, speed, nearestPlace, positions, isLoading, error, refresh }) {
  if (error && !position) {
    return (
      <div className="rounded-xl p-6 text-center"
        style={{ background: '#161b22', border: '1px solid rgba(239,68,68,0.25)' }}>
        <div className="text-3xl mb-2">⚠️</div>
        <p className="text-sm text-red-400 mb-1">{error}</p>
        <button onClick={refresh}
          className="mt-3 px-4 py-1.5 rounded-lg text-xs font-medium text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/10 transition-all duration-200">
          🔄 Retry
        </button>
      </div>
    );
  }

  const values = {
    lat:     position ? `${toFixed(position.latitude)}°` : '—',
    lon:     position ? `${toFixed(position.longitude)}°` : '—',
    speed:   speed    ? formatSpeed(speed)                : '—',
    place:   nearestPlace || '—',
    count:   String(positions?.length ?? 0),
    updated: position?.timestamp ? relativeTime(new Date(position.timestamp * 1000)) : '—',
  };

  const subs = {
    lat:     position ? (position.latitude  > 0 ? 'North' : 'South') : 'Waiting…',
    lon:     position ? (position.longitude > 0 ? 'East'  : 'West')  : 'Waiting…',
    speed:   '~27,600 km/h orbital avg',
    place:   'Nearest surface location',
    count:   'Last 15 samples stored',
    updated: position?.timestamp ? `Unix ${position.timestamp}` : 'Fetching…',
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {CARDS.map((card, i) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07, duration: 0.4, ease: 'easeOut' }}
          whileHover={{ y: -2, borderColor: card.topBorder + '55' }}
          className="rounded-xl p-4 flex flex-col gap-1 transition-all duration-200"
          style={{
            background: '#161b22',
            border: '1px solid rgba(255,255,255,0.08)',
            borderTop: `2px solid ${card.topBorder}`,
          }}
        >
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-sm">{card.icon}</span>
            <span className="text-xs uppercase tracking-widest font-medium" style={{ color: '#6b7280' }}>
              {card.label}
            </span>
          </div>

          {isLoading && !position ? (
            <div className="skeleton h-7 w-full rounded mt-1" />
          ) : (
            <span className="font-mono font-bold text-xl text-white leading-none truncate"
              title={values[card.key]}>
              {values[card.key]}
            </span>
          )}

          <span className="text-xs mt-0.5 truncate" style={{ color: '#6b7280' }}>
            {subs[card.key]}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
