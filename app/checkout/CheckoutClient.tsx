'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useUserAuth } from '@/context/UserAuthContext';
import { formatRupiah } from '@/lib/utils';
import { placeOrderAction } from './actions';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Building2,
  Truck,
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
  Clock,
  MapPin,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export default function CheckoutClient() {
  const {
    items,
    subtotal,
    tradeIn,
    tradeInDiscount,
    total,
    clearCart,
  } = useCart();
  const { user, openAuthModal } = useUserAuth();

  const [step, setStep] = useState<'form' | 'success'>('form');
  const [createdOrderNumber, setCreatedOrderNumber] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [idempotencyKey, setIdempotencyKey] = useState('');

  // Generate unique UUID idempotencyKey once when checkout mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const generated =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `idemp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      setIdempotencyKey(generated);
    }
  }, []);

  // Form states
  const [customerName, setCustomerName] = useState(user?.user_metadata?.full_name || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string>('qris');

  useEffect(() => {
    if (user?.user_metadata?.full_name && !customerName) {
      setCustomerName(user.user_metadata.full_name);
    }
  }, [user]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || isSubmitting) return;

    if (!user) {
      openAuthModal('checkout');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const result = await placeOrderAction({
        idempotencyKey: idempotencyKey || `fallback-${Date.now()}`,
        customerName,
        customerPhone,
        shippingAddress,
        city,
        postalCode,
        paymentMethod,
        tradeInInfo: tradeIn || null,
        tradeInDiscount,
        totalAmount: total,
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          productName: i.productName,
          colorName: i.colorName,
          storage: i.storage,
          quantity: i.quantity,
          price: i.price,
        })),
      });

      if (!result.success) {
        setErrorMessage(result.error || 'Gagal memproses pesanan. Silakan coba lagi.');
        setIsSubmitting(false);
        return;
      }

      setCreatedOrderNumber(result.orderNumber || 'JC-ORD-SUCCESS');
      clearCart();
      setStep('success');
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal memproses pesanan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center shadow-xl space-y-6">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Order Placed Successfully!
          </h1>
          <p className="text-sm text-slate-500">
            Terima kasih atas pesanan Anda. Kami segera memproses unit bergaransi resmi pilihan Anda.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Nomor Pesanan:</span>
            <span className="font-extrabold text-[#0066FF] tracking-wider font-mono text-sm">
              {createdOrderNumber}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Total Pembayaran:</span>
            <span className="font-bold text-slate-800">{formatRupiah(total)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Metode:</span>
            <span className="font-semibold text-slate-700 uppercase">
              {paymentMethod.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Link
            href={`/track?order=${createdOrderNumber}`}
            prefetch={true}
            className="w-full sm:flex-1 py-3.5 bg-[#0066FF] hover:bg-[#0052cc] text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2"
          >
            <Clock className="w-4 h-4" />
            <span>Lacak Status Pesanan</span>
          </Link>
          <Link
            href="/"
            prefetch={true}
            className="w-full sm:flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition"
          >
            Lanjut Belanja
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-md space-y-4">
        <div className="w-16 h-16 bg-blue-50 text-[#0066FF] rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Keranjang Masih Kosong</h2>
        <p className="text-xs text-slate-500">
          Silakan pilih smartphone impian Anda sebelum melakukan checkout.
        </p>
        <Link
          href="/shop"
          prefetch={true}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#0066FF] text-white font-bold text-xs rounded-xl hover:bg-[#0052cc] transition"
        >
          <span>Pilih Smartphone</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Formulir Checkout & Pembayaran
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Lengkapi data pengiriman dan pilih metode pembayaran resmi Anda.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Shipping Address & Payment Selection */}
        <div className="lg:col-span-7 space-y-6">
          {/* Shipping Form Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <MapPin className="w-5 h-5 text-[#0066FF]" />
              <h2 className="font-bold text-slate-900 text-base">Alamat Pengiriman</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700">Nama Penerima Lengkap *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700">Nomor Telepon / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="081234567890"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700">Alamat Lengkap (Jalan, RT/RW, No. Rumah) *</label>
                <textarea
                  required
                  rows={2}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Jl. Melati No. 12, Kel. Menteng, Kec. Menteng"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Kota / Kabupaten *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Jakarta Pusat"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Kode Pos *</label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="10310"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <CreditCard className="w-5 h-5 text-[#0066FF]" />
              <h2 className="font-bold text-slate-900 text-base">Metode Pembayaran</h2>
            </div>

            <div className="space-y-2.5">
              <label
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                  paymentMethod === 'qris'
                    ? 'border-[#0066FF] bg-blue-50/50 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="qris"
                    checked={paymentMethod === 'qris'}
                    onChange={() => setPaymentMethod('qris')}
                    className="text-[#0066FF] focus:ring-blue-500 w-4 h-4"
                  />
                  <div>
                    <div className="font-bold text-xs text-slate-900">QRIS Instan (BCA, GoPay, OVO, Dana)</div>
                    <div className="text-[11px] text-slate-500">Konfirmasi pembayaran otomatis dalam hitungan detik</div>
                  </div>
                </div>
                <QrCode className="w-5 h-5 text-[#0066FF]" />
              </label>

              <label
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                  paymentMethod === 'bank_va'
                    ? 'border-[#0066FF] bg-blue-50/50 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="bank_va"
                    checked={paymentMethod === 'bank_va'}
                    onChange={() => setPaymentMethod('bank_va')}
                    className="text-[#0066FF] focus:ring-blue-500 w-4 h-4"
                  />
                  <div>
                    <div className="font-bold text-xs text-slate-900">Transfer Bank / Virtual Account</div>
                    <div className="text-[11px] text-slate-500">BCA, Mandiri, BNI, BRI</div>
                  </div>
                </div>
                <Building2 className="w-5 h-5 text-slate-600" />
              </label>

              <label
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                  paymentMethod === 'cod_pickup'
                    ? 'border-[#0066FF] bg-blue-50/50 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="cod_pickup"
                    checked={paymentMethod === 'cod_pickup'}
                    onChange={() => setPaymentMethod('cod_pickup')}
                    className="text-[#0066FF] focus:ring-blue-500 w-4 h-4"
                  />
                  <div>
                    <div className="font-bold text-xs text-slate-900">COD / Ambil di Konter Jaya Cell</div>
                    <div className="text-[11px] text-slate-500">Bayar langsung saat unit diambil di toko fisik</div>
                  </div>
                </div>
                <Truck className="w-5 h-5 text-slate-600" />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-sm sticky top-24">
            <h2 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
              Ringkasan Pesanan ({items.length} item)
            </h2>

            {/* Items list */}
            <div className="space-y-3 max-h-60 overflow-y-auto divide-y divide-slate-100 pr-1">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-3 pt-3 first:pt-0">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-14 h-14 object-contain rounded-lg bg-slate-50 border border-slate-100 p-1 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 text-xs truncate">
                      {item.productName}
                    </h4>
                    <div className="text-[11px] text-slate-500">
                      {item.storage} • {item.colorName} (x{item.quantity})
                    </div>
                    <div className="text-xs font-extrabold text-slate-900 mt-0.5">
                      {formatRupiah(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trade-in Applied Strip */}
            {tradeIn && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Potongan Tukar Tambah Aktif
                </div>
                <div className="text-[11px] text-emerald-700 mt-0.5">
                  Unit: {tradeIn.brand_name} {tradeIn.model_name} ({tradeIn.storage})
                </div>
                <div className="text-xs font-extrabold text-emerald-900 mt-1">
                  -{formatRupiah(tradeInDiscount)}
                </div>
              </div>
            )}

            {/* Price Calculations */}
            <div className="space-y-2 border-t border-slate-100 pt-4 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Produk</span>
                <span className="font-semibold text-slate-900">{formatRupiah(subtotal)}</span>
              </div>
              {tradeInDiscount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Diskon Tukar Tambah</span>
                  <span className="font-bold">-{formatRupiah(tradeInDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Ongkos Kirim</span>
                <span className="font-semibold text-emerald-600">GRATIS</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Asuransi Pengiriman</span>
                <span className="font-semibold text-slate-900">Termasuk</span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between text-base font-extrabold text-slate-900">
                <span>Total Bayar</span>
                <span className="text-[#0066FF]">{formatRupiah(total)}</span>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#0066FF] hover:bg-[#0052cc] text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-500/25 transition active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memproses Pesanan...</span>
                </>
              ) : (
                <>
                  <span>Konfirmasi & Buat Pesanan</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

