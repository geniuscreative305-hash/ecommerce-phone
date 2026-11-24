'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  DEFAULT_BRAND_IDENTITY,
  DEFAULT_HERO_BANNER,
  DEFAULT_PROMO_BANNER,
  DEFAULT_STORE_USP,
  DEFAULT_NEWSLETTER,
  DEFAULT_FOOTER_INFO,
  DEFAULT_PAYMENT_SETTINGS,
} from '@/lib/constants';
import { saveSiteSettings } from './actions';
import { createClient } from '@/lib/supabase/client';
import {
  Settings,
  Image as ImageIcon,
  CheckCircle2,
  Upload,
  Camera,
  Loader2,
  ExternalLink,
  AlertCircle,
  CreditCard,
  QrCode,
  ShieldCheck,
} from 'lucide-react';

// Fixed deterministic filenames per slot → auto-overwrite, hemat storage
const FIXED_FILENAMES: Record<string, string> = {
  logos: 'logos/brand-logo',
  favicons: 'favicons/brand-favicon',
  banners: 'banners/hero-banner',
  'banners-promo': 'banners/promo-banner',
  qris: 'qris/official-bank-qris',
};

/**
 * Reusable Device Image Uploader Component for CMS
 * Supports uploading from Laptop explorer, HP gallery, or camera
 * Uses FIXED deterministic filename → upsert overwrites old file automatically
 */
