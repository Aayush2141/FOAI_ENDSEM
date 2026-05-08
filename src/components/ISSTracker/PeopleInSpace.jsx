import { motion } from 'framer-motion';

const CRAFT_COLORS = {
  ISS:      '#06b6d4',
  Tiangong: '#f59e0b',
  'Tiangong Space Station': '#f59e0b',
};

export default function PeopleInSpace({ astronauts, isLoading }) {
  const people = astronauts?.people || [];
  const count  = astronauts?.number ?? 0;

  // Group by spacecraft
  const byCraft = {};
  people.forEach((p) => {
    const key = p.craft;
    if (!byCraft[key]) byCraft[key] = [];
    byCraft[key].push(p.name);
  });

  return (
    <div className="rounded-xl p-5"
      style={{ background: '#161b22', border: '1px solid rgba(255,255,255,0.08)' }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">👨‍🚀</span>
          <div>
            <p className="text-sm font-semibold text-white">People in Space</p>
            <p className="text-xs" style={{ color: '#6b7280' }}>Currently aboard spacecraft</p>
          </div>
        </div>
        {/* Count badge */}
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.15 }}
          className="flex items-center gap-1.5">
          <span className="font-mono font-bold text-2xl" style={{ color: '#06b6d4' }}>{count}</span>
          <span className="text-xs" style={{ color: '#6b7280' }}>humans</span>
        </motion.div>
      </div>

      {/* Loading skeleton */}
      {isLoading && count === 0 && (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-10 w-full rounded-lg" />
          ))}
        </div>
      )}

      {/* Grouped by spacecraft */}
      <div className="space-y-5">
        {Object.entries(byCraft).map(([craft, names]) => {
          const color = CRAFT_COLORS[craft] || '#8b5cf6';
          return (
            <div key={craft}>
              {/* Craft header */}
              <div className="flex items-center justify-between mb-2 pb-1.5"
                style={{ borderBottom: `1px solid ${color}22` }}>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">🚀</span>
                  <span className="text-xs font-semibold" style={{ color }}>{craft}</span>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full"
                  style={{ background: `${color}15`, color }}>
                  {names.length}
                </span>
              </div>

              {/* Astronaut rows */}
              <div className="space-y-1.5">
                {names.map((name, idx) => (
                  <motion.div key={name}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.06, duration: 0.3 }}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200"
                    style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}
                    whileHover={{ background: `${color}08`, borderColor: `${color}25` }}
                  >
                    <span className="text-base">🧑‍🚀</span>
                    <span className="text-sm font-medium text-white flex-1 min-w-0 truncate">{name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full shrink-0"
                      style={{ background: `${color}15`, color, fontSize: '0.7rem' }}>
                      {craft}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}

        {!isLoading && people.length === 0 && (
          <p className="text-center py-4 text-sm" style={{ color: '#6b7280' }}>Loading crew data…</p>
        )}
      </div>
    </div>
  );
}
