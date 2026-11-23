'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import { ArrowRight, ShieldCheck, Store } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();

  // Automatically navigate directly to /admin dashboard
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/admin');
    }, 400);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 text-center">
        <div className="flex flex-col items-center space-y-2">
          <BrandLogo size="lg" theme="light" />
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight pt-2">
            Panel Admin & Kasir POS
          </h1>
          <p className="text-xs text-slate-500">
            Akses langsung aktif. Mengalihkan ke dashboard...
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/admin"
            className="w-full py-3.5 bg-[#0066FF] hover:bg-[#0052cc] text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2"
          >
            <Store className="w-4 h-4" />
            <span>Buka Dashboard Admin Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-center gap-2 text-[11px] text-blue-800">
          <ShieldCheck className="w-4 h-4 text-[#0066FF] flex-shrink-0" />
          <span>Mode Akses Langsung Toko Jaya Cell Aktif</span>
        </div>
      </div>
    </div>
  );
}
