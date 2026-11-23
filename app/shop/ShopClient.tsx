'use client';

import React, { useState, useMemo } from 'react';
import { Product, Brand } from '@/types';
import ProductCard from '@/components/ProductCard';
import { Search, Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface ShopClientProps {
  initialProducts: Product[];
  brands: Brand[];
  initialBrand?: string;
  initialQuery?: string;
  initialFilter?: string;
  initialSort?: string;
}

export default function ShopClient({
  initialProducts,
  brands,
  initialBrand,
  initialQuery,
  initialFilter,
  initialSort,
}: ShopClientProps) {
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand || 'all');
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery || '');
  const [sortBy, setSortBy] = useState<string>(initialSort || 'newest');
  const [priceRange, setPriceRange] = useState<number>(35000000);
  const [onlyDeals, setOnlyDeals] = useState<boolean>(initialFilter === 'deals');
  const [onlyPopular, setOnlyPopular] = useState<boolean>(initialFilter === 'popular');

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Brand filter
      if (selectedBrand !== 'all') {
        const brandMatch =
          product.brand?.name.toLowerCase() === selectedBrand.toLowerCase();
        if (!brandMatch) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesBrand = product.brand?.name.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand) return false;
      }

      // Filter popular / deals
      if (onlyDeals && product.discount_percent <= 0 && !product.is_best_deal) {
        return false;
      }
      if (onlyPopular && !product.is_popular) {
        return false;
      }

      // Price limit (checks lowest variant price)
      const lowestPrice =
        product.variants && product.variants.length > 0
          ? Math.min(...product.variants.map((v) => v.price))
          : 0;

      if (lowestPrice > priceRange) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.variants?.[0]?.price || 0;
      const priceB = b.variants?.[0]?.price || 0;

      if (sortBy === 'price_asc') return priceA - priceB;
      if (sortBy === 'price_desc') return priceB - priceA;
      if (sortBy === 'discount') return b.discount_percent - a.discount_percent;
      return 0; // default newest
    });
  }, [
    initialProducts,
    selectedBrand,
    searchQuery,
    sortBy,
    priceRange,
    onlyDeals,
    onlyPopular,
  ]);

  return (
    <div className="space-y-6">
      {/* Title & Filter bar */}
      <div className="border-b border-slate-100 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Katalog Smartphone Resmi
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Menampilkan {filteredProducts.length} smartphone bergaransi resmi siap kirim.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filter Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-6">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Filter className="w-4 h-4 text-[#0066FF]" />
              <span>Filter Produk</span>
            </div>

            {/* Brand Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Brand Smartphone
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedBrand('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    selectedBrand === 'all'
                      ? 'bg-[#0066FF] text-white shadow-sm'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Semua Brand
                </button>
                {brands.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBrand(b.name)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      selectedBrand.toLowerCase() === b.name.toLowerCase()
                        ? 'bg-[#0066FF] text-white shadow-sm'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Max Filter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="uppercase tracking-wider">Harga Maksimal</span>
                <span className="text-[#0066FF]">
                  Rp {(priceRange / 1000000).toFixed(0)} Juta
                </span>
              </div>
              <input
                type="range"
                min="5000000"
                max="35000000"
                step="1000000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#0066FF] cursor-pointer"
              />
            </div>

            {/* Quick Toggle Checkboxes */}
            <div className="space-y-2.5 pt-2 border-t border-slate-200">
              <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyDeals}
                  onChange={(e) => setOnlyDeals(e.target.checked)}
                  className="rounded text-[#0066FF] focus:ring-blue-500 w-4 h-4"
                />
                <span>Hanya Promo & Best Deals</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyPopular}
                  onChange={(e) => setOnlyPopular(e.target.checked)}
                  className="rounded text-[#0066FF] focus:ring-blue-500 w-4 h-4"
                />
                <span>Hanya Best Seller</span>
              </label>
            </div>

            {/* Reset button */}
            <button
              onClick={() => {
                setSelectedBrand('all');
                setSearchQuery('');
                setPriceRange(35000000);
                setOnlyDeals(false);
                setOnlyPopular(false);
              }}
              className="w-full py-2 bg-white border border-slate-200 text-xs font-semibold text-slate-600 rounded-lg hover:bg-slate-100 transition"
            >
              Reset Semua Filter
            </button>
          </div>
        </div>

        {/* Right Product Grid */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Search & Sort Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 border border-slate-200/80 rounded-xl">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari tipe smartphone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 font-semibold focus:outline-none"
              >
                <option value="newest">Terbaru</option>
                <option value="price_asc">Harga Terendah</option>
                <option value="price_desc">Harga Tertinggi</option>
                <option value="discount">Diskon Terbesar</option>
              </select>
            </div>
          </div>

          {/* Product Cards Grid */}
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-800 text-base">
                Tidak ada smartphone yang cocok
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Coba sesuaikan filter brand, harga, atau kata kunci pencarian Anda.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((phone) => (
                <ProductCard key={phone.id} product={phone} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

