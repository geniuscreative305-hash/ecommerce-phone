'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useUserAuth } from '@/context/UserAuthContext';
import { formatRupiah } from '@/lib/utils';
import { placeOrderAction } from './actions';
import { PaymentSettings } from '@/types';
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
  Copy,
  Check,
  Package,
  MessageCircle,
  Download,
} from 'lucide-react';

interface CheckoutClientProps {
  paymentSettings?: PaymentSettings;
  brandPhone?: string;
  brandName?: string;
}

export default function CheckoutClient({
  paymentSettings,
  brandPhone = '+62 812-3456-7890',
  brandName = 'Jaya Cell',
}: CheckoutClientProps) {
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
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedOrder, setCopiedOrder] = useState(false);

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
    const waMessage = encodeURIComponent(
      `Halo ${brandName}, saya ingin konfirmasi pesanan saya:\n\nNomor Pesanan: ${createdOrderNumber}\nTotal Tagihan: ${formatRupiah(total)}\nMetode: ${paymentMethod.replace('_', ' ').toUpperCase()}\nNama Penerima: ${customerName}\n\nMohon bantuannya untuk diproses. Terima kasih!`
    );

    return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 text-center shadow-2xl space-y-6">
        {/* Animated Celebration Icon */}
        <div className="relative w-20 h-20 mx-auto">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-inner animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold animate-ping opacity-75" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Pembayaran & Pesanan Diterima!</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Transaksi Berhasil Dikonfirmasi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Terima kasih telah berbelanja di {brandName}. Unit smartphone resmi bergaransi Anda segera disiapkan oleh tim logistik kami.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-2.5 shadow-sm">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Nomor Pesanan:</span>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-[#0066FF] tracking-wider font-mono text-sm">
                {createdOrderNumber}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (typeof navigator !== 'undefined') {
                    navigator.clipboard.writeText(createdOrderNumber);
                    setCopiedOrder(true);
                    setTimeout(() => setCopiedOrder(false), 2000);
                  }
                }}
                className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-800 transition"
                title="Salin Nomor Pesanan"
              >
                {copiedOrder ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500 font-medium">Total Pembayaran:</span>
            <span className="font-extrabold text-slate-900">{formatRupiah(total)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500 font-medium">Metode Pembayaran:</span>
            <span className="font-bold text-slate-700 uppercase">
              {paymentMethod.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Real-time Order Tracking Stepper */}
        <div className="border border-slate-200 rounded-2xl p-4 sm:p-5 bg-white text-left space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              Status Tracking Pesanan Realtime:
            </span>
            <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              Update Otomatis
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-2 text-center">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs mb-1.5 shadow-sm">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-slate-800 leading-tight">
                Pesanan Dibuat
              </span>
              <span className="text-[9px] text-emerald-600 font-semibold mt-0.5">Selesai</span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white ring-4 ring-blue-100 flex items-center justify-center font-bold text-xs mb-1.5 shadow-md scale-105">
                <Package className="w-4 h-4 animate-pulse" />
              </div>
              <span className="text-[10px] font-extrabold text-blue-700 leading-tight">
                Sedang Dikemas
              </span>
              <span className="text-[9px] text-blue-600 font-semibold mt-0.5">Cek IMEI</span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center font-bold text-xs mb-1.5">
                <Truck className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold text-slate-400 leading-tight">
                Dalam Pengiriman
              </span>
              <span className="text-[9px] text-slate-400 mt-0.5">Kurir</span>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center font-bold text-xs mb-1.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold text-slate-400 leading-tight">
                Pesanan Selesai
              </span>
              <span className="text-[9px] text-slate-400 mt-0.5">Diterima</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <Link
            href={`/track?order=${createdOrderNumber}`}
            prefetch={true}
            className="w-full py-3.5 bg-[#0066FF] hover:bg-[#0052cc] text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2"
          >
            <Clock className="w-4 h-4" />
            <span>Lacak Status Pesanan Lengkap</span>
          </Link>

          <a
            href={`https://wa.me/${brandPhone.replace(/[^0-9]/g, '')}?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Konfirmasi Pembayaran via WhatsApp</span>
          </a>

          <Link
            href="/"
            prefetch={true}
            className="inline-block text-xs font-semibold text-slate-500 hover:text-slate-800 transition pt-1"
          >
            ← Kembali ke Beranda
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

            {/* QRIS Official Bank Payment Details Box */}
            {paymentMethod === 'qris' && (
              <div className="p-4 bg-slate-50 border border-blue-200 rounded-2xl space-y-3 mt-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-[#0066FF]" />
                    <span className="font-bold text-xs text-slate-900">
                      QRIS Resmi Bank Mitra ({brandName})
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                    Bebas Biaya Admin
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                  {paymentSettings?.qris_image_url ? (
                    <div className="relative group text-center shrink-0">
                      <img
                        src={paymentSettings.qris_image_url}
                        alt="QRIS Resmi Bank Mitra"
                        className="w-36 h-36 object-contain rounded-xl border border-slate-100 p-1.5 bg-white shadow-inner"
                      />
                      <a
                        href={paymentSettings.qris_image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download="QRIS-Resmi-Jaya-Cell.png"
                        className="mt-1.5 text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>Unduh QR</span>
                      </a>
                    </div>
                  ) : (
                    <div className="w-36 h-36 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-3 text-center shrink-0">
                      <QrCode className="w-10 h-10 text-slate-400 mb-1" />
                      <span className="text-[11px] font-bold text-slate-700">QRIS Bank Mitra</span>
                      <span className="text-[9px] text-slate-400">Siap discan saat konfirmasi</span>
                    </div>
                  )}

                  <div className="flex-1 space-y-2 text-xs">
                    <p className="font-semibold text-slate-700 leading-snug">
                      Scan QRIS langsung dari aplikasi mobile banking atau dompet digital Anda:
                    </p>
                    <div className="flex flex-wrap gap-1.5 text-[10px] font-bold text-slate-600">
                      <span className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200">BCA Mobile</span>
                      <span className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200">Livin' Mandiri</span>
                      <span className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200">BRImo</span>
                      <span className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200">GoPay</span>
                      <span className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200">OVO</span>
                      <span className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200">Dana</span>
                    </div>
                    <div className="p-2 bg-blue-50/60 rounded-lg border border-blue-100 text-[11px] text-slate-600">
                      Total bayar: <strong className="text-blue-600 font-extrabold">{formatRupiah(total)}</strong>. Konfirmasi instan!
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bank Transfer Details Box */}
            {paymentMethod === 'bank_va' && (
              <div className="p-4 bg-slate-50 border border-blue-200 rounded-2xl space-y-3 mt-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#0066FF]" />
                    <span className="font-bold text-xs text-slate-900">
                      Rekening Transfer Resmi Toko
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Terverifikasi
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2.5 text-xs shadow-sm">
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="font-medium">Bank:</span>
                    <span className="font-bold text-slate-900">
                      {paymentSettings?.bank_name || 'BCA (Bank Central Asia)'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-slate-600">
                    <span className="font-medium">Nomor Rekening:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-sm text-[#0066FF]">
                        {paymentSettings?.bank_account_number || '8830-1234-5678'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (typeof navigator !== 'undefined') {
                            navigator.clipboard.writeText(
                              paymentSettings?.bank_account_number || '8830-1234-5678'
                            );
                            setCopiedAccount(true);
                            setTimeout(() => setCopiedAccount(false), 2000);
                          }
                        }}
                        className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 transition flex items-center gap-1 text-[11px] font-bold"
                        title="Salin Nomor Rekening"
                      >
                        {copiedAccount ? (
                          <span className="text-emerald-600 flex items-center gap-0.5">
                            <Check className="w-3.5 h-3.5" /> Tersalin
                          </span>
                        ) : (
                          <span className="text-blue-600 flex items-center gap-0.5">
                            <Copy className="w-3.5 h-3.5" /> Salin
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-slate-600">
                    <span className="font-medium">Atas Nama:</span>
                    <span className="font-semibold text-slate-800">
                      {paymentSettings?.bank_account_holder || 'JAYA CELL INDONESIA'}
                    </span>
                  </div>

                  {paymentSettings?.payment_instructions && (
                    <p className="text-[11px] text-slate-500 border-t border-slate-100 pt-2 mt-1">
                      {paymentSettings.payment_instructions}
                    </p>
                  )}
                </div>
              </div>
            )}
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

