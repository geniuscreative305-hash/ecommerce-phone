'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product, ProductVariant } from '@/types';
import { formatRupiah } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useUserAuth } from '@/context/UserAuthContext';
import {
  Star,
  ShoppingBag,
  ShieldCheck,
  Truck,
  ArrowUpDown,
  Check,
  Plus,
  Minus,
  ArrowLeft,
  Cpu,
  Smartphone,
  HardDrive,
  Radio,
} from 'lucide-react';

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addItem } = useCart();
  const { user, openAuthModal } = useUserAuth();
  const variants = product.variants && product.variants.length > 0
    ? product.variants
    : [
        {
          id: `default-${product.id}`,
          product_id: product.id,
          color_name: 'Standar',
          color_hex: '#0066FF',
          storage: '128GB',
          price: 15999000,
          stock: 10,
        },
      ];

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(variants[0]);
  const [selectedImage, setSelectedImage] = useState<string>(
    product.images[0] || 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop'
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Group unique storage options and color options
  const storageOptions = Array.from(new Set(variants.map((v) => v.storage)));
  const colorOptions = Array.from(
    new Map(variants.map((v) => [v.color_name, { name: v.color_name, hex: v.color_hex }])).values()
  );

  const handleStorageChange = (storage: string) => {
    // Find variant with same color if possible, or fallback to first with this storage
    const match =
      variants.find(
        (v) => v.storage === storage && v.color_name === selectedVariant.color_name
      ) || variants.find((v) => v.storage === storage);
    if (match) setSelectedVariant(match);
  };

  const handleColorChange = (colorName: string) => {
    const match =
      variants.find(
        (v) => v.color_name === colorName && v.storage === selectedVariant.storage
      ) || variants.find((v) => v.color_name === colorName);
    if (match) setSelectedVariant(match);
  };

  const handleAddToCart = () => {
    const doAdd = () => {
      addItem({
        productId: product.id,
        variantId: selectedVariant.id,
        productName: product.name,
        brandName: product.brand?.name || 'Smartphone',
        image: selectedImage,
        colorName: selectedVariant.color_name,
        colorHex: selectedVariant.color_hex,
        storage: selectedVariant.storage,
        price: selectedVariant.price,
        quantity,
        maxStock: selectedVariant.stock,
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    };

    if (!user) {
      openAuthModal('cart', doAdd);
      return;
    }

    doAdd();
  };

  const originalPrice =
    product.discount_percent > 0
      ? Math.round(selectedVariant.price / (1 - product.discount_percent / 100))
      : null;

  return (
    <div className="space-y-8">
      {/* Back breadcrumb */}
      <div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0066FF] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left: Images Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square bg-slate-50 rounded-3xl border border-slate-200/80 p-8 flex items-center justify-center overflow-hidden relative shadow-sm">
            {product.discount_percent > 0 && (
              <span className="absolute top-5 left-5 bg-[#EF4444] text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-sm">
                -{product.discount_percent}% OFF
              </span>
            )}
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-contain filter drop-shadow-md hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-2xl border p-2 flex items-center justify-center bg-slate-50 flex-shrink-0 transition ${
                    selectedImage === img
                      ? 'border-[#0066FF] ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={img} alt={`${product.name} thumbnail`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info & Selectors */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0066FF]">
                {product.brand?.name || 'Smartphone'} Official
              </span>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>4.9 (2.5k reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {product.name}
            </h1>

            {/* Price Box */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {formatRupiah(selectedVariant.price)}
              </span>
              {originalPrice && (
                <span className="text-sm font-semibold text-slate-400 line-through">
                  {formatRupiah(originalPrice)}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">
              {product.description ||
                'Produk bergaransi resmi. Segel box utuh dan nomor IMEI terdaftar resmi di Kemenperin & database garansi Jaya Cell.'}
            </p>
          </div>

          {/* Key Specs Pills (Matching Mockup) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-center">
              <Smartphone className="w-4 h-4 text-[#0066FF] mx-auto mb-1" />
              <div className="text-[11px] font-bold text-slate-900 truncate">
                {product.specs_json?.screen?.split(' ')[0] || '6.3"'}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Display</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-center">
              <HardDrive className="w-4 h-4 text-[#0066FF] mx-auto mb-1" />
              <div className="text-[11px] font-bold text-slate-900">
                {selectedVariant.storage}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Storage</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-center">
              <Cpu className="w-4 h-4 text-[#0066FF] mx-auto mb-1" />
              <div className="text-[11px] font-bold text-slate-900 truncate">
                {product.specs_json?.chipset?.split(' ')[0] || 'A18 Pro'}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Chipset</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-center">
              <Radio className="w-4 h-4 text-[#0066FF] mx-auto mb-1" />
              <div className="text-[11px] font-bold text-slate-900">
                {product.specs_json?.network || '5G Ready'}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Network</div>
            </div>
          </div>

          {/* Color Swatches */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">
                Warna:{' '}
                <span className="font-semibold text-slate-500">
                  {selectedVariant.color_name}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              {colorOptions.map((c) => (
                <button
                  key={c.name}
                  onClick={() => handleColorChange(c.name)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                    selectedVariant.color_name === c.name
                      ? 'border-[#0066FF] bg-blue-50/50 text-[#0066FF] ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/10"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Storage Capacity Selector */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Kapasitas Penyimpanan</span>
              <span className="text-slate-400">
                Sisa Stok: {selectedVariant.stock} unit
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {storageOptions.map((st) => (
                <button
                  key={st}
                  onClick={() => handleStorageChange(st)}
                  className={`py-2.5 px-3 rounded-xl border text-center transition ${
                    selectedVariant.storage === st
                      ? 'border-[#0066FF] bg-[#0066FF] text-white font-bold shadow-md shadow-blue-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-semibold'
                  }`}
                >
                  <span className="text-xs sm:text-sm">{st}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Add to Cart Action */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              {/* Stepper */}
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 h-12">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 h-full text-slate-600 hover:bg-slate-200 transition"
                  aria-label="Kurangi"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3 font-bold text-slate-900 text-sm min-w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(selectedVariant.stock, quantity + 1))
                  }
                  disabled={quantity >= selectedVariant.stock}
                  className="px-3.5 h-full text-slate-600 hover:bg-slate-200 disabled:opacity-30 transition"
                  aria-label="Tambah"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={selectedVariant.stock <= 0}
                className={`flex-1 h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-[0.99] ${
                  added
                    ? 'bg-emerald-600 text-white shadow-emerald-500/25'
                    : selectedVariant.stock <= 0
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-[#0066FF] hover:bg-[#0052cc] text-white shadow-blue-500/25'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Berhasil Masuk Keranjang!</span>
                  </>
                ) : selectedVariant.stock <= 0 ? (
                  <span>Stok Habis</span>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Tambah ke Keranjang</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Trade-in Shortcut Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0066FF] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <ArrowUpDown className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                  Mau Tukar HP Lama dengan Unit Ini?
                </h4>
                <p className="text-[11px] text-slate-600">
                  Hitung nilai taksir dan jadikan potongan diskon langsung saat checkout.
                </p>
              </div>
            </div>
            <Link
              href="/trade-in"
              prefetch={true}
              className="px-3 py-1.5 rounded-lg bg-white border border-blue-200 text-[#0066FF] font-bold text-xs hover:bg-blue-50 transition flex-shrink-0"
            >
              Hitung Sekarang →
            </Link>
          </div>

          {/* Store Promises */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-600 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Garansi Resmi 1 Tahun</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#0066FF]" />
              <span>Pengiriman Berasuransi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

