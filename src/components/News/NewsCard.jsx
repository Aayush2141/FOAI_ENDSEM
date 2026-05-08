import { useState } from 'react';
import { motion } from 'framer-motion';
import { formatDate, truncate } from '../../utils/formatters';

const CAT_COLORS = {
  technology: '#06b6d4', science: '#8b5cf6', business: '#f59e0b',
  health: '#10b981', sports: '#ec4899', search: '#6b7280',
};

const PLACEHOLDERS = [
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=70',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=70',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=70',
  'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=600&q=70',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=70',
];

function getPlaceholder(title = '') {
  const idx = Math.abs(title.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % PLACEHOLDERS.length;
  return PLACEHOLDERS[idx];
}

export default function NewsCard({ article, index = 0 }) {
  const [imgErr, setImgErr] = useState(false);
  const color  = CAT_COLORS[article.category] || '#6b7280';
  const imgSrc = !article.image || imgErr ? getPlaceholder(article.title) : article.image;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.38, ease: 'easeOut' }}
      whileHover={{ y: -4, borderColor: 'rgba(255,255,255,0.18)' }}
      className="rounded-xl overflow-hidden flex flex-col transition-all duration-200"
      style={{ background: '#161b22', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: 192 }}>
        <img src={imgSrc} alt={article.title} onError={() => setImgErr(true)}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ display: 'block' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(22,27,34,0.9) 0%, transparent 50%)' }} />
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide"
            style={{ background: `${color}22`, color, border: `1px solid ${color}44`, backdropFilter: 'blur(4px)' }}>
            {article.category}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="text-sm font-semibold text-white leading-snug"
          style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {article.title}
        </h3>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium" style={{ color }}>{truncate(article.source, 24)}</span>
          <span className="text-xs" style={{ color: '#484f58' }}>·</span>
          <span className="text-xs" style={{ color: '#6b7280' }}>{formatDate(article.publishedAt)}</span>
        </div>

        {article.description && (
          <p className="text-xs leading-relaxed flex-1"
            style={{ color: '#6b7280', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {article.description}
          </p>
        )}

        <div className="mt-auto pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <a href={article.url} target="_blank" rel="noopener noreferrer"
            className="block w-full py-2 text-center text-xs font-medium rounded-lg transition-all duration-200"
            style={{
              color: '#06b6d4', border: '1px solid rgba(6,182,212,0.3)',
              textDecoration: 'none', background: 'transparent',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(6,182,212,0.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            Read Full Article →
          </a>
        </div>
      </div>
    </motion.div>
  );
}
