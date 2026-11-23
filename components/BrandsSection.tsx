import React from 'react';
import Link from 'next/link';
import { Brand } from '@/types';
import { ArrowRight } from 'lucide-react';

interface BrandsProps {
  brands: Brand[];
}

export default function BrandsSection({ brands }: BrandsProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Pilihan Brand Resmi
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Jaminan produk 100% original dari produsen smartphone terkemuka dunia.
          </p>
        </div>
        <Link
          href="/shop"
          prefetch={true}
          className="text-xs sm:text-sm font-bold text-[#0066FF] hover:text-[#0052cc] flex items-center gap-1 group"
        >
          <span>Lihat Semua</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/shop?brand=${encodeURIComponent(brand.name)}`}
            prefetch={true}
            className="group flex flex-col items-center justify-center p-4 bg-white border border-slate-200/80 hover:border-blue-400 rounded-2xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5 text-center"
          >
            <div className="w-12 h-12 flex items-center justify-center mb-2 p-1">
              {brand.logo_url ? (
                <img
                  src={brand.logo_url}
                  alt={brand.name}
                  className="max-h-8 max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              ) : (
                <span className="text-sm font-bold text-slate-700">{brand.name[0]}</span>
              )}
            </div>
            <span className="text-xs font-bold text-slate-700 group-hover:text-[#0066FF] transition">
              {brand.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