function DeviceImageUploader({
  label,
  value,
  onChange,
  folder = 'cms',
  filenameKey,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  filenameKey?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Strict File Validation (2MB Limit + Safe MIME types only)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Format file tidak diizinkan. Hanya format JPG, PNG, dan WEBP yang didukung.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const MAX_SIZE = 2 * 1024 * 1024; // 2MB
    if (file.size > MAX_SIZE) {
      setUploadError(
        `Ukuran file melebihi batas 2MB (ukuran file: ${(file.size / (1024 * 1024)).toFixed(2)}MB).`
      );
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result as string;
      onChange(base64Data); // local preview
    };
    reader.readAsDataURL(file);

    try {
      const supabase = createClient();

      // Determine fixed filename (no timestamp) → same path = overwrite old file
      const key = filenameKey || folder;
      const fixedBase = FIXED_FILENAMES[key] || `${folder}/main-image`;
      // Preserve original extension
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const filePath = `${fixedBase}.${ext}`;

      // Upload with upsert:true → overwrites existing file at same path
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('jaya-cell-assets')
        .upload(filePath, file, {
          upsert: true,
          cacheControl: '3600',
          contentType: file.type,
        });

      if (uploadError) {
        // Fallback: keep base64 preview but warn user
        setUploadError(
          `Upload ke Supabase Storage gagal: ${uploadError.message}. Gambar tersimpan sebagai data lokal sementara.`
        );
        setUploading(false);
        return;
      }

      if (uploadData) {
        // Add cache-buster so browser reloads the overwritten image
        const { data: publicUrlData } = supabase.storage
          .from('jaya-cell-assets')
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          const cacheBustedUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;
          onChange(cacheBustedUrl);
          setUploadSuccess(true);
          setTimeout(() => setUploadSuccess(false), 3000);
        }
      }
    } catch (err: any) {
      setUploadError(`Error: ${err.message}`);
    } finally {
      setUploading(false);
      // Reset input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
      <div className="flex items-center justify-between">
        <label className="font-bold text-slate-800 text-xs">{label}</label>
        {uploading && (
          <span className="flex items-center gap-1 text-[11px] text-[#0066FF] font-semibold">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Mengupload & menimpa file lama...</span>
          </span>
        )}
        {uploadSuccess && !uploading && (
          <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Upload berhasil! File lama tertimpa.</span>
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Thumbnail Preview */}
        <div className="w-20 h-20 rounded-xl border border-slate-300 bg-white p-1.5 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-inner">
          {value ? (
            <img src={value} alt="Preview" className="w-full h-full object-contain" />
          ) : (
            <ImageIcon className="w-7 h-7 text-slate-300" />
          )}
        </div>

        {/* Buttons */}
        <div className="flex-1 space-y-2 w-full">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold text-xs rounded-xl shadow-sm transition active:scale-95 disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload dari Perangkat Ini</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl transition disabled:opacity-50"
            >
              <Camera className="w-3.5 h-3.5 text-slate-500" />
              <span>Galeri / Kamera HP</span>
            </button>
          </div>

          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Atau tempel URL gambar (https://...)"
            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] font-mono text-slate-700"
          />

          {uploadError && (
            <div className="flex items-start gap-1.5 text-[11px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-2.5 py-2">
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminCMSPage() {
  // Brand Identity states — loaded from Supabase on mount
  const [brandIdentity, setBrandIdentity] = useState(DEFAULT_BRAND_IDENTITY);
  const [heroBanner, setHeroBanner] = useState(DEFAULT_HERO_BANNER);
  const [promoBanner, setPromoBanner] = useState(DEFAULT_PROMO_BANNER);
  const [storeUSP, setStoreUSP] = useState(DEFAULT_STORE_USP);
  const [newsletter, setNewsletter] = useState(DEFAULT_NEWSLETTER);
  const [footerInfo, setFooterInfo] = useState(DEFAULT_FOOTER_INFO);
  const [paymentSettings, setPaymentSettings] = useState(DEFAULT_PAYMENT_SETTINGS);
  const [loadingData, setLoadingData] = useState(true);

  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [savedSection, setSavedSection] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Load current settings from Supabase on page open
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('site_settings').select('*');

        if (!error && data && data.length > 0) {
          const map = new Map<string, any>();
          data.forEach((row) => map.set(row.section_key, row.content_json));

          if (map.has('brand_identity')) setBrandIdentity(map.get('brand_identity'));
          if (map.has('hero_banner')) setHeroBanner(map.get('hero_banner'));
          if (map.has('promo_banner')) setPromoBanner(map.get('promo_banner'));
          if (map.has('store_usp')) setStoreUSP(map.get('store_usp'));
          if (map.has('newsletter_banner')) setNewsletter(map.get('newsletter_banner'));
          if (map.has('footer_info')) setFooterInfo(map.get('footer_info'));
          if (map.has('payment_settings')) setPaymentSettings(map.get('payment_settings'));
        }
      } catch {
        // Silently fall back to defaults
      } finally {
        setLoadingData(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async (sectionKey: string, payload: any) => {
    setSavingSection(sectionKey);
    setSavedSection(null);
    setSaveError(null);
    try {
      const result = await saveSiteSettings(sectionKey, payload);
      if (result.success) {
        setSavedSection(sectionKey);
        setTimeout(() => setSavedSection(null), 2500);
      } else {
        setSaveError(result.error || 'Gagal menyimpan ke database.');
      }
    } catch (err: any) {
      setSaveError(err.message);
    } finally {
      setSavingSection(null);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-[#0066FF]" />
          <span className="text-sm font-semibold">Memuat pengaturan toko dari database...</span>
        </div>
      </div>
    );
  }

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
            Edit logo, favicon, banner promo & USP. Semua gambar bisa di-upload langsung dari galeri laptop, HP, atau tablet!
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

      {/* Global save error */}
      {saveError && (
        <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span><strong>Gagal menyimpan:</strong> {saveError}</span>
        </div>
      )}

      {/* 1. Brand Identity & Dynamic Favicon */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="font-extrabold text-slate-900 text-base">
              1. Brand Identity & Favicon Dinamis
            </h2>
            <p className="text-[11px] text-slate-400">
              Ubah nama toko, upload logo baru, dan ganti icon favicon browser dari perangkat Anda.
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

          {/* Upload Logo from Device */}
          <div className="sm:col-span-2">
            <DeviceImageUploader
              label="Upload Custom Logo Toko (Dari Laptop / HP / Tab)"
              value={brandIdentity.logo_url}
              onChange={(url) => setBrandIdentity({ ...brandIdentity, logo_url: url })}
              folder="logos"
              filenameKey="logos"
            />
          </div>

          {/* Upload Favicon from Device */}
          <div className="sm:col-span-2">
            <DeviceImageUploader
              label="Upload Favicon Tab Browser (Icon Browser Tab)"
              value={brandIdentity.favicon_url}
              onChange={(url) => setBrandIdentity({ ...brandIdentity, favicon_url: url })}
              folder="favicons"
              filenameKey="favicons"
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

          {/* Upload Hero Banner from Device - deterministic path: banners/hero-banner.{ext} */}
          <DeviceImageUploader
            label="Upload Foto Smartphone Hero Banner (Dari Laptop / HP / Tab)"
            value={heroBanner.hero_image}
            onChange={(url) => setHeroBanner({ ...heroBanner, hero_image: url })}
            folder="banners"
            filenameKey="banners"
          />
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
              Banner penawaran diskon di tengah beranda toko.
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

          {/* Upload Promo Banner from Device - deterministic path: banners/promo-banner.{ext} */}
          <div className="sm:col-span-2">
            <DeviceImageUploader
              label="Upload Foto Showcase Promo Banner (Dari Laptop / HP / Tab)"
              value={promoBanner.promo_image}
              onChange={(url) => setPromoBanner({ ...promoBanner, promo_image: url })}
              folder="banners"
              filenameKey="banners-promo"
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
                    updated[idx] = { ...updated[idx], title: e.target.value };
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
                    updated[idx] = { ...updated[idx], desc: e.target.value };
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

      {/* SECTION 7: QRIS & BANK TRANSFER PAYMENT SETTINGS */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Metode Pembayaran & QRIS Bank Resmi
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Super Secure
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Upload QR Code QRIS resmi dari bank mitra dan kelola rekening transfer untuk pelanggan toko.
              </p>
            </div>
          </div>
          {savedSection === 'payment_settings' && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
              <span>Tersimpan!</span>
            </div>
          )}
        </div>

        {/* Security Alert Note */}
        <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl flex items-start gap-2.5 text-xs text-blue-900 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Keamanan Terproteksi Tingkat Server:</span> Gambar QRIS disimpan secara terenkripsi di Supabase Storage dan hanya dapat diubah oleh Super Admin yang terverifikasi di daftar whitelist. Setiap perubahan tercatat otomatis pada Audit Log.
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* QRIS Official Image Uploader */}
          <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-xs text-slate-800 flex items-center gap-2">
              <QrCode className="w-4 h-4 text-blue-600" />
              Upload QR Code QRIS Bank Resmi
            </h4>
            <p className="text-[11px] text-slate-500">
              Gunakan QRIS Statis/Dinamis resmi yang diterbitkan oleh Bank (BCA Merchant, Mandiri, BRI, dll). Format: JPG, PNG, WEBP (Maksimal 2MB).
            </p>

            <DeviceImageUploader
              label="Foto / Gambar QRIS Resmi Bank"
              value={paymentSettings.qris_image_url}
              onChange={(url) => setPaymentSettings({ ...paymentSettings, qris_image_url: url })}
              folder="qris"
              filenameKey="qris"
            />
          </div>

          {/* Bank Transfer Details Form */}
          <div className="space-y-3.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-xs text-slate-800 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-600" />
              Informasi Rekening Transfer Bank
            </h4>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 text-xs">Nama Bank</label>
              <input
                type="text"
                value={paymentSettings.bank_name}
                onChange={(e) =>
                  setPaymentSettings({ ...paymentSettings, bank_name: e.target.value })
                }
                placeholder="Contoh: BCA (Bank Central Asia)"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 text-xs">Nomor Rekening</label>
              <input
                type="text"
                value={paymentSettings.bank_account_number}
                onChange={(e) =>
                  setPaymentSettings({ ...paymentSettings, bank_account_number: e.target.value })
                }
                placeholder="Contoh: 8830-1234-5678"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 text-xs">Atas Nama Rekening</label>
              <input
                type="text"
                value={paymentSettings.bank_account_holder}
                onChange={(e) =>
                  setPaymentSettings({ ...paymentSettings, bank_account_holder: e.target.value })
                }
                placeholder="Contoh: JAYA CELL INDONESIA"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 text-xs">Petunjuk Pembayaran</label>
              <textarea
                rows={2}
                value={paymentSettings.payment_instructions || ''}
                onChange={(e) =>
                  setPaymentSettings({ ...paymentSettings, payment_instructions: e.target.value })
                }
                placeholder="Petunjuk singkat untuk pelanggan saat transfer..."
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => handleSave('payment_settings', paymentSettings)}
            disabled={savingSection === 'payment_settings'}
            className="px-5 py-2.5 bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
          >
            {savingSection === 'payment_settings' ? 'Menyimpan...' : 'Simpan Pengaturan Pembayaran & QRIS'}
          </button>
        </div>
      </div>
    </div>
  );
}
