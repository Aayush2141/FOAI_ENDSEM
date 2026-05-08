import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#0d1117', border: '1px solid rgba(6,182,212,0.3)',
      borderRadius: 8, padding: '8px 12px',
      fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
    }}>
      <p style={{ color: '#6b7280', marginBottom: 2 }}>{label}</p>
      <p style={{ color: '#06b6d4', fontWeight: 700 }}>
        ⚡ {Number(payload[0].value).toLocaleString()} km/h
      </p>
    </div>
  );
};

export default function ISSSpeedChart({ speedHistory }) {
  const hasData = speedHistory?.length >= 2;
  const data    = speedHistory?.slice(-30) || [];
  const speeds  = data.map((d) => d.speed).filter(Boolean);
  const minY    = speeds.length ? Math.max(0, Math.min(...speeds) - 400) : 20000;
  const maxY    = speeds.length ? Math.max(...speeds) + 400             : 30000;

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        background: '#161b22', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12, padding: 20, height: 400,
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-gray-300">ISS Speed History</p>
          <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>km/h · 15s interval</p>
        </div>
        {hasData && (
          <span className="font-mono text-sm font-bold"
            style={{ color: '#06b6d4', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 8, padding: '3px 10px' }}>
            {data[data.length - 1]?.speed?.toLocaleString()} km/h
          </span>
        )}
      </div>

      {/* Chart or empty state */}
      {!hasData ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="text-4xl">📈</div>
          <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>Collecting speed data… (needs 2+ samples)</p>
        </div>
      ) : (
        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="speedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="label" tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                tickLine={false} axisLine={false} interval="preserveStartEnd" />
              <YAxis domain={[minY, maxY]}
                tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                tickLine={false} axisLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} width={30} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="speed"
                stroke="#06b6d4" strokeWidth={2}
                fill="url(#speedGrad)" dot={false}
                activeDot={{ r: 4, fill: '#06b6d4', stroke: '#0d1117', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
}
