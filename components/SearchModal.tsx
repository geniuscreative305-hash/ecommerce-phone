'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, X, Smartphone, ArrowRight } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_SEARCH_RESULTS = [
  {
    name: 'iPhone 16 Pro',
    brand: 'Apple',
    slug: 'iphone-16-pro',
    price: 20999000,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=400&auto=format&fit=crop',
  },
  {
    name: 'Samsung Galaxy S24',
    brand: 'Samsung',
    slug: 'samsung-galaxy-s24',
    price: 13999000,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=400&auto=format&fit=crop',
  },
  {
    name: 'Google Pixel 9',
    brand: 'Google',
    slug: 'google-pixel-9',
    price: 14499000,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=400&auto=format&fit=crop',
  },
  {
    name: 'OnePlus 12',
    brand: 'OnePlus',
    slug: 'oneplus-12',
    price: 12999000,
    image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=400&auto=format&fit=crop',
  },
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = query.trim()
    ? SAMPLE_SEARCH_RESULTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase())
      )
    : SAMPLE_SEARCH_RESULTS;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative mx-auto max-w-xl rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 divide-y divide-slate-100 overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5">
          <Search className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari tipe HP (iPhone 16 Pro, Galaxy S24, Pixel...)"
            className="w-full bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none text-base"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 bg-slate-100 rounded-md"
          >
            ESC
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-3 space-y-1">
          <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
            {query.trim() ? 'Hasil Pencarian' : 'Rekomendasi Terpopuler'}
          </div>

          {filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              Tidak menemukan smartphone dengan kata kunci "{query}".
            </div>
          ) : (
            filtered.map((item) => (
              <Link
                key={item.slug}
                href={`/product/${item.slug}`}
                onClick={onClose}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 object-contain rounded-lg bg-slate-100 p-1"
                  />
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm group-hover:text-[#0066FF] transition">
                      {item.name}
                    </h5>
                    <span className="text-xs text-slate-400">{item.brand}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">
                    {formatRupiah(item.price)}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#0066FF] group-hover:translate-x-0.5 transition" />
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Gunakan panah atau klik untuk memilih</span>
          <Link
            href="/shop"
            onClick={onClose}
            className="text-[#0066FF] font-semibold hover:underline"
          >
            Lihat Semua Katalog →
          </Link>
        </div>
      </div>
    </div>
  );
}

