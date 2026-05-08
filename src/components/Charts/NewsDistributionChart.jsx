import { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CATS = {
  technology: { label: 'Technology', color: '#06b6d4' },
  science:    { label: 'Science',    color: '#8b5cf6' },
  business:   { label: 'Business',   color: '#f59e0b' },
  health:     { label: 'Health',     color: '#10b981' },
  sports:     { label: 'Sports',     color: '#ec4899' },
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div style={{
      background: '#0d1117', border: `1px solid ${item.payload.fill}44`,
      borderRadius: 8, padding: '8px 12px', fontSize: 12,
    }}>
      <p style={{ color: item.payload.fill, fontWeight: 700, marginBottom: 2 }}>
        {CATS[item.name]?.label || item.name}
      </p>
      <p style={{ color: '#8b949e' }}>{item.value} articles</p>
    </div>
  );
};

export default function NewsDistributionChart({ allArticlesByCategory, onCategoryFilter, activeCategory }) {
  const [hovered, setHovered] = useState(null);

  const data = Object.entries(CATS)
    .map(([key, { label, color }]) => ({
      name: key, label, fill: color,
      value: (allArticlesByCategory[key] || []).length,
    }))
    .filter((d) => d.value > 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45 }}
      className="rounded-xl p-5"
      style={{ background: '#161b22', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-300">News by Category</p>
        <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>
          {data.length === 0 ? 'Loading categories…' : 'Click a slice to filter'}
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex items-center justify-center" style={{ height: 240 }}>
          <div className="text-center">
            <div className="text-3xl mb-2">📊</div>
            <p style={{ color: '#6b7280', fontSize: '0.8rem' }}>Fetching…</p>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={data} cx="50%" cy="45%"
              innerRadius={55} outerRadius={85}
              paddingAngle={3} dataKey="value"
              animationBegin={100} animationDuration={700}
              onMouseEnter={(_, i) => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onClick={(e) => onCategoryFilter?.(e.name)}
              style={{ cursor: 'pointer' }}
            >
              {data.map((entry, idx) => (
                <Cell key={entry.name} fill={entry.fill}
                  opacity={hovered === null ? (activeCategory === entry.name ? 1 : 0.78)
                    : hovered === idx ? 1 : 0.38}
                  stroke={activeCategory === entry.name ? '#fff' : 'transparent'}
                  strokeWidth={activeCategory === entry.name ? 1.5 : 0}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => (
                <span style={{ color: activeCategory === value ? CATS[value]?.color : '#8b949e', fontSize: 12 }}>
                  {CATS[value]?.label || value}
                </span>
              )}
              iconType="circle" iconSize={8}
              wrapperStyle={{ paddingTop: 8, cursor: 'pointer' }}
              onClick={(e) => onCategoryFilter?.(e.value)}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
}
