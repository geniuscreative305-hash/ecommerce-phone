import React from 'react';

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar skeleton */}
      <div className="h-16 md:h-20 border-b border-slate-100 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-200 animate-pulse" />
          <div className="w-32 h-6 rounded-md bg-slate-200 animate-pulse" />
        </div>
        <div className="hidden md:flex items-center gap-6">
          <div className="w-16 h-4 rounded bg-slate-200 animate-pulse" />
          <div className="w-16 h-4 rounded bg-slate-200 animate-pulse" />
          <div className="w-20 h-4 rounded bg-slate-200 animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse" />
          <div className="w-28 h-10 rounded-full bg-slate-200 animate-pulse" />
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-96 rounded-3xl bg-slate-900/10 animate-shimmer relative overflow-hidden" />
      </div>

      {/* Grid skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-48 h-8 rounded-lg bg-slate-200 animate-pulse mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="border border-slate-100 rounded-2xl p-4 space-y-4 bg-slate-50/50"
            >
              <div className="aspect-square rounded-xl bg-slate-200 animate-pulse" />
              <div className="w-3/4 h-5 rounded bg-slate-200 animate-pulse" />
              <div className="w-1/2 h-4 rounded bg-slate-200 animate-pulse" />
              <div className="w-full h-10 rounded-xl bg-slate-200 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

