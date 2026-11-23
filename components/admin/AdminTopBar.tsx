'use client';

import React from 'react';
import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import { ExternalLink, User } from 'lucide-react';

export default function AdminTopBar() {
  return (
    <header className="h-12 bg-[#1D2327] text-white flex items-center justify-between px-4 sticky top-0 z-50 select-none shadow-md">
      {/* Left: WordPress Brand & Site Link */}
      <div className="flex items-center gap-4 text-xs font-semibold">
        <Link href="/admin" className="flex items-center gap-2 text-white hover:text-blue-400 transition">
          <BrandLogo size="sm" variant="icon-only" />
          <span className="font-extrabold tracking-tight hidden sm:inline">Jaya Cell Admin CMS</span>
        </Link>

        {/* Persistent "Visit Site" button: Opens / in a NEW browser tab */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded text-xs transition border border-slate-700"
          title="Buka Toko di Tab Baru"
        >
          <span>Kunjungi Toko</span>
          <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
        </Link>
      </div>

      {/* Right: User Profile Indicator */}
      <div className="flex items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <User className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-medium">Administrator</span>
        </div>
      </div>
    </header>
  );
}
