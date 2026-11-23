'use client';

import React, { useState } from 'react';
import {
  DEFAULT_BRAND_IDENTITY,
  DEFAULT_HERO_BANNER,
  DEFAULT_PROMO_BANNER,
  DEFAULT_STORE_USP,
  DEFAULT_NEWSLETTER,
  DEFAULT_FOOTER_INFO,
} from '@/lib/constants';
import { saveSiteSettings } from './actions';
import {
  Settings,
  Image as ImageIcon,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export default function AdminCMSPage() {
  // Brand Identity states
  const [brandIdentity, setBrandIdentity] = useState(DEFAULT_BRAND_IDENTITY);
  // Hero states
  const [heroBanner, setHeroBanner] = useState(DEFAULT_HERO_BANNER);
  // Promo states
  const [promoBanner, setPromoBanner] = useState(DEFAULT_PROMO_BANNER);
  // USP states
  const [storeUSP, setStoreUSP] = useState(DEFAULT_STORE_USP);
  // Newsletter states
  const [newsletter, setNewsletter] = useState(DEFAULT_NEWSLETTER);
  // Footer states
  const [footerInfo, setFooterInfo] = useState(DEFAULT_FOOTER_INFO);

  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [savedSection, setSavedSection] = useState<string | null>(null);

  const handleSave = async (sectionKey: string, payload: any) => {
    setSavingSection(sectionKey);
    setSavedSection(null);
    try {
      await saveSiteSettings(sectionKey, payload);
      setSavedSection(sectionKey);
      setTimeout(() => setSavedSection(null), 2500);
    } catch {
      // Ignored
    } finally {
      setSavingSection(null);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Settings className="w-7 h-7 text-[#0066FF]" />
            <span>Tampilan & Konten Toko (CMS)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Edit logo, banner promo, USP dan footer toko secara visual ala WordPress. Perubahan langsung aktif di storefront!
          </p>
        </div>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
        >
          <span>Cek Hasil Storefront</span>
          <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
        </a>
      </div>

      {/* 1. Brand Identity & Dynamic Favicon */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="font-extrabold text-slate-900 text-base">
              1. Brand Identity & Favicon Dinamis
            </h2>
            <p className="text-[11px] text-slate-400">
              Mengubah nama toko, logo header, serta favicon browser tab secara real-time.
            </p>
          </div>
          {savedSection === 'brand_identity' && (
            <span className="flex items-center gap-1 text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full">
              <CheckCircle2 className="w-4 h-4" />
              <span>Tersimpan!</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Nama Merek / Toko</label>
            <input
              type="text"
              value={brandIdentity.brand_name}
              onChange={(e) =>
                setBrandIdentity({ ...brandIdentity, brand_name: e.target.value })
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Tagline Toko</label>
            <input
              type="text"
              value={brandIdentity.tagline}
              onChange={(e) =>
                setBrandIdentity({ ...brandIdentity, tagline: e.target.value })
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="font-bold text-slate-700">
              Custom Logo Image URL (Kosongkan jika memakai vector default SVG emblem Jaya Cell)
            </label>
            <input
              type="text"
              placeholder="https://.../logo.png"
              value={brandIdentity.logo_url}
              onChange={(e) =>
                setBrandIdentity({ ...brandIdentity, logo_url: e.target.value })
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="font-bold text-slate-700">
              Dynamic Favicon URL (Browser Tab Icon)
            </label>
            <input
              type="text"
              placeholder="https://.../favicon.ico atau tinggalkan kosong untuk /icon.svg default"
              value={brandIdentity.favicon_url}
              onChange={(e) =>
                setBrandIdentity({ ...brandIdentity, favicon_url: e.target.value })
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">No. WhatsApp Toko</label>
            <input
              type="text"
              value={brandIdentity.phone}
              onChange={(e) =>
                setBrandIdentity({ ...brandIdentity, phone: e.target.value })
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Email Customer Service</label>
            <input
              type="email"
              value={brandIdentity.email}
              onChange={(e) =>
                setBrandIdentity({ ...brandIdentity, email: e.target.value })
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => handleSave('brand_identity', brandIdentity)}
            disabled={savingSection === 'brand_identity'}
            className="px-5 py-2.5 bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
          >
            {savingSection === 'brand_identity' ? 'Menyimpan...' : 'Simpan Identitas Brand'}
          </button>
        </div>
      </div>

      {/* 2. Hero Banner Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="font-extrabold text-slate-900 text-base">
              2. Hero Banner Utama
            </h2>
            <p className="text-[11px] text-slate-400">
              Banner dark navy di bagian paling atas beranda toko.
            </p>
          </div>
          {savedSection === 'hero_banner' && (
            <span className="flex items-center gap-1 text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full">
              <CheckCircle2 className="w-4 h-4" />
              <span>Tersimpan!</span>
            </span>
          )}
        </div>

        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Badge Tag</label>
              <input
                type="text"
                value={heroBanner.tag}
                onChange={(e) => setHeroBanner({ ...heroBanner, tag: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Headline Produk</label>
              <input
                type="text"
                value={heroBanner.headline}
                onChange={(e) =>
                  setHeroBanner({ ...heroBanner, headline: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Subheadline / Deskripsi Promo</label>
            <textarea
              rows={2}
              value={heroBanner.subheadline}
              onChange={(e) =>
                setHeroBanner({ ...heroBanner, subheadline: e.target.value })
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Teks Tombol CTA</label>
              <input
                type="text"
                value={heroBanner.cta_text}
                onChange={(e) =>
                  setHeroBanner({ ...heroBanner, cta_text: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Link Tombol CTA</label>
              <input
                type="text"
                value={heroBanner.cta_link}
                onChange={(e) =>
                  setHeroBanner({ ...heroBanner, cta_link: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">URL Gambar Smartphone Hero</label>
            <input
              type="text"
              value={heroBanner.hero_image}
              onChange={(e) =>
                setHeroBanner({ ...heroBanner, hero_image: e.target.value })
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => handleSave('hero_banner', heroBanner)}
            disabled={savingSection === 'hero_banner'}
            className="px-5 py-2.5 bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
          >
            {savingSection === 'hero_banner' ? 'Menyimpan...' : 'Simpan Hero Banner'}
          </button>
        </div>
      </div>

      {/* 3. Promo Banner Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="font-extrabold text-slate-900 text-base">
              3. Promo Banner (Limited Time Offer)
            </h2>
            <p className="text-[11px] text-slate-400">
              Banner penawaran diskon di tengah beranda.
            </p>
          </div>
          {savedSection === 'promo_banner' && (
            <span className="flex items-center gap-1 text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full">
              <CheckCircle2 className="w-4 h-4" />
              <span>Tersimpan!</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1 sm:col-span-2">
            <label className="font-bold text-slate-700">Judul Promo Besar</label>
            <input
              type="text"
              value={promoBanner.title}
              onChange={(e) => setPromoBanner({ ...promoBanner, title: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="font-bold text-slate-700">Deskripsi Singkat</label>
            <input
              type="text"
              value={promoBanner.subtitle}
              onChange={(e) =>
                setPromoBanner({ ...promoBanner, subtitle: e.target.value })
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="font-bold text-slate-700">URL Gambar Showcase HP</label>
            <input
              type="text"
              value={promoBanner.promo_image}
              onChange={(e) =>
                setPromoBanner({ ...promoBanner, promo_image: e.target.value })
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => handleSave('promo_banner', promoBanner)}
            disabled={savingSection === 'promo_banner'}
            className="px-5 py-2.5 bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
          >
            {savingSection === 'promo_banner' ? 'Menyimpan...' : 'Simpan Promo Banner'}
          </button>
        </div>
      </div>

      {/* 4. Store USP Strip */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="font-extrabold text-slate-900 text-base">
              4. 4-Kolom Keunggulan Toko (USP Strip)
            </h2>
            <p className="text-[11px] text-slate-400">
              Trust bar 4 pilar kepercayaan pelanggan Jaya Cell.
            </p>
          </div>
          {savedSection === 'store_usp' && (
            <span className="flex items-center gap-1 text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full">
              <CheckCircle2 className="w-4 h-4" />
              <span>Tersimpan!</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {storeUSP.map((usp, idx) => (
            <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Judul USP #{idx + 1}</label>
                <input
                  type="text"
                  value={usp.title}
                  onChange={(e) => {
                    const updated = [...storeUSP];
                    updated[idx].title = e.target.value;
                    setStoreUSP(updated);
                  }}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-600 text-[11px]">Keterangan</label>
                <input
                  type="text"
                  value={usp.desc}
                  onChange={(e) => {
                    const updated = [...storeUSP];
                    updated[idx].desc = e.target.value;
                    setStoreUSP(updated);
                  }}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => handleSave('store_usp', storeUSP)}
            disabled={savingSection === 'store_usp'}
            className="px-5 py-2.5 bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
          >
            {savingSection === 'store_usp' ? 'Menyimpan...' : 'Simpan 4-USP Toko'}
          </button>
        </div>
      </div>
    </div>
  );
}

