import React from 'react';
import Link from 'next/link';
import { HeroBanner } from '@/types';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface HeroBannerProps {
  banner: HeroBanner;
}

export default function HeroBannerSection({ banner }: HeroBannerProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="relative rounded-[28px] overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0A101D] text-white shadow-2xl border border-slate-800">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-[460px] lg:min-h-[500px]">
          {/* Left Text Column */}
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>{banner.tag || 'NEW ARRIVAL'}</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                {banner.headline || 'iPhone 16 Pro'}
              </h1>
              <p className="text-slate-300 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
                {banner.subheadline ||
                  'More Power. More Possibilities. Temukan kekuatan chip A18 Pro dengan kamera tercanggih dan desain titanium tangguh.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={banner.cta_link || '/product/iphone-16-pro'}
                prefetch={true}
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold text-sm sm:text-base shadow-xl shadow-blue-500/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>{banner.cta_text || 'Shop Now'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/trade-in"
                prefetch={true}
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold text-sm sm:text-base border border-slate-700 transition"
              >
                <span>Hitung Tukar Tambah</span>
              </Link>
            </div>

            {/* Guarantee highlight badge */}
            <div className="pt-4 flex items-center gap-2 text-xs font-semibold text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{banner.badge_highlight || 'Garansi Resmi iBox / GDN 1 Tahun & Cek IMEI Terjamin'}</span>
            </div>
          </div>

          {/* Right Phone Showcase Column */}
          <div className="lg:col-span-5 relative h-full flex items-center justify-center p-6 sm:p-10 lg:p-8">
            <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
              <img
                src={banner.hero_image || 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1200&auto=format&fit=crop'}
                alt={banner.headline}
                className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,102,255,0.35)] transform hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

