'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useUserAuth } from '@/context/UserAuthContext';
import { formatRupiah } from '@/lib/utils';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function CartSlideOver() {
  const router = useRouter();
  const {
    items,
    isOpen,
    setIsOpen,
    removeItem,
    updateQuantity,
    subtotal,
    tradeIn,
    clearTradeIn,
    tradeInDiscount,
    total,
    totalQuantity,
  } = useCart();
  const { user, openAuthModal } = useUserAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#0066FF]" />
              <h2 className="text-lg font-bold text-slate-900">
                Keranjang Belanja <span className="text-sm font-semibold text-slate-400">({totalQuantity})</span>
              </h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
              aria-label="Tutup keranjang"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-16 h-16 bg-blue-50 text-[#0066FF] rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">Keranjang Masih Kosong</h3>
                <p className="text-sm text-slate-500 max-w-xs mt-1 mb-6">
                  Jelajahi smartphone resmi bergaransi impian Anda sekarang!
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2.5 bg-[#0066FF] hover:bg-[#0052cc] text-white rounded-xl text-sm font-semibold transition shadow-md shadow-blue-500/20"
                >
                  Mulai Belanja
                </button>
              </div>
            ) : (
              <div className="space-y-4 py-2">
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-4 pt-3 first:pt-0">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-20 h-20 object-contain rounded-xl bg-slate-50 border border-slate-100 p-1 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm truncate">
                            {item.productName}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-slate-500 font-medium">
                              {item.storage}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block"
                                style={{ backgroundColor: item.colorHex }}
                              />
                              {item.colorName}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="text-slate-400 hover:text-red-500 p-1 transition"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm font-bold text-slate-900">
                          {formatRupiah(item.price)}
                        </span>
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="p-1 px-2 text-slate-500 hover:bg-slate-100 transition"
                            aria-label="Kurangi kuantitas"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 text-xs font-bold text-slate-800 min-w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            disabled={item.quantity >= item.maxStock}
                            className="p-1 px-2 text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition"
                            aria-label="Tambah kuantitas"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Trade-in Applied Strip */}
            {tradeIn && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Tukar Tambah Aktif
                  </div>
                  <div className="text-xs text-emerald-700 mt-0.5">
                    {tradeIn.brand_name} {tradeIn.model_name} ({tradeIn.storage}) - Kondisi: {tradeIn.condition}
                  </div>
                  <div className="text-xs font-bold text-emerald-900 mt-0.5">
                    Potongan: -{formatRupiah(tradeIn.valuation_amount)}
                  </div>
                </div>
                <button
                  onClick={clearTradeIn}
                  className="text-xs text-emerald-600 hover:text-red-500 underline font-medium"
                >
                  Batal
                </button>
              </div>
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="border-t border-slate-100 p-6 bg-slate-50/50 space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">{formatRupiah(subtotal)}</span>
                </div>
                {tradeInDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Diskon Tukar Tambah</span>
                    <span className="font-bold">-{formatRupiah(tradeInDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Ongkos Kirim</span>
                  <span className="font-semibold text-emerald-600">GRATIS</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between text-base font-bold text-slate-900">
                  <span>Total Tagihan</span>
                  <span className="text-[#0066FF]">{formatRupiah(total)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  if (!user) {
                    openAuthModal('checkout', () => {
                      router.push('/checkout');
                    });
                  } else {
                    router.push('/checkout');
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#0066FF] hover:bg-[#0052cc] text-white rounded-xl font-bold shadow-lg shadow-blue-500/25 transition active:scale-[0.99]"
              >
                <span>Lanjut ke Pembayaran</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

