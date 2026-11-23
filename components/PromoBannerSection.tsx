import React from 'react';
import Link from 'next/link';
import { PromoBanner } from '@/types';
import { ArrowRight, Sparkles } from 'lucide-react';

interface PromoBannerProps {
  banner: PromoBanner;
}

export default function PromoBannerSection({ banner }: PromoBannerProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="relative rounded-[28px] overflow-hidden bg-gradient-to-r from-[#0F172A] via-[#1A2640] to-[#0A101D] text-white p-8 sm:p-12 border border-slate-800 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-8">
          {/* Left Text */}
          <div className="md:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{banner.tag || 'LIMITED TIME OFFER'}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              {banner.title || 'Diskon Hingga 30%'}
            </h2>

            <p className="text-slate-300 text-sm sm:text-base max-w-lg leading-relaxed">
              {banner.subtitle ||
                'Pada smartphone pilihan bergaransi resmi. Manfaatkan promo trade-in dan bawa pulang flagship idamanmu hari ini!'}
            </p>

            <div className="pt-2">
              <Link
                href={banner.cta_link || '/shop?filter=deals'}
                prefetch={true}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#0066FF] hover:bg-[#0052cc] text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 transition transform hover:-translate-y-0.5"
              >
                <span>{banner.cta_text || 'Lihat Promo'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Showcase & Cursive Note */}
          <div className="md:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-xs aspect-square flex items-center justify-center">
              <img
                src={banner.promo_image || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=800&auto=format&fit=crop'}
                alt={banner.title}
                className="w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,102,255,0.3)] transform -rotate-3 hover:rotate-0 transition-transform duration-500"
              />
              <div className="absolute -bottom-2 -right-2 text-right hidden sm:block">
                <span className="font-serif italic text-cyan-300/80 text-sm tracking-wide block">
                  Better • Faster • Smarter
                </span>
                <span className="text-xs text-cyan-400">Jaya Cell Signature</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

