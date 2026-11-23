import React from 'react';
import { NewsletterBanner, BrandIdentity } from '@/types';
import { MessageCircle, ShieldCheck } from 'lucide-react';

interface NewsletterSectionProps {
  banner: NewsletterBanner;
  brandIdentity: BrandIdentity;
}

export default function NewsletterSection({ banner, brandIdentity }: NewsletterSectionProps) {
  const phoneDigits = (brandIdentity?.phone || '+62 812-3456-7890').replace(/[^0-9]/g, '');

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="relative rounded-[28px] overflow-hidden bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0A101D] text-white p-8 sm:p-12 border border-slate-800 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Official WhatsApp Helpdesk</span>
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              {banner.title || 'Tetap Terhubung dengan Jaya Cell'}
            </h3>

            <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
              {banner.subtitle ||
                'Dapatkan penawaran flash sale eksklusif, simulasi taksir tukar tambah langsung, dan panduan klaim garansi resmi via WhatsApp resmi kami.'}
            </p>

            <div className="pt-2">
              <a
                href={`https://wa.me/${phoneDigits}?text=Halo%20Jaya%20Cell,%20saya%20ingin%20tanya%20stok%20dan%20promo%20smartphone.`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{banner.whatsapp_cta || 'Chat CS WhatsApp Sekarang'}</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-4 flex items-center justify-center lg:justify-end">
            <div className="text-center lg:text-right space-y-1">
              <span className="font-serif italic text-blue-300/80 text-xl tracking-wide block">
                Your Next Phone Awaits ♡
              </span>
              <span className="text-xs text-slate-400 block">
                Buka Setiap Hari: 09:00 - 21:30 WIB
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

