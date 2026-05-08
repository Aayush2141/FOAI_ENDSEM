import React from 'react';

export default function NewsSearch({ searchQuery, setSearchQuery }) {
  return (
    <div className="relative">
      <span
        className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
        style={{ color: 'var(--text-secondary)' }}
      >
        🔍
      </span>
      <input
        id="news-search"
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search articles..."
        className="input-field"
        style={{ paddingLeft: '2.2rem' }}
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
          style={{ color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
