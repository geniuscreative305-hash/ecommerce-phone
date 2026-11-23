'use client';

import React from 'react';
import Link from 'next/link';
import { Edit3 } from 'lucide-react';

export default function QuickEditButton() {
  return (
    <div className="fixed bottom-6 right-6 z-40 print:hidden animate-bounce">
      <Link
        href="/admin/cms"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/90 hover:bg-slate-900 text-white font-semibold text-xs rounded-full shadow-2xl backdrop-blur-md border border-slate-700 hover:border-blue-500 transition-all group"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform" />
        <Edit3 className="w-3.5 h-3.5 text-blue-400" />
        <span>Edit Halaman Ini</span>
      </Link>
    </div>
  );
}
