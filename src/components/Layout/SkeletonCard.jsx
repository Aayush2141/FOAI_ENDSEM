import React from 'react';

export default function SkeletonCard({ type = 'news' }) {
  if (type === 'news') {
    return (
      <div className="card p-0 overflow-hidden">
        <div className="skeleton h-44 w-full rounded-t-xl" />
        <div className="p-4 space-y-3">
          <div className="skeleton h-4 w-3/4 rounded" />
          <div className="skeleton h-4 w-1/2 rounded" />
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-5/6 rounded" />
          <div className="skeleton h-3 w-4/6 rounded" />
          <div className="flex justify-between items-center mt-4">
            <div className="skeleton h-6 w-20 rounded-full" />
            <div className="skeleton h-8 w-24 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'stat') {
    return (
      <div className="card p-5 space-y-3">
        <div className="skeleton h-4 w-1/2 rounded" />
        <div className="skeleton h-8 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/3 rounded" />
      </div>
    );
  }

  if (type === 'astronaut') {
    return (
      <div className="flex items-center gap-3 p-3">
        <div className="skeleton w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-2/3 rounded" />
          <div className="skeleton h-3 w-1/3 rounded" />
        </div>
      </div>
    );
  }

  return <div className="skeleton h-24 w-full rounded-xl" />;
}
